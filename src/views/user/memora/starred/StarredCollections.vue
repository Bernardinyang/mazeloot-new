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
        sort-label="Sort collections by"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      />

      <!-- Filter/Sort Bar -->
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Status Filter -->
        <Select v-model="filterStatus">
          <SelectTrigger :class="['w-[140px]', theme.bgInput, theme.borderInput, theme.textInput]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
            <SelectItem value="all" :class="[theme.textPrimary, theme.bgButtonHover]"
              >All Status</SelectItem
            >
            <SelectItem value="active" :class="[theme.textPrimary, theme.bgButtonHover]"
              >Active</SelectItem
            >
            <SelectItem value="archived" :class="[theme.textPrimary, theme.bgButtonHover]"
              >Archived</SelectItem
            >
            <SelectItem value="draft" :class="[theme.textPrimary, theme.bgButtonHover]"
              >Draft</SelectItem
            >
          </SelectContent>
        </Select>

        <!-- Category Tag Filter -->
        <Select v-model="filterCategory">
          <SelectTrigger :class="['w-[140px]', theme.bgInput, theme.borderInput, theme.textInput]">
            <SelectValue placeholder="Category Tag" />
          </SelectTrigger>
          <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
            <SelectItem value="all" :class="[theme.textPrimary, theme.bgButtonHover]"
              >All Categories</SelectItem
            >
            <SelectItem value="wedding" :class="[theme.textPrimary, theme.bgButtonHover]"
              >Wedding</SelectItem
            >
            <SelectItem value="portrait" :class="[theme.textPrimary, theme.bgButtonHover]"
              >Portrait</SelectItem
            >
            <SelectItem value="event" :class="[theme.textPrimary, theme.bgButtonHover]"
              >Event</SelectItem
            >
          </SelectContent>
        </Select>

        <!-- Event Date Filter -->
        <Select v-model="filterEventDate">
          <SelectTrigger :class="['w-[140px]', theme.bgInput, theme.borderInput, theme.textInput]">
            <SelectValue placeholder="Event Date" />
          </SelectTrigger>
          <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
            <SelectItem value="all" :class="[theme.textPrimary, theme.bgButtonHover]"
              >All Dates</SelectItem
            >
            <SelectItem value="recent" :class="[theme.textPrimary, theme.bgButtonHover]"
              >Recent</SelectItem
            >
            <SelectItem value="oldest" :class="[theme.textPrimary, theme.bgButtonHover]"
              >Oldest</SelectItem
            >
          </SelectContent>
        </Select>

        <!-- Expiry Date Filter -->
        <Select v-model="filterExpiryDate">
          <SelectTrigger :class="['w-[140px]', theme.bgInput, theme.borderInput, theme.textInput]">
            <SelectValue placeholder="Expiry Date" />
          </SelectTrigger>
          <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
            <SelectItem value="all" :class="[theme.textPrimary, theme.bgButtonHover]"
              >All Expiry</SelectItem
            >
            <SelectItem value="soon" :class="[theme.textPrimary, theme.bgButtonHover]"
              >Expiring Soon</SelectItem
            >
            <SelectItem value="expired" :class="[theme.textPrimary, theme.bgButtonHover]"
              >Expired</SelectItem
            >
          </SelectContent>
        </Select>
      </div>

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
            <template #subtitle>
              {{ getSubtitle(collection) }}
            </template>
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
    </div>

    <!-- Delete Collection Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :item-name="getItemName(collectionToDelete)"
      fallback-name="this collection"
      title="Delete Collection"
      warning-message="This collection will be permanently removed from your account."
      :is-deleting="isDeleting"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Folder, Star } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useCollectionSort } from '@/composables/useCollectionSort'
import { COLLECTION_SORT_OPTIONS } from '@/constants/sortOptions'
import PageHeader from '@/components/molecules/PageHeader.vue'
import CollectionCard from '@/components/molecules/CollectionCard.vue'
import CollectionsTable from '@/components/organisms/CollectionsTable.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation'
import { useGalleryStore } from '@/stores/gallery'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { toast } from '@/utils/toast'

const description = ''

const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const { handleError } = useErrorHandler()

// Computed collections from store
const collections = computed(() => galleryStore.collections)
const isLoadingCollections = computed(() => galleryStore.isLoading)

// View mode and sorting
const viewMode = ref('grid')
const sortBy = ref('created-new-old')
const searchQuery = ref('')
const sortOptions = COLLECTION_SORT_OPTIONS

