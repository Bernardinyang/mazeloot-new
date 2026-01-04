<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <!-- Top Center Container -->
        <div 
          v-if="!(isSlideshowPlaying && isFullscreen)"
          class="absolute top-4 sm:top-2 md:top-4 left-1/2 -translate-x-1/2 z-[110] w-full max-w-4xl px-8 sm:px-4 flex items-center justify-between gap-3 sm:gap-2 md:gap-3"
        >
          <!-- Counter -->
          <div class="flex items-center">
            <div
              v-if="items.length > 0"
              class="px-4 sm:px-3 py-2 sm:py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-sm sm:text-xs font-semibold shadow-xl border border-white/10"
            >
              <span class="text-white/90">{{ currentIndex + 1 }}</span>
              <span class="mx-1.5 sm:mx-1 text-white/50">/</span>
              <span class="text-white/70">{{ items.length }}</span>
            </div>
          </div>

          <!-- Action Buttons Group -->
          <div class="flex items-center gap-3 sm:gap-1.5 md:gap-3">
            <!-- Share Button -->
            <button
              aria-label="Share"
              class="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50"
              @click.stop="handleShare"
            >
              <Share2 class="w-5 h-5 sm:w-4 sm:h-4" />
            </button>

            <!-- Star/Favorite Button (hidden in public mode) -->
            <button
              v-if="!publicMode"
              aria-label="Favorite"
              class="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50"
              :class="isFavorite ? 'text-yellow-400' : ''"
              @click.stop="handleFavorite"
            >
              <Star class="w-5 h-5 sm:w-4 sm:h-4" :class="isFavorite ? 'fill-current' : ''" />
            </button>

            <!-- Heart/Favorite Button (public mode) -->
            <button
              v-if="publicMode"
              aria-label="Favorite"
              class="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50"
              :class="isFavorite ? 'text-red-500' : 'text-white'"
              @click.stop="handleFavorite"
            >
              <Heart class="w-5 h-5 sm:w-4 sm:h-4" :class="isFavorite ? 'fill-current' : ''" />
            </button>

            <!-- Padlock/Unlock Button (public mode, client verified) -->
            <button
              v-if="publicMode && isClientVerified && allowMarkPrivate"
              aria-label="Toggle private"
              class="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50"
              :class="isPrivate ? 'text-teal-400' : ''"
              @click.stop="handleTogglePrivate"
            >
              <LockOpen v-if="isPrivate" class="w-5 h-5 sm:w-4 sm:h-4" />
              <Lock v-else class="w-5 h-5 sm:w-4 sm:h-4" />
            </button>

            <!-- Play Slideshow Button -->
            <button
              v-if="items.length > 1"
              aria-label="Play slideshow"
              class="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50"
              @click.stop="toggleSlideshow"
            >
              <Play v-if="!isSlideshowPlaying" class="w-5 h-5 sm:w-4 sm:h-4" />
              <Pause v-else class="w-5 h-5 sm:w-4 sm:h-4" />
            </button>

            <!-- Toggle Comments Button (only in proofing phase) -->
            <button
              v-if="proofingId && currentItem && currentItem.feedback !== undefined"
              aria-label="Toggle comments"
              class="relative w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50"
              @click.stop="handleCommentClick"
            >
              <MessageSquare
                class="w-5 h-5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-110"
              />
              <span
                v-if="totalCommentCount > 0"
                class="absolute -top-1 -right-1 sm:-top-0.5 sm:-right-0.5 min-w-[20px] sm:min-w-[16px] h-5 sm:h-4 px-1.5 sm:px-1 rounded-full bg-teal-500 text-white text-[10px] sm:text-[9px] font-bold flex items-center justify-center z-[111] shadow-lg ring-2 ring-black/20 animate-pulse"
              >
                {{ totalCommentCount }}
              </span>
            </button>

            <!-- Close Button -->
            <button
              aria-label="Close lightbox"
              class="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-red-500/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50"
              @click.stop="handleClose"
            >
              <X class="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <template v-if="items.length > 1 && !(isSlideshowPlaying && isFullscreen)">
          <button
            v-if="hasPrevious"
            aria-label="Previous"
            class="absolute left-8 sm:left-2 md:left-8 top-1/2 -translate-y-1/2 z-[105] w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 border border-white/10 hover:border-white/20 group focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50"
            @click.stop="goToPrevious"
          >
            <ChevronLeft
              class="w-6 h-6 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-1"
            />
          </button>
          <button
            v-if="hasNext"
            aria-label="Next"
            class="absolute right-8 sm:right-2 md:right-8 top-1/2 -translate-y-1/2 z-[105] w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 border border-white/10 hover:border-white/20 group focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50"
            @click.stop="goToNext"
          >
            <ChevronRight
              class="w-6 h-6 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </template>

        <!-- Main Container: Side-by-side on desktop, stacked on mobile -->
        <div 
          class="relative w-full h-full flex flex-col md:flex-row"
          :class="isSlideshowPlaying && isFullscreen ? 'slideshow-fullscreen' : ''"
        >
          <!-- Media Section (Left on desktop, full on mobile) -->
          <div
            class="relative flex-1 flex items-center justify-center bg-black/95 transition-all duration-300"
            :class="[
              showComments ? 'md:w-[60%]' : 'w-full',
              isSlideshowPlaying && isFullscreen ? 'p-0' : 'p-8 sm:p-3'
            ]"
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
                  class="w-auto h-auto object-contain shadow-2xl transition-all duration-300"
                  :class="[
                    isLoading ? 'opacity-0' : 'opacity-100',
                    isSlideshowPlaying && isFullscreen 
                      ? 'max-w-full max-h-full rounded-none' 
                      : 'max-w-full max-h-[90vh] sm:max-h-[88vh] md:max-h-[90vh] rounded-lg'
                  ]"
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
                <Transition name="fade">
                  <div
                    v-if="isLoading"
                    class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg gap-2 sm:gap-3"
                  >
                    <Loader2 class="w-10 h-10 sm:w-8 sm:h-8 text-white animate-spin" />
                    <p class="text-white/80 text-sm sm:text-xs font-medium">Loading media...</p>
                  </div>
                </Transition>
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
        <Transition name="slide-up">
          <div
            v-if="currentItem && currentMediaType !== 'video' && !(isSlideshowPlaying && isFullscreen)"
            class="absolute bottom-0 left-0 right-0 z-[107] p-6 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-sm"
          >
            <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between text-white gap-4 sm:gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-lg sm:text-base truncate drop-shadow-lg">
                  {{
                    currentItem?.file?.filename ||
                    currentItem.title ||
                    currentItem.filename ||
                    'Untitled Media'
                  }}
                </h3>
                <div
                  class="flex items-center gap-4 sm:gap-3 mt-2 text-sm sm:text-xs text-white/80 flex-wrap"
                >
                  <span
                    v-if="currentItem?.file?.type"
                    class="px-2 sm:px-1.5 py-0.5 rounded-md bg-white/10 backdrop-blur-sm"
                  >
                    {{ currentItem?.file?.type === 'image' ? 'Image' : 'Video' }}
                  </span>
                  <span v-if="currentItem?.file?.size" class="text-white/70">
                    {{ formatFileSize(currentItem?.file?.size) }}
                  </span>
                  <span
                    v-if="currentItem?.file?.width && currentItem?.file?.height"
                    class="text-white/70"
                  >
                    {{ currentItem?.file?.width }} × {{ currentItem?.file?.height }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2 sm:gap-1.5 flex-shrink-0 self-end sm:self-auto">
                <button
                  aria-label="Download"
                  class="p-2.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  title="Download"
                  @click="handleDownload"
                >
                  <Download class="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </Transition>

        
        <!-- Slideshow Controls (only visible in fullscreen slideshow) -->
        <Transition name="fade">
          <div
            v-if="isSlideshowPlaying && isFullscreen"
            class="absolute bottom-8 sm:bottom-6 left-1/2 -translate-x-1/2 z-[108] flex items-center gap-4 px-6 sm:px-5 py-3 sm:py-2.5 rounded-full bg-black/70 backdrop-blur-md text-white shadow-xl border border-white/10"
          >
            <button
              aria-label="Pause slideshow"
              class="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
              @click.stop="stopSlideshow"
            >
              <Pause class="w-5 h-5 sm:w-[18px] sm:h-[18px]" />
            </button>
            <div class="text-sm sm:text-xs font-medium">
              <span class="text-white/90">{{ currentIndex + 1 }}</span>
              <span class="mx-1.5 sm:mx-1 text-white/50">/</span>
              <span class="text-white/70">{{ items.length }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, Download, Loader2, X, MessageSquare, Share2, Star, Play, Pause, Heart, Lock, LockOpen } from 'lucide-vue-next'
import { getMediaDisplayUrl } from '@/utils/media/getMediaDisplayUrl'
import CustomVideoPlayer from './CustomVideoPlayer.vue'
import CommentsPanel from './CommentsPanel.vue'
import { useRealtimeComments } from '@/composables/useRealtimeComments'
import { useProofingApi } from '@/api/proofing'
import { useCollectionsApi } from '@/api/collections'
import { useSelectionsApi } from '@/api/selections'
import { useMediaApi } from '@/api/media'
import { toast } from '@/utils/toast'

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
  autoStartSlideshow: {
    type: Boolean,
    default: false,
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
  collectionId: {
    type: String,
    default: null,
  },
  selectionId: {
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
  publicMode: {
    type: Boolean,
    default: false,
  },
  isClientVerified: {
    type: Boolean,
    default: false,
  },
  allowMarkPrivate: {
    type: Boolean,
    default: false,
  },
  disableActions: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'close', 'download', 'image-error', 'open-comments', 'share', 'favorite', 'slideshow', 'toggle-private'])

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
const isFavorite = ref(false)
const isPrivate = ref(false)
const isSlideshowPlaying = ref(false)
const slideshowInterval = ref(null)
const slideshowDelay = 3000 // 3 seconds
const isFullscreen = ref(false)
const fullscreenElement = ref(null)

const proofingApi = useProofingApi()
const collectionsApi = useCollectionsApi()
const selectionsApi = useSelectionsApi()
const mediaApi = useMediaApi()

const currentItem = computed(() => {
  if (props.items.length === 0) return null
  const item = props.items[currentIndex.value] || props.items[0]
  // Ensure we return a reactive reference
  return item
})

const currentMediaType = computed(() => {
  return currentItem.value?.type || currentItem.value?.file?.type || 'image'
})

const currentComments = computed(() => {
  if (!currentItem.value) return []
  // Load comments from item or from our local state
  return comments.value.length > 0 ? comments.value : currentItem.value.feedback || []
})

// Count all comments including replies
const countAllComments = commentList => {
  const countedIds = new Set()

  const countRecursive = comments => {
    let count = 0
    for (const comment of comments) {
      if (countedIds.has(comment.id)) {
        continue
      }

      count++
      countedIds.add(comment.id)

      if (comment.replies && comment.replies.length > 0) {
        count += countRecursive(comment.replies)
      }
    }
    return count
  }

  return countRecursive(commentList)
}

const totalCommentCount = computed(() => {
  return countAllComments(currentComments.value)
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
    // Stop slideshow on manual navigation
    if (isSlideshowPlaying.value) {
      stopSlideshow()
    }
    currentIndex.value--
    isLoading.value = true
  }
}

const goToNext = () => {
  if (hasNext.value) {
    // Stop slideshow on manual navigation
    if (isSlideshowPlaying.value) {
      stopSlideshow()
    }
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

const handleShare = async () => {
  if (!currentItem.value) return
  
  const shareData = {
    title: currentItem.value.title || currentItem.value.filename || 'Media',
    url: currentMediaUrl.value,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(currentMediaUrl.value)
      // Could show a toast here
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(currentMediaUrl.value)
      } catch (clipboardError) {
        console.error('Failed to share:', clipboardError)
      }
    }
  }
  
  emit('share', currentItem.value)
}

const handleFavorite = () => {
  if (!currentItem.value || !currentItem.value.id) return
  
  if (props.disableActions) {
    toast.info('Actions are disabled in preview mode')
    return
  }
  
  // Optimistically update UI
  const newFavoriteState = !isFavorite.value
  isFavorite.value = newFavoriteState
  
  // Just emit the event - let the parent handle the API call
  // This prevents double API calls since parent views already have handlers
  emit('favorite', { item: currentItem.value, isFavorite: newFavoriteState })
}

const handleTogglePrivate = () => {
  if (!currentItem.value || !currentItem.value.id) return
  
  if (props.disableActions) {
    toast.info('Actions are disabled in preview mode')
    return
  }
  
  // Just emit the event - let the parent handle the API call and optimistic updates
  // The parent will update the items array, and we'll reactively update via watchers
  emit('toggle-private', currentItem.value)
}

const toggleSlideshow = () => {
  if (isSlideshowPlaying.value) {
    stopSlideshow()
  } else {
    startSlideshow()
  }
}

const enterFullscreen = async () => {
  try {
    const element = document.documentElement
    if (element.requestFullscreen) {
      await element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      await element.webkitRequestFullscreen()
    } else if (element.mozRequestFullScreen) {
      await element.mozRequestFullScreen()
    } else if (element.msRequestFullscreen) {
      await element.msRequestFullscreen()
    }
    isFullscreen.value = true
    fullscreenElement.value = element
  } catch (error) {
    console.error('Failed to enter fullscreen:', error)
  }
}

const exitFullscreen = async () => {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      await document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      await document.msExitFullscreen()
    }
    isFullscreen.value = false
    fullscreenElement.value = null
  } catch (error) {
    console.error('Failed to exit fullscreen:', error)
  }
}

