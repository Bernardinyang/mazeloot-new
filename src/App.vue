<template>
  <div class="min-h-screen min-h-[100dvh]">
    <RouteLoadingOverlay :is-loading="isRouteLoading" />
    <RouterView />
    <Toaster />
    <PWAInstallPrompt />
    <PWADebugInfo />
    <CookieConsent v-if="isPublicRoute" />

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
import { computed, provide, ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { isRouteLoading } from '@/shared/router'
import RouteLoadingOverlay from '@/shared/components/organisms/RouteLoadingOverlay.vue'
import Toaster from '@/shared/components/organisms/Toaster.vue'
import UploadQueueButton from '@/shared/components/organisms/UploadQueueButton.vue'
import BackgroundUploadQueueModal from '@/shared/components/organisms/BackgroundUploadQueueModal.vue'
import PWAInstallPrompt from '@/shared/components/molecules/PWAInstallPrompt.vue'
import PWADebugInfo from '@/shared/components/molecules/PWADebugInfo.vue'
import CookieConsent from '@/shared/components/molecules/CookieConsent.vue'
import { useActionHistoryStore } from '@/shared/stores/actionHistory'
import { useBackgroundUploadManager } from '@/shared/composables/useBackgroundUploadManager'
import { useNotificationsStore } from '@/shared/stores/notifications'
import { useUserStore } from '@/shared/stores/user'
import { toast } from '@/shared/utils/toast'
import { initAnalytics } from '@/shared/composables/useAnalytics'
import { initErrorTracking } from '@/shared/composables/useErrorTracking'

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

const phaseStorageRefreshTrigger = ref(0)
provide('phaseStorageRefreshTrigger', phaseStorageRefreshTrigger)
watch(
  () => (backgroundUploadManager.uploadQueue.value || []).filter(u => u.status === 'completed').length,
  (completedCount, prevCount) => {
    if (prevCount != null && completedCount > prevCount) {
      phaseStorageRefreshTrigger.value++
    }
  }
)

let keyDownHandler = null

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

// Initialize notifications and Pusher subscription
const initializeNotifications = async () => {
  if (!userStore.isAuthenticated) return

  try {
    // Initialize store (fetches from API and sets up Pusher subscription)
    await notificationsStore.initialize()
    console.log('Notifications initialized, count:', notificationsStore.allNotifications.length)
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
      notificationsStore.reset()
    }
  },
  { immediate: true }
)

onMounted(() => {
  const actionHistory = useActionHistoryStore()
  
  // Initialize analytics and error tracking (will check cookie consent internally)
  initAnalytics()
  initErrorTracking()
  
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
  
  // Cleanup notification subscription
  notificationsStore.cleanupPusherSubscription()
})
</script>


