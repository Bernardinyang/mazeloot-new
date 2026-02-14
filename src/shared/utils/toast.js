/**
 * Toast utility wrapper that hides titles.
 * Prioritizes backend messages: use toast.apiError(error, fallback) and toast.apiSuccess(response, fallback).
 *
 * Usage:
 *   toast.success('Message')
 *   toast.apiError(error, 'Fallback message')  // Backend error message first
 *   toast.apiSuccess(response, 'Saved')        // Backend success message first when present
 */
import { toast as sonnerToast } from 'vue-sonner'
import { getErrorMessage, getSuccessMessage } from '@/shared/utils/errors'

/**
 * Extract message from title or description
 */
function getMessage(title, options = {}) {
  // If title is provided and not empty, use it
  if (title && title.trim()) {
    return title
  }
  // Otherwise use description from options
  return options.description || ''
}

/**
 * Show success toast with description only (no title)
 */
export const toast = {
  success: (title, options = {}) => {
    const message = getMessage(title, options)
    return sonnerToast.success('', {
      ...options,
      description: message,
    })
  },

  error: (title, options = {}) => {
    const message = getMessage(title, options)
    return sonnerToast.error('', {
      ...options,
      description: message,
    })
  },

  /** Backend error message first, then fallback. */
  apiError: (error, fallback = 'Something went wrong. Please try again.') => {
    const message = getErrorMessage(error, fallback)
    return sonnerToast.error('', { description: message })
  },

  /** Backend success message first when present in response, then fallback. */
  apiSuccess: (response, fallback = '') => {
    const message = getSuccessMessage(response, fallback)
    if (message) return sonnerToast.success('', { description: message })
    return sonnerToast.success('', { description: fallback || 'Done' })
  },

  info: (title, options = {}) => {
    const message = getMessage(title, options)
    return sonnerToast.info('', {
      ...options,
      description: message,
    })
  },

  warning: (title, options = {}) => {
    const message = getMessage(title, options)
    return sonnerToast.warning('', {
      ...options,
      description: message,
    })
  },

  loading: (title, options = {}) => {
    const message = getMessage(title, options)
    const { progress, ...restOptions } = options
    return sonnerToast.loading('', {
      ...restOptions,
      description: message,
      ...(progress !== undefined && { progress }),
    })
  },

  promise: (promise, options = {}) => {
    return sonnerToast.promise(promise, options)
  },

  dismiss: id => {
    return sonnerToast.dismiss(id)
  },
}
