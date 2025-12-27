<template>
  <div class="group">
    <div
      :class="[
        props.isSelected
          ? 'ring-2 ring-teal-500 ring-offset-2 opacity-100'
          : props.wasSelectedOnCompletion && props.selectionStatus === 'completed'
            ? 'opacity-100'
            : props.selectionStatus === 'completed'
              ? 'opacity-50 grayscale'
              : 'opacity-90 hover:opacity-100',
        props.wasSelectedOnCompletion && !props.isSelected ? 'ring-1 ring-green-500/50' : '',
      ]"
      class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-200 dark:border-gray-700"
    >
      <!-- Selection Checkbox -->
      <div
        v-if="props.showSelectionCheckbox"
        :class="props.isSelected ? 'opacity-100' : ''"
        class="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        @click.stop="emit('toggle-selection')"
      >
        <button
          class="p-1.5 rounded-md bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors"
          @click.stop="emit('toggle-selection')"
        >
          <CheckSquare2 v-if="props.isSelected" class="h-5 w-5 text-teal-400" />
          <Square v-else class="h-5 w-5 text-white" />
        </button>
      </div>

      <!-- Star Toggle Button (on hover) -->
      <div
        class="absolute top-2 right-12 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        @click.stop
      >
        <button
          class="p-1.5 rounded-md bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors"
          @click.stop="emit('star-click')"
        >
          <Star
            :class="[
              'h-4 w-4',
              props.item?.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-white',
            ]"
          />
        </button>
      </div>

      <div class="w-full h-full cursor-pointer relative" @click="emit('open-viewer')">
        <!-- Image thumbnail -->
        <img
          v-if="(item?.type || item?.file?.type) !== 'video'"
          :alt="props.item?.filename || 'Media'"
          :class="[
            'w-full h-full object-cover transition-all duration-300 will-change-transform',
            isImageLoaded
              ? 'opacity-100 scale-100 group-hover:scale-110'
              : 'opacity-0 scale-[0.98]',
          ]"
          :src="imageSrc"
          @error="emit('image-error', $event)"
          @load="isImageLoaded = true"
        />
        <!-- Video thumbnail with play icon -->
        <div
          v-else-if="(props.item?.type || props.item?.file?.type) === 'video'"
          class="w-full h-full relative"
        >
          <img
            v-if="imageSrc && imageSrc !== placeholderImage"
            :alt="props.item?.filename || 'Video'"
            :class="[
              'w-full h-full object-cover transition-all duration-300 will-change-transform',
              isImageLoaded
                ? 'opacity-100 scale-100 group-hover:scale-110'
                : 'opacity-0 scale-[0.98]',
            ]"
            :src="imageSrc"
            @error="emit('image-error', $event)"
            @load="isImageLoaded = true"
          />
          <!-- Video play icon overlay -->
          <div
            class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
          >
            <div
              class="w-16 h-16 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
            >
              <Play class="h-8 w-8 text-teal-600 dark:text-teal-400 ml-1" />
            </div>
          </div>
        </div>
      </div>

      <!-- Starred Badge (always visible when starred) -->
      <div v-if="props.item?.isStarred" class="absolute bottom-2 left-2 z-30">
        <div
          class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400/90 dark:bg-yellow-500/90 backdrop-blur-sm shadow-lg"
          title="Starred"
        >
          <Star class="h-4 w-4 fill-white text-white" />
        </div>
      </div>

      <!-- Was Selected on Completion Badge (bottom right, like star badge) -->
      <div
        v-if="props.wasSelectedOnCompletion && props.selectionStatus === 'completed'"
        class="absolute bottom-2 right-2 z-30"
      >
        <div
          class="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/90 backdrop-blur-sm shadow-lg"
          title="Selected when completed"
        >
          <CheckCircle2 class="h-4 w-4 fill-white text-white" />
        </div>
      </div>

      <!-- Context Menu Button -->
      <div
        :class="[
          'absolute top-2 right-2 transition-opacity duration-200 z-10',
          isDropdownOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        ]"
        @click.stop
      >
        <DropdownMenu v-model:open="isDropdownOpen">
          <DropdownMenuTrigger as-child>
            <button
              class="p-1.5 rounded-md bg-black/60 hover:bg-black/80 backdrop-blur-md transition-all duration-200 shadow-lg hover:scale-110"
              @click.stop
            >
              <MoreVertical class="h-4 w-4 text-white" />
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
              v-if="props.showManagementActions"
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
              v-if="props.showManagementActions"
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('set-as-cover')"
            >
              <FileImage class="h-4 w-4 mr-2" />
              Set as cover photo
            </DropdownMenuItem>
            <DropdownMenuItem
              v-if="props.showManagementActions"
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('rename')"
            >
              <Pencil class="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              v-if="props.showManagementActions"
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('replace')"
            >
              <FileImage class="h-4 w-4 mr-2" />
              Replace photo
            </DropdownMenuItem>
            <DropdownMenuItem
              v-if="props.showManagementActions && props.item?.originalUrl"
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('remove-watermark')"
            >
              <X class="h-4 w-4 mr-2" />
              Remove Watermark
            </DropdownMenuItem>
            <DropdownMenuItem
              v-if="props.showManagementActions"
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('watermark')"
            >
              <Eye class="h-4 w-4 mr-2" />
              {{ props.item?.originalUrl ? 'Change Watermark' : 'Add Watermark' }}
            </DropdownMenuItem>
            <div
              v-if="props.showManagementActions"
              :class="theme.borderSecondary"
              class="h-px my-1"
            ></div>
            <DropdownMenuItem
              v-if="props.showManagementActions"
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

    <!-- Filename below image -->
    <p
      v-if="props.showFilename && props.item?.file?.filename"
      :class="theme.textPrimary"
      class="text-xs font-medium truncate mt-2 text-center"
    >
      {{ props.item?.file?.filename }}
    </p>
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
  selectionStatus: {
    type: String,
    default: null,
  },
  wasSelectedOnCompletion: {
    type: Boolean,
    default: false,
  },
  showManagementActions: {
    type: Boolean,
    default: true,
  },
  showSelectionCheckbox: {
    type: Boolean,
    default: true,
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
  () => [props.item?.thumbnailUrl, props.item?.file?.url, props.item?.type],
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
  'image-error',
  'view-details',
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
