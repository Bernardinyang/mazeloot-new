<template>
  <DashboardLayout>
    <template #breadcrumb> RawFiles</template>
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
        sort-label="Sort rawFiles by"
        title="RawFiles"
        @clear="handleClearSearch"
        @search="handleSearch"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      >
        <template #actions>
          <UpgradeGate feature="raw_files">
            <Button
              variant="accent"
              :icon="Plus"
              @click="handleCreateRawFile"
            >
              New RawFile
            </Button>
          </UpgradeGate>
        </template>
      </PageHeader>

      <!-- RawFiles Grid View -->
      <div v-if="viewMode === 'grid'">
        <!-- Loading State -->
        <LoadingState v-if="isLoading" message="Loading rawFiles..." />

        <!-- Empty State -->
        <EmptyState
          v-else-if="rawFiles.length === 0"
          :icon="CheckSquare"
          :action-icon="Plus"
          :action-label="canAccessRawFiles ? 'Create New RawFile' : 'Upgrade to Studio'"
          description="Get started by creating your first rawFile to organize and manage your media."
          message="No rawFiles found"
          @action="canAccessRawFiles ? handleCreateRawFile : () => showUpgradePrompt('raw_files')"
        />

        <!-- RawFiles Grid -->
        <TransitionGroup
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 relative"
          name="list"
          tag="div"
        >
          <RawFileCard
            v-for="(rawFile, index) in rawFiles"
            :key="rawFile.id"
            :index="index"
            :rawFile="rawFile"
            :is-starring="starringRawFileIds.has(String(rawFile.id))"
            :is-deleting="deletingRawFileIds.has(String(rawFile.id))"
            :is-duplicating="duplicatingRawFileIds.has(String(rawFile.id))"
            @click="handleRawFileClick"
            @delete="handleDeleteRawFile"
            @duplicate="handleDuplicateRawFile"
            @edit="handleEditRawFile"
            @star-click="toggleStar"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <!-- RawFiles List View -->
      <RawFilesTable
        v-else
        :empty-icon="CheckSquare"
        :get-icon="() => CheckSquare"
        :get-status="item => item.status"
        :get-subtitle="getSubtitle"
        :items="rawFiles"
        :loading="isLoading"
        :selected-items="selectedRawFiles"
        :show-view-details="true"
        :empty-action-label="canAccessRawFiles ? 'Create New RawFile' : 'Upgrade to Studio'"
        empty-message="No rawFiles found"
        @delete="handleDeleteRawFile"
        @edit="handleEditRawFile"
        @select="handleSelectRawFile"
        @star-click="toggleStar"
        @item-click="handleRawFileClick"
        @empty-action="canAccessRawFiles ? handleCreateRawFile : () => showUpgradePrompt('raw_files')"
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

    <!-- RawFile Detail Sidebar -->
    <RawFileDetailSidebar v-model="showDetailSidebar" :rawFile-id="selectedRawFileId" />

    <!-- Create RawFile Dialog -->
    <CreateRawFileDialog v-model:open="showCreateDialog" @success="handleCreateSuccess" />

    <!-- Edit RawFile Dialog -->
    <EditRawFileDialog
      v-model:open="showEditDialog"
      :rawFile="activeRawFile"
      @success="handleEditSuccess"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :is-deleting="isDeleting"
      :item-name="getItemName()"
      :description="deleteModalDescription"
      title="Delete RawFile"
      :warning-message="getDeleteModalWarning()"
      @cancel="showDeleteModal = false"
      @confirm="handleConfirmDelete"
    />

    <!-- Duplicate Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDuplicateModal"
      :item-name="getDuplicateItemName()"
      fallback-name="this rawFile"
      title="Duplicate RawFile"
      question="Are you sure you want to duplicate"
      description="This will create a copy of the rawFile with all its settings, media sets, and media."
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
import { CheckSquare, Plus } from '@/shared/utils/lucideAnimated'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import LoadingState from '@/shared/components/molecules/LoadingState.vue'
import PageHeader from '@/shared/components/molecules/PageHeader.vue'
import RawFileCard from '@/shared/components/molecules/RawFileCard.vue'
import RawFilesTable from '@/domains/memora/components/organisms/RawFilesTable.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import RawFileDetailSidebar from '@/domains/memora/components/organisms/RawFileDetailSidebar.vue'
import CreateRawFileDialog from '@/domains/memora/components/organisms/CreateRawFileDialog.vue'
import EditRawFileDialog from '@/domains/memora/components/organisms/EditRawFileDialog.vue'
import DeleteConfirmationModal from '@/shared/components/organisms/DeleteConfirmationModal.vue'
import Pagination from '@/shared/components/molecules/Pagination.vue'
import { useRawFileStore } from '@/domains/memora/stores/rawFile.js'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination.js'
import { useRouter } from 'vue-router'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { toast } from '@/shared/utils/toast'

