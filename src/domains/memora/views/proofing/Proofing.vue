<template>
  <DashboardLayout>
    <template #breadcrumb> Proofing </template>
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
        sort-label="Sort proofing by"
        title="Proofing"
        @clear="handleClearSearch"
        @search="handleSearch"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      >
        <template #actions>
          <Button
            variant="primary"
            :icon="Plus"
            @click="handleCreateProofing"
          >
            New Proofing
          </Button>
        </template>
      </PageHeader>

      <!-- Proofing Grid View -->
      <div v-if="viewMode === 'grid'">
        <!-- Loading State -->
        <LoadingState v-if="isLoading" message="Loading proofing..." />

        <!-- Empty State -->
        <EmptyState
          v-else-if="proofing.length === 0"
          :icon="Eye"
          :action-icon="Plus"
          action-label="Create New Proofing"
          description="Create a proofing phase to allow clients to review and provide feedback on media."
          message="No proofing found"
          @action="handleCreateProofing"
        />

        <!-- Proofing Grid -->
        <TransitionGroup
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 relative"
          name="list"
          tag="div"
        >
          <ProofingCard
            v-for="(proofingItem, index) in proofing"
            :key="proofingItem.id"
            :index="index"
            :proofing="proofingItem"
            :is-duplicating="duplicatingProofingIds.has(String(proofingItem.id))"
            @click="handleProofingClick"
            @delete="handleDeleteProofing"
            @duplicate="handleDuplicateProofing"
            @edit="handleEditProofing"
            @star-click="toggleStar"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <!-- Proofing List View -->
      <ProofingTable
        v-else
        :empty-icon="Eye"
        :get-icon="() => Eye"
        :get-status="item => item.status"
        :get-subtitle="getSubtitle"
        :items="proofing"
        :loading="isLoading"
        :selected-items="selectedProofing"
        :show-view-details="true"
        empty-action-label="Create New Proofing"
        empty-message="No proofing found"
        @delete="handleDeleteProofing"
        @edit="handleEditProofing"
        @empty-action="handleCreateProofing"
        @item-click="handleProofingClick"
        @select="handleSelectProofing"
        @star-click="toggleStar"
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

    <!-- Proofing Detail Sidebar -->
    <ProofingDetailSidebar v-model="showDetailSidebar" :proofing-id="selectedProofingId" />

    <!-- Create Proofing Dialog -->
    <CreateProofingDialog v-model:open="showCreateDialog" @success="handleCreateSuccess" />

    <!-- Edit Proofing Dialog -->
    <EditProofingDialog
      v-model:open="showEditDialog"
      :proofing="activeProofing"
      @success="handleEditSuccess"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :is-deleting="isDeleting"
      :item-name="getItemName()"
      :description="deleteModalDescription"
      title="Delete Proofing"
      :warning-message="getDeleteModalWarning()"
      @cancel="showDeleteModal = false"
      @confirm="handleConfirmDelete"
    />

    <!-- Duplicate Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDuplicateModal"
      :item-name="getDuplicateItemName()"
      fallback-name="this proofing"
      title="Duplicate Proofing"
      question="Are you sure you want to duplicate"
      description="This will create a copy of the proofing with all its settings, media sets, and media."
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
import { Eye, Plus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import LoadingState from '@/shared/components/molecules/LoadingState.vue'
import PageHeader from '@/shared/components/molecules/PageHeader.vue'
import ProofingCard from '@/shared/components/molecules/ProofingCard.vue'
import ProofingTable from '@/shared/components/organisms/ProofingTable.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import ProofingDetailSidebar from '@/shared/components/organisms/ProofingDetailSidebar.vue'
import Pagination from '@/shared/components/molecules/Pagination.vue'
import CreateProofingDialog from '@/shared/components/organisms/CreateProofingDialog.vue'
import EditProofingDialog from '@/shared/components/organisms/EditProofingDialog.vue'
import DeleteConfirmationModal from '@/domains/memora/modals/DeleteConfirmationModal.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useProofingStore } from '@/domains/memora/stores/proofing'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination.js'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const router = useRouter()
const proofingStore = useProofingStore()
const { handleError } = useErrorHandler()

// View mode and sorting - use store for persistence
const viewMode = computed({
  get: () => proofingStore.viewMode,
  set: value => proofingStore.setViewMode(value),
})
const sortBy = computed({
  get: () => proofingStore.sortBy,
  set: value => proofingStore.setSortBy(value),
})
const searchQuery = ref('')
const isSearching = ref(false)
const sortOptions = [
  { label: 'Created (New → Old)', value: 'created-new-old' },
  { label: 'Created (Old → New)', value: 'created-old-new' },
  { label: 'Name (A → Z)', value: 'name-a-z' },
  { label: 'Name (Z → A)', value: 'name-z-a' },
  { label: 'Status', value: 'status' },
]

const selectedProofing = ref([])
const showDetailSidebar = ref(false)
const selectedProofingId = ref(null)
const showEditDialog = ref(false)
const showDeleteModal = ref(false)
const showDuplicateModal = ref(false)
const isDeleting = ref(false)
const isDuplicating = computed(() => {
  if (!activeProofing.value) return false
  return duplicatingProofingIds.value.has(String(activeProofing.value.id))
})
const activeProofing = ref(null)

// Loading states per proofing
const starringProofingIds = ref(new Set())
const deletingProofingIds = ref(new Set())
const duplicatingProofingIds = ref(new Set())

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
const fetchProofing = async params => {
  const fetchParams = { ...params }

  // Add search parameter
  if (searchQuery.value && searchQuery.value.trim()) {
    fetchParams.search = searchQuery.value.trim()
  }

  // Add sort parameter
  if (sortBy.value) {
    fetchParams.sortBy = mapSortToBackend(sortBy.value)
  }

  return await proofingStore.fetchAllProofing(fetchParams)
}

// Use async pagination composable
const {
  data: proofing,
  pagination,
  isLoading,
  fetch,
  goToPage,
  resetToFirstPage,
  setPerPage,
} = useAsyncPagination(fetchProofing, {
  initialPage: 1,
  initialPerPage: 10,
  autoFetch: false, // We'll call fetch manually in onMounted
  watchForReset: [sortBy], // Reset to page 1 when sort changes (search only on button click)
})

const handleSelectProofing = () => {
  // UI only - no functionality
}

const getSubtitle = proofingPhase => {
  const parts = []
  if (proofingPhase.mediaCount !== undefined) {
    parts.push(`${proofingPhase.mediaCount} media`)
  }
  const status = proofingPhase.status || 'draft'
  parts.push(status)
  return parts.join(' • ')
}

const showCreateDialog = ref(false)

const handleCreateProofing = () => {
  showCreateDialog.value = true
}

const handleCreateSuccess = async () => {
  showCreateDialog.value = false
  await resetToFirstPage()
}

const handleProofingClick = proofingPhase => {
  if (proofingPhase && proofingPhase.id) {
    // Always route to proofing detail view
    router.push({
      name: 'proofingDetail',
      params: { id: proofingPhase.id },
    })
  }
}

const toggleStar = async proofingPhase => {
  if (!proofingPhase || (!proofingPhase.id && !proofingPhase.uuid)) return
  
  const proofingId = proofingPhase.id || proofingPhase.uuid
  const proofingIdStr = String(proofingId)
  if (starringProofingIds.value.has(proofingIdStr)) return
  
  starringProofingIds.value.add(proofingIdStr)
  try {
    const projectId = proofingPhase.projectId || proofingPhase.project_uuid || null
    const result = await proofingStore.toggleStar(proofingId, projectId)
    const index = proofing.value.findIndex(
      p => p.id === proofingId || p.uuid === proofingId || 
           p.id === proofingPhase.id || p.uuid === proofingPhase.id ||
           p.id === proofingPhase.uuid || p.uuid === proofingPhase.uuid
    )
    if (index !== -1 && result?.starred !== undefined) {
      proofing.value[index] = {
        ...proofing.value[index],
        isStarred: result.starred,
        starred: result.starred,
      }
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update star status.',
    })
  } finally {
    starringProofingIds.value.delete(proofingIdStr)
  }
}

