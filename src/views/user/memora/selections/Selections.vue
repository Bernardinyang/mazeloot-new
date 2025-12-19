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
        :search-query="searchQuery"
        :sort-by="sortBy"
        :sort-options="sortOptions"
        :view-mode="viewMode"
        sort-label="Sort selections by"
        title="Selections"
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
          v-else-if="sortedSelections.length === 0"
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
            v-for="(selection, index) in sortedSelections"
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
      <CollectionsTable
        v-else
        :empty-icon="CheckSquare"
        :get-icon="() => CheckSquare"
        :get-status="item => item.status"
        :get-subtitle="getSubtitle"
        :items="sortedSelections"
        :loading="isLoading"
        :selected-items="selectedSelections"
        :show-move-to="false"
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
    </div>

    <!-- Selection Detail Sidebar -->
    <SelectionDetailSidebar v-model="showDetailSidebar" :selection-id="selectedSelectionId" />

    <!-- Create Selection Dialog -->
    <CreateSelectionDialog v-model:open="showCreateDialog" @success="handleCreateSuccess" />

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
      :item-name="getItemName(itemToDelete)"
      title="Delete Selection"
      description="This action cannot be undone."
      warning-message="This selection and all its media will be permanently removed."
      @cancel="closeDeleteModal"
      @confirm="handleConfirmDelete"
    />
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckSquare } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import LoadingState from '@/components/molecules/LoadingState.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import SelectionCard from '@/components/molecules/SelectionCard.vue'
import CollectionsTable from '@/components/organisms/CollectionsTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import SelectionDetailSidebar from '@/components/organisms/SelectionDetailSidebar.vue'
import CreateSelectionDialog from '@/components/organisms/CreateSelectionDialog.vue'
import EditSelectionDialog from '@/components/organisms/EditSelectionDialog.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSelectionStore } from '@/stores/selection'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()
const router = useRouter()
const selectionStore = useSelectionStore()
const { handleError } = useErrorHandler()

// Delete confirmation
const {
  showDeleteModal,
  itemToDelete,
  isDeleting,
  openDeleteModal,
  closeDeleteModal,
  getItemName,
} = useDeleteConfirmation()

// View mode and sorting
const viewMode = ref('grid')
const sortBy = ref('created-new-old')
const searchQuery = ref('')
const sortOptions = [
  { label: 'Created (New → Old)', value: 'created-new-old' },
  { label: 'Created (Old → New)', value: 'created-old-new' },
  { label: 'Name (A → Z)', value: 'name-a-z' },
  { label: 'Name (Z → A)', value: 'name-z-a' },
  { label: 'Status', value: 'status' },
]

const selections = computed(() => selectionStore.selections)
const isLoading = computed(() => selectionStore.isLoading)
const selectedSelections = ref([])
const showDetailSidebar = ref(false)
const selectedSelectionId = ref(null)
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const selectionToEdit = ref(null)

const handleSelectSelection = (id, checked) => {
  if (checked) {
    if (!selectedSelections.value.includes(id)) {
      selectedSelections.value.push(id)
    }
  } else {
    selectedSelections.value = selectedSelections.value.filter(selId => selId !== id)
  }
}

const getSubtitle = selection => {
  const parts = []
  // Only show essential info on card - rest in detail sidebar
  if (selection.mediaCount !== undefined) {
    parts.push(`${selection.mediaCount} media`)
  }
  const status = selection.status || 'draft'
  parts.push(status)
  return parts.join(' • ')
}

// Filter and sort selections
const filteredSelections = computed(() => {
  let filtered = [...selections.value]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(selection => {
      if (!selection) return false
      const name = (selection.name || '').toLowerCase()
      return name.includes(query)
    })
  }

  return filtered
})

const sortedSelections = computed(() => {
  const sorted = [...filteredSelections.value]

  switch (sortBy.value) {
    case 'created-new-old':
      return sorted.sort((a, b) => {
        if (!a || !b) return 0
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      })
    case 'created-old-new':
      return sorted.sort((a, b) => {
        if (!a || !b) return 0
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      })
    case 'name-a-z':
      return sorted.sort((a, b) => {
        if (!a || !b) return 0
        return (a.name || '').localeCompare(b.name || '')
      })
    case 'name-z-a':
      return sorted.sort((a, b) => {
        if (!a || !b) return 0
        return (b.name || '').localeCompare(a.name || '')
      })
    case 'status':
      return sorted.sort((a, b) => {
        if (!a || !b) return 0
        return (a.status || '').localeCompare(b.status || '')
      })
    default:
      return sorted
  }
})

const handleCreateSelection = () => {
  showCreateDialog.value = true
}

const handleCreateSuccess = async newSelection => {
  // Modal has already performed the create and shown success message
  // Navigate to the selection detail view
  showCreateDialog.value = false
  await router.push({
    name: 'selectionDetail',
    params: { id: newSelection.id || newSelection.uuid },
  })
}

const handleSelectionClick = selection => {
  if (selection.projectId) {
    router.push({
      name: 'projectSelections',
      params: { id: selection.projectId },
      query: { selectionId: selection.id },
    })
  } else {
    router.push({
      name: 'selectionDetail',
      params: { id: selection.id },
    })
  }
}

const toggleStar = async selection => {
  try {
    await selectionStore.toggleStar(selection.id)
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Failed to update star status.',
    })
  }
}

const handleEditSelection = selection => {
  selectionToEdit.value = selection
  showEditDialog.value = true
}

const handleEditSuccess = async () => {
  // Modal has already performed the update and shown success message
  // Just refresh the list and reset state
  selectionToEdit.value = null
  await loadSelections()
}

const handleDeleteSelection = selection => {
  openDeleteModal(selection)
}

const handleConfirmDelete = async () => {
  if (!itemToDelete.value) return

  isDeleting.value = true
  try {
    // Perform delete action in the handler
    const deleted = await selectionStore.deleteSelection(itemToDelete.value.id)

    if (deleted) {
      toast.success('Selection deleted', {
        description: 'The selection has been permanently removed.',
      })
      closeDeleteModal()
      // Refresh list after successful delete
      await loadSelections()
    }
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Failed to delete selection.',
    })
  } finally {
    isDeleting.value = false
  }
}

const handleViewDetails = selection => {
  selectedSelectionId.value = selection.id
  showDetailSidebar.value = true
}

const loadSelections = async () => {
  try {
    await selectionStore.fetchAllSelections()
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Failed to load selections.',
    })
  }
}

onMounted(async () => {
  await loadSelections()
})
</script>
