<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent
      :class="[theme.bgCard, theme.borderCard, 'sm:max-w-5xl p-0', 'focal-point-dialog']"
    >
      <DialogHeader class="px-6 pt-6 pb-4">
        <DialogTitle :class="['text-lg font-semibold uppercase', theme.textPrimary]">
          CROP COVER PHOTO
        </DialogTitle>
      </DialogHeader>

      <div class="px-6 pb-6">
        <!-- Full Image Container with Crop Overlay -->
        <div
          ref="focalPointImageContainer"
          class="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
          :style="{
            aspectRatio: containerAspectRatio,
          }"
        >
          <!-- Full Background Image -->
          <img
            v-if="imageUrl"
            :src="imageUrl"
            alt="Cover photo"
            class="absolute inset-0 w-full h-full object-contain"
            draggable="false"
          />

          <!-- Dark Overlay Outside Crop Area -->
          <div class="absolute inset-0 pointer-events-none">
            <!-- Top overlay -->
            <div
              class="absolute bg-black/50"
              :style="{
                left: 0,
                top: 0,
                right: 0,
                height: `${Math.max(0, focalPoint.y - cropFrameHeightPercent / 2)}%`,
              }"
            ></div>
            <!-- Bottom overlay -->
            <div
              class="absolute bg-black/50"
              :style="{
                left: 0,
                bottom: 0,
                right: 0,
                height: `${Math.max(0, 100 - (focalPoint.y + cropFrameHeightPercent / 2))}%`,
              }"
            ></div>
            <!-- Left overlay -->
            <div
              class="absolute bg-black/50"
              :style="{
                left: 0,
                top: `${Math.max(0, focalPoint.y - cropFrameHeightPercent / 2)}%`,
                width: `${Math.max(0, focalPoint.x - cropFrameWidthPercent / 2)}%`,
                height: `${cropFrameHeightPercent}%`,
              }"
            ></div>
            <!-- Right overlay -->
            <div
              class="absolute bg-black/50"
              :style="{
                right: 0,
                top: `${Math.max(0, focalPoint.y - cropFrameHeightPercent / 2)}%`,
                width: `${Math.max(0, 100 - (focalPoint.x + cropFrameWidthPercent / 2))}%`,
                height: `${cropFrameHeightPercent}%`,
              }"
            ></div>
          </div>

          <!-- Crop Frame (visible area) -->
          <div
            class="absolute border-2 border-white shadow-2xl cursor-move bg-transparent pointer-events-auto"
            :style="cropFrameStyle"
            @mousedown="handleCropDragStart"
            @touchstart="handleCropDragStart"
          >
            <!-- Focal Point Indicator (center of crop) -->
            <div
              class="absolute w-4 h-4 rounded-full border-2 border-white bg-green-500 shadow-lg pointer-events-none z-10"
              style="left: 50%; top: 50%; transform: translate(-50%, -50%)"
            >
              <div class="w-full h-full rounded-full bg-white/30"></div>
            </div>

            <!-- Crop Preview (what will be visible) -->
            <div
              class="absolute inset-0 overflow-hidden pointer-events-none"
              :style="cropPreviewStyle"
            >
              <img
                v-if="imageUrl"
                :src="imageUrl"
                alt="Crop preview"
                class="w-full h-full object-cover"
                draggable="false"
                :style="cropImageStyle"
              />
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <p :class="theme.textSecondary" class="text-sm mt-4 text-center">
          Drag the crop frame to adjust what part of the image will be visible as the cover photo
        </p>

        <div class="flex items-center justify-end gap-3 mt-4">
          <Button
            :class="[theme.textSecondary, theme.bgButtonHover]"
            type="button"
            variant="ghost"
            @click="handleClose"
          >
            Cancel
          </Button>
          <Button
            variant="accent"
            type="button"
            @click="handleConfirm"
          >
            Done
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Button } from '@/shared/components/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/shadcn/dialog'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  initialFocalPoint: {
    type: Object,
    default: () => ({ x: 50, y: 50 }),
  },
  cropAspectRatio: {
    type: Number,
    default: 1, // 1:1 (square) for sidebar, can be overridden
  },
})

const emit = defineEmits(['update:isOpen', 'confirm'])

