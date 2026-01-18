<template>
  <DashboardLayout>
    <template #breadcrumb> Starred RawFiles </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        :is-searching="isSearching"
        title="Starred RawFiles"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        sort-label="Sort rawFiles by"
        @clear="handleClearSearch"
        @search="handleSearch"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      />

      <!-- Loading State -->
      <LoadingState v-if="isLoading" message="Loading starred rawFiles..." />

      <!-- Empty State -->
      <EmptyState
        v-else-if="sortedRawFiles.length === 0"
        message="No starred rawFiles found"
        description="Star rawFiles to quickly access them from this page."
        action-label="Browse RawFiles"
        :icon="CheckSquare"
        action-icon="ArrowRight"
        @action="handleBrowseRawFiles"
      />

      <!-- RawFiles Grid View -->
      <div v-else-if="viewMode === 'grid'">
        <TransitionGroup
          name="list"
          tag="div"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative"
        >
          <RawFileCard
            v-for="(rawFile, index) in sortedRawFiles"
            :key="rawFile.id"
            :rawFile="rawFile"
            :index="index"
            @click="handleRawFileClick"
            @star-click="toggleStar"
            @edit="handleEditRawFile"
            @delete="handleDeleteRawFile"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <!-- RawFiles List View -->
      <RawFilesTable
        v-else
        :items="sortedRawFiles"
        :loading="isLoading"
        :selected-items="selectedRawFiles"
        empty-message="No starred rawFiles found"
        empty-action-label="Browse RawFiles"
        :empty-icon="CheckSquare"
        :get-subtitle="getSubtitle"
        :get-icon="() => CheckSquare"
        :get-status="item => item.status"
        :show-view-details="true"
        @select="handleSelectRawFile"
        @star-click="toggleStar"
        @item-click="handleRawFileClick"
        @empty-action="handleBrowseRawFiles"
        @edit="handleEditRawFile"
        @delete="handleDeleteRawFile"
        @view-details="handleViewDetails"
      />

      <!-- Pagination -->
      <Pagination
        v-if="pagination.totalPages > 1 || pagination.total > 0"
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
        :limit="pagination.limit"
        :show-page-size="true"
        :show-go-to-page="true"
        :show-first-last="true"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>

    <!-- RawFile Detail Sidebar -->
    <RawFileDetailSidebar v-model="showDetailSidebar" :rawFile-id="selectedRawFileId" />

    <!-- Edit RawFile Dialog -->
    <EditRawFileDialog
      v-model:open="showEditDialog"
      :rawFile="rawFileToEdit"
      @success="handleEditSuccess"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :is-deleting="isDeleting"
      :item-name="getItemName()"
      title="Delete RawFile"
      :description="deleteModalDescription"
      :warning-message="getDeleteModalWarning()"
      @cancel="showDeleteModal = false"
      @confirm="handleConfirmDelete"
    />
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { CheckSquare, ArrowRight } from '@/shared/utils/lucideAnimated'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import PageHeader from '@/shared/components/molecules/PageHeader.vue'
import RawFileCard from '@/shared/components/molecules/RawFileCard.vue'
import RawFilesTable from '@/domains/memora/components/organisms/RawFilesTable.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import LoadingState from '@/shared/components/molecules/LoadingState.vue'
import DeleteConfirmationModal from '@/shared/components/organisms/DeleteConfirmationModal.vue'
import EditRawFileDialog from '@/domains/memora/components/organisms/EditRawFileDialog.vue'
import RawFileDetailSidebar from '@/domains/memora/components/organisms/RawFileDetailSidebar.vue'
import Pagination from '@/shared/components/molecules/Pagination.vue'
import { useRawFileStore } from '@/domains/memora/stores/rawFile.js'
import { useRouter } from 'vue-router'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination.js'

const router = useRouter()
const viewMode = ref('grid')
const sortBy = ref('created-new-old')
const searchQuery = ref('')
const isSearching = ref(false)
const selectedRawFiles = ref([])
const showDetailSidebar = ref(false)
const selectedRawFileId = ref(null)
const showEditDialog = ref(false)
const showDeleteModal = ref(false)
const rawFileToEdit = ref(null)
const itemToDelete = ref(null)
const isDeleting = ref(false)
const activeRawFile = ref(null)

const sortOptions = [
  { label: 'Created (New → Old)', value: 'created-new-old' },
  { label: 'Created (Old → New)', value: 'created-old-new' },
  { label: 'Name (A → Z)', value: 'name-a-z' },
  { label: 'Name (Z → A)', value: 'name-z-a' },
  { label: 'Status', value: 'status' },
]

const rawFileStore = useRawFileStore()

/**
 * Map frontend sort values to backend sort values
 */
const mapSortToBackend = frontendSort => {
  const mapping = {
    'created-new-old': 'created-desc',
    'created-old-new': 'created-asc',
    'name-a-z': 'name-asc',
    'name-z-a': 'name-desc',
    status: 'status-asc',
  }
  return mapping[frontendSort] || 'created-desc'
}

/**
 * Fetch function for pagination
 */
