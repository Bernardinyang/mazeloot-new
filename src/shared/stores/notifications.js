/**
 * Notifications Store
 * Manages global notifications across all products
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useNotificationsApi } from '@/shared/api/notifications'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const unreadCounts = ref({
    memora: 0,
    profolio: 0,
    general: 0,
    total: 0,
  })
  const isLoading = ref(false)
  const isInitialized = ref(false)

  const notificationsApi = useNotificationsApi()

  // Getters
  const memoraNotifications = computed(() => {
    return notifications.value.filter(n => n.product === 'memora')
  })

  const allNotifications = computed(() => {
    return notifications.value
  })

  const unreadMemoraCount = computed(() => {
    return unreadCounts.value.memora || 0
  })

  const unreadTotalCount = computed(() => {
    return unreadCounts.value.total || 0
  })

  // Actions
  const fetchNotifications = async (product = null, filters = {}) => {
    isLoading.value = true
    try {
      const params = { ...filters }
      if (product) {
        params.product = product
      }
      const response = await notificationsApi.fetchNotifications(params)
      // Handle both direct array and wrapped response
      const notificationsData = Array.isArray(response) ? response : (response?.data || [])
      notifications.value = notificationsData
      console.log('Fetched notifications:', notifications.value.length, notifications.value)
      return notifications.value
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchUnreadCounts = async () => {
    try {
      const response = await notificationsApi.fetchUnreadCounts()
      // Handle both direct object and wrapped response
      unreadCounts.value = response?.data || response || {
        memora: 0,
        profolio: 0,
        general: 0,
        total: 0,
      }
      console.log('Fetched unread counts:', unreadCounts.value)
      return unreadCounts.value
    } catch (error) {
      console.error('Failed to fetch unread counts:', error)
      throw error
    }
  }

  const markAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id)
      // Update local state
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.readAt = new Date().toISOString()
      }
      // Update unread counts
      await fetchUnreadCounts()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      throw error
    }
  }

  const markAllAsRead = async (product = null) => {
    try {
      await notificationsApi.markAllAsRead(product)
      // Update local state
      const filterFn = product
        ? n => n.product === product && !n.readAt
        : n => !n.readAt
      notifications.value.forEach(n => {
        if (filterFn(n)) {
          n.readAt = new Date().toISOString()
        }
      })
      // Update unread counts
      await fetchUnreadCounts()
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      throw error
    }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationsApi.deleteNotification(id)
      // Remove from local state
      notifications.value = notifications.value.filter(n => n.id !== id)
      // Update unread counts
      await fetchUnreadCounts()
    } catch (error) {
      console.error('Failed to delete notification:', error)
      throw error
    }
  }

  const addNotification = (notification) => {
    console.log('Adding notification to store:', notification)
    // Check if notification already exists
    const exists = notifications.value.some(n => n.id === notification.id)
    if (exists) {
      console.log('Notification already exists, skipping:', notification.id)
      return
    }
    // Add to beginning of array
    notifications.value.unshift(notification)
    // Update unread counts if notification is unread
    if (!notification.readAt) {
      unreadCounts.value[notification.product] = (unreadCounts.value[notification.product] || 0) + 1
      unreadCounts.value.total = (unreadCounts.value.total || 0) + 1
    }
  }

  const initialize = async () => {
    if (isInitialized.value) {
      console.log('Notifications already initialized')
      return
    }
    
    try {
      console.log('Initializing notifications store...')
      await Promise.all([
        fetchNotifications(),
        fetchUnreadCounts(),
      ])
      isInitialized.value = true
      console.log('Notifications store initialized successfully. Count:', notifications.value.length)
    } catch (error) {
      console.error('Failed to initialize notifications:', error)
      // Still mark as initialized to prevent infinite retries
      isInitialized.value = true
    }
  }

  return {
    // State
    notifications,
    unreadCounts,
    isLoading,
    isInitialized,
    // Getters
    memoraNotifications,
    allNotifications,
    unreadMemoraCount,
    unreadTotalCount,
    // Actions
    fetchNotifications,
    fetchUnreadCounts,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    initialize,
  }
})
