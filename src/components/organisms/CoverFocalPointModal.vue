<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent
      :class="[theme.bgCard, theme.borderCard, 'sm:max-w-4xl p-0', 'focal-point-dialog']"
    >
      <DialogHeader class="px-6 pt-6 pb-4">
        <DialogTitle :class="['text-lg font-semibold uppercase', theme.textPrimary]">
          {{ title }}
        </DialogTitle>
      </DialogHeader>

      <div class="px-6 pb-6">
        <div
          ref="focalPointImageContainer"
          class="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-crosshair"
          :style="{ aspectRatio: '16/9' }"
          @click="handleFocalPointClick"
        >
          <!-- Video Cover -->
          <video
            v-if="isVideo"
            :src="displayUrl"
            :style="{
              objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
            }"
            class="w-full h-full object-cover"
            autoplay
            loop
            muted
            playsinline
          />
          <!-- Image Cover -->
          <div
            v-else
            :style="{
              backgroundImage: displayUrl ? `url(${displayUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: `${focalPoint.x}% ${focalPoint.y}%`,
              backgroundRepeat: 'no-repeat',
            }"
            class="w-full h-full"
          ></div>
          <!-- Focal Point Indicator -->
          <div
            :style="{
              left: `${focalPoint.x}%`,
              top: `${focalPoint.y}%`,
              transform: 'translate(-50%, -50%)',
            }"
            class="absolute w-8 h-8 rounded-full border-4 border-white bg-green-500 pointer-events-none transition-all duration-100 z-10"
          >
            <div class="w-full h-full rounded-full bg-white/30"></div>
          </div>
        </div>

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
            class="bg-accent hover:bg-accent/90 text-accent-foreground"
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
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useThemeClasses } from '@/composables/useThemeClasses'

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
  fallbackImageUrl: {
    type: String,
    default: null,
  },
  initialFocalPoint: {
    type: Object,
    default: () => ({ x: 50, y: 50 }),
  },
  title: {
    type: String,
    default: 'SET FOCAL POINT',
  },
})

const emit = defineEmits(['update:isOpen', 'confirm'])

const focalPointImageContainer = ref(null)
const focalPoint = ref({ x: 50, y: 50 })

const displayUrl = computed(() => {
  return props.imageUrl || props.fallbackImageUrl || null
})

const isVideo = computed(() => {
  if (!displayUrl.value) return false
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.m4v']
  const lowerUrl = displayUrl.value.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.includes(ext))
})

watch(
  () => props.initialFocalPoint,
  newPoint => {
    if (newPoint && typeof newPoint === 'object') {
      focalPoint.value = { ...newPoint }
    }
  },
  { immediate: true }
)

watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen && props.initialFocalPoint) {
      focalPoint.value = { ...props.initialFocalPoint }
    }
  }
)

const handleFocalPointClick = event => {
  if (!focalPointImageContainer.value) return

  const rect = focalPointImageContainer.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  // Clamp values between 0 and 100
  focalPoint.value = {
    x: Math.min(100, Math.max(0, x)),
    y: Math.min(100, Math.max(0, y)),
  }
}

const handleClose = () => {
  emit('update:isOpen', false)
}

const handleConfirm = () => {
  emit('confirm', { ...focalPoint.value })
  handleClose()
}
</script>

<style scoped>
/* Hide the default DialogContent close button in focal point modal */
:deep(.focal-point-dialog > button[class*='absolute'][class*='right-4'][class*='top-4']) {
  display: none;
}
</style>
