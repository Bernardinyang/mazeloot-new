<template>
  <section v-if="filteredMedia.length > 0" class="w-full" :class="containerClass">
    <div class="relative w-full overflow-hidden group" :class="sliderClass">
      <div class="absolute inset-0">
        <div
          v-for="(media, index) in filteredMedia"
          :key="media.id || media.uuid || index"
          class="absolute inset-0 transition-opacity duration-700 ease-in-out"
          :class="currentSlideIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'"
        >
          <img
            v-if="!isVideoMedia(media)"
            :src="media.url || media.thumbnail"
            :alt="media.collectionName || 'Featured work'"
            class="w-full h-full object-cover scale-105 transition-transform duration-[3000ms] ease-out"
            :class="currentSlideIndex === index ? 'scale-100' : ''"
          />
          <video
            v-else-if="showVideoMedia"
            :ref="el => setVideoRef(el, index)"
            :src="getVideoUrl(media)"
            class="w-full h-full object-cover scale-105 transition-transform duration-[3000ms] ease-out"
            :class="currentSlideIndex === index ? 'scale-100' : ''"
            :autoplay="currentSlideIndex === index"
            :muted="true"
            :loop="true"
            :playsinline="true"
            preload="metadata"
            @loadedmetadata="handleVideoLoaded"
          />
        </div>
      </div>
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none z-10"></div>
      
      <!-- Title Text -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none" :class="textContainerClass">
        <div :class="labelMarginClass">
          <p :class="labelClass" style="font-family: 'Montserrat', sans-serif; letter-spacing: 0.4em;">
            Portfolio
          </p>
        </div>
        <h2 :class="headingClass" style="font-family: 'Playfair Display', 'Georgia', serif; letter-spacing: -0.03em; text-shadow: 0 4px 20px rgba(0,0,0,0.3);">
          <span class="inline-block animate-fade-in-up">Featured</span>
          <span class="inline-block animate-fade-in-up" style="animation-delay: 0.15s"> Works</span>
        </h2>
        <div class="animate-fade-in-up" style="animation-delay: 0.3s">
          <div :class="dividerClass"></div>
          <p :class="subtitleClass" style="font-family: 'Cormorant Garamond', 'Georgia', serif; letter-spacing: 0.1em;">
            Showcasing Excellence
          </p>
        </div>
      </div>
      
      <!-- Navigation Dots -->
      <div v-if="filteredMedia.length > 1" class="absolute left-1/2 -translate-x-1/2 z-30 flex items-center" :class="dotsContainerClass">
        <button
          v-for="(media, index) in filteredMedia"
          :key="media.id || media.uuid || index"
          @click="currentSlideIndex = index"
          class="relative transition-all duration-300 ease-out group/dot"
          :class="currentSlideIndex === index ? activeDotWidthClass : inactiveDotWidthClass"
        >
          <div
            class="rounded-full transition-all duration-300"
            :class="[
              dotsHeightClass,
              currentSlideIndex === index 
                ? 'w-full bg-white shadow-lg shadow-white/50' 
                : 'w-full bg-white/40 hover:bg-white/60 group-hover/dot:w-3'
            ]"
          />
        </button>
      </div>
      
      <!-- Navigation Arrows -->
      <button
        v-if="filteredMedia.length > 1"
        @click="previousSlide"
        class="absolute top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/95 hover:bg-white backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
        :class="[arrowClass, variant === 'preview' ? 'left-1' : 'left-6']"
        aria-label="Previous slide"
      >
        <ArrowRight :class="[arrowIconClass, 'text-gray-900 rotate-180 transition-transform duration-300', variant === 'preview' ? 'group-hover:-translate-x-[1px]' : 'group-hover:-translate-x-[2px]']" />
      </button>
      <button
        v-if="filteredMedia.length > 1"
        @click="nextSlide"
        class="absolute top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/95 hover:bg-white backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
        :class="[arrowClass, variant === 'preview' ? 'right-1' : 'right-6']"
        aria-label="Next slide"
      >
        <ArrowRight :class="[arrowIconClass, 'text-gray-900 transition-transform duration-300', variant === 'preview' ? 'group-hover:translate-x-[1px]' : 'group-hover:translate-x-[2px]']" />
      </button>
      
      <!-- Slide Counter -->
      <div class="absolute z-30 rounded-full bg-black/40 backdrop-blur-md text-white font-medium" :class="counterClass">
        {{ currentSlideIndex + 1 }} / {{ filteredMedia.length }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  featuredMedia: {
    type: Array,
    default: () => [],
  },
  showVideoMedia: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'full', // 'full' or 'preview'
    validator: (value) => ['full', 'preview'].includes(value),
  },
  autoPlay: {
    type: Boolean,
    default: true,
  },
  autoPlayInterval: {
    type: Number,
    default: 5000,
  },
})

const currentSlideIndex = ref(0)
const videoRefs = ref([])
let slideshowInterval = null

const isVideoMedia = media => {
  if (!media) return false
  if (media.type === 'video') return true
  const url = media.url || media.thumbnail || ''
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.ogg']
  const lowerUrl = url.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.includes(ext))
}

