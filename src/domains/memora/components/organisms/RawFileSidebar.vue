<template>
  <aside
    :class="[
      'relative border-r transition-all duration-300 h-full flex flex-col',
      'bg-white dark:bg-gray-900',
      theme.borderSecondary,
      props.isSidebarCollapsed ? 'w-16 p-0 overflow-visible' : 'w-80 p-3',
    ]"
    :style="
      props.isSidebarCollapsed
        ? 'scrollbar-width: none;'
        : 'scrollbar-width: thin; scrollbar-color: rgba(156, 163, 175, 0.5) transparent;'
    "
  >
    <!-- Collapse Button (Bottom Left) - When Expanded -->
    <button
      v-if="!props.isSidebarCollapsed"
      :class="[theme.borderSecondary, theme.bgCard]"
      class="absolute bottom-4 left-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 z-10 opacity-70 hover:opacity-100 shadow-sm border"
      title="Collapse sidebar"
      @click="emit('update:isSidebarCollapsed', true)"
    >
      <ChevronsLeft :class="theme.textSecondary" class="h-4 w-4" />
    </button>

    <!-- RawFile Info (only when expanded) -->
    <div v-if="!props.isSidebarCollapsed" class="mb-6">
      <!-- Skeleton Loader -->
      <div
        v-if="props.isLoading"
        :class="theme.borderSecondary"
        class="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 animate-pulse"
      >
        <div class="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <!-- Background Images Slideshow -->
      <div
        v-else
        :class="theme.borderSecondary"
        class="w-full rounded-2xl border-2 shadow-md relative"
      >
        <div
          class="aspect-square overflow-hidden bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 rounded-t-2xl relative group"
          @mouseenter="pauseSlideshow"
          @mouseleave="resumeSlideshow"
        >
        <Transition name="fade" mode="out-in">
          <img
            :key="currentBgIndex"
            :alt="props.rawFile?.name ?? ''"
            :src="currentBackgroundImage"
            class="w-full h-full object-cover absolute inset-0"
          />
        </Transition>
        <!-- Overlay on Hover -->
        <div
          class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        />
        <!-- Navigation Buttons -->
        <button
          :class="[
            theme.bgCard,
            theme.borderSecondary,
            'absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full border shadow-lg backdrop-blur-sm z-10',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            'hover:bg-violet-100 dark:hover:bg-violet-900/30',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ]"
          @click.stop="goToPrevious"
        >
          <ChevronLeft :class="theme.textPrimary" class="h-4 w-4" />
        </button>
        <button
          :class="[
            theme.bgCard,
            theme.borderSecondary,
            'absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full border shadow-lg backdrop-blur-sm z-10',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            'hover:bg-violet-100 dark:hover:bg-violet-900/30',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ]"
          @click.stop="goToNext"
        >
          <ChevronRight :class="theme.textPrimary" class="h-4 w-4" />
        </button>
        <!-- Indicator Dots -->
        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          <button
            v-for="(image, index) in rawFileBgImages"
            :key="index"
            :class="[
              'w-1.5 h-1.5 rounded-full transition-all duration-200',
              index === currentBgIndex
                ? 'bg-white w-4'
                : 'bg-white/50 hover:bg-white/75',
            ]"
            @click.stop="goToSlide(index)"
          />
        </div>
        </div>
        <!-- Description -->
        <div
          :class="[theme.bgCard, theme.textSecondary, 'px-3 py-2 rounded-b-2xl border-t']"
          class="text-xs leading-relaxed"
        >
          <p class="text-center">
            These images will show randomly on the public raw file view
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div v-if="!props.isSidebarCollapsed" class="mb-6 w-full">
      <div
        v-if="props.isLoading"
        class="grid grid-cols-2 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/50 border"
      >
        <div
          v-for="i in 2"
          :key="`skeleton-${i}`"
          class="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative"
        >
          <div class="h-5 w-5 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-3 w-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div
        v-else
        :class="theme.borderSecondary"
        class="grid grid-cols-2 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/50 border"
      >
        <button
          :class="[
            activeTab === 'photos'
              ? 'bg-accent dark:bg-accent-800 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-accent-500 dark:hover:bg-accent-500',
            'flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative transition-all duration-200',
          ]"
          @click="handleTabClick('photos')"
        >
          <ImageIcon class="h-5 w-5 flex-shrink-0" />
          <span class="text-xs font-semibold">Photos</span>
        </button>
        <button
          :class="[
            activeTab === 'settings'
              ? 'bg-accent-500 dark:bg-accent-800 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-accent-500 dark:hover:bg-accent-500',
            'flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative transition-all duration-200',
          ]"
          @click="handleTabClick('settings')"
        >
          <Settings class="h-5 w-5 flex-shrink-0" />
          <span class="text-xs font-semibold">Settings</span>
        </button>
      </div>
    </div>

    <!-- Collapsed Sidebar - Icon Only Navigation (show for all tabs) -->
    <div
      v-if="props.isSidebarCollapsed"
      class="flex flex-col items-center gap-3 pt-4 h-full pb-4 overflow-visible"
    >
      <!-- Cover Photo (Collapsed) -->
      <div
        :class="theme.borderSecondary"
        class="w-12 h-12 rounded-lg overflow-hidden border-2 shadow-sm flex-shrink-0 relative"
      >
        <div
          v-if="props.isLoading"
          class="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"
        ></div>
        <!-- Image Cover (Collapsed) - Slideshow -->
        <img
          v-else
          :alt="props.rawFile?.name ?? ''"
          :src="currentBackgroundImage"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- RawFile Title Popover (at top) -->
      <Popover>
        <PopoverTrigger as-child>
          <button
            :class="theme.borderSecondary"
            :disabled="props.isLoading"
            class="w-12 h-12 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center border-2 border-dashed"
            title="RawFile name"
          >
            <Loader2
              v-if="props.isLoading"
              :class="theme.textTertiary"
              class="h-4 w-4 animate-spin"
            />
            <span
              v-else
              :class="theme.textPrimary"
              class="text-xs font-bold truncate max-w-[2.5rem]"
            >
              {{ props.rawFile?.name?.charAt(0)?.toUpperCase() || 'S' }}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          :class="[theme.bgCard, theme.borderCard, 'p-3 max-w-xs']"
          align="start"
          side="right"
        >
          <div v-if="props.isLoading" class="space-y-2">
            <div class="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div class="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
          <template v-else>
            <p :class="theme.textPrimary" class="text-sm font-semibold">
              {{ props.rawFile?.name || 'Loading...' }}
            </p>
            <p
              v-if="props.rawFile?.status"
              :class="theme.textTertiary"
              class="text-xs mt-1 capitalize"
            >
              {{ props.rawFile.status }}
            </p>
          </template>
        </PopoverContent>
      </Popover>

      <!-- Tab Icons (Collapsed) -->
      <div v-if="props.isLoading" class="space-y-2">
        <div
          v-for="i in 2"
          :key="`skeleton-${i}`"
          class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
        ></div>
      </div>
      <TooltipProvider v-else>
        <Tooltip>
          <TooltipTrigger as-child>
            <button
              :class="[
                'p-3.5 rounded-lg transition-all duration-200 w-12 h-12 flex items-center justify-center relative group',
                props.activeTab === 'photos'
                  ? 'bg-accent text-accent-foreground shadow-md'
                  : theme.textSecondary + ' hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-800',
              ]"
              @click="handleTabClick('photos')"
            >
              <ImageIcon
                :style="props.activeTab === 'photos' ? { color: 'white' } : {}"
                class="h-5 w-5"
              />
              <span
                v-if="props.activeTab === 'photos'"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full z-20 bg-accent"
              ></span>
            </button>
          </TooltipTrigger>
          <TooltipContent :class="[theme.bgCard, theme.borderCard]" side="right">
            <p :class="theme.textPrimary" class="text-sm font-semibold">Photos</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <button
              :class="[
                'p-3.5 rounded-lg transition-all duration-200 w-12 h-12 flex items-center justify-center relative group',
                props.activeTab === 'settings'
                  ? 'bg-accent text-accent-foreground shadow-md'
                  : theme.textSecondary + ' hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-800',
              ]"
              @click="handleTabClick('settings')"
            >
              <Settings class="h-5 w-5" />
              <span
                v-if="props.activeTab === 'settings'"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full z-20 bg-accent"
              ></span>
            </button>
          </TooltipTrigger>
          <TooltipContent :class="[theme.bgCard, theme.borderCard]" side="right">
            <p :class="theme.textPrimary" class="text-sm font-semibold">Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- Spacer to push expand button to bottom -->
      <div class="flex-1"></div>

      <!-- Expand Button (at bottom) -->
      <button
        :class="[theme.borderSecondary, theme.bgCard]"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 opacity-70 hover:opacity-100 shadow-sm border mb-4"
        title="Expand sidebar"
        @click="emit('update:isSidebarCollapsed', false)"
      >
        <ChevronsRight :class="theme.textSecondary" class="h-4 w-4" />
      </button>
    </div>

    <!-- Sidebar Content Panels (only show when expanded) -->
    <div v-if="!props.isSidebarCollapsed" class="flex-1 overflow-y-auto min-h-0">
      <slot />
    </div>
  </aside>
