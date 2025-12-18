<template>
  <div class="space-y-2">
    <label v-if="label" :class="['text-sm font-medium', theme.textPrimary]">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot />
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
    <p v-if="hint && !error" class="text-xs text-muted-foreground">{{ hint }}</p>
  </div>
</template>

<script setup>
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  label: {
    type: String,
    default: undefined,
  },
  error: {
    type: String,
    default: undefined,
  },
  hint: {
    type: String,
    default: undefined,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const theme = useThemeClasses()
</script>
