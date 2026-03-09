/**
 * Notifications Store
 * Manages global notifications across all products
 */

const devLog = (...args) => { if (import.meta.env.DEV) devLog(...args) }
const devWarn = (...args) => { if (import.meta.env.DEV) devWarn(...args) }
const devError = (...args) => { if (import.meta.env.DEV) devError(...args) }

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useNotificationsApi } from '@/shared/api/notifications'
import { usePusher } from '@/shared/composables/usePusher'
import { useUserStore } from '@/shared/stores/user'
import { toast } from '@/shared/utils/toast'

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
  let pusherSubscription = null
  let pollingInterval = null

  const notificationsApi = useNotificationsApi()
  const { subscribePrivate, unsubscribe, getPusher } = usePusher()
  const userStore = useUserStore()

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
      devLog('Fetched notifications:', notifications.value.length, notifications.value)
      return notifications.value
    } catch (error) {
      devError('Failed to fetch notifications:', error)
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
      devLog('Fetched unread counts:', unreadCounts.value)
      return unreadCounts.value
    } catch (error) {
      devError('Failed to fetch unread counts:', error)
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
      devError('Failed to mark notification as read:', error)
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
      devError('Failed to mark all notifications as read:', error)
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
      devError('Failed to delete notification:', error)
      throw error
    }
  }

  /**
   * Determine if a notification should show a toast
   * Silent notifications: settings updates, watermark/preset updates, social link updates
   * Show toast: important events like published, approved, rejected, completed, ready, uploaded
   */
  const shouldShowToast = (notification) => {
    const type = notification.type || ''

    // Silent types - never show toast
    const silentTypes = [
      'settings_',
      'watermark_updated',
      'preset_updated',
      'social_link_',
      'social_links_reordered',
    ]

    if (silentTypes.some(silentType => type.includes(silentType))) {
      return false
    }

    // Always show toast for these important events
    const importantTypes = [
      'collection_published',
      'proofing_approved',
      'proofing_rejected',
      'selection_completed',
      'download_ready',
      'media_bulk_uploaded',
      'collection_deleted',
      'selection_deleted',
      'watermark_deleted',
      'preset_deleted',
    ]

    if (importantTypes.includes(type)) {
      return true
    }

    // Show toast for created events (except silent ones)
    if (type.includes('_created') && !type.includes('watermark_created') && !type.includes('preset_created')) {
      return true
    }

    // Show toast for uploaded events
    if (type.includes('_uploaded')) {
      return true
    }

    // Default: silent for other updates
    return false
  }

  const addNotification = (notification) => {
    devLog('Adding notification to store:', notification)
    // Check if notification already exists (check both id and uuid)
    const notificationId = notification.id || notification.uuid
    const exists = notifications.value.some(n => (n.id === notificationId || n.uuid === notificationId))
    if (exists) {
      devLog('Notification already exists, skipping:', notificationId)
      return false
    }
    // Add to beginning of array
    notifications.value.unshift(notification)
    // Update unread counts if notification is unread
    if (!notification.readAt) {
      const product = notification.product || 'general'
      unreadCounts.value[product] = (unreadCounts.value[product] || 0) + 1
      unreadCounts.value.total = (unreadCounts.value.total || 0) + 1
    }
    return true
  }

  const startPolling = () => {
    // Stop existing polling
    stopPolling()

    // Poll every 30 seconds as fallback if Pusher fails
    pollingInterval = setInterval(async () => {
      if (userStore.isAuthenticated && !isLoading.value) {
        try {
          await fetchUnreadCounts()
          // Only fetch notifications if dropdown is open or we have unread notifications
          if (unreadTotalCount.value > 0) {
            await fetchNotifications()
          }
        } catch (error) {
          devError('Polling fetch failed:', error)
        }
      }
    }, 30000) // 30 seconds
  }

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  const setupPusherSubscription = async () => {
    // Clean up existing subscription
    if (pusherSubscription) {
      cleanupPusherSubscription()
    }

    // Only subscribe if user is authenticated
    if (!userStore.isAuthenticated) {
      devLog('User not authenticated, skipping Pusher subscription')
      // Start polling as fallback
      startPolling()
      return
    }

    const userUuid = userStore.user?.uuid || userStore.user?.id
    if (!userUuid) {
      devWarn('User UUID not available, skipping Pusher subscription', {
        user: userStore.user,
        isAuthenticated: userStore.isAuthenticated,
      })
      // Start polling as fallback
      startPolling()
      return
    }

    // Check if Pusher is available
    const pusher = getPusher()
    if (!pusher) {
      devWarn('Pusher not available, using polling fallback')
      startPolling()
      return
    }

    try {
      const channelName = `private-user.${userUuid}`
      devLog('Subscribing to notification channel:', channelName, {
        userUuid,
        isAuthenticated: userStore.isAuthenticated,
        hasToken: !!userStore.token,
        pusherState: pusher.connection.state,
      })

      pusherSubscription = await subscribePrivate(
        channelName,
        'notification.created',
        (data) => {
          devLog('✅ Received new notification via Pusher:', data)
          if (data?.notification) {
            // Add notification to store
            const wasAdded = addNotification(data.notification)

            if (wasAdded) {
              if (shouldShowToast(data.notification)) {
                const n = data.notification
                const title = n.title || 'New notification'
                const body = n.message
                const isHidden = typeof document !== 'undefined' && document.visibilityState === 'hidden'
                const canShowSystem =
                  typeof window !== 'undefined' &&
                  'Notification' in window &&
                  Notification.permission === 'granted' &&
                  'serviceWorker' in navigator

                if (isHidden && canShowSystem) {
                  navigator.serviceWorker.ready.then((reg) => {
                    if (reg.active) {
                      reg.active.postMessage({
                        type: 'SHOW_NOTIFICATION',
                        title,
                        body,
                        id: n.id || n.uuid,
                        url: n.actionUrl || n.action_url || '/',
                      })
                    }
                  })
                } else if (!isHidden) {
                  toast.success(title, {
                    description: body,
                    duration: 5000,
                  })
                }
              } else {
                devLog('Silent notification (no toast):', data.notification.type)
              }
            }

            // Update unread counts
            fetchUnreadCounts()
          }
        }
      )

      if (pusherSubscription) {
        devLog('✅ Successfully subscribed to notification channel:', channelName)

        // Listen for subscription events
        pusherSubscription.bind('pusher:subscription_succeeded', () => {
          devLog('✅ Pusher subscription confirmed for:', channelName)
          // Stop polling since Pusher is working
          stopPolling()
        })

        pusherSubscription.bind('pusher:subscription_error', (error) => {
          devError('❌ Pusher subscription error:', error, 'for channel:', channelName)
          // Start polling as fallback
          startPolling()
        })

        // Check Pusher connection status
        if (pusher) {
          devLog('Pusher connection state:', pusher.connection.state)
          pusher.connection.bind('connected', () => {
            devLog('✅ Pusher connected')
            stopPolling()
          })
          pusher.connection.bind('disconnected', () => {
            devWarn('⚠️ Pusher disconnected, starting polling fallback')
            startPolling()
          })
          pusher.connection.bind('error', (error) => {
            devError('❌ Pusher connection error:', error)
            startPolling()
          })
        }
      } else {
        devWarn('⚠️ Pusher subscription returned null for channel:', channelName)
        // Start polling as fallback
        startPolling()
      }
    } catch (error) {
      devError('Failed to subscribe to notification channel:', error)
      // Start polling as fallback
      startPolling()
    }
  }

  const cleanupPusherSubscription = () => {
    if (pusherSubscription) {
      const userUuid = userStore.user?.uuid || userStore.user?.id
      if (userUuid) {
        const channelName = `private-user.${userUuid}`
        unsubscribe(channelName)
        devLog('Unsubscribed from notification channel:', channelName)
      }
      pusherSubscription = null
    }
    stopPolling()
  }

  const reset = () => {
    cleanupPusherSubscription()
    notifications.value = []
    unreadCounts.value = {
      memora: 0,
      profolio: 0,
      general: 0,
      total: 0,
    }
    isInitialized.value = false
  }

  const initialize = async () => {
    if (isInitialized.value) {
      devLog('Notifications already initialized, re-setting up Pusher subscription')
      // Re-setup Pusher subscription in case it was lost
      await setupPusherSubscription()
      return
    }

    try {
      devLog('Initializing notifications store...', {
        isAuthenticated: userStore.isAuthenticated,
        hasUser: !!userStore.user,
        userUuid: userStore.user?.uuid || userStore.user?.id,
      })

      // Wait a bit for user store to be ready if needed
      if (!userStore.user?.uuid && !userStore.user?.id) {
        devLog('Waiting for user data...')
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      await Promise.all([
        fetchNotifications(),
        fetchUnreadCounts(),
      ])

      // Setup Pusher subscription for real-time updates
      await setupPusherSubscription()

      isInitialized.value = true
      devLog('Notifications store initialized successfully. Count:', notifications.value.length)
    } catch (error) {
      devError('Failed to initialize notifications:', error)
      // Still mark as initialized to prevent infinite retries
      isInitialized.value = true
      // Try to setup Pusher anyway
      try {
        await setupPusherSubscription()
      } catch (pusherError) {
        devError('Failed to setup Pusher subscription:', pusherError)
      }
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
    setupPusherSubscription,
    cleanupPusherSubscription,
    reset,
  }
})
