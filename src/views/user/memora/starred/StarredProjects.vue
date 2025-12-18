<template>
  <DashboardLayout>
    <template #breadcrumb> Starred Projects </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        title="Starred Projects"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        sort-label="Sort projects by"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      />

      <!-- Loading State -->
      <LoadingState v-if="isLoading" message="Loading starred projects..." />

      <!-- Empty State -->
      <EmptyState
        v-else-if="sortedProjects.length === 0"
        message="No starred projects found"
        description="Star projects to quickly access them from this page."
        action-label="Browse Projects"
        :icon="Folder"
        action-icon="ArrowRight"
        @action="handleBrowseProjects"
      />

      <!-- Projects Grid View -->
      <div v-else-if="viewMode === 'grid'">
        <TransitionGroup
          name="list"
          tag="div"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative"
        >
          <ProjectCard
            v-for="(project, index) in sortedProjects"
            :key="project.id"
            :project="project"
            :index="index"
            @click="handleProjectClick"
            @star-click="toggleStar"
            @edit="handleEditProject"
            @delete="handleDeleteProject"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <!-- Projects List View -->
      <CollectionsTable
        v-else
        :items="sortedProjects"
        :loading="isLoading"
        :selected-items="selectedProjects"
        empty-message="No starred projects found"
        empty-action-label="Browse Projects"
        :empty-icon="Folder"
        :get-subtitle="getSubtitle"
        :get-icon="() => Folder"
        :show-move-to="false"
        @select="handleSelectProject"
        @star-click="toggleStar"
        @item-click="handleProjectClick"
        @empty-action="handleBrowseProjects"
        @edit="handleEditProject"
        @delete="handleDeleteProject"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Folder, ArrowRight } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ProjectCard from '@/components/molecules/ProjectCard.vue'
import CollectionsTable from '@/components/organisms/CollectionsTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import LoadingState from '@/components/molecules/LoadingState.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProjectStore } from '@/stores/project'
import { useErrorHandler } from '@/composables/useErrorHandler'
import ProjectDetailSidebar from '@/components/organisms/ProjectDetailSidebar.vue'
import { toast } from 'vue-sonner'

const theme = useThemeClasses()
const router = useRouter()
const projectStore = useProjectStore()
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
]

const selectedProjects = ref([])
const isLoading = computed(() => projectStore.isLoading)

const projects = computed(() => {
  // Filter only starred projects
  return projectStore.projects.filter(p => p.starred || p.isStarred)
})

const getSubtitle = project => {
  const parts = []
  if (project.hasSelections || project.hasProofing || project.hasCollections) {
    const phases = []
    if (project.hasSelections) phases.push('Selections')
    if (project.hasProofing) phases.push('Proofing')
    if (project.hasCollections) phases.push('Collections')
    parts.push(phases.join(', '))
  }
  const date = project.date || project.createdAt
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

// Filter and sort projects
const filteredProjects = computed(() => {
  let filtered = [...projects.value]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(project => {
      const name = (project.name || '').toLowerCase()
      const desc = (project.description || '').toLowerCase()
      return name.includes(query) || desc.includes(query)
    })
  }

  return filtered
})

const sortedProjects = computed(() => {
  const sorted = [...filteredProjects.value]

  switch (sortBy.value) {
    case 'created-new-old':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'created-old-new':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'name-a-z':
      return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    case 'name-z-a':
      return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
    default:
      return sorted
  }
})

const handleProjectClick = project => {
  router.push({
    name: 'projectDashboard',
    params: { id: project.id },
  })
}

const toggleStar = async project => {
  try {
    await projectStore.toggleStar(project.id)
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update star status.',
    })
  }
}

const handleEditProject = project => {
  // TODO: Implement project editing
  toast.info('Edit feature coming soon')
}

const handleDeleteProject = async project => {
  // TODO: Implement project deletion with confirmation
  toast.info('Delete feature coming soon')
}

const handleSelectProject = (id, checked) => {
  if (checked) {
    if (!selectedProjects.value.includes(id)) {
      selectedProjects.value.push(id)
    }
  } else {
    selectedProjects.value = selectedProjects.value.filter(projId => projId !== id)
  }
}

const handleBrowseProjects = () => {
  router.push({ name: 'projects' })
}

onMounted(async () => {
  try {
    await projectStore.fetchProjects({ parentId: null })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to load starred projects.',
    })
  }
})
</script>
