/**
 * Utility functions for rawFile limit normalization and validation
 * Used across API calls and components
 */

/**
 * Normalize rawFile limit value for API
 * Converts empty strings, null, undefined, 0, or invalid numbers to null
 * Validates that the number is >= 1
 */
export function normalizeRawFileLimit(value) {
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
 * Format rawFile limit for API payload
 * Handles both camelCase and snake_case, normalizes the value
 */
export function formatRawFileLimitForApi(data) {
  const limit = data.rawFileLimit !== undefined ? data.rawFileLimit : data.rawFile_limit
  return normalizeRawFileLimit(limit)
}
