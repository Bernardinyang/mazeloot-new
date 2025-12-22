<template>
  <div class="flex items-center justify-between mb-8">
    <h2 :class="theme.textPrimary" class="text-3xl font-bold tracking-tight">
      {{ props.title }}
    </h2>
    <div class="flex items-center gap-3">
      <!-- Sort Menu -->
      <Popover v-model:open="isSortMenuOpen">
        <PopoverTrigger as-child>
          <button
            :class="[
              theme.borderSecondary,
              theme.bgCard,
              isSortMenuOpen ? 'ring-2 ring-teal-500/20' : '',
            ]"
            class="px-3 py-2 rounded-lg border shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <ArrowUpDown :class="theme.textSecondary" class="h-4 w-4" />
            <span :class="theme.textPrimary" class="text-sm">{{ selectedSortLabel }}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          :class="[theme.bgCard, theme.borderSecondary]"
          align="end"
          class="w-56 p-0"
          @click.stop
        >
          <div class="p-2">
            <p :class="theme.textTertiary" class="px-2 py-1.5 text-xs font-semibold">Sort by</p>
            <div class="mt-1 space-y-0.5">
              <button
                v-for="option in sortOptions"
                :key="option.value"
                :class="[
                  sortOrder === option.value ? theme.bgButtonHover + ' ' + theme.textPrimary : '',
                ]"
                class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between"
                @click="handleSortChange(option.value)"
              >
                <span>{{ option.label }}</span>
                <Check v-if="sortOrder === option.value" class="h-4 w-4 text-teal-500" />
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <!-- View Options Menu (only show in grid view) -->
      <Popover v-if="viewMode === 'grid'" v-model:open="isViewMenuOpen">
        <PopoverTrigger as-child>
          <button
            :class="[
              theme.borderSecondary,
              theme.bgCard,
              isViewMenuOpen ? 'ring-2 ring-teal-500/20' : '',
            ]"
            class="p-2 rounded-lg border shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Grid3x3 :class="theme.textSecondary" class="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          :class="[theme.bgCard, theme.borderSecondary]"
          align="end"
          class="w-56 p-0"
          @click.stop
        >
          <div class="p-2 space-y-4">
            <!-- Grid Size -->
            <div>
              <p :class="theme.textTertiary" class="px-2 py-1.5 text-xs font-semibold">Grid Size</p>
              <div class="mt-1 space-y-0.5">
                <button
                  v-for="size in gridSizeOptions"
                  :key="size.value"
                  :class="[
                    gridSize === size.value ? theme.bgButtonHover + ' ' + theme.textPrimary : '',
                  ]"
                  class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
                  @click="handleGridSizeChange(size.value)"
                >
                  <span>{{ size.label }}</span>
                  <Check v-if="gridSize === size.value" class="h-4 w-4 text-teal-500" />
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
                      :checked="showFilename"
                      class="sr-only peer"
                      type="checkbox"
                      @change="handleFilenameToggle"
                    />
                    <div
                      class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600"
                    ></div>
                    <span
                      :class="showFilename ? theme.textPrimary : theme.textSecondary"
                      class="ml-3 text-sm font-medium"
                    >
                      {{ showFilename ? 'On' : 'Off' }}
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
          :class="[viewMode === 'list' ? 'bg-teal-500 text-white shadow-sm' : '']"
          class="p-2 rounded-md transition-all duration-200"
          @click="handleViewModeChange('list')"
        >
          <List class="h-4 w-4" />
        </button>
        <button
          :class="[viewMode === 'grid' ? 'bg-teal-500 text-white shadow-sm' : '']"
          class="p-2 rounded-md transition-all duration-200"
          @click="handleViewModeChange('grid')"
        >
          <Grid3x3 class="h-4 w-4" />
        </button>
      </div>

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

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowUpDown, Check, Grid3x3, ImagePlus, List, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSelectionStore } from '@/stores/selection'

const theme = useThemeClasses()
const selectionStore = useSelectionStore()

// Use storeToRefs to ensure reactivity in template
const { gridSize, viewMode, showFilename, sortOrder } = storeToRefs(selectionStore)

const gridSizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
]

const sortOptions = [
  { label: 'Uploaded (New → Old)', value: 'uploaded-new-old' },
  { label: 'Uploaded (Old → New)', value: 'uploaded-old-new' },
  { label: 'Date Taken (New → Old)', value: 'date-taken-new-old' },
  { label: 'Date Taken (Old → New)', value: 'date-taken-old-new' },
  { label: 'Name (A → Z)', value: 'name-a-z' },
  { label: 'Name (Z → A)', value: 'name-z-a' },
  { label: 'Random', value: 'random' },
]

const selectedSortLabel = computed(() => {
  const selectedOption = sortOptions.find(option => option.value === sortOrder.value)
  return selectedOption ? selectedOption.label : 'Sort'
})

// Internal menu state
const isSortMenuOpen = ref(false)
const isViewMenuOpen = ref(false)

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  selectedCount: {
    type: Number,
    required: true,
  },
  isUploading: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['toggle-select-all', 'add-media'])

// Internal handlers - update store directly
const handleGridSizeChange = value => {
  selectionStore.setGridSize(value)
  isViewMenuOpen.value = false
}

const handleSortChange = value => {
  selectionStore.setSortOrder(value)
  isSortMenuOpen.value = false
}

const handleFilenameToggle = event => {
  selectionStore.setShowFilename(event.target.checked)
}

const handleViewModeChange = mode => {
  selectionStore.setViewMode(mode)
}
</script>