const handleFullscreenChange = () => {
  const isCurrentlyFullscreen = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  )
  
  if (!isCurrentlyFullscreen && isFullscreen.value) {
    // User exited fullscreen manually, stop slideshow
    stopSlideshow()
  }
  isFullscreen.value = isCurrentlyFullscreen
}

const slideshowNext = () => {
  if (hasNext.value) {
    currentIndex.value++
    isLoading.value = true
  } else {
    // Loop back to start
    currentIndex.value = 0
    isLoading.value = true
    updateMediaUrl()
  }
}

const startSlideshow = async () => {
  if (props.items.length <= 1) return
  
  // Enter fullscreen first
  await enterFullscreen()
  
  isSlideshowPlaying.value = true
  emit('slideshow', { playing: true })
  
  slideshowInterval.value = setInterval(() => {
    slideshowNext()
  }, slideshowDelay)
}

const stopSlideshow = async () => {
  isSlideshowPlaying.value = false
  emit('slideshow', { playing: false })
  
  if (slideshowInterval.value) {
    clearInterval(slideshowInterval.value)
    slideshowInterval.value = null
  }
  
  // Exit fullscreen when slideshow stops
  if (isFullscreen.value) {
    await exitFullscreen()
  }
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
    // If in fullscreen slideshow, stop it first
    if (isSlideshowPlaying.value) {
      stopSlideshow()
    } else {
      handleClose()
    }
  } else if (e.key === ' ' || e.key === 'Spacebar') {
    // Spacebar toggles slideshow
    e.preventDefault()
    if (props.items.length > 1) {
      toggleSlideshow()
    }
  } else if (e.key === 'f' || e.key === 'F') {
    // F key toggles fullscreen
    e.preventDefault()
    if (isFullscreen.value) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
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
    
    // Auto-start slideshow if prop is set
    if (props.autoStartSlideshow && props.items.length > 1) {
      // Small delay to ensure lightbox is fully rendered
      setTimeout(() => {
        startSlideshow()
      }, 500)
    }
    loadComments()
    connectRealtime()
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)
    document.body.style.overflow = 'hidden'
    // Initialize favorite state from item
    isFavorite.value = currentItem.value?.isStarred || currentItem.value?.starred || false
    // Initialize private state from item
    isPrivate.value = currentItem.value?.isPrivate || false
    
    // Track private photo access when lightbox opens (only in public mode)
    if (props.publicMode && isPrivate.value && props.collectionId && currentItem.value?.id) {
      import('@/api/collections').then(({ useCollectionsApi }) => {
        const { trackPrivatePhotoAccess } = useCollectionsApi()
        trackPrivatePhotoAccess(props.collectionId, currentItem.value.id).catch(err => {
          console.warn('Failed to track private photo access:', err)
        })
      })
    }
  } else {
    stopSlideshow()
    disconnectRealtime()
    showComments.value = false
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    document.body.style.overflow = ''
  }
})

