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

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'

interface Props {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  required: false,
})

const theme = useThemeClasses()
</script>
