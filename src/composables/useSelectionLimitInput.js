import { computed } from 'vue'

/**
 * Composable for handling selection limit input validation and normalization
 * Provides reusable logic for converting user input to valid limit values
 */
export function useSelectionLimitInput(initialValue = null) {
  /**
   * Normalize a selection limit value
   * Converts empty strings, null, undefined, or invalid numbers to null
   * Validates that the number is >= 1
   */
  const normalizeLimit = value => {
    // Handle empty string, null, undefined, or whitespace-only values
    if (!value || value === '' || (typeof value === 'string' && value.trim() === '')) {
      return null
    }

    // Convert to number
    const numValue = Number(value)

    // If it's a valid number and >= 1, return it; otherwise return null
    if (!isNaN(numValue) && numValue >= 1) {
      return numValue
    }

    return null
  }

  /**
   * Handle input change event
   * Normalizes the value and returns the result
   */
  const handleLimitChange = value => {
    return normalizeLimit(value)
  }

  /**
   * Format limit for display (converts null to empty string)
   */
  const formatForDisplay = value => {
    return value ?? ''
  }

  /**
   * Validate limit value
   */
  const isValidLimit = value => {
    if (value === null || value === undefined) return true // null is valid (unlimited)
    const numValue = Number(value)
    return !isNaN(numValue) && numValue >= 1
  }

  return {
    normalizeLimit,
    handleLimitChange,
    formatForDisplay,
    isValidLimit,
  }
}
