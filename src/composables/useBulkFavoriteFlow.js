import { toast } from '@/utils/toast'

export function useBulkFavoriteFlow({
  selectedMediaIds,
  isBulkFavoriteLoading,
  mediaItems,
  mediaApi,
  loadMediaItems,
  description,
} = {}) {
  const handleBulkFavorite = async () => {
    if (selectedMediaIds.value.size === 0) return

    const ids = Array.from(selectedMediaIds.value)

    isBulkFavoriteLoading.value = true
    try {
      // Toggle favorite status for selected items
      for (const id of ids) {
        const item = mediaItems.value.find(m => m.id === id)
        if (item) {
          // For now, we'll use a custom property to track favorite status
          // In a real app, this would be stored in the backend
          const isFavorite = item.isFavorite || false
          await mediaApi.updateMedia(String(id), {
            ...item,
            isFavorite,
          })
        }
      }

      await loadMediaItems()
      toast.success('Favorite updated', {
        description,
      })
    } catch (error) {
      toast.error('Failed to update favorite', {
        description,
      })
    } finally {
      isBulkFavoriteLoading.value = false
    }
  }

  return {
    handleBulkFavorite,
  }
}
