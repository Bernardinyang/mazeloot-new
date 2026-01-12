import { ref } from 'vue'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { apiClient } from '@/shared/api/client'

export function useMediaLoader(options = {}) {
  const mediaItems = ref([])
  const selectedSetId = ref(null)
  const isLoadingMedia = ref(false)
  const error = ref(null)

  const loadMediaForSet = async (setId, fetchFn, headers = {}) => {
    if (!setId) {
      mediaItems.value = []
      return
    }

    isLoadingMedia.value = true
    error.value = null
    selectedSetId.value = setId

    try {
      const data = await fetchFn(setId, headers)
      mediaItems.value = Array.isArray(data) ? data : []
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Failed to load media')
      error.value = errorMessage
      toast.error(errorMessage)
      mediaItems.value = []
    } finally {
      isLoadingMedia.value = false
    }
  }

  const clearMedia = () => {
    mediaItems.value = []
    selectedSetId.value = null
    error.value = null
  }

  return {
    mediaItems,
    selectedSetId,
    isLoadingMedia,
    error,
    loadMediaForSet,
    clearMedia,
  }
}
