<template>
  <DashboardLayout>
    <template #breadcrumb> Starred Collections </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        title="Starred Collections"
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
      />

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
            message="No starred collections found"
            action-label="Browse Collections"
            :icon="Star"
            @action="handleBrowseCollections"
          />
        </div>

        <!-- Collections Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <CollectionCard
            v-for="collection in sortedCollections"
            :key="collection.id"
            :image-src="collection.image || collection.thumbnail"
            :alt-text="collection.title || collection.name"
            :caption-text="collection.title || collection.name"
            :subtitle="getSubtitle(collection)"
            :collection-data="collection"
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
            :icon="collection.isFolder ? Folder : undefined"
            :folder-icon="collection.isFolder ? Folder : undefined"
            :preview-images="collection.previewImages"
            :is-locked="collection.isLocked || false"
            :is-folder="collection.isFolder || false"
            image-container-class="aspect-[4/3]"
            @star-click="toggleStar(collection)"
            @edit="handleEditCollection(collection)"
            @duplicate="handleDuplicateCollection(collection)"
            @delete="handleDeleteCollection(collection)"
            @share="handleCopyLink(collection)"
          >
          </CollectionCard>
        </div>
      </div>

      <!-- Collections List View -->
      <CollectionsTable
        v-else
        :items="sortedCollections"
        :loading="isLoadingCollections"
        :selected-items="selectedCollections"
        empty-message="No starred collections found"
        empty-action-label="Browse Collections"
        :empty-icon="Star"
        :subtitle-separator="subtitleSeparator"
        :show-move-to="false"
        @select="handleSelectCollection"
        @star-click="toggleStar"
        @link-click="handleCopyLink"
        @copy-pin="handleCopyPin"
        @item-click="handleCollectionClick"
        @empty-action="handleBrowseCollections"
        @edit="handleEditCollection"
        @duplicate="handleDuplicateCollection"
        @delete="handleDeleteCollection"
        @publish="handlePublishCollection"
        @preview="handlePreviewCollection"
      />

      <!-- Pagination -->
      <Pagination
        v-if="pagination.totalPages > 1 || pagination.total > 0"
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
        :limit="pagination.limit"
        :show-page-size="true"
        :show-go-to-page="true"
        :show-first-last="true"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>

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
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Folder, Star } from '@/shared/utils/lucideAnimated'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { COLLECTION_SORT_OPTIONS } from '@/shared/constants/sortOptions'
import PageHeader from '@/shared/components/molecules/PageHeader.vue'
import CollectionCard from '@/shared/components/molecules/CollectionCard.vue'
import CollectionsTable from '@/domains/memora/components/organisms/CollectionsTable.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import DeleteConfirmationModal from '@/shared/components/organisms/DeleteConfirmationModal.vue'
import { useDeleteConfirmation } from '@/shared/composables/useDeleteConfirmation'
import { useGalleryStore } from '@/shared/stores/gallery'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { toast } from '@/shared/utils/toast'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination'
import Pagination from '@/shared/components/molecules/Pagination.vue'

const description = ''

const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
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

const {
  showDeleteModal,
  itemToDelete: collectionToDelete,
  isDeleting,
  openDeleteModal,
  closeDeleteModal,
  getItemName,
} = useDeleteConfirmation()

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
  return parts.join(` ${separator} `)
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

/**
 * Fetch function for pagination
 */
const fetchStarredCollections = async params => {
  const fetchParams = {
    starred: true, // Always filter by starred
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

  return await galleryStore.fetchCollections(fetchParams)
}

// Use async pagination composable
const {
  data: sortedCollections,
  pagination,
  isLoading: isLoadingCollections,
  fetch,
  goToPage,
  resetToFirstPage,
  setPerPage,
} = useAsyncPagination(fetchStarredCollections, {
  initialPage: 1,
  initialPerPage: 10,
  autoFetch: false, // We'll call fetch manually in onMounted
  watchForReset: [sortBy], // Reset to page 1 when sort changes (search only on button click)
})

const toggleStar = async collection => {
  if (!collection || !collection.id) return
  
  try {
    const result = await galleryStore.toggleStar(String(collection.id))
    const index = sortedCollections.value.findIndex(c => c.id === collection.id || c.id === String(collection.id))
    
    if (index !== -1) {
      // Get new starred state from API result or toggle current state
      const currentStarred = sortedCollections.value[index].isStarred || sortedCollections.value[index].starred || false
      const newStarredState = result?.starred ?? result?.data?.starred ?? !currentStarred
      
      // If unstarred in starred view, remove from list
      if (!newStarredState) {
        sortedCollections.value.splice(index, 1)
        if (pagination.value && pagination.value.total > 0) {
          pagination.value.total -= 1
        }
      } else {
        // Update the item state
        sortedCollections.value[index] = {
          ...sortedCollections.value[index],
          isStarred: newStarredState,
          starred: newStarredState,
        }
      }
    }
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
  router
    .push({
      name,
      params,
    })
    .catch(() => {
      toast.info('Collection detail', {
        description,
      })
    })
}

const handleCopyLink = async collection => {
  const collectionId = collection.id || collection.name || collection.title
  const resolvedRoute = router.resolve({
    name: 'collectionPhotos',
    params: { uuid: collectionId },
  })
  const link = `${window.location.origin}${resolvedRoute.href}`

  try {
    await navigator.clipboard.writeText(link)
    toast.success('Link copied', {
      description,
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description,
    })
  }
}

const handleCopyPin = async collection => {
  const pin = collection.downloadPin
  if (!pin) {
    toast.error('No PIN available', {
      description,
    })
    return
  }

  try {
    await navigator.clipboard.writeText(pin)
    toast.success('PIN copied', {
      description,
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description,
    })
  }
}

const handleEditCollection = collection => {
  router.push({ name: 'collectionSettingsGeneral', params: { uuid: collection.id } })
}

const handleDuplicateCollection = async collection => {
  try {
    await galleryStore.duplicateCollection(String(collection.id))
    toast.success('Collection duplicated', {
      description: 'The collection has been duplicated.',
    })
    await fetch()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to duplicate collection.',
    })
  }
}

