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

    <!-- Expand Button (Bottom Left) - When Collapsed -->
    <button
      v-else
      :class="[theme.borderSecondary, theme.bgCard]"
      class="absolute bottom-4 left-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 z-10 opacity-70 hover:opacity-100 shadow-sm border"
      title="Expand sidebar"
      @click="emit('update:isSidebarCollapsed', false)"
    >
      <ChevronsRight :class="theme.textSecondary" class="h-4 w-4" />
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
      <!-- Selection Image/Icon -->
      <div
        v-else
        :class="theme.borderSecondary"
        class="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 flex items-center justify-center border-2 shadow-md cursor-pointer hover:opacity-90 transition-opacity relative group"
        @click="triggerCoverFilePicker"
        title="Click to upload cover photo"
      >
        <CheckSquare
          v-if="!props.selection?.thumbnail && !props.selection?.image"
          class="h-16 w-16 text-teal-500 dark:text-teal-400"
        />
        <img
          v-else
          :alt="props.selection?.name ?? ''"
          :src="coverImageSrc"
          class="w-full h-full object-cover transition-opacity duration-200"
          @error="handleImageError"
        />
        <!-- Upload overlay hint -->
        <div
          class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
        >
          <div
            v-if="!props.selection?.thumbnail && !props.selection?.image"
            :class="theme.textPrimary"
            class="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Click to upload
          </div>
        </div>
      </div>
      <!-- Hidden file input for cover upload -->
      <input
        ref="coverFileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleCoverFileChange"
      />
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
              ? 'bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/70',
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
              ? 'bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/70',
            'flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative transition-all duration-200',
          ]"
          @click="handleTabClick('settings')"
        >
          <Settings class="h-5 w-5 flex-shrink-0" />
          <span class="text-xs font-semibold">Settings</span>
        </button>
      </div>
    </div>

    <!-- Sidebar Content Panels -->
    <slot />
  </aside>
</template>

<script setup>
import { ChevronsLeft, ChevronsRight, ImageIcon, Settings, CheckSquare } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
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

const emit = defineEmits(['update:isSidebarCollapsed', 'handle-cover-image-upload'])

const coverFileInputRef = ref(null)

// Fallback placeholder image (SVG data URL)
const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='

const coverImageSrc = ref(placeholderImage)

// Update cover image when selection changes
const updateCoverImage = async () => {
  const imageUrl = props.selection?.thumbnail || props.selection?.image
  if (!imageUrl) {
    coverImageSrc.value = placeholderImage
    return
  }

  try {
    coverImageSrc.value = await getMediaDisplayUrl(imageUrl, placeholderImage)
  } catch (error) {
    console.error('Error loading cover image:', error)
    coverImageSrc.value = placeholderImage
  }
}

// Watch for selection changes
watch(
  () => [props.selection?.thumbnail, props.selection?.image],
  () => {
    updateCoverImage()
  },
  { immediate: true }
)

// Handle image load errors
const handleImageError = event => {
  const img = event?.target
  if (img && typeof img === 'object' && 'src' in img && img.src !== placeholderImage) {
    img.src = placeholderImage
  }
}

const triggerCoverFilePicker = () => {
  coverFileInputRef.value?.click?.()
}

const handleCoverFileChange = async event => {
  const file = event?.target?.files?.[0]
  if (!file) return

  try {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

    if (typeof dataUrl === 'string') {
      emit('handle-cover-image-upload', dataUrl)
    }
  } finally {
    if (event?.target) event.target.value = ''
  }
}

const handleTabClick = tab => {
  const selectionId = route.params.id
  if (!selectionId) return

  // Use query parameters to change tabs without navigating to different routes
  // The SelectionLayout will handle showing the appropriate content based on the query
  router.push({
    name: 'selectionDetail',
    params: { id: selectionId },
    query: { tab },
  })
}
</script>
