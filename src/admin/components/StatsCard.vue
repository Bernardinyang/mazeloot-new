<template>
  <div :class="['p-4 sm:p-6 rounded-xl border border-border bg-card shadow-sm', theme.bgCard]">
    <h3 :class="['text-lg font-semibold mb-2', theme.textPrimary]">{{ title }}</h3>
    <p :class="['text-3xl font-bold tabular-nums', theme.textPrimary]">{{ value }}</p>
    <p v-if="subtitle" :class="['text-sm mt-1', theme.textSecondary]">{{ subtitle }}</p>
  </div>
</template>

<script setup>
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  subtitle: { type: String, default: null },
})
</script>
