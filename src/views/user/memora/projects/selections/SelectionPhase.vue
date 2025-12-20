<template>
  <DashboardLayout>
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as-child>
              <router-link v-if="project?.id" :to="{ name: 'projects' }" class="hover:underline">
                Projects
              </router-link>
              <router-link v-else :to="{ name: 'selections' }" class="hover:underline">
                Selections
              </router-link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="project?.id" />
          <BreadcrumbItem v-if="project?.id">
            <BreadcrumbLink as-child>
              <router-link
                :to="{ name: 'projectDashboard', params: { id: projectId } }"
                class="hover:underline"
              >
                {{ project?.name }}
              </router-link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Selections</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </template>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
    </div>

    <div v-else-if="selection" class="flex gap-6">
      <!-- Sidebar -->
      <div class="w-64 shrink-0">
        <MediaSetsSidebarSection
          :active-tab="'photos'"
          :drag-over-index="dragOverIndex"
          :dragged-set-id="draggedSetId"
          :editing-set-id="editingSetId"
          :editing-set-name="editingSetName"
          :is-loading="isLoading"
          :is-saving-sets="isSavingSets"
          :is-sidebar-collapsed="false"
          :media-sets="mediaSets"
          :selected-set-id="selectedSetId"
          :sorted-media-sets="sortedMediaSets"
          @add-set="mediaSetsSidebar.handleAddSet"
          @select-set="mediaSetsSidebar.handleSelectSet($event)"
          @edit-set="mediaSetsSidebar.handleEditSet($event)"
          @delete-set="mediaSetsSidebar.requestDeleteSet($event)"
          @save-set-name="mediaSetsSidebar.saveSetName($event)"
          @cancel-set-name-edit="mediaSetsSidebar.cancelSetNameEdit"
          @set-drag-start="
            (event, setId, index) => mediaSetsSidebar.handleSetDragStart({ setId, index })
          "
          @set-drag-over="(event, index) => mediaSetsSidebar.handleSetDragOver({ index })"
          @set-drag-leave="mediaSetsSidebar.handleSetDragLeave"
          @set-drop="(event, index) => mediaSetsSidebar.handleSetDrop({ index })"
          @set-drag-end="mediaSetsSidebar.handleSetDragEnd"
          @update:editing-set-name="editingSetName = $event"
        />
      </div>

      <!-- Main Content -->
      <div class="flex-1 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 :class="theme.textPrimary" class="text-2xl font-bold">Selections</h1>
            <p :class="theme.textSecondary" class="mt-1">Upload raw media for client selection</p>
          </div>
          <div class="flex items-center gap-2">
            <Button
              v-if="selection.status === 'completed'"
              variant="outline"
              size="sm"
              :class="[theme.textSecondary, theme.borderSecondary]"
              @click="handleRecover"
            >
              Recover Deleted Media
            </Button>
            <Button
              v-if="selection.status !== 'completed'"
              variant="default"
              size="sm"
              class="bg-teal-500 hover:bg-teal-600 text-white"
              @click="handleComplete"
            >
              Complete Selection
            </Button>
            <Button
              variant="outline"
              size="sm"
              :class="[theme.textSecondary, theme.borderSecondary]"
              @click="handleCopyFilenames"
            >
              Copy Filenames
            </Button>
          </div>
        </div>

        <!-- Status Banner -->
        <div
          v-if="selection.status === 'completed'"
          :class="[theme.bgCard, theme.borderCard, 'border rounded-xl p-4']"
        >
          <div class="flex items-center justify-between">
            <div>
              <p :class="theme.textPrimary" class="font-medium">Selection Completed</p>
              <p :class="theme.textSecondary" class="text-sm mt-1">
                Unselected media will be permanently deleted in {{ daysUntilDeletion }} days.
              </p>
            </div>
            <div v-if="recoverableCount > 0" class="text-sm" :class="theme.textSecondary">
              {{ recoverableCount }} file(s) can be recovered
            </div>
          </div>
        </div>

        <!-- Upload Area -->
        <div
          v-if="selection.status !== 'completed'"
          :class="[
            theme.bgCard,
            theme.borderCard,
            'border-2 border-dashed rounded-xl p-8 text-center',
          ]"
        >
          <input
            ref="fileInputRef"
            accept="image/*,video/*"
            class="hidden"
            multiple
            type="file"
            @change="handleFileSelect"
          />
          <Button
            variant="outline"
            size="lg"
            :class="[theme.borderSecondary, theme.textPrimary]"
            @click="fileInputRef?.click()"
          >
            <Upload class="mr-2 h-5 w-5" />
            Upload Raw Media
          </Button>
          <p :class="theme.textSecondary" class="text-sm mt-2">
            Upload all raw footage for client to select from
          </p>
        </div>

        <!-- Media Grid -->
        <div v-if="filteredMediaItems.length > 0" class="space-y-4">
          <div class="flex items-center justify-between">
            <p :class="theme.textPrimary" class="font-medium">
              {{ filteredMediaItems.length }} media item(s)
            </p>
            <div class="flex items-center gap-2 text-sm" :class="theme.textSecondary">
              <span>Selected: {{ selectedCount }}</span>
              <span>/</span>
              <span>Total: {{ filteredMediaItems.length }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              v-for="item in filteredMediaItems"
              :key="item.id"
              :class="[
                theme.bgCard,
                theme.borderCard,
                'border rounded-lg p-2 cursor-pointer transition-all',
                item.isSelected ? 'ring-2 ring-teal-500' : '',
              ]"
              @click="handleToggleSelection(item.id)"
            >
              <img
                :src="item.thumbnail || item.url"
                :alt="item.title"
                class="w-full aspect-square object-cover rounded mb-2"
              />
              <div class="flex items-center justify-between">
                <p :class="theme.textPrimary" class="text-xs truncate">{{ item.title }}</p>
                <CheckCircle2 v-if="item.isSelected" class="h-4 w-4 text-teal-500 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p :class="theme.textSecondary">No media uploaded yet</p>
        </div>
      </div>
    </div>

    <!-- Media Set Delete Confirmation -->
    <DeleteConfirmationModal
      v-model="showDeleteSetModal"
      :is-deleting="isDeletingSet"
      :item-name="setToDelete?.name || 'Media Set'"
      description="This action cannot be undone."
      title="Delete Media Set"
      warning-message="Delete this media set?"
      @cancel="mediaSetsSidebar.cancelDeleteSet"
      @confirm="mediaSetsSidebar.confirmDeleteSet"
    />

    <!-- Create/Edit Set Modal -->
    <CreateEditMediaSetModal
      v-model="showCreateSetModal"
      v-model:name="newSetName"
      v-model:description="newSetDescription"
      :is-creating="isCreatingSet"
      :is-editing="!!editingSetIdInModal"
      @cancel="mediaSetsSidebar.handleCancelCreateSet"
      @confirm="mediaSetsSidebar.handleCreateSet"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, Upload, CheckCircle2 } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shadcn/breadcrumb'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProjectStore } from '@/stores/project'
