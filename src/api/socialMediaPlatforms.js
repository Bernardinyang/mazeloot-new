import { apiClient } from '@/api/client'
import { parseError } from '@/utils/errors'

export function useSocialMediaPlatformsApi() {
  const fetchPlatforms = async () => {
    try {
      const response = await apiClient.get('/v1/memora/admin/social-media-platforms')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const createPlatform = async data => {
    try {
      const response = await apiClient.post('/v1/memora/admin/social-media-platforms', data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const updatePlatform = async (id, data) => {
    try {
      const response = await apiClient.patch(`/v1/memora/admin/social-media-platforms/${id}`, data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const deletePlatform = async id => {
    try {
      await apiClient.delete(`/v1/memora/admin/social-media-platforms/${id}`)
    } catch (error) {
      throw parseError(error)
    }
  }

  const togglePlatformActive = async id => {
    try {
      const response = await apiClient.patch(`/v1/memora/admin/social-media-platforms/${id}/toggle`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  return {
    fetchPlatforms,
    createPlatform,
    updatePlatform,
    deletePlatform,
    togglePlatformActive,
  }
}

