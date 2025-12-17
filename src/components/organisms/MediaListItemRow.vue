<template>
  <div
    :class="[
      theme.borderSecondary,
      props.isSelected
        ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/50 dark:bg-teal-900/20'
        : '',
    ]"
    class="group flex items-center gap-4 p-4 rounded-xl border bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-200"
  >
    <!-- Selection Checkbox -->
    <button
      class="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      @click.stop="emit('toggle-selection')"
    >
      <CheckSquare2 v-if="props.isSelected" class="h-5 w-5 text-teal-500" />
      <Square v-else :class="theme.textSecondary" class="h-5 w-5" />
    </button>

    <div class="flex items-center gap-4 flex-1 cursor-pointer" @click="emit('open-viewer')">
      <img
        :alt="props.item?.title || 'Media'"
        :src="props.item?.thumbnail || props.item?.url || props.placeholderImage"
        class="w-20 h-20 object-cover rounded-lg shadow-sm"
        @error="emit('image-error', $event)"
      />
      <div class="flex-1 min-w-0">
        <p
          v-if="props.showFilename && props.item?.title"
          :class="theme.textPrimary"
          class="text-sm font-medium truncate"
        >
          {{ props.item.title }}
        </p>
        <p v-else :class="theme.textTertiary" class="text-sm font-medium truncate">Media Item</p>
        <p :class="theme.textTertiary" class="text-xs mt-1">
          {{ props.subtitle }}
        </p>
      </div>
    </div>

    <!-- Context Menu Button -->
    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200" @click.stop>
      <DropdownMenu>
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

<script setup lang="ts">
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

type MediaItemLike = any

const props = defineProps<{
  item: MediaItemLike
  isSelected: boolean
  showFilename: boolean
  placeholderImage: string
  subtitle: string
}>()

const emit = defineEmits<{
  'toggle-selection': []
  'open-viewer': []
  'image-error': [event: Event]
  open: []
  'quick-share': []
  download: []
  'move-copy': []
  'copy-filenames': []
  'set-as-cover': []
  rename: []
  replace: []
  'remove-watermark': []
  watermark: []
  delete: []
}>()
</script>