watch(
  currentItem,
  () => {
    updateMediaUrl()
    loadComments()
    // Update favorite state for new item
    isFavorite.value = currentItem.value?.isStarred || currentItem.value?.starred || false
    // Update private state for new item
    isPrivate.value = currentItem.value?.isPrivate || false
    
    // Track private photo access (only in public mode)
    if (props.publicMode && isOpen.value && isPrivate.value && props.collectionId && currentItem.value?.id) {
      import('@/api/collections').then(({ useCollectionsApi }) => {
        const { trackPrivatePhotoAccess } = useCollectionsApi()
        trackPrivatePhotoAccess(props.collectionId, currentItem.value.id).catch(err => {
          console.warn('Failed to track private photo access:', err)
        })
      })
    }
    
    // Reconnect real-time for new media
    if (isOpen.value) {
      disconnectRealtime()
      connectRealtime()
    }
  },
  { immediate: false }
)

// Watch for changes to item's starred state from parent updates
watch(
  () => currentItem.value,
  (item) => {
    if (item) {
      const starred = item.isStarred ?? item.starred ?? false
      isFavorite.value = !!starred
      const privateState = item.isPrivate ?? false
      isPrivate.value = !!privateState
    }
  },
  { immediate: false, deep: true }
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
  stopSlideshow()
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
  document.body.style.overflow = ''
})
</script>
<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox-slide-enter-active,
.lightbox-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.lightbox-slide-enter-from {
  opacity: 0;
  transform: scale(0.96) translateY(10px);
}

.lightbox-slide-leave-to {
  opacity: 0;
  transform: scale(1.04) translateY(-10px);
}

.comments-slide-enter-active,
.comments-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.comments-slide-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.comments-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 768px) {
  .comments-slide-enter-from {
    transform: translateX(100%);
  }

  .comments-slide-leave-to {
    transform: translateX(100%);
  }
}

/* Fade transition for loading state */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up transition for media info */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
