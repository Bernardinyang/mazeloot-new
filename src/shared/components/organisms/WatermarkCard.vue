<template>
  <div
    class="flex flex-col items-center gap-2 cursor-pointer group relative"
    @click="$emit('edit', watermark.id)"
  >
    <!-- Preview Container -->
    <div
      class="w-40 h-40 rounded border-2 transition-all hover:border-accent overflow-hidden relative bg-gray-100 dark:bg-gray-800"
      :class="[theme.borderSecondary, theme.bgCard]"
    >
      <!-- Sample Image with Watermark -->
      <div class="relative w-full h-full">
        <img
          :src="sampleImageUrl"
          :alt="watermark.name"
          class="w-full h-full object-cover"
        />
        <!-- Watermark Overlay - Text -->
        <div
          v-if="watermark.type === 'text' && watermark.text"
          class="absolute pointer-events-none"
          :style="getWatermarkStyle()"
        >
          <span :style="getTextStyle()">
            {{ watermark.text }}
          </span>
        </div>
        <!-- Watermark Overlay - Image -->
        <img
          v-else-if="watermark.type === 'image' && watermark.imageUrl"
          :src="watermark.imageUrl"
          :alt="watermark.name"
          class="absolute pointer-events-none"
          :style="getImageWatermarkStyle()"
        />
      </div>

      <!-- Quick Actions Overlay -->
      <div
        class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
      >
        <button
          @click.stop="$emit('edit', watermark.id)"
          class="p-2 rounded-md bg-accent hover:bg-accent/90 text-accent-foreground transition-colors light:hover:text-white"
          title="Edit"
        >
          <Edit class="h-4 w-4" />
        </button>
        <button
          @click.stop="$emit('duplicate', watermark.id)"
          class="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          title="Duplicate"
        >
          <Copy class="h-4 w-4" />
        </button>
        <button
          @click.stop="$emit('delete', watermark.id)"
          class="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
          title="Delete"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Usage Badge -->
      <div
        v-if="usageCount !== undefined && usageCount > 0"
        class="absolute top-2 left-2 px-2 py-1 rounded-md bg-accent/90 text-accent-foreground text-xs font-semibold"
      >
        {{ usageCount }} {{ usageCount === 1 ? 'use' : 'uses' }}
      </div>
    </div>

    <!-- Watermark Name -->
    <span class="text-xs font-medium uppercase text-center max-w-[160px] truncate" :class="theme.textSecondary">
      {{ watermark.name }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Edit, Copy, X } from '@/shared/utils/lucideAnimated'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  watermark: {
    type: Object,
    required: true,
  },
  usageCount: {
    type: Number,
    default: undefined,
  },
  sampleImageIndex: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['edit', 'duplicate', 'delete'])

const theme = useThemeClasses()

// Sample images for preview (portrait, landscape, square)
const sampleImages = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop', // Portrait
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop', // Landscape
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop', // Square
]

const sampleImageUrl = computed(() => {
  return sampleImages[props.sampleImageIndex % sampleImages.length]
})

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

const getWatermarkStyle = () => {
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

const getTextStyle = () => {
  const scalePercent = (props.watermark.scale || 50) / 100
  const baseSize = 0.8 // Smaller for card preview
  const fontSize = (scalePercent * baseSize).toFixed(2) + 'rem'

  return {
    fontFamily: props.watermark.fontFamily || 'Pacifico',
    fontSize,
    color: props.watermark.fontColor || '#FFFFFF',
    backgroundColor: props.watermark.backgroundColor || 'transparent',
    padding: props.watermark.padding ? `${props.watermark.padding * 0.1}px` : '0px',
    borderRadius: props.watermark.borderRadius ? `${props.watermark.borderRadius * 0.1}px` : '0px',
    borderWidth: props.watermark.borderWidth ? `${props.watermark.borderWidth * 0.1}px` : '0px',
    borderColor: props.watermark.borderColor || 'transparent',
    borderStyle: props.watermark.borderStyle || 'solid',
    lineHeight: props.watermark.lineHeight || 1.5,
    letterSpacing: props.watermark.letterSpacing ? `${props.watermark.letterSpacing * 0.1}px` : '0px',
    textTransform: props.watermark.textTransform || 'none',
    whiteSpace: 'nowrap',
    ...getFontStyleProperties(props.watermark.fontStyle),
  }
}

const getImageWatermarkStyle = () => {
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
    width: `${scalePercent * 30}%`,
    maxWidth: '80%',
    maxHeight: '80%',
    opacity: (props.watermark.opacity || 80) / 100,
    objectFit: 'contain',
  }
}
</script>

