import { ref } from 'vue'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'

export function useDataLoader(options = {}) {
  const isLoading = ref(false)
  const error = ref(null)

  const loadData = async (fetchFn, errorOptions = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await fetchFn()
      return data
    } catch (err) {
      const errorMessage = getErrorMessage(err, errorOptions.fallbackMessage || 'Failed to load data')
      error.value = errorMessage

      if (errorOptions.showToast !== false) {
        toast.error(errorMessage)
      }

      if (errorOptions.onError) {
        errorOptions.onError(err)
      }

      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isLoading,
    error,
    loadData,
    clearError,
  }
}
