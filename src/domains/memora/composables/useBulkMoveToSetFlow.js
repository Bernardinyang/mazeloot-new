import { toast } from '@/shared/utils/toast'

/**
 * Bulk "move selected media to set" flow extracted from Photos.vue.
 * Keeps behavior identical.
 */
export function useBulkMoveToSetFlow({
  selectedMediaIds,
  collection,
  isMovingMedia,
  mediaApi,
  loadMediaItems,
  updateSetCounts,
  description = '',
}) {
  const handleBulkMoveToSet = async targetSetId => {
    if (selectedMediaIds.value.size === 0 || !collection.value || !targetSetId) return

    const idsToMove = Array.from(selectedMediaIds.value)

    isMovingMedia.value = true
    try {
      for (const id of idsToMove) {
        await mediaApi.updateMedia(id, { setId: targetSetId })
      }

      // Reload media items to reflect changes
      await loadMediaItems()

      await updateSetCounts()

      selectedMediaIds.value.clear()

      toast.success('Media moved', {
        description,
      })
    } catch (error) {
      toast.error('Failed to move media', {
        description,
      })
    } finally {
      isMovingMedia.value = false
    }
  }

  return { handleBulkMoveToSet }
}
