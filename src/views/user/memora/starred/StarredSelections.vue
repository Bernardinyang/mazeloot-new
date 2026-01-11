<template>
  <DashboardLayout>
    <template #breadcrumb> Starred Selections </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        :is-searching="isSearching"
        title="Starred Selections"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        sort-label="Sort selections by"
        @clear="handleClearSearch"
        @search="handleSearch"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      />

      <!-- Loading State -->
      <LoadingState v-if="isLoading" message="Loading starred selections..." />

      <!-- Empty State -->
      <EmptyState
        v-else-if="sortedSelections.length === 0"
        message="No starred selections found"
        description="Star selections to quickly access them from this page."
        action-label="Browse Selections"
        :icon="CheckSquare"
        action-icon="ArrowRight"
        @action="handleBrowseSelections"
      />

      <!-- Selections Grid View -->
      <div v-else-if="viewMode === 'grid'">
        <TransitionGroup
          name="list"
          tag="div"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative"
        >
          <SelectionCard
            v-for="(selection, index) in sortedSelections"
            :key="selection.id"
            :selection="selection"
            :index="index"
            @click="handleSelectionClick"
            @star-click="toggleStar"
            @edit="handleEditSelection"
            @delete="handleDeleteSelection"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <!-- Selections List View -->
      <SelectionsTable
        v-else
        :items="sortedSelections"
        :loading="isLoading"
        :selected-items="selectedSelections"
        empty-message="No starred selections found"
        empty-action-label="Browse Selections"
        :empty-icon="CheckSquare"
        :get-subtitle="getSubtitle"
        :get-icon="() => CheckSquare"
        :get-status="item => item.status"
        :show-view-details="true"
        @select="handleSelectSelection"
        @star-click="toggleStar"
        @item-click="handleSelectionClick"
        @empty-action="handleBrowseSelections"
        @edit="handleEditSelection"
        @delete="handleDeleteSelection"
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

    <!-- Selection Detail Sidebar -->
    <SelectionDetailSidebar v-model="showDetailSidebar" :selection-id="selectedSelectionId" />

    <!-- Edit Selection Dialog -->
    <EditSelectionDialog
      v-model:open="showEditDialog"
      :selection="selectionToEdit"
      @success="handleEditSuccess"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :is-deleting="isDeleting"
      :item-name="getItemName()"
      title="Delete Selection"
      :description="deleteModalDescription"
      :warning-message="getDeleteModalWarning()"
      @cancel="showDeleteModal = false"
      @confirm="handleConfirmDelete"
    />
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { CheckSquare, ArrowRight } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import SelectionCard from '@/components/molecules/SelectionCard.vue'
import SelectionsTable from '@/components/organisms/SelectionsTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import LoadingState from '@/components/molecules/LoadingState.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import EditSelectionDialog from '@/components/organisms/EditSelectionDialog.vue'
import SelectionDetailSidebar from '@/components/organisms/SelectionDetailSidebar.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import { useSelectionStore } from '@/stores/selection.js'
import { useRouter } from 'vue-router'
import { useAsyncPagination } from '@/composables/useAsyncPagination.js'

const router = useRouter()
const viewMode = ref('grid')
const sortBy = ref('created-new-old')
const searchQuery = ref('')
const isSearching = ref(false)
const selectedSelections = ref([])
const showDetailSidebar = ref(false)
const selectedSelectionId = ref(null)
const showEditDialog = ref(false)
const showDeleteModal = ref(false)
const selectionToEdit = ref(null)
const itemToDelete = ref(null)
const isDeleting = ref(false)
const activeSelection = ref(null)

const sortOptions = [
  { label: 'Created (New → Old)', value: 'created-new-old' },
  { label: 'Created (Old → New)', value: 'created-old-new' },
  { label: 'Name (A → Z)', value: 'name-a-z' },
  { label: 'Name (Z → A)', value: 'name-z-a' },
  { label: 'Status', value: 'status' },
]

const selectionStore = useSelectionStore()

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
const fetchStarredSelections = async params => {
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

  return await selectionStore.fetchAllSelections(fetchParams)
}

