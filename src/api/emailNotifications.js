import { apiClient } from '@/api/client'
import { parseError } from '@/utils/errors'

export function useEmailNotificationsApi() {
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

  const getNotificationTypes = async () => {
    try {
      const response = await apiClient.get('/v1/memora/admin/notifications/types')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  return {
    fetchEmailNotifications,
    updateEmailNotifications,
    getNotificationTypes,
  }
}

