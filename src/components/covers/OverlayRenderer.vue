<template>
  <div v-if="enabled" :class="overlayClasses" :style="overlayStyles" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true,
  },
  gradient: {
    type: String,
    default: 'bottom',
    validator: value => ['top', 'bottom', 'left', 'right', 'none'].includes(value),
  },
  opacity: {
    type: Number,
    default: 0.55,
    validator: value => value >= 0 && value <= 1,
  },
})

/**
 * Overlay classes - always absolute positioned above media, below content
 */
const overlayClasses = computed(() => {
  return ['absolute', 'inset-0', 'pointer-events-none', 'z-10']
})

/**
 * Overlay styles based on gradient and opacity
 */
const overlayStyles = computed(() => {
  const styles = {}

  if (props.gradient === 'none') {
    // Solid overlay
    styles.backgroundColor = `rgba(0, 0, 0, ${props.opacity})`
  } else {
    // Gradient overlay
    let gradientDirection = 'to bottom'

    if (props.gradient === 'top') {
      gradientDirection = 'to top'
    } else if (props.gradient === 'left') {
      gradientDirection = 'to left'
    } else if (props.gradient === 'right') {
      gradientDirection = 'to right'
    } else if (props.gradient === 'bottom') {
      gradientDirection = 'to bottom'
    }

    const gradientColor = `rgba(0, 0, 0, ${props.opacity})`
    styles.background = `linear-gradient(${gradientDirection}, transparent, ${gradientColor})`
  }

  return styles
})
</script>
