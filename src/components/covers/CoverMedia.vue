<template>
  <div :class="containerClasses" :style="containerStyles">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      :class="imageClasses"
      :style="imageStyles"
      @error="handleImageError"
    />
    <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
      <span class="text-xs text-gray-400">No image</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: false,
    default: '',
  },
  alt: {
    type: String,
    default: 'Cover image',
  },
  aspectRatio: {
    type: String,
    default: '16:9',
    validator: value => {
      // Validates format like "16:9", "4:3", "1:1", etc.
      return /^\d+:\d+$/.test(value)
    },
  },
  fit: {
    type: String,
    default: 'cover',
    validator: value => ['cover', 'contain', 'fill'].includes(value),
  },
  bleed: {
    type: String,
    default: 'full',
    validator: value => ['full', 'contained', 'none'].includes(value),
  },
  maxWidth: {
    type: [Number, String, null],
    default: null,
  },
})

const emit = defineEmits(['error'])

onMounted(() => {
  if (!props.src) {
    console.warn('[CoverMedia] No src provided!')
  }
})

/**
 * Calculate aspect ratio padding from string like "16:9"
 */
const aspectRatioPadding = computed(() => {
  if (!props.aspectRatio) return null

  const [width, height] = props.aspectRatio.split(':').map(Number)
  return (height / width) * 100
})

/**
 * Container classes based on bleed behavior
 */
const containerClasses = computed(() => {
  const classes = ['relative', 'w-full']

  if (props.bleed === 'full') {
    classes.push('w-full', 'h-full', 'absolute', 'inset-0')
  } else if (props.bleed === 'contained') {
    classes.push('w-full')
    if (props.aspectRatio) {
      // Use padding-top trick for aspect ratio
      return classes
    }
  }

  return classes
})

/**
 * Container styles
 */
const containerStyles = computed(() => {
  const styles = {}

  if (props.bleed === 'contained' && props.aspectRatio && aspectRatioPadding.value) {
    styles.paddingTop = `${aspectRatioPadding.value}%`
    styles.position = 'relative'
  }

  if (props.maxWidth && props.bleed !== 'full') {
    styles.maxWidth = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
    styles.marginLeft = 'auto'
    styles.marginRight = 'auto'
  }

  return styles
})

/**
 * Image classes
 */
const imageClasses = computed(() => {
  const classes = []

  if (props.bleed === 'full') {
    classes.push('absolute', 'inset-0', 'w-full', 'h-full')
  } else {
    classes.push('w-full')
    if (props.bleed === 'contained' && props.aspectRatio) {
      classes.push('absolute', 'inset-0', 'h-full')
    } else {
      classes.push('h-full')
    }
  }

  return classes
})

/**
 * Image styles based on fit prop
 */
const imageStyles = computed(() => {
  const styles = {}

  // Apply object-fit based on fit prop
  if (props.fit === 'cover') {
    styles.objectFit = 'cover'
  } else if (props.fit === 'contain') {
    styles.objectFit = 'contain'
  } else if (props.fit === 'fill') {
    styles.objectFit = 'fill'
  }

  // Object position for better image centering
  styles.objectPosition = 'center'

  return styles
})

/**
 * Handle image load errors
 */
const handleImageError = event => {
  emit('error', event)
}
</script>
