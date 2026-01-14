<template>
  <DashboardLayout>
    <template #breadcrumb> Collections </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        title="Collections"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        :is-searching="isSearching"
        sort-label="Sort collections by"
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

          <Button
            variant="accent"
            :icon="Plus"
            @click="handleCreateCollection"
          >
            New Collection
          </Button>
        </template>
      </PageHeader>

      <!-- Collections Grid View -->
      <div v-if="viewMode === 'grid'">
        <!-- Loading State -->
        <div
          v-if="isLoadingCollections"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <div
            v-for="i in 8"
            :key="i"
            :class="[
              'rounded-xl border overflow-hidden animate-pulse',
              theme.bgCard,
              theme.borderCard,
            ]"
          >
            <!-- Image skeleton -->
            <div :class="['aspect-[4/3]', theme.bgSkeleton]"></div>
            <!-- Content skeleton -->
            <div class="p-4 space-y-3">
              <div :class="['h-5 w-3/4 rounded', theme.bgSkeleton]"></div>
              <div class="flex items-center gap-2">
                <div :class="['h-3 w-20 rounded', theme.bgSkeleton]"></div>
                <div :class="['h-1 w-1 rounded-full', theme.bgSkeleton]"></div>
                <div :class="['h-3 w-24 rounded', theme.bgSkeleton]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="sortedCollections.length === 0"
          class="flex items-center justify-center py-16"
        >
          <EmptyState
            message="No collections found"
            action-label="Create New Collection"
            :icon="Folder"
            :action-icon="Plus"
            @action="handleCreateCollection"
          />
        </div>

        <!-- Collections Grid -->
        <TransitionGroup
          v-else
          name="list"
          tag="div"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 relative"
        >
          <CollectionCard
            v-for="(collection, index) in sortedCollections"
            :key="collection.id"
            :style="{ '--index': index }"
            :is-moving="movingCollectionId === String(collection.id)"
            :image-src="collection.image || collection.thumbnail"
            :alt-text="collection.title || collection.name"
            :caption-text="collection.title || collection.name"
            :subtitle="getSubtitle(collection)"
            container-height="auto"
            container-width="100%"
            image-height="240px"
            image-width="100%"
            :rotate-amplitude="12"
            :scale-on-hover="1.05"
            :display-overlay-content="false"
            :show-content="true"
            :show-menu="true"
            :show-star="!collection.icon"
            :is-starred="collection.starred || collection.isStarred || false"
            :badge="collection.badge || false"
            :badge-icon="collection.badgeIcon"
            :icon="collection.isFolder ? Folder : collection.icon"
            :folder-icon="collection.isFolder ? Folder : collection.icon"
            :preview-images="collection.previewImages"
            :is-locked="collection.isLocked || false"
            :is-folder="collection.isFolder || false"
            :collection-data="collection"
            image-container-class="aspect-[4/3]"
            :is-starring="starringCollectionIds.has(String(collection.id))"
            :is-deleting="deletingCollectionIds.has(String(collection.id))"
            :is-duplicating="duplicatingCollectionIds.has(String(collection.id))"
            @click="handleCollectionCardClick(collection)"
            @star-click="toggleStar(collection)"
            @drop="handleMoveToFolder($event, collection)"
            @edit="handleEditCollection(collection)"
            @duplicate="handleDuplicateCollection(collection)"
            @delete="handleDeleteCollection(collection)"
            @share="handleShareCollection(collection)"
            @view-details="handleViewDetails"
          />
        </TransitionGroup>
      </div>

      <!-- Collections List View -->
      <CollectionsTable
        v-else
        :items="sortedCollections"
        :loading="isLoadingCollections"
        :selected-items="selectedCollections"
        empty-message="No collections found"
        empty-action-label="Create New Collection"
        :empty-icon="Folder"
        :subtitle-separator="subtitleSeparator"
        @select="handleSelectCollection"
        @star-click="toggleStar"
        @link-click="handleCopyLink"
        @copy-pin="handleCopyPin"
        @item-click="handleCollectionClick"
        @empty-action="handleCreateCollection"
        @edit="handleEditCollection"
        @duplicate="handleDuplicateCollection"
        @delete="handleDeleteCollection"
        @publish="handlePublishCollection"
        @preview="handlePreviewCollection"
        @move-to="item => handleMoveToFolder(item, null)"
        @view-details="handleViewDetails"
      />
    </div>

    <!-- Collection Detail Sidebar -->
    <CollectionDetailSidebar
      v-model="showCollectionDetailSidebar"
      :collection-id="selectedCollectionId"
      @edit="handleEditCollection"
    />

    <!-- Folder Detail Sidebar -->
    <FolderDetailSidebar
      v-model="showFolderDetailSidebar"
      :folder-id="selectedFolderId"
      @edit="handleEditCollection"
    />

    <!-- Create Collection Dialog -->
    <CreateCollectionDialog
      v-model:open="showCreateDialog"
      :is-submitting="isCreatingCollection"
      @create="handleCreateCollectionSubmit"
    />

    <!-- Edit Collection Dialog -->
    <EditCollectionDialog
      v-model:open="showEditDialog"
      :collection="collectionToEdit"
      @success="handleEditSuccess"
    />

    <!-- Share Collection Modal -->
    <ShareModal
      v-model:open="showShareModal"
      route-name="clientCollection"
      :route-query="{ collectionId: collectionToShare?.id || collectionToShare?.uuid || '' }"
      title="Share Collection"
      description="Share this collection with your client via link, QR code, WhatsApp, or email."
      :password="collectionToShare?.password || collectionToShare?.settings?.privacy?.password || collectionToShare?.collectionPassword || ''"
      password-description="Share this password with visitors to access this collection"
      :pin="collectionToShare?.downloadPin || collectionToShare?.settings?.download?.downloadPin || ''"
      pin-description="Share this PIN with visitors to download from this collection"
      :item-name="collectionToShare?.name || collectionToShare?.title || 'Collection'"
      qr-code-description="Scan this QR code to access the collection"
      :download-file-name="`collection-${collectionToShare?.id || 'qr'}-qr-code.png`"
    />

    <!-- Create Project Dialog -->
    <CreateProjectDialog
      v-model:open="showCreateProjectDialog"
      :is-submitting="isCreatingProject"
      @create="handleCreateProjectSubmit"
    />

    <!-- Create Folder Dialog -->
    <CreateFolderDialog v-model:open="showCreateFolderDialog" @create="handleCreateFolderSubmit" />

    <!-- Move Collection Modal -->
    <MoveCollectionModal
      v-if="pendingMove"
      v-model="showMoveModal"
      :item-name="pendingMove.item.name || pendingMove.item.title || 'Collection'"
      :target-folder-name="
        pendingMove.targetFolder.name || pendingMove.targetFolder.title || 'Folder'
      "
      @confirm="handleConfirmMove"
      @cancel="handleCancelMove"
    />

    <!-- Delete Collection Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :item-name="getItemName(collectionToDelete)"
      fallback-name="this collection"
      title="Delete Collection"
      :description="deleteModalDescription"
      :warning-message="getDeleteModalWarning()"
      :is-deleting="isDeleting"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />

    <!-- Duplicate Collection Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDuplicateModal"
      :item-name="getItemName(collectionToDuplicate)"
      fallback-name="this collection"
      title="Duplicate Collection"
      question="Are you sure you want to duplicate"
      description="This will create a copy of the collection with all its settings, media sets, and media."
      confirm-label="Duplicate"
      loading-label="Duplicating..."
      :is-deleting="isDuplicating"
      @confirm="handleConfirmDuplicate"
      @cancel="handleCancelDuplicate"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronDown, Folder, FolderPlus, Plus } from 'lucide-vue-next'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import LoadingState from '@/shared/components/molecules/LoadingState.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { COLLECTION_SORT_OPTIONS } from '@/shared/constants/sortOptions'
