import { computed } from 'vue'
import { toast } from '@/utils/toast'
import { useActionHistoryStore } from '@/stores/actionHistory'
import { apiClient } from '@/api/client'

/**
 * Comprehensive media actions composable for selections, collections, and proofing
 * 
 * @param {Object} options
 * @param {string} options.contextType - 'selection' | 'collection' | 'proofing'
 * @param {Object} options.api - API object (selectionsApi, collectionsApi, or proofingApi)
 * @param {Object} options.context - The context object (selection, collection, or proofing)
 * @param {import('vue').Ref<string>} options.contextId - Computed ref for context ID
 * @param {import('vue').Ref<string>} options.setId - Ref for selected set ID
 * @param {import('vue').Ref<Array>} options.mediaItems - Ref for media items array
 * @param {import('vue').Ref<Set>} options.selectedMediaIds - Ref for selected media IDs set
 * @param {import('vue').ComputedRef<Array>} options.sortedMediaItems - Computed ref for sorted media items
 * @param {Function} options.loadMediaItems - Function to reload media items
 * @param {Function} options.loadMediaSets - Function to reload media sets
 * @param {Function} options.loadPhaseDetail - Optional function to reload phase detail (for updating storage)
 * @param {Function} options.getItemId - Helper to get item ID
 * @param {Object} options.modals - Modal state refs
 * @param {Object} options.loading - Loading state refs
 * @param {Object} options.helpers - Helper functions and refs
 */
