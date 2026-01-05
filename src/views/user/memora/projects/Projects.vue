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
        :is-searching="isSearching"
        sort-label="Sort projects by"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
        @search="handleSearch"
        @clear="handleClearSearch"
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
            :class="['bg-accent hover:bg-accent/90 text-accent-foreground']"
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
            :is-deleting="isDeletingProject && projectToDelete?.id === project.id"
            @click="handleProjectClick"
            @star-click="toggleStar"
            @edit="handleEditProject"
            @delete="handleDeleteProject"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <!-- Projects List View -->
      <ProjectsTable
        v-else
        :items="sortedProjects"
        :loading="isLoading"
        :selected-items="selectedProjects"
        empty-message="No projects found"
        empty-action-label="Create New Project"
        :empty-icon="Folder"
        :get-subtitle="getSubtitle"
        :get-icon="() => Folder"
        :get-starred="item => item.isStarred || item.starred || false"
        :show-view-details="true"
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
      v-if="!isLoading && (pagination.totalPages > 1 || pagination.total > 0)"
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

    <!-- Edit Project Dialog -->
    <EditProjectDialog
      v-model:open="showEditProjectDialog"
      :project="projectToEdit"
      :is-submitting="isUpdatingProject"
      @update="handleUpdateProject"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :is-deleting="isDeletingProject"
      :item-name="projectToDelete?.name"
      title="Delete Project"
      description="This action cannot be undone."
      warning-message="This will permanently delete the project and all associated phases (selections, proofing, collections), media sets, media, and starred items."
      @cancel="closeDeleteModal"
      @confirm="handleConfirmDeleteProject"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Folder, Plus } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import LoadingState from '@/components/molecules/LoadingState.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import ProjectCard from '@/components/molecules/ProjectCard.vue'
import ProjectsTable from '@/components/organisms/ProjectsTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import CreateProjectDialog from '@/components/organisms/CreateProjectDialog.vue'
import EditProjectDialog from '@/components/organisms/EditProjectDialog.vue'
import ProjectDetailSidebar from '@/components/organisms/ProjectDetailSidebar.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProjectStore } from '@/stores/project'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useAsyncPagination } from '@/composables/useAsyncPagination.js'
import { useProjectsApi } from '@/api/projects'
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation'
import { toast } from '@/utils/toast'
import { storage } from '@/utils/storage'

const theme = useThemeClasses()
const router = useRouter()
const projectStore = useProjectStore()
const { handleError } = useErrorHandler()
const projectsApi = useProjectsApi()

// Storage keys
const VIEW_MODE_STORAGE_KEY = 'mazeloot_projects_view_mode'
const SORT_BY_STORAGE_KEY = 'mazeloot_projects_sort_by'

// View mode and sorting with persistence
const viewMode = ref(storage.get(VIEW_MODE_STORAGE_KEY) || 'grid')
const sortBy = ref(storage.get(SORT_BY_STORAGE_KEY) || 'created-new-old')
const searchQuery = ref('')
const isSearching = ref(false)

// Persist view mode changes
watch(viewMode, () => {
  storage.set(VIEW_MODE_STORAGE_KEY, viewMode.value)
})

// Persist sort changes
watch(sortBy, () => {
  storage.set(SORT_BY_STORAGE_KEY, sortBy.value)
})
const sortOptions = [
  { label: 'Created (New → Old)', value: 'created-new-old' },
  { label: 'Created (Old → New)', value: 'created-old-new' },
  { label: 'Name (A → Z)', value: 'name-a-z' },
  { label: 'Name (Z → A)', value: 'name-z-a' },
]

const showCreateProjectDialog = ref(false)
const isCreatingProject = ref(false)

const showEditProjectDialog = ref(false)
const projectToEdit = ref(null)
const isUpdatingProject = ref(false)

const selectedProjects = ref([])
const showDetailSidebar = ref(false)
const selectedProjectId = ref(null)

// Delete confirmation
const {
  showDeleteModal,
  itemToDelete: projectToDelete,
  isDeleting: isDeletingProject,
  openDeleteModal,
  closeDeleteModal,
  getItemName,
} = useDeleteConfirmation()

/**
 * Map frontend sort values to backend format
 */
const mapSortToBackend = frontendSort => {
  const mapping = {
    'created-new-old': 'created-desc',
    'created-old-new': 'created-asc',
    'name-a-z': 'name-asc',
    'name-z-a': 'name-desc',
  }
  return mapping[frontendSort] || 'created-desc'
}

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

  // Add sort parameter
  if (sortBy.value) {
    fetchParams.sortBy = mapSortToBackend(sortBy.value)
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

// Search handlers
const handleSearch = async () => {
  isSearching.value = true
  try {
    await resetToFirstPage()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to search projects.',
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

// Projects are already sorted by backend, no need for client-side sorting
const sortedProjects = computed(() => {
  return [...projects.value]
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
  // Store original state for error recovery
  const wasStarred = project.isStarred || project.starred || false
  const newStarredState = !wasStarred
  const projectIndex = projects.value.findIndex(p => p.id === project.id)

  try {
    // Optimistic update - update UI immediately
    if (projectIndex !== -1) {
      projects.value[projectIndex] = {
        ...projects.value[projectIndex],
        isStarred: newStarredState,
        starred: newStarredState,
      }
    }

    // Sync with server
    const result = await projectStore.toggleStar(project.id)

    // Update with server response if available
    const serverStarredState = result?.starred ?? result?.data?.starred ?? newStarredState
    if (projectIndex !== -1) {
      projects.value[projectIndex] = {
        ...projects.value[projectIndex],
        isStarred: serverStarredState,
        starred: serverStarredState,
      }
    }
  } catch (error) {
    // Revert on error
    if (projectIndex !== -1) {
      projects.value[projectIndex] = {
        ...projects.value[projectIndex],
        isStarred: wasStarred,
        starred: wasStarred,
      }
    }
    handleError(error, {
      fallbackMessage: 'Failed to update star status.',
    })
  }
}

const handleEditProject = project => {
  projectToEdit.value = project
  showEditProjectDialog.value = true
}

const handleUpdateProject = async data => {
  if (isUpdatingProject.value) return
  isUpdatingProject.value = true
  try {
    await projectStore.updateProject(data.id, data)
    toast.success('Project updated', {
      description: 'The project has been successfully updated.',
    })
    showEditProjectDialog.value = false
    projectToEdit.value = null
    // Refresh projects list
    await fetch()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update project.',
    })
  } finally {
    isUpdatingProject.value = false
  }
}

const handleDeleteProject = project => {
  openDeleteModal(project)
}

const handleConfirmDeleteProject = async () => {
  if (!projectToDelete.value) return

  isDeletingProject.value = true
  try {
    await projectStore.deleteProject(projectToDelete.value.id)

    toast.success('Project deleted', {
      description: `"${getItemName(projectToDelete.value)}" has been permanently deleted.`,
    })

    closeDeleteModal()

    // Refresh projects list
    await fetch()

    // If we're on the project dashboard for the deleted project, redirect to projects list
    const currentRoute = router.currentRoute.value
    if (
      currentRoute.name === 'projectDashboard' &&
      currentRoute.params.id === projectToDelete.value.id
    ) {
      router.push({ name: 'projects' })
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to delete project.',
    })
  } finally {
    isDeletingProject.value = false
  }
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
