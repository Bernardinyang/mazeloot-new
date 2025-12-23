import { toast } from '@/utils/toast'

export function useMediaRenameDeleteActions({
  // rename modal state
  showRenameMediaModal,
  mediaToRename,
  newMediaName,
  itemToDelete,
  openDeleteModal,
  closeDeleteModal,
  // data
  mediaItems,
  selectedMediaIds,
  // apis
  mediaApi,
  deleteMediaFn, // Optional: custom delete function (e.g., for selections)
  updateSetCounts,
  handleConfirmDeleteSet,
  description,
} = {}) {
  const handleRenameMedia = item => {
    mediaToRename.value = item
    newMediaName.value = item.title || item.id
    showRenameMediaModal.value = true
  }

  const handleCancelRenameMedia = () => {
    showRenameMediaModal.value = false
    mediaToRename.value = null
    newMediaName.value = ''
  }

  const handleConfirmRenameMedia = async () => {
    if (!mediaToRename.value || !newMediaName.value.trim()) return

    try {
      await mediaApi.updateMedia(mediaToRename.value.id, {
        title: newMediaName.value.trim(),
      })

      const index = mediaItems.value.findIndex(m => m.id === mediaToRename.value?.id)
      if (index !== -1) {
        mediaItems.value[index].title = newMediaName.value.trim()
      }

      showRenameMediaModal.value = false
      mediaToRename.value = null
      newMediaName.value = ''

      toast.success('Media renamed', {
        description,
      })
    } catch (error) {
      toast.error('Failed to rename media', {
        description,
      })
    }
  }

  const handleDeleteMedia = item => {
    if (!item) return
    openDeleteModal({ id: item.id })
  }

  const handleConfirmDeleteItem = async () => {
    if (!itemToDelete.value) return

    const item = itemToDelete.value

    if (item.collectionId || item.setId) {
      // It's a MediaItem
      try {
        // Use custom delete function if provided (for selections), otherwise use mediaApi
        if (deleteMediaFn) {
          await deleteMediaFn(item.id)
        } else {
          await mediaApi.deleteMedia(item.id)
        }

        // Remove from local array
        const index = mediaItems.value.findIndex(m => m.id === item.id)
        if (index !== -1) {
          mediaItems.value.splice(index, 1)
          await updateSetCounts()
        }
        // Remove from selection if selected
        selectedMediaIds.value.delete(item.id)
        closeDeleteModal()
        toast.success('Media deleted', {
          description,
        })
      } catch (error) {
        toast.error('Failed to delete media', {
          description,
        })
      }
    } else {
      // It's a MediaSet - call the existing handler
      await handleConfirmDeleteSet()
    }
  }

  return {
    handleRenameMedia,
    handleCancelRenameMedia,
    handleConfirmRenameMedia,
    handleDeleteMedia,
    handleConfirmDeleteItem,
  }
}
