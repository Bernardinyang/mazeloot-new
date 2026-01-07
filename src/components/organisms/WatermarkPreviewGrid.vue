<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h4 :class="theme.textPrimary" class="text-sm font-semibold">Preview on Sample Images</h4>
      <button
        v-if="showPreviewOnMedia"
        @click="$emit('preview-on-media')"
        class="text-xs text-accent hover:text-accent/80 font-medium"
      >
        Preview on Your Media →
      </button>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="(sample, index) in sampleImages"
        :key="index"
        class="relative rounded-lg overflow-hidden border-2"
        :class="[theme.borderSecondary, theme.bgCard]"
      >
        <div class="aspect-[4/3] relative">
          <img :src="sample.url" :alt="sample.label" class="w-full h-full object-cover" />
          <!-- Watermark Overlay - Text -->
          <div
            v-if="watermark.type === 'text' && watermark.text"
            class="absolute pointer-events-none"
            :style="getWatermarkStyle(sample.aspect)"
          >
            <span :style="getTextStyle(sample.aspect)">
              {{ watermark.text }}
            </span>
          </div>
          <!-- Watermark Overlay - Image -->
          <img
            v-else-if="watermark.type === 'image' && watermark.imageUrl"
            :src="watermark.imageUrl"
            :alt="watermark.name"
            class="absolute pointer-events-none"
            :style="getImageWatermarkStyle(sample.aspect)"
          />
        </div>
        <p class="text-xs text-center py-2" :class="theme.textSecondary">
          {{ sample.label }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  watermark: {
    type: Object,
    required: true,
  },
  showPreviewOnMedia: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['preview-on-media'])

const theme = useThemeClasses()

const sampleImages = [
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop',
    label: 'Portrait',
    aspect: 'portrait',
  },
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    label: 'Landscape',
    aspect: 'landscape',
  },
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop',
    label: 'Square',
    aspect: 'square',
  },
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=400&fit=crop',
    label: 'Panoramic',
    aspect: 'panoramic',
  },
]

const getFontStyleProperties = style => {
  if (!style) {
    return {
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
    }
  }
  const styles = style.split(/[\s-]+/).filter(s => s.length > 0)
  return {
    fontWeight: styles.includes('bold') ? 'bold' : 'normal',
    fontStyle: styles.includes('italic') ? 'italic' : 'normal',
    textDecoration: styles.includes('underline') ? 'underline' : 'none',
  }
}

const getWatermarkStyle = aspect => {
  const positions = {
    'top-left': { top: '10%', left: '10%', transform: 'translate(0, 0)' },
    top: { top: '10%', left: '50%', transform: 'translate(-50%, 0)' },
    'top-right': { top: '10%', right: '10%', transform: 'translate(0, 0)' },
    left: { top: '50%', left: '10%', transform: 'translate(0, -50%)' },
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    right: { top: '50%', right: '10%', transform: 'translate(0, -50%)' },
    'bottom-left': { bottom: '10%', left: '10%', transform: 'translate(0, 0)' },
    bottom: { bottom: '10%', left: '50%', transform: 'translate(-50%, 0)' },
    'bottom-right': { bottom: '10%', right: '10%', transform: 'translate(0, 0)' },
  }
  return {
    ...positions[props.watermark.position || 'center'],
    opacity: (props.watermark.opacity || 80) / 100,
  }
}

const getTextStyle = aspect => {
  const scalePercent = (props.watermark.scale || 50) / 100
  const baseSize = aspect === 'panoramic' ? 1.2 : aspect === 'portrait' ? 1.5 : 1.3
  const fontSize = (scalePercent * baseSize * 0.1).toFixed(2) + 'rem'

  return {
    fontFamily: props.watermark.fontFamily || 'Pacifico',
    fontSize,
    color: props.watermark.fontColor || '#FFFFFF',
    backgroundColor: props.watermark.backgroundColor || 'transparent',
    padding: props.watermark.padding ? `${props.watermark.padding * 0.1}px` : '4px',
    borderRadius: props.watermark.borderRadius ? `${props.watermark.borderRadius * 0.1}px` : '0px',
    borderWidth: props.watermark.borderWidth ? `${props.watermark.borderWidth * 0.1}px` : '0px',
    borderColor: props.watermark.borderColor || 'transparent',
    borderStyle: props.watermark.borderStyle || 'solid',
    lineHeight: props.watermark.lineHeight || 1.2,
    letterSpacing: props.watermark.letterSpacing ? `${props.watermark.letterSpacing * 0.1}px` : '0px',
    textTransform: props.watermark.textTransform || 'none',
    whiteSpace: 'nowrap',
    ...getFontStyleProperties(props.watermark.fontStyle),
  }
}

const getImageWatermarkStyle = aspect => {
  const scalePercent = (props.watermark.scale || 100) / 100
  const positions = {
    'top-left': { top: '10%', left: '10%', transform: 'translate(0, 0)' },
    top: { top: '10%', left: '50%', transform: 'translate(-50%, 0)' },
    'top-right': { top: '10%', right: '10%', transform: 'translate(0, 0)' },
    left: { top: '50%', left: '10%', transform: 'translate(0, -50%)' },
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    right: { top: '50%', right: '10%', transform: 'translate(0, -50%)' },
    'bottom-left': { bottom: '10%', left: '10%', transform: 'translate(0, 0)' },
    bottom: { bottom: '10%', left: '50%', transform: 'translate(-50%, 0)' },
    'bottom-right': { bottom: '10%', right: '10%', transform: 'translate(0, 0)' },
  }
  return {
    ...positions[props.watermark.position || 'center'],
    width: `${scalePercent * 25}%`,
    maxWidth: '80%',
    maxHeight: '80%',
    opacity: (props.watermark.opacity || 80) / 100,
    objectFit: 'contain',
  }
}
</script>

