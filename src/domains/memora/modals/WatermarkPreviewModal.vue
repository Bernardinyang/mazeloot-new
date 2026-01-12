<template>
  <CenterModal
    v-model="isOpen"
    title="Preview Watermark"
    description="See how the watermark will look on this image before applying"
    content-class="sm:max-w-4xl"
  >
    <div class="space-y-4">
      <!-- Before/After Toggle -->
      <div class="flex items-center justify-center gap-2 mb-4">
        <button
          :class="
            viewMode === 'before'
              ? 'bg-accent text-accent-foreground'
              : [theme.bgCard, theme.borderSecondary, 'border', theme.textSecondary]
          "
          class="px-4 py-2 rounded-md text-sm font-semibold transition-all"
          @click="viewMode = 'before'"
        >
          Before
        </button>
        <button
          :class="
            viewMode === 'after'
              ? 'bg-accent text-accent-foreground'
              : [theme.bgCard, theme.borderSecondary, 'border', theme.textSecondary]
          "
          class="px-4 py-2 rounded-md text-sm font-semibold transition-all"
          @click="viewMode = 'after'"
        >
          After
        </button>
        <button
          :class="
            viewMode === 'compare'
              ? 'bg-accent text-accent-foreground'
              : [theme.bgCard, theme.borderSecondary, 'border', theme.textSecondary]
          "
          class="px-4 py-2 rounded-md text-sm font-semibold transition-all"
          @click="viewMode = 'compare'"
        >
          Compare
        </button>
      </div>

      <!-- Image Display -->
      <div class="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden" style="aspect-ratio: 4/3">
        <!-- Before Image -->
        <div
          v-if="viewMode === 'before' || viewMode === 'compare'"
          class="absolute inset-0 overflow-hidden"
          :class="viewMode === 'compare' ? 'left-0 border-r-2 border-white' : 'w-full'"
          :style="viewMode === 'compare' ? { width: `${sliderPosition}%` } : {}"
        >
          <img
            :src="mediaImageUrl"
            :alt="'Original image'"
            class="w-full h-full object-contain"
            @error="handleImageError"
          />
          <div
            v-if="viewMode === 'compare'"
            class="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs font-semibold rounded"
          >
            Before
          </div>
        </div>

        <!-- After Image (with watermark) -->
        <div
          v-if="viewMode === 'after' || viewMode === 'compare'"
          class="absolute inset-0 overflow-hidden"
          :class="viewMode === 'compare' ? 'right-0' : 'w-full'"
          :style="viewMode === 'compare' ? { width: `${100 - sliderPosition}%`, left: `${sliderPosition}%` } : {}"
        >
          <img
            v-if="watermarkedImageUrl && !previewError"
            :src="watermarkedImageUrl"
            :alt="'Watermarked image'"
            class="w-full h-full object-contain"
            @error="handlePreviewImageError"
          />
          <div
            v-else-if="isGeneratingPreview && !previewError"
            class="w-full h-full flex items-center justify-center"
          >
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          </div>
          <div
            v-else-if="previewError"
            class="w-full h-full flex flex-col items-center justify-center p-4 text-center"
          >
            <p class="text-sm mb-2" :class="theme.textSecondary">
              Preview unavailable
            </p>
            <p class="text-xs" :class="theme.textTertiary">
              {{ previewError }}
            </p>
            <p class="text-xs mt-2" :class="theme.textSecondary">
              The watermark will still be applied correctly.
            </p>
          </div>
          <div
            v-if="viewMode === 'compare'"
            class="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs font-semibold rounded"
          >
            After
          </div>
        </div>

        <!-- Slider for Compare Mode -->
        <div
          v-if="viewMode === 'compare'"
          class="absolute inset-0 cursor-ew-resize"
          @mousedown="handleSliderStart"
          @mousemove="handleSliderMove"
          @mouseup="handleSliderEnd"
          @mouseleave="handleSliderEnd"
          @touchmove="handleSliderMove"
          @touchend="handleSliderEnd"
        >
          <div
            class="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
            :style="{ left: `${sliderPosition}%` }"
          >
            <div 
              class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize touch-none"
              @mousedown.stop="isDragging = true"
              @touchstart.stop="isDragging = true"
            >
              <GripVertical class="h-4 w-4 text-gray-600 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <!-- Watermark Info -->
      <div
        v-if="watermark"
        class="p-3 rounded-lg border"
        :class="[theme.bgCard, theme.borderSecondary]"
      >
        <p class="text-sm font-semibold mb-1" :class="theme.textPrimary">
          {{ watermark.name }}
        </p>
        <p class="text-xs" :class="theme.textSecondary">
          Position: {{ positionLabel }} • Opacity: {{ watermark.opacity || 80 }}% • Scale: {{ watermark.scale || (watermark.type === 'image' ? 100 : 50) }}%
        </p>
      </div>
    </div>

    <template #footer>
      <Button variant="outline" @click="handleCancel">Cancel</Button>
      <Button variant="primary" @click="handleApply" :disabled="!watermark || isGeneratingPreview">
        Apply Watermark
      </Button>
    </template>
  </CenterModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { GripVertical } from 'lucide-vue-next'