import PageHeader from '@/shared/components/molecules/PageHeader.vue'
import CollectionCard from '@/shared/components/molecules/CollectionCard.vue'
import CollectionsTable from '@/domains/memora/components/organisms/CollectionsTable.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import CreateCollectionDialog from '@/domains/memora/components/organisms/CreateCollectionDialog.vue'
import EditCollectionDialog from '@/domains/memora/components/organisms/EditCollectionDialog.vue'
import CreateProjectDialog from '@/shared/components/organisms/CreateProjectDialog.vue'
import CreateFolderDialog from '@/shared/components/organisms/CreateFolderDialog.vue'
import MoveCollectionModal from '@/domains/memora/components/organisms/MoveCollectionModal.vue'
import DeleteConfirmationModal from '@/shared/components/organisms/DeleteConfirmationModal.vue'
import ShareModal from '@/shared/components/organisms/ShareModal.vue'
import CollectionDetailSidebar from '@/domains/memora/components/organisms/CollectionDetailSidebar.vue'
import FolderDetailSidebar from '@/shared/components/organisms/FolderDetailSidebar.vue'
import { useDeleteConfirmation } from '@/shared/composables/useDeleteConfirmation'
import { useGalleryStore } from '@/shared/stores/gallery'
import { useProjectStore } from '@/domains/memora/stores/project'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { useRouter } from 'vue-router'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const router = useRouter()
const galleryStore = useGalleryStore()
const projectStore = useProjectStore()
const { handleError } = useErrorHandler()

