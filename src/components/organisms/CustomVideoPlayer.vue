<template>
  <div
    class="relative w-full h-full flex items-center justify-center group z-[55]"
    @mouseenter="showControls = true"
    @mouseleave="hideControlsDelayed"
  >
    <!-- Video Element -->
    <video
      ref="videoRef"
      :poster="poster"
      :src="src"
      class="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
      playsinline
      preload="metadata"
      @loadedmetadata="handleLoadedMetadata"
      @timeupdate="handleTimeUpdate"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="handleEnded"
      @error="handleError"
      @click="togglePlay"
    >
      Your browser does not support the video tag.
    </video>

    <!-- Custom Controls Overlay -->
    <Transition name="controls-fade">
      <div
        v-if="showControls || !isPlaying"
        class="absolute inset-0 z-[60] flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/40 to-black/20 rounded-lg"
        @click.stop
      >
        <!-- Top Controls -->
        <div class="flex items-center justify-end p-4 gap-2 relative z-[70]">
          <button
            v-if="allowFullscreen"
            aria-label="Fullscreen"
            class="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
            @click="toggleFullscreen"
          >
            <Maximize v-if="!isFullscreen" class="w-5 h-5" />
            <Minimize v-else class="w-5 h-5" />
          </button>
        </div>

        <!-- Center Play Button (when paused) -->
        <div v-if="!isPlaying" class="flex items-center justify-center z-[70]">
          <button
            aria-label="Play"
            class="w-20 h-20 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110"
            @click="togglePlay"
          >
            <Play class="w-10 h-10 ml-1" />
          </button>
        </div>

        <!-- Bottom Controls -->
        <div class="p-4 space-y-2 z-[70]">
          <!-- Progress Bar -->
          <div
            class="relative w-full h-2 bg-white/20 rounded-full cursor-pointer group/progress"
            @click="handleProgressClick"
          >
            <div
              class="absolute top-0 left-0 h-full bg-teal-500 rounded-full transition-all duration-150"
              :style="{ width: `${progressPercent}%` }"
            />
            <div
              class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
              :style="{ left: `calc(${progressPercent}% - 8px)` }"
            />
          </div>

          <!-- Control Buttons -->
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <!-- Play/Pause Button -->
              <button
                aria-label="Play/Pause"
                class="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
                @click="togglePlay"
              >
                <Pause v-if="isPlaying" class="w-5 h-5" />
                <Play v-else class="w-5 h-5 ml-0.5" />
              </button>

              <!-- Volume Control -->
              <div class="flex items-center gap-2 group/volume">
                <button
                  aria-label="Mute/Unmute"
                  class="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
                  @click="toggleMute"
                >
                  <Volume2 v-if="!isMuted && volume > 0.5" class="w-5 h-5" />
                  <Volume1 v-else-if="!isMuted && volume > 0" class="w-5 h-5" />
                  <VolumeX v-else class="w-5 h-5" />
                </button>
                <div
                  class="w-24 h-1 bg-white/20 rounded-full cursor-pointer opacity-0 group-hover/volume:opacity-100 transition-opacity"
                  @click.stop="handleVolumeClick"
                >
                  <div
                    class="h-full bg-teal-500 rounded-full transition-all duration-150"
                    :style="{ width: `${volume * 100}%` }"
                  />
                </div>
              </div>

              <!-- Time Display -->
              <div class="text-white text-sm font-medium min-w-[100px]">
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
              </div>
            </div>

            <!-- Right Side Controls -->
            <div class="flex items-center gap-2">
              <!-- Playback Speed -->
              <div class="relative group/speed">
                <button
                  aria-label="Playback Speed"
                  class="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 text-xs font-semibold"
                  @click="togglePlaybackSpeed"
                >
                  {{ playbackSpeed }}x
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"
    >
      <Loader2 class="w-8 h-8 text-white animate-spin" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import {
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-vue-next'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    default: null,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  allowFullscreen: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['play', 'pause', 'ended', 'error', 'timeupdate'])

const videoRef = ref(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(1)
const currentTime = ref(0)
const duration = ref(0)
const progressPercent = ref(0)
const showControls = ref(true)
const isFullscreen = ref(false)
const isLoading = ref(true)
const playbackSpeed = ref(1)
const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2]
const controlsTimeout = ref(null)

const togglePlay = async () => {
  if (!videoRef.value) return

  try {
    if (isPlaying.value) {
      await videoRef.value.pause()
      emit('pause')
    } else {
      await videoRef.value.play()
      emit('play')
    }
  } catch (error) {
    emit('error', error)
  }
}

const toggleMute = () => {
  if (!videoRef.value) return
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
}

const toggleFullscreen = () => {
  if (!videoRef.value) return

  if (!isFullscreen.value) {
    if (videoRef.value.requestFullscreen) {
      videoRef.value.requestFullscreen()
    } else if (videoRef.value.webkitRequestFullscreen) {
      videoRef.value.webkitRequestFullscreen()
    } else if (videoRef.value.mozRequestFullScreen) {
      videoRef.value.mozRequestFullScreen()
    } else if (videoRef.value.msRequestFullscreen) {
      videoRef.value.msRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}

const togglePlaybackSpeed = () => {
  if (!videoRef.value) return
  const currentIndex = playbackSpeeds.indexOf(playbackSpeed.value)
  const nextIndex = (currentIndex + 1) % playbackSpeeds.length
  playbackSpeed.value = playbackSpeeds[nextIndex]
  videoRef.value.playbackRate = playbackSpeed.value
}

const handleProgressClick = event => {
  if (!videoRef.value) return
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percent = clickX / rect.width
  const newTime = percent * duration.value
  videoRef.value.currentTime = newTime
  currentTime.value = newTime
  progressPercent.value = percent * 100
}

const handleVolumeClick = event => {
  if (!videoRef.value) return
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const newVolume = Math.max(0, Math.min(1, clickX / rect.width))
  volume.value = newVolume
  videoRef.value.volume = newVolume
  isMuted.value = newVolume === 0
  videoRef.value.muted = isMuted.value
}

const handleLoadedMetadata = () => {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
  isLoading.value = false

  videoRef.value.volume = volume.value
  videoRef.value.muted = isMuted.value

  // Autoplay if enabled
  if (props.autoplay) {
    videoRef.value.play().catch(error => {
      // Autoplay might be blocked by browser policy
    })
  }
}

const handleTimeUpdate = () => {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
  progressPercent.value = duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
  emit('timeupdate', {
    currentTime: currentTime.value,
    duration: duration.value,
    progress: progressPercent.value,
  })
}

const handleEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  progressPercent.value = 0
  emit('ended')
}

const handleError = event => {
  isLoading.value = false
  emit('error', event)
}

const formatTime = seconds => {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const hideControlsDelayed = () => {
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
  controlsTimeout.value = setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 3000)
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  )
}

// Watch for volume changes from external sources
watch(volume, newVolume => {
  if (videoRef.value) {
    videoRef.value.volume = newVolume
  }
})

// Watch for src changes
watch(
  () => props.src,
  () => {
    isLoading.value = true
    isPlaying.value = false
    currentTime.value = 0
    progressPercent.value = 0
  }
)

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)

  // Hide controls after initial delay if autoplay
  if (props.autoplay) {
    setTimeout(() => {
      if (isPlaying.value) {
        showControls.value = false
      }
    }, 2000)
  }
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)

  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
})
</script>

<style scoped>
.controls-fade-enter-active,
.controls-fade-leave-active {
  transition: opacity 0.3s ease;
}

.controls-fade-enter-from,
.controls-fade-leave-to {
  opacity: 0;
}
</style>
