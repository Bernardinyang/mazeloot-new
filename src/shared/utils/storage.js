/**
 * LocalStorage utility helpers
 * Provides type-safe localStorage operations
 */

export const storage = {
  /**
   * Get item from localStorage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      try {
        return JSON.parse(item)
      } catch (parseError) {
        // If a default value was provided, respect it for invalid JSON cases
        if (defaultValue !== null) return defaultValue
        // Otherwise return the raw string (useful for tokens stored as plain strings)
        return item
      }
    } catch (error) {
      return defaultValue
    }
  },

  /**
   * Set item in localStorage
   */
  set(key, value) {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
    } catch (error) {
      const isQuotaError =
        error?.name === 'QuotaExceededError' ||
        error?.code === 22 ||
        error?.message?.includes('quota') ||
        error?.message?.includes('QuotaExceededError') ||
        error?.toString()?.includes('quota') ||
        error?.toString()?.includes('QuotaExceededError')

      if (isQuotaError) {
        const quotaError = new Error(
          `Storage quota exceeded for key "${key}". Please clear some data or reduce file sizes.`
        )
        quotaError.name = 'QuotaExceededError'
        quotaError.code = 22
        quotaError.originalError = error
        throw quotaError
      }
      throw error
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {}
  },

  /**
   * Clear all localStorage
   */
  clear() {
    try {
      localStorage.clear()
    } catch (error) {}
  },

  /**
   * Check if key exists in localStorage
   */
  has(key) {
    return localStorage.getItem(key) !== null
  },
}
