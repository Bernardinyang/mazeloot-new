import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'

export function useEmailNotificationsApi() {
  const fetchEvents = async () => {
    try {
      const response = await apiClient.get('/v1/memora/settings/notifications/events')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchEmailNotifications = async () => {
    try {
      const response = await apiClient.get('/v1/memora/settings/notifications')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const updateEmailNotifications = async notifications => {
    try {
      const response = await apiClient.patch('/v1/memora/settings/notifications', {
        notifications,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchChannels = async () => {
    try {
      const response = await apiClient.get('/v1/memora/settings/notifications/channels')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const updateChannels = async payload => {
    try {
      const response = await apiClient.patch('/v1/memora/settings/notifications/channels', payload)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  return {
    fetchEvents,
    fetchEmailNotifications,
    updateEmailNotifications,
    fetchChannels,
    updateChannels,
  }
}

