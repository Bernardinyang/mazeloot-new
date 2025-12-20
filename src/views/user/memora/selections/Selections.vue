<template>
  <DashboardLayout>
    <template #breadcrumb> Selections</template>
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
        sort-label="Sort selections by"
        title="Selections"
        @clear="handleClearSearch"
        @search="handleSearch"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      >
        <template #actions>
          <Button
            :class="['bg-teal-500 hover:bg-teal-600 text-white']"
            @click="handleCreateSelection"
          >
            New Selection
          </Button>
        </template>
      </PageHeader>

      <!-- Selections Grid View -->
      <div v-if="viewMode === 'grid'">
        <!-- Loading State -->
        <LoadingState v-if="isLoading" message="Loading selections..." />

        <!-- Empty State -->
        <EmptyState
          v-else-if="selections.length === 0"
          :icon="CheckSquare"
          action-icon="Plus"
          action-label="Create New Selection"
          description="Get started by creating your first selection to organize and manage your media."
          message="No selections found"
          @action="handleCreateSelection"
        />

        <!-- Selections Grid -->
        <TransitionGroup
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative"
          name="list"
          tag="div"
        >
          <SelectionCard
            v-for="(selection, index) in selections"
            :key="selection.id"
            :index="index"
            :selection="selection"
            @click="handleSelectionClick"
            @delete="handleDeleteSelection"
            @edit="handleEditSelection"
            @star-click="toggleStar"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <!-- Selections List View -->
      <SelectionsTable
        v-else
        :empty-icon="CheckSquare"
        :get-icon="() => CheckSquare"
        :get-status="item => item.status"
        :get-subtitle="getSubtitle"
        :items="selections"
        :loading="isLoading"
        :selected-items="selectedSelections"
        :show-view-details="true"
        empty-action-label="Create New Selection"
        empty-message="No selections found"
        @delete="handleDeleteSelection"
        @edit="handleEditSelection"
        @select="handleSelectSelection"
        @star-click="toggleStar"
        @item-click="handleSelectionClick"
        @empty-action="handleCreateSelection"
        @view-details="handleViewDetails"
      />

      <!-- Pagination -->
      <Pagination
        v-if="pagination.totalPages > 1 || pagination.total > 0"
        :current-page="pagination.page"
        :limit="pagination.limit"
        :show-first-last="true"
        :show-go-to-page="true"
        :show-page-size="true"
        :total="pagination.total"
        :total-pages="pagination.totalPages"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>

    <!-- Selection Detail Sidebar -->
    <SelectionDetailSidebar v-model="showDetailSidebar" :selection-id="selectedSelectionId" />

    <!-- Create Selection Dialog -->
    <CreateSelectionDialog v-model:open="showCreateDialog" @success="handleCreateSuccess" />

    <!-- Edit Selection Dialog -->
    <EditSelectionDialog
      v-model:open="showEditDialog"
      :selection="activeSelection"
      @success="handleEditSuccess"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :is-deleting="isDeleting"
      :item-name="getItemName()"
      description="This action cannot be undone."
      title="Delete Selection"
      warning-message="This selection and all its media will be permanently removed."
      @cancel="showDeleteModal = false"
      @confirm="handleConfirmDelete"
    />
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { CheckSquare } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import LoadingState from '@/components/molecules/LoadingState.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import SelectionCard from '@/components/molecules/SelectionCard.vue'
import SelectionsTable from '@/components/organisms/SelectionsTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import SelectionDetailSidebar from '@/components/organisms/SelectionDetailSidebar.vue'
import CreateSelectionDialog from '@/components/organisms/CreateSelectionDialog.vue'
import EditSelectionDialog from '@/components/organisms/EditSelectionDialog.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import { useSelectionStore } from '@/stores/selection.js'
import { useAsyncPagination } from '@/composables/useAsyncPagination.js'

const selectionStore = useSelectionStore()
const viewMode = computed({
  get: () => selectionStore.viewMode,
  set: value => selectionStore.setViewMode(value),
})
const sortBy = ref('created-new-old')
const searchQuery = ref('')
const isSearching = ref(false)
const selectedSelections = ref([])
const showDetailSidebar = ref(false)
const selectedSelectionId = ref(null)
const showCreateDialog = ref(false)
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
const fetchSelections = async params => {
  const fetchParams = { ...params }

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
  data: selections,
  pagination,
  isLoading,
  fetch,
  goToPage,
  resetToFirstPage,
  setPerPage,
} = useAsyncPagination(fetchSelections, {
  initialPage: 1,
  initialPerPage: 5,
  autoFetch: false, // We'll call fetch manually in onMounted
  watchForReset: [sortBy, searchQuery], // Reset to page 1 when these change
})

const getSubtitle = selection => {
  const parts = []
  if (selection.mediaCount !== undefined) {
    parts.push(`${selection.mediaCount} media`)
  }
  const status = selection.status || 'draft'
  parts.push(status)
  return parts.join(' • ')
}

const handleCreateSelection = () => {
  showCreateDialog.value = true
}

const handleCreateSuccess = async () => {
  showCreateDialog.value = false
  await resetToFirstPage()
}

const handleSelectionClick = () => {
  // UI only - no navigation
}

const toggleStar = async selection => {
  if (selection && selection.id) {
    await selectionStore.toggleStarSelection(selection.id)
    await fetch()
  }
}

const handleEditSelection = selection => {
  if (selection && selection.id) {
    activeSelection.value = selection
    showEditDialog.value = true
  }
}

const handleEditSuccess = async () => {
  activeSelection.value = null
  showEditDialog.value = false
  await fetch()
}

const handleDeleteSelection = selection => {
  if (selection && selection.id) {
    activeSelection.value = selection
    showDeleteModal.value = true
  }
}

const handleConfirmDelete = async () => {
  isDeleting.value = true
  try {
    const deleted = await selectionStore.deleteSelection(activeSelection.value.id)
    if (deleted) {
      activeSelection.value = null
      showDeleteModal.value = false
      await fetch()
    }
  } catch (error) {
    console.error('Failed to delete selection:', error)
  } finally {
    isDeleting.value = false
  }
}

const handleViewDetails = selection => {
  selectedSelectionId.value = selection?.id || selection?.uuid || null
  showDetailSidebar.value = true
}

const handleSelectSelection = () => {
  // UI only - no functionality
}

const getItemName = () => {
  return activeSelection.value?.name || 'Selection'
}

const handlePageChange = page => {
  goToPage(page)
}

const handlePageSizeChange = async newSize => {
  await setPerPage(newSize)
}

// Note: watchForReset in useAsyncPagination handles resetting to page 1 when sortBy or searchQuery changes

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

// Initial load
onMounted(async () => {
  await fetch()
})
</script>
