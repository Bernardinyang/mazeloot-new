import { computed } from 'vue'

/**
 * Reusable composable for rawFile limit validation
 * Works with rawFile and set data to validate rawFile limits
 */
export function useRawFileLimits(rawFile, currentSet) {
  /**
   * Get the effective limit for a rawFile/set combination
   *
   * PRIORITY ORDER (highest to lowest):
   * 1. Set Limit - Most specific, applies only to the current set
   * 2. RawFile Limit - General limit, applies to all sets in the rawFile
   * 3. Unlimited - No limit (null)
   *
   * Examples:
   * - Set limit = 5, RawFile limit = 10 → Effective limit = 5 (set limit wins)
   * - Set limit = null, RawFile limit = 10 → Effective limit = 10 (rawFile limit used)
   * - Set limit = null, RawFile limit = null → Effective limit = null (unlimited)
   * - Set limit = 5, RawFile limit = null → Effective limit = 5 (set limit used)
   */
  const getEffectiveLimit = computed(() => {
    if (!rawFile.value) return null

    // PRIORITY 1: Check set limit first (most specific)
    // Set limits override rawFile limits when both exist
    if (
      currentSet.value?.rawFileLimit !== null &&
      currentSet.value?.rawFileLimit !== undefined
    ) {
      return currentSet.value.rawFileLimit
    }

    // PRIORITY 2: Check rawFile limit (general limit for all sets)
    // Only used if set doesn't have its own limit
    if (rawFile.value.rawFileLimit !== null && rawFile.value.rawFileLimit !== undefined) {
      return rawFile.value.rawFileLimit
    }

    // PRIORITY 3: No limit (unlimited rawFiles allowed)
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
   * Get remaining rawFiles available
   */
  const getRemainingRawFiles = mediaItems => {
    const limit = getEffectiveLimit.value
    if (limit === null) return null // Unlimited

    const currentCount = getCurrentSelectedCount(mediaItems)
    return Math.max(0, limit - currentCount)
  }

  /**
   * Check if more rawFiles can be made
   */
  const canSelectMore = mediaItems => {
    const limit = getEffectiveLimit.value
    if (limit === null) return true // Unlimited

    const currentCount = getCurrentSelectedCount(mediaItems)
    return currentCount < limit
  }

  /**
   * Check if rawFile is at limit
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
    getRemainingRawFiles,
    canSelectMore,
    isAtLimit,
    getTotalSelectedCount,
  }
}
