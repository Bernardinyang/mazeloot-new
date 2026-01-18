<template>
  <DashboardLayout>
    <template #breadcrumb> Starred Folders </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        title="Starred Folders"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        :is-searching="isSearching"
        sort-label="Sort folders by"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
        @search="handleSearch"
        @clear="handleClearSearch"
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

      <!-- Folders Grid View -->
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
            message="No starred folders found"
            action-label="Browse Collections"
            :icon="Folder"
            @action="handleBrowseCollections"
          />
        </div>

        <!-- Folders Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <CollectionCard
            v-for="collection in sortedCollections"
            :key="collection.id"
            :image-src="collection.image || collection.thumbnail"
            :alt-text="collection.title || collection.name"
            :caption-text="collection.title || collection.name"
            :subtitle="getSubtitle(collection)"
            :collection-data="{ ...collection, disableDrag: true }"
            container-height="auto"
            container-width="100%"
            image-height="240px"
            image-width="100%"
            :rotate-amplitude="12"
            :scale-on-hover="1.05"
            :display-overlay-content="false"
            :show-content="true"
            :show-menu="true"
            :show-star="true"
            :is-starred="collection.starred || collection.isStarred || false"
            :badge="collection.badge || false"
            :badge-icon="collection.badgeIcon"
            :icon="Folder"
            :folder-icon="Folder"
            :preview-images="collection.previewImages"
            :is-locked="collection.isLocked || false"
            :is-folder="true"
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

      <!-- Folders List View -->
      <CollectionsTable
        v-else
        :items="sortedCollections"
        :loading="isLoadingCollections"
        :selected-items="selectedCollections"
        empty-message="No starred folders found"
        empty-action-label="Browse Collections"
        :empty-icon="Folder"
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
    <CenterModal
      v-model="showDeleteModal"
      title="Delete Folder"
      description="This action cannot be undone."
      content-class="sm:max-w-[425px]"
    >
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <p class="text-sm" :class="theme.textSecondary">
            Are you sure you want to delete
            <span class="font-semibold" :class="theme.textPrimary">
              {{ collectionToDelete?.name || collectionToDelete?.title || 'this folder' }} </span
            >?
          </p>
          <p class="text-xs" :class="theme.textTertiary">
            This folder and all its contents will be permanently removed from your account.
          </p>
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="handleCancelDelete" :disabled="isDeleting">
          Cancel
        </Button>
        <Button
          class="bg-red-500 hover:bg-red-600 text-white"
          @click="handleConfirmDelete"
          :disabled="isDeleting"
        >
          <span v-if="isDeleting" class="flex items-center gap-2">
            <span
              class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            ></span>
            Deleting...
          </span>
          <span v-else>Delete</span>
        </Button>
      </template>
    </CenterModal>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Folder } from '@/shared/utils/lucideAnimated'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useCollectionSort } from '@/domains/memora/composables/useCollectionSort'
import { COLLECTION_SORT_OPTIONS } from '@/shared/constants/sortOptions'
import PageHeader from '@/shared/components/molecules/PageHeader.vue'
import CollectionCard from '@/shared/components/molecules/CollectionCard.vue'
import CollectionsTable from '@/domains/memora/components/organisms/CollectionsTable.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import CenterModal from '@/shared/components/molecules/CenterModal.vue'
import { Button } from '@/shared/components/shadcn/button'
import { useGalleryStore } from '@/shared/stores/gallery'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import { toast } from '@/shared/utils/toast'

const description = ''

const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const { handleError } = useErrorHandler()

// Computed collections from store
const collections = computed(() => galleryStore.collections)
const isLoadingCollections = computed(() => galleryStore.isLoading)
// const collectionsError = computed(() => galleryStore.error) // Unused for now

// View mode and sorting
const viewMode = ref('grid')
const sortBy = ref('created-new-old')
const searchQuery = ref('')
const isSearching = ref(false)
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

const showDeleteModal = ref(false)
const collectionToDelete = ref(null)
const isDeleting = ref(false)

