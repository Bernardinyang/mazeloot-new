<template>
  <svg
    :class="cn('inline-block', sizeClass, colorClass, $attrs.class || '')"
    :height="size"
    :viewBox="viewBox"
    :width="size"
    fill="none"
    stroke="currentColor"
    v-bind="$attrs"
  >
    <slot />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { cn } from '@/shared/lib/utils'

const props = defineProps({
  size: {
    type: [Number, String],
    default: 24,
  },
  viewBox: {
    type: String,
    default: '0 0 24 24',
  },
  color: {
    type: String,
    default: '',
  },
})

const sizeClass = computed(() => {
  if (typeof props.size === 'string') {
    return props.size
  }
  // For numeric sizes, use inline styles or specific Tailwind classes
  const sizeMap = {
    16: 'w-4 h-4',
    20: 'w-5 h-5',
    24: 'w-6 h-6',
    32: 'w-8 h-8',
  }
  return sizeMap[props.size] || `w-${props.size} h-${props.size}`
})

const colorClass = computed(() => {
  return props.color ? `text-${props.color}` : ''
})
</script>
