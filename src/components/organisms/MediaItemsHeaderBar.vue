<template>
  <div class="flex items-center justify-between mb-8">
    <h2 :class="theme.textPrimary" class="text-3xl font-bold tracking-tight">
      {{ props.title }}
    </h2>
    <div class="flex items-center gap-3">
      <!-- Sort Menu -->
      <Popover :open="props.isSortMenuOpen" @update:open="emit('update:isSortMenuOpen', $event)">
        <PopoverTrigger as-child>
          <button
            :class="[
              theme.borderSecondary,
              theme.bgCard,
              props.isSortMenuOpen ? 'ring-2 ring-teal-500/20' : '',
            ]"
            class="p-2 rounded-lg border shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowUpDown :class="theme.textSecondary" class="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent :class="[theme.bgCard, theme.borderSecondary]" align="end" class="w-56 p-0">
          <div class="p-2">
            <p :class="theme.textTertiary" class="px-2 py-1.5 text-xs font-semibold">Sort by</p>
            <div class="mt-1 space-y-0.5">
              <button
                v-for="option in props.sortOptions"
                :key="option.value"
                :class="[
                  props.sortOrder === option.value
                    ? theme.bgButtonHover + ' ' + theme.textPrimary
                    : '',
                ]"
                class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors"
                @click="emit('sort-change', option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <!-- View Options Menu (only show in grid view) -->
      <Popover
        v-if="props.viewMode === 'grid'"
        :open="props.isViewMenuOpen"
        @update:open="emit('update:isViewMenuOpen', $event)"
      >
        <PopoverTrigger as-child>
          <button
            :class="[
              theme.borderSecondary,
              theme.bgCard,
              props.isViewMenuOpen ? 'ring-2 ring-teal-500/20' : '',
            ]"
            class="p-2 rounded-lg border shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Grid3x3 :class="theme.textSecondary" class="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent :class="[theme.bgCard, theme.borderSecondary]" align="end" class="w-56 p-0">
          <div class="p-2 space-y-4">
            <!-- Grid Size -->
            <div>
              <p :class="theme.textTertiary" class="px-2 py-1.5 text-xs font-semibold">Grid Size</p>
              <div class="mt-1 space-y-0.5">
                <button
                  v-for="size in props.gridSizeOptions"
                  :key="size.value"
                  :class="[
                    props.gridSize === size.value
                      ? theme.bgButtonHover + ' ' + theme.textPrimary
                      : '',
                  ]"
                  class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between"
                  @click="emit('grid-size-change', size.value)"
                >
                  <span>{{ size.label }}</span>
                  <Check v-if="props.gridSize === size.value" class="h-4 w-4 text-teal-500" />
                </button>
              </div>
            </div>

            <!-- Divider -->
            <div :class="theme.borderSecondary" class="h-px"></div>

            <!-- Show Filename -->
            <div>
              <p :class="theme.textTertiary" class="px-2 py-1.5 text-xs font-semibold">Show</p>
              <div class="mt-1 px-2 py-1.5">
                <div class="flex items-center justify-between">
                  <label :class="theme.textPrimary" class="text-sm">Filename</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      :checked="props.showFilename"
                      class="sr-only peer"
                      type="checkbox"
                      @change="emit('filename-toggle', $event)"
                    />
                    <div
                      class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600"
                    ></div>
                    <span
                      :class="props.showFilename ? theme.textPrimary : theme.textSecondary"
                      class="ml-3 text-sm font-medium"
                    >
                      {{ props.showFilename ? 'On' : 'Off' }}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div
        :class="theme.borderSecondary"
        class="flex items-center gap-0.5 p-0.5 rounded-lg bg-white dark:bg-gray-900 border shadow-sm"
      >
        <button
          :class="[props.viewMode === 'list' ? 'bg-teal-500 text-white shadow-sm' : '']"
          class="p-2 rounded-md transition-all duration-200"
          @click="emit('set-view-mode', 'list')"
        >
          <List class="h-4 w-4" />
        </button>
        <button
          :class="[props.viewMode === 'grid' ? 'bg-teal-500 text-white shadow-sm' : '']"
          class="p-2 rounded-md transition-all duration-200"
          @click="emit('set-view-mode', 'grid')"
        >
          <Grid3x3 class="h-4 w-4" />
        </button>
      </div>

      <!-- Select All Button - Always visible when there are items -->
      <Button
        v-if="props.totalItems > 0"
        :aria-pressed="props.isAllSelected && props.totalItems > 0"
        :class="[
          'border-2 shadow-sm transition-all duration-200 font-medium',
          theme.bgCard,
          theme.borderSecondary,
          theme.textPrimary,
          props.isAllSelected && props.totalItems > 0
            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
            : '',
          theme.bgButtonHover,
        ]"
        title="Select or deselect all items"
        @click="emit('toggle-select-all')"
      >
        <CheckSquare2
          v-if="props.isAllSelected && props.totalItems > 0"
          class="h-4 w-4 mr-2 text-teal-500"
        />
        <Square v-else :class="theme.textSecondary" class="h-4 w-4 mr-2" />
        <span class="font-semibold">
          {{ props.selectedCount > 0 ? 'Clear selection' : 'Select all' }}
        </span>
        <span
          v-if="props.selectedCount > 0"
          :class="[
            'bg-teal-500/10 text-teal-700 dark:text-teal-300 dark:bg-teal-500/20',
            theme.transitionColors,
          ]"
          class="ml-2 inline-flex min-w-7 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold"
        >
          {{ props.selectedCount }}
        </span>
      </Button>

      <Button
        :disabled="props.isUploading"
        class="bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
        @click="emit('add-media')"
      >
        <Loader2 v-if="props.isUploading" class="h-4 w-4 mr-2 animate-spin" />
        <ImagePlus v-else class="h-4 w-4 mr-2" />
        {{ props.isUploading ? 'Uploading...' : 'Upload Photos' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpDown,
  Check,
  CheckSquare2,
  Grid3x3,
  ImagePlus,
  List,
  Loader2,
  Square,
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

type OptionLike = { label: string; value: string }

const props = defineProps<{
  title: string
  sortOptions: OptionLike[]
  sortOrder: string
  gridSizeOptions: OptionLike[]
  gridSize: string
  showFilename: boolean
  viewMode: 'grid' | 'list'
  isSortMenuOpen: boolean
  isViewMenuOpen: boolean
  totalItems: number
  selectedCount: number
  isAllSelected: boolean
  isUploading: boolean
}>()

const emit = defineEmits<{
  'update:isSortMenuOpen': [value: boolean]
  'update:isViewMenuOpen': [value: boolean]
  'sort-change': [value: string]
  'grid-size-change': [value: string]
  'filename-toggle': [event: Event]
  'set-view-mode': [value: 'grid' | 'list']
  'toggle-select-all': []
  'add-media': []
}>()
</script>
