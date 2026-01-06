<template>
  <DashboardLayout>
    <template #breadcrumb> My Media</template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        :is-searching="isSearching"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :sort-options="sortOptions"
        :view-mode="viewMode"
        :show-view-toggle="false"
        sort-label="Sort photos by"
        title="My Media"
        @clear="handleClearSearch"
        @search="handleSearch"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      >
        <template #afterSort>
          <!-- Merged View Options Menu (includes view style and grid options) -->
          <Popover v-model:open="isViewMenuOpen">
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
                      <Check v-if="viewMode === 'grid'" class="h-4 w-4 text-teal-500" />
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
                      <Check v-if="viewMode === 'list'" class="h-4 w-4 text-teal-500" />
                    </button>
                  </div>
                </div>

                <!-- Grid Size (only show in grid view) -->
                <div v-if="viewMode === 'grid'">
                  <div :class="theme.borderSecondary" class="h-px"></div>
                  <p :class="theme.textTertiary" class="px-2 py-1.5 text-xs font-semibold">
                    Grid Size
                  </p>
                  <div class="mt-1 space-y-0.5">
                    <button
                      v-for="size in gridSizeOptions"
                      :key="size.value"
                      :class="[
                        gridSize === size.value
                          ? theme.bgButtonHover + ' ' + theme.textPrimary
                          : '',
                      ]"
                      class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800"
                      @click="handleGridSizeChange(size.value)"
                    >
                      <span>{{ size.label }}</span>
                      <Check v-if="gridSize === size.value" class="h-4 w-4 text-teal-500" />
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
                        <input v-model="showFilename" class="sr-only peer" type="checkbox" />
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
        </template>
      </PageHeader>

      <!-- Photos Grid View -->
      <div v-if="viewMode === 'grid'">
        <!-- Loading State -->
        <div
          v-if="isLoadingPhotos"
          :class="[
            'grid gap-4',
            gridSize === 'small'
              ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
              : gridSize === 'medium'
                ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          ]"
        >
          <div
            v-for="i in 20"
            :key="i"
            :class="theme.bgSkeleton"
            class="aspect-square rounded-xl overflow-hidden animate-pulse"
          />
        </div>

        <!-- Empty State -->
        <div v-else-if="sortedPhotos.length === 0" class="flex items-center justify-center py-16">
          <EmptyState
            :icon="Image"
            action-label="Browse Photos"
            message="No media found"
            @action="handleBrowsePhotos"
          />
        </div>

        <!-- Photos Grid -->
        <div
          v-else
          :class="[
            'grid gap-4',
            gridSize === 'small'
              ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
              : gridSize === 'medium'
                ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          ]"
        >
          <TransitionGroup name="media-grid" tag="div" class="contents">
            <div
              v-for="photo in sortedPhotos"
              :key="photo.id"
              class="relative overflow-hidden"
              :class="{
                'opacity-50 pointer-events-none': loadingStates.deleting.has(photo.id),
              }"
            >
              <MediaGridItemCard
                :is-selected="false"
                :item="photo"
                :placeholder-image="placeholderImage"
                :selection-status="null"
                :show-filename="showFilename"
                :show-management-actions="true"
                :minimal-actions="true"
                :show-selection-checkbox="false"
                :was-selected-on-completion="false"
                :is-downloading="loadingStates.downloading.has(photo.id)"
                @copy-filenames="handleCopyFilenames(photo)"
                @delete="handleDeletePhoto(photo)"
                @download="handleDownloadPhoto(photo)"
                @image-error="handleImageError"
                @open="handlePhotoClick(photo)"
                @open-viewer="handlePhotoClick(photo)"
                @star-click="toggleStar(photo)"
                @toggle-featured="handleToggleFeatured(photo)"
                @view-details="handleViewDetails(photo)"
              />
              <!-- Loading Overlay for actions -->
              <div
                v-if="
                  loadingStates.starring.has(photo.id) ||
                  loadingStates.featuring.has(photo.id) ||
                  loadingStates.deleting.has(photo.id)
                "
                class="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-50"
              >
                <Loader2 class="h-6 w-6 text-white animate-spin" />
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Photos List View -->
      <div v-else>
        <!-- Loading State -->
        <div v-if="isLoadingPhotos" class="space-y-2">
          <div
            v-for="i in 10"
            :key="i"
            :class="theme.bgSkeleton"
            class="flex items-center gap-4 p-4 rounded-lg animate-pulse"
          >
            <div :class="['w-16 h-16 rounded', theme.bgSkeleton]"></div>
            <div class="flex-1 space-y-2">
              <div :class="['h-4 w-48 rounded', theme.bgSkeleton]"></div>
              <div :class="['h-3 w-32 rounded', theme.bgSkeleton]"></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="sortedPhotos.length === 0" class="flex items-center justify-center py-16">
          <EmptyState
            :icon="Image"
            action-label="Browse Photos"
            message="No media found"
            @action="handleBrowsePhotos"
          />
        </div>

        <!-- Photos List -->
        <div v-else class="space-y-2">
          <TransitionGroup name="media-list" tag="div" class="contents">
            <div
              v-for="photo in sortedPhotos"
              :key="photo.id"
              class="relative overflow-hidden"
              :class="{
                'opacity-50 pointer-events-none': loadingStates.deleting.has(photo.id),
              }"
            >
              <MediaListItemRow
                :is-selected="false"
                :item="photo"
                :placeholder-image="placeholderImage"
                :selection-status="null"
                :show-filename="showFilename"
                :show-management-actions="true"
                :minimal-actions="true"
                :show-selection-checkbox="false"
                :subtitle="`${photo.mediaSet?.name || 'No set'} • ${formatDate(photo.createdAt)}`"
                :was-selected-on-completion="false"
                @copy-filenames="handleCopyFilenames(photo)"
                @delete="handleDeletePhoto(photo)"
                @download="handleDownloadPhoto(photo)"
                @image-error="handleImageError"
                @open="handlePhotoClick(photo)"
                @open-viewer="handlePhotoClick(photo)"
                @star-click="toggleStar(photo)"
                @toggle-featured="handleToggleFeatured(photo)"
                @view-details="handleViewDetails(photo)"
              />
              <!-- Loading Overlay for actions -->
              <div
                v-if="
                  loadingStates.starring.has(photo.id) ||
                  loadingStates.featuring.has(photo.id) ||
                  loadingStates.deleting.has(photo.id)
                "
                class="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-50"
              >
                <Loader2 class="h-5 w-5 text-white animate-spin" />
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="!isLoadingPhotos && (pagination.totalPages > 1 || pagination.total > 0)"
        :current-page="pagination.page"
        :limit="pagination.limit"
        :total="pagination.total"
        :total-pages="pagination.totalPages"
        :show-page-size="true"
        :show-go-to-page="true"
        :show-first-last="true"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>

    <!-- Photo Viewer Modal -->
    <MediaLightbox
      v-model="showPhotoViewer"
      :initial-index="selectedPhotoIndex"
      :items="sortedPhotos"
      :placeholder-image="placeholderImage"
      @download="handleDownloadPhoto"
    />

    <!-- Media Detail Sidebar -->
    <MediaDetailSidebar
      v-model="showMediaDetailSidebar"
      :media="selectedMediaForDetails"
      :placeholder-image="placeholderImage"
      @view="handlePhotoClick"
      @download="handleDownloadPhoto"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :is-deleting="loadingStates.deleting.has(photoToDelete?.id)"
      :item-name="photoToDelete?.filename"
      :warning-message="deleteWarningMessage"
      :description="deleteDescription"
      title="Delete Media"
      @cancel="showDeleteModal = false"
      @confirm="handleConfirmDelete"
    />
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useDownloadProtection } from '@/composables/useDownloadProtection'
import { useRouter } from 'vue-router'
import { Grid3x3, Image, Check, List, Loader2 } from 'lucide-vue-next'
import { storage } from '@/utils/storage'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useCollectionSort } from '@/composables/useCollectionSort'
import { PHOTO_SORT_OPTIONS } from '@/constants/sortOptions'
import PageHeader from '@/components/molecules/PageHeader.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import MediaLightbox from '@/components/organisms/MediaLightbox.vue'
import MediaGridItemCard from '@/components/organisms/MediaGridItemCard.vue'
import MediaListItemRow from '@/components/organisms/MediaListItemRow.vue'
import MediaDetailSidebar from '@/components/organisms/MediaDetailSidebar.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/errors'
import { useSelectionsApi } from '@/api/selections'
import { useAsyncPagination } from '@/composables/useAsyncPagination'