const fetchStarredRawFiles = async params => {
  const fetchParams = {
    starred: true, // Always filter by starred
    ...params,
  }

  // Add search parameter
  if (searchQuery.value && searchQuery.value.trim()) {
    fetchParams.search = searchQuery.value.trim()
  }

  // Add sort parameter
  if (sortBy.value) {
    fetchParams.sortBy = mapSortToBackend(sortBy.value)
  }

  return await rawFileStore.fetchAllRawFiles(fetchParams)
}

// Use async pagination composable
const {
  data: sortedRawFiles,
  pagination,
  isLoading,
  fetch,
  goToPage,
  resetToFirstPage,
  setPerPage,
} = useAsyncPagination(fetchStarredRawFiles, {
  initialPage: 1,
  initialPerPage: 10,
  autoFetch: false, // We'll call fetch manually in onMounted
  watchForReset: [sortBy], // Reset to page 1 when sort changes (search only on button click)
})

const getSubtitle = rawFile => {
  const parts = []
  if (rawFile.mediaCount !== undefined) {
    parts.push(`${rawFile.mediaCount} media`)
  }
  if (rawFile.selectedMediaCount !== undefined && rawFile.selectedMediaCount > 0) {
    parts.push(`${rawFile.selectedMediaCount} selected`)
  }
  const status = rawFile.status || 'draft'
  parts.push(status)
  const date = rawFile.createdAt
  if (date) {
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    parts.push(formattedDate)
  }
  return parts.join(' • ')
}

const handleRawFileClick = rawFile => {
  if (rawFile && rawFile.id) {
    router.push({ name: 'rawFileDetail', params: { id: rawFile.id } })
  }
}

const toggleStar = async rawFile => {
  if (!rawFile || !rawFile.id) return
  
  try {
    await rawFileStore.toggleStarRawFile(rawFile.id)
    const index = sortedRawFiles.value.findIndex(s => s.id === rawFile.id || s.id === String(rawFile.id))
    
    if (index !== -1) {
      // API doesn't return starred state, so toggle it manually
      const currentStarred = sortedRawFiles.value[index].isStarred || sortedRawFiles.value[index].starred || false
      const newStarredState = !currentStarred
      
      // If unstarred in starred view, remove from list
      if (!newStarredState) {
        sortedRawFiles.value.splice(index, 1)
        if (pagination.value && pagination.value.total > 0) {
          pagination.value.total -= 1
        }
      } else {
        // Update the item state
        sortedRawFiles.value[index] = {
          ...sortedRawFiles.value[index],
          isStarred: newStarredState,
          starred: newStarredState,
        }
      }
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update star status.',
    })
  }
}

const handleEditRawFile = rawFile => {
  if (rawFile && rawFile.id) {
    activeRawFile.value = rawFile
    rawFileToEdit.value = rawFile
    showEditDialog.value = true
  }
}

const handleEditSuccess = async () => {
  activeRawFile.value = null
  rawFileToEdit.value = null
  showEditDialog.value = false
  await fetch()
}

const handleDeleteRawFile = rawFile => {
  if (rawFile && rawFile.id) {
    activeRawFile.value = rawFile
    itemToDelete.value = rawFile
    showDeleteModal.value = true
  }
}

const handleConfirmDelete = async () => {
  isDeleting.value = true
  try {
    const deleted = await rawFileStore.deleteRawFile(activeRawFile.value.id)
    if (deleted) {
      activeRawFile.value = null
      itemToDelete.value = null
      showDeleteModal.value = false
      await fetch()
    }
  } catch (error) {
  } finally {
    isDeleting.value = false
  }
}

const handleSelectRawFile = () => {
  // UI only - no functionality
}

const handleViewDetails = rawFile => {
  selectedRawFileId.value = rawFile?.id || rawFile?.uuid || null
  showDetailSidebar.value = true
}

const handleBrowseRawFiles = () => {
  router.push({ name: 'rawFiles' })
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

const deleteModalDescription = computed(() => {
  return 'This rawFile and all its media will be permanently removed.\n\nThis action cannot be undone.'
})

const getDeleteModalWarning = () => {
  const rawFile = activeRawFile.value || itemToDelete.value
  if (!rawFile) return null
  
  const locationParts = []
  
  // Add project information if available
  if (rawFile.project?.name) {
    locationParts.push(`Project: ${rawFile.project.name}`)
    
    // Add phase name if available, otherwise default to "RawFiles"
    const phaseName = rawFile.project.rawFile?.name || 'RawFiles'
    locationParts.push(`Phase: ${phaseName}`)
  } else if (rawFile.projectId) {
    locationParts.push(`Project: ${rawFile.projectId}`)
    locationParts.push('Phase: RawFiles')
  }
  
  // If no location info, don't show the Media Location section
  if (locationParts.length === 0) {
    return null
  }
  
  return locationParts.join('\n')
}

const getItemName = () => {
  return activeRawFile.value?.name || itemToDelete.value?.name || 'RawFile'
}

// Note: watchForReset in useAsyncPagination handles resetting to page 1 when sortBy changes (search only on button click)

// Initial load
onMounted(async () => {
  await fetch()
})
</script>
