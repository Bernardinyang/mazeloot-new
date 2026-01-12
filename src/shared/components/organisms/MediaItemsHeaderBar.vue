<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
    <h2 :class="[theme.textPrimary, 'text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate flex-1 sm:flex-initial']">
      {{ props.title }}
    </h2>
    <div class="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-start sm:justify-end">
      <!-- Sort Menu -->
      <Popover v-model:open="isSortMenuOpen">
        <PopoverTrigger as-child>
          <button
            :class="[
              theme.borderSecondary,
              theme.bgCard,
              isSortMenuOpen ? 'ring-2 ring-accent/20' : '',
            ]"
            class="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1 sm:gap-2 shrink-0"
          >
            <ArrowUpDown :class="theme.textSecondary" class="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span :class="[theme.textPrimary, 'text-xs sm:text-sm truncate']">{{ selectedSortLabel }}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          :class="[theme.bgCard, theme.borderSecondary]"
          align="end"
          class="w-[calc(100vw-2rem)] sm:w-56 max-w-[calc(100vw-2rem)] sm:max-w-none p-0"
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
                <Check v-if="sortOrder === option.value" class="h-4 w-4 text-accent" />
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <!-- Merged View Options Menu (includes view style and grid options) -->
      <Popover v-model:open="isViewMenuOpen">
        <PopoverTrigger as-child>
          <button
            :class="[
              theme.borderSecondary,
              theme.bgCard,
              isViewMenuOpen ? 'ring-2 ring-accent/20' : '',
            ]"
            class="p-2 rounded-lg border shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Grid3x3 :class="theme.textSecondary" class="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          :class="[theme.bgCard, theme.borderSecondary]"
          align="end"
          class="w-[calc(100vw-2rem)] sm:w-56 max-w-[calc(100vw-2rem)] sm:max-w-none p-0"
          @click.stop
        >
          <div class="p-2 space-y-4">
            <!-- View Style -->
            <div>
              <p :class="theme.textTertiary" class="px-2 py-1.5 text-xs font-semibold">
                View Style
              </p>
              <div class="mt-1 space-y-0.5">
                <button
                  :class="[
                    viewMode === 'grid' ? theme.bgButtonHover + ' ' + theme.textPrimary : '',
                  ]"
                  class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
                  @click="handleViewModeChange('grid')"
                >
                  <div class="flex items-center gap-2">
                    <Grid3x3 class="h-4 w-4" />
                    <span>Grid View</span>
                  </div>
                  <Check v-if="viewMode === 'grid'" class="h-4 w-4 text-accent" />
                </button>
                <button
                  :class="[
                    viewMode === 'list' ? theme.bgButtonHover + ' ' + theme.textPrimary : '',
                  ]"
                  class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
                  @click="handleViewModeChange('list')"
                >
                  <div class="flex items-center gap-2">
                    <List class="h-4 w-4" />
                    <span>List View</span>
                  </div>
                  <Check v-if="viewMode === 'list'" class="h-4 w-4 text-accent" />
                </button>
              </div>
            </div>

            <!-- Grid Size (only show in grid view) -->
            <div v-if="viewMode === 'grid'">
              <div :class="theme.borderSecondary" class="h-px"></div>
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
                  <Check v-if="gridSize === size.value" class="h-4 w-4 text-accent" />
                </button>
              </div>
            </div>

            <!-- Show Filename (only show in grid view) -->
            <div v-if="viewMode === 'grid'">
              <div :class="theme.borderSecondary" class="h-px"></div>
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
                      class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-accent bg-gray-300 dark:bg-gray-600"
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

      <Button
        v-if="props.onCopySelectedFilenamesInSet && props.selectionStatus === 'completed'"
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary, 'shrink-0']"
        :disabled="props.isUploading || props.selectedCount === 0"
        @click="handleCopySelectedFilenames"
      >
        <Copy class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2 shrink-0" />
        <span class="hidden sm:inline">Copy Selected ({{ props.selectedCount }})</span>
        <span class="sm:hidden">Copy ({{ props.selectedCount }})</span>
      </Button>

      <Button
        v-if="!props.disableUpload"
        variant="primary"
        :loading="props.isUploading"
        :icon="ImagePlus"
        loading-label="Uploading..."
        size="sm"
        class="shadow-md hover:shadow-lg transition-all duration-200 font-medium shrink-0"
        @click="emit('add-media')"
      >
        <span class="hidden sm:inline">Upload Media</span>
        <span class="sm:hidden">Upload</span>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowUpDown, Check, Copy, Grid3x3, ImagePlus, List, Loader2 } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/shadcn/popover'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useSelectionStore } from '@/domains/memora/stores/selection'