// Use async pagination composable
const {
  data: sortedSelections,
  pagination,
  isLoading,
  fetch,
  goToPage,
  resetToFirstPage,
  setPerPage,
} = useAsyncPagination(fetchStarredSelections, {
  initialPage: 1,
  initialPerPage: 10,
  autoFetch: false, // We'll call fetch manually in onMounted
  watchForReset: [sortBy], // Reset to page 1 when sort changes (search only on button click)
})

const getSubtitle = selection => {
  const parts = []
  if (selection.mediaCount !== undefined) {
    parts.push(`${selection.mediaCount} media`)
  }
  if (selection.selectedMediaCount !== undefined && selection.selectedMediaCount > 0) {
    parts.push(`${selection.selectedMediaCount} selected`)
  }
  const status = selection.status || 'draft'
  parts.push(status)
  const date = selection.createdAt
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

const handleSelectionClick = selection => {
  if (selection && selection.id) {
    router.push({ name: 'selectionDetail', params: { id: selection.id } })
  }
}

const toggleStar = async selection => {
  if (!selection || !selection.id) return
  
  try {
    await selectionStore.toggleStarSelection(selection.id)
    const index = sortedSelections.value.findIndex(s => s.id === selection.id || s.id === String(selection.id))
    
    if (index !== -1) {
      // API doesn't return starred state, so toggle it manually
      const currentStarred = sortedSelections.value[index].isStarred || sortedSelections.value[index].starred || false
      const newStarredState = !currentStarred
      
      // If unstarred in starred view, remove from list
      if (!newStarredState) {
        sortedSelections.value.splice(index, 1)
        if (pagination.value && pagination.value.total > 0) {
          pagination.value.total -= 1
        }
      } else {
        // Update the item state
        sortedSelections.value[index] = {
          ...sortedSelections.value[index],
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

const handleEditSelection = selection => {
  if (selection && selection.id) {
    activeSelection.value = selection
    selectionToEdit.value = selection
    showEditDialog.value = true
  }
}

const handleEditSuccess = async () => {
  activeSelection.value = null
  selectionToEdit.value = null
  showEditDialog.value = false
  await fetch()
}

const handleDeleteSelection = selection => {
  if (selection && selection.id) {
    activeSelection.value = selection
    itemToDelete.value = selection
    showDeleteModal.value = true
  }
}

const handleConfirmDelete = async () => {
  isDeleting.value = true
  try {
    const deleted = await selectionStore.deleteSelection(activeSelection.value.id)
    if (deleted) {
      activeSelection.value = null
      itemToDelete.value = null
      showDeleteModal.value = false
      await fetch()
    }
  } catch (error) {
  } finally {
    isDeleting.value = false
  }
}

const handleSelectSelection = () => {
  // UI only - no functionality
}

const handleViewDetails = selection => {
  selectedSelectionId.value = selection?.id || selection?.uuid || null
  showDetailSidebar.value = true
}

const handleBrowseSelections = () => {
  router.push({ name: 'selections' })
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
  return 'This selection and all its media will be permanently removed.\n\nThis action cannot be undone.'
})

const getDeleteModalWarning = () => {
  const selection = activeSelection.value || itemToDelete.value
  if (!selection) return null
  
  const locationParts = []
  
  // Add project information if available
  if (selection.project?.name) {
    locationParts.push(`Project: ${selection.project.name}`)
    
    // Add phase name if available, otherwise default to "Selections"
    const phaseName = selection.project.selection?.name || 'Selections'
    locationParts.push(`Phase: ${phaseName}`)
  } else if (selection.projectId) {
    locationParts.push(`Project: ${selection.projectId}`)
    locationParts.push('Phase: Selections')
  }
  
  // If no location info, don't show the Media Location section
  if (locationParts.length === 0) {
    return null
  }
  
  return locationParts.join('\n')
}

const getItemName = () => {
  return activeSelection.value?.name || itemToDelete.value?.name || 'Selection'
}

// Note: watchForReset in useAsyncPagination handles resetting to page 1 when sortBy changes (search only on button click)

// Initial load
onMounted(async () => {
  await fetch()
})
</script>
