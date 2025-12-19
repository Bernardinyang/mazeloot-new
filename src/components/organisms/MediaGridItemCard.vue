<template>
  <div class="group">
    <div
      :class="props.isSelected ? 'ring-2 ring-teal-500 ring-offset-2' : ''"
      class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-200 dark:border-gray-700"
    >
      <!-- Selection Checkbox -->
      <div
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

      <div class="w-full h-full cursor-pointer" @click="emit('open-viewer')">
        <img
          :alt="props.item?.title || 'Media'"
          :src="imageSrc"
          :class="[
            'w-full h-full object-cover transition-all duration-300 will-change-transform',
            isImageLoaded
              ? 'opacity-100 scale-100 group-hover:scale-110'
              : 'opacity-0 scale-[0.98]',
          ]"
          @load="isImageLoaded = true"
          @error="emit('image-error', $event)"
        />
      </div>

      <!-- Context Menu Button -->
      <div
        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        @click.stop
      >
        <DropdownMenu>
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
              @click.stop="emit('quick-share')"
            >
              <Share2 class="h-4 w-4 mr-2" />
              Quick share link
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
              Set as cover photo
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

    <!-- Filename below image -->
    <p
      v-if="props.showFilename && props.item?.title"
      :class="theme.textPrimary"
      class="text-xs font-medium truncate mt-2 text-center"
    >
      {{ props.item.title }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import {
  getMediaDisplayUrl,
  getMediaDisplayUrlSync,
  revokeMediaBlobUrl,
} from '@/utils/media/getMediaDisplayUrl'
import {
  CheckSquare2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileImage,
  MoreVertical,
  Move,
  Pencil,
  Share2,
  Square,
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
})

const imageSrc = ref(props.placeholderImage)
const isImageLoaded = ref(false)

// Initialize image source
const updateImageSrc = async () => {
  const url = props.item?.thumbnail || props.item?.url
  if (!url) {
    imageSrc.value = props.placeholderImage
    return
  }

  try {
    const displayUrl = await getMediaDisplayUrl(url, props.placeholderImage)
    // Always update with the result, even if it's the fallback
    // This ensures blob URLs are set when available
    imageSrc.value = displayUrl || props.placeholderImage
  } catch (error) {
    console.error('Error updating image source:', error, 'URL:', url)
    imageSrc.value = props.placeholderImage
  }
}

onMounted(() => {
  // Set initial sync URL for immediate display
  const url = props.item?.thumbnail || props.item?.url
  if (url) {
    imageSrc.value = getMediaDisplayUrlSync(url, props.placeholderImage)
    // Then update with async blob URL if needed
    updateImageSrc()
  } else {
    imageSrc.value = props.placeholderImage
  }
})

watch(
  () => [props.item?.thumbnail, props.item?.url],
  () => {
    isImageLoaded.value = false
    updateImageSrc()
  }
)

onUnmounted(() => {
  // Cleanup blob URLs
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
  'quick-share',
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
