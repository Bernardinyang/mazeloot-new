<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <header>
        <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Analytics</h1>
        <p :class="['mt-1 text-sm', theme.textSecondary]">Activity insights and metrics (coming soon).</p>
      </header>
      <div
        :class="[
          'rounded-xl border border-border bg-card p-8 sm:p-12 text-center shadow-sm animate-fade-in',
        ]"
      >
        <p :class="['text-sm', theme.textSecondary]">Activity logs and charts will be displayed here.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()
</script>