const rawFileStore = useRawFileStore()
const rawFilesApi = useRawFilesApi()
const router = useRouter()
const { handleError } = useErrorHandler()
const { canAccessRawFiles, showUpgradePrompt } = useMemoraFeatures()
const viewMode = computed({
  get: () => rawFileStore.viewMode,
  set: value => rawFileStore.setViewMode(value),
})
const sortBy = ref('created-new-old')
const searchQuery = ref('')
const isSearching = ref(false)
const selectedRawFiles = ref([])
const showDetailSidebar = ref(false)
const selectedRawFileId = ref(null)
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteModal = ref(false)
const showDuplicateModal = ref(false)
const isDeleting = ref(false)
const isDuplicating = computed(() => {
  if (!activeRawFile.value) return false
  return duplicatingRawFileIds.value.has(String(activeRawFile.value.id))
})
const activeRawFile = ref(null)

// Loading states per rawFile
const starringRawFileIds = ref(new Set())
const deletingRawFileIds = ref(new Set())
const duplicatingRawFileIds = ref(new Set())

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
const fetchRawFiles = async params => {
  const fetchParams = { ...params }

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
  data: rawFiles,
  pagination,
  isLoading,
  fetch,
  goToPage,
  resetToFirstPage,
  setPerPage,
} = useAsyncPagination(fetchRawFiles, {
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
  const status = rawFile.status || 'draft'
  parts.push(status)
  return parts.join(' • ')
}

const handleCreateRawFile = () => {
  showCreateDialog.value = true
}

const handleCreateSuccess = async () => {
  showCreateDialog.value = false
  await resetToFirstPage()
}

const handleRawFileClick = rawFile => {
  if (rawFile && rawFile.id) {
    router.push({ name: 'rawFileDetail', params: { id: rawFile.id } })
  }
}

const toggleStar = async rawFile => {
  if (!rawFile || !rawFile.id) return
  
  const rawFileId = String(rawFile.id)
  if (starringRawFileIds.value.has(rawFileId)) return
  
  starringRawFileIds.value.add(rawFileId)
  try {
    await rawFileStore.toggleStarRawFile(rawFile.id)
    const index = rawFiles.value.findIndex(s => s.id === rawFile.id)
    if (index !== -1) {
      rawFiles.value[index] = {
        ...rawFiles.value[index],
        isStarred: !rawFiles.value[index].isStarred,
      }
    }
  } catch (error) {
  } finally {
    starringRawFileIds.value.delete(rawFileId)
  }
}

const handleEditRawFile = rawFile => {
  if (rawFile && rawFile.id) {
    activeRawFile.value = rawFile
    showEditDialog.value = true
  }
}

const handleEditSuccess = async () => {
  activeRawFile.value = null
  showEditDialog.value = false
  await fetch()
}

const handleDeleteRawFile = rawFile => {
  if (rawFile && rawFile.id) {
    activeRawFile.value = rawFile
    showDeleteModal.value = true
  }
}

const handleDuplicateRawFile = rawFile => {
  if (rawFile && rawFile.id) {
    activeRawFile.value = rawFile
    showDuplicateModal.value = true
  }
}

const handleConfirmDelete = async () => {
  if (!activeRawFile.value) return
  
  const rawFileId = String(activeRawFile.value.id)
  isDeleting.value = true
  deletingRawFileIds.value.add(rawFileId)
  try {
    const deleted = await rawFileStore.deleteRawFile(activeRawFile.value.id)
    if (deleted) {
      activeRawFile.value = null
      showDeleteModal.value = false
      await fetch()
    }
  } catch (error) {
  } finally {
    isDeleting.value = false
    deletingRawFileIds.value.delete(rawFileId)
  }
}

const handleConfirmDuplicate = async () => {
  if (!activeRawFile.value) return

  const rawFileId = String(activeRawFile.value.id)
  if (duplicatingRawFileIds.value.has(rawFileId)) return
  
  duplicatingRawFileIds.value.add(rawFileId)
  try {
    await rawFileStore.duplicateRawFile(activeRawFile.value.id)
    toast.success('RawFile duplicated', {
      description: `${activeRawFile.value.name || activeRawFile.value.title} has been duplicated.`,
    })
    await fetch()
    showDuplicateModal.value = false
    activeRawFile.value = null
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to duplicate rawFile.',
    })
  } finally {
    duplicatingRawFileIds.value.delete(rawFileId)
  }
}

