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
import Toaster from '@/shared/components/organisms/Toaster.vue'
import UploadQueueButton from '@/shared/components/organisms/UploadQueueButton.vue'
import BackgroundUploadQueueModal from '@/shared/components/organisms/BackgroundUploadQueueModal.vue'
import PWAInstallPrompt from '@/shared/components/molecules/PWAInstallPrompt.vue'
import PWADebugInfo from '@/shared/components/molecules/PWADebugInfo.vue'
import { useActionHistoryStore } from '@/shared/stores/actionHistory'
import { useBackgroundUploadManager } from '@/shared/composables/useBackgroundUploadManager'
import { useNotificationsStore } from '@/shared/stores/notifications'
import { useUserStore } from '@/shared/stores/user'
import { toast } from '@/shared/utils/toast'

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