const router = useRouter()
const theme = useThemeClasses()
const selectionsApi = useSelectionsApi()

// Initialize download protection
const { cleanup: cleanupProtection } = useDownloadProtection({
  enabled: true,
  showWarnings: false,
})

// Placeholder image
const placeholderImage = '/placeholder-image.png'

// View mode and sorting
const viewMode = ref('grid')
const sortBy = ref('date-new-old')
const searchQuery = ref('')
const isSearching = ref(false)
const sortOptions = PHOTO_SORT_OPTIONS

// Loading states for individual actions
const loadingStates = ref({
  starring: new Set(),
  featuring: new Set(),
  deleting: new Set(),
  downloading: new Set(),
})

// Grid size
const gridSize = ref(storage.get('mazeloot_my_media_grid_size') || 'medium')
const gridSizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
]
watch(gridSize, () => {
  storage.set('mazeloot_my_media_grid_size', gridSize.value)
})

// Show filename toggle
const showFilename = ref(storage.get('mazeloot_my_media_show_filename') ?? false)
watch(showFilename, () => {
  storage.set('mazeloot_my_media_show_filename', showFilename.value)
})

// View menu state
const isViewMenuOpen = ref(false)

// Grid size handler
const handleGridSizeChange = value => {
  gridSize.value = value
  isViewMenuOpen.value = false
}