</template>

<script setup>
import { CheckSquare, ChevronsLeft, ChevronsRight, ImageIcon, Loader2, Settings, ChevronLeft, ChevronRight, } from '@/shared/utils/lucideAnimated'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/shadcn/popover/index'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@/shared/components/shadcn/tooltip/index'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import rawFileBg1 from '@/domains/memora/assets/images/rawFileBgs/rawFileBg.jpg'
import rawFileBg2 from '@/domains/memora/assets/images/rawFileBgs/rawFileBg2.jpg'
import rawFileBg3 from '@/domains/memora/assets/images/rawFileBgs/rawFileBg3.jpg'

const theme = useThemeClasses()
const route = useRoute()
const router = useRouter()

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
  },
  rawFile: {
    type: [Object, null],
    default: null,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
  isSidebarCollapsed: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isSidebarCollapsed'])

// Background images array
const rawFileBgImages = [rawFileBg1, rawFileBg2, rawFileBg3]
const currentBgIndex = ref(0)
const slideInterval = ref(null)
const isPaused = ref(false)

// Get random background index that changes every 5 minutes
const getInitialBgIndex = () => {
  const fiveMinuteInterval = Math.floor(Date.now() / 300000)
  return fiveMinuteInterval % rawFileBgImages.length
}

// Current background image
const currentBackgroundImage = computed(() => {
  return rawFileBgImages[currentBgIndex.value]
})

// Start slideshow for background images
const startSlideshow = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value)
  }
  
  if (isPaused.value) return
  
  // Change image every 3 seconds
  slideInterval.value = setInterval(() => {
    currentBgIndex.value = (currentBgIndex.value + 1) % rawFileBgImages.length
  }, 3000)
}

