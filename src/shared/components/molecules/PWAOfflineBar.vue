<template>
  <div
    v-if="isOffline"
    role="status"
    aria-live="polite"
    aria-label="You are offline"
    class="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-white text-center py-2 px-4 text-sm"
  >
    You're offline. Some features may be limited.
  </div>
</template>

<script setup>
import { useOffline } from '@/shared/composables/useOffline'

const { isOffline } = useOffline()
</script>
