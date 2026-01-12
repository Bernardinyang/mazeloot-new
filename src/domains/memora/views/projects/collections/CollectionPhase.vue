<template>
  <DashboardLayout>
    <template #breadcrumb>
      <div class="flex items-center gap-2">
        <router-link :to="{ name: 'projects' }" class="hover:underline">Projects</router-link>
        <span>/</span>
        <router-link
          :to="{ name: 'projectDashboard', params: { id: projectId } }"
          class="hover:underline"
        >
          {{ project?.name }}
        </router-link>
        <span>/</span>
        <span>Collections</span>
      </div>
    </template>

    <div v-if="isLoading || isLoadingCollections" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
    </div>

    <div v-else-if="project" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 :class="theme.textPrimary" class="text-2xl font-bold">Collections</h1>
          <p :class="theme.textSecondary" class="mt-1">Final approved media for sharing</p>
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            @click="handleCreateCollection"
          >
            Create Collection
          </Button>
        </div>
      </div>

      <!-- Project Context Info -->
      <div :class="[theme.bgCard, theme.borderCard, 'border rounded-xl p-4']">
        <div class="flex items-center justify-between">
          <div>
            <p :class="theme.textPrimary" class="font-medium">Project: {{ project.name }}</p>
            <p :class="theme.textSecondary" class="text-sm mt-1">
              Collections inherit project settings (media sets, presets, watermarks)
            </p>
          </div>
        </div>
      </div>

      <!-- Collections List -->
      <div v-if="collections.length > 0" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="collection in collections"
            :key="collection.id"
            :class="[
              theme.bgCard,
              theme.borderCard,
              'border rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow',
            ]"
            @click="handleCollectionClick(collection)"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 :class="theme.textPrimary" class="text-lg font-semibold">
                {{ collection.name }}
              </h3>
              <div
                :class="[
                  collection.status === 'active' ? 'bg-green-500' : 'bg-gray-500',
                  'text-white text-xs px-2 py-1 rounded-full',
                ]"
              >
                {{ capitalize(collection.status) }}
              </div>
            </div>
            <p :class="theme.textSecondary" class="text-sm mb-4">
              {{ collection.description || 'No description' }}
            </p>
            <div class="flex items-center justify-between text-sm">
              <span :class="theme.textSecondary">{{ collection.itemCount || 0 }} items</span>
              <ChevronRight class="h-4 w-4" :class="theme.textSecondary" />
            </div>
          </div>
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
      </div>

      <div v-else-if="!isLoadingCollections" class="text-center py-12">
        <p :class="theme.textSecondary" class="mb-4">No collections created yet</p>
        <Button
          variant="primary"
          @click="handleCreateCollection"
        >
          Create First Collection
        </Button>
      </div>
    </div>

    <!-- Create Collection Dialog -->
    <CreateCollectionDialog
      v-model:open="showCreateDialog"
      :is-submitting="isCreatingCollection"
      @create="handleCreateCollectionSubmit"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, ChevronRight } from 'lucide-vue-next'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import CreateCollectionDialog from '@/shared/components/organisms/CreateCollectionDialog.vue'
import Pagination from '@/shared/components/molecules/Pagination.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useProjectStore } from '@/domains/memora/stores/project'
import { useGalleryStore } from '@/shared/stores/gallery'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination.js'
import { useCollectionsApi } from '@/domains/memora/api/collections'
import { toast } from '@/shared/utils/toast'
import { capitalize } from '@/shared/lib/utils'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()

const projectStore = useProjectStore()
const galleryStore = useGalleryStore()
const collectionsApi = useCollectionsApi()
const { handleError } = useErrorHandler()

const projectId = computed(() => route.params.id)
const project = ref(null)
const showCreateDialog = ref(false)
const isCreatingCollection = ref(false)
const isLoading = ref(true)

/**
 * Fetch function for pagination
 */
const fetchProjectCollections = async params => {
  return await collectionsApi.fetchProjectCollections(projectId.value, params)
}

// Use async pagination composable
const {
  data: collections,
  pagination,
  isLoading: isLoadingCollections,
  fetch: fetchCollections,
  goToPage,
  resetToFirstPage,
  setPerPage,
} = useAsyncPagination(fetchProjectCollections, {
  initialPage: 1,
  initialPerPage: 10,
  autoFetch: false, // We'll call fetch manually after loading project
})

const loadProject = async () => {
  isLoading.value = true
  try {
    const projectData = await projectStore.fetchProject(projectId.value)
    project.value = projectData

    // Load collections with pagination
    await fetchCollections()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to load project.',
    })
  } finally {
    isLoading.value = false
  }
}

const handleCreateCollection = () => {
  showCreateDialog.value = true
}

const handleCreateCollectionSubmit = async data => {
  if (isCreatingCollection.value) return
  isCreatingCollection.value = true
  try {
    const newCollection = await galleryStore.createCollection({
      ...data,
      projectId: projectId.value,
    })

    toast.success('Collection created', {
      description: 'Your new collection has been created and linked to this project.',
    })

    showCreateDialog.value = false
    // Refresh collections list and reset to first page
    await resetToFirstPage()

    // Route to the new collection's photos page
    router.push({
      name: 'collectionPhotos',
      params: { uuid: newCollection.id },
    })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to create collection.',
    })
  } finally {
    isCreatingCollection.value = false
  }
}

const handleCollectionClick = collection => {
  router.push({
    name: 'collectionPhotos',
    params: { uuid: collection.id },
  })
}

onMounted(() => {
  loadProject()
})
</script>
