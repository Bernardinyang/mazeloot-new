/**
 * Error handling composable
 * Provides consistent error handling across views
 */

import { ref } from 'vue'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage, isAuthError, isNetworkError, isValidationError } from '@/shared/utils/errors'
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

    if (isAuthError(err)) {
      if (onAuthError) {
        onAuthError()
      } else {
        await logout()
      }
      if (showToast) {
        toast.apiError(err, 'Please sign in again.')
      }
      return
    }

    if (isNetworkError(err)) {
      if (onNetworkError) {
        onNetworkError()
      }
      if (showToast) {
        toast.apiError(err, 'Please check your internet connection and try again.')
      }
      return
    }

    if (isValidationError(err)) {
      if (showToast) {
        toast.apiError(err, fallbackMessage)
      }
      return
    }

    if (showToast) {
      toast.apiError(err, fallbackMessage)
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
