<template>
  <aside
    :class="[
      'relative border-r transition-all duration-300 overflow-hidden',
      'bg-white dark:bg-gray-900',
      theme.borderSecondary,
      props.isSidebarCollapsed ? 'w-16 p-0' : 'w-80 p-3 overflow-y-auto',
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

    <!-- Collection Cover Image (only when expanded) -->
    <div v-if="!props.isSidebarCollapsed" class="mb-8">
      <!-- Skeleton Loader -->
      <div
        v-if="props.isLoading"
        :class="theme.borderSecondary"
        class="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 animate-pulse"
      >
        <div class="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <!-- Cover Image/Video -->
      <div
        v-else-if="props.collection?.thumbnail || props.collection?.image"
        :class="theme.borderSecondary"
        class="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 group relative"
        @click="isVideoCover ? toggleVideoPlay() : null"
      >
        <!-- Video Cover -->
        <template v-if="isVideoCover">
          <video
            ref="videoRef"
            :src="coverVideoUrl"
            class="w-full h-full object-cover"
            autoplay
            loop
            muted
            playsinline
            @click.stop="toggleVideoPlay"
          />
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
            :alt="props.collection?.name ?? ''"
            :src="props.collection?.thumbnail ?? props.collection?.image ?? placeholderImage"
            class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            @error="handleImageError"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div
            class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <p class="text-white text-xs font-medium">Set cover from media items</p>
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
        class="grid grid-cols-4 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/50 border"
      >
        <div
          v-for="i in 4"
          :key="`skeleton-${i}`"
          class="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative"
        >
          <div class="h-5 w-5 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-3 w-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <TooltipProvider v-else>
        <div
          :class="theme.borderSecondary"
          class="grid grid-cols-4 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/50 border"
        >
          <template v-for="tab in tabs">
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  :class="[
                    props.activeTab === tab?.name
                      ? 'bg-white dark:bg-gray-900 text-accent shadow-sm scale-105'
                      : theme.textSecondary +
                        ' hover:bg-white/80 dark:hover:bg-gray-800/70 hover:text-accent hover:scale-102',
                  ]"
                  class="flex flex-col items-center gap-1 p-3 rounded-lg relative transition-all duration-300 ease-out group"
                  @click="handleTabClick(tab)"
                >
                  <component :is="tab?.icon" class="h-5 w-5" />
                  <span class="text-xs font-medium leading-tight text-center">{{
                    tab?.title
                  }}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{{ tab?.title }}</p>
              </TooltipContent>
            </Tooltip>
          </template>
        </div>
      </TooltipProvider>
    </div>

    <!-- Divider -->
    <div v-if="!props.isSidebarCollapsed && props.activeTab === 'photos'" class="mb-6">
      <div :class="theme.borderSecondary" class="h-px w-full"></div>
    </div>

    <!-- Collapsed Sidebar - Icon Only Navigation (show for all tabs) -->
    <div v-if="props.isSidebarCollapsed" class="flex flex-col items-center gap-3 pt-4 h-full pb-4">
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
          class="w-full h-full object-cover"
          autoplay
          loop
          muted
          playsinline
        />
        <!-- Image Cover (Collapsed) -->
        <img
          v-else-if="props.collection?.thumbnail || props.collection?.image"
          :alt="props.collection?.name ?? ''"
          :src="props.collection?.thumbnail ?? props.collection?.image ?? placeholderImage"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center"
        >
          <ImageIcon :class="theme.textTertiary" class="h-5 w-5 opacity-50" />
        </div>
      </div>

      <!-- Collection Title Popover (at top) -->
      <Popover>
        <PopoverTrigger as-child>
          <button
            :class="theme.borderSecondary"
            :disabled="props.isLoading"
            class="w-12 h-12 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center border-2 border-dashed"
            title="Collection name"
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
              {{ props.collection?.name?.charAt(0)?.toUpperCase() || 'C' }}
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
              {{ props.collection?.name || 'Loading...' }}
            </p>
            <p
              v-if="props.collection?.description"
              :class="theme.textTertiary"
              class="text-xs mt-1"
            >
              {{ props.collection.description }}
            </p>
          </template>
        </PopoverContent>
      </Popover>

      <div v-if="props.isLoading" class="rounded-lg bg-gray-100 dark:bg-gray-800/50 border">
        <div
          v-for="i in 4"
          :key="`skeleton-${i}`"
          class="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative"
        >
          <div class="h-5 w-5 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-3 w-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <TooltipProvider v-else>
        <template v-for="tab in tabs">
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                :class="[
                  props.activeTab === tab?.name
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : theme.textSecondary +
                      ' hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-accent',
                ]"
                class="p-3.5 rounded-lg transition-all duration-200 w-12 h-12 flex items-center justify-center relative group"
                @click="handleTabClick(tab)"
              >
                <component :is="tab?.icon" class="h-5 w-5" />
                <span
                  v-if="props.activeTab === tab?.name"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full"
                ></span>
              </button>
            </TooltipTrigger>
            <TooltipContent :class="[theme.bgCard, theme.borderCard]" side="right">
              <p :class="theme.textPrimary" class="text-sm font-semibold">{{ tab?.title }}</p>
            </TooltipContent>
          </Tooltip>
        </template>
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

    <!-- Sidebar Content Slot (only show when expanded) -->
    <div v-if="!props.isSidebarCollapsed">
      <slot />
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronsLeft,
  ChevronsRight,
  ImageIcon,
  Loader2,
  Paintbrush,
  Pause,
  Play,
  Radio,
  Settings,
} from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover/index'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip/index'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  collection: { type: [Object, null], default: null },
  isLoading: { type: Boolean, required: true },
  activeTab: { type: String, required: true },
  isSidebarCollapsed: { type: Boolean, required: true },
})

