<template>
  <component
    v-if="layoutEngine"
    :is="layoutEngine"
    :config="normalizedConfig"
    :media="media"
    :content="content"
  >
    <template #content="{ content: slotContent, config: slotConfig }">
      <slot name="content" :content="slotContent" :config="slotConfig" />
    </template>
  </component>
  <div v-else class="w-full h-full">
    <!-- Layout 'none' - should be handled by parent, but show empty as fallback -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LayoutEngines } from './layouts/LayoutEngineRegistry'
import { getDefaultLayoutConfig } from '@/composables/useCoverLayouts'

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

/**
 * Get the layout engine component based on config.layout
 */
const layoutEngine = computed(() => {
  const layoutType = props.config?.layout || 'stack'

  // Don't render anything for 'none' layout - this should be handled by parent
  if (layoutType === 'none') {
    return null
  }

  const engine = LayoutEngines[layoutType] || LayoutEngines.stack
  return engine
})

/**
 * Ensure config has required structure with defaults
 */
const normalizedConfig = computed(() => {
  const defaultConfig = getDefaultLayoutConfig()
  const normalized = {
    layout: props.config?.layout || defaultConfig.layout,
    media: {
      ...defaultConfig.media,
      ...(props.config?.media || {}),
    },
    content: {
      ...defaultConfig.content,
      ...(props.config?.content || {}),
    },
    overlay: {
      ...defaultConfig.overlay,
      ...(props.config?.overlay || {}),
    },
    spacing: {
      ...defaultConfig.spacing,
      ...(props.config?.spacing || {}),
    },
  }
  return normalized
})
</script>