const handleEditProofing = proofingPhase => {
  if (proofingPhase && proofingPhase.id) {
    activeProofing.value = proofingPhase
    showEditDialog.value = true
  }
}

const handleEditSuccess = async () => {
  activeProofing.value = null
  showEditDialog.value = false
  await fetch()
}

const handleDeleteProofing = proofingPhase => {
  if (proofingPhase && proofingPhase.id) {
    activeProofing.value = proofingPhase
    showDeleteModal.value = true
  }
}

const handleDuplicateProofing = proofingPhase => {
  if (proofingPhase && proofingPhase.id) {
    activeProofing.value = proofingPhase
    showDuplicateModal.value = true
  }
}

const handleConfirmDelete = async () => {
  if (!activeProofing.value) return
  
  const proofingId = String(activeProofing.value.id || activeProofing.value.uuid)
  isDeleting.value = true
  deletingProofingIds.value.add(proofingId)
  try {
    const deleted = await proofingStore.deleteProofing(
      activeProofing.value.id || activeProofing.value.uuid
    )
    if (deleted) {
      activeProofing.value = null
      showDeleteModal.value = false
      await fetch()
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to delete proofing.',
    })
  } finally {
    isDeleting.value = false
    deletingProofingIds.value.delete(proofingId)
  }
}

