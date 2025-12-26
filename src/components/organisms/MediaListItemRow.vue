<template>
  <div
    :class="[
      theme.borderSecondary,
      props.isSelected
        ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/50 dark:bg-teal-900/20 opacity-100'
        : props.wasSelectedOnCompletion && props.selectionStatus === 'completed'
          ? 'opacity-100'
          : props.selectionStatus === 'completed'
            ? 'opacity-50 grayscale'
            : 'opacity-60 hover:opacity-100',
      props.wasSelectedOnCompletion && !props.isSelected ? 'ring-1 ring-green-500/50' : '',
    ]"
    class="group flex items-center gap-4 p-4 rounded-xl border bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-200"
    :style="
      props.isSelected || (props.wasSelectedOnCompletion && props.selectionStatus === 'completed')
        ? { opacity: 1 }
        : {}
    "
  >
    <!-- Selection Checkbox -->
    <button
      class="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      @click.stop="emit('toggle-selection')"
    >
      <CheckSquare2 v-if="props.isSelected" class="h-5 w-5 text-teal-500" />
      <Square v-else :class="theme.textSecondary" class="h-5 w-5" />
    </button>

    <div
      class="flex items-center gap-4 flex-1 cursor-pointer relative"
      @click="emit('open-viewer')"
    >
      <div class="relative">
        <!-- Image thumbnail -->
        <img
          v-if="(props.item?.type || props.item?.file?.type) !== 'video'"
          :alt="props.item?.filename || 'Media'"
          :class="[
            'w-20 h-20 object-cover rounded-lg shadow-sm transition-all duration-300 will-change-transform',
            isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]',
          ]"
          :style="props.isSelected ? { opacity: 1 } : {}"
          :src="imageSrc"
          @error="emit('image-error', $event)"
          @load="isImageLoaded = true"
        />
        <!-- Video thumbnail with play icon -->
        <div v-else class="w-20 h-20 relative rounded-lg overflow-hidden">
          <img
            v-if="imageSrc && imageSrc !== placeholderImage"
            :alt="props.item?.filename || 'Video'"
            :class="[
              'w-full h-full object-cover transition-all duration-300 will-change-transform',
              isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]',
            ]"
            :style="props.isSelected ? { opacity: 1 } : {}"
            :src="imageSrc"
            @error="emit('image-error', $event)"
            @load="isImageLoaded = true"
          />
          <!-- Video play icon overlay -->
          <div
            class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
            >
              <Play class="h-5 w-5 text-teal-600 dark:text-teal-400 ml-0.5" />
            </div>
          </div>
        </div>
        <!-- Starred Badge (always visible when starred) -->
        <div v-if="props.item?.isStarred" class="absolute bottom-1 left-1 z-30">
          <div
            class="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400/90 dark:bg-yellow-500/90 backdrop-blur-sm shadow-lg"
            title="Starred"
          >
            <Star class="h-3 w-3 fill-white text-white" />
          </div>
        </div>
        <!-- Was Selected on Completion Badge (bottom right, like star badge) -->
        <div
          v-if="props.wasSelectedOnCompletion && props.selectionStatus === 'completed'"
          class="absolute bottom-1 right-1 z-30"
        >
          <div
            class="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/90 backdrop-blur-sm shadow-lg"
            title="Selected when completed"
          >
            <CheckCircle2 class="h-3 w-3 fill-white text-white" />
          </div>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <p
          v-if="props.showFilename && props.item?.filename"
          :class="theme.textPrimary"
          class="text-sm font-medium truncate"
        >
          {{ props.item.filename }}
        </p>
        <p v-else :class="theme.textTertiary" class="text-sm font-medium truncate">Media Item</p>
        <p :class="theme.textTertiary" class="text-xs mt-1">
          {{ props.subtitle }}
        </p>
      </div>
    </div>

    <!-- Star Toggle Button (on hover) -->
    <button
      class="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
      @click.stop="emit('star-click')"
    >
      <Star
        :class="[
          'h-4 w-4',
          props.item?.isStarred ? 'fill-yellow-400 text-yellow-400' : theme.textSecondary,
        ]"
      />
    </button>

    <!-- Context Menu Button -->
    <div
      :class="[
        'flex-shrink-0 transition-opacity duration-200',
        isDropdownOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
      ]"
      @click.stop
    >
      <DropdownMenu v-model:open="isDropdownOpen">
        <DropdownMenuTrigger as-child>
          <button
            :class="theme.textSecondary"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
            @click.stop
          >
            <MoreVertical class="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          :class="[theme.bgDropdown, theme.borderSecondary]"
          align="end"
          class="w-48"
          @click.stop
        >
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('view-details')"
          >
            <Eye class="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <div :class="theme.borderSecondary" class="h-px my-1"></div>
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('open')"
          >
            <ExternalLink class="h-4 w-4 mr-2" />
            Open
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('download')"
          >
            <Download class="h-4 w-4 mr-2" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('move-copy')"
          >
            <Move class="h-4 w-4 mr-2" />
            Move/Copy
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('copy-filenames')"
          >
            <Copy class="h-4 w-4 mr-2" />
            Copy filenames
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('set-as-cover')"
          >
            <FileImage class="h-4 w-4 mr-2" />
            Set as cover
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('rename')"
          >
            <Pencil class="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('replace')"
          >
            <FileImage class="h-4 w-4 mr-2" />
            Replace photo
          </DropdownMenuItem>
          <DropdownMenuItem
            v-if="props.item?.originalUrl"
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('remove-watermark')"
          >
            <X class="h-4 w-4 mr-2" />
            Remove Watermark
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('watermark')"
          >
            <Eye class="h-4 w-4 mr-2" />
            {{ props.item?.originalUrl ? 'Change Watermark' : 'Add Watermark' }}
          </DropdownMenuItem>
          <div :class="theme.borderSecondary" class="h-px my-1"></div>
          <DropdownMenuItem
            :class="[
              'text-red-600 dark:text-red-400',
              'hover:bg-red-50 dark:hover:bg-red-900/20',
              'cursor-pointer',
            ]"
            @click.stop="emit('delete')"
          >
            <Trash2 class="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import {
  getMediaDisplayUrl,
  getMediaDisplayUrlSync,
  revokeMediaBlobUrl,
} from '@/utils/media/getMediaDisplayUrl'
import {
  CheckCircle2,
  CheckSquare2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileImage,
  MoreVertical,
  Move,
  Pencil,
  Play,
  Square,
  Star,
  Trash2,
  X,
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    required: true,
  },
  showFilename: {
    type: Boolean,
    required: true,
  },
  placeholderImage: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  selectionStatus: {
    type: String,
    default: null,
  },
  wasSelectedOnCompletion: {
    type: Boolean,
    default: false,
  },
})

