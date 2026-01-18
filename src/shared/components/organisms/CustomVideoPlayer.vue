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
        class="absolute inset-0 z-[60] flex flex-col justify-between bg-gradient-to-t from-black/30 via-black/10 to-transparent rounded-lg"
        @click.stop
      >
        <!-- Top Controls -->
        <div class="flex items-center justify-end p-4 gap-2 relative z-[70]">
          <!-- Top controls area reserved for future use -->
        </div>

        <!-- Center Play Button (when paused) -->
        <div v-if="!isPlaying" class="flex items-center justify-center z-[70]">
          <button
            aria-label="Play"
            class="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 border border-white/20 hover:border-white/30"
            @click="togglePlay"
          >
            <Play class="w-10 h-10 ml-1 drop-shadow-lg" />
          </button>
        </div>

        <!-- Bottom Controls -->
        <div class="p-4 md:p-6 space-y-3 z-[70]">
          <!-- Progress Bar -->
          <div
            class="relative w-full h-1.5 bg-white/15 rounded-full cursor-pointer group/progress hover:h-2 transition-all duration-200"
            @click="handleProgressClick"
          >
            <div
              class="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full transition-all duration-150 shadow-sm"
              :style="{ width: `${progressPercent}%` }"
            />
            <div
              class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl opacity-0 group-hover/progress:opacity-100 transition-all duration-200 ring-2 ring-violet-400/50"
              :style="{ left: `calc(${progressPercent}% - 8px)` }"
            />
          </div>

          <!-- Control Buttons -->
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-2 md:gap-3">
              <!-- Play/Pause Button -->
              <button
                aria-label="Play/Pause"
                class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 border border-white/20 hover:border-white/30"
                @click="togglePlay"
              >
                <Pause v-if="isPlaying" class="w-5 h-5 drop-shadow-sm" />
                <Play v-else class="w-5 h-5 ml-0.5 drop-shadow-sm" />
              </button>

              <!-- Rewind Button (10 seconds) -->
              <button
                aria-label="Rewind 10 seconds"
                class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 border border-white/20 hover:border-white/30 group/rewind"
                @click="seekBackward"
                title="Rewind 10 seconds"
              >
                <Rewind
                  class="w-5 h-5 transition-transform duration-300 group-hover/rewind:-translate-x-1 drop-shadow-sm"
                />
              </button>

              <!-- Forward Button (10 seconds) -->
              <button
                aria-label="Forward 10 seconds"
                class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 border border-white/20 hover:border-white/30 group/forward"
                @click="seekForward"
                title="Forward 10 seconds"
              >
                <FastForward
                  class="w-5 h-5 transition-transform duration-300 group-hover/forward:translate-x-1 drop-shadow-sm"
                />
              </button>

              <!-- Volume Control -->
              <div class="flex items-center gap-2 group/volume">
                <button
                  aria-label="Mute/Unmute"
                  class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 border border-white/20 hover:border-white/30"
                  @click="toggleMute"
                >
                  <Volume2 v-if="!isMuted && volume > 0.5" class="w-5 h-5 drop-shadow-sm" />
                  <Volume1 v-else-if="!isMuted && volume > 0" class="w-5 h-5 drop-shadow-sm" />
                  <VolumeX v-else class="w-5 h-5 drop-shadow-sm" />
                </button>
                <div
                  class="w-20 md:w-24 h-1.5 bg-white/15 rounded-full cursor-pointer opacity-0 group-hover/volume:opacity-100 transition-all duration-300 hover:h-2"
                  @click.stop="handleVolumeClick"
                >
                  <div
                    class="h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full transition-all duration-150 shadow-sm"
                    :style="{ width: `${volume * 100}%` }"
                  />
                </div>
              </div>

              <!-- Time Display -->
              <div
                class="text-white text-xs md:text-sm font-medium min-w-[90px] md:min-w-[100px] px-2 py-1 rounded-md bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <span class="font-semibold">{{ formatTime(currentTime) }}</span>
                <span class="mx-1 text-white/60">/</span>
                <span class="text-white/80">{{ formatTime(duration) }}</span>
              </div>
            </div>

            <!-- Right Side Controls -->
            <div class="flex items-center gap-2">
              <!-- Playback Speed Dropdown -->
              <DropdownMenu
                :open="isSpeedDropdownOpen"
                @update:open="val => (isSpeedDropdownOpen = val)"
              >
                <DropdownMenuTrigger as-child>
                  <button
                    aria-label="Playback Speed"
                    class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 text-xs font-semibold relative z-[80] border border-white/20 hover:border-white/30"
                    @click.stop
                  >
                    {{ playbackSpeed }}x
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="top"
                  :side-offset="8"
                  class="w-32 bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl z-[100]"
                  style="z-index: 1000"
                  @click.stop
                >
                  <DropdownMenuRadioGroup
                    :model-value="String(playbackSpeed)"
                    @update:model-value="handleSpeedChange"
                  >
                    <DropdownMenuRadioItem
                      v-for="speed in playbackSpeeds"
                      :key="speed"
                      :value="String(speed)"
                      class="text-white hover:bg-white/15 cursor-pointer focus:bg-white/15 transition-colors duration-200"
                    >
                      {{ speed }}x
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <!-- Fullscreen Button -->
              <button
                v-if="allowFullscreen"
                aria-label="Fullscreen"
                class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 border border-white/20 hover:border-white/30"
                @click="toggleFullscreen"
              >
                <Maximize v-if="!isFullscreen" class="w-5 h-5 drop-shadow-sm" />
                <Minimize v-else class="w-5 h-5 drop-shadow-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg"
    >
      <div class="flex flex-col items-center gap-3">
        <Loader2 class="w-10 h-10 text-white animate-spin drop-shadow-lg" />
        <p class="text-white/80 text-sm font-medium">Loading video...</p>
      </div>
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
  Rewind,
  FastForward,
  Volume1,
  Volume2,
  VolumeX,
} from '@/shared/utils/lucideAnimated'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'

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
const isSpeedDropdownOpen = ref(false)

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

