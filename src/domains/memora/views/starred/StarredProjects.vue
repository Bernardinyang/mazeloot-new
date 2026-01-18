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
        :is-searching="isSearching"
        sort-label="Sort projects by"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
        @search="handleSearch"
        @clear="handleClearSearch"
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
      <ProjectsTable
        v-else
        :items="sortedProjects"
        :loading="isLoading"
        :selected-items="selectedProjects"
        empty-message="No starred projects found"
        empty-action-label="Browse Projects"
        :empty-icon="Folder"
        :get-subtitle="getSubtitle"
        :get-icon="() => Folder"
        :get-starred="item => item.isStarred || item.starred || false"
        :show-view-details="true"
        @select="handleSelectProject"
        @star-click="toggleStar"
        @item-click="handleProjectClick"
        @empty-action="handleBrowseProjects"
        @edit="handleEditProject"
        @delete="handleDeleteProject"
        @view-details="handleViewDetails"
      />
    </div>

    <!-- Project Detail Sidebar -->
    <ProjectDetailSidebar
      v-model="showDetailSidebar"
      :project-id="selectedProjectId"
      @edit="handleEditProject"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Folder, ArrowRight } from '@/shared/utils/lucideAnimated'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import PageHeader from '@/shared/components/molecules/PageHeader.vue'
import ProjectCard from '@/shared/components/molecules/ProjectCard.vue'
import ProjectsTable from '@/shared/components/organisms/ProjectsTable.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import LoadingState from '@/shared/components/molecules/LoadingState.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useProjectStore } from '@/domains/memora/stores/project'
import { useProjectsApi } from '@/domains/memora/api/projects'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination'
import ProjectDetailSidebar from '@/shared/components/organisms/ProjectDetailSidebar.vue'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const router = useRouter()
const projectStore = useProjectStore()
const projectsApi = useProjectsApi()
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
]

const selectedProjects = ref([])

const mapSortToBackend = frontendSort => {
  const mapping = {
    'created-new-old': 'created-desc',
    'created-old-new': 'created-asc',
    'name-a-z': 'name-asc',
    'name-z-a': 'name-desc',
  }
  return mapping[frontendSort] || 'created-desc'
}

const fetchStarredProjects = async params => {
  const fetchParams = {
    parentId: null,
    starred: true,
    ...params,
  }

  if (searchQuery.value && searchQuery.value.trim()) {
    fetchParams.search = searchQuery.value.trim()
  }

  if (sortBy.value) {
    fetchParams.sortBy = mapSortToBackend(sortBy.value)
  }

  const result = await projectsApi.fetchProjects(fetchParams)
  return Array.isArray(result) ? result : result?.data || []
}

const {
  data: projects,
  pagination,
  isLoading,
  fetch,
  resetToFirstPage,
} = useAsyncPagination(fetchStarredProjects, {
  initialPage: 1,
  initialPerPage: 1000,
  autoFetch: false,
  watchForReset: [sortBy],
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

const sortedProjects = computed(() => {
  return [...projects.value]
})

const handleProjectClick = project => {
  router.push({
    name: 'projectDashboard',
    params: { id: project.id },
  })
}

const toggleStar = async project => {
  if (!project || !project.id) return
  
  const wasStarred = project.isStarred || project.starred || false
  const newStarredState = !wasStarred
  const projectIndex = projects.value.findIndex(p => p.id === project.id || p.id === String(project.id))

  try {
    // Sync with server
    const result = await projectStore.toggleStar(project.id)

    // Update with server response - check multiple possible response formats
    const serverStarredState = result?.starred ?? result?.data?.starred ?? result?.data?.data?.starred ?? newStarredState
    
    if (projectIndex !== -1) {
      // If unstarred in starred view, remove from list
      if (!serverStarredState) {
        projects.value.splice(projectIndex, 1)
        // Update pagination total if available
        if (pagination && pagination.value && pagination.value.total > 0) {
          pagination.value.total -= 1
        }
      } else {
        // Update the item state
        projects.value[projectIndex] = {
          ...projects.value[projectIndex],
          isStarred: serverStarredState,
          starred: serverStarredState,
        }
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

const showDetailSidebar = ref(false)
const selectedProjectId = ref(null)

const handleViewDetails = project => {
  selectedProjectId.value = project?.id || project?.uuid || null
  showDetailSidebar.value = true
}

const handleBrowseProjects = () => {
  router.push({ name: 'projects' })
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

onMounted(async () => {
  try {
    await fetch()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to load starred projects.',
    })
  }
})
</script>
