/**
 * LocalStorage utility helpers
 * Provides type-safe localStorage operations
 */

export const storage = {
  /**
   * Get item from localStorage
   */
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return defaultValue
    }
  },

  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
    } catch (error: any) {
      // Check for quota exceeded error in multiple ways
      const isQuotaError =
        error?.name === 'QuotaExceededError' ||
        error?.code === 22 ||
        error?.message?.includes('quota') ||
        error?.message?.includes('QuotaExceededError') ||
        error?.toString()?.includes('quota') ||
        error?.toString()?.includes('QuotaExceededError')

      if (isQuotaError) {
        const quotaError: any = new Error(
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
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  },

  /**
   * Clear all localStorage
   */
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },

  /**
   * Check if key exists in localStorage
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null
  },
}
