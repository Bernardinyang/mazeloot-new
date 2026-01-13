<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      class="max-w-7xl w-full h-[90vh] p-0 gap-0 overflow-hidden animate-scale-in"
      :class="theme.bgCard"
    >
      <!-- Close Button -->
      <DialogClose
        class="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        :class="['bg-black/50 text-white hover:bg-black/70']"
      >
        <X class="h-4 w-4" />
      </DialogClose>

      <!-- Photo Container -->
      <div class="relative w-full h-full flex items-center justify-center bg-black/90">
        <!-- Previous Button -->
        <button
          v-if="hasPrevious"
          type="button"
          class="absolute left-4 z-40 h-12 w-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all text-white"
          @click="goToPrevious"
          :title="'Previous photo (←)'"
        >
          <ChevronLeft class="h-6 w-6" />
        </button>

        <!-- Next Button -->
        <button
          v-if="hasNext"
          type="button"
          class="absolute right-4 z-40 h-12 w-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all text-white"
          @click="goToNext"
          :title="'Next photo (→)'"
        >
          <ChevronRight class="h-6 w-6" />
        </button>

        <!-- Photo -->
        <div class="relative w-full h-full flex items-center justify-center p-8">
          <img
            :src="currentPhoto?.url || currentPhoto?.thumbnail"
            :alt="currentPhoto?.title || 'Photo'"
            class="max-w-full max-h-full object-contain"
            @load="handleImageLoad"
            @error="handleImageError"
          />
        </div>

        <!-- Photo Info (Bottom) -->
        <div
          v-if="currentPhoto"
          class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
        >
          <div class="flex items-center justify-between text-white">
            <div>
              <h3 class="font-semibold text-lg">
                {{ currentPhoto.title || 'Untitled Photo' }}
              </h3>
              <p v-if="currentPhoto.collection" class="text-sm text-white/70 mt-1">
                {{ currentPhoto.collection }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                class="text-white hover:bg-white/20"
                @click="handleDownload"
                title="Download"
              >
                <Download class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Photo Counter -->
        <div
          v-if="photos.length > 1"
          class="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm"
        >
          {{ currentIndex + 1 }} / {{ photos.length }}
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Dialog, DialogContent, DialogClose } from '@/shared/components/shadcn/dialog'
import { Button } from '@/shared/components/shadcn/button'
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-vue-next'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  photos: {
    type: Array,
    required: true,
  },
  initialIndex: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:modelValue', 'download'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const currentIndex = ref(props.initialIndex)
const isLoading = ref(false)

const currentPhoto = computed(() => {
  if (props.photos.length === 0) return null
  return props.photos[currentIndex.value] || props.photos[0]
})

const hasPrevious = computed(() => {
  return props.photos.length > 1 && currentIndex.value > 0
})

const hasNext = computed(() => {
  return props.photos.length > 1 && currentIndex.value < props.photos.length - 1
})

const goToPrevious = () => {
  if (hasPrevious.value) {
    currentIndex.value--
    isLoading.value = true
  }
}

const goToNext = () => {
  if (hasNext.value) {
    currentIndex.value++
    isLoading.value = true
  }
}

const handleImageLoad = () => {
  isLoading.value = false
}

const handleImageError = () => {
  isLoading.value = false
  toast.error('Failed to load image', {
    description: 'The image could not be loaded.',
  })
}

const handleDownload = () => {
  if (!currentPhoto.value) return

  try {
    const link = document.createElement('a')
    link.href = currentPhoto.value.url || currentPhoto.value.thumbnail || ''
    link.download = currentPhoto.value.title || 'photo.jpg'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Download started', {
      description: currentPhoto.value.title || 'Photo',
    })

    emit('download', currentPhoto.value)
  } catch (error) {
    toast.error('Failed to download', {
      description: 'Could not download the photo.',
    })
  }
}

// Keyboard navigation
const handleKeyDown = e => {
  if (!isOpen.value) return

  if (e.key === 'ArrowLeft' && hasPrevious.value) {
    e.preventDefault()
    goToPrevious()
  } else if (e.key === 'ArrowRight' && hasNext.value) {
    e.preventDefault()
    goToNext()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    isOpen.value = false
  }
}

// Watch for initial index changes
watch(
  () => props.initialIndex,
  newIndex => {
    if (newIndex >= 0 && newIndex < props.photos.length) {
      currentIndex.value = newIndex
    }
  }
)

// Watch for modal open/close
watch(isOpen, open => {
  if (open) {
    currentIndex.value = props.initialIndex
    document.addEventListener('keydown', handleKeyDown)
  } else {
    document.removeEventListener('keydown', handleKeyDown)
  }
})

onMounted(() => {
  if (isOpen.value) {
    document.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>
