<template>
  <Transition name="slide-up">
    <div
      v-if="selectedCount > 0"
      class="fixed bottom-[calc(2rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 mb-4 mx-2 w-[calc(100vw-1rem)] max-w-2xl px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-800"
    >
      <!-- Left: Selection info with dropdown -->
      <div class="flex items-center gap-3">
        <!-- Close button -->
        <Button
          variant="destructive"
          size="icon-sm"
          class="bg-red-500 hover:bg-red-600 text-white"
          title="Clear selection"
          :icon="X"
          @click="handleClearSelection"
        />
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
              <Button
                as-child
                variant="ghost"
                size="icon"
                :disabled="props.isFavoriteLoading"
                :loading="props.isFavoriteLoading"
                :icon="!props.isFavoriteLoading ? Star : null"
                class="p-2 hover:bg-gray-700 dark:hover:bg-gray-800 text-white"
                title="Favorite"
                @click="handleFavorite"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Favorite</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <!-- Eye (View) -->
        <TooltipProvider v-if="props.canPreview">
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

        <!-- Watermark -->
        <TooltipProvider v-if="!props.disableActions && !props.hideWatermark">
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
        <TooltipProvider v-if="!props.disableActions">
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
        <TooltipProvider v-if="!props.disableActions">
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
        <TooltipProvider v-if="!props.disableActions">
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

        <!-- Copy Filenames -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                title="Copy Filenames"
                @click="handleCopyFilenames"
              >
                <Copy class="h-5 w-5 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy Filenames</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import {
  ArrowDown,
  Copy,
  Eye,
  ImageIcon,
  Loader2,
  Move,
  Pencil as PencilIcon,
  Star,
  Trash2,
  X,
} from '@/shared/utils/lucideAnimated'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/shadcn/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  selectedCount: {
    type: Number,
    required: true,
  },
  isAllSelected: {
    type: Boolean,
    required: true,
  },
  isFavoriteLoading: {
    type: Boolean,
    default: false,
  },
  disableActions: {
    type: Boolean,
    default: false,
  },
  hideWatermark: {
    type: Boolean,
    default: false,
  },
  canPreview: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'clear-selection',
  'select-all',
  'favorite',
  'view',
  'watermark',
  'move',
  'delete',
  'edit',
  'copy-filenames',
])

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

const handleCopyFilenames = () => {
  emit('copy-filenames')
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
