import { computed } from 'vue'

/**
 * Reusable composable for calculating proofing progress
 * Works with media items and sets to show approved/completed counts
 */
export function useProofingProgress(mediaItems, mediaSets) {
  /**
   * Get approved count for a specific set
   * @param {string} setId - Set ID
   * @returns {number} Count of approved items in the set
   */
  const getApprovedCountForSet = setId => {
    if (!mediaItems.value || !setId) return 0
    return mediaItems.value.filter(
      item => item.setId === setId && (item.isCompleted || item.isApproved)
    ).length
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
   * Get overall approved count across all sets
   */
  const overallApprovedCount = computed(() => {
    if (!mediaItems.value) return 0
    return mediaItems.value.filter(item => item.isCompleted || item.isApproved).length
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
   * @returns {Object} { approved, total, percentage }
   */
  const getSetProgress = setId => {
    const approved = getApprovedCountForSet(setId)
    const total = getTotalCountForSet(setId)
    const percentage = total > 0 ? Math.round((approved / total) * 100) : 0

    return {
      approved,
      total,
      percentage,
    }
  }

  /**
   * Get overall progress data
   */
  const overallProgress = computed(() => {
    const approved = overallApprovedCount.value
    const total = overallTotalCount.value
    const percentage = total > 0 ? Math.round((approved / total) * 100) : 0

    return {
      approved,
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
    getApprovedCountForSet,
    getTotalCountForSet,
    getSetProgress,
    overallApprovedCount,
    overallTotalCount,
    overallProgress,
    setsProgress,
  }
}
