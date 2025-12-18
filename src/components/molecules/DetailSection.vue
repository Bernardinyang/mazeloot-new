<template>
  <div :class="['space-y-4', containerClass]">
    <div v-if="title" class="flex items-center gap-2 mb-1">
      <component v-if="icon" :is="icon" class="h-4 w-4" :class="theme.textSecondary" />
      <h3 :class="['text-sm font-semibold', theme.textPrimary]">{{ title }}</h3>
    </div>
    <div :class="['space-y-3', contentClass]">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  containerClass: {
    type: String,
    default: '',
  },
  contentClass: {
    type: String,
    default: '',
  },
})

const theme = useThemeClasses()
</script>
