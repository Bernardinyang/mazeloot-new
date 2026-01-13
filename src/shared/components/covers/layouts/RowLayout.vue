<template>
  <div :class="containerClasses" :style="containerStyles">
    <!-- Media Section -->
    <div :class="mediaContainerClasses" :style="mediaContainerStyles">
      <CoverMedia
        :src="media.url || media.src"
        :alt="media.alt || 'Cover image'"
        :aspect-ratio="config.media?.aspect_ratio || config.media?.aspectRatio || '16:9'"
        :fit="config.media?.fit || 'cover'"
        :bleed="config.media?.bleed || 'contained'"
        :max-width="config.media?.max_width || config.media?.maxWidth"
        :focal-point="media.focalPoint"
      />
    </div>

    <!-- Content Section -->
    <div v-if="content" :class="contentClasses" :style="contentStyles">
      <slot name="content" :content="content" :config="config">
        <!-- Default content rendering -->
        <div v-if="content.title" :class="titleClasses">{{ content.title }}</div>
        <div v-if="content.date" :class="dateClasses">{{ content.date }}</div>
        <div v-if="content.subtitle" :class="subtitleClasses">{{ content.subtitle }}</div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CoverMedia from '@/shared/components/covers/CoverMedia.vue'

const props = defineProps({
  config: {
    type: Object,
    required: true,
    validator: value => value.layout === 'row',
  },
  media: {
    type: Object,
    required: true,
  },
  content: {
    type: Object,
    default: null,
  },
})

/**
 * Container classes - flex row layout
 */
const containerClasses = computed(() => {
  return ['flex', 'flex-row', 'w-full', 'items-center', 'gap-8']
})

/**
 * Container styles with spacing
 */
const containerStyles = computed(() => {
  const styles = {}
  const paddingX = props.config.spacing?.padding_x ?? 80
  const paddingY = props.config.spacing?.padding_y ?? 60

  styles.paddingLeft = `${paddingX}px`
  styles.paddingRight = `${paddingX}px`
  styles.paddingTop = `${paddingY}px`
  styles.paddingBottom = `${paddingY}px`

  return styles
})

/**
 * Media container classes
 */
const mediaContainerClasses = computed(() => {
  return ['flex-shrink-0']
})

/**
 * Media container styles based on aspect ratio
 */
const mediaContainerStyles = computed(() => {
  const styles = {}
  const aspectRatio = props.config.media?.aspect_ratio || '16:9'

  // Calculate width based on aspect ratio (for row layouts, we typically want the media to take up a portion)
  if (aspectRatio) {
    const [width, height] = aspectRatio.split(':').map(Number)
    const ratio = width / height
    styles.maxWidth = '50%'
    styles.flexBasis = '50%'
  }

  if (props.config.media?.max_width) {
    styles.maxWidth =
      typeof props.config.media.max_width === 'number'
        ? `${props.config.media.max_width}px`
        : props.config.media.max_width
  }

  return styles
})

/**
 * Content classes based on alignment
 */
const contentClasses = computed(() => {
  const classes = ['flex-1']
  const alignment = props.config.content?.alignment || 'middle-left'

  if (alignment.includes('center')) {
    classes.push('text-center')
  } else if (alignment.includes('right')) {
    classes.push('text-right')
  } else {
    classes.push('text-left')
  }

  return classes
})

/**
 * Content styles
 */
const contentStyles = computed(() => {
  return {}
})

/**
 * Title classes
 */
const titleClasses = computed(() => {
  return 'text-3xl md:text-5xl font-bold mb-4'
})

/**
 * Date classes
 */
const dateClasses = computed(() => {
  return 'text-base md:text-lg uppercase tracking-wide opacity-90'
})

/**
 * Subtitle classes
 */
const subtitleClasses = computed(() => {
  return 'text-lg md:text-xl font-medium mt-2'
})
</script>