import { useSelectionStore } from '@/stores/selection'
import { useSelectionHeaderStore } from '@/stores/selectionHeader'
import { useMediaApi } from '@/api/media'
import { useSelectionWorkflow } from '@/composables/useSelectionWorkflow'
import { getDaysUntilDeletion, getRecoverableCount } from '@/utils/autoDeleteService'
import { useSelectionMediaSetsSidebarStore } from '@/stores/selectionMediaSetsSidebar'
import MediaSetsSidebarSection from '@/components/organisms/MediaSetsSidebarSection.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import CreateEditMediaSetModal from '@/components/organisms/CreateEditMediaSetModal.vue'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()

const projectStore = useProjectStore()
const selectionStore = useSelectionStore()
const headerStore = useSelectionHeaderStore()
const mediaApi = useMediaApi()
const mediaSetsSidebar = useSelectionMediaSetsSidebarStore()

// Use storeToRefs for reactive properties that need to be used in templates
const {
  selectedSetId,
  mediaSets,
  sortedMediaSets,
  draggedSetId,
  dragOverIndex,
  editingSetId,
  editingSetName,
  showCreateSetModal,
  newSetName,
  newSetDescription,
  isCreatingSet,
  isSavingSets,
  editingSetIdInModal,
  showDeleteSetModal,
  setToDelete,
  isDeletingSet,
} = storeToRefs(mediaSetsSidebar)

const projectId = computed(() => route.params.id)
const project = ref(null)
const selection = ref(null)
const mediaItems = ref([])
const filteredMediaItems = computed(() => {
  if (!selectedSetId.value) {
    return mediaItems.value
  }
  return mediaItems.value.filter(item => item.setId === selectedSetId.value)
})
const fileInputRef = ref(null)
const isLoading = ref(true)

