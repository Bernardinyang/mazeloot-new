<template>
  <div class="min-h-screen">
    <RouterView />
    <Toaster />

    <!-- Floating Upload Queue Button -->
    <UploadQueueButton
      v-if="!isPublicRoute"
      :floating="true"
      @click="showUploadQueueModal = true"
    />

    <!-- Upload Queue Modal -->
    <BackgroundUploadQueueModal v-if="!isPublicRoute" v-model="showUploadQueueModal" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Toaster from './components/organisms/Toaster.vue'
import UploadQueueButton from './components/organisms/UploadQueueButton.vue'
import BackgroundUploadQueueModal from './components/organisms/BackgroundUploadQueueModal.vue'
import { useActionHistoryStore } from './stores/actionHistory'
import { toast } from './utils/toast'

const route = useRoute()
const showUploadQueueModal = ref(false)

const isPublicRoute = computed(() => {
  return route.matched.some(record => record.meta.requiresAuth === false)
})

// Global keyboard shortcuts for undo/redo
let keyDownHandler = null

onMounted(() => {
  const actionHistory = useActionHistoryStore()

  // Add keyboard shortcuts for undo/redo
  keyDownHandler = e => {
    // Prevent default browser undo/redo in input fields
    const isInputFocused =
      e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable

    // Undo: Ctrl+Z (Windows/Linux) or Cmd+Z (Mac)
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

    // Redo: Ctrl+Y (Windows/Linux) or Cmd+Shift+Z (Mac)
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
})
</script>