const getSubtitle = (collection, separator = '•') => {
  const parts = []
  // Only show essential info on card - rest in detail sidebar
  if (collection.itemCount !== undefined) {
    const count = collection.itemCount
    const labelText = count === 1 ? 'collection' : 'collections'
    parts.push(`${count} ${labelText}`)
  }
  return parts.join(` ${separator} `)
}

// Filter collections to only show starred folders at root level
const starredFolders = computed(() => {
  return collections.value.filter(
    collection =>
      (collection.starred === true || collection.isStarred === true) &&
      collection.isFolder === true &&
      collection.parentId === null // Only show root-level items
  )
})

const filteredCollections = computed(() => {
  let filtered = [...starredFolders.value]

  // Search is handled by backend, no client-side filtering

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
  if (!collection || !collection.id) return
  
  try {
    await galleryStore.toggleStar(String(collection.id))
    // The gallery store updates the collection in its collections array optimistically
    // Since starredFolders is computed from galleryStore.collections and filters by isStarred/starred,
    // the item will automatically disappear from the view when unstarred
    // We may need to refetch if the store doesn't have the item
    const collectionInStore = galleryStore.collections.find(c => c.id === collection.id || c.id === String(collection.id))
    if (!collectionInStore) {
      // Item not in store, might need to refetch to ensure sync
      await galleryStore.fetchCollections({ starred: true })
    }
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
      toast.info('Folder detail', {
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
  toast.info('Edit folder', {
    description,
  })
}

const handleDuplicateCollection = async collection => {
  try {
    await galleryStore.duplicateCollection(String(collection.id))
    toast.success('Folder duplicated', {
      description,
    })
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
      parentId, // Only fetch root-level collections
    })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to duplicate folder.',
    })
  }
}

const handleDeleteCollection = collection => {
  collectionToDelete.value = collection
  showDeleteModal.value = true
}

const handleConfirmDelete = async () => {
  if (!collectionToDelete.value) return

  isDeleting.value = true
  try {
    await galleryStore.deleteCollection(String(collectionToDelete.value.id))
    toast.success('Folder deleted', {
      description,
    })
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
      parentId, // Only fetch root-level collections
    })
    showDeleteModal.value = false
    collectionToDelete.value = null
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to delete folder.',
    })
  } finally {
    isDeleting.value = false
  }
}

const handleCancelDelete = () => {
  showDeleteModal.value = false
  collectionToDelete.value = null
}

const handlePublishCollection = async collection => {
  const newStatus =
    collection.status === 'active' || collection.status === 'PUBLISHED' ? 'draft' : 'active'
  try {
    await galleryStore.updateCollection(String(collection.id), { status: newStatus })
    toast.success(newStatus === 'active' ? 'Folder published' : 'Folder unpublished', {
      description:
        newStatus === 'active'
          ? 'Your folder is now live and accessible.'
          : 'Your folder has been unpublished.',
    })
    await galleryStore.fetchCollections({
      search: searchQuery.value,
      sortBy: sortBy.value,
      parentId: null, // Only fetch root-level collections
    })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to update folder status. Please try again.',
    })
  }
}

const handlePreviewCollection = collection => {
  // Open preview in new tab
  const collectionId = collection.id || collection.name || collection.title
  const resolvedRoute = router.resolve({
    name: 'collectionPreview',
    params: { id: collectionId },
  })
  const previewUrl = `${window.location.origin}${resolvedRoute.href}`
  window.open(previewUrl, '_blank')
}

const handleBrowseCollections = () => {
  router.push({ name: 'manageCollections' })
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
      sortBy: sortBy.value,
      starred: true,
    })
  } catch (error) {
    if (error?.name !== 'AbortError' && error?.message !== 'Request aborted') {
      handleError(error, {
        fallbackMessage: 'Failed to search folders.',
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
      sortBy: sortBy.value,
      starred: true,
    })
  } catch (error) {
    if (error?.name !== 'AbortError' && error?.message !== 'Request aborted') {
      handleError(error, {
        fallbackMessage: 'Failed to load folders.',
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
      sortBy: sortBy.value,
      starred: true,
    })
  } catch (error) {
    if (error?.name !== 'AbortError' && error?.message !== 'Request aborted') {
      handleError(error, {
        fallbackMessage: 'Failed to load starred folders.',
      })
    }
  }
})
</script>
