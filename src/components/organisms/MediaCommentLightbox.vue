<template>
  <Teleport to="body">
    <Transition name="viewer-fade">
      <div
        v-if="isOpen"
        :class="[
          'fixed inset-0 z-[100] flex',
          isMobile ? 'flex-col' : 'flex-row',
          'bg-black/95 backdrop-blur-sm',
        ]"
        @click.self="handleClose"
      >
        <!-- Close Button -->
        <button
          aria-label="Close viewer"
          class="absolute top-4 right-4 z-[102] w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 border border-white/10"
          @click.stop="handleClose"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- Main Content Area (Media + Comments) -->
        <div
          :class="[
            'relative flex-1 flex items-center justify-center',
            isMobile ? 'p-2' : 'p-4 md:p-8',
            { 'hidden md:flex': isMobile && showComments }, // Hide media on mobile when comments drawer is open
          ]"
        >
          <!-- Navigation Buttons (positioned at container edges, outside media) -->
          <template v-if="items.length > 1">
            <button
              v-if="hasPrevious"
              aria-label="Previous"
              :class="[
                'absolute top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 border border-white/10 group',
                isMobile ? 'left-2' : 'left-4',
              ]"
              @click.stop="goToPrevious"
            >
              <ChevronLeft class="w-6 h-6 group-hover:translate-x-[-2px] transition-transform" />
            </button>
            <button
              v-if="hasNext"
              aria-label="Next"
              :class="[
                'absolute top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 border border-white/10 group',
                isMobile ? 'right-2' : 'right-[100px]',
              ]"
              @click.stop="goToNext"
            >
              <ChevronRight class="w-6 h-6 group-hover:translate-x-[2px] transition-transform" />
            </button>
          </template>
          <Transition mode="out-in" name="viewer-slide">
            <div
              :key="currentIndex"
              :class="[
                'relative max-w-full max-h-full w-full h-full flex items-center justify-center overflow-hidden',
                // Add horizontal padding when navigation buttons are present to prevent overlap
                items.length > 1 ? (isMobile ? 'px-14' : 'px-16') : '',
              ]"
              @wheel.prevent="handleWheelZoom"
            >
              <!-- Image Container with Zoom -->
              <div
                v-if="currentMediaType === 'image' && currentMediaUrl"
                ref="imageContainerRef"
                class="relative w-full h-full flex items-center justify-center cursor-move"
                :style="imageTransformStyle"
                @mousedown="handleMouseDown"
                @mousemove="handleMouseMove"
                @mouseup="handleMouseUp"
                @mouseleave="handleMouseUp"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="handleTouchEnd"
                @dblclick="handleDoubleClick"
              >
                <img
                  :alt="currentItem?.title || currentItem?.filename || 'Media'"
                  :src="currentMediaUrl"
                  class="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl select-none transition-opacity duration-300"
                  :class="isLoading ? 'opacity-0' : 'opacity-100'"
                  draggable="false"
                  :style="imageStyle"
                  @error="handleImageError"
                  @load="handleImageLoad"
                />
              </div>

              <!-- Video (no zoom) -->

              <!-- Video -->
              <CustomVideoPlayer
                v-else-if="currentMediaType === 'video' && currentMediaUrl"
                ref="videoPlayerRef"
                :poster="currentThumbnailUrl || undefined"
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
                class="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg"
              >
                <div class="flex flex-col items-center gap-3">
                  <Loader2 class="w-10 h-10 text-white animate-spin" />
                  <p class="text-white/80 text-sm font-medium">Loading media...</p>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Media Info (Bottom) -->
        <div
          v-if="currentItem && currentMediaType !== 'video' && !isMobile"
          class="absolute bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-sm"
        >
          <div class="max-w-4xl mx-auto flex items-center justify-between text-white">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold truncate drop-shadow-lg">
                {{ currentItem?.title || currentItem?.filename || 'Untitled' }}
              </h3>
              <p
                v-if="currentItem?.description"
                class="text-sm text-gray-200 mt-1 truncate drop-shadow-md"
              >
                {{ currentItem.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Counter (Top Center) -->
        <div
          v-if="items.length > 1"
          class="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md text-white text-sm font-medium shadow-xl border border-white/10"
        >
          <span class="font-semibold">{{ currentIndex + 1 }}</span>
          <span class="mx-1.5 text-white/60">/</span>
          <span class="text-white/80">{{ items.length }}</span>
        </div>

        <!-- Zoom Controls (only for images) -->
        <div
          v-if="currentMediaType === 'image' && currentMediaUrl"
          :class="[
            'absolute z-50 flex flex-col gap-2',
            isMobile ? 'bottom-20 right-4' : 'bottom-4 right-4',
          ]"
        >
          <button
            aria-label="Zoom in"
            class="w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 border border-white/10"
            @click.stop="zoomIn"
          >
            <ZoomIn class="w-5 h-5" />
          </button>
          <button
            v-if="zoomLevel > 1"
            aria-label="Reset zoom"
            class="w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 border border-white/10"
            @click.stop="resetZoom"
          >
            <RotateCcw class="w-5 h-5" />
          </button>
          <button
            aria-label="Zoom out"
            class="w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 border border-white/10"
            @click.stop="zoomOut"
          >
            <ZoomOut class="w-5 h-5" />
          </button>
        </div>

        <!-- Mobile "Show Comments" Button -->
        <div
          v-if="isMobile && !showComments"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 z-50"
        >
          <Button
            class="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white shadow-xl border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
            @click="showComments = true"
          >
            <MessageSquare class="h-4 w-4 mr-2" />
            <span class="font-medium">Comments</span>
            <span
              v-if="totalCommentCount > 0"
              class="ml-2 px-2 py-0.5 rounded-full bg-teal-500 text-white text-xs font-bold shadow-md"
            >
              {{ totalCommentCount }}
            </span>
          </Button>
        </div>

        <!-- Comments Panel (Desktop Sidebar / Mobile Drawer) -->
        <div
          :class="[
            'relative z-[101]',
            isMobile
              ? 'fixed inset-x-0 bottom-0 h-3/4 transform translate-y-full transition-transform duration-300 ease-out shadow-2xl'
              : 'w-full md:w-[450px] flex-shrink-0 border-l border-gray-800/50',
            { 'translate-y-0': isMobile && showComments },
          ]"
        >
          <CommentsPanel
            v-if="currentItem"
            :media-id="currentItem.id"
            :comments="currentComments"
            :is-video="currentMediaType === 'video'"
            :current-video-time="currentVideoTime"
            :is-loading="isLoadingComments"
            :allow-reply="true"
            :guest-email="guestEmail"
            :creative-email="creativeEmail"
            :show-close-button="isMobile"
            @add-comment="handleAddComment"
            @seek-to-timestamp="handleSeekVideo"
            @update-comment="handleUpdateComment"
            @delete-comment="handleDeleteComment"
            @close="showComments = false"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-vue-next'
