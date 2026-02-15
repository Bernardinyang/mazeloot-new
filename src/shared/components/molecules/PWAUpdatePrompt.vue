<template>
  <div
    v-if="updateAvailable && !dismissed"
    role="status"
    aria-live="polite"
    aria-label="New version available"
    class="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] z-50 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 animate-in"
  >
    <div class="flex items-center gap-3">
      <p class="flex-1 text-sm text-gray-900 dark:text-white">
        New version available.
      </p>
      <div class="flex gap-2 flex-shrink-0">
        <Button size="sm" @click="applyUpdate">
          Refresh
        </Button>
        <Button size="sm" variant="ghost" @click="dismiss">
          Later
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '@/shared/components/shadcn/button'
import { usePWAUpdate } from '@/shared/composables/usePWAUpdate'

const { updateAvailable, applyUpdate: doApplyUpdate, dismiss: doDismiss } = usePWAUpdate()
const dismissed = ref(false)

const applyUpdate = () => {
  doApplyUpdate()
}

const dismiss = () => {
  dismissed.value = true
  doDismiss()
}
</script>