export function useMediaActions({
  contextType, // 'selection' | 'collection' | 'proofing'
  api,
  context, // selection, collection, or proofing ref
  contextId, // computed(() => context.value?.id)
  setId, // selectedSetId ref
  mediaItems,
  selectedMediaIds,
  sortedMediaItems,
  loadMediaItems,
  loadMediaSets,
  loadPhaseDetail,
  getItemId,
  modals = {},
  loading = {},
  helpers = {},
} = {}) {
  const actionHistory = useActionHistoryStore()

  // Helper to get undo action button for toasts
  const getUndoAction = () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const undoShortcut = isMac ? '⌘Z' : 'Ctrl+Z'

    return {
      label: `Undo ${undoShortcut}`,
      onClick: async () => {
        if (actionHistory.canUndo) {
          const description = actionHistory.lastActionDescription
          await actionHistory.undo()
          toast.success('Undone', {
            description: description ? `Reverted: ${description}` : 'Action has been undone',
          })
        }
      },
    }
  }

  // ==================== Delete Actions ====================

  const handleDeleteMedia = item => {
    if (modals.openDeleteModal) {
      modals.openDeleteModal(item)
    }
  }

  const handleConfirmDeleteItem = async () => {
    if (!modals.itemToDelete?.value || loading.isDeleting?.value) return

    const item = modals.itemToDelete.value

    if (item.collectionId || item.setId || item.id) {
      // It's a MediaItem
      if (loading.isDeleting) loading.isDeleting.value = true

      try {
        const itemData = { ...item }

        // Delete via API
        if (contextType === 'proofing') {
          await api.deleteMedia(
            contextId.value,
            setId.value,
            item.id,
            helpers.projectId?.value
          )
        } else {
          await api.deleteMedia(contextId.value, setId.value, item.id)
        }

        // Remove from selection if selected
        selectedMediaIds.value.delete(item.id)

        // Reload media items to get fresh data from backend
        if (loadMediaItems) {
          await loadMediaItems()
        }

        // Reload media sets to update counts
        if (loadMediaSets) {
          await loadMediaSets()
        }

        // Reload phase detail to update storage
        if (loadPhaseDetail) {
          await loadPhaseDetail()
        }

        // Add to action history for undo
        actionHistory.addAction({
          type: 'delete',
          description: `Deleted "${itemData.file?.filename || itemData.filename || 'media'}"`,
          undo: async () => {
            toast.info('Undo not available', {
              description: 'Deleted items cannot be restored. Please re-upload if needed.',
            })
          },
          redo: async () => {
            try {
              if (contextType === 'proofing') {
                await api.deleteMedia(
                  contextId.value,
                  setId.value,
                  item.id,
                  helpers.projectId?.value
                )
              } else {
                await api.deleteMedia(contextId.value, setId.value, item.id)
              }
              selectedMediaIds.value.delete(item.id)
              if (loadMediaItems) {
                await loadMediaItems()
              }
              if (loadMediaSets) {
                await loadMediaSets()
              }
            } catch (error) {}
          },
        })

        toast.success('Media deleted', {
          description: 'The media item has been deleted successfully. You can undo this action.',
          action: getUndoAction(),
          duration: 5000,
        })

        if (modals.closeDeleteModal) {
          modals.closeDeleteModal()
        }
      } catch (error) {
        toast.error('Failed to delete media', {
          description:
            error instanceof Error ? error.message : 'An error occurred while deleting the media.',
        })
      } finally {
        if (loading.isDeleting) loading.isDeleting.value = false
      }
    } else {
      // It's a MediaSet - this should be handled elsewhere
      if (modals.closeDeleteModal) {
        modals.closeDeleteModal()
      }
    }
  }

  const handleBulkDelete = () => {
    if (selectedMediaIds.value.size === 0) {
      return
    }
    if (modals.showBulkDeleteModal) {
      modals.showBulkDeleteModal.value = true
    }
  }

  const handleConfirmBulkDelete = async () => {
    if (
      selectedMediaIds.value.size === 0 ||
      !contextId.value ||
      !setId.value ||
      loading.isBulkDeleteLoading?.value
    ) {
      if (modals.showBulkDeleteModal) {
        modals.showBulkDeleteModal.value = false
      }
      return
    }

    const idsToDelete = Array.from(selectedMediaIds.value)
    const count = idsToDelete.length
    const deletedItems = []

    if (loading.isBulkDeleteLoading) loading.isBulkDeleteLoading.value = true

    try {
      let successCount = 0
      let errorCount = 0

      for (const mediaId of idsToDelete) {
        try {
          const item = mediaItems.value.find(m => m.id === mediaId)
          if (!item) continue

          // Delete via API
          if (contextType === 'proofing') {
            await api.deleteMedia(contextId.value, setId.value, mediaId, helpers.projectId?.value)
          } else {
            await api.deleteMedia(contextId.value, setId.value, mediaId)
          }

          // Store item data for undo
          deletedItems.push({
            ...item,
            originalIndex: mediaItems.value.findIndex(m => m.id === mediaId),
          })

          // Remove from selection
          selectedMediaIds.value.delete(mediaId)
          successCount++
        } catch (error) {
          errorCount++
        }
      }

      // Reload media items to get fresh data from backend
      if (loadMediaItems) {
        await loadMediaItems()
      }

      // Reload media sets to update counts
      if (loadMediaSets) {
        await loadMediaSets()
      }

      // Reload phase detail to update storage
      if (loadPhaseDetail) {
        await loadPhaseDetail()
      }

      // Add to action history for undo
      if (successCount > 0 && deletedItems.length > 0) {
        actionHistory.addAction({
          type: 'bulk-delete',
          description: `Deleted ${successCount} item${successCount > 1 ? 's' : ''}`,
          undo: async () => {
            toast.info('Undo not available', {
              description: 'Deleted items cannot be restored. Please re-upload if needed.',
            })
          },
          redo: async () => {
            for (const item of deletedItems) {
              try {
                if (contextType === 'proofing') {
                  await api.deleteMedia(
                    contextId.value,
                    setId.value,
                    item.id,
                    helpers.projectId?.value
                  )
                } else {
                  await api.deleteMedia(contextId.value, setId.value, item.id)
                }
                selectedMediaIds.value.delete(item.id)
              } catch (error) {}
            }
            if (loadMediaItems) {
              await loadMediaItems()
            }
            if (loadMediaSets) {
              await loadMediaSets()
            }
          },
        })
      }

      // Show appropriate toast based on results
      if (errorCount === 0) {
        toast.success('Media deleted', {
          description: `${successCount} item${successCount > 1 ? 's' : ''} deleted successfully.`,
          action: getUndoAction(),
        })
      } else if (successCount > 0) {
        toast.warning('Partial deletion', {
          description: `${successCount} item${successCount > 1 ? 's' : ''} deleted, ${errorCount} failed.`,
        })
      } else {
        toast.error('Failed to delete media', {
          description: `Failed to delete ${errorCount} item${errorCount > 1 ? 's' : ''}.`,
        })
      }

      if (modals.showBulkDeleteModal) {
        modals.showBulkDeleteModal.value = false
      }
    } catch (error) {
      toast.error('Failed to delete media', {
        description:
          error instanceof Error ? error.message : 'An error occurred while deleting media.',
      })
    } finally {
      if (loading.isBulkDeleteLoading) loading.isBulkDeleteLoading.value = false
    }
  }

  // ==================== Rename Actions ====================

  const handleRenameMedia = item => {
    if (!modals.mediaToRename || !modals.newMediaName || !modals.showRenameMediaModal) return

    modals.mediaToRename.value = item
    const fullFilename = item.file?.filename || item.filename || item.title || item.name || ''
    const extension = fullFilename ? fullFilename.split('.').pop() : ''
    const hasExtension = fullFilename.includes('.') && extension && extension.length < 10
    modals.newMediaName.value = hasExtension
      ? fullFilename.substring(0, fullFilename.lastIndexOf('.'))
      : fullFilename
    modals.showRenameMediaModal.value = true
  }

  const handleCancelRenameMedia = () => {
    if (modals.showRenameMediaModal) modals.showRenameMediaModal.value = false
    if (modals.mediaToRename) modals.mediaToRename.value = null
    if (modals.newMediaName) modals.newMediaName.value = ''
  }

  const handleConfirmRenameMedia = async () => {
    if (
      !modals.mediaToRename?.value ||
      !modals.newMediaName?.value?.trim() ||
      !contextId.value ||
      !setId.value ||
      loading.isRenamingMedia?.value
    ) {
      return
    }

    const trimmedName = modals.newMediaName.value.trim()
    const originalFilename =
      modals.mediaToRename.value.file?.filename || modals.mediaToRename.value.filename || ''

    const originalExtension = originalFilename.includes('.')
      ? originalFilename.substring(originalFilename.lastIndexOf('.'))
      : ''

    let finalFilename = trimmedName
    if (trimmedName.includes('.')) {
      const userExtension = trimmedName.substring(trimmedName.lastIndexOf('.'))
      if (userExtension.length < 10) {
        finalFilename = trimmedName.substring(0, trimmedName.lastIndexOf('.'))
      }
    }

    if (originalExtension) {
      finalFilename = finalFilename + originalExtension
    }

    if (finalFilename === originalFilename) {
      handleCancelRenameMedia()
      return
    }

    if (loading.isRenamingMedia) loading.isRenamingMedia.value = true

    try {
      let result
      if (contextType === 'proofing') {
        result = await api.renameMedia(
          contextId.value,
          setId.value,
          modals.mediaToRename.value.id,
          finalFilename,
          helpers.projectId?.value
        )
      } else {
        result = await api.renameMedia(
          contextId.value,
          setId.value,
          modals.mediaToRename.value.id,
          finalFilename
        )
      }

      const updatedFilename = result?.data?.filename || result?.filename || finalFilename
      const index = mediaItems.value.findIndex(m => m.id === modals.mediaToRename.value?.id)
      if (index !== -1) {
        if (mediaItems.value[index].file) {
          mediaItems.value[index].file.filename = updatedFilename
        } else {
          mediaItems.value[index].file = { filename: updatedFilename }
        }
        mediaItems.value[index].filename = updatedFilename
        mediaItems.value = [...mediaItems.value]
      }

      // Add to action history for undo
      actionHistory.addAction({
        type: 'rename',
        description: `Renamed "${originalFilename}" to "${updatedFilename}"`,
        undo: async () => {
          try {
            let undoResult
            if (contextType === 'proofing') {
              undoResult = await api.renameMedia(
                contextId.value,
                setId.value,
                modals.mediaToRename.value.id,
                originalFilename,
                helpers.projectId?.value
              )
            } else {
              undoResult = await api.renameMedia(
                contextId.value,
                setId.value,
                modals.mediaToRename.value.id,
                originalFilename
              )
            }
            const index = mediaItems.value.findIndex(m => m.id === modals.mediaToRename.value?.id)
            if (index !== -1) {
              if (mediaItems.value[index].file) {
                mediaItems.value[index].file.filename = originalFilename
              } else {
                mediaItems.value[index].file = { filename: originalFilename }
              }
              mediaItems.value[index].filename = originalFilename
              mediaItems.value = [...mediaItems.value]
            }
          } catch (error) {}
        },
        redo: async () => {
          try {
            let redoResult
            if (contextType === 'proofing') {
              redoResult = await api.renameMedia(
                contextId.value,
                setId.value,
                modals.mediaToRename.value.id,
                updatedFilename,
                helpers.projectId?.value
              )
            } else {
              redoResult = await api.renameMedia(
                contextId.value,
                setId.value,
                modals.mediaToRename.value.id,
                updatedFilename
              )
            }
            const index = mediaItems.value.findIndex(m => m.id === modals.mediaToRename.value?.id)
            if (index !== -1) {
              if (mediaItems.value[index].file) {
                mediaItems.value[index].file.filename = updatedFilename
              } else {
                mediaItems.value[index].file = { filename: updatedFilename }
              }
              mediaItems.value[index].filename = updatedFilename
              mediaItems.value = [...mediaItems.value]
            }
          } catch (error) {}
        },
      })

      toast.success('Media renamed', {
        description: 'The filename has been updated successfully. You can undo this action.',
        action: getUndoAction(),
        duration: 5000,
      })

      handleCancelRenameMedia()
    } catch (error) {
      toast.error('Failed to rename media', {
        description:
          error instanceof Error ? error.message : 'An error occurred while renaming the media.',
      })
    } finally {
      if (loading.isRenamingMedia) loading.isRenamingMedia.value = false
    }
  }

  // ==================== Star/Favorite Actions ====================

  const handleStarMedia = async item => {
    if (!item?.id || !contextId.value || !setId.value) {
      return
    }

    try {
      const oldStarredStatus = item.isStarred
      let result
      if (contextType === 'proofing') {
        result = await api.starMedia(
          contextId.value,
          setId.value,
          item.id,
          helpers.projectId?.value
        )
      } else {
        result = await api.starMedia(contextId.value, setId.value, item.id)
      }

      const newStarredStatus = result?.data?.starred ?? result?.starred ?? false

      const mediaItem = mediaItems.value.find(m => m.id === item.id)
      if (mediaItem) {
        mediaItem.isStarred = newStarredStatus
      }

      if (helpers.selectedMediaForView) {
        const viewItem = helpers.selectedMediaForView.value.find(m => m.id === item.id)
        if (viewItem) {
          viewItem.isStarred = newStarredStatus
        }
      }

      if (item) {
        item.isStarred = newStarredStatus
      }

      // Add to action history for undo
      if (oldStarredStatus !== newStarredStatus) {
        actionHistory.addAction({
          type: 'star',
          description: `${newStarredStatus ? 'Starred' : 'Unstarred'} "${item.file?.filename || item.filename || 'media'}"`,
          undo: async () => {
            try {
              let undoResult
              if (contextType === 'proofing') {
                undoResult = await api.starMedia(
                  contextId.value,
                  setId.value,
                  item.id,
                  helpers.projectId?.value
                )
              } else {
                undoResult = await api.starMedia(contextId.value, setId.value, item.id)
              }
              const mediaItem = mediaItems.value.find(m => m.id === item.id)
              if (mediaItem) {
                mediaItem.isStarred = oldStarredStatus
              }
              if (item) {
                item.isStarred = oldStarredStatus
              }
            } catch (error) {}
          },
          redo: async () => {
            try {
              let redoResult
              if (contextType === 'proofing') {
                redoResult = await api.starMedia(
                  contextId.value,
                  setId.value,
                  item.id,
                  helpers.projectId?.value
                )
              } else {
                redoResult = await api.starMedia(contextId.value, setId.value, item.id)
              }
              const mediaItem = mediaItems.value.find(m => m.id === item.id)
              if (mediaItem) {
                mediaItem.isStarred = newStarredStatus
              }
              if (item) {
                item.isStarred = newStarredStatus
              }
            } catch (error) {}
          },
        })
      }
    } catch (error) {
      toast.error('Failed to star media', {
        description:
          error instanceof Error ? error.message : 'An error occurred while starring the media.',
      })
    }
  }

  const handleBulkFavorite = async () => {
    if (selectedMediaIds.value.size === 0 || !contextId.value || !setId.value) {
      return
    }

    const ids = Array.from(selectedMediaIds.value)
    const items = mediaItems.value.filter(m => ids.includes(m.id))

    const allStarred = items.every(item => item.isStarred)
    const targetStarred = !allStarred
    const starOperations = []

    if (loading.isBulkFavoriteLoading) loading.isBulkFavoriteLoading.value = true

    try {
      let successCount = 0
      let errorCount = 0

      for (const item of items) {
        try {
          if (item.isStarred !== targetStarred) {
            const oldStarredStatus = item.isStarred
            let result
            if (contextType === 'proofing') {
              result = await api.starMedia(
                contextId.value,
                setId.value,
                item.id,
                helpers.projectId?.value
              )
            } else {
              result = await api.starMedia(contextId.value, setId.value, item.id)
            }
            const newStarredStatus = result?.data?.starred ?? result?.starred ?? false

            starOperations.push({
              itemId: item.id,
              oldStarred: oldStarredStatus,
              newStarred: newStarredStatus,
            })

            const mediaItem = mediaItems.value.find(m => m.id === item.id)
            if (mediaItem) {
              mediaItem.isStarred = newStarredStatus
            }

            if (newStarredStatus === targetStarred) {
              successCount++
            }
          } else {
            successCount++
          }
        } catch (error) {
          errorCount++
        }
      }

      // Add to action history for undo
      if (successCount > 0 && starOperations.length > 0) {
        actionHistory.addAction({
          type: 'bulk-star',
          description: `${targetStarred ? 'Starred' : 'Unstarred'} ${successCount} item${successCount > 1 ? 's' : ''}`,
          undo: async () => {
            for (const op of starOperations) {
              try {
                if (op.newStarred !== op.oldStarred) {
                  let result
                  if (contextType === 'proofing') {
                    result = await api.starMedia(
                      contextId.value,
                      setId.value,
                      op.itemId,
                      helpers.projectId?.value
                    )
                  } else {
                    result = await api.starMedia(contextId.value, setId.value, op.itemId)
                  }
                  const mediaItem = mediaItems.value.find(m => m.id === op.itemId)
                  if (mediaItem) {
                    mediaItem.isStarred = op.oldStarred
                  }
                }
              } catch (error) {}
            }
          },
          redo: async () => {
            for (const op of starOperations) {
              try {
                if (op.newStarred !== op.oldStarred) {
                  let result
                  if (contextType === 'proofing') {
                    result = await api.starMedia(
                      contextId.value,
                      setId.value,
                      op.itemId,
                      helpers.projectId?.value
                    )
                  } else {
                    result = await api.starMedia(contextId.value, setId.value, op.itemId)
                  }
                  const mediaItem = mediaItems.value.find(m => m.id === op.itemId)
                  if (mediaItem) {
                    mediaItem.isStarred = op.newStarred
                  }
                }
              } catch (error) {}
            }
          },
        })
      }

      if (errorCount === 0) {
        toast.success(targetStarred ? 'Media starred' : 'Media unstarred', {
          description: `${successCount} item${successCount > 1 ? 's' : ''} ${targetStarred ? 'starred' : 'unstarred'} successfully. You can undo this action.`,
          action: getUndoAction(),
          duration: 5000,
        })
      } else if (successCount > 0) {
        toast.warning('Partial success', {
          description: `${successCount} item${successCount > 1 ? 's' : ''} updated, ${errorCount} failed.`,
        })
      } else {
        toast.error('Failed to update media', {
          description: `Failed to ${targetStarred ? 'star' : 'unstar'} ${errorCount} item${errorCount > 1 ? 's' : ''}.`,
        })
      }
    } catch (error) {
      toast.error('Failed to update media', {
        description:
          error instanceof Error ? error.message : 'An error occurred while updating media.',
      })
    } finally {
      if (loading.isBulkFavoriteLoading) loading.isBulkFavoriteLoading.value = false
    }
  }

  // ==================== Download Actions ====================

  const handleDownloadMedia = async item => {
    if (!item?.id) {
      toast.error('Media not found', {
        description: 'Unable to download media. Please try again.',
      })
      return
    }

    try {
      toast.loading('Preparing download...', {
        id: 'download-media',
      })

      const { blob, filename } = await api.downloadMedia(item.id)

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.dismiss('download-media')
      toast.success('Download started', {
        description: `Downloading ${filename}`,
      })
    } catch (error) {
      toast.dismiss('download-media')
      toast.error('Download failed', {
        description: error.message || 'Unable to download media. Please try again.',
      })
    }
  }

  // ==================== Copy Filename Actions ====================

  const handleCopyFilenames = async item => {
    try {
      const filename = item?.file?.filename || item?.filename || item?.title || 'untitled.jpg'
      await navigator.clipboard.writeText(filename)
      toast.success('Filename copied', {
        description: 'The filename has been copied to your clipboard.',
      })
    } catch (error) {
      toast.error('Failed to copy', {
        description: error instanceof Error ? error.message : 'Could not copy to clipboard',
      })
    }
  }

  const handleBulkCopyFilenames = async () => {
    if (selectedMediaIds.value.size === 0) {
      toast.info('No items selected', {
        description: 'Please select some media items to copy filenames.',
      })
      return
    }

    try {
      const selectedItems = sortedMediaItems.value.filter(item =>
        selectedMediaIds.value.has(getItemId ? getItemId(item) : item.id)
      )

      const filenames = selectedItems.map(item => {
        return item?.file?.filename || item?.filename || item?.title || 'untitled.jpg'
      })

      const filenamesText = filenames.join(', ')

      await navigator.clipboard.writeText(filenamesText)

      toast.success('Filenames copied', {
        description: `${filenames.length} filename(s) copied to clipboard.`,
      })
    } catch (error) {
      toast.error('Failed to copy filenames', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  }

  // ==================== Bulk View Action ====================

  const handleBulkView = () => {
    if (selectedMediaIds.value.size === 0) {
      toast.info('No items selected', {
        description: 'Please select some media items to view.',
      })
      return
    }

    const ids = Array.from(selectedMediaIds.value)
    const items = mediaItems.value.filter(m => ids.includes(m.id))
    const imageItems = items.filter(item => {
      const itemType = item.type || item.file?.type
      return itemType === 'image'
    })

    if (imageItems.length === 0) {
      toast.info('No images to view', {
        description:
          'The selected items do not contain any images. Only images can be viewed in the lightbox.',
      })
      return
    }

    if (helpers.selectedMediaForView) {
      helpers.selectedMediaForView.value = imageItems
    }
    if (helpers.currentViewIndex) {
      helpers.currentViewIndex.value = 0
    }
    if (modals.showMediaViewer) {
      modals.showMediaViewer.value = true
    }
  }

  // ==================== Bulk Edit Actions ====================

  const handleBulkEdit = () => {
    if (selectedMediaIds.value.size === 0) {
      return
    }
    if (modals.editAppendText) modals.editAppendText.value = ''
    if (modals.showEditModal) modals.showEditModal.value = true
  }

  const handleCancelEdit = () => {
    if (modals.showEditModal) modals.showEditModal.value = false
    if (modals.editAppendText) modals.editAppendText.value = ''
  }

  const handleConfirmEdit = async () => {
    if (
      selectedMediaIds.value.size === 0 ||
      !modals.editAppendText?.value?.trim() ||
      !contextId.value ||
      !setId.value ||
      loading.isBulkEditLoading?.value
    ) {
      return
    }

    const ids = Array.from(selectedMediaIds.value)
    const appendText = modals.editAppendText.value.trim()
    const items = mediaItems.value.filter(m => ids.includes(m.id))
    const renameOperations = []

    if (loading.isBulkEditLoading) loading.isBulkEditLoading.value = true

    try {
      let successCount = 0
      let errorCount = 0

      for (const item of items) {
        try {
          const currentFilename =
            item.file?.filename || item.filename || item.title || `media-${item.id}`

          const lastDotIndex = currentFilename.lastIndexOf('.')
          let nameWithoutExt = currentFilename
          let extension = ''

          if (lastDotIndex > 0) {
            nameWithoutExt = currentFilename.substring(0, lastDotIndex)
            extension = currentFilename.substring(lastDotIndex)
          }

          const newFilename = nameWithoutExt + appendText + extension

          // Call rename API
          let result
          if (contextType === 'proofing') {
            result = await api.renameMedia(
              contextId.value,
              setId.value,
              item.id,
              newFilename,
              helpers.projectId?.value
            )
          } else {
            result = await api.renameMedia(contextId.value, setId.value, item.id, newFilename)
          }

          renameOperations.push({
            itemId: item.id,
            oldFilename: currentFilename,
            newFilename,
          })

          const mediaItem = mediaItems.value.find(m => m.id === item.id)
          if (mediaItem) {
            if (mediaItem.file) {
              mediaItem.file.filename = newFilename
            } else {
              mediaItem.filename = newFilename
            }
          }

          successCount++
        } catch (error) {
          errorCount++
        }
      }

      // Add to action history for undo
      if (successCount > 0 && renameOperations.length > 0) {
        actionHistory.addAction({
          type: 'bulk-rename',
          description: `Renamed ${successCount} item${successCount > 1 ? 's' : ''} (append: "${appendText}")`,
          undo: async () => {
            for (const op of renameOperations) {
              try {
                if (contextType === 'proofing') {
                  await api.renameMedia(
                    contextId.value,
                    setId.value,
                    op.itemId,
                    op.oldFilename,
                    helpers.projectId?.value
                  )
                } else {
                  await api.renameMedia(contextId.value, setId.value, op.itemId, op.oldFilename)
                }
                const mediaItem = mediaItems.value.find(m => m.id === op.itemId)
                if (mediaItem) {
                  if (mediaItem.file) {
                    mediaItem.file.filename = op.oldFilename
                  } else {
                    mediaItem.filename = op.oldFilename
                  }
                }
              } catch (error) {}
            }
          },
          redo: async () => {
            for (const op of renameOperations) {
              try {
                if (contextType === 'proofing') {
                  await api.renameMedia(
                    contextId.value,
                    setId.value,
                    op.itemId,
                    op.newFilename,
                    helpers.projectId?.value
                  )
                } else {
                  await api.renameMedia(contextId.value, setId.value, op.itemId, op.newFilename)
                }
                const mediaItem = mediaItems.value.find(m => m.id === op.itemId)
                if (mediaItem) {
                  if (mediaItem.file) {
                    mediaItem.file.filename = op.newFilename
                  } else {
                    mediaItem.filename = op.newFilename
                  }
                }
              } catch (error) {}
            }
          },
        })
      }

      // Show appropriate toast based on results
      if (errorCount === 0) {
        toast.success('Filenames updated', {
          description: `${successCount} item${successCount > 1 ? 's' : ''} updated successfully. You can undo this action.`,
          action: getUndoAction(),
          duration: 5000,
        })
      } else if (successCount > 0) {
        toast.warning('Partial update', {
          description: `${successCount} item${successCount > 1 ? 's' : ''} updated, ${errorCount} failed.`,
        })
      } else {
        toast.error('Failed to update filenames', {
          description: `Failed to update ${errorCount} item${errorCount > 1 ? 's' : ''}.`,
        })
      }

      if (modals.showEditModal) modals.showEditModal.value = false
      if (modals.editAppendText) modals.editAppendText.value = ''
    } catch (error) {
      toast.error('Failed to update filenames', {
        description:
          error instanceof Error ? error.message : 'An error occurred while updating filenames.',
      })
    } finally {
      if (loading.isBulkEditLoading) loading.isBulkEditLoading.value = false
    }
  }

  // ==================== Replace Photo Actions ====================

  const handleReplacePhoto = item => {
    if (modals.mediaToReplace) modals.mediaToReplace.value = item
    if (modals.showReplacePhotoModal) modals.showReplacePhotoModal.value = true
  }

  const handleCancelReplacePhoto = () => {
    if (modals.showReplacePhotoModal) modals.showReplacePhotoModal.value = false
    if (modals.mediaToReplace) modals.mediaToReplace.value = null
  }

  const handleReplacePhotoFileSelect = async event => {
    const input = event.target
    const files = input.files
    if (!files || files.length === 0 || !modals.mediaToReplace?.value) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select an image file.',
      })
      return
    }

    if (!contextId.value || !setId.value) {
      toast.error('Invalid context', {
        description: 'Context or set not found.',
      })
      return
    }

    if (loading.isReplacingPhoto) loading.isReplacingPhoto.value = true

    try {
      const isImage = file.type.startsWith('image/')
      const uploadEndpoint = isImage ? '/v1/images/upload' : '/v1/uploads'

      const uploadResponse = await apiClient.upload(uploadEndpoint, file, {
        purpose: 'memora-media',
      })

      const userFileUuid =
        uploadResponse.data?.userFileUuid || uploadResponse.data?.data?.userFileUuid

      if (!userFileUuid) {
        throw new Error('Upload response missing userFileUuid')
      }

      // Replace the media with the new file
      let result
      if (contextType === 'proofing') {
        result = await api.replaceMedia(
          contextId.value,
          setId.value,
          modals.mediaToReplace.value.id,
          userFileUuid,
          helpers.projectId?.value
        )
      } else {
        result = await api.replaceMedia(
          contextId.value,
          setId.value,
          modals.mediaToReplace.value.id,
          userFileUuid
        )
      }

      const index = mediaItems.value.findIndex(m => m.id === modals.mediaToReplace.value?.id)
      if (index !== -1) {
        const updatedMedia = result?.data || result
        if (updatedMedia) {
          mediaItems.value[index] = updatedMedia
          mediaItems.value = [...mediaItems.value]
        }
      }

      toast.success('Photo replaced', {
        description: 'The photo has been replaced successfully.',
      })

      if (modals.showReplacePhotoModal) modals.showReplacePhotoModal.value = false
      if (modals.mediaToReplace) modals.mediaToReplace.value = null
    } catch (error) {
      toast.error('Failed to replace photo', {
        description:
          error instanceof Error ? error.message : 'An error occurred while replacing the photo.',
      })
    } finally {
      if (loading.isReplacingPhoto) loading.isReplacingPhoto.value = false
    }
  }

  return {
    // Delete actions
    handleDeleteMedia,
    handleConfirmDeleteItem,
    handleBulkDelete,
    handleConfirmBulkDelete,

    // Rename actions
    handleRenameMedia,
    handleCancelRenameMedia,
    handleConfirmRenameMedia,

    // Star/Favorite actions
    handleStarMedia,
    handleBulkFavorite,

    // Download actions
    handleDownloadMedia,

    // Copy filename actions
    handleCopyFilenames,
    handleBulkCopyFilenames,

    // Bulk view action
    handleBulkView,

    // Bulk edit actions
    handleBulkEdit,
    handleCancelEdit,
    handleConfirmEdit,

    // Replace photo actions
    handleReplacePhoto,
    handleCancelReplacePhoto,
    handleReplacePhotoFileSelect,

    // Helper
    getUndoAction,
  }
}

