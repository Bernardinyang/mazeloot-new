<template>
  <div :class="containerClasses">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
    />
    <div v-else :class="fallbackClasses">
      <span :class="fallbackTextClasses">{{ fallbackText || alt }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  src: {
    type: [String, null],
    default: null,
  },
  alt: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value),
  },
  fallbackText: {
    type: String,
    default: undefined,
  },
})

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-20 w-20',
}

const theme = useThemeClasses()

const containerClasses = computed(() => {
  return [
    sizeClasses[props.size],
    'rounded-lg overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg',
    theme.bgCardSolid,
  ].join(' ')
})

const fallbackClasses = computed(
  () => `w-full h-full flex items-center justify-center ${theme.bgCardSolid}`
)
const fallbackTextClasses = computed(() => `text-xs font-semibold ${theme.textSecondary}`)
</script>
