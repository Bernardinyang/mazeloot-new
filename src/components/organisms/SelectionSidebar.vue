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

    <!-- Selection Info (only when expanded) -->
    <div v-if="!props.isSidebarCollapsed" class="mb-6">
      <!-- Skeleton Loader -->
      <div
        v-if="props.isLoading"
        :class="theme.borderSecondary"
        class="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 animate-pulse"
      >
        <div class="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <!-- Selection Image/Video/Icon -->
      <div
        v-else-if="props.selection?.coverPhotoUrl || props.selection?.cover_photo_url"
        :class="theme.borderSecondary"
        class="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 flex items-center justify-center border-2 shadow-md group cursor-pointer relative"
        @click="isVideoCover ? toggleVideoPlay() : null"
      >
        <!-- Video Cover -->
        <template v-if="isVideoCover">
          <video
            ref="videoRef"
            :src="coverVideoUrl"
            :style="coverImageStyle"
            autoplay
            class="w-full h-full object-cover"
            loop
            muted
            playsinline
            @click.stop="toggleVideoPlay"
          />
          <!-- Focal Point Dot -->
          <div
            v-if="focalPoint && focalPoint.x !== undefined && focalPoint.y !== undefined"
            :style="{
              left: `${focalPoint.x}%`,
              top: `${focalPoint.y}%`,
              transform: 'translate(-50%, -50%)',
            }"
            class="absolute w-6 h-6 rounded-full border-4 border-white bg-green-500 shadow-lg pointer-events-none z-10"
          >
            <div class="w-full h-full rounded-full bg-white/30"></div>
          </div>
          <!-- Play/Pause Overlay -->
          <div
            class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300"
            @click.stop="toggleVideoPlay"
          >
            <div
              class="w-16 h-16 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
            >
              <Pause v-if="isVideoPlaying" class="w-8 h-8 text-white ml-0.5" />
              <Play v-else class="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        </template>
        <!-- Image Cover -->
        <template v-else>
          <img
            :alt="props.selection?.name ?? ''"
            :src="coverImageSrc"
            :style="coverImageStyle"
            class="w-full h-full object-cover transition-opacity duration-200"
            @error="handleImageError"
          />
          <!-- Focal Point Dot -->
          <div
            v-if="focalPoint && focalPoint.x !== undefined && focalPoint.y !== undefined"
            :style="{
              left: `${focalPoint.x}%`,
              top: `${focalPoint.y}%`,
              transform: 'translate(-50%, -50%)',
            }"
            class="absolute w-6 h-6 rounded-full border-4 border-white bg-green-500 shadow-lg pointer-events-none z-10"
          >
            <div class="w-full h-full rounded-full bg-white/30"></div>
          </div>
        </template>
      </div>
      <!-- No Cover Image Placeholder -->
      <div
        v-else
        :class="theme.borderSecondary"
        class="w-full aspect-square rounded-2xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 flex items-center justify-center border-2 shadow-md border-dashed"
      >
        <div class="text-center px-4">
          <div
            class="p-5 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mb-4 mx-auto w-fit shadow-sm"
          >
            <ImageIcon :class="theme.textTertiary" class="h-10 w-10 opacity-50" />
          </div>
          <p :class="theme.textPrimary" class="text-sm font-semibold mb-1">No cover image</p>
          <p :class="theme.textTertiary" class="text-xs">Set a cover from media items</p>
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
        <!-- Video Cover (Collapsed) -->
        <video
          v-else-if="isVideoCover && coverVideoUrl"
          :src="coverVideoUrl"
          :style="coverImageStyle"
          autoplay
          class="w-full h-full object-cover"
          loop
          muted
          playsinline
        />
        <!-- Image Cover (Collapsed) -->
        <img
          v-else-if="props.selection?.coverPhotoUrl || props.selection?.cover_photo_url"
          :alt="props.selection?.name ?? ''"
          :src="coverImageSrc"
          :style="coverImageStyle"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <div
          v-else
          class="w-full h-full bg-accent/5 dark:bg-accent/10 flex items-center justify-center"
        >
          <CheckSquare class="h-5 w-5 text-accent" />
        </div>
      </div>

      <!-- Selection Title Popover (at top) -->
      <Popover>
        <PopoverTrigger as-child>
          <button
            :class="theme.borderSecondary"
            :disabled="props.isLoading"
            class="w-12 h-12 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center border-2 border-dashed"
            title="Selection name"
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
              {{ props.selection?.name?.charAt(0)?.toUpperCase() || 'S' }}
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
              {{ props.selection?.name || 'Loading...' }}
            </p>
            <p
              v-if="props.selection?.status"
              :class="theme.textTertiary"
              class="text-xs mt-1 capitalize"
            >
              {{ props.selection.status }}
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
import { CheckSquare, ChevronsLeft, ChevronsRight, ImageIcon, Loader2, Pause, Play, Settings, } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover/index'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@/components/shadcn/tooltip/index'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useFocalPoint, getFocalPointFromEntity } from '@/composables/useFocalPoint'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { getMediaDisplayUrl } from '@/utils/media/getMediaDisplayUrl'