const handleSpeedChange = value => {
  if (!videoRef.value) return
  const newSpeed = parseFloat(value)
  playbackSpeed.value = newSpeed
  videoRef.value.playbackRate = newSpeed
  isSpeedDropdownOpen.value = false
}

const seekBackward = () => {
  if (!videoRef.value) return
  const newTime = Math.max(0, currentTime.value - 10)
  videoRef.value.currentTime = newTime
  currentTime.value = newTime
  progressPercent.value = duration.value > 0 ? (newTime / duration.value) * 100 : 0
}

const seekForward = () => {
  if (!videoRef.value) return
  const newTime = Math.min(duration.value || 0, currentTime.value + 10)
  videoRef.value.currentTime = newTime
  currentTime.value = newTime
  progressPercent.value = duration.value > 0 ? (newTime / duration.value) * 100 : 0
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

/**
 * Seek video to a specific timestamp
 * @param {number} timestamp - Time in seconds
 */
const seekTo = timestamp => {
  if (!videoRef.value || !isFinite(timestamp) || timestamp < 0) return

  // Ensure timestamp doesn't exceed duration
  const targetTime = Math.min(timestamp, duration.value || timestamp)
  videoRef.value.currentTime = targetTime
  currentTime.value = targetTime
  progressPercent.value = duration.value > 0 ? (targetTime / duration.value) * 100 : 0

  // Play if paused
  if (!isPlaying.value) {
    videoRef.value.play().catch(() => {
      // Ignore autoplay errors
    })
  }
}

// Expose methods for parent components
defineExpose({
  seekTo,
  play: () => videoRef.value?.play(),
  pause: () => videoRef.value?.pause(),
  currentTime: () => currentTime.value,
  duration: () => duration.value,
})

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

const handleKeyDown = event => {
  // Only handle keyboard shortcuts when video is focused or controls are visible
  if (!showControls.value && isPlaying.value) return

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      seekBackward()
      break
    case 'ArrowRight':
      event.preventDefault()
      seekForward()
      break
    case ' ':
      event.preventDefault()
      togglePlay()
      break
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
  document.addEventListener('keydown', handleKeyDown)

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
  document.removeEventListener('keydown', handleKeyDown)

  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
})
</script>

<style scoped>
.controls-fade-enter-active,
.controls-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.controls-fade-enter-from,
.controls-fade-leave-to {
  opacity: 0;
}

/* Smooth button interactions */
button {
  -webkit-tap-highlight-color: transparent;
}

/* Enhanced progress bar hover effect */
.group\/progress:hover .absolute.top-0 {
  box-shadow: 0 0 8px rgba(20, 184, 166, 0.5);
}
</style>
