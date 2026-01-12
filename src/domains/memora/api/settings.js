import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'

export function useSettingsApi() {
  const fetchSettings = async () => {
    try {
      const response = await apiClient.get('/v1/memora/settings')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchPublicSettings = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.collectionId) {
        queryParams.append('collectionId', params.collectionId)
      }
      if (params.userId) {
        queryParams.append('userId', params.userId)
      }
      const queryString = queryParams.toString()
      const url = `/v1/public/settings${queryString ? `?${queryString}` : ''}`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const updateBranding = async data => {
    try {
      const response = await apiClient.patch('/v1/memora/settings/branding', data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const updatePreference = async data => {
    try {
      const response = await apiClient.patch('/v1/memora/settings/preference', data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const updateHomepage = async data => {
    try {
      const response = await apiClient.patch('/v1/memora/settings/homepage', data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const updateEmailSettings = async data => {
    try {
      const response = await apiClient.patch('/v1/memora/settings/email', data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  return {
    fetchSettings,
    fetchPublicSettings,
    updateBranding,
    updatePreference,
    updateHomepage,
    updateEmailSettings,
  }
}