const handleDeleteCollection = collection => {
  if (collection && collection.id) {
    openDeleteModal(collection)
  }
}

const handleConfirmDelete = async () => {
  if (!collectionToDelete.value) return

  isDeleting.value = true
  try {
    await galleryStore.deleteCollection(String(collectionToDelete.value.id))
    toast.success('Collection deleted', {
      description: `${collectionToDelete.value.name || collectionToDelete.value.title} has been deleted.`,
    })
    closeDeleteModal()
    await fetch()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to delete collection.',
    })
  } finally {
    isDeleting.value = false
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
      description:
        newStatus === 'active'
          ? 'Your collection is now live and accessible.'
          : 'Your collection has been unpublished.',
    })
    await fetch()
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update collection status. Please try again.',
    })
  }
}

const handlePreviewCollection = collection => {
  const collectionId = collection.id || collection.name || collection.title
  const resolvedRoute = router.resolve({
    name: 'collectionPreview',
    params: { id: collectionId },
  })
  const previewUrl = `${window.location.origin}${resolvedRoute.href}`
  window.open(previewUrl, '_blank')
}

// const handleMoveToFolder = async (draggedItem) => {
//   if (!targetFolder.isFolder) {
//     toast.error('Invalid target', {
//       description,
//     })
//     return
//   }

//   // Prevent moving folders into other folders
//   if (draggedItem.isFolder) {
//     toast.error('Cannot move folder', {
//       description,
//     })
//     return
//   }

//   try {
//     // Move collection - this will update UI optimistically without full reload
//     await galleryStore.moveCollection(draggedItem.id, targetFolder.id)
//     toast.success('Moved successfully', {
//       description,
//     })

//     // No need to refresh - optimistic update already applied
//     // The collection will animate out and folder will update its preview
//   } catch (error) {
//     handleError(error, {
//       fallbackMessage,
//     })
//   }
// }

const handleBrowseCollections = () => {
  router.push({ name: 'manageCollections' })
}

const handlePageChange = page => {
  goToPage(page)
}

const handlePageSizeChange = async newSize => {
  await setPerPage(newSize)
}

const handleSearch = async () => {
  if (!searchQuery.value || !searchQuery.value.trim()) {
    handleClearSearch()
    return
  }
  isSearching.value = true
  await resetToFirstPage()
  isSearching.value = false
}

const handleClearSearch = async () => {
  searchQuery.value = ''
  await resetToFirstPage()
}

// Initial load
onMounted(async () => {
  await fetch()
})

// Sample collections data (fallback - remove when API is ready) - Currently unused
// const mockCollections = ref([
//   {
//     id,
//     title,
//     itemCount,
//     itemLabel,
//     date, 2025',
//     dateCreated, 2025',
//     icon,
//     image,
//     isFolder,
//     isLocked,
//     previewImages,
//     password,
//     downloadPin,
//     status,
//     starred,
//   },
//   {
//     id,
//     title,
//     itemCount,
//     itemLabel,
//     date, 2025',
//     dateCreated, 2025',
//     itemIcon,
//     image=300&fit=crop',
//     password,
//     downloadPin,
//     status,
//     starred,
//   },
//   {
//     id,
//     title,
//     itemCount,
//     itemLabel,
//     dateCreated, 2025',
//     starred,
//     badge,
//     badgeIcon,
//     image=300&fit=crop',
//     password,
//     downloadPin,
//     status,
//   },
//   {
//     id,
//     title,
//     itemCount,
//     itemLabel,
//     date, 2025',
//     dateCreated, 2025',
//     itemIcon,
//     isLocked,
//     image=300&fit=crop',
//     password,
//     downloadPin,
//     status,
//     starred,
//   },
//   {
//     id,
//     title,
//     itemCount,
//     itemLabel,
//     date, 2025',
//     dateCreated, 2025',
//     itemIcon,
//     image=300&fit=crop',
//     password,
//     downloadPin,
//     status,
//     starred,
//   },
//   {
//     id,
//     title,
//     itemCount,
//     itemLabel,
//     dateCreated, 2025',
//     icon,
//     image,
//     isFolder,
//     isLocked,
//     previewImages
//       'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
//     ],
//     password,
//     downloadPin,
//     starred,
//   },
//   {
//     id,
//     title,
//     itemCount,
//     itemLabel,
//     dateCreated, 2025',
//     icon,
//     image,
//     isFolder,
//     isLocked,
//     previewImages,
//     password,
//     downloadPin,
//     starred,
//   },
//   {
//     id,
//     title,
//     itemCount,
//     itemLabel,
//     dateCreated, 2025',
//     itemIcon,
//     image=300&fit=crop',
//     password,
//     downloadPin,
//     status,
//     starred,
//   },
//   {
//     id,
//     title,
//     itemCount,
//     itemLabel,
//     date, 2025',
//     dateCreated, 2025',
//     image=300&fit=crop',
//     password,
//     downloadPin,
//     status,
//     starred,
//   },
// ])
</script>