// View mode handler
const handleViewModeChange = mode => {
  viewMode.value = mode
  isViewMenuOpen.value = false
}

// Map sortBy to backend format
const mapSortToBackend = frontendSort => {
  const mapping = {
    'date-new-old': 'uploaded-desc',
    'date-old-new': 'uploaded-asc',
    'name-a-z': 'name-asc',
    'name-z-a': 'name-desc',
  }
  return mapping[frontendSort] || 'uploaded-desc'
}

// Fetch function for pagination
const fetchUserMedia = async params => {
  const fetchParams = { ...params }

  // Add sort parameter
  if (sortBy.value) {
    fetchParams.sortBy = mapSortToBackend(sortBy.value)
  }

  const result = await selectionsApi.fetchUserMedia(fetchParams)
  return result
}

// Use async pagination composable
const {
  data: photos,
  pagination,
  isLoading: isLoadingPhotos,
  fetch,
  goToPage,
  resetToFirstPage,
  setPerPage,
} = useAsyncPagination(fetchUserMedia, {
  initialPage: 1,
  initialPerPage: 10,
  autoFetch: false,
  watchForReset: [sortBy],
})

// Filter photos by search query (client-side filtering)
const filteredPhotos = computed(() => {
  if (!searchQuery.value.trim()) {
    return photos.value
  }
  const query = searchQuery.value.toLowerCase()
  return photos.value.filter(
    photo =>
      (photo.filename || '').toLowerCase().includes(query) ||
      (photo.mediaSet?.name || '').toLowerCase().includes(query)
  )
})

const { sortedItems: sortedPhotos } = useCollectionSort(
  computed(() => filteredPhotos.value),
  sortBy
)

const toggleStar = async photo => {
  if (!photo?.id) {
    toast.error('Media not found', {
      description: 'Unable to toggle star. Please try again.',
    })
    return
  }

  if (loadingStates.value.starring.has(photo.id)) {
    return
  }

  loadingStates.value.starring.add(photo.id)
  try {
    // Always use direct star toggle in My Media view
    await selectionsApi.starMediaDirect(photo.id)
    await fetch()
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to toggle star')
    toast.error('Failed to toggle star', {
      description: errorMessage,
    })
  } finally {
    loadingStates.value.starring.delete(photo.id)
  }
}

const handleToggleFeatured = async photo => {
  if (!photo?.id) {
    toast.error('Media not found', {
      description: 'Unable to toggle featured status. Please try again.',
    })
    return
  }

  if (loadingStates.value.featuring.has(photo.id)) {
    return
  }

  loadingStates.value.featuring.add(photo.id)
  try {
    await selectionsApi.toggleFeatured(photo.id)
    await fetch()
    toast.success(
      photo.isFeatured || photo.is_featured
        ? 'Removed from featured list'
        : 'Added to featured list'
    )
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to toggle featured status')
    toast.error('Failed to toggle featured status', {
      description: errorMessage,
    })
  } finally {
    loadingStates.value.featuring.delete(photo.id)
  }
}

const handleDeletePhoto = photo => {
  if (!photo?.id) {
    toast.error('Media not found', {
      description: 'Unable to delete media. Please try again.',
    })
    return
  }

  if (loadingStates.value.deleting.has(photo.id)) {
    return
  }

  photoToDelete.value = photo
  showDeleteModal.value = true
}

const handleConfirmDelete = async () => {
  if (!photoToDelete.value?.id) {
    return
  }

  const photo = photoToDelete.value
  loadingStates.value.deleting.add(photo.id)
  
  try {
    toast.loading('Deleting media...', {
      id: `delete-media-${photo.id}`,
    })

    // Always use direct delete in My Media view
    await selectionsApi.deleteMediaDirect(photo.id)
    await fetch()

    toast.dismiss(`delete-media-${photo.id}`)
    toast.success('Media deleted', {
      description: 'The media has been deleted successfully.',
    })
    
    showDeleteModal.value = false
    photoToDelete.value = null
  } catch (error) {
    toast.dismiss(`delete-media-${photo.id}`)
    const errorMessage = getErrorMessage(error, 'Failed to delete media')
    toast.error(errorMessage, {
      description: '',
    })
  } finally {
    loadingStates.value.deleting.delete(photo.id)
  }
}