const focalPointImageContainer = ref(null)
const cropOverlay = ref(null)
const focalPoint = ref({ x: 50, y: 50 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// Container aspect ratio (wider to show full image)
const containerAspectRatio = computed(() => '16/9')

// Crop frame size (percentage of container)
const cropSizePercent = computed(() => {
  // Crop takes up 60% of container, adjusted for aspect ratio
  const containerRatio = 16 / 9
  const cropRatio = props.cropAspectRatio

  if (cropRatio >= containerRatio) {
    // Crop is wider, limit by width
    return 60
  } else {
    // Crop is taller, limit by height
    return (60 * containerRatio) / cropRatio
  }
})

// Calculate crop frame dimensions
const cropFrameWidthPercent = computed(() => {
  const containerRatio = 16 / 9
  const cropRatio = props.cropAspectRatio
  if (cropRatio >= containerRatio) {
    return cropSizePercent.value
  } else {
    return (cropSizePercent.value * cropRatio) / containerRatio
  }
})

const cropFrameHeightPercent = computed(() => {
  const containerRatio = 16 / 9
  if (props.cropAspectRatio >= containerRatio) {
    return (cropSizePercent.value / props.cropAspectRatio) * containerRatio
  } else {
    return cropSizePercent.value
  }
})

// Crop frame style
const cropFrameStyle = computed(() => {
  return {
    width: `${cropFrameWidthPercent.value}%`,
    height: `${cropFrameHeightPercent.value}%`,
    left: `${focalPoint.value.x}%`,
    top: `${focalPoint.value.y}%`,
    transform: 'translate(-50%, -50%)',
  }
})

// Crop preview style
const cropPreviewStyle = computed(() => ({
  pointerEvents: 'none',
}))

// Crop image style (positioned based on focal point to show correct crop)
// This simulates object-cover behavior with object-position
const cropImageStyle = computed(() => {
  // The image needs to fill the crop frame area
  // We use object-position style logic: focal point is the center
  return {
    objectPosition: `${focalPoint.value.x}% ${focalPoint.value.y}%`,
    objectFit: 'cover',
  }
})

// Watch for changes to initialFocalPoint
watch(
  () => props.initialFocalPoint,
  newPoint => {
    if (newPoint) {
      focalPoint.value = { ...newPoint }
    }
  },
  { immediate: true }
)

// Reset focal point when modal opens
watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen) {
      focalPoint.value = props.initialFocalPoint ? { ...props.initialFocalPoint } : { x: 50, y: 50 }
    }
  }
)

const handleCropDragStart = event => {
  if (!focalPointImageContainer.value) return

  isDragging.value = true
  const rect = focalPointImageContainer.value.getBoundingClientRect()
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY

  dragStart.value = {
    x: clientX - rect.left,
    y: clientY - rect.top,
    focalX: focalPoint.value.x,
    focalY: focalPoint.value.y,
  }

  event.preventDefault()
}

const handleMouseMove = event => {
  if (!isDragging.value || !focalPointImageContainer.value) return

  const rect = focalPointImageContainer.value.getBoundingClientRect()
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY

  const deltaX = ((clientX - rect.left - dragStart.value.x) / rect.width) * 100
  const deltaY = ((clientY - rect.top - dragStart.value.y) / rect.height) * 100

  const newX = dragStart.value.focalX + deltaX
  const newY = dragStart.value.focalY + deltaY

  // Clamp values to keep crop within bounds
  const maxX = 50 + (100 - cropFrameWidthPercent.value) / 2
  const maxY = 50 + (100 - cropFrameHeightPercent.value) / 2
  const minX = 50 - (100 - cropFrameWidthPercent.value) / 2
  const minY = 50 - (100 - cropFrameHeightPercent.value) / 2

  focalPoint.value = {
    x: Math.min(maxX, Math.max(minX, newX)),
    y: Math.min(maxY, Math.max(minY, newY)),
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchmove', handleMouseMove, { passive: false })
  document.addEventListener('touchend', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleMouseMove)
  document.removeEventListener('touchend', handleMouseUp)
})

const handleClose = () => {
  emit('update:isOpen', false)
}

const handleConfirm = () => {
  emit('confirm', { ...focalPoint.value })
  handleClose()
}
</script>
