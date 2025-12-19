import { toast } from '@/utils/toast'

export function useBulkEditFilenamesFlow({
  selectedMediaIds,
  showEditModal,
  editAppendText,
  isBulkEditLoading,
  mediaItems,
  mediaApi,
  loadMediaItems,
  description,
} = {}) {
  const handleBulkEdit = () => {
    if (selectedMediaIds.value.size === 0) return
    editAppendText.value = ''
    showEditModal.value = true
  }

  const handleCancelEdit = () => {
    showEditModal.value = false
    editAppendText.value = ''
  }

  const handleConfirmEdit = async () => {
    if (selectedMediaIds.value.size === 0 || !editAppendText.value.trim()) return

    const ids = Array.from(selectedMediaIds.value)
    const appendText = editAppendText.value.trim()

    isBulkEditLoading.value = true
    try {
      for (const id of ids) {
        const item = mediaItems.value.find(m => m.id === id)
        if (item) {
          // Get filename without extension for title
          const currentTitle = item.title || `media-${item.id}`
          const parts = currentTitle.split('.')
          const extension = parts.length > 1 ? '.' + parts.pop() : ''
          const nameWithoutExt = parts.join('.')
          const newTitle = nameWithoutExt + appendText + extension

          await mediaApi.updateMedia(String(id), {
            ...item,
            title: newTitle,
          })
        }
      }

      await loadMediaItems()
      showEditModal.value = false
      editAppendText.value = ''
      toast.success('Filenames updated', {
        description,
      })
    } catch (error) {
      console.error('Failed to update filenames:', error)
      toast.error('Failed to update filenames', {
        description,
      })
    } finally {
      isBulkEditLoading.value = false
    }
  }

  return {
    handleBulkEdit,
    handleCancelEdit,
    handleConfirmEdit,
  }
}
