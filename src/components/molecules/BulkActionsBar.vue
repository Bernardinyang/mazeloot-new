<template>
  <Transition name="slide-up">
    <div
      v-if="selectedCount > 0"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 mb-4 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-800"
    >
      <!-- Left: Selection info with dropdown -->
      <div class="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
              <span class="text-sm font-medium"> {{ selectedCount }} selected </span>
              <ArrowDown class="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent :class="[theme.bgDropdown, theme.borderSecondary]" align="start">
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click="handleSelectAll"
            >
              {{ isAllSelected ? 'Deselect All' : 'Select All' }}
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="[
                'text-red-600 dark:text-red-400',
                'hover:bg-red-50 dark:hover:bg-red-900/20',
                'cursor-pointer',
              ]"
              @click="handleClearSelection"
            >
              Clear selection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Right: Action icons -->
      <div class="flex items-center gap-4">
        <!-- Star (Favorite) -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                :disabled="props.isFavoriteLoading"
                class="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Favorite"
                @click="handleFavorite"
              >
                <Loader2 v-if="props.isFavoriteLoading" class="h-5 w-5 text-white animate-spin" />
                <Star v-else class="h-5 w-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Favorite</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <!-- Eye (View) -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                title="View"
                @click="handleView"
              >
                <Eye class="h-5 w-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <!-- Tag -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                title="Tag"
                @click="handleTag"
              >
                <Tag class="h-5 w-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <!-- Watermark -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                title="Apply Watermark"
                @click="handleWatermark"
              >
                <ImageIcon class="h-5 w-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Apply Watermark</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <!-- Move (Arrow into box) -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                title="Move"
                @click="handleMove"
              >
                <Move class="h-5 w-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Move</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <!-- Delete (Arrow out of box) -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                title="Delete"
                @click="handleDelete"
              >
                <Trash2 class="h-5 w-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <!-- Edit (Pencil) -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                title="Edit"
                @click="handleEdit"
              >
                <PencilIcon class="h-5 w-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import {
  ArrowDown,
  Eye,
  ImageIcon,
  Loader2,
  Move,
  Pencil as PencilIcon,
  Star,
  Tag,
  Trash2,
} from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

interface Props {
  selectedCount: number
  isAllSelected: boolean
  isFavoriteLoading?: boolean
}

interface Emits {
  (e: 'clear-selection'): void

  (e: 'select-all'): void

  (e: 'favorite'): void

  (e: 'view'): void

  (e: 'tag'): void

  (e: 'watermark'): void

  (e: 'move'): void

  (e: 'delete'): void

  (e: 'edit'): void
}

const props = withDefaults(defineProps<Props>(), {
  isFavoriteLoading: false,
})

const emit = defineEmits<Emits>()

const handleClearSelection = () => {
  emit('clear-selection')
}

const handleSelectAll = () => {
  emit('select-all')
}

const handleFavorite = () => {
  emit('favorite')
}

const handleView = () => {
  emit('view')
}

const handleTag = () => {
  emit('tag')
}

const handleWatermark = () => {
  emit('watermark')
}

const handleMove = () => {
  emit('move')
}

const handleDelete = () => {
  emit('delete')
}

const handleEdit = () => {
  emit('edit')
}
</script>

<style scoped>
/* Slide up transition for bulk actions bar */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