const emit = defineEmits([
  'update:activeTab',
  'update:isSidebarCollapsed',
])

const theme = useThemeClasses()
const router = useRouter()

const tabs = ref([])
const videoRef = ref(null)
const isVideoPlaying = ref(true)

const isVideoCover = computed(() => {
  const imageUrl = props.collection?.image || props.collection?.thumbnail
  if (!imageUrl) return false

  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  const lowerUrl = imageUrl.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.includes(ext))
})

const coverVideoUrl = computed(() => {
  if (!isVideoCover.value) return null
  // Use collection.image which should contain the video URL from the media item's file.url
  return props.collection?.image || null
})

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
  () => props.collection?.image,
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


const handleTabClick = tab => {
  if (props.collection?.id) {
    router.push(tab?.route)
  }
  emit('update:activeTab', tab?.name)
}

// Fallback placeholder image (SVG data URL)
const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='

const handleImageError = event => {
  const img = event?.target
  if (img && typeof img === 'object' && 'src' in img && img.src !== placeholderImage)
    img.src = placeholderImage
}

watch(
  () => props.collection,
  col => {
    if (!col) return

    tabs.value = [
      {
        title: 'Photos',
        name: 'photos',
        icon: ImageIcon,
        route: {
          name: 'collectionPhotos',
          params: { uuid: col.id },
        },
      },
      {
        title: 'Design',
        name: 'design',
        icon: Paintbrush,
        route: {
          name: col.image || col.thumbnail ? 'collectionCover' : 'collectionTypography',
          params: { uuid: col.id },
        },
      },
      {
        title: 'Settings',
        name: 'settings',
        icon: Settings,
        route: {
          name: 'collectionSettingsGeneral',
          params: { uuid: col.id },
        },
      },
      {
        title: 'Activities',
        name: 'activities',
        icon: Radio,
        route: {
          name: 'collectionActivitiesDownload',
          params: { uuid: col.id },
        },
      },
    ]
  },
  { immediate: true }
)
</script>