import CustomVideoPlayer from './CustomVideoPlayer.vue'
import CommentsPanel from './CommentsPanel.vue'
import { Button } from '@/components/shadcn/button'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useProofingApi } from '@/api/proofing'
import { useRealtimeComments } from '@/composables/useRealtimeComments'

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
  proofingId: {
    type: String,
    required: true,
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
  guestEmail: {
    type: String,
    default: null,
  },
  creativeEmail: {
    type: String,
    default: null,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'close',
  'comment-added',
  'comment-updated',
  'comment-deleted',
])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const isMobile = useMediaQuery('(max-width: 768px)')
const currentIndex = ref(props.initialIndex)
const isLoading = ref(false)
const currentMediaUrl = ref('')
const currentThumbnailUrl = ref('')
const showComments = ref(false)
const videoPlayerRef = ref(null)
const currentVideoTime = ref(0)
const comments = ref([])
const isLoadingComments = ref(false)

// Zoom state
const imageContainerRef = ref(null)
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const lastTouchDistance = ref(0)
const lastTouchCenter = ref({ x: 0, y: 0 })

const proofingApi = useProofingApi()

const currentItem = computed(() => {
  if (props.items.length === 0) return null
  return props.items[currentIndex.value] || props.items[0]
})

const currentMediaType = computed(() => {
  return currentItem.value?.type || currentItem.value?.file?.type || 'image'
})