const imageSrc = ref(props.placeholderImage)
const isImageLoaded = ref(false)
const isDropdownOpen = ref(false)

const getThumbnailUrl = () => {
  const item = props.item
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
    // Fallback to video URL (will show video player)
    return item.file?.url || null
  }

  // 3. For images, use file URL or variants
  if (mediaType === 'image') {
    if (item.file?.variants?.thumb) {
      return item.file.variants.thumb
    }
    return item.file?.url || null
  }

  // 4. Fallback
  return item.file?.url || item.thumbnail || null
}
const updateImageSrc = async () => {
  const url = getThumbnailUrl()
  if (!url) {
    imageSrc.value = props.placeholderImage
    return
  }

  try {
    const displayUrl = await getMediaDisplayUrl(url, props.placeholderImage)
    imageSrc.value = displayUrl || props.placeholderImage
  } catch (error) {
    imageSrc.value = props.placeholderImage
  }
}

onMounted(() => {
  const url = getThumbnailUrl()
  if (url) {
    imageSrc.value = getMediaDisplayUrlSync(url, props.placeholderImage)
    updateImageSrc()
  } else {
    imageSrc.value = props.placeholderImage
  }
})

watch(
  () => [props.item?.thumbnailUrl, props.item?.file?.url, props.item?.url, props.item?.type],
  () => {
    isImageLoaded.value = false
    updateImageSrc()
  }
)

onUnmounted(() => {
  if (imageSrc.value && imageSrc.value.startsWith('blob:')) {
    revokeMediaBlobUrl(imageSrc.value)
  }
})

const emit = defineEmits([
  'toggle-selection',
  'open-viewer',
  'view-details',
  'image-error',
  'open',
  'download',
  'move-copy',
  'copy-filenames',
  'set-as-cover',
  'rename',
  'replace',
  'remove-watermark',
  'watermark',
  'delete',
  'star-click',
])
</script>
