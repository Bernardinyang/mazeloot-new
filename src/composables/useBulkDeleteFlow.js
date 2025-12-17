import { toast } from 'vue-sonner'

export function useBulkDeleteFlow({
  selectedMediaIds,
  showBulkDeleteModal,
  isBulkDeleteLoading,
  mediaApi,
  mediaItems,
  updateSetCounts,
  description,
} = {}) {
  const handleBulkDelete = () => {
    if (selectedMediaIds.value.size === 0) return
    showBulkDeleteModal.value = true
  }

  const handleConfirmBulkDelete = async () => {
    if (selectedMediaIds.value.size === 0) return

    const count = selectedMediaIds.value.size
    const idsToDelete = Array.from(selectedMediaIds.value)

    isBulkDeleteLoading.value = true
    try {
      for (const id of idsToDelete) {
        await mediaApi.deleteMedia(id)
        const index = mediaItems.value.findIndex(m => m.id === id)
        if (index !== -1) {
          mediaItems.value.splice(index, 1)
        }
      }
      await updateSetCounts()
      selectedMediaIds.value.clear()
      showBulkDeleteModal.value = false
      toast.success('Media deleted', {
        description,
      })
    } catch (error) {
      console.error('Failed to delete media:', error)
      toast.error('Failed to delete media', {
        description,
      })
    } finally {
      isBulkDeleteLoading.value = false
    }
  }

  return {
    handleBulkDelete,
    handleConfirmBulkDelete,
  }
}
