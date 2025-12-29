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

        <!-- Toggle Comments Button -->
        <button
          v-if="currentItem && currentItem.feedback !== undefined"
          aria-label="Toggle comments"
          class="absolute top-4 right-20 z-50 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
          @click="handleCommentClick"
        >
          <MessageSquare class="w-6 h-6" />
          <span
            v-if="currentComments.length > 0"
            class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold"
          >
            {{ currentComments.length }}
          </span>
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

        <!-- Main Container: Side-by-side on desktop, stacked on mobile -->
        <div class="relative w-full h-full flex flex-col md:flex-row">
          <!-- Media Section (Left on desktop, full on mobile) -->
          <div
            class="relative flex-1 flex items-center justify-center p-4 md:p-8 bg-black/95"
            :class="showComments ? 'md:w-[60%]' : 'w-full'"
          >
            <Transition mode="out-in" name="lightbox-slide">
              <div
                :key="currentIndex"
                class="relative max-w-full max-h-full w-full h-full flex items-center justify-center"
              >
                <!-- Image -->
                <img
                  v-if="currentMediaType === 'image' && currentMediaUrl"
                  :alt="currentItem?.title || currentItem?.filename || 'Media'"
                  :src="currentMediaUrl"
                  class="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                  @error="handleImageError"
                  @load="handleImageLoad"
                />

                <!-- Video -->
                <CustomVideoPlayer
                  v-else-if="currentMediaType === 'video' && currentMediaUrl"
                  ref="videoPlayerRef"
                  :poster="
                    currentThumbnailUrl && currentThumbnailUrl !== placeholderImage
                      ? currentThumbnailUrl
                      : undefined
                  "
                  :src="currentMediaUrl"
                  :autoplay="true"
                  @error="handleVideoError"
                  @play="handleVideoPlay"
                  @pause="handleVideoPause"
                  @timeupdate="handleVideoTimeUpdate"
                />

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

          <!-- Comments Panel (Right on desktop, drawer on mobile) -->
          <Transition name="comments-slide">
            <div
              v-if="showComments"
              class="absolute md:relative md:flex md:w-[40%] md:h-full bottom-0 left-0 right-0 md:top-0 h-[60vh] md:h-full bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 shadow-lg md:shadow-none z-50"
            >
              <!-- Mobile Drawer Handle -->
              <div
                class="md:hidden flex items-center justify-center py-2 border-b border-gray-200 dark:border-gray-700"
              >
                <div class="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>

              <CommentsPanel
                :media-id="currentItem?.id || ''"
                :comments="currentComments"
                :is-video="currentMediaType === 'video'"
                :current-video-time="currentVideoTime"
                :is-loading="isLoadingComments"
                :allow-reply="allowComments"
                @add-comment="handleAddComment"
                @seek-to-timestamp="handleSeekToTimestamp"
              />
            </div>
          </Transition>
        </div>

        <!-- Media Info (Bottom) -->
        <div
          v-if="currentItem && currentMediaType !== 'video'"
          class="absolute bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent"
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
import { ChevronLeft, ChevronRight, Download, Loader2, X, MessageSquare } from 'lucide-vue-next'
import { getMediaDisplayUrl } from '@/utils/media/getMediaDisplayUrl'
import CustomVideoPlayer from './CustomVideoPlayer.vue'
import CommentsPanel from './CommentsPanel.vue'
import { useRealtimeComments } from '@/composables/useRealtimeComments'
import { useProofingApi } from '@/api/proofing'

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
  allowComments: {
    type: Boolean,
    default: true,
  },
  proofingId: {
    type: String,
    default: null,
  },
  setId: {
    type: String,
    default: null,
  },
  projectId: {
    type: String,
    default: null,
  },
  guestToken: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'close', 'download', 'image-error', 'open-comments'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const currentIndex = ref(props.initialIndex)
const isLoading = ref(false)
const currentMediaUrl = ref('')
const currentThumbnailUrl = ref('')
const showComments = ref(false)
const videoPlayerRef = ref(null)
const currentVideoTime = ref(null)
const isLoadingComments = ref(false)
const comments = ref([])

const proofingApi = useProofingApi()

const currentItem = computed(() => {
  if (props.items.length === 0) return null
  return props.items[currentIndex.value] || props.items[0]
})

const currentMediaType = computed(() => {
  return currentItem.value?.type || currentItem.value?.file?.type || 'image'
})

