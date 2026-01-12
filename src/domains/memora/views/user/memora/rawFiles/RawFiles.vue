<template>
  <DashboardLayout>
    <template #breadcrumb> Raw Files</template>
    <template #header>
      <div class="flex items-center justify-end w-full"></div>
    </template>

    <div class="space-y-6">
      <PageHeader
        :is-searching="isSearching"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :sort-options="sortOptions"
        :view-mode="viewMode"
        sort-label="Sort raw files by"
        title="Raw Files"
        @clear="handleClearSearch"
        @search="handleSearch"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      >
        <template #actions>
          <Button variant="primary" :icon="Plus" @click="handleCreateRawFiles">
            New Raw Files Phase
          </Button>
        </template>
      </PageHeader>

      <div v-if="viewMode === 'grid'">
        <LoadingState v-if="isLoading" message="Loading raw files phases..." />
        <EmptyState
          v-else-if="rawFilesList.length === 0"
          :icon="Download"
          :action-icon="Plus"
          action-label="Create New Raw Files Phase"
          description="Share raw footage and files for clients to download."
          message="No raw files phases found"
          @action="handleCreateRawFiles"
        />
        <TransitionGroup
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 relative"
          name="list"
          tag="div"
        >
          <RawFilesCard
            v-for="(rawFiles, index) in rawFilesList"
            :key="rawFiles.id"
            :index="index"
            :raw-files="rawFiles"
            :is-starring="starringRawFilesIds.has(String(rawFiles.id))"
            :is-deleting="deletingRawFilesIds.has(String(rawFiles.id))"
            :is-duplicating="duplicatingRawFilesIds.has(String(rawFiles.id))"
            @click="handleRawFilesClick"
            @delete="handleDeleteRawFiles"
            @duplicate="handleDuplicateRawFiles"
            @edit="handleEditRawFiles"
            @star-click="toggleStar"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <RawFilesTable
        v-else
        :empty-icon="Download"
        :get-icon="() => Download"
        :get-status="item => item.status"
        :get-subtitle="getSubtitle"
        :items="rawFilesList"
        :loading="isLoading"
        :selected-items="selectedRawFiles"
        :show-view-details="true"
        empty-action-label="Create New Raw Files Phase"
        empty-message="No raw files phases found"
        @delete="handleDeleteRawFiles"
        @edit="handleEditRawFiles"
        @select="handleSelectRawFiles"
        @star-click="toggleStar"
        @item-click="handleRawFilesClick"
        @empty-action="handleCreateRawFiles"
        @view-details="handleViewDetails"
      />

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

    <RawFilesDetailSidebar
      v-model="showDetailSidebar"
      :raw-files-id="selectedRawFilesId"
    />

    <CreateRawFilesDialog
      v-model:open="showCreateDialog"
      :existing-raw-files="rawFilesList"
      @success="handleCreateSuccess"
    />

    <EditRawFilesDialog
      v-model:open="showEditDialog"
      :raw-files="activeRawFiles"
      @success="handleEditSuccess"
    />

    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :is-deleting="isDeleting"
      :item-name="getItemName()"
      :description="deleteModalDescription"
      title="Delete Raw Files Phase"
      :warning-message="getDeleteModalWarning()"
      @cancel="showDeleteModal = false"
      @confirm="handleConfirmDelete"
    />

    <DeleteConfirmationModal
      v-model="showDuplicateModal"
      :item-name="getDuplicateItemName()"
      fallback-name="this raw files phase"
      title="Duplicate Raw Files Phase"
      question="Are you sure you want to duplicate"
      description="This will create a copy of the raw files phase with all its settings, media sets, and media."
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
import { Download, Plus } from 'lucide-vue-next'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import LoadingState from '@/shared/components/molecules/LoadingState.vue'
import PageHeader from '@/shared/components/molecules/PageHeader.vue'
import RawFilesCard from '@/shared/components/molecules/RawFilesCard.vue'
import RawFilesTable from '@/shared/components/organisms/RawFilesTable.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import RawFilesDetailSidebar from '@/shared/components/organisms/RawFilesDetailSidebar.vue'
import CreateRawFilesDialog from '@/shared/components/organisms/CreateRawFilesDialog.vue'
import EditRawFilesDialog from '@/shared/components/organisms/EditRawFilesDialog.vue'
import DeleteConfirmationModal from '@/domains/memora/modals/DeleteConfirmationModal.vue'
import Pagination from '@/shared/components/molecules/Pagination.vue'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles.js'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination.js'
import { useRouter } from 'vue-router'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { toast } from '@/shared/utils/toast'

const router = useRouter()
const rawFilesApi = useRawFilesApi()
const { handleError } = useErrorHandler()
const viewMode = ref('grid')
const sortBy = ref('created-new-old')
const searchQuery = ref('')
const isSearching = ref(false)
const selectedRawFiles = ref([])
const showDetailSidebar = ref(false)
const selectedRawFilesId = ref(null)
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteModal = ref(false)
const showDuplicateModal = ref(false)
const isDeleting = ref(false)
const isDuplicating = computed(() => {
  if (!activeRawFiles.value) return false
  return duplicatingRawFilesIds.value.has(String(activeRawFiles.value.id))
})
const activeRawFiles = ref(null)

const starringRawFilesIds = ref(new Set())
const deletingRawFilesIds = ref(new Set())
const duplicatingRawFilesIds = ref(new Set())

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

const fetchRawFiles = async params => {
  const fetchParams = { ...params }
  if (searchQuery.value && searchQuery.value.trim()) {
    fetchParams.search = searchQuery.value.trim()
  }
  if (sortBy.value) {
    fetchParams.sortBy = mapSortToBackend(sortBy.value)
  }
  return await rawFilesApi.fetchAllRawFiles(fetchParams)
}

