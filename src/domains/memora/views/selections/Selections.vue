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
            variant="accent"
            :icon="Plus"
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
          :action-icon="Plus"
          action-label="Create New Selection"
          description="Get started by creating your first selection to organize and manage your media."
          message="No selections found"
          @action="handleCreateSelection"
        />

        <!-- Selections Grid -->
        <TransitionGroup
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 relative"
          name="list"
          tag="div"
        >
          <SelectionCard
            v-for="(selection, index) in selections"
            :key="selection.id"
            :index="index"
            :selection="selection"
            :is-starring="starringSelectionIds.has(String(selection.id))"
            :is-deleting="deletingSelectionIds.has(String(selection.id))"
            :is-duplicating="duplicatingSelectionIds.has(String(selection.id))"
            @click="handleSelectionClick"
            @delete="handleDeleteSelection"
            @duplicate="handleDuplicateSelection"
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
        @toggle-password="handleTogglePassword"
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
      :description="deleteModalDescription"
      title="Delete Selection"
      :warning-message="getDeleteModalWarning()"
      @cancel="showDeleteModal = false"
      @confirm="handleConfirmDelete"
    />

    <!-- Duplicate Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDuplicateModal"
      :item-name="getDuplicateItemName()"
      fallback-name="this selection"
      title="Duplicate Selection"
      question="Are you sure you want to duplicate"
      description="This will create a copy of the selection with all its settings, media sets, and media."
      confirm-label="Duplicate"
      loading-label="Duplicating..."
      :is-deleting="isDuplicating"
      @confirm="handleConfirmDuplicate"
      @cancel="handleCancelDuplicate"
    />
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { CheckSquare, Plus } from 'lucide-vue-next'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import LoadingState from '@/shared/components/molecules/LoadingState.vue'
import PageHeader from '@/shared/components/molecules/PageHeader.vue'
import SelectionCard from '@/shared/components/molecules/SelectionCard.vue'
import SelectionsTable from '@/domains/memora/components/organisms/SelectionsTable.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import SelectionDetailSidebar from '@/domains/memora/components/organisms/SelectionDetailSidebar.vue'
import CreateSelectionDialog from '@/domains/memora/components/organisms/CreateSelectionDialog.vue'
import EditSelectionDialog from '@/domains/memora/components/organisms/EditSelectionDialog.vue'
import DeleteConfirmationModal from '@/shared/components/organisms/DeleteConfirmationModal.vue'
import Pagination from '@/shared/components/molecules/Pagination.vue'
import { useSelectionStore } from '@/domains/memora/stores/selection.js'
import { useSelectionsApi } from '@/domains/memora/api/selections'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination.js'
import { useRouter } from 'vue-router'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { toast } from '@/shared/utils/toast'

const selectionStore = useSelectionStore()
const selectionsApi = useSelectionsApi()
const router = useRouter()
const { handleError } = useErrorHandler()
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
const showDuplicateModal = ref(false)
const isDeleting = ref(false)
const isDuplicating = computed(() => {
  if (!activeSelection.value) return false
  return duplicatingSelectionIds.value.has(String(activeSelection.value.id))
})
const activeSelection = ref(null)

// Loading states per selection
const starringSelectionIds = ref(new Set())
const deletingSelectionIds = ref(new Set())
const duplicatingSelectionIds = ref(new Set())

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
  initialPerPage: 10,
  autoFetch: false, // We'll call fetch manually in onMounted
  watchForReset: [sortBy], // Reset to page 1 when sort changes (search only on button click)
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

const handleSelectionClick = selection => {
  if (selection && selection.id) {
    router.push({ name: 'selectionDetail', params: { id: selection.id } })
  }
}