// View mode and sorting
const viewMode = ref('grid')
const sortBy = ref('created-new-old')
const searchQuery = ref('')
const isSearching = ref(false)
const sortOptions = COLLECTION_SORT_OPTIONS

// Subtitle separator (can be customized)
const subtitleSeparator = ref('•')

// Selected collections (for list view)
const selectedCollections = ref([])
const showCollectionDetailSidebar = ref(false)
const showFolderDetailSidebar = ref(false)
const selectedCollectionId = ref(null)
const selectedFolderId = ref(null)

// Computed collections from store
const collections = computed(() => galleryStore.collections)
const isLoadingCollections = computed(() => galleryStore.isLoading)
// const collectionsError = computed(() => galleryStore.error) // Unused for now

// Projects
const projects = computed(() => projectStore.projects)
const isLoadingProjects = computed(() => projectStore.isLoading)

const getSubtitle = (collection, separator = '•') => {
  const parts = []
  // Only show essential info on card - rest in detail sidebar
  if (collection.itemCount !== undefined) {
    const count = collection.itemCount
    if (collection.isFolder) {
      const labelText = count === 1 ? 'collection' : 'collections'
      parts.push(`${count} ${labelText}`)
    } else {
      const labelText = count === 1 ? 'item' : 'items'
      parts.push(`${count} ${labelText}`)
    }
  }
  return parts.join(`  ${separator}  `)
}

/**
 * Map frontend sort values to backend sort values
 */
const mapSortToBackend = frontendSort => {
  const mapping = {
    'created-new-old': 'created-desc',
    'created-old-new': 'created-asc',
    'name-a-z': 'name-asc',
    'name-z-a': 'name-desc',
    status: 'status-asc',
  }
  return mapping[frontendSort] || 'created-desc'
}

// Collections are already filtered and sorted by the backend
const sortedCollections = computed(() => {
  return isLoadingCollections.value ? [] : collections.value
})

const showCreateDialog = ref(false)
const showCreateProjectDialog = ref(false)
const showCreateFolderDialog = ref(false)
const isCreatingCollection = ref(false)
const isCreatingProject = ref(false)
const showMoveModal = ref(false)
const pendingMove = ref(null)
const movingCollectionId = ref(null)
const showEditDialog = ref(false)
const collectionToEdit = ref(null)
const showShareModal = ref(false)
const collectionToShare = ref(null)

// Loading states per collection
const starringCollectionIds = ref(new Set())
const deletingCollectionIds = ref(new Set())
const duplicatingCollectionIds = ref(new Set())

const {
  showDeleteModal,
  itemToDelete: collectionToDelete,
  isDeleting,
  openDeleteModal,
  closeDeleteModal,
  getItemName,
} = useDeleteConfirmation()

// Duplicate confirmation state
const showDuplicateModal = ref(false)
const collectionToDuplicate = ref(null)
const isDuplicating = computed(() => {
  if (!collectionToDuplicate.value) return false
  return duplicatingCollectionIds.value.has(String(collectionToDuplicate.value.id))
})

const deleteModalDescription = computed(() => {
  return 'This collection and all its media will be permanently removed.\n\nThis action cannot be undone.'
})

const getDeleteModalWarning = () => {
  if (!collectionToDelete.value) return null
  
  const locationParts = []
  
  // Add project information if available
  if (collectionToDelete.value.project?.name) {
    locationParts.push(`Project: ${collectionToDelete.value.project.name}`)
    
    // Add phase name if available, otherwise default to "Collections"
    const phaseName = collectionToDelete.value.project.collection?.name || 'Collections'
    locationParts.push(`Phase: ${phaseName}`)
  } else if (collectionToDelete.value.projectId) {
    locationParts.push(`Project: ${collectionToDelete.value.projectId}`)
    locationParts.push('Phase: Collections')
  }
  
  // If no location info, don't show the Media Location section
  if (locationParts.length === 0) {
    return null
  }
  
  return locationParts.join('\n')
}

