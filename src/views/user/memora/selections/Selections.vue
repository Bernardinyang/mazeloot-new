<template>
  <DashboardLayout>
    <template #breadcrumb> Selections </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        title="Selections"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        sort-label="Sort selections by"
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
          message="No selections found"
          description="Get started by creating your first selection to organize and manage your media."
          action-label="Create New Selection"
          :icon="CheckSquare"
          action-icon="Plus"
          @action="handleCreateSelection"
        />

        <!-- Selections Grid -->
        <TransitionGroup
          v-else
          name="list"
          tag="div"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative"
        >
          <SelectionCard
            v-for="(selection, index) in sortedSelections"
            :key="selection.id"
            :selection="selection"
            :index="index"
            @click="handleSelectionClick"
            @star-click="toggleStar"
            @edit="handleEditSelection"
            @delete="handleDeleteSelection"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <!-- Selections List View -->
      <CollectionsTable
        v-else
        :items="sortedSelections"
        :loading="isLoading"
        :selected-items="selectedSelections"
        empty-message="No selections found"
        empty-action-label="Create New Selection"
        :empty-icon="CheckSquare"
        :get-subtitle="getSubtitle"
        :get-icon="() => CheckSquare"
        :get-status="item => item.status"
        :show-move-to="false"
        :show-view-details="true"
        @select="handleSelectSelection"
        @star-click="toggleStar"
        @item-click="handleSelectionClick"
        @empty-action="handleCreateSelection"
        @edit="handleEditSelection"
        @delete="handleDeleteSelection"
        @view-details="handleViewDetails"
      />
    </div>

    <!-- Selection Detail Sidebar -->
    <SelectionDetailSidebar v-model="showDetailSidebar" :selection-id="selectedSelectionId" />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CheckSquare, Plus } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import LoadingState from '@/components/molecules/LoadingState.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import SelectionCard from '@/components/molecules/SelectionCard.vue'
import CollectionsTable from '@/components/organisms/CollectionsTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import SelectionDetailSidebar from '@/components/organisms/SelectionDetailSidebar.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSelectionStore } from '@/stores/selection'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { toast } from 'vue-sonner'

const theme = useThemeClasses()
const router = useRouter()
const selectionStore = useSelectionStore()
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

const selections = computed(() => selectionStore.selections)
const isLoading = computed(() => selectionStore.isLoading)
const selectedSelections = ref([])
const showDetailSidebar = ref(false)
const selectedSelectionId = ref(null)

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

const handleCreateSelection = async () => {
  try {
    // Create standalone selection (no projectId)
    const newSelection = await selectionStore.createSelection(null, {
      name: 'New Selection',
    })
    toast.success('Selection created', {
      description: 'Your new selection has been created.',
    })
    // Navigate to the selection phase view
    if (newSelection.projectId) {
      router.push({
        name: 'projectSelections',
        params: { id: newSelection.projectId },
        query: { selectionId: newSelection.id },
      })
    } else {
      // For standalone selections, we'll navigate to a detail view
      // For now, just refresh the list
      await selectionStore.fetchAllSelections()
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to create selection.',
    })
  }
}

const handleSelectionClick = selection => {
  if (selection.projectId) {
    router.push({
      name: 'projectSelections',
      params: { id: selection.projectId },
      query: { selectionId: selection.id },
    })
  } else {
    // For standalone selections, navigate to a detail view
    // For now, we'll use the project route structure but with a standalone flag
    router.push({
      name: 'projectSelections',
      params: { id: 'standalone' },
      query: { selectionId: selection.id },
    })
  }
}

const toggleStar = async selection => {
  try {
    await selectionStore.toggleStar(selection.id)
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update star status.',
    })
  }
}

const handleEditSelection = selection => {
  // TODO: Implement selection editing
  toast.info('Edit feature coming soon')
}

const handleDeleteSelection = async selection => {
  // TODO: Implement selection deletion with confirmation
  toast.info('Delete feature coming soon')
}

const handleViewDetails = selection => {
  selectedSelectionId.value = selection.id
  showDetailSidebar.value = true
}

onMounted(async () => {
  try {
    await selectionStore.fetchAllSelections()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to load selections.',
    })
  }
})
</script>
