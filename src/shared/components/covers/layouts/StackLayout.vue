<template>
  <div :class="containerClasses" :style="containerStyles">
    <!-- Media Layer -->
    <CoverMedia
      :src="media.url || media.src || ''"
      :alt="media.alt || 'Cover image'"
      :aspect-ratio="config.media?.aspect_ratio || config.media?.aspectRatio || '16:9'"
      :fit="config.media?.fit || 'cover'"
      :bleed="config.media?.bleed || 'full'"
      :max-width="config.media?.max_width || config.media?.maxWidth"
      :focal-point="media.focalPoint"
    />

    <!-- Overlay Layer (above media, below content) -->
    <OverlayRenderer
      :enabled="config.overlay?.enabled !== false"
      :gradient="config.overlay?.gradient || 'bottom'"
      :opacity="config.overlay?.opacity ?? 0.55"
    />

    <!-- Content Layer -->
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
import { computed, onMounted } from 'vue'
import CoverMedia from '@/shared/components/covers/CoverMedia.vue'
import OverlayRenderer from '@/shared/components/covers/OverlayRenderer.vue'

const props = defineProps({
  config: {
    type: Object,
    required: true,
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

// Component mounted - layout is ready

/**
 * Container classes - full bleed by default
 */
const containerClasses = computed(() => {
  const classes = ['relative', 'w-full', 'overflow-hidden']
  // For full bleed, we need a minimum height (use min-h-screen for preview)
  if (props.config.media?.bleed === 'full') {
    classes.push('min-h-screen', 'h-screen')
  } else {
    // For contained layouts, use aspect ratio if specified
    const aspectRatio = props.config.media?.aspect_ratio || props.config.media?.aspectRatio
    if (aspectRatio) {
      classes.push('relative')
    }
  }
  return classes
})

/**
 * Container styles based on spacing
 */
const containerStyles = computed(() => {
  const styles = {}

  // Apply padding if content placement is not overlay
  if (props.config.content?.placement !== 'overlay') {
    const paddingX = props.config.spacing?.padding_x ?? 80
    const paddingY = props.config.spacing?.padding_y ?? 60
    styles.paddingLeft = `${paddingX}px`
    styles.paddingRight = `${paddingX}px`
    styles.paddingTop = `${paddingY}px`
    styles.paddingBottom = `${paddingY}px`
  }

  return styles
})

/**
 * Content classes based on placement
 */
const contentClasses = computed(() => {
  const classes = []
  const placement = props.config.content?.placement || 'overlay'

  if (placement === 'overlay') {
    classes.push('absolute', 'z-20')
  } else {
    classes.push('relative', 'z-20')
  }

  // Add alignment classes
  const alignment = props.config.content?.alignment || 'bottom-left'
  if (alignment.includes('top')) {
    classes.push('top-0')
  } else if (alignment.includes('middle')) {
    classes.push('top-1/2', '-translate-y-1/2')
  } else {
    classes.push('bottom-0')
  }

  if (alignment.includes('left')) {
    classes.push('left-0', 'text-left')
  } else if (alignment.includes('center')) {
    classes.push('left-1/2', '-translate-x-1/2', 'text-center')
  } else {
    classes.push('right-0', 'text-right')
  }

  return classes
})

/**
 * Content styles based on alignment and placement
 */
const contentStyles = computed(() => {
  const styles = {}
  const alignment = props.config.content?.alignment || 'bottom-left'

  // If overlay placement, apply padding from spacing config
  if (props.config.content?.placement === 'overlay') {
    const paddingX = props.config.spacing?.padding_x ?? 80
    const paddingY = props.config.spacing?.padding_y ?? 60

    if (alignment.includes('left')) {
      styles.left = `${paddingX}px`
    } else if (alignment.includes('right')) {
      styles.right = `${paddingX}px`
    }

    if (alignment.includes('top')) {
      styles.top = `${paddingY}px`
    } else if (alignment.includes('bottom')) {
      styles.bottom = `${paddingY}px`
    }
  }

  return styles
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
