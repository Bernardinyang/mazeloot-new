<template>
  <DashboardLayout>
    <template #breadcrumb> Projects </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        title="Projects"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        sort-label="Sort projects by"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      >
        <template #actions>
          <Button
            variant="ghost"
            size="sm"
            :class="['text-sm', theme.textSecondary, theme.bgButtonHover]"
            @click="handleViewPresets"
          >
            View Presets
          </Button>

          <!-- New Project Button -->
          <Button
            :class="['bg-teal-500 hover:bg-teal-600 text-white']"
            @click="handleCreateProject"
          >
            New Project
          </Button>
        </template>
      </PageHeader>

      <!-- Projects Grid View -->
      <div v-if="viewMode === 'grid'">
        <!-- Loading State -->
        <LoadingState v-if="isLoading" message="Loading projects..." />

        <!-- Empty State -->
        <EmptyState
          v-else-if="sortedProjects.length === 0"
          message="No projects found"
          description="Create a project to organize your selections, proofing, and collections in one place."
          action-label="Create New Project"
          :icon="Folder"
          action-icon="Plus"
          @action="handleCreateProject"
        />

        <!-- Projects Grid -->
        <TransitionGroup
          v-else
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
        empty-message="No projects found"
        empty-action-label="Create New Project"
        :empty-icon="Folder"
        :get-subtitle="getSubtitle"
        :get-icon="() => Folder"
        :show-move-to="false"
        @select="handleSelectProject"
        @star-click="toggleStar"
        @item-click="handleProjectClick"
        @empty-action="handleCreateProject"
        @edit="handleEditProject"
        @delete="handleDeleteProject"
        @view-details="handleViewDetails"
      />
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="pagination.totalPages > 1 || pagination.total > 0"
      :current-page="pagination.page"
      :limit="pagination.limit"
      :total="pagination.total"
      :total-pages="pagination.totalPages"
      :show-page-size="true"
      @page-change="goToPage"
      @page-size-change="setPerPage"
    />

    <!-- Project Detail Sidebar -->
    <ProjectDetailSidebar
      v-model="showDetailSidebar"
      :project-id="selectedProjectId"
      @edit="handleEditProject"
    />

    <!-- Create Project Dialog -->
    <CreateProjectDialog
      v-model:open="showCreateProjectDialog"
      :is-submitting="isCreatingProject"
      @create="handleCreateProjectSubmit"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Folder, Plus } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import LoadingState from '@/components/molecules/LoadingState.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ProjectCard from '@/components/molecules/ProjectCard.vue'
import CollectionsTable from '@/components/organisms/CollectionsTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import CreateProjectDialog from '@/components/organisms/CreateProjectDialog.vue'
import ProjectDetailSidebar from '@/components/organisms/ProjectDetailSidebar.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProjectStore } from '@/stores/project'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useAsyncPagination } from '@/composables/useAsyncPagination.js'
import { useProjectsApi } from '@/api/projects'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()
const router = useRouter()
const projectStore = useProjectStore()
const { handleError } = useErrorHandler()
const projectsApi = useProjectsApi()

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

const showCreateProjectDialog = ref(false)
const isCreatingProject = ref(false)

const selectedProjects = ref([])
const showDetailSidebar = ref(false)
const selectedProjectId = ref(null)

/**
 * Fetch function for pagination
 */
const fetchProjects = async params => {
  const fetchParams = {
    parentId: null, // Only show root-level projects
    ...params,
  }

  // Add search parameter
  if (searchQuery.value && searchQuery.value.trim()) {
    fetchParams.search = searchQuery.value.trim()
  }

  return await projectsApi.fetchProjects(fetchParams)
}

// Use async pagination composable
const {
  data: projects,
  pagination,
  isLoading,
  fetch,
  goToPage,
  resetToFirstPage,
  setPerPage,
} = useAsyncPagination(fetchProjects, {
  initialPage: 1,
  initialPerPage: 10,
  autoFetch: false, // We'll call fetch manually in onMounted
  watchForReset: [sortBy], // Reset to page 1 when sort changes (search only on button click)
})

const handleSelectProject = (id, checked) => {
  if (checked) {
    if (!selectedProjects.value.includes(id)) {
      selectedProjects.value.push(id)
    }
  } else {
    selectedProjects.value = selectedProjects.value.filter(projId => projId !== id)
  }
}

const getSubtitle = project => {
  const parts = []
  // Only show essential info on card - rest in detail sidebar
  if (project.hasSelections || project.hasProofing || project.hasCollections) {
    const phases = []
    if (project.hasSelections) phases.push('Selections')
    if (project.hasProofing) phases.push('Proofing')
    if (project.hasCollections) phases.push('Collections')
    parts.push(phases.join(', '))
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

const handleCreateProject = () => {
  showCreateProjectDialog.value = true
}

const handleCreateProjectSubmit = async data => {
  if (isCreatingProject.value) return
  isCreatingProject.value = true
  try {
    const newProject = await projectStore.createProject(data)
    toast.success('Project created', {
      description: 'Your new project has been created with selected phases.',
    })
    showCreateProjectDialog.value = false
    // Refresh projects list and reset to first page
    await resetToFirstPage()
    // Route to the project dashboard
    router.push({
      name: 'projectDashboard',
      params: { id: newProject.id },
    })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to create project.',
    })
  } finally {
    isCreatingProject.value = false
  }
}

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

const handleViewDetails = project => {
  selectedProjectId.value = project.id
  showDetailSidebar.value = true
}

const handleViewPresets = () => {
  router.push({ name: 'presetSettings' })
}

onMounted(async () => {
  try {
    await fetch()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to load projects.',
    })
  }
})
</script>
