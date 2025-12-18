<template>
  <div
    :class="[
      'rounded-xl border p-4 transition-all hover:shadow-md',
      theme.bgCardSolid,
      theme.borderSecondary,
      containerClass,
    ]"
  >
    <div v-if="title || icon" class="flex items-center gap-2 mb-3">
      <component v-if="icon" :is="icon" class="h-4 w-4" :class="theme.textSecondary" />
      <h3 v-if="title" :class="['text-sm font-semibold', theme.textPrimary]">{{ title }}</h3>
    </div>
    <div v-if="description" :class="['text-xs mb-3', theme.textSecondary]">
      {{ description }}
    </div>
    <div :class="['space-y-2', contentClass]">
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
  description: {
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