const handleCancelDuplicate = () => {
  showDuplicateModal.value = false
  activeRawFile.value = null
}

const handleViewDetails = rawFile => {
  selectedRawFileId.value = rawFile?.id || rawFile?.uuid || null
  showDetailSidebar.value = true
}

const handleSelectRawFile = () => {
  // UI only - no functionality
}

const getItemName = () => {
  return activeRawFile.value?.name || 'RawFile'
}

const getDuplicateItemName = () => {
  return activeRawFile.value?.name || 'RawFile'
}

const deleteModalDescription = computed(() => {
  return 'This rawFile and all its media will be permanently removed.\n\nThis action cannot be undone.'
})

const getDeleteModalWarning = () => {
  if (!activeRawFile.value) return null
  
  const locationParts = []
  
  // Add project information if available
  if (activeRawFile.value.project?.name) {
    locationParts.push(`Project: ${activeRawFile.value.project.name}`)
    
    // Add phase name if available, otherwise default to "RawFiles"
    const phaseName = activeRawFile.value.project.rawFile?.name || 'RawFiles'
    locationParts.push(`Phase: ${phaseName}`)
  } else if (activeRawFile.value.projectId) {
    locationParts.push(`Project: ${activeRawFile.value.projectId}`)
    locationParts.push('Phase: RawFiles')
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

const handleTogglePassword = async (rawFile, enabled) => {
  if (!rawFile?.id) return

  const rawFileId = String(rawFile.id)
  try {
    if (enabled) {
      // Generate a password when enabling
      const { generatePassword } = await import('@/shared/utils/generatePassword')
      const newPassword = generatePassword()
      
      await rawFilesApi.updateRawFile(rawFile.id, {
        password: newPassword,
      })
      
      // Update local state
      const index = rawFiles.value.findIndex(s => s.id === rawFile.id)
      if (index !== -1) {
        rawFiles.value[index] = {
          ...rawFiles.value[index],
          hasPassword: true,
          password: newPassword,
        }
      }
      
      toast.success('Password enabled', {
        description: 'Password protection has been enabled for this rawFile.',
      })
    } else {
      await rawFilesApi.updateRawFile(rawFile.id, {
        password: '',
      })
      
      // Update local state
      const index = rawFiles.value.findIndex(s => s.id === rawFile.id)
      if (index !== -1) {
        rawFiles.value[index] = {
          ...rawFiles.value[index],
          hasPassword: false,
          password: null,
        }
      }
      
      toast.success('Password disabled', {
        description: 'Password protection has been disabled for this rawFile.',
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
