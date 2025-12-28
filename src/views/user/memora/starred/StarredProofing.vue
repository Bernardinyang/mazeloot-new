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
        sort-label="Sort proofing by"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      />

      <!-- Loading State -->
      <LoadingState v-if="isLoading" message="Loading starred proofing..." />

      <!-- Empty State -->
      <EmptyState
        v-else-if="sortedProofing.length === 0"
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
            v-for="(proofing, index) in sortedProofing"
            :key="proofing.id"
            :proofing="proofing"
            :index="index"
            @click="handleProofingClick"
            @star-click="toggleStar"
            @edit="handleEditProofing"
            @delete="handleDeleteProofing"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <!-- Proofing List View -->
      <CollectionsTable
        v-else
        :items="sortedProofing"
        :loading="isLoading"
        :selected-items="selectedProofing"
        empty-message="No starred proofing found"
        empty-action-label="Browse Proofing"
        :empty-icon="Eye"
        :get-subtitle="getSubtitle"
        :get-icon="() => Eye"
        :get-status="item => item.status"
        :show-move-to="false"
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
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ProofingCard from '@/components/molecules/ProofingCard.vue'
import CollectionsTable from '@/components/organisms/CollectionsTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import LoadingState from '@/components/molecules/LoadingState.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProofingStore } from '@/stores/proofing'
import { useErrorHandler } from '@/composables/useErrorHandler'
import ProofingDetailSidebar from '@/components/organisms/ProofingDetailSidebar.vue'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()
const router = useRouter()
const proofingStore = useProofingStore()
const { handleError } = useErrorHandler()

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

const selectedProofing = ref([])
const isLoading = computed(() => proofingStore.isLoading)

const proofing = computed(() => {
  // Filter only starred proofing
  return proofingStore.proofings.filter(p => p.starred || p.isStarred)
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

// Filter and sort proofing
const filteredProofing = computed(() => {
  let filtered = [...proofing.value]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(proofingPhase => {
      const name = (proofingPhase.name || '').toLowerCase()
      return name.includes(query)
    })
  }

  return filtered
})

const sortedProofing = computed(() => {
  const sorted = [...filteredProofing.value]

  switch (sortBy.value) {
    case 'created-new-old':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'created-old-new':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'name-a-z':
      return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    case 'name-z-a':
      return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
    case 'status':
      return sorted.sort((a, b) => (a.status || '').localeCompare(b.status || ''))
    default:
      return sorted
  }
})

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
  try {
    await proofingStore.toggleStar(proofingPhase.id)
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update star status.',
    })
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

onMounted(async () => {
  try {
    await proofingStore.fetchAllProofing()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to load starred proofing.',
    })
  }
})
</script>