// Filter states
const filterStatus = ref('all')
const filterCategory = ref('all')
const filterEventDate = ref('all')
const filterExpiryDate = ref('all')

// Subtitle separator (can be customized)
const subtitleSeparator = ref('•')

// Selected collections (for list view)
const selectedCollections = ref([])

// Delete confirmation using reusable composable
const {
  showDeleteModal,
  itemToDelete,
  isDeleting,
  openDeleteModal,
  closeDeleteModal,
  getItemName,
} = useDeleteConfirmation()

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

// Filter collections to only show starred collections (no folders) at root level
const starredCollections = computed(() => {
  return collections.value.filter(
    collection =>
      (collection.starred === true || collection.isStarred === true) &&
      collection.isFolder !== true && // Exclude folders - only show collections
      collection.parentId === null // Only show root-level items
  )
})

const filteredCollections = computed(() => {
  let filtered = [...starredCollections.value]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(collection => {
      const name = (collection.name || collection.title || '').toLowerCase()
      const desc = (collection.description || '').toLowerCase()
      return name.includes(query) || desc.includes(query)
    })
  }

  // Status filter
  if (filterStatus.value && filterStatus.value !== 'all') {
    filtered = filtered.filter(collection => {
      const status = (collection.status || '').toLowerCase()
      return status === filterStatus.value.toLowerCase()
    })
  }

  // Category filter
  if (filterCategory.value && filterCategory.value !== 'all') {
    filtered = filtered.filter(collection => {
      const category = (collection.category || '').toLowerCase()
      return category === filterCategory.value.toLowerCase()
    })
  }

  // Event Date filter
  if (filterEventDate.value && filterEventDate.value !== 'all') {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    filtered = filtered.filter(collection => {
      const dateStr = collection.date || collection.dateCreated || collection.createdAt
      if (!dateStr) return false
      const eventDate = new Date(dateStr)

      if (filterEventDate.value === 'recent') {
        return eventDate >= thirtyDaysAgo
      }
      if (filterEventDate.value === 'oldest') {
        return eventDate < thirtyDaysAgo
      }
      return true
    })
  }

  // Expiry Date filter
  if (filterExpiryDate.value && filterExpiryDate.value !== 'all') {
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    filtered = filtered.filter(collection => {
      if (!collection.expiryDate) return false
      const expiryDate = new Date(collection.expiryDate)

      if (filterExpiryDate.value === 'soon') {
        return expiryDate > now && expiryDate <= sevenDaysFromNow
      }
      if (filterExpiryDate.value === 'expired') {
        return expiryDate < now
      }
      return true
    })
  }

  return filtered
})

// Only sort when not loading to prevent sorting before data is ready
const { sortedItems: sortedCollections } = useCollectionSort(
  computed(() => (isLoadingCollections.value ? [] : filteredCollections.value)),
  sortBy
)

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

const handleSelectCollection = id => {
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
  const link = `${window.location.origin}/collections/${collectionId}`

  try {
    await navigator.clipboard.writeText(link)
    toast.success('Link copied', {
      description,
    })
  } catch (error) {
    console.error('Failed to copy link:', error)
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
    console.error('Failed to copy PIN:', error)
    toast.error('Failed to copy', {
      description,
    })
  }
}

const handleEditCollection = collection => {
  toast.info('Edit collection', {
    description,
  })
}

const handleDuplicateCollection = async collection => {
  try {
    await galleryStore.duplicateCollection(String(collection.id))
    toast.success('Collection duplicated', {
      description,
    })
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
      parentId, // Only fetch root-level collections
    })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to duplicate collection.',
    })
  }
}

const handleDeleteCollection = collection => {
  openDeleteModal(collection)
}

const handleConfirmDelete = async () => {
  if (!collectionToDelete.value) return

  isDeleting.value = true
  try {
    await galleryStore.deleteCollection(String(collectionToDelete.value.id))
    toast.success('Collection deleted', {
      description,
    })
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
      parentId, // Only fetch root-level collections
    })
    closeDeleteModal()
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
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
      parentId: null, // Only fetch root-level collections
    })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update collection status. Please try again.',
    })
  }
}

const handlePreviewCollection = collection => {
  const collectionId = collection.id || collection.name || collection.title
  const previewUrl = `${window.location.origin}/preview/${collectionId}`
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

// Fetch collections on mount
onMounted(async () => {
  try {
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
    })
  } catch (error) {
    if (error?.name !== 'AbortError' && error?.message !== 'Request aborted') {
      handleError(error, {
        fallbackMessage: 'Failed to load starred collections.',
      })
    }
  }
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
