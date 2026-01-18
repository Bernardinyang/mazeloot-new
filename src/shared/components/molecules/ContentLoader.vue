<template>
  <div :class="['p-8 flex items-center justify-center', minHeightClass, containerClass]">
    <div class="text-center space-y-4">
      <Loader2 :class="[theme.textTertiary, 'h-8 w-8 animate-spin mx-auto', iconClass]" />
      <p v-if="message" :class="[theme.textSecondary, 'text-sm font-medium']">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Loader2 } from '@/shared/utils/lucideAnimated'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  message: {
    type: String,
    default: 'Loading...',
  },
  minHeight: {
    type: String,
    default: '60vh',
    validator: value => ['none', '40vh', '50vh', '60vh', '70vh', '80vh', 'full'].includes(value),
  },
  containerClass: {
    type: String,
    default: '',
  },
  iconClass: {
    type: String,
    default: '',
  },
})

const theme = useThemeClasses()

const minHeightClass = computed(() => {
  if (props.minHeight === 'none') return ''
  if (props.minHeight === 'full') return 'min-h-screen'
  return `min-h-[${props.minHeight}]`
})
</script>