const currentComments = computed(() => {
  if (!currentItem.value) return []
  // Load comments from item or from our local state
  return comments.value.length > 0 ? comments.value : currentItem.value.feedback || []
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

  // Priority order for thumbnails:
  // 1. Direct thumbnailUrl from media
  if (item.thumbnailUrl) {
    return item.thumbnailUrl
  }

  // 2. For videos, check file thumbnailUrl or metadata thumbnail
  if (mediaType === 'video') {
    if (item.file?.thumbnailUrl && item.file.thumbnailUrl !== item.file?.url) {
      return item.file.thumbnailUrl
    }
    if (item.file?.metadata?.thumbnail) {
      return item.file.metadata.thumbnail
    }
    // For videos without thumbnail, return null (video will use poster or no poster)
    return null
  }

  // 3. For images, use file URL or variants
  if (mediaType === 'image') {
    if (item.file?.variants?.thumb) {
      return item.file.variants.thumb
    }
    return item.file?.url || item.url
  }

  // 4. Fallback
  return item.file?.url || item.url || item.thumbnail
}

const getMediaUrl = item => {
  if (!item) return null

  const mediaType = item.type || item.file?.type

  if (mediaType === 'image') {
    if (item.largeImageUrl) {
      return item.largeImageUrl
    }
    if (item.file?.variants?.large) {
      return item.file.variants.large
    }
    return item.file?.url || null
  }

  // For videos, return the video URL
  if (mediaType === 'video') {
    return item.file?.url || item.url || null
  }

  return item.file?.url || item.url || null
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
    } catch (error) {}
  }

  if (url && url.startsWith('file://')) {
    try {
      currentMediaUrl.value = await getMediaDisplayUrl(url, props.placeholderImage)
      isLoading.value = false
    } catch (error) {
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

const handleCommentClick = () => {
  // Emit event to open comments in MediaCommentLightbox
  emit('open-comments', {
    item: currentItem.value,
    index: currentIndex.value,
  })
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

const handleVideoLoaded = () => {
  isLoading.value = false
}

const handleVideoPlay = () => {
  isLoading.value = false
}

const handleVideoPause = () => {
  // Keep loading state as is when paused
}

const handleVideoTimeUpdate = event => {
  currentVideoTime.value = event.currentTime
}

const handleSeekToTimestamp = timestamp => {
  if (videoPlayerRef.value && videoPlayerRef.value.seekTo) {
    videoPlayerRef.value.seekTo(timestamp)
  }
}

const handleAddComment = async commentData => {
  if (!currentItem.value || !props.allowComments) return

  try {
    isLoadingComments.value = true

    if (props.proofingId && props.setId) {
      await proofingApi.addMediaFeedback(
        props.proofingId,
        props.setId,
        currentItem.value.id,
        commentData,
        props.projectId,
        props.guestToken // Pass guest token if available
      )
    }

    // Reload comments
    await loadComments()
  } catch (error) {
    console.error('Failed to add comment:', error)
    throw error
  } finally {
    isLoadingComments.value = false
  }
}

const loadComments = async () => {
  if (!currentItem.value) return

  // Comments should be loaded with media items
  // Use feedback from item if available
  if (currentItem.value.feedback) {
    comments.value = currentItem.value.feedback
  } else {
    // If feedback not loaded, try to fetch it
    // This is a fallback - normally feedback comes with media items
    comments.value = []
  }
}

// Initialize real-time comments
const { connect: connectRealtime, disconnect: disconnectRealtime } = useRealtimeComments(
  computed(() => currentItem.value?.id || ''),
  {
    onCommentCreated: newComment => {
      if (newComment.mediaId === currentItem.value?.id) {
        // If it's a reply, add it to the parent comment's replies array
        if (newComment.parentId) {
          const parentIndex = comments.value.findIndex(c => c.id === newComment.parentId)
          if (parentIndex !== -1) {
            if (!comments.value[parentIndex].replies) {
              comments.value[parentIndex].replies = []
            }
            comments.value[parentIndex].replies.push(newComment)
          } else {
            // Parent not found in top-level, search in replies
            const findAndAddReply = (commentList, parentId, reply) => {
              for (const comment of commentList) {
                if (comment.id === parentId) {
                  if (!comment.replies) comment.replies = []
                  comment.replies.push(reply)
                  return true
                }
                if (comment.replies && comment.replies.length > 0) {
                  if (findAndAddReply(comment.replies, parentId, reply)) {
                    return true
                  }
                }
              }
              return false
            }
            if (!findAndAddReply(comments.value, newComment.parentId, newComment)) {
              // If parent not found, add as top-level comment
              comments.value = [...comments.value, newComment]
            }
          }
        } else {
          // Top-level comment
          comments.value = [...comments.value, newComment]
        }
      }
    },
    onCommentUpdated: updatedComment => {
      // Update comment in the list (including nested replies)
      const updateComment = (commentList, updated) => {
        const index = commentList.findIndex(c => c.id === updated.id)
        if (index !== -1) {
          commentList[index] = updated
          return true
        }
        // Search in replies
        for (const comment of commentList) {
          if (comment.replies && comment.replies.length > 0) {
            if (updateComment(comment.replies, updated)) {
              return true
            }
          }
        }
        return false
      }
      updateComment(comments.value, updatedComment)
    },
    fetchComments: loadComments,
  }
)

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
    loadComments()
    connectRealtime()
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
  } else {
    disconnectRealtime()
    showComments.value = false
    document.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  }
})

watch(
  currentItem,
  () => {
    updateMediaUrl()
    loadComments()
    // Reconnect real-time for new media
    if (isOpen.value) {
      disconnectRealtime()
      connectRealtime()
    }
  },
  { immediate: false }
)

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

.comments-slide-enter-active,
.comments-slide-leave-active {
  transition: all 0.3s ease;
}

.comments-slide-enter-from {
  transform: translateY(100%);
}

.comments-slide-leave-to {
  transform: translateY(100%);
}

@media (min-width: 768px) {
  .comments-slide-enter-from {
    transform: translateX(100%);
  }

  .comments-slide-leave-to {
    transform: translateX(100%);
  }
}
</style>
