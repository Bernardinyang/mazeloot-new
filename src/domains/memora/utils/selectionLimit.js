/**
 * Utility functions for selection limit normalization and validation
 * Used across API calls and components
 */

/**
 * Normalize selection limit value for API
 * Converts empty strings, null, undefined, 0, or invalid numbers to null
 * Validates that the number is >= 1
 */
export function normalizeSelectionLimit(value) {
  if (value === null || value === undefined || value === '' || value === 0) {
    return null
  }

  const numValue = Number(value)

  if (isNaN(numValue) || numValue < 1) {
    return null
  }

  return numValue
}

/**
 * Format selection limit for API payload
 * Handles both camelCase and snake_case, normalizes the value
 */
export function formatSelectionLimitForApi(data) {
  const limit = data.selectionLimit !== undefined ? data.selectionLimit : data.selection_limit
  return normalizeSelectionLimit(limit)
}