// Stop slideshow
const stopSlideshow = () => {
  if (slideInterval.value) {
    clearInterval(slideInterval.value)
    slideInterval.value = null
  }
}

// Pause slideshow
const pauseSlideshow = () => {
  isPaused.value = true
  stopSlideshow()
}

// Resume slideshow
const resumeSlideshow = () => {
  isPaused.value = false
  startSlideshow()
}

// Navigate to next slide
const goToNext = () => {
  currentBgIndex.value = (currentBgIndex.value + 1) % rawFileBgImages.length
  if (!isPaused.value) {
    stopSlideshow()
    startSlideshow()
  }
}

// Navigate to previous slide
const goToPrevious = () => {
  currentBgIndex.value = currentBgIndex.value === 0 ? rawFileBgImages.length - 1 : currentBgIndex.value - 1
  if (!isPaused.value) {
    stopSlideshow()
    startSlideshow()
  }
}

// Navigate to specific slide
const goToSlide = (index) => {
  if (index >= 0 && index < rawFileBgImages.length) {
    currentBgIndex.value = index
    if (!isPaused.value) {
      stopSlideshow()
      startSlideshow()
    }
  }
}

onMounted(() => {
  currentBgIndex.value = getInitialBgIndex()
  startSlideshow()
  
  // Update every 5 minutes to match the 5-minute window
  const fiveMinInterval = setInterval(() => {
    currentBgIndex.value = getInitialBgIndex()
  }, 300000)
  
  onUnmounted(() => {
    clearInterval(fiveMinInterval)
  })
})

onUnmounted(() => {
  stopSlideshow()
})


// Debug: log activeTab changes
watch(
  () => props.activeTab,
  newVal => {
    console.log('ActiveTab changed to:', newVal)
  },
  { immediate: true }
)

const handleTabClick = tab => {
  const rawFileId = route.params.id
  if (!rawFileId) return

  // Use query parameters to change tabs without navigating to different routes
  // The RawFileLayout will handle showing the appropriate content based on the query
  const query = { tab }
  if (tab === 'settings') {
    query.section = 'general'
  }
  router.push({
    name: 'rawFileDetail',
    params: { id: rawFileId },
    query,
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
