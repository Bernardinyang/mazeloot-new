<template>
  <div
    :class="['animate-pulse rounded', theme.bgSkeleton, props.class]"
    :style="props.style"
    role="presentation"
    aria-hidden="true"
  />
</template>

<script setup>
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  class: { type: String, default: '' },
  style: { type: Object, default: () => ({}) },
})

const theme = useThemeClasses()
</script>
