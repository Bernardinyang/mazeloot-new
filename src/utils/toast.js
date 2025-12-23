/**
 * Toast utility wrapper that hides titles
 * All toast notifications will show only the description (no title)
 *
 * Usage:
 *   toast.success('Message')
 *   toast.success('Message', { duration: 5000 })
 *   toast.success('', { description: 'Message' }) // Legacy format supported
 *   toast.loading('Uploading...', { id: 'upload-toast' })
 *   toast.loading('Uploading...', { id: 'upload-toast', progress: 50 })
 */
import { toast as sonnerToast } from 'vue-sonner'

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
