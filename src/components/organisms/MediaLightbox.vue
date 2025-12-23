<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <!-- Close Button -->
        <button
          aria-label="Close lightbox"
          class="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
          @click="handleClose"
        >
          <X class="w-6 h-6" />
        </button>

        <!-- Navigation Buttons -->
        <template v-if="items.length > 1">
          <button
            v-if="hasPrevious"
            aria-label="Previous"
            class="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
            @click.stop="goToPrevious"
          >
            <ChevronLeft class="w-6 h-6" />
          </button>
          <button
            v-if="hasNext"
            aria-label="Next"
            class="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
            @click.stop="goToNext"
          >
            <ChevronRight class="w-6 h-6" />
          </button>
        </template>

        <!-- Media Container -->
        <div class="relative w-full h-full flex items-center justify-center p-4 md:p-8">
          <Transition mode="out-in" name="lightbox-slide">
            <div :key="currentIndex" class="relative max-w-full max-h-full">
              <!-- Image -->
              <img
                v-if="currentMediaType === 'image' && currentMediaUrl"
                :alt="currentItem?.title || currentItem?.filename || 'Media'"
                :src="currentMediaUrl"
                class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                @error="handleImageError"
                @load="handleImageLoad"
              />

              <!-- Video -->
              <video
                v-else-if="currentMediaType === 'video'"
                :poster="currentThumbnailUrl"
                :src="currentMediaUrl"
                class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                controls
                @error="handleVideoError"
              >
                Your browser does not support the video tag.
              </video>

              <!-- Loading State -->
              <div
                v-if="isLoading"
                class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
              >
                <Loader2 class="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Media Info (Bottom) -->
        <div
          v-if="currentItem"
          class="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent"
        >
          <div class="max-w-4xl mx-auto flex items-center justify-between text-white">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-lg md:text-xl truncate">
                {{
                  currentItem?.file?.filename ||
                  currentItem.title ||
                  currentItem.filename ||
                  'Untitled Media'
                }}
              </h3>
              <div class="flex items-center gap-4 mt-2 text-sm text-white/70">
                <span v-if="currentItem?.file?.type">
                  {{ currentItem?.file?.type === 'image' ? 'Image' : 'Video' }}
                </span>
                <span v-if="currentItem?.file?.size">
                  {{ formatFileSize(currentItem?.file?.size) }}
                </span>
                <span v-if="currentItem?.file?.width && currentItem?.file?.height">
                  {{ currentItem?.file?.width }} × {{ currentItem?.file?.height }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <button
                aria-label="Download"
                class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title="Download"
                @click="handleDownload"
              >
                <Download class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Counter (Top Center) -->
        <div
          v-if="items.length > 1"
          class="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-sm font-medium"
        >
          {{ currentIndex + 1 }} / {{ items.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, Download, Loader2, X } from 'lucide-vue-next'
import { getMediaDisplayUrl } from '@/utils/media/getMediaDisplayUrl'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  initialIndex: {
    type: Number,
    default: 0,
  },
  placeholderImage: {
    type: String,
    default: '/placeholder-image.png',
  },
})

const emit = defineEmits(['update:modelValue', 'close', 'download', 'image-error'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const currentIndex = ref(props.initialIndex)
const isLoading = ref(false)
const currentMediaUrl = ref('')
const currentThumbnailUrl = ref('')

const currentItem = computed(() => {
  if (props.items.length === 0) return null
  return props.items[currentIndex.value] || props.items[0]
})

const currentMediaType = computed(() => {
  return currentItem.value?.type || currentItem.value?.file?.type || 'image'
})

const hasPrevious = computed(() => {
  return props.items.length > 1 && currentIndex.value > 0
})

const hasNext = computed(() => {
  return props.items.length > 1 && currentIndex.value < props.items.length - 1
})

const getThumbnailUrl = item => {
  if (!item) return null

  const mediaType = item.type || item.file?.type

  if (item.thumbnailUrl) {
    return item.thumbnailUrl
  }

  if (mediaType === 'image') {
    return item.file?.url || item.url
  } else if (mediaType === 'video') {
    return item.file?.url || item.url
  }

  return item.file?.url || item.url || item.thumbnail
}

const getMediaUrl = item => {
  if (!item) return null

  if (item.type === 'image' || item.file?.type === 'image') {
    if (item.largeImageUrl) {
      return item.largeImageUrl
    }
    if (item.file?.variants?.large) {
      return item.file.variants.large
    }
    return item.file?.url || null
  }

  return item.file?.url || null
}

const updateMediaUrl = async () => {
  if (!currentItem.value) {
    currentMediaUrl.value = props.placeholderImage
    currentThumbnailUrl.value = props.placeholderImage
    return
  }

  isLoading.value = true

  const url = getMediaUrl(currentItem.value)
  const thumbnail = getThumbnailUrl(currentItem.value)

  if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:'))) {
    currentMediaUrl.value = url
  } else {
    currentMediaUrl.value = props.placeholderImage
  }

  if (
    thumbnail &&
    (thumbnail.startsWith('http://') ||
      thumbnail.startsWith('https://') ||
      thumbnail.startsWith('data:'))
  ) {
    currentThumbnailUrl.value = thumbnail
  } else {
    currentThumbnailUrl.value = props.placeholderImage
  }

  if (thumbnail && thumbnail.startsWith('file://')) {
    try {
      currentThumbnailUrl.value = await getMediaDisplayUrl(thumbnail, props.placeholderImage)
    } catch (error) {
      console.error('Error loading thumbnail:', error)
    }
  }

  if (url && url.startsWith('file://')) {
    try {
      currentMediaUrl.value = await getMediaDisplayUrl(url, props.placeholderImage)
      isLoading.value = false
    } catch (error) {
      console.error('Error loading media:', error)
      currentMediaUrl.value = props.placeholderImage
      isLoading.value = false
    }
  } else {
    isLoading.value = false
  }
}

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

const handleClose = () => {
  isOpen.value = false
  emit('close')
}

const handleImageLoad = () => {
  isLoading.value = false
}

const handleImageError = event => {
  isLoading.value = false
  emit('image-error', event)
}

const handleVideoError = event => {
  isLoading.value = false
  emit('image-error', event)
}

const handleDownload = () => {
  if (!currentItem.value) return
  emit('download', currentItem.value)
}

const formatFileSize = bytes => {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

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
    handleClose()
  }
}

watch(
  currentItem,
  () => {
    updateMediaUrl()
  },
  { immediate: true }
)

watch(
  () => props.initialIndex,
  newIndex => {
    if (newIndex >= 0 && newIndex < props.items.length) {
      currentIndex.value = newIndex
    }
  }
)

watch(isOpen, open => {
  if (open) {
    // Ensure currentIndex is within bounds
    const safeIndex = Math.max(0, Math.min(props.initialIndex, props.items.length - 1))
    currentIndex.value = safeIndex
    updateMediaUrl()
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  }
})

// Watch for items changes to update when bulk view sets new items
watch(
  () => props.items,
  newItems => {
    if (isOpen.value && newItems.length > 0) {
      // Ensure currentIndex is within bounds of new items
      const safeIndex = Math.max(0, Math.min(currentIndex.value, newItems.length - 1))
      currentIndex.value = safeIndex
      updateMediaUrl()
    }
  },
  { deep: true }
)

onMounted(() => {
  if (isOpen.value) {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>
<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox-slide-enter-active,
.lightbox-slide-leave-active {
  transition: all 0.3s ease;
}

.lightbox-slide-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.lightbox-slide-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
