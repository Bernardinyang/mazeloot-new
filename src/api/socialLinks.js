import { apiClient } from '@/api/client'
import { parseError } from '@/utils/errors'

export function useSocialLinksApi() {
  const fetchSocialLinks = async () => {
    try {
      const response = await apiClient.get('/v1/memora/settings/social-links')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchAvailablePlatforms = async () => {
    try {
      const response = await apiClient.get('/v1/memora/settings/social-links/platforms')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const createSocialLink = async data => {
    try {
      const response = await apiClient.post('/v1/memora/settings/social-links', data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const updateSocialLink = async (id, data) => {
    try {
      const response = await apiClient.patch(`/v1/memora/settings/social-links/${id}`, data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const deleteSocialLink = async id => {
    try {
      await apiClient.delete(`/v1/memora/settings/social-links/${id}`)
    } catch (error) {
      throw parseError(error)
    }
  }

  const reorderSocialLinks = async order => {
    try {
      const response = await apiClient.post('/v1/memora/settings/social-links/reorder', {
        order,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  return {
    fetchSocialLinks,
    fetchAvailablePlatforms,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
    reorderSocialLinks,
  }
}

