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
            :icon="collection.isFolder ? Folder : collection.icon"
            :folder-icon="collection.isFolder ? Folder : collection.icon"
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
              {{ getSubtitle(collection, subtitleSeparator) }}
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

<script setup lang="ts">
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
import { toast } from 'vue-sonner'

const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const { handleError } = useErrorHandler()

// Computed collections from store
const collections = computed(() => galleryStore.collections)
const isLoadingCollections = computed(() => galleryStore.isLoading)
// const collectionsError = computed(() => galleryStore.error) // Unused for now

// View mode and sorting
const viewMode = ref<'grid' | 'list'>('grid')
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
const selectedCollections = ref<number[]>([])

// Delete confirmation using reusable composable
const {
  showDeleteModal,
  itemToDelete: collectionToDelete,
  isDeleting,
  openDeleteModal,
  closeDeleteModal,
  getItemName,
} = useDeleteConfirmation<any>()

const getSubtitle = (collection: any, separator: string = '•') => {
  const parts = []
  if (collection.itemCount !== undefined) {
    const count = collection.itemCount
    // Folders count collections, regular collections count items
    if (collection.isFolder) {
      const labelText = count === 1 ? 'collection' : 'collections'
      parts.push(`${count} ${labelText}`)
    } else {
      const labelText = count === 1 ? 'item' : 'items'
      parts.push(`${count} ${labelText}`)
    }
  }
  const date = collection.date || collection.dateCreated || collection.createdAt
  if (date) {
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    parts.push(formattedDate)
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

const toggleStar = async (collection: any) => {
  try {
    // Store already handles optimistic update, no need to manually update
    await galleryStore.toggleStar(String(collection.id))
  } catch (error: any) {
    handleError(error, {
      fallbackMessage: 'Failed to update star status.',
    })
  }
}

const handleSelectCollection = (id: number, checked: boolean) => {
  if (checked) {
    selectedCollections.value.push(id)
  } else {
    selectedCollections.value = selectedCollections.value.filter((selId: number) => selId !== id)
  }
}

const handleCollectionClick = (collection: any) => {
  router
    .push({
      name: 'collectionDetail',
      params: { id: collection.id },
    })
    .catch(() => {
      toast.info('Collection detail', {
        description: `Viewing ${collection.name || collection.title}`,
      })
    })
}

const handleCopyLink = async (collection: any) => {
  const collectionId = collection.id || collection.name || collection.title
  const link = `${window.location.origin}/collections/${collectionId}`

  try {
    await navigator.clipboard.writeText(link)
    toast.success('Link copied', {
      description: 'Collection link has been copied to clipboard.',
    })
  } catch (error) {
    console.error('Failed to copy link:', error)
    toast.error('Failed to copy', {
      description: 'Could not copy link to clipboard.',
    })
  }
}

const handleCopyPin = async (collection: any) => {
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
    console.error('Failed to copy PIN:', error)
    toast.error('Failed to copy', {
      description: 'Could not copy PIN to clipboard.',
    })
  }
}

const handleEditCollection = (collection: any) => {
  toast.info('Edit collection', {
    description: `Editing ${collection.name || collection.title}`,
  })
}

const handleDuplicateCollection = async (collection: any) => {
  try {
    await galleryStore.duplicateCollection(String(collection.id))
    toast.success('Collection duplicated', {
      description: `${collection.name || collection.title} has been duplicated.`,
    })
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
      parentId: null, // Only fetch root-level collections
    })
  } catch (error: any) {
    handleError(error, {
      fallbackMessage: 'Failed to duplicate collection.',
    })
  }
}

const handleDeleteCollection = (collection: any) => {
  openDeleteModal(collection)
}

const handleConfirmDelete = async () => {
  if (!collectionToDelete.value) return

  isDeleting.value = true
  try {
    await galleryStore.deleteCollection(String(collectionToDelete.value.id))
    toast.success('Collection deleted', {
      description: `${collectionToDelete.value.name || collectionToDelete.value.title} has been deleted.`,
    })
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
      parentId: null, // Only fetch root-level collections
    })
    closeDeleteModal()
  } catch (error: any) {
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

const handlePublishCollection = async (collection: any) => {
  const newStatus =
    collection.status === 'active' || collection.status === 'PUBLISHED' ? 'draft' : 'active'
  try {
    await galleryStore.updateCollection(String(collection.id), { status: newStatus })
    toast.success(newStatus === 'active' ? 'Collection published' : 'Collection unpublished', {
      description: `${collection.name || collection.title} status updated.`,
    })
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
      parentId: null, // Only fetch root-level collections
    })
  } catch (error: any) {
    handleError(error, {
      fallbackMessage: 'Failed to update collection status.',
    })
  }
}

const handlePreviewCollection = (collection: any) => {
  const collectionId = collection.id || collection.name || collection.title
  const previewUrl = `${window.location.origin}/preview/${collectionId}`
  window.open(previewUrl, '_blank')
}

// const handleMoveToFolder = async (draggedItem: any, targetFolder: any) => {
//   if (!targetFolder.isFolder) {
//     toast.error('Invalid target', {
//       description: 'You can only move items into folders.',
//     })
//     return
//   }

//   // Prevent moving folders into other folders
//   if (draggedItem.isFolder) {
//     toast.error('Cannot move folder', {
//       description: 'Folders cannot be moved into other folders.',
//     })
//     return
//   }

//   try {
//     // Move collection - this will update UI optimistically without full reload
//     await galleryStore.moveCollection(draggedItem.id, targetFolder.id)
//     toast.success('Moved successfully', {
//       description: `Moved ${draggedItem.name || draggedItem.title} into ${targetFolder.name || targetFolder.title}`,
//     })

//     // No need to refresh - optimistic update already applied
//     // The collection will animate out and folder will update its preview
//   } catch (error: any) {
//     handleError(error, {
//       fallbackMessage: 'Failed to move item.',
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
  } catch (error: any) {
    if (error?.name !== 'AbortError' && error?.message !== 'Request aborted') {
      handleError(error, {
        fallbackMessage: 'Failed to load collections.',
      })
    }
  }
})

// Sample collections data (fallback - remove when API is ready) - Currently unused
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
//     starred: false,
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
//     starred: false,
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
//     starred: false,
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
//     starred: false,
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
//     starred: false,
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
//     starred: false,
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
//     starred: false,
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
//     starred: false,
//   },
// ])
</script>
