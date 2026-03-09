<template>
  <div
    v-if="visible"
    data-banner="phase-set-limit"
    role="alert"
    aria-live="polite"
    class="mb-4 flex items-start gap-4 rounded-2xl border border-amber-300/90 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 via-amber-50/95 to-orange-50 px-4 py-4 shadow-md dark:border-amber-600/60 dark:border-l-amber-500 dark:from-amber-950/50 dark:via-amber-900/30 dark:to-orange-950/40"
  >
    <div
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/25 dark:bg-amber-500/35 text-amber-600 dark:text-amber-400"
      aria-hidden="true"
    >
      <Info class="size-5" />
    </div>
    <div class="min-w-0 flex-1 pt-0.5">
      <p class="text-sm font-semibold text-amber-900 dark:text-amber-100">
        Set limit reached
      </p>
      <p class="mt-0.5 text-sm text-amber-800/90 dark:text-amber-200/90">
        You're using {{ currentCount }} of {{ limit }} sets. Upgrade your plan to add more.
      </p>
    </div>
    <button
      type="button"
      class="shrink-0 rounded-xl p-2 text-amber-600 hover:bg-amber-200/60 dark:text-amber-400 dark:hover:bg-amber-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      aria-label="Dismiss banner"
      @click="emit('dismiss')"
    >
      <X class="size-5" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup>
import { Info, X } from '@/shared/utils/lucideAnimated'

defineProps({
  visible: { type: Boolean, required: true },
  currentCount: { type: Number, required: true },
  limit: { type: Number, required: true },
})

const emit = defineEmits(['dismiss'])
</script>