const showPhotoViewer = ref(false)
const selectedPhotoIndex = ref(0)
const showMediaDetailSidebar = ref(false)
const selectedMediaForDetails = ref(null)
const showDeleteModal = ref(false)
const photoToDelete = ref(null)

const deleteWarningMessage = computed(() => {
  if (!photoToDelete.value) return null
  
  const mediaSet = photoToDelete.value.mediaSet
  if (!mediaSet) {
    return null
  }

  const phaseInfo = []
  let phaseType = null
  let phaseName = null
  
  if (mediaSet.proofing || mediaSet.proof_uuid) {
    phaseName = mediaSet.proofing?.name || 'Unknown'
    phaseType = 'Proofing'
    phaseInfo.push(`Proofing: ${phaseName}`)
  } else if (mediaSet.selection || mediaSet.selection_uuid) {
    phaseName = mediaSet.selection?.name || 'Unknown'
    phaseType = 'Selection'
    phaseInfo.push(`Selection: ${phaseName}`)
  } else if (mediaSet.collection || mediaSet.collection_uuid) {
    phaseName = mediaSet.collection?.name || 'Unknown'
    phaseType = 'Collection'
    phaseInfo.push(`Collection: ${phaseName}`)
  }

  const setName = mediaSet.name || 'Unknown'
  
  if (phaseInfo.length > 0) {
    return `Phase: ${phaseType} - ${phaseName}\nSet: ${setName}`
  }

  return `Set: ${setName}`
})

const deleteDescription = computed(() => {
  if (!photoToDelete.value) return 'This action cannot be undone.'
  
  const mediaSet = photoToDelete.value.mediaSet
  if (!mediaSet) {
    return 'This media is not part of any phase or set. It will be permanently deleted. This action cannot be undone.'
  }

  const hasPhase = mediaSet.proofing || mediaSet.proof_uuid || 
                   mediaSet.selection || mediaSet.selection_uuid || 
                   mediaSet.collection || mediaSet.collection_uuid

  if (hasPhase) {
    return 'It will be removed from the phase/set and then permanently deleted. This action cannot be undone.'
  }

  return 'It will be removed from the set and then permanently deleted. This action cannot be undone.'
})

const handlePhotoClick = photo => {
  const index = sortedPhotos.value.findIndex(p => p.id === photo.id)
  if (index !== -1) {
    selectedPhotoIndex.value = index
    showPhotoViewer.value = true
  }
}

const handleViewDetails = photo => {
  selectedMediaForDetails.value = photo
  showMediaDetailSidebar.value = true
}

const handleDownloadPhoto = async photo => {
  if (!photo?.id) {
    toast.error('Media not found', {
      description: 'Unable to download media. Please try again.',
    })
    return
  }

  if (loadingStates.value.downloading.has(photo.id)) {
    return
  }

  loadingStates.value.downloading.add(photo.id)
  try {
    toast.loading('Preparing download...', {
      id: `download-media-${photo.id}`,
    })

    const { blob, filename } = await selectionsApi.downloadMedia(photo.id)

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.dismiss(`download-media-${photo.id}`)
    toast.success('Download started', {
      description: `Downloading ${filename}`,
    })
  } catch (error) {
    toast.dismiss(`download-media-${photo.id}`)
    const errorMessage = getErrorMessage(error, 'Failed to download media')
    toast.error('Download failed', {
      description: errorMessage,
    })
  } finally {
    loadingStates.value.downloading.delete(photo.id)
  }
}

const handleCopyFilenames = async photo => {
  try {
    const filename = photo.name || photo.filename || 'untitled.jpg'
    await navigator.clipboard.writeText(filename)
    toast.success('Filename copied', {
      description: `Copied ${filename} to clipboard`,
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description: error.message || 'Could not copy to clipboard',
    })
  }
}

const handleBrowsePhotos = () => {
  router.push({ name: 'manageCollections' })
}

const handlePageChange = page => {
  goToPage(page)
}

const handlePageSizeChange = async newSize => {
  await setPerPage(newSize)
}

const handleSearch = async () => {
  if (!searchQuery.value || !searchQuery.value.trim()) {
    handleClearSearch()
    return
  }
  isSearching.value = true
  await resetToFirstPage()
  isSearching.value = false
}

const handleClearSearch = async () => {
  searchQuery.value = ''
  await resetToFirstPage()
}

const formatDate = date => {
  if (!date) return 'Unknown date'
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const handleImageError = event => {
  event.target.src = '/placeholder-image.png'
}

onMounted(async () => {
  await fetch()
})

onUnmounted(() => {
  cleanupProtection()
})
</script>