const handleCreateCollection = async () => {
  showCreateDialog.value = true
}

const handleCreateProject = () => {
  showCreateProjectDialog.value = true
}

const handleCreateFolder = () => {
  showCreateFolderDialog.value = true
}

const handleCreateFolderSubmit = async data => {
  try {
    const newFolder = await galleryStore.createCollection({
      name: data.name,
      isFolder: true,
      password: data.password || null,
      eventDate: data.eventDate || null,
    })

    // The optimistic update already adds it to the collections array
    // No need to refetch since the store is reactive and will update the UI

    toast.success('Folder created', {
      description: 'Your new folder has been created.',
    })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to create folder.',
    })
  }
}

const handleCreateCollectionSubmit = async data => {
  if (isCreatingCollection.value) return
  isCreatingCollection.value = true
  try {
    const newCollection = await galleryStore.createCollection(data)
    toast.success('Collection created', {
      description: 'Your new collection has been created.',
    })
    showCreateDialog.value = false
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

const handleCreateProjectSubmit = async data => {
  if (isCreatingProject.value) return
  isCreatingProject.value = true
  try {
    const newProject = await projectStore.createProject(data)
    toast.success('Project created', {
      description: 'Your new project has been created with selected phases.',
    })
    showCreateProjectDialog.value = false
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

const handleViewPresets = () => {
  router.push({ name: 'presetSettings' })
}

const toggleStar = async collection => {
  try {
    // Store already handles optimistic update, no need to manually update
    await galleryStore.toggleStar(String(collection.id))
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update star status.',
    })
  }
}

const handleSelectCollection = (id, checked) => {
  if (checked) {
    selectedCollections.value.push(id)
  } else {
    selectedCollections.value = selectedCollections.value.filter(selId => selId !== id)
  }
}

const handleCollectionClick = collection => {
  // If collection is part of a project, navigate to project dashboard
  if (collection.projectId) {
    router.push({
      name: 'projectDashboard',
      params: { id: collection.projectId },
    })
    return
  }
  // Navigate to collection photos page
  const collectionId = collection.id || collection.name || collection.title
  router.push({
    name: 'collectionPhotos',
    params: { uuid: collectionId },
  })
}

const handleCollectionCardClick = collection => {
  // Only navigate if it's not a folder
  if (collection.isFolder) {
    return
  }
  // If collection is part of a project, navigate to project dashboard
  if (collection.projectId) {
    router.push({
      name: 'projectDashboard',
      params: { id: collection.projectId },
    })
    return
  }
  // Navigate to collection photos page
  const collectionId = collection.id || collection.name || collection.title
  router.push({
    name: 'collectionPhotos',
    params: { uuid: collectionId },
  })
}

const handleCopyLink = async collection => {
  const collectionId = collection.id || collection.name || collection.title
  const link = `${window.location.origin}/collections/${collectionId}`

  try {
    await navigator.clipboard.writeText(link)
    toast.success('Link copied', {
      description: 'Collection link has been copied to clipboard.',
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description: 'Could not copy link to clipboard.',
    })
  }
}

const handleCopyPin = async collection => {
  const pin = collection.downloadPin
  if (!pin) {
    toast.error('No PIN available', {
      description: 'This collection does not have a download PIN.',
    })
    return
  }

  try {
    await navigator.clipboard.writeText(pin)
    toast.success('PIN copied', {
      description: 'Download PIN has been copied to clipboard.',
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description: 'Could not copy PIN to clipboard.',
    })
  }
}

const handleEditCollection = collection => {
  collectionToEdit.value = collection
  showEditDialog.value = true
}

const handleEditSuccess = async () => {
  collectionToEdit.value = null
  showEditDialog.value = false
  // Refresh collections
  await galleryStore.fetchCollections({
    search: searchQuery.value,
    sortBy: sortBy.value,
  })
}

const handleDuplicateCollection = collection => {
  collectionToDuplicate.value = collection
  showDuplicateModal.value = true
}

const handleConfirmDuplicate = async () => {
  if (!collectionToDuplicate.value) return

  const collectionId = String(collectionToDuplicate.value.id)
  if (duplicatingCollectionIds.value.has(collectionId)) return
  
  duplicatingCollectionIds.value.add(collectionId)
  try {
    await galleryStore.duplicateCollection(collectionId)
    toast.success('Collection duplicated', {
      description: `${collectionToDuplicate.value.name || collectionToDuplicate.value.title} has been duplicated.`,
    })
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
    })
    showDuplicateModal.value = false
    collectionToDuplicate.value = null
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to duplicate collection.',
    })
  } finally {
    duplicatingCollectionIds.value.delete(collectionId)
  }
}

