<template>
  <div :class="containerClasses">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
    />
    <div v-else :class="fallbackClasses.value">
      <span :class="fallbackTextClasses.value">{{ fallbackText || alt }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = withDefaults(defineProps<{
  src?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg'
  fallbackText?: string
}>(), {
  size: 'md',
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

const fallbackClasses = computed(() => `w-full h-full flex items-center justify-center ${theme.bgCardSolid}`)
const fallbackTextClasses = computed(() => `text-xs font-semibold ${theme.textSecondary}`)
</script>

