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
            :class="['bg-teal-500 hover:bg-teal-600 text-white']"
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
          action-icon="Plus"
          action-label="Create New Proofing"
          description="Create a proofing phase to allow clients to review and provide feedback on media."
          message="No proofing found"
          @action="handleCreateProofing"
        />

        <!-- Proofing Grid -->
        <TransitionGroup
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative"
          name="list"
          tag="div"
        >
          <ProofingCard
            v-for="(proofingItem, index) in proofing"
            :key="proofingItem.id"
            :index="index"
            :proofing="proofingItem"
            @click="handleProofingClick"
            @delete="handleDeleteProofing"
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
      description="This action cannot be undone."
      title="Delete Proofing"
      warning-message="This proofing and all its media will be permanently removed."
      @cancel="showDeleteModal = false"
      @confirm="handleConfirmDelete"
    />
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Eye } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import LoadingState from '@/components/molecules/LoadingState.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ProofingCard from '@/components/molecules/ProofingCard.vue'
import ProofingTable from '@/components/organisms/ProofingTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import ProofingDetailSidebar from '@/components/organisms/ProofingDetailSidebar.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import CreateProofingDialog from '@/components/organisms/CreateProofingDialog.vue'
import EditProofingDialog from '@/components/organisms/EditProofingDialog.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProofingStore } from '@/stores/proofing'
import { useAsyncPagination } from '@/composables/useAsyncPagination.js'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { toast } from '@/utils/toast'

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
const isDeleting = ref(false)
const activeProofing = ref(null)

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
  if (proofingPhase && proofingPhase.id) {
    try {
      const proofingId = proofingPhase.id || proofingPhase.uuid
      const projectId = proofingPhase.projectId || proofingPhase.project_uuid || null
      await proofingStore.toggleStar(proofingId, projectId)
      const index = proofing.value.findIndex(p => p.id === proofingId || p.uuid === proofingId)
      if (index !== -1) {
        proofing.value[index] = {
          ...proofing.value[index],
          isStarred: !proofing.value[index].isStarred,
        }
      }
    } catch (error) {
      handleError(error, {
        fallbackMessage: 'Failed to update star status.',
      })
    }
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

const handleConfirmDelete = async () => {
  isDeleting.value = true
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
  }
}

const getItemName = () => {
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
