<template>
  <DashboardLayout>
    <template #breadcrumb> Featured Media</template>
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
        title="Featured Media"
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
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <div
            v-for="i in 20"
            :key="i"
            :class="theme.bgSkeleton"
            class="aspect-square rounded-lg overflow-hidden animate-pulse"
          />
        </div>

        <!-- Empty State -->
        <div v-else-if="sortedPhotos.length === 0" class="flex items-center justify-center py-16">
          <EmptyState
            :icon="Image"
            action-label="Browse Photos"
            message="No featured photos found"
            @action="handleBrowsePhotos"
          />
        </div>

        <!-- Photos Grid -->
        <TransitionGroup
          v-else
          :class="[
            'grid gap-4',
            gridSize === 'small'
              ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
              : gridSize === 'medium'
                ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          ]"
          name="media-grid"
          tag="div"
        >
          <MediaGridItemCard
            v-for="photo in sortedPhotos"
            :key="photo.id"
            :is-selected="false"
            :item="photo"
            :placeholder-image="placeholderImage"
            :selection-status="null"
            :show-filename="showFilename"
            :show-management-actions="false"
            :show-selection-checkbox="false"
            :was-selected-on-completion="false"
            @copy-filenames="handleCopyFilenames(photo)"
            @download="handleDownloadPhoto(photo)"
            @image-error="handleImageError"
            @open="handlePhotoClick(photo)"
            @open-viewer="handlePhotoClick(photo)"
            @toggle-featured="toggleFeatured(photo)"
            @view-details="handleViewDetails(photo)"
          />
        </TransitionGroup>
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
            message="No featured photos found"
            @action="handleBrowsePhotos"
          />
        </div>

        <!-- Photos List -->
        <TransitionGroup v-else class="space-y-2" name="media-list" tag="div">
          <MediaListItemRow
            v-for="photo in sortedPhotos"
            :key="photo.id"
            :is-selected="false"
            :item="photo"
            :placeholder-image="placeholderImage"
            :selection-status="null"
            :show-filename="showFilename"
            :show-management-actions="true"
            :show-selection-checkbox="false"
            :subtitle="`${photo.mediaSet?.name || photo.collection?.name || 'No set'} • ${formatDate(photo.createdAt || photo.featured_at)}`"
            :was-selected-on-completion="false"
            @copy-filenames="handleCopyFilenames(photo)"
            @download="handleDownloadPhoto(photo)"
            @image-error="handleImageError"
            @open="handlePhotoClick(photo)"
            @open-viewer="handlePhotoClick(photo)"
            @toggle-featured="toggleFeatured(photo)"
            @view-details="handleViewDetails(photo)"
          />
        </TransitionGroup>
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
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Grid3x3, Image, Check, List } from 'lucide-vue-next'
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
import { toast } from '@/utils/toast'
import { apiClient } from '@/api/client'
import { useAsyncPagination } from '@/composables/useAsyncPagination'

const router = useRouter()
const theme = useThemeClasses()

// Placeholder image
const placeholderImage = '/placeholder-image.png'

// View mode and sorting
const viewMode = ref('grid')
const sortBy = ref('date-new-old')
const searchQuery = ref('')
const isSearching = ref(false)
const sortOptions = PHOTO_SORT_OPTIONS

// Grid size
const gridSize = ref(storage.get('mazeloot_featured_grid_size') || 'medium')
const gridSizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
]
watch(gridSize, () => {
  storage.set('mazeloot_featured_grid_size', gridSize.value)
})

// Show filename toggle
const showFilename = ref(storage.get('mazeloot_featured_show_filename') ?? false)
watch(showFilename, () => {
  storage.set('mazeloot_featured_show_filename', showFilename.value)
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
    'date-new-old': 'featured_at-desc',
    'date-old-new': 'featured_at-asc',
    'name-a-z': 'name-asc',
    'name-z-a': 'name-desc',
  }
  return mapping[frontendSort] || 'featured_at-desc'
}

// Fetch function for pagination
const fetchFeaturedMedia = async params => {
  const queryParams = new URLSearchParams()

  if (params.sortBy) {
    queryParams.append('sort_by', params.sortBy)
  }

  if (params.page) {
    queryParams.append('page', params.page.toString())
  }

  if (params.perPage) {
    queryParams.append('per_page', params.perPage.toString())
  }

  const endpoint = `/v1/memora/media/featured${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  const response = await apiClient.get(endpoint)

  return response.data
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
} = useAsyncPagination(fetchFeaturedMedia, {
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
      (photo.filename || photo.file?.filename || '').toLowerCase().includes(query) ||
      (photo.mediaSet?.name || photo.collection?.name || '').toLowerCase().includes(query)
  )
})

const { sortedItems: sortedPhotos } = useCollectionSort(
  computed(() => filteredPhotos.value),
  sortBy
)

const toggleFeatured = async photo => {
  try {
    const mediaId = photo.id || photo.uuid
    if (!mediaId) {
      toast.error('Invalid media item')
      return
    }

    const mediaItem = sortedPhotos.value.find(p => p.id === mediaId)
    const isCurrentlyFeatured = mediaItem?.isFeatured || mediaItem?.is_featured || false

    toast.loading(isCurrentlyFeatured ? 'Removing from featured list...' : 'Adding to featured list...', {
      id: 'toggle-featured',
    })

    const response = await apiClient.post(`/v1/memora/media/${mediaId}/toggle-featured`)
    const updatedMedia = response.data?.data || response.data

    // Reload featured media after toggling
    await fetch()
    
    toast.success(updatedMedia.is_featured ? 'Added to featured list' : 'Removed from featured list', {
      id: 'toggle-featured',
    })
  } catch (error) {
    toast.error('Failed to update featured status', {
      description: error?.response?.data?.message || error?.message || 'An unknown error occurred',
      id: 'toggle-featured',
    })
  }
}

const showPhotoViewer = ref(false)
const selectedPhotoIndex = ref(0)
const showMediaDetailSidebar = ref(false)
const selectedMediaForDetails = ref(null)

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
  if (!photo?.id && !photo?.uuid) {
    toast.error('Media not found', {
      description: 'Unable to download media. Please try again.',
    })
    return
  }

  try {
    toast.loading('Preparing download...', {
      id: 'download-media',
    })

    const mediaId = photo.id || photo.uuid
    const collectionId = photo.collectionId || photo.collection?.id || photo.collection?.uuid
    
    let downloadUrl
    if (collectionId) {
      downloadUrl = `/v1/memora/collections/${collectionId}/media/${mediaId}/download`
    } else {
      downloadUrl = `/v1/memora/media/${mediaId}/download`
    }

    const url = downloadUrl.startsWith('http') ? downloadUrl : `${import.meta.env.VITE_API_BASE_URL || ''}${downloadUrl}`
    const authHeader = apiClient.getAuthHeader?.() || `Bearer ${localStorage.getItem('auth_token')}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: authHeader || '',
      },
    })

    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`)
    }

    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = `media-${mediaId}`
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
        try {
          filename = decodeURIComponent(filename)
        } catch {
          // Keep original if decode fails
        }
      }
    }

    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)

    toast.dismiss('download-media')
    toast.success('Download started', {
      description: `Downloading ${filename}`,
    })
  } catch (error) {
    toast.dismiss('download-media')
    toast.error('Download failed', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const handleCopyFilenames = async photo => {
  try {
    const filename = photo.filename || photo.file?.filename || photo.name || 'untitled.jpg'
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
</script>

