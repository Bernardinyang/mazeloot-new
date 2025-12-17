import { watch } from 'vue'
import { toast } from 'vue-sonner'

export function useMoveCopyFlow({
  showMoveCopyModal,
  moveCopyAction,
  targetCollectionIdForMove,
  targetSetIdInCollection,
  targetCollectionSets,
  isLoadingTargetCollectionSets,
  isMovingMedia,
  selectedMediaIds,
  collection,
  mediaSets,
  mediaItems,
  selectedSetId,
  galleryStore,
  mediaApi,
  loadMediaItems,
  updateSetCounts,
  description,
} = {}) {
  const handleTargetCollectionChange = async collectionId => {
    if (!collectionId) {
      targetCollectionSets.value = []
      targetSetIdInCollection.value = ''
      return
    }

    isLoadingTargetCollectionSets.value = true
    try {
      // If it's the current collection, use local mediaSets
      if (collectionId === collection.value?.id) {
        targetCollectionSets.value = mediaSets.value.map(set => ({
          id: set.id,
          name: set.name,
          description: set.description,
          count: set.count,
          order: set.order,
        }))
      } else {
        // Fetch the target collection to get its sets
        const targetCollection = galleryStore.collections.find(c => c.id === collectionId)
        if (targetCollection && targetCollection.mediaSets) {
          targetCollectionSets.value = targetCollection.mediaSets.map(set => ({
            id: set.id,
            name: set.name,
            description: set.description,
            count: set.count,
            order: set.order,
          }))
        } else {
          targetCollectionSets.value = []
        }
      }
      // Reset set selection when collection changes
      targetSetIdInCollection.value = ''
    } catch (error) {
      console.error('Failed to load collection sets:', error)
      targetCollectionSets.value = []
    } finally {
      isLoadingTargetCollectionSets.value = false
    }
  }

  const handleCancelMoveCopy = () => {
    showMoveCopyModal.value = false
    targetCollectionIdForMove.value = collection.value?.id || ''
    targetSetIdInCollection.value = ''
    targetCollectionSets.value = []
    moveCopyAction.value = 'move'
  }

  const handleBulkMoveToCollection = async targetCollectionId => {
    if (selectedMediaIds.value.size === 0 || !collection.value || !targetCollectionId) return

    const idsToMove = Array.from(selectedMediaIds.value)

    isMovingMedia.value = true
    try {
      // Update media items' collectionId and setId via API
      for (const id of idsToMove) {
        await mediaApi.updateMedia(String(id), {
          collectionId: targetCollectionId,
          setId: targetSetIdInCollection.value || undefined,
        })
      }

      // If moving within same collection, just update the set
      if (targetCollectionId === collection.value.id) {
        await loadMediaItems()
      } else {
        // Remove moved items from current view if moving to different collection
        mediaItems.value = mediaItems.value.filter(m => !idsToMove.includes(m.id))
      }

      // Update set counts
      await updateSetCounts()

      selectedMediaIds.value.clear()
      handleCancelMoveCopy()

      toast.success('Media moved', {
        description,
      })
    } catch (error) {
      console.error('Failed to move media:', error)
      toast.error('Failed to move media', {
        description,
      })
    } finally {
      isMovingMedia.value = false
    }
  }

  const handleBulkCopyToCollection = async targetCollectionId => {
    if (selectedMediaIds.value.size === 0 || !collection.value || !targetCollectionId) return

    const idsToCopy = Array.from(selectedMediaIds.value)

    isMovingMedia.value = true
    try {
      const copiedItems = []

      // Copy media items by creating new ones in the target collection
      for (const id of idsToCopy) {
        const originalItem = mediaItems.value.find(m => m.id === id)
        if (originalItem) {
          try {
            const copiedItem = await mediaApi.addMedia(targetCollectionId, {
              url: originalItem.url,
              thumbnail: originalItem.thumbnail,
              type: originalItem.type,
              title: originalItem.title,
              description: originalItem.description,
              order: originalItem.order,
              setId: targetSetIdInCollection.value || undefined,
            })
            copiedItems.push(copiedItem)
          } catch (itemError) {
            // If quota exceeded, stop copying and show error
            if (
              itemError?.message?.includes('quota exceeded') ||
              itemError?.message?.includes('QuotaExceededError')
            ) {
              throw new Error(
                'Storage quota exceeded. Please delete some old media or reduce file sizes before copying.'
              )
            }
            throw itemError
          }
        }
      }

      // Update set counts for both source and target collections
      await updateSetCounts() // Update current collection
      if (targetCollectionId !== collection.value.id) {
        await updateSetCounts(targetCollectionId) // Update target collection
      }

      const targetSetId = targetSetIdInCollection.value
      // If copying within the same collection and to the same set, add to local view
      if (targetCollectionId === collection.value.id && targetSetId === selectedSetId.value) {
        // Add copied items to the current view
        copiedItems.forEach(item => {
          if (!mediaItems.value.find(m => m.id === item.id)) {
            mediaItems.value.push(item)
          }
        })
      } else if (targetCollectionId === collection.value.id) {
        // If copying to different set in same collection, reload to refresh counts
        await loadMediaItems()
      }

      selectedMediaIds.value.clear()
      handleCancelMoveCopy()

      toast.success('Media copied', {
        description,
      })
    } catch (error) {
      console.error('Failed to copy media:', error)
      const errorMessage = error?.message || 'An error occurred while copying the media items.'
      toast.error('Failed to copy media', {
        description: errorMessage,
      })
    } finally {
      isMovingMedia.value = false
    }
  }

  const handleConfirmMoveCopy = () => {
    if (targetCollectionIdForMove.value) {
      if (moveCopyAction.value === 'move') {
        handleBulkMoveToCollection(
          targetCollectionIdForMove.value,
          targetSetIdInCollection.value || undefined
        )
      } else {
        handleBulkCopyToCollection(
          targetCollectionIdForMove.value,
          targetSetIdInCollection.value || undefined
        )
      }
    }
  }

  // Initialize target collection to current collection when modal opens
  watch(showMoveCopyModal, isOpen => {
    if (isOpen && collection.value) {
      targetCollectionIdForMove.value = collection.value.id
      handleTargetCollectionChange(collection.value.id)
    } else if (!isOpen) {
      // Reset on close
      targetCollectionIdForMove.value = ''
      targetSetIdInCollection.value = ''
      targetCollectionSets.value = []
      moveCopyAction.value = 'move'
    }
  })

  return {
    handleTargetCollectionChange,
    handleCancelMoveCopy,
    handleConfirmMoveCopy,
    handleBulkMoveToCollection,
    handleBulkCopyToCollection,
  }
}
