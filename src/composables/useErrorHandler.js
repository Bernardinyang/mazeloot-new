/**
 * Error handling composable
 * Provides consistent error handling across views
 */

import { ref } from 'vue'
import { toast } from '@/utils/toast'
import { getErrorMessage, isAuthError, isNetworkError, isValidationError } from '@/utils/errors'
import { useLogout } from './useLogout'

export function useErrorHandler() {
  const { logout } = useLogout()
  const error = ref(null)

  /**
   * Handle error with appropriate user feedback
   */
  const handleError = async (err, options) => {
    const { showToast = true, fallbackMessage, onAuthError, onNetworkError } = options || {}

    const errorMessage = getErrorMessage(err, fallbackMessage)
    error.value = errorMessage

    // Handle authentication errors
    if (isAuthError(err)) {
      if (onAuthError) {
        onAuthError()
      } else {
        // Default: logout and redirect to login (useLogout handles redirect)
        await logout()
      }
      if (showToast) {
        toast.error('Please sign in again.')
      }
      return
    }

    // Handle network errors
    if (isNetworkError(err)) {
      if (onNetworkError) {
        onNetworkError()
      }
      if (showToast) {
        toast.error('Please check your internet connection and try again.')
      }
      return
    }

    // Handle validation errors
    if (isValidationError(err)) {
      if (showToast) {
        toast.error(errorMessage)
      }
      return
    }

    // Generic error
    if (showToast) {
      toast.error(errorMessage)
    }
  }

  /**
   * Clear error
   */
  const clearError = () => {
    error.value = null
  }

  return {
    error,
    handleError,
    clearError,
  }
}
