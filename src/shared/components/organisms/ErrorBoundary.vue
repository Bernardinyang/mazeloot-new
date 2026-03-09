<template>
  <div>
    <div v-if="errored" class="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <p class="text-lg font-medium text-foreground">Something went wrong</p>
      <p class="max-w-md text-sm text-muted-foreground">We’ve recorded the error. Try refreshing the page.</p>
      <button
        type="button"
        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        @click="errored = false; error = null"
      >
        Try again
      </button>
    </div>
    <slot v-else />
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const errored = ref(false)
const error = ref(null)

onErrorCaptured((err, instance, info) => {
  error.value = err
  errored.value = true
  if (import.meta.env.DEV) {
    console.error('ErrorBoundary:', err, info)
  }
  return false
})
</script>