// Count all comments including replies recursively
// Counts ALL comments: both top-level comments and replies
// Uses a Set to avoid double-counting if a reply appears both in the array and nested in replies
const countAllComments = commentList => {
  const countedIds = new Set()

  const countRecursive = comments => {
    let count = 0
    for (const comment of comments) {
      // Skip if already counted (to avoid double-counting)
      if (countedIds.has(comment.id)) {
        continue
      }

      // Count this comment
      count++
      countedIds.add(comment.id)

      // Count nested replies recursively
      if (comment.replies && comment.replies.length > 0) {
        count += countRecursive(comment.replies)
      }
    }
    return count
  }

  return countRecursive(commentList)
}

const currentComments = computed(() => {
  if (!currentItem.value) return []
  // Load comments from item or from our local state
  return comments.value.length > 0 ? comments.value : currentItem.value.feedback || []
})

// Total comment count including replies
// Counts ALL comments (both top-level and replies)
const totalCommentCount = computed(() => {
  return countAllComments(currentComments.value)
})

// Zoom computed styles
const imageTransformStyle = computed(() => {
  return {
    transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoomLevel.value})`,
    transition: isDragging.value ? 'none' : 'transform 0.2s ease-out',
  }
})

const imageStyle = computed(() => {
  return {
    transformOrigin: 'center center',
  }
})

const hasPrevious = computed(() => {
  return props.items.length > 1 && currentIndex.value > 0
})

const hasNext = computed(() => {
  return props.items.length > 1 && currentIndex.value < props.items.length - 1
})

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
    return item.file?.url || item.url || null
  }

  // For videos, return the video URL
  if (mediaType === 'video') {
    return item.file?.url || item.url || null
  }

  return item.file?.url || item.url || null
}

const getThumbnailUrl = item => {
  if (!item) return null

  const mediaType = item.type || item.file?.type

  // For videos, check file thumbnailUrl or metadata thumbnail
  if (mediaType === 'video') {
    if (item.file?.thumbnailUrl && item.file.thumbnailUrl !== item.file?.url) {
      return item.file.thumbnailUrl
    }
    if (item.file?.metadata?.thumbnail) {
      return item.file.metadata.thumbnail
    }
    return null
  }

  // For images, use file URL or variants
  if (mediaType === 'image') {
    if (item.file?.variants?.thumb) {
      return item.file.variants.thumb
    }
    return item.file?.url || item.url
  }

  return item.file?.url || item.url || item.thumbnail
}

const updateMediaUrl = async () => {
  if (!currentItem.value) {
    currentMediaUrl.value = ''
    currentThumbnailUrl.value = ''
    return
  }

  isLoading.value = true

  try {
    const url = getMediaUrl(currentItem.value)
    const thumbnail = getThumbnailUrl(currentItem.value)

    currentMediaUrl.value = url || ''
    currentThumbnailUrl.value = thumbnail || ''

    // Comments are handled separately by loadComments() to ensure proper scoping
  } catch (error) {
    console.error('Failed to update media URL:', error)
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  isOpen.value = false
  emit('close')
}

const goToPrevious = () => {
  if (hasPrevious.value) {
    currentIndex.value--
    updateMediaUrl()
  }
}

const goToNext = () => {
  if (hasNext.value) {
    currentIndex.value++
    updateMediaUrl()
  }
}

const handleKeyDown = event => {
  if (!isOpen.value) return

  switch (event.key) {
    case 'Escape':
      if (isMobile && showComments.value) {
        showComments.value = false
      } else {
        handleClose()
      }
      break
    case 'ArrowLeft':
      if (!isMobile || !showComments.value) {
        goToPrevious()
      }
      break
    case 'ArrowRight':
      if (!isMobile || !showComments.value) {
        goToNext()
      }
      break
  }
}

const handleImageError = () => {
  console.error('Failed to load image')
  isLoading.value = false
}

const handleImageLoad = () => {
  isLoading.value = false
}

const handleVideoError = () => {
  console.error('Failed to load video')
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

const handleSeekVideo = timestamp => {
  if (videoPlayerRef.value && videoPlayerRef.value.seekTo) {
    videoPlayerRef.value.seekTo(timestamp)
  }
}

// Zoom functions
const MIN_ZOOM = 1
const MAX_ZOOM = 5
const ZOOM_STEP = 0.25

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + ZOOM_STEP, MAX_ZOOM)
  constrainPan()
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - ZOOM_STEP, MIN_ZOOM)
  if (zoomLevel.value === MIN_ZOOM) {
    resetZoom()
  } else {
    constrainPan()
  }
}

const resetZoom = () => {
  zoomLevel.value = MIN_ZOOM
  panX.value = 0
  panY.value = 0
}

const constrainPan = () => {
  // Constrain panning to keep image within bounds
  const maxPan = 100 * zoomLevel.value
  panX.value = Math.max(-maxPan, Math.min(maxPan, panX.value))
  panY.value = Math.max(-maxPan, Math.min(maxPan, panY.value))
}

// Mouse wheel zoom
const handleWheelZoom = event => {
  if (currentMediaType.value !== 'image') return

  event.preventDefault()
  const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
  const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel.value + delta))

  if (newZoom !== zoomLevel.value) {
    // Zoom towards mouse position
    const rect = imageContainerRef.value?.getBoundingClientRect()
    if (rect) {
      const mouseX = event.clientX - rect.left - rect.width / 2
      const mouseY = event.clientY - rect.top - rect.height / 2

      const zoomFactor = newZoom / zoomLevel.value
      panX.value = mouseX - (mouseX - panX.value) * zoomFactor
      panY.value = mouseY - (mouseY - panY.value) * zoomFactor
    }

    zoomLevel.value = newZoom
    constrainPan()
  }
}

// Mouse drag for panning
const handleMouseDown = event => {
  if (zoomLevel.value <= MIN_ZOOM) return
  isDragging.value = true
  dragStart.value = { x: event.clientX - panX.value, y: event.clientY - panY.value }
}

const handleMouseMove = event => {
  if (!isDragging.value || zoomLevel.value <= MIN_ZOOM) return
  panX.value = event.clientX - dragStart.value.x
  panY.value = event.clientY - dragStart.value.y
  constrainPan()
}

const handleMouseUp = () => {
  isDragging.value = false
}

// Touch events for pinch-to-zoom
const handleTouchStart = event => {
  if (event.touches.length === 2) {
    const touch1 = event.touches[0]
    const touch2 = event.touches[1]
    lastTouchDistance.value = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    )
    lastTouchCenter.value = {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    }
  } else if (event.touches.length === 1 && zoomLevel.value > MIN_ZOOM) {
    isDragging.value = true
    dragStart.value = {
      x: event.touches[0].clientX - panX.value,
      y: event.touches[0].clientY - panY.value,
    }
  }
}

const handleTouchMove = event => {
  event.preventDefault()

  if (event.touches.length === 2) {
    // Pinch to zoom
    const touch1 = event.touches[0]
    const touch2 = event.touches[1]
    const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)

    if (lastTouchDistance.value > 0) {
      const scale = distance / lastTouchDistance.value
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel.value * scale))

      if (newZoom !== zoomLevel.value) {
        const rect = imageContainerRef.value?.getBoundingClientRect()
        if (rect) {
          const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left - rect.width / 2
          const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top - rect.height / 2

          const zoomFactor = newZoom / zoomLevel.value
          panX.value = centerX - (centerX - panX.value) * zoomFactor
          panY.value = centerY - (centerY - panY.value) * zoomFactor
        }

        zoomLevel.value = newZoom
        constrainPan()
      }

      lastTouchDistance.value = distance
    }
  } else if (event.touches.length === 1 && isDragging.value && zoomLevel.value > MIN_ZOOM) {
    // Pan with single touch
    panX.value = event.touches[0].clientX - dragStart.value.x
    panY.value = event.touches[0].clientY - dragStart.value.y
    constrainPan()
  }
}

const handleTouchEnd = () => {
  isDragging.value = false
  lastTouchDistance.value = 0
}

// Double-click to zoom
const handleDoubleClick = event => {
  if (currentMediaType.value !== 'image') return

  if (zoomLevel.value > MIN_ZOOM) {
    resetZoom()
  } else {
    // Zoom in to 2x at click position
    const rect = imageContainerRef.value?.getBoundingClientRect()
    if (rect) {
      const clickX = event.clientX - rect.left - rect.width / 2
      const clickY = event.clientY - rect.top - rect.height / 2

      zoomLevel.value = 2
      panX.value = -clickX
      panY.value = -clickY
      constrainPan()
    }
  }
}

const handleAddComment = async commentData => {
  if (!currentItem.value) return

  // Optimistically add comment immediately
  const tempId = `temp-${Date.now()}`
  const optimisticComment = {
    id: tempId,
    mediaId: currentItem.value.id,
    type: commentData.type,
    content: commentData.content,
    parentId: commentData.parentId || null,
    timestamp: commentData.timestamp || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy:
      props.creativeEmail || props.guestEmail
        ? {
            email: props.creativeEmail || props.guestEmail,
            name: props.creativeEmail || props.guestEmail,
          }
        : null,
    replies: [],
  }

  // Add optimistically
  if (commentData.parentId) {
    const parentIndex = comments.value.findIndex(c => c.id === commentData.parentId)
    if (parentIndex !== -1) {
      if (!comments.value[parentIndex].replies) {
        comments.value[parentIndex].replies = []
      }
      comments.value[parentIndex].replies.push(optimisticComment)
    } else {
      // Search in nested replies
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
      if (!findAndAddReply(comments.value, commentData.parentId, optimisticComment)) {
        comments.value = [...comments.value, optimisticComment]
      }
    }
  } else {
    comments.value = [...comments.value, optimisticComment]
  }

  try {
    // Don't set isLoadingComments to true - we want to append optimistically without showing skeleton
    // isLoadingComments.value = true

    // Get setId from current item or props
    const setId = currentItem.value.setId || props.setId

    if (!props.proofingId || !setId) {
      console.error('Missing proofingId or setId:', { proofingId: props.proofingId, setId })
      return
    }

    const response = await proofingApi.addMediaFeedback(
      props.proofingId,
      setId,
      currentItem.value.id,
      commentData,
      props.projectId,
      props.guestToken // Pass guest token if available (null for authenticated users)
    )

    console.log('API Response:', response)

    // The API returns response.data which is the comment object
    // Handle different response structures
    let newComment = null
    if (response?.data?.data) {
      newComment = response.data.data
    } else if (response?.data) {
      newComment = response.data
    } else if (response) {
      newComment = response
    }

    console.log('Extracted comment:', newComment)

    if (!newComment || !newComment.id) {
      console.error('Invalid comment response - missing id:', { response, newComment })
      // Remove optimistic comment on invalid response
      const removeComment = (commentList, tempId) => {
        const index = commentList.findIndex(c => c.id === tempId)
        if (index !== -1) {
          commentList.splice(index, 1)
          return true
        }
        for (const comment of commentList) {
          if (comment.replies && comment.replies.length > 0) {
            if (removeComment(comment.replies, tempId)) {
              return true
            }
          }
        }
        return false
      }
      removeComment(comments.value, tempId)
      // Force reactivity update
      comments.value = [...comments.value]
      return
    }

    // Replace optimistic comment with real one using a new array to trigger reactivity
    const replaceComment = (commentList, tempId, realComment) => {
      const newList = commentList.map(comment => {
        if (comment.id === tempId) {
          // Found the optimistic comment, replace it
          return {
            ...realComment,
            replies: realComment.replies || comment.replies || [],
          }
        }
        if (comment.replies && comment.replies.length > 0) {
          // Recursively check replies
          const updatedReplies = replaceComment(comment.replies, tempId, realComment)
          return {
            ...comment,
            replies: updatedReplies,
          }
        }
        return comment
      })
      return newList
    }

    const updatedComments = replaceComment(comments.value, tempId, newComment)

    // Check if replacement actually happened (tempId should not exist in updatedComments)
    const tempCommentStillExists =
      updatedComments.some(c => c.id === tempId) ||
      updatedComments.some(c => c.replies?.some(r => r.id === tempId))

    console.log('Replacement check:', {
      tempCommentStillExists,
      tempId,
      newCommentId: newComment.id,
    })

    if (!tempCommentStillExists) {
      // Replacement successful - update comments
      console.log('Replacing optimistic comment with real one:', newComment.id)
      comments.value = updatedComments
      console.log(
        'Comments after replacement:',
        comments.value.length,
        comments.value.map(c => c.id)
      )

      // Emit event to update parent component's comment count
      emit('comment-added', {
        mediaId: currentItem.value.id,
        comment: newComment,
        allComments: comments.value,
      })
    } else {
      // If the comment wasn't found, add it directly
      console.warn('Optimistic comment not found, adding new comment directly')
      if (newComment.parentId) {
        // Find parent and add as reply
        const findAndAddReply = (commentList, parentId, reply) => {
          for (let i = 0; i < commentList.length; i++) {
            if (commentList[i].id === parentId) {
              if (!commentList[i].replies) {
                commentList[i] = { ...commentList[i], replies: [] }
              }
              commentList[i].replies = [...commentList[i].replies, reply]
              return true
            }
            if (commentList[i].replies && commentList[i].replies.length > 0) {
              if (findAndAddReply(commentList[i].replies, parentId, reply)) {
                return true
              }
            }
          }
          return false
        }
        if (findAndAddReply(comments.value, newComment.parentId, newComment)) {
          // Force reactivity
          comments.value = [...comments.value]
        } else {
          comments.value = [...comments.value, newComment]
        }
      } else {
        comments.value = [...comments.value, newComment]
      }

      // Emit event to update parent component's comment count
      emit('comment-added', {
        mediaId: currentItem.value.id,
        comment: newComment,
        allComments: comments.value,
      })
    }
  } catch (error) {
    console.error('Failed to add comment:', error)
    // Remove optimistic comment on error
    const removeComment = (commentList, tempId) => {
      const index = commentList.findIndex(c => c.id === tempId)
      if (index !== -1) {
        commentList.splice(index, 1)
        return true
      }
      for (const comment of commentList) {
        if (comment.replies && comment.replies.length > 0) {
          if (removeComment(comment.replies, tempId)) {
            return true
          }
        }
      }
      return false
    }
    removeComment(comments.value, tempId)
    throw error
  }
  // No finally block needed since we're not setting isLoadingComments
}

const handleUpdateComment = async ({ commentId, content }) => {
  if (!currentItem.value || !commentId || !content) {
    console.error('Missing required parameters for update:', {
      commentId,
      content,
      currentItem: currentItem.value,
    })
    return
  }

  // Optimistically update
  const updateComment = (commentList, id, newContent) => {
    const index = commentList.findIndex(c => c.id === id)
    if (index !== -1) {
      commentList[index].content = newContent
      commentList[index].updatedAt = new Date().toISOString()
      return true
    }
    for (const comment of commentList) {
      if (comment.replies && comment.replies.length > 0) {
        if (updateComment(comment.replies, id, newContent)) {
          return true
        }
      }
    }
    return false
  }
  updateComment(comments.value, commentId, content)

  try {
    isLoadingComments.value = true

    // Get setId from current item or props
    const setId = currentItem.value.setId || props.setId

    if (!props.proofingId || !setId) {
      console.error('Missing proofingId or setId:', { proofingId: props.proofingId, setId })
      return
    }

    const updatedFeedback = await proofingApi.updateMediaFeedback(
      props.proofingId,
      setId,
      currentItem.value.id,
      commentId,
      content,
      props.projectId,
      props.guestToken
    )

    // Emit event to update parent component
    emit('comment-updated', {
      mediaId: currentItem.value.id,
      commentId,
      comment: updatedFeedback?.data || updatedFeedback,
      allComments: comments.value,
    })
  } catch (error) {
    console.error('Failed to update comment:', error)
    // Revert optimistic update on error
    await loadComments()
    throw error
  } finally {
    isLoadingComments.value = false
  }
}

const handleDeleteComment = async commentId => {
  if (!currentItem.value || !commentId) {
    console.error('Missing required parameters for delete:', {
      commentId,
      currentItem: currentItem.value,
    })
    return
  }

  // Optimistically remove
  const removeComment = (commentList, id) => {
    const index = commentList.findIndex(c => c.id === id)
    if (index !== -1) {
      commentList.splice(index, 1)
      return true
    }
    for (const comment of commentList) {
      if (comment.replies && comment.replies.length > 0) {
        if (removeComment(comment.replies, id)) {
          return true
        }
      }
    }
    return false
  }
  const originalComments = JSON.parse(JSON.stringify(comments.value))
  removeComment(comments.value, commentId)

  try {
    isLoadingComments.value = true

    // Get setId from current item or props
    const setId = currentItem.value.setId || props.setId

    if (!props.proofingId || !setId) {
      console.error('Missing proofingId or setId:', { proofingId: props.proofingId, setId })
      // Revert optimistic delete
      comments.value = originalComments
      return
    }

    await proofingApi.deleteMediaFeedback(
      props.proofingId,
      setId,
      currentItem.value.id,
      commentId,
      props.projectId,
      props.guestToken
    )

    // Emit event to update parent component
    emit('comment-deleted', {
      mediaId: currentItem.value.id,
      commentId,
      allComments: comments.value,
    })
  } catch (error) {
    console.error('Failed to delete comment:', error)
    // Revert optimistic delete on error
    comments.value = originalComments
    throw error
  } finally {
    isLoadingComments.value = false
  }
}

const loadComments = async () => {
  if (!currentItem.value) {
    comments.value = []
    return
  }

  const currentMediaId = currentItem.value.id || currentItem.value.uuid

  // Remove comments from previous media items (keep only comments for current media)
  comments.value = comments.value.filter(comment => {
    const commentMediaId = comment.mediaId || comment.media_uuid
    return commentMediaId === currentMediaId
  })

  // Load comments from current item's feedback
  if (currentItem.value.feedback && Array.isArray(currentItem.value.feedback)) {
    // Merge with existing comments for this media (avoid duplicates)
    const existingIds = new Set(comments.value.map(c => c.id))
    const newComments = currentItem.value.feedback.filter(c => {
      const commentMediaId = c.mediaId || c.media_uuid
      return commentMediaId === currentMediaId && !existingIds.has(c.id)
    })

    if (newComments.length > 0) {
      comments.value = [...comments.value, ...newComments]
    } else if (comments.value.length === 0) {
      // No existing comments and no new comments, use feedback from item
      comments.value = currentItem.value.feedback
    }
  } else if (comments.value.length === 0) {
    // If feedback not loaded and no local comments, set to empty
    comments.value = []
  }
  // If we have local comments but no item feedback, keep local comments
}

// Initialize real-time comments
const { connect: connectRealtime, disconnect: disconnectRealtime } = useRealtimeComments(
  computed(() => currentItem.value?.id || ''),
  {
    onCommentCreated: newComment => {
      if (newComment.mediaId === currentItem.value?.id) {
        // Check if comment already exists (to avoid duplicates from real-time updates)
        const commentExists =
          comments.value.some(c => c.id === newComment.id) ||
          comments.value.some(c => c.replies?.some(r => r.id === newComment.id))

        if (commentExists) {
          // Comment already exists (probably from optimistic update), skip adding
          return
        }

        // If it's a reply, add it to the parent comment's replies array
        if (newComment.parentId) {
          const parentIndex = comments.value.findIndex(c => c.id === newComment.parentId)
          if (parentIndex !== -1) {
            if (!comments.value[parentIndex].replies) {
              comments.value[parentIndex] = { ...comments.value[parentIndex], replies: [] }
            }
            comments.value[parentIndex].replies = [
              ...comments.value[parentIndex].replies,
              newComment,
            ]
            // Force reactivity
            comments.value = [...comments.value]
          } else {
            // Parent not found in top-level, search in replies
            const findAndAddReply = (commentList, parentId, reply) => {
              for (let i = 0; i < commentList.length; i++) {
                if (commentList[i].id === parentId) {
                  if (!commentList[i].replies) {
                    commentList[i] = { ...commentList[i], replies: [] }
                  }
                  commentList[i].replies = [...commentList[i].replies, reply]
                  return true
                }
                if (commentList[i].replies && commentList[i].replies.length > 0) {
                  if (findAndAddReply(commentList[i].replies, parentId, reply)) {
                    return true
                  }
                }
              }
              return false
            }
            if (findAndAddReply(comments.value, newComment.parentId, newComment)) {
              // Force reactivity
              comments.value = [...comments.value]
            } else {
              // If parent not found, add as top-level comment
              comments.value = [...comments.value, newComment]
            }
          }
        } else {
          // Top-level comment
          comments.value = [...comments.value, newComment]
        }

        // Emit event to update parent component's comment count
        emit('comment-added', {
          mediaId: currentItem.value?.id,
          comment: newComment,
          allComments: comments.value,
        })
      }
    },
    onCommentUpdated: updatedComment => {
      const currentMediaId = currentItem.value?.id || currentItem.value?.uuid
      const commentMediaId = updatedComment.mediaId || updatedComment.media_uuid

      // Only update comments for the current media item
      if (commentMediaId === currentMediaId) {
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

        // Emit event to update parent component
        emit('comment-updated', {
          mediaId: currentItem.value?.id,
          commentId: updatedComment.id,
          comment: updatedComment,
          allComments: comments.value,
        })
      }
    },
    fetchComments: loadComments,
  }
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
  (newItem, oldItem) => {
    // Clear comments when switching to a different media item
    if (oldItem && newItem) {
      const oldMediaId = oldItem.id || oldItem.uuid
      const newMediaId = newItem.id || newItem.uuid

      if (oldMediaId !== newMediaId) {
        // Clear comments from previous media to ensure correct scoping
        comments.value = []
      }
    }

    updateMediaUrl()
    loadComments()
    // Reset zoom when changing media
    resetZoom()
    // Reconnect real-time for new media
    if (isOpen.value) {
      disconnectRealtime()
      connectRealtime()
    }
  },
  { immediate: false }
)

watch(
  () => props.items,
  newItems => {
    if (isOpen.value && newItems.length > 0) {
      const safeIndex = Math.max(0, Math.min(currentIndex.value, newItems.length - 1))
      currentIndex.value = safeIndex
      updateMediaUrl()
    }
  },
  { deep: true }
)

watch(showComments, newValue => {
  if (isMobile) {
    document.body.style.overflow = newValue ? 'hidden' : ''
  }
})

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
.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.viewer-fade-enter-from,
.viewer-fade-leave-to {
  opacity: 0;
}

.viewer-slide-enter-active,
.viewer-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.viewer-slide-enter-from {
  opacity: 0;
  transform: scale(0.96) translateX(20px);
}

.viewer-slide-leave-to {
  opacity: 0;
  transform: scale(1.04) translateX(-20px);
}

/* Smooth scrollbar for comments panel */
:deep(.overflow-y-auto) {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar) {
  width: 6px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
