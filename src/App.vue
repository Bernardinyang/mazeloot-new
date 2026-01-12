<template>
  <div class="min-h-screen">
    <RouterView />
    <Toaster />
    <PWAInstallPrompt />
    <PWADebugInfo />

    <!-- Floating Upload Queue Button -->
    <UploadQueueButton
      v-if="!isPublicRoute && hasActiveOrFailedUploads"
      :floating="true"
      @click="showUploadQueueModal = true"
    />

    <!-- Upload Queue Modal -->
    <BackgroundUploadQueueModal v-if="!isPublicRoute" v-model="showUploadQueueModal" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Toaster from './shared/components/organisms/Toaster.vue'
import UploadQueueButton from './shared/components/organisms/UploadQueueButton.vue'
import BackgroundUploadQueueModal from './domains/memora/modals/BackgroundUploadQueueModal.vue'
import PWAInstallPrompt from './shared/components/molecules/PWAInstallPrompt.vue'
import PWADebugInfo from './shared/components/molecules/PWADebugInfo.vue'
import { useActionHistoryStore } from './shared/stores/actionHistory'
import { useBackgroundUploadManager } from './shared/composables/useBackgroundUploadManager'
import { useNotificationsStore } from './shared/stores/notifications'
import { usePusher } from './shared/composables/usePusher'
import { useUserStore } from './shared/stores/user'
import { toast } from './shared/utils/toast'

const route = useRoute()
const showUploadQueueModal = ref(false)
const backgroundUploadManager = useBackgroundUploadManager()

const isPublicRoute = computed(() => {
  return route.matched.some(record => record.meta.requiresAuth === false)
})

const hasActiveOrFailedUploads = computed(() => {
  return backgroundUploadManager.activeUploadCount.value > 0 || 
         backgroundUploadManager.failedUploadCount.value > 0
})

let keyDownHandler = null
let notificationChannel = null

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()
const { subscribePrivate, unsubscribe } = usePusher()

// Initialize notifications and Pusher subscription
const initializeNotifications = async () => {
  if (!userStore.isAuthenticated) return

  try {
    // Always initialize store first (fetch from API)
    await notificationsStore.initialize()
    console.log('Notifications initialized, count:', notificationsStore.allNotifications.length)

    // Subscribe to notification channel for real-time updates
    const userId = userStore.user?.uuid || userStore.user?.id
    if (userId) {
      const channelName = `private-user.${userId}`
      try {
        notificationChannel = await subscribePrivate(channelName, 'notification.created', (data) => {
          console.log('Notification received via Pusher:', data)
          if (data?.notification) {
            notificationsStore.addNotification(data.notification)
            // Show toast notification
            toast.success(data.notification.title, {
              description: data.notification.message,
            })
          }
        })
        if (notificationChannel) {
          console.log('Successfully subscribed to notification channel:', channelName)
        } else {
          console.warn('Failed to subscribe to notification channel (returned null)')
        }
      } catch (error) {
        console.error('Failed to subscribe to notification channel:', error)
        // Continue even if Pusher fails - notifications will still be fetched via API
      }
    } else {
      console.warn('No user ID found, cannot subscribe to notification channel')
    }
  } catch (error) {
    console.error('Failed to initialize notifications:', error)
  }
}

// Watch for authentication changes
watch(
  () => userStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      initializeNotifications()
    } else {
      // Cleanup on logout
      if (notificationChannel) {
        const userId = userStore.user?.uuid || userStore.user?.id
        if (userId) {
          unsubscribe(`private-user.${userId}`)
          notificationChannel = null
        }
      }
      notificationsStore.notifications.value = []
      notificationsStore.unreadCounts.value = {
        memora: 0,
        profolio: 0,
        general: 0,
        total: 0,
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  const actionHistory = useActionHistoryStore()
  
  // Initialize notifications if authenticated
  if (userStore.isAuthenticated) {
    initializeNotifications()
  }

  keyDownHandler = e => {
    const isInputFocused =
      e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable

    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      if (!isInputFocused) {
        e.preventDefault()
        if (actionHistory.canUndo) {
          const description = actionHistory.lastActionDescription
          actionHistory.undo()
          toast.success('Undone', {
            description: description ? `Reverted: ${description}` : 'Action has been undone',
          })
        } else {
          toast.info('Nothing to undo', {
            description: 'No actions available to undo',
          })
        }
      }
    }

    if (
      ((e.ctrlKey && e.key === 'y') || (e.metaKey && e.shiftKey && e.key === 'z')) &&
      !isInputFocused
    ) {
      e.preventDefault()
      if (actionHistory.canRedo) {
        actionHistory.redo()
        toast.success('Redone', {
          description: 'Action has been reapplied',
        })
      } else {
        toast.info('Nothing to redo', {
          description: 'No actions available to redo',
        })
      }
    }
  }

  window.addEventListener('keydown', keyDownHandler)
})

onUnmounted(() => {
  if (keyDownHandler) {
    window.removeEventListener('keydown', keyDownHandler)
  }
  
  // Cleanup notification channel
  if (notificationChannel) {
    const userId = userStore.user?.uuid || userStore.user?.id
    if (userId) {
      unsubscribe(`private-user.${userId}`)
      notificationChannel = null
    }
  }
})
</script>