const handleCancelDuplicate = () => {
  showDuplicateModal.value = false
  collectionToDuplicate.value = null
}

const handleDeleteCollection = collection => {
  openDeleteModal(collection)
}

const handleViewDetails = collection => {
  if (collection.isFolder) {
    selectedFolderId.value = collection.id
    showFolderDetailSidebar.value = true
  } else {
    selectedCollectionId.value = collection.id
    showCollectionDetailSidebar.value = true
  }
}

const handleConfirmDelete = async () => {
  if (!collectionToDelete.value) return

  const collectionId = String(collectionToDelete.value.id)
  isDeleting.value = true
  deletingCollectionIds.value.add(collectionId)
  try {
    await galleryStore.deleteCollection(collectionId)
    toast.success('Collection deleted', {
      description: `${collectionToDelete.value.name || collectionToDelete.value.title} has been deleted.`,
    })
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
    })
    closeDeleteModal()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to delete collection.',
    })
  } finally {
    isDeleting.value = false
    deletingCollectionIds.value.delete(collectionId)
  }
}

const handleCancelDelete = () => {
  closeDeleteModal()
}

const handlePublishCollection = async collection => {
  const newStatus =
    collection.status === 'active' || collection.status === 'PUBLISHED' ? 'draft' : 'active'
  try {
    await galleryStore.updateCollection(String(collection.id), { status: newStatus })
    toast.success(newStatus === 'active' ? 'Collection published' : 'Collection unpublished', {
      description: `${collection.name || collection.title} status updated.`,
    })
    // Refresh collections
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
    })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update collection status.',
    })
  }
}

const handleShareCollection = collection => {
  collectionToShare.value = collection
  showShareModal.value = true
}

const handlePreviewCollection = collection => {
  // Open preview in new tab
  const collectionId = collection.id || collection.name || collection.title
  const previewUrl = `${window.location.origin}/preview/${collectionId}`
  window.open(previewUrl, '_blank')
}

const handleMoveToFolder = async (draggedItem, targetFolder) => {
  if (!targetFolder.isFolder) {
    toast.error('Invalid target', {
      description: 'You can only move items into folders.',
    })
    return
  }

  // Prevent moving folders into other folders
  if (draggedItem.isFolder) {
    toast.error('Cannot move folder', {
      description: 'Folders cannot be moved into other folders.',
    })
    return
  }

  // Store pending move and show confirmation modal
  pendingMove.value = {
    item: draggedItem,
    targetFolder: targetFolder,
  }
  showMoveModal.value = true
}

const handleConfirmMove = async () => {
  if (!pendingMove.value) return

  const { item, targetFolder } = pendingMove.value

  movingCollectionId.value = String(item.id)

  try {
    // Wait a bit for animation to start
    await new Promise(resolve => setTimeout(resolve, 200))

    // Move collection - this will update UI optimistically without full reload
    await galleryStore.moveCollection(item.id, targetFolder.id)
    toast.success('Moved successfully', {
      description: `Moved ${item.name || item.title} into ${targetFolder.name || targetFolder.title}`,
    })

    // Clear moving state after animation completes
    setTimeout(() => {
      movingCollectionId.value = null
    }, 500)
  } catch (error) {
    movingCollectionId.value = null
    handleError(error, {
      fallbackMessage: 'Failed to move item.',
    })
  } finally {
    pendingMove.value = null
    showMoveModal.value = false
  }
}

const handleCancelMove = () => {
  pendingMove.value = null
  showMoveModal.value = false
}

const handleSearch = async () => {
  if (!searchQuery.value || !searchQuery.value.trim()) {
    handleClearSearch()
    return
  }
  isSearching.value = true
  try {
    await galleryStore.fetchCollections({
      search: searchQuery.value.trim(),
      sortBy: mapSortToBackend(sortBy.value),
    })
  } catch (error) {
    if (error?.name !== 'AbortError' && error?.message !== 'Request aborted') {
      handleError(error, {
        fallbackMessage: 'Failed to search collections.',
      })
    }
  } finally {
    isSearching.value = false
  }
}

