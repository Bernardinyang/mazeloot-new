<template>
  <div
    role="status"
    aria-live="polite"
    :class="[
      'flex items-center gap-3 rounded-xl border p-4 min-w-0',
      'border-amber-200/80 dark:border-amber-800/50',
      'bg-amber-50/90 dark:bg-amber-950/30',
      'shadow-sm shadow-amber-200/20 dark:shadow-amber-900/20',
      'transition-shadow duration-200 ease-out motion-reduce:transition-none',
      $attrs.class,
    ]"
  >
    <div
      class="flex flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 size-8"
      aria-hidden="true"
    >
      <Lock class="h-4 w-4 text-amber-600 dark:text-amber-400" />
    </div>
    <div class="text-sm text-amber-800 dark:text-amber-200 leading-relaxed min-w-0">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { Lock } from '@/shared/utils/lucideAnimated'

defineOptions({
  inheritAttrs: false,
})
</script>