const toggleStar = async selection => {
  if (!selection || !selection.id) return
  
  const selectionId = String(selection.id)
  if (starringSelectionIds.value.has(selectionId)) return
  
  starringSelectionIds.value.add(selectionId)
  try {
    await selectionStore.toggleStarSelection(selection.id)
    const index = selections.value.findIndex(s => s.id === selection.id)
    if (index !== -1) {
      selections.value[index] = {
        ...selections.value[index],
        isStarred: !selections.value[index].isStarred,
      }
    }
  } catch (error) {
  } finally {
    starringSelectionIds.value.delete(selectionId)
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

const handleDuplicateSelection = selection => {
  if (selection && selection.id) {
    activeSelection.value = selection
    showDuplicateModal.value = true
  }
}

const handleConfirmDelete = async () => {
  if (!activeSelection.value) return
  
  const selectionId = String(activeSelection.value.id)
  isDeleting.value = true
  deletingSelectionIds.value.add(selectionId)
  try {
    const deleted = await selectionStore.deleteSelection(activeSelection.value.id)
    if (deleted) {
      activeSelection.value = null
      showDeleteModal.value = false
      await fetch()
    }
  } catch (error) {
  } finally {
    isDeleting.value = false
    deletingSelectionIds.value.delete(selectionId)
  }
}

const handleConfirmDuplicate = async () => {
  if (!activeSelection.value) return

  const selectionId = String(activeSelection.value.id)
  if (duplicatingSelectionIds.value.has(selectionId)) return
  
  duplicatingSelectionIds.value.add(selectionId)
  try {
    await selectionStore.duplicateSelection(activeSelection.value.id)
    toast.success('Selection duplicated', {
      description: `${activeSelection.value.name || activeSelection.value.title} has been duplicated.`,
    })
    await fetch()
    showDuplicateModal.value = false
    activeSelection.value = null
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to duplicate selection.',
    })
  } finally {
    duplicatingSelectionIds.value.delete(selectionId)
  }
}

const handleCancelDuplicate = () => {
  showDuplicateModal.value = false
  activeSelection.value = null
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

const getDuplicateItemName = () => {
  return activeSelection.value?.name || 'Selection'
}

const deleteModalDescription = computed(() => {
  return 'This selection and all its media will be permanently removed.\n\nThis action cannot be undone.'
})

const getDeleteModalWarning = () => {
  if (!activeSelection.value) return null
  
  const locationParts = []
  
  // Add project information if available
  if (activeSelection.value.project?.name) {
    locationParts.push(`Project: ${activeSelection.value.project.name}`)
    
    // Add phase name if available, otherwise default to "Selections"
    const phaseName = activeSelection.value.project.selection?.name || 'Selections'
    locationParts.push(`Phase: ${phaseName}`)
  } else if (activeSelection.value.projectId) {
    locationParts.push(`Project: ${activeSelection.value.projectId}`)
    locationParts.push('Phase: Selections')
  }
  
  // If no location info, don't show the Media Location section
  // The description already covers this
  if (locationParts.length === 0) {
    return null
  }
  
  return locationParts.join('\n')
}

const handlePageChange = page => {
  goToPage(page)
}

const handlePageSizeChange = async newSize => {
  await setPerPage(newSize)
}

// Note: watchForReset in useAsyncPagination handles resetting to page 1 when sortBy changes (search only on button click)

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

const handleTogglePassword = async (selection, enabled) => {
  if (!selection?.id) return

  const selectionId = String(selection.id)
  try {
    if (enabled) {
      // Generate a password when enabling
      const { generatePassword } = await import('@/shared/utils/generatePassword')
      const newPassword = generatePassword()
      
      await selectionsApi.updateSelection(selection.id, {
        password: newPassword,
      })
      
      // Update local state
      const index = selections.value.findIndex(s => s.id === selection.id)
      if (index !== -1) {
        selections.value[index] = {
          ...selections.value[index],
          hasPassword: true,
          password: newPassword,
        }
      }
      
      toast.success('Password enabled', {
        description: 'Password protection has been enabled for this selection.',
      })
    } else {
      await selectionsApi.updateSelection(selection.id, {
        password: '',
      })
      
      // Update local state
      const index = selections.value.findIndex(s => s.id === selection.id)
      if (index !== -1) {
        selections.value[index] = {
          ...selections.value[index],
          hasPassword: false,
          password: null,
        }
      }
      
      toast.success('Password disabled', {
        description: 'Password protection has been disabled for this selection.',
      })
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: enabled ? 'Failed to enable password' : 'Failed to disable password',
    })
  }
}

// Initial load
onMounted(async () => {
  await fetch()
})
</script>