const selectedCount = computed(() => filteredMediaItems.value.filter(m => m.isSelected).length)
const daysUntilDeletion = computed(() =>
  selection.value ? getDaysUntilDeletion(selection.value.id) : null
)
const recoverableCount = computed(() =>
  selection.value ? getRecoverableCount(selection.value.id) : 0
)

const loadData = async () => {
  isLoading.value = true
  try {
    // Check if this is a standalone selection (via query param) or project-linked
    const selectionIdFromQuery = route.query.selectionId

    if (selectionIdFromQuery) {
      // Load standalone selection directly
      const selectionData = await selectionStore.fetchSelection(selectionIdFromQuery)
      selection.value = selectionData
      // Initialize header store
      headerStore.setSelection(selectionData)
      mediaItems.value = selectionData.media || []
      // Initialize sets sidebar
      mediaSetsSidebar.setContext(selectionData.id, selectionData.mediaSets || [])
      // If it has a projectId, load the project for breadcrumb
      if (selectionData.projectId && projectId.value !== 'standalone') {
        try {
          const projectData = await projectStore.fetchProject(selectionData.projectId)
          project.value = projectData
        } catch (err) {
          // Project not found, but continue with standalone selection
          console.warn('Project not found for selection:', err)
        }
      }
    } else if (projectId.value && projectId.value !== 'standalone') {
      // Load project and its selection phase
      const projectData = await projectStore.fetchProject(projectId.value)
      project.value = projectData

      // Get selection phase
      if (projectData.selections && projectData.selections.length > 0) {
        const selectionData = await selectionStore.fetchSelection(projectData.selections[0].id)
        selection.value = selectionData
        // Initialize header store
        headerStore.setSelection(selectionData)
        mediaItems.value = selectionData.media || []
        // Initialize sets sidebar
        mediaSetsSidebar.setContext(selectionData.id, selectionData.mediaSets || [])
      }
    }
  } catch (error) {
    console.error('Failed to load selection phase:', error)
  } finally {
    isLoading.value = false
  }
}

const loadMediaItems = async () => {
  if (!selection.value) return
  try {
    const media = await mediaApi.fetchPhaseMedia('selection', selection.value.id)
    mediaItems.value = media
  } catch (error) {
    console.error('Failed to load media:', error)
  }
}

const {
  uploadRawMedia,
  markMediaSelected,
  completeSelection,
  recoverDeletedMedia,
  copySelectedFilenames,
} = useSelectionWorkflow({
  selectionId: () => selection.value?.id,
  loadMediaItems,
})

const handleFileSelect = async event => {
  const files = Array.from(event.target.files || [])
  if (files.length === 0) return

  try {
    // Use selected set ID or default to 'highlights' if no set is selected
    const setId = selectedSetId.value || 'highlights'
    await uploadRawMedia(files, setId)
    event.target.value = '' // Reset input
    // Reload media items to show the newly uploaded media
    await loadMediaItems()
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

const handleToggleSelection = async mediaId => {
  if (selection.value?.status === 'completed') return

  try {
    const item = mediaItems.value.find(m => m.id === mediaId)
    if (item && !item.isSelected) {
      await markMediaSelected(mediaId)
    } else {
      // Toggle off
      await mediaApi.updateMedia(mediaId, {
        isSelected: false,
        selectedAt: null,
      })
      await loadMediaItems()
    }
  } catch (error) {
    console.error('Failed to toggle selection:', error)
  }
}

const handleComplete = async () => {
  try {
    await completeSelection()
    await loadData()
  } catch (error) {
    console.error('Failed to complete selection:', error)
  }
}

const handleRecover = async () => {
  try {
    await recoverDeletedMedia()
    await loadData()
  } catch (error) {
    console.error('Failed to recover media:', error)
  }
}

const handleCopyFilenames = async () => {
  try {
    await copySelectedFilenames()
  } catch (error) {
    console.error('Failed to copy filenames:', error)
  }
}

// Watch for selection changes to update sets sidebar
watch(
  () => [selection.value?.id, selection.value?.mediaSets],
  ([id, sets]) => {
    if (id) {
      mediaSetsSidebar.setContext(id || '', sets || [])
    }
  },
  { immediate: true }
)

// Watch for selected set changes to filter media
watch(
  () => selectedSetId.value,
  () => {
    // Media filtering is handled by computed property filteredMediaItems
  }
)

onMounted(() => {
  loadData()
})
</script>