const {
  data: rawFilesList,
  pagination,
  isLoading,
  fetch,
  goToPage,
  resetToFirstPage,
  setPerPage,
} = useAsyncPagination(fetchRawFiles, {
  initialPage: 1,
  initialPerPage: 10,
  autoFetch: false,
  watchForReset: [sortBy],
})

const sortOptions = [
  { label: 'Created (New → Old)', value: 'created-new-old' },
  { label: 'Created (Old → New)', value: 'created-old-new' },
  { label: 'Name (A → Z)', value: 'name-a-z' },
  { label: 'Name (Z → A)', value: 'name-z-a' },
  { label: 'Status', value: 'status' },
]

const getSubtitle = rawFiles => {
  const parts = []
  if (rawFiles.mediaCount !== undefined) {
    parts.push(`${rawFiles.mediaCount} files`)
  }
  const status = rawFiles.status || 'draft'
  parts.push(status)
  return parts.join(' • ')
}

const handleCreateRawFiles = () => {
  showCreateDialog.value = true
}

const handleCreateSuccess = async () => {
  showCreateDialog.value = false
  await resetToFirstPage()
}

const handleRawFilesClick = rawFiles => {
  if (!rawFiles) return
  const rawFilesId = rawFiles.id || rawFiles.uuid
  if (rawFilesId) {
    router.push({ name: 'rawFilesDetail', params: { id: rawFilesId } })
  }
}

const toggleStar = async rawFiles => {
  if (!rawFiles || !rawFiles.id) return

  const rawFilesId = String(rawFiles.id)
  if (starringRawFilesIds.value.has(rawFilesId)) return

  starringRawFilesIds.value.add(rawFilesId)
  try {
    await rawFilesApi.toggleStarRawFiles(rawFiles.id)
    const index = rawFilesList.value.findIndex(rf => rf.id === rawFiles.id)
    if (index !== -1) {
      rawFilesList.value[index] = {
        ...rawFilesList.value[index],
        isStarred: !rawFilesList.value[index].isStarred,
      }
    }
  } catch (error) {
  } finally {
    starringRawFilesIds.value.delete(rawFilesId)
  }
}

const handleEditRawFiles = rawFiles => {
  if (rawFiles && rawFiles.id) {
    activeRawFiles.value = rawFiles
    showEditDialog.value = true
  }
}

const handleEditSuccess = async () => {
  activeRawFiles.value = null
  showEditDialog.value = false
  await fetch()
}

const handleDeleteRawFiles = rawFiles => {
  if (rawFiles && rawFiles.id) {
    activeRawFiles.value = rawFiles
    showDeleteModal.value = true
  }
}

const handleDuplicateRawFiles = rawFiles => {
  if (rawFiles && rawFiles.id) {
    activeRawFiles.value = rawFiles
    showDuplicateModal.value = true
  }
}

const handleConfirmDelete = async () => {
  if (!activeRawFiles.value) return

  const rawFilesId = String(activeRawFiles.value.id)
  isDeleting.value = true
  deletingRawFilesIds.value.add(rawFilesId)
  try {
    await rawFilesApi.deleteRawFiles(activeRawFiles.value.id)
    activeRawFiles.value = null
    showDeleteModal.value = false
    await fetch()
  } catch (error) {
  } finally {
    isDeleting.value = false
    deletingRawFilesIds.value.delete(rawFilesId)
  }
}

const handleConfirmDuplicate = async () => {
  if (!activeRawFiles.value) return

  const rawFilesId = String(activeRawFiles.value.id)
  if (duplicatingRawFilesIds.value.has(rawFilesId)) return

  duplicatingRawFilesIds.value.add(rawFilesId)
  try {
    await rawFilesApi.duplicateRawFiles(activeRawFiles.value.id)
    toast.success('Raw files phase duplicated', {
      description: `${activeRawFiles.value.name || activeRawFiles.value.title} has been duplicated.`,
    })
    await fetch()
    showDuplicateModal.value = false
    activeRawFiles.value = null
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to duplicate raw files phase.',
    })
  } finally {
    duplicatingRawFilesIds.value.delete(rawFilesId)
  }
}

const handleCancelDuplicate = () => {
  showDuplicateModal.value = false
  activeRawFiles.value = null
}

const handleViewDetails = rawFiles => {
  selectedRawFilesId.value = rawFiles?.id || rawFiles?.uuid || null
  showDetailSidebar.value = true
}

const handleSelectRawFiles = () => {
  // UI only - no functionality
}

const getItemName = () => {
  return activeRawFiles.value?.name || 'Raw Files Phase'
}

const getDuplicateItemName = () => {
  return activeRawFiles.value?.name || 'Raw Files Phase'
}

const deleteModalDescription = computed(() => {
  return 'This raw files phase and all its media will be permanently removed.\n\nThis action cannot be undone.'
})

const getDeleteModalWarning = () => {
  if (!activeRawFiles.value) return null

  const locationParts = []

  if (activeRawFiles.value.project?.name) {
    locationParts.push(`Project: ${activeRawFiles.value.project.name}`)
    const phaseName = activeRawFiles.value.project.rawFiles?.name || 'Raw Files'
    locationParts.push(`Phase: ${phaseName}`)
  } else if (activeRawFiles.value.projectId) {
    locationParts.push(`Project: ${activeRawFiles.value.projectId}`)
    locationParts.push('Phase: Raw Files')
  }

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

onMounted(async () => {
  await fetch()
})
</script>
