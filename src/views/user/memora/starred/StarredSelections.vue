<template>
  <DashboardLayout>
    <template #breadcrumb> Starred Selections </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        title="Starred Selections"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        sort-label="Sort selections by"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      />

      <!-- Loading State -->
      <LoadingState v-if="isLoading" message="Loading starred selections..." />

      <!-- Empty State -->
      <EmptyState
        v-else-if="sortedSelections.length === 0"
        message="No starred selections found"
        description="Star selections to quickly access them from this page."
        action-label="Browse Selections"
        :icon="CheckSquare"
        action-icon="ArrowRight"
        @action="handleBrowseSelections"
      />

      <!-- Selections Grid View -->
      <div v-else-if="viewMode === 'grid'">
        <TransitionGroup
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
        empty-message="No starred selections found"
        empty-action-label="Browse Selections"
        :empty-icon="CheckSquare"
        :get-subtitle="getSubtitle"
        :get-icon="() => CheckSquare"
        :get-status="item => item.status"
        :show-move-to="false"
        :show-view-details="true"
        @select="handleSelectSelection"
        @star-click="toggleStar"
        @item-click="handleSelectionClick"
        @empty-action="handleBrowseSelections"
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
import { CheckSquare, ArrowRight } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import SelectionCard from '@/components/molecules/SelectionCard.vue'
import CollectionsTable from '@/components/organisms/CollectionsTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import LoadingState from '@/components/molecules/LoadingState.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSelectionStore } from '@/stores/selection'
import { useErrorHandler } from '@/composables/useErrorHandler'
import SelectionDetailSidebar from '@/components/organisms/SelectionDetailSidebar.vue'
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

const selectedSelections = ref([])
const isLoading = computed(() => selectionStore.isLoading)

const selections = computed(() => {
  // Filter only starred selections
  return selectionStore.selections.filter(s => s.starred || s.isStarred)
})

const getSubtitle = selection => {
  const parts = []
  if (selection.projectId && selection.projectName) {
    parts.push(`Project: ${selection.projectName}`)
  }
  if (selection.mediaCount !== undefined) {
    parts.push(`${selection.mediaCount} media`)
  }
  if (selection.selectedMediaCount !== undefined && selection.selectedMediaCount > 0) {
    parts.push(`${selection.selectedMediaCount} selected`)
  }
  const status = selection.status || 'draft'
  parts.push(status)
  const date = selection.createdAt
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

// Filter and sort selections
const filteredSelections = computed(() => {
  let filtered = [...selections.value]

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

const handleSelectionClick = selection => {
  if (selection.projectId) {
    router.push({
      name: 'projectSelections',
      params: { id: selection.projectId },
      query: { selectionId: selection.id },
    })
  } else {
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

const handleSelectSelection = (id, checked) => {
  if (checked) {
    if (!selectedSelections.value.includes(id)) {
      selectedSelections.value.push(id)
    }
  } else {
    selectedSelections.value = selectedSelections.value.filter(selId => selId !== id)
  }
}

const showDetailSidebar = ref(false)
const selectedSelectionId = ref(null)

const handleViewDetails = selection => {
  selectedSelectionId.value = selection.id
  showDetailSidebar.value = true
}

const handleBrowseSelections = () => {
  router.push({ name: 'selections' })
}

onMounted(async () => {
  try {
    await selectionStore.fetchAllSelections()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to load starred selections.',
    })
  }
})
</script>
