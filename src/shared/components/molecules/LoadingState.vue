<template>
  <div :class="['flex flex-col items-center justify-center py-12', containerClass]">
    <Loader2 :class="['animate-spin', iconClass]" />
    <p v-if="message" :class="['mt-4 text-sm', theme.textSecondary]">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  message: {
    type: String,
    default: 'Loading...',
  },
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value),
  },
  containerClass: {
    type: String,
    default: '',
  },
})

const theme = useThemeClasses()

const iconClass = computed(() => {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }
  return `${sizes[props.size]} ${theme.textSecondary}`
})
</script>
