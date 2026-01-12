<template>
  <DashboardLayout>
    <template #breadcrumb> Starred Proofing </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        title="Starred Proofing"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        :is-searching="isSearching"
        sort-label="Sort proofing by"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
        @search="handleSearch"
        @clear="handleClearSearch"
      />

      <!-- Loading State -->
      <LoadingState v-if="isLoading" message="Loading starred proofing..." />

      <!-- Empty State -->
      <EmptyState
        v-else-if="proofing.length === 0"
        message="No starred proofing found"
        description="Star proofing instances to quickly access them from this page."
        action-label="Browse Proofing"
        :icon="Eye"
        action-icon="ArrowRight"
        @action="handleBrowseProofing"
      />

      <!-- Proofing Grid View -->
      <div v-else-if="viewMode === 'grid'">
        <TransitionGroup
          name="list"
          tag="div"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative"
        >
          <ProofingCard
            v-for="(proofingPhase, index) in proofing"
            :key="proofingPhase.id || proofingPhase.uuid"
            :proofing="proofingPhase"
            :index="index"
            :is-starring="starringProofingIds.has(String(proofingPhase.id || proofingPhase.uuid))"
            :is-deleting="deletingProofingIds.has(String(proofingPhase.id || proofingPhase.uuid))"
            @click="handleProofingClick"
            @star-click="toggleStar"
            @edit="handleEditProofing"
            @delete="handleDeleteProofing"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <!-- Proofing List View -->
      <ProofingTable
        v-else
        :items="proofing"
        :loading="isLoading"
        :selected-items="selectedProofing"
        empty-message="No starred proofing found"
        empty-action-label="Browse Proofing"
        :empty-icon="Eye"
        :get-subtitle="getSubtitle"
        :get-icon="() => Eye"
        :get-status="item => item.status"
        :show-view-details="true"
        @select="handleSelectProofing"
        @star-click="toggleStar"
        @item-click="handleProofingClick"
        @empty-action="handleBrowseProofing"
        @edit="handleEditProofing"
        @delete="handleDeleteProofing"
        @view-details="handleViewDetails"
      />
    </div>

    <!-- Proofing Detail Sidebar -->
    <ProofingDetailSidebar v-model="showDetailSidebar" :proofing-id="selectedProofingId" />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, ArrowRight } from 'lucide-vue-next'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import PageHeader from '@/shared/components/molecules/PageHeader.vue'
import ProofingCard from '@/shared/components/molecules/ProofingCard.vue'
import ProofingTable from '@/shared/components/organisms/ProofingTable.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import LoadingState from '@/shared/components/molecules/LoadingState.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useProofingStore } from '@/domains/memora/stores/proofing'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination'
import ProofingDetailSidebar from '@/shared/components/organisms/ProofingDetailSidebar.vue'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const router = useRouter()
const proofingStore = useProofingStore()
const { handleError } = useErrorHandler()

// View mode and sorting
const viewMode = ref('grid')
const sortBy = ref('created-new-old')
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

// Loading states per proofing
const starringProofingIds = ref(new Set())
const deletingProofingIds = ref(new Set())

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

const fetchStarredProofing = async params => {
  const fetchParams = {
    starred: true,
    ...params,
  }

  if (searchQuery.value && searchQuery.value.trim()) {
    fetchParams.search = searchQuery.value.trim()
  }

  if (sortBy.value) {
    fetchParams.sortBy = mapSortToBackend(sortBy.value)
  }

  const result = await proofingStore.fetchAllProofing(fetchParams)
  return Array.isArray(result) ? result : result?.data || []
}

const {
  data: proofing,
  pagination,
  isLoading,
  fetch,
  resetToFirstPage,
} = useAsyncPagination(fetchStarredProofing, {
  initialPage: 1,
  initialPerPage: 1000,
  autoFetch: false,
  watchForReset: [sortBy],
})

const getSubtitle = proofingPhase => {
  const parts = []
  if (proofingPhase.projectId && proofingPhase.projectName) {
    parts.push(`Project: ${proofingPhase.projectName}`)
  }
  if (proofingPhase.mediaCount !== undefined) {
    parts.push(`${proofingPhase.mediaCount} media`)
  }
  if (proofingPhase.completedMediaCount !== undefined && proofingPhase.completedMediaCount > 0) {
    parts.push(`${proofingPhase.completedMediaCount} completed`)
  }
  if (proofingPhase.feedbackCount !== undefined && proofingPhase.feedbackCount > 0) {
    parts.push(`${proofingPhase.feedbackCount} feedback`)
  }
  const status = proofingPhase.status || 'draft'
  parts.push(status)
  const date = proofingPhase.createdAt
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

// Use proofing from useAsyncPagination directly - no need for sortedProofing computed

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
  if (!proofingPhase || !proofingPhase.id) return
  
  const proofingId = String(proofingPhase.id)
  if (starringProofingIds.value.has(proofingId)) return
  
  starringProofingIds.value.add(proofingId)
  try {
    const projectId = proofingPhase.projectId || proofingPhase.project_uuid || null
    const result = await proofingStore.toggleStar(proofingPhase.id, projectId)
    const index = proofing.value.findIndex(p => p.id === proofingPhase.id || p.id === proofingId || p.uuid === proofingPhase.id || p.uuid === proofingId)
    
    if (index !== -1) {
      const currentStarred = proofing.value[index].isStarred || proofing.value[index].starred || false
      const newStarredState = result?.starred ?? result?.data?.starred ?? !currentStarred
      
      // If unstarred in starred view, remove from list
      if (!newStarredState) {
        proofing.value.splice(index, 1)
        // Update pagination total if available
        if (pagination && pagination.value && pagination.value.total > 0) {
          pagination.value.total -= 1
        }
      } else {
        // Update the item state
        proofing.value[index] = {
          ...proofing.value[index],
          isStarred: newStarredState,
          starred: newStarredState,
        }
      }
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update star status.',
    })
  } finally {
    starringProofingIds.value.delete(proofingId)
  }
}

const handleEditProofing = proofingPhase => {
  // TODO: Implement proofing editing
  toast.info('Edit feature coming soon')
}

const handleDeleteProofing = async proofingPhase => {
  // TODO: Implement proofing deletion with confirmation
  toast.info('Delete feature coming soon')
}

const handleSelectProofing = (id, checked) => {
  if (checked) {
    if (!selectedProofing.value.includes(id)) {
      selectedProofing.value.push(id)
    }
  } else {
    selectedProofing.value = selectedProofing.value.filter(proofId => proofId !== id)
  }
}

const showDetailSidebar = ref(false)
const selectedProofingId = ref(null)

const handleViewDetails = proofingPhase => {
  selectedProofingId.value = proofingPhase.id
  showDetailSidebar.value = true
}

const handleBrowseProofing = () => {
  router.push({ name: 'proofing' })
}

const handleSearch = async () => {
  if (!searchQuery.value || !searchQuery.value.trim()) {
    handleClearSearch()
    return
  }
  isSearching.value = true
  try {
    await resetToFirstPage()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to search proofing.',
    })
  } finally {
    isSearching.value = false
  }
}

const handleClearSearch = async () => {
  searchQuery.value = ''
  isSearching.value = true
  try {
    await resetToFirstPage()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to clear search.',
    })
  } finally {
    isSearching.value = false
  }
}

onMounted(async () => {
  try {
    await fetch()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to load starred proofing.',
    })
  }
})
</script>
