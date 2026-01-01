import { apiClient } from '@/api/client'
import { parseError } from '@/utils/errors'

export function useSettingsApi() {
  const fetchSettings = async () => {
    try {
      const response = await apiClient.get('/v1/memora/settings')
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
    updateBranding,
    updatePreference,
    updateHomepage,
    updateEmailSettings,
  }
}

