import { computed } from 'vue'

/**
 * Reusable composable for selection limit validation
 * Works with selection and set data to validate selection limits
 */
export function useSelectionLimits(selection, currentSet) {
  /**
   * Get the effective limit for a selection/set combination
   *
   * PRIORITY ORDER (highest to lowest):
   * 1. Set Limit - Most specific, applies only to the current set
   * 2. Selection Limit - General limit, applies to all sets in the selection
   * 3. Unlimited - No limit (null)
   *
   * Examples:
   * - Set limit = 5, Selection limit = 10 → Effective limit = 5 (set limit wins)
   * - Set limit = null, Selection limit = 10 → Effective limit = 10 (selection limit used)
   * - Set limit = null, Selection limit = null → Effective limit = null (unlimited)
   * - Set limit = 5, Selection limit = null → Effective limit = 5 (set limit used)
   */
  const getEffectiveLimit = computed(() => {
    if (!selection.value) return null

    // PRIORITY 1: Check set limit first (most specific)
    // Set limits override selection limits when both exist
    if (
      currentSet.value?.selectionLimit !== null &&
      currentSet.value?.selectionLimit !== undefined
    ) {
      return currentSet.value.selectionLimit
    }

    // PRIORITY 2: Check selection limit (general limit for all sets)
    // Only used if set doesn't have its own limit
    if (selection.value.selectionLimit !== null && selection.value.selectionLimit !== undefined) {
      return selection.value.selectionLimit
    }

    // PRIORITY 3: No limit (unlimited selections allowed)
    return null
  })

  /**
   * Get current selected count for a set
   */
  const getCurrentSelectedCount = mediaItems => {
    if (!mediaItems || !currentSet.value) return 0
    return mediaItems.filter(item => item.setId === currentSet.value.id && item.isSelected).length
  }

  /**
   * Get remaining selections available
   */
  const getRemainingSelections = mediaItems => {
    const limit = getEffectiveLimit.value
    if (limit === null) return null // Unlimited

    const currentCount = getCurrentSelectedCount(mediaItems)
    return Math.max(0, limit - currentCount)
  }

  /**
   * Check if more selections can be made
   */
  const canSelectMore = mediaItems => {
    const limit = getEffectiveLimit.value
    if (limit === null) return true // Unlimited

    const currentCount = getCurrentSelectedCount(mediaItems)
    return currentCount < limit
  }

  /**
   * Check if selection is at limit
   */
  const isAtLimit = mediaItems => {
    const limit = getEffectiveLimit.value
    if (limit === null) return false // Unlimited

    const currentCount = getCurrentSelectedCount(mediaItems)
    return currentCount >= limit
  }

  /**
   * Get total selected count across all sets
   */
  const getTotalSelectedCount = mediaItems => {
    if (!mediaItems) return 0
    return mediaItems.filter(item => item.isSelected).length
  }

  return {
    getEffectiveLimit,
    getCurrentSelectedCount,
    getRemainingSelections,
    canSelectMore,
    isAtLimit,
    getTotalSelectedCount,
  }
}