import { useProofingStore } from '@/domains/memora/stores/proofing'
import { useGalleryStore } from '@/shared/stores/gallery'

const theme = useThemeClasses()

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
  onCopySelectedFilenamesInSet: {
    type: Function,
    default: null,
  },
  selectionStatus: {
    type: String,
    default: null,
  },
  storeType: {
    type: String,
    default: 'selection', // 'selection', 'proofing', 'collection', or 'raw_files'
    validator: value => ['selection', 'proofing', 'collection', 'raw_files'].includes(value),
  },
  disableUpload: {
    type: Boolean,
    default: false,
  },
  viewMode: {
    type: String,
    default: 'grid',
  },
  gridSize: {
    type: String,
    default: 'medium',
  },
  sortOrder: {
    type: String,
    default: 'uploaded-new-old',
  },
  showFilename: {
    type: Boolean,
    default: true,
  },
})

// Use the appropriate store based on storeType prop
const selectionStore = useSelectionStore()
const proofingStore = useProofingStore()
const galleryStore = useGalleryStore()

// Get refs from stores
const selectionRefs = storeToRefs(selectionStore)
const proofingRefs = storeToRefs(proofingStore)
const galleryRefs = storeToRefs(galleryStore)

// Use computed refs that switch based on storeType
const gridSize = computed(() => {
  if (props.storeType === 'raw_files') {
    return props.gridSize
  }
  if (props.storeType === 'collection') {
    return galleryRefs?.gridSize?.value ?? props.gridSize
  }
  return props.storeType === 'proofing' ? proofingRefs.gridSize.value : selectionRefs.gridSize.value
})

const viewMode = computed(() => {
  if (props.storeType === 'raw_files') {
    return props.viewMode
  }
  if (props.storeType === 'collection') {
    return galleryRefs?.viewMode?.value ?? props.viewMode
  }
  return props.storeType === 'proofing' ? proofingRefs.viewMode.value : selectionRefs.viewMode.value
})

const showFilename = computed(() => {
  if (props.storeType === 'raw_files') {
    return props.showFilename
  }
  if (props.storeType === 'collection') {
    return galleryRefs?.showFilename?.value ?? props.showFilename
  }
  return props.storeType === 'proofing'
    ? proofingRefs.showFilename.value
    : selectionRefs.showFilename.value
})

const sortOrder = computed(() => {
  if (props.storeType === 'raw_files') {
    return props.sortOrder
  }
  if (props.storeType === 'collection') {
    return galleryRefs?.sortOrder?.value ?? props.sortOrder
  }
  return props.storeType === 'proofing'
    ? proofingRefs.sortOrder.value
    : selectionRefs.sortOrder.value
})

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

const emit = defineEmits(['toggle-select-all', 'add-media', 'update:grid-size', 'update:view-mode', 'update:show-filename', 'update:sort-order'])

// Internal handlers - update store directly or emit events for raw_files
const handleGridSizeChange = value => {
  if (props.storeType === 'raw_files') {
    emit('update:grid-size', value)
  } else if (props.storeType === 'collection') {
    galleryStore.setGridSize(value)
  } else if (props.storeType === 'proofing') {
    proofingStore.setGridSize(value)
  } else {
    selectionStore.setGridSize(value)
  }
  isViewMenuOpen.value = false
}

const handleSortChange = value => {
  if (props.storeType === 'raw_files') {
    emit('update:sort-order', value)
  } else if (props.storeType === 'collection') {
    galleryStore.setSortOrder(value)
  } else if (props.storeType === 'proofing') {
    proofingStore.setSortOrder(value)
  } else {
    selectionStore.setSortOrder(value)
  }
  isSortMenuOpen.value = false
}

const handleFilenameToggle = event => {
  if (props.storeType === 'raw_files') {
    emit('update:show-filename', event.target.checked)
  } else if (props.storeType === 'collection') {
    galleryStore.setShowFilename(event.target.checked)
  } else if (props.storeType === 'proofing') {
    proofingStore.setShowFilename(event.target.checked)
  } else {
    selectionStore.setShowFilename(event.target.checked)
  }
}

const handleViewModeChange = mode => {
  if (props.storeType === 'raw_files') {
    emit('update:view-mode', mode)
  } else if (props.storeType === 'collection') {
    galleryStore.setViewMode(mode)
  } else if (props.storeType === 'proofing') {
    proofingStore.setViewMode(mode)
  } else {
    selectionStore.setViewMode(mode)
  }
  isViewMenuOpen.value = false
}

const handleCopySelectedFilenames = () => {
  if (props.onCopySelectedFilenamesInSet) {
    props.onCopySelectedFilenamesInSet()
  }
}
</script>
