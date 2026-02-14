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
 * Parse error from API response.
 * Backend message is always preferred: error.response.data.message / .error first, then error.message (set by API client from backend).
 */
export function parseError(error) {
  if (error instanceof AppError) {
    return error
  }

  const data = error?.response?.data
  const backendMessage = data?.message ?? data?.error
  let message = backendMessage

  const fieldErrors = data?.errors && typeof data.errors === 'object' ? Object.values(data.errors).flat().filter(Boolean) : []
  if (!message && fieldErrors.length > 0) message = fieldErrors[0]
  else if (message && fieldErrors.length > 0) message = `${message}. ${fieldErrors[0]}`
  if (!message && error?.message) message = error.message
  if (!message && error?.response?.status) message = `Request failed with status ${error.response.status}`
  if (!message) message = typeof error === 'string' ? error : 'An unexpected error occurred'

  return {
    message,
    code: data?.code ?? error?.code,
    status: error?.response?.status ?? error?.status,
    errors: data?.errors ?? error?.errors,
    response: error?.response,
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
  if (error == null) return fallback
  const backend =
    error?.response?.data?.message ??
    error?.response?.data?.error ??
    error?.response?.data?.data?.message ??
    error?.response?.data?.data?.error
  if (backend && String(backend).trim()) return extractBackendMessage(String(backend).trim())
  if (error?.message && String(error.message).trim()) return extractBackendMessage(String(error.message).trim())
  const parsed = parseError(error)
  if (parsed?.message && String(parsed.message).trim()) return extractBackendMessage(String(parsed.message).trim())
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
 * Extract backend error message for display (alias for getErrorMessage).
 */
export function getBackendErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return getErrorMessage(error, fallback)
}

/**
 * Get success message from API response. Prefer backend message when present.
 * @param {*} response - API response (e.g. { data, message, status } or { data: { message } })
 * @param {string} fallback - Fallback when no message in response
 * @returns {string}
 */
export function getSuccessMessage(response, fallback = '') {
  if (response == null) return fallback
  const msg =
    response?.message ?? response?.data?.message ?? response?.data?.success_message ?? ''
  return (typeof msg === 'string' && msg.trim()) ? msg.trim() : fallback
}
