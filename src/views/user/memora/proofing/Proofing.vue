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
        title="Proofing"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        sort-label="Sort proofing by"
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
          v-else-if="sortedProofing.length === 0"
          message="No proofing found"
          description="Create a proofing phase to allow clients to review and provide feedback on media."
          action-label="Create New Proofing"
          :icon="Eye"
          action-icon="Plus"
          @action="handleCreateProofing"
        />

        <!-- Proofing Grid -->
        <TransitionGroup
          v-else
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
        empty-message="No proofing found"
        empty-action-label="Create New Proofing"
        :empty-icon="Eye"
        :get-subtitle="getSubtitle"
        :get-icon="() => Eye"
        :get-status="item => item.status"
        :show-move-to="false"
        :show-view-details="true"
        @select="handleSelectProofing"
        @star-click="toggleStar"
        @item-click="handleProofingClick"
        @empty-action="handleCreateProofing"
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
import { Eye, Plus } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import LoadingState from '@/components/molecules/LoadingState.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ProofingCard from '@/components/molecules/ProofingCard.vue'
import CollectionsTable from '@/components/organisms/CollectionsTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import ProofingDetailSidebar from '@/components/organisms/ProofingDetailSidebar.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProofingStore } from '@/stores/proofing'
import { useErrorHandler } from '@/composables/useErrorHandler'
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

const proofing = computed(() => proofingStore.proofings)
const isLoading = computed(() => proofingStore.isLoading)
const selectedProofing = ref([])
const showDetailSidebar = ref(false)
const selectedProofingId = ref(null)

const handleSelectProofing = (id, checked) => {
  if (checked) {
    if (!selectedProofing.value.includes(id)) {
      selectedProofing.value.push(id)
    }
  } else {
    selectedProofing.value = selectedProofing.value.filter(proofId => proofId !== id)
  }
}

const getSubtitle = proofingPhase => {
  const parts = []
  // Only show essential info on card - rest in detail sidebar
  if (proofingPhase.mediaCount !== undefined) {
    parts.push(`${proofingPhase.mediaCount} media`)
  }
  const status = proofingPhase.status || 'draft'
  parts.push(status)
  return parts.join(' • ')
}

// Filter and sort proofing
const filteredProofing = computed(() => {
  let filtered = [...proofing.value]

  // Search filter
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

const handleCreateProofing = async () => {
  try {
    const newProofing = await proofingStore.createProofing(null, {
      name: 'New Proofing',
    })
    toast.success('Proofing created', {
      description: 'Your new proofing has been created.',
    })
    // Navigate to the proofing phase view
    if (newProofing.projectId) {
      router.push({
        name: 'projectProofing',
        params: { id: newProofing.projectId },
        query: { proofingId: newProofing.id },
      })
    } else {
      // For standalone proofing, we'll navigate to a detail view
      // For now, just refresh the list
      await proofingStore.fetchAllProofing()
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to create proofing.',
    })
  }
}

const handleProofingClick = proofingPhase => {
  if (proofingPhase.projectId) {
    router.push({
      name: 'projectProofing',
      params: { id: proofingPhase.projectId },
      query: { proofingId: proofingPhase.id },
    })
  } else {
    // For standalone proofing, navigate to a detail view
    // For now, we'll use the project route structure but with a standalone flag
    router.push({
      name: 'projectProofing',
      params: { id: 'standalone' },
      query: { proofingId: proofingPhase.id },
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

const handleViewDetails = proofingPhase => {
  selectedProofingId.value = proofingPhase.id
  showDetailSidebar.value = true
}

onMounted(async () => {
  try {
    await proofingStore.fetchAllProofing()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to load proofing.',
    })
  }
})
</script>
