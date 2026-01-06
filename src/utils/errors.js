/**
 * Error handling utilities
 * Provides standardized error handling and formatting
 */

export class AppError extends Error {
  constructor(message, code, status, errors) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.errors = errors
  }
}

/**
 * Parse error from API response
 * Prioritizes backend error messages in this order:
 * 1. error.message (from API client)
 * 2. error.response.data.message (direct from backend)
 * 3. error.response.data.error (alternative backend field)
 * 4. Fallback messages
 */
export function parseError(error) {
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error
  }

  // Priority 1: API client format (already processed) - { message, code, status, errors }
  if (error?.message && (error?.status !== undefined || error?.code !== undefined)) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      errors: error.errors,
    }
  }

  // Priority 2: Raw API response with error structure
  if (error?.response?.data) {
    const data = error.response.data
    // Extract the most specific error message from backend
    let message = data.message || data.error

    // If there are field-specific errors, include the first one for more context
    if (data.errors && typeof data.errors === 'object') {
      const fieldErrors = Object.values(data.errors).flat()
      if (fieldErrors.length > 0 && fieldErrors[0]) {
        message = message ? `${message}. ${fieldErrors[0]}` : fieldErrors[0]
      }
    }

    return {
      message: message || `Request failed with status ${error.response.status}`,
      code: data.code,
      status: error.response.status,
      errors: data.errors,
    }
  }

  // Priority 3: Plain object with error info (API client format)
  if (error?.message || error?.errors || error?.status) {
    return {
      message: error.message || 'An error occurred',
      code: error.code,
      status: error.status,
      errors: error.errors,
    }
  }

  // Priority 4: Error object
  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  // Fallback
  return {
    message: typeof error === 'string' ? error : 'An unexpected error occurred',
  }
}

/**
 * Get user-friendly error message
 * Prioritizes backend error message, only uses fallback if no message exists
 * 
 * Priority order:
 * 1. error.message (from API client - already processed)
 * 2. error.response.data.message (direct from backend)
 * 3. error.response.data.error (alternative backend field)
 * 4. Fallback message
 */
/**
 * Extract only the backend error message, removing frontend prefixes
 */
function extractBackendMessage(message) {
  if (!message || typeof message !== 'string') {
    return message
  }
  
  // Common frontend error prefixes to remove
  const prefixes = [
    'Failed to delete media: ',
    'Failed to delete: ',
    'Delete failed: ',
    'Failed to toggle star: ',
    'Failed to toggle featured: ',
    'Failed to download: ',
    'Download failed: ',
    'Failed to upload: ',
    'Upload failed: ',
    'Failed to save: ',
    'Save failed: ',
    'Failed to update: ',
    'Update failed: ',
    'Failed to create: ',
    'Create failed: ',
    'Failed to fetch: ',
    'Fetch failed: ',
  ]
  
  for (const prefix of prefixes) {
    if (message.startsWith(prefix)) {
      return message.substring(prefix.length).trim()
    }
  }
  
  return message
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error === null || error === undefined) {
    return fallback
  }
  
  // Direct access to backend message (highest priority)
  // Check both raw response and processed error object
  const backendMessage = 
    error?.response?.data?.message || 
    error?.response?.data?.error ||
    (error?.response?.data?.data?.message) ||
    (error?.response?.data?.data?.error)
  
  if (backendMessage && backendMessage.trim() !== '') {
    return extractBackendMessage(backendMessage)
  }
  
  // API client processed message (second priority)
  // This handles errors that have been parsed by parseError
  if (error?.message && error.message.trim() !== '') {
    return extractBackendMessage(error.message)
  }
  
  // Parse error if not already parsed
  const parsed = parseError(error)
  if (parsed.message && parsed.message.trim() !== '') {
    return extractBackendMessage(parsed.message)
  }
  
  return fallback
}

/**
 * Get field-specific errors
 */
export function getFieldErrors(error) {
  const parsed = parseError(error)
  if (!parsed.errors) return {}

  const fieldErrors = {}
  Object.keys(parsed.errors).forEach(field => {
    const messages = parsed.errors[field]
    if (messages && messages.length > 0) {
      fieldErrors[field] = messages[0] // Take first error message
    }
  })

  return fieldErrors
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error) {
  return (
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('Network Error') ||
    error?.message?.includes('Failed to fetch')
  )
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error) {
  const parsed = parseError(error)
  return parsed.status === 401 || parsed.status === 403
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error) {
  const parsed = parseError(error)
  return parsed.status === 422 || parsed.errors !== undefined
}

/**
 * Extract backend error message for display
 * This is the recommended way to get error messages throughout the app
 * 
 * @param {*} error - Error object from catch block
 * @param {string} fallback - Fallback message if no backend message found
 * @returns {string} Error message to display
 */
export function getBackendErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return getErrorMessage(error, fallback)
}