const getVideoUrl = media => {
  if (media.url && isVideoMedia({ url: media.url })) {
    return media.url
  }
  if (media.thumbnail && isVideoMedia({ url: media.thumbnail })) {
    return media.thumbnail
  }
  return media.url || media.thumbnail
}

const filteredMedia = computed(() => {
  if (props.showVideoMedia) {
    return props.featuredMedia
  }
  return props.featuredMedia.filter(media => !isVideoMedia(media))
})

const setVideoRef = (el, index) => {
  if (el) {
    videoRefs.value[index] = el
  }
}

const handleVideoLoaded = event => {
  const video = event.target
  video.muted = true
}

watch(currentSlideIndex, () => {
  videoRefs.value.forEach((video, index) => {
    if (!video) return
    if (index === currentSlideIndex.value) {
      video.play().catch(err => {
        console.debug('Video autoplay prevented:', err)
      })
    } else {
      video.pause()
    }
  })
})

watch(() => props.featuredMedia, () => {
  currentSlideIndex.value = 0
  if (props.autoPlay && filteredMedia.value.length > 1) {
    startSlideshow()
  }
}, { deep: true })

const nextSlide = () => {
  if (filteredMedia.value.length === 0) return
  currentSlideIndex.value = (currentSlideIndex.value + 1) % filteredMedia.value.length
}

const previousSlide = () => {
  if (filteredMedia.value.length === 0) return
  currentSlideIndex.value = currentSlideIndex.value === 0 ? filteredMedia.value.length - 1 : currentSlideIndex.value - 1
}

const startSlideshow = () => {
  if (slideshowInterval) {
    clearInterval(slideshowInterval)
  }
  if (props.autoPlay && filteredMedia.value.length > 1) {
    slideshowInterval = setInterval(() => {
      nextSlide()
    }, props.autoPlayInterval)
  }
}

// Computed classes based on variant
const containerClass = computed(() => {
  return props.variant === 'preview' ? 'px-0 py-2' : 'pb-12 md:pb-16'
})

const sliderClass = computed(() => {
  if (props.variant === 'preview') {
    return 'h-32 rounded-lg shadow-md'
  }
  return 'h-[400px] md:h-[500px] lg:h-[600px]'
})

const textContainerClass = computed(() => {
  return props.variant === 'preview' ? 'px-2' : 'px-4'
})

const labelMarginClass = computed(() => {
  return props.variant === 'preview' ? 'mb-2' : 'mb-6'
})

const labelClass = computed(() => {
  if (props.variant === 'preview') {
    return 'text-[6px] text-white/80 font-light tracking-[0.3em] uppercase mb-1 drop-shadow-md animate-fade-in-up'
  }
  return 'text-sm md:text-base lg:text-lg text-white/80 font-light tracking-[0.3em] uppercase mb-4 drop-shadow-md animate-fade-in-up'
})

const headingClass = computed(() => {
  if (props.variant === 'preview') {
    return 'text-2xl font-light text-white mb-2 drop-shadow-2xl leading-[0.9]'
  }
  return 'text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] font-light text-white mb-6 drop-shadow-2xl leading-[0.9]'
})

const dividerClass = computed(() => {
  if (props.variant === 'preview') {
    return 'w-8 h-px bg-white/60 mx-auto mb-1'
  }
  return 'w-24 h-px bg-white/60 mx-auto mb-4'
})

const subtitleClass = computed(() => {
  if (props.variant === 'preview') {
    return 'text-[7px] text-white/90 font-extralight tracking-wider italic drop-shadow-lg'
  }
  return 'text-lg md:text-xl lg:text-2xl text-white/90 font-extralight tracking-wider italic drop-shadow-lg'
})

const dotsContainerClass = computed(() => {
  if (props.variant === 'preview') {
    return 'bottom-2 gap-1.5'
  }
  return 'bottom-6 gap-2.5'
})

const dotsHeightClass = computed(() => {
  return props.variant === 'preview' ? 'h-1' : 'h-2'
})

const activeDotWidthClass = computed(() => {
  return props.variant === 'preview' ? 'w-6' : 'w-10'
})

const inactiveDotWidthClass = computed(() => {
  return props.variant === 'preview' ? 'w-1' : 'w-2'
})

const arrowClass = computed(() => {
  return props.variant === 'preview' ? 'w-6 h-6' : 'w-12 h-12'
})

const arrowIconClass = computed(() => {
  return props.variant === 'preview' ? 'h-3 w-3' : 'h-5 w-5'
})

const counterClass = computed(() => {
  if (props.variant === 'preview') {
    return 'top-1 right-1 px-2 py-0.5 text-[8px]'
  }
  return 'top-6 right-6 px-4 py-2 text-sm'
})

onMounted(() => {
  if (props.autoPlay && filteredMedia.value.length > 1) {
    startSlideshow()
  }
})

onUnmounted(() => {
  if (slideshowInterval) {
    clearInterval(slideshowInterval)
  }
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}
</style>

