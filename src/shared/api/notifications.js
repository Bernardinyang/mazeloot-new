/**
 * Notifications API composable
 * Handles all notification-related API calls
 */

import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'

export function useNotificationsApi() {
  /**
   * Fetch notifications with optional filters
   */
  const fetchNotifications = async (params = {}) => {
    try {
      const response = await apiClient.get('/v1/notifications', { params })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Fetch unread notification counts by product
   */
  const fetchUnreadCounts = async () => {
    try {
      const response = await apiClient.get('/v1/notifications/unread-count')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Mark a notification as read
   */
  const markAsRead = async (id) => {
    try {
      await apiClient.patch(`/v1/notifications/${id}/read`)
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Mark all notifications as read (optionally filtered by product)
   */
  const markAllAsRead = async (product = null) => {
    try {
      const params = product ? { product } : {}
      await apiClient.patch('/v1/notifications/read-all', null, { params })
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete a notification
   */
  const deleteNotification = async (id) => {
    try {
      await apiClient.delete(`/v1/notifications/${id}`)
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get VAPID public key for web push subscription
   */
  const getPushVapidPublic = async () => {
    const response = await apiClient.get('/v1/notifications/push-vapid-public')
    return response.data?.data?.publicKey ?? response.data?.publicKey
  }

  /**
   * Register push subscription with backend (for receiving push when app is closed)
   */
  const storePushSubscription = async (subscription) => {
    const payload = subscription.toJSON?.() ?? subscription
    const body = {
      endpoint: payload.endpoint,
      keys: payload.keys ?? { p256dh: payload.p256dh, auth: payload.auth },
      contentEncoding: payload.contentEncoding ?? 'aesgcm',
    }
    if (!body.keys.p256dh && payload.keys) body.keys = { p256dh: payload.keys.p256dh, auth: payload.keys.auth }
    await apiClient.post('/v1/notifications/push-subscription', body)
  }

  /**
   * Remove push subscription
   */
  const destroyPushSubscription = async (endpoint) => {
    await apiClient.delete('/v1/notifications/push-subscription', { data: { endpoint } })
  }

  return {
    fetchNotifications,
    fetchUnreadCounts,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getPushVapidPublic,
    storePushSubscription,
    destroyPushSubscription,
  }
}