const handleClearSearch = async () => {
  searchQuery.value = ''
  isSearching.value = true
  try {
    await galleryStore.fetchCollections({
      search: '',
      sortBy: mapSortToBackend(sortBy.value),
    })
  } catch (error) {
    if (error?.name !== 'AbortError' && error?.message !== 'Request aborted') {
      handleError(error, {
        fallbackMessage: 'Failed to load collections.',
      })
    }
  } finally {
    isSearching.value = false
  }
}

// Fetch collections on mount
onMounted(async () => {
  try {
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: mapSortToBackend(sortBy.value),
    })
  } catch (error) {
    // Only show error if not aborted
    if (error?.name !== 'AbortError' && error?.message !== 'Request aborted') {
      handleError(error, {
        fallbackMessage: 'Failed to load collections.',
      })
    }
  }
})

// Watch for sort changes and refetch (search only on button click)
watch([sortBy], async () => {
  try {
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: mapSortToBackend(sortBy.value),
    })
  } catch (error) {
    // Only show error if not aborted
    if (error?.name !== 'AbortError' && error?.message !== 'Request aborted') {
      handleError(error, {
        fallbackMessage: 'Failed to load collections.',
      })
    }
  }
})

// Mock collections data (remove when API is ready) - Currently unused
// const mockCollections = ref([
//   {
//     id: 1,
//     title: 'Test Foolder',
//     itemCount: 0,
//     itemLabel: 'collections',
//     date: 'Nov 12, 2025',
//     dateCreated: 'Nov 30, 2025',
//     icon: Folder,
//     image: null,
//     isFolder: true,
//     isLocked: true,
//     previewImages: [],
//     password: 'password123',
//     downloadPin: '1234',
//     status: 'DRAFT',
//   },
//   {
//     id: 2,
//     title: 'Joseph X Cuppy',
//     itemCount: 2,
//     itemLabel: 'items',
//     date: 'Nov 29, 2025',
//     dateCreated: 'Nov 24, 2025',
//     itemIcon: Circle,
//     image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
//     password: null,
//     downloadPin: '5678',
//     status: 'DRAFT',
//   },
//   {
//     id: 3,
//     title: 'MazeLoot Demo',
//     itemCount: 0,
//     itemLabel: 'items',
//     dateCreated: 'Nov 24, 2025',
//     starred: true,
//     badge: true,
//     badgeIcon: Circle,
//     image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
//     password: null,
//     downloadPin: '9012',
//     status: 'DRAFT',
//   },
//   {
//     id: 4,
//     title: 'Test',
//     itemCount: 0,
//     itemLabel: 'items',
//     date: 'Nov 5, 2025',
//     dateCreated: 'Nov 17, 2025',
//     itemIcon: Circle,
//     isLocked: true,
//     image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
//     password: null,
//     downloadPin: '3456',
//     status: 'DRAFT',
//   },
//   {
//     id: 5,
//     title: 'Mazeloot Demo',
//     itemCount: 0,
//     itemLabel: 'items',
//     date: 'Nov 13, 2025',
//     dateCreated: 'Nov 10, 2025',
//     itemIcon: Circle,
//     image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
//     password: null,
//     downloadPin: '7890',
//     status: 'DRAFT',
//   },
//   {
//     id: 6,
//     title: 'Mazeloot folder',
//     itemCount: 1,
//     itemLabel: 'collection',
//     dateCreated: 'Nov 10, 2025',
//     icon: Folder,
//     image: null,
//     isFolder: true,
//     isLocked: true,
//     previewImages: [
//       'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
//     ],
//     password: null,
//     downloadPin: null,
//   },
//   {
//     id: 7,
//     title: 'Test Folder',
//     itemCount: 0,
//     itemLabel: 'collections',
//     dateCreated: 'Sep 1, 2025',
//     icon: Folder,
//     image: null,
//     isFolder: true,
//     isLocked: false,
//     previewImages: [],
//     password: null,
//     downloadPin: null,
//   },
//   {
//     id: 8,
//     title: 'My Collection',
//     itemCount: 1,
//     itemLabel: 'item',
//     dateCreated: 'Sep 1, 2025',
//     itemIcon: Circle,
//     image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop',
//     password: null,
//     downloadPin: '2468',
//     status: 'DRAFT',
//   },
//   {
//     id: 9,
//     title: 'My Sample Collection',
//     itemCount: 42,
//     itemLabel: 'items',
//     date: 'Sep 1, 2025',
//     dateCreated: 'Sep 1, 2025',
//     image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
//     password: null,
//     downloadPin: '1357',
//     status: 'PUBLISHED',
//   },
// ])
</script>