const handleConfirmDuplicate = async () => {
  if (!activeProofing.value) return

  const proofingId = activeProofing.value.id || activeProofing.value.uuid
  const proofingIdStr = String(proofingId)
  if (duplicatingProofingIds.value.has(proofingIdStr)) return
  
  duplicatingProofingIds.value.add(proofingIdStr)
  try {
    const projectId = activeProofing.value.projectId || activeProofing.value.project_uuid || null
    await proofingStore.duplicateProofing(proofingId, projectId)
    toast.success('Proofing duplicated', {
      description: `${activeProofing.value.name || activeProofing.value.title} has been duplicated.`,
    })
    await fetch()
    showDuplicateModal.value = false
    activeProofing.value = null
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to duplicate proofing.',
    })
  } finally {
    duplicatingProofingIds.value.delete(proofingIdStr)
  }
}

const handleCancelDuplicate = () => {
  showDuplicateModal.value = false
  activeProofing.value = null
}

const deleteModalDescription = computed(() => {
  return 'This proofing and all its media will be permanently removed.\n\nThis action cannot be undone.'
})

const getDeleteModalWarning = () => {
  if (!activeProofing.value) return null
  
  const locationParts = []
  
  // Add project information if available
  if (activeProofing.value.project?.name) {
    locationParts.push(`Project: ${activeProofing.value.project.name}`)
    
    // Add phase name if available, otherwise default to "Proofing"
    const phaseName = activeProofing.value.project.proofing?.name || 'Proofing'
    locationParts.push(`Phase: ${phaseName}`)
  } else if (activeProofing.value.projectId) {
    locationParts.push(`Project: ${activeProofing.value.projectId}`)
    locationParts.push('Phase: Proofing')
  }
  
  // If no location info, don't show the Media Location section
  if (locationParts.length === 0) {
    return null
  }
  
  return locationParts.join('\n')
}

const getItemName = () => {
  return activeProofing.value?.name || 'Proofing'
}

const getDuplicateItemName = () => {
  return activeProofing.value?.name || 'Proofing'
}

const handleViewDetails = proofingPhase => {
  selectedProofingId.value = proofingPhase.id
  showDetailSidebar.value = true
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

// Initial load
onMounted(async () => {
  await fetch()
})
</script>
