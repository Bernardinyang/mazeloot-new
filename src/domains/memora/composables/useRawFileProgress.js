import { computed } from 'vue'

/**
 * Reusable composable for calculating rawFile progress
 * Works with media items and sets to show rawFile counts
 */
export function useRawFileProgress(mediaItems, mediaSets) {
  /**
   * Get selected count for a specific set
   * @param {string} setId - Set ID
   * @returns {number} Count of selected items in the set
   */
  const getSelectedCountForSet = setId => {
    if (!mediaItems.value || !setId) return 0
    return mediaItems.value.filter(item => item.setId === setId && item.isSelected).length
  }

  /**
   * Get total count for a specific set
   * @param {string} setId - Set ID
   * @returns {number} Total count of items in the set
   */
  const getTotalCountForSet = setId => {
    if (!mediaItems.value || !setId) return 0
    return mediaItems.value.filter(item => item.setId === setId).length
  }

  /**
   * Get overall selected count across all sets
   */
  const overallSelectedCount = computed(() => {
    if (!mediaItems.value) return 0
    return mediaItems.value.filter(item => item.isSelected).length
  })

  /**
   * Get overall total count across all sets
   */
  const overallTotalCount = computed(() => {
    if (!mediaItems.value) return 0
    return mediaItems.value.length
  })

  /**
   * Get progress data for a specific set
   * @param {string} setId - Set ID
   * @returns {Object} { selected, total, percentage }
   */
  const getSetProgress = setId => {
    const selected = getSelectedCountForSet(setId)
    const total = getTotalCountForSet(setId)
    const percentage = total > 0 ? Math.round((selected / total) * 100) : 0

    return {
      selected,
      total,
      percentage,
    }
  }

  /**
   * Get overall progress data
   */
  const overallProgress = computed(() => {
    const selected = overallSelectedCount.value
    const total = overallTotalCount.value
    const percentage = total > 0 ? Math.round((selected / total) * 100) : 0

    return {
      selected,
      total,
      percentage,
    }
  })

  /**
   * Get progress data for all sets
   */
  const setsProgress = computed(() => {
    if (!mediaSets.value) return []

    return mediaSets.value.map(set => ({
      setId: set.id,
      setName: set.name,
      ...getSetProgress(set.id),
    }))
  })

  return {
    getSelectedCountForSet,
    getTotalCountForSet,
    getSetProgress,
    overallSelectedCount,
    overallTotalCount,
    overallProgress,
    setsProgress,
  }
}
