<template>
  <svg
    :class="cn('inline-block', sizeClass, colorClass, $attrs.class)"
    :width="size"
    :height="size"
    :viewBox="viewBox"
    fill="none"
    stroke="currentColor"
    v-bind="$attrs"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  size?: number | string
  color?: string
  viewBox?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  viewBox: '0 0 24 24',
})

const sizeClass = computed(() => {
  if (typeof props.size === 'string') {
    return props.size
  }
  // For numeric sizes, use inline styles or specific Tailwind classes
  const sizeMap: Record<number, string> = {
    16: 'w-4 h-4',
    20: 'w-5 h-5',
    24: 'w-6 h-6',
    32: 'w-8 h-8',
  }
  return sizeMap[props.size as number] || `w-${props.size} h-${props.size}`
})

const colorClass = computed(() => {
  return props.color ? `text-${props.color}` : ''
})
</script>

