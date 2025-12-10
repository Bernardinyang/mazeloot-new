/**
 * Error handling utilities
 * Provides standardized error handling and formatting
 */

export interface ApiError {
  message: string
  code?: string
  status?: number
  errors?: Record<string, string[]>
}

export class AppError extends Error {
  code?: string
  status?: number
  errors?: Record<string, string[]>

  constructor(message: string, code?: string, status?: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.errors = errors
  }
}

/**
 * Parse error from API response
 */
export function parseError(error: any): ApiError {
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error
  }

  // If it's an Error object
  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  // If it's an API response with error structure
  if (error?.response?.data) {
    const data = error.response.data
    return {
      message: data.message || data.error || 'An error occurred',
      code: data.code,
      status: error.response.status,
      errors: data.errors,
    }
  }

  // If it's a plain object with error info
  if (error?.message || error?.errors || error?.status) {
    return {
      message: error.message || 'An error occurred',
      code: error.code,
      status: error.status,
      errors: error.errors,
    }
  }

  // Fallback
  return {
    message: typeof error === 'string' ? error : 'An unexpected error occurred',
  }
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(
  error: any,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (error === null || error === undefined) {
    return fallback
  }
  const parsed = parseError(error)
  return parsed.message || fallback
}

/**
 * Get field-specific errors
 */
export function getFieldErrors(error: any): Record<string, string> {
  const parsed = parseError(error)
  if (!parsed.errors) return {}

  const fieldErrors: Record<string, string> = {}
  Object.keys(parsed.errors).forEach(field => {
    const messages = parsed.errors![field]
    if (messages && messages.length > 0) {
      fieldErrors[field] = messages[0] // Take first error message
    }
  })

  return fieldErrors
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('Network Error') ||
    error?.message?.includes('Failed to fetch')
  )
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  const parsed = parseError(error)
  return parsed.status === 401 || parsed.status === 403
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: any): boolean {
  const parsed = parseError(error)
  return parsed.status === 422 || parsed.errors !== undefined
}