import CenterModal from '@/shared/modals/CenterModal.vue'
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { applyWatermarkToImage } from '@/shared/utils/watermark/applyWatermarkToImage'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mediaImageUrl: { type: String, required: true },
  watermark: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'apply', 'cancel'])

const theme = useThemeClasses()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const viewMode = ref('compare')
const sliderPosition = ref(50)
const isDragging = ref(false)
const watermarkedImageUrl = ref(null)
const isGeneratingPreview = ref(false)
const previewError = ref(null)

const positionOptions = {
  'top-left': 'Top Left',
  top: 'Top',
  'top-right': 'Top Right',
  left: 'Left',
  center: 'Center',
  right: 'Right',
  'bottom-left': 'Bottom Left',
  bottom: 'Bottom',
  'bottom-right': 'Bottom Right',
}

const positionLabel = computed(() => {
  return positionOptions[props.watermark?.position] || 'Center'
})

const handleSliderStart = (event) => {
  if (viewMode.value !== 'compare') return
  isDragging.value = true
  handleSliderMove(event)
}

const handleSliderMove = (event) => {
  if (!isDragging.value || viewMode.value !== 'compare') return
  
  const container = event.currentTarget
  const rect = container.getBoundingClientRect()
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const x = clientX - rect.left
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
  sliderPosition.value = percentage
}

const handleSliderEnd = () => {
  isDragging.value = false
}

watch(
  () => [props.mediaImageUrl, props.watermark],
  async () => {
    if (props.mediaImageUrl && props.watermark && props.watermark.id !== 'none') {
      isGeneratingPreview.value = true
      previewError.value = null
      try {
        const watermarked = await applyWatermarkToImage(props.mediaImageUrl, props.watermark)
        watermarkedImageUrl.value = watermarked
        previewError.value = null
      } catch (error) {
        console.error('Failed to generate preview:', error)
        watermarkedImageUrl.value = null
        if (error.message && (error.message.includes('CORS') || error.message.includes('cross-origin'))) {
          previewError.value = 'Preview unavailable due to CORS restrictions'
        } else {
          previewError.value = 'Failed to generate preview'
        }
      } finally {
        isGeneratingPreview.value = false
      }
    } else {
      watermarkedImageUrl.value = null
      previewError.value = null
    }
  },
  { immediate: true }
)

const handleImageError = () => {
  // Image failed to load, but we'll still show the preview modal
}

const handlePreviewImageError = () => {
  previewError.value = 'Preview image failed to load'
}

const handleApply = () => {
  emit('apply')
  isOpen.value = false
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>