const theme = useThemeClasses()
const route = useRoute()
const router = useRouter()

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
  },
  selection: {
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

// Fallback placeholder image (SVG data URL)
const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='

const coverImageSrc = ref(placeholderImage)
const videoRef = ref(null)
const isVideoPlaying = ref(true)

const isVideoCover = computed(() => {
  const coverUrl = props.selection?.coverPhotoUrl || props.selection?.cover_photo_url
  if (!coverUrl) return false

  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  const lowerUrl = coverUrl.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.includes(ext))
})

const coverVideoUrl = computed(() => {
  if (!isVideoCover.value) return null
  return props.selection?.coverPhotoUrl || props.selection?.cover_photo_url || null
})

const focalPoint = computed(() => getFocalPointFromEntity(props.selection))
const { imageStyle: coverImageStyle } = useFocalPoint(focalPoint)

const toggleVideoPlay = () => {
  if (!videoRef.value) return

  if (isVideoPlaying.value) {
    videoRef.value.pause()
    isVideoPlaying.value = false
  } else {
    videoRef.value.play()
    isVideoPlaying.value = true
  }
}

// Watch video play/pause state
watch(
  () => [props.selection?.coverPhotoUrl, props.selection?.cover_photo_url],
  () => {
    if (isVideoCover.value && videoRef.value) {
      // Reset video when cover changes
      isVideoPlaying.value = true
      videoRef.value.play().catch(() => {
        // Autoplay might be blocked, that's okay
      })
    }
  }
)

const updateCoverImage = async () => {
  const imageUrl = props.selection?.coverPhotoUrl || props.selection?.cover_photo_url
  if (!imageUrl) {
    coverImageSrc.value = placeholderImage
    return
  }

  try {
    coverImageSrc.value = await getMediaDisplayUrl(imageUrl, placeholderImage)
  } catch (error) {
    coverImageSrc.value = placeholderImage
  }
}

// Watch for selection changes
watch(
  () => [props.selection?.coverPhotoUrl, props.selection?.cover_photo_url],
  () => {
    updateCoverImage()
  },
  { immediate: true }
)

const handleImageError = event => {
  const img = event?.target
  if (img && typeof img === 'object' && 'src' in img && img.src !== placeholderImage) {
    img.src = placeholderImage
  }
}


// Debug: log activeTab changes
watch(
  () => props.activeTab,
  newVal => {
    console.log('ActiveTab changed to:', newVal)
  },
  { immediate: true }
)

const handleTabClick = tab => {
  const selectionId = route.params.id
  if (!selectionId) return

  // Use query parameters to change tabs without navigating to different routes
  // The SelectionLayout will handle showing the appropriate content based on the query
  const query = { tab }
  if (tab === 'settings') {
    query.section = 'general'
  }
  router.push({
    name: 'selectionDetail',
    params: { id: selectionId },
    query,
  })
}
</script>
