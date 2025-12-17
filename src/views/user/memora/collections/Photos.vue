<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <!-- Hidden File Input -->
      <input
        ref="fileInputRef"
        accept="image/*,video/*"
        class="hidden"
        multiple
        type="file"
        @change="handleFileSelect"
      />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-all duration-300">
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textTertiary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm font-medium">Loading collection...</p>
          </div>
        </div>

        <div v-else class="p-8">
          <!-- Content -->
          <!-- Section Header -->
          <div v-if="isLoadingMedia" class="mb-6">
            <div class="h-7 w-56 rounded bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"></div>
            <div
              class="mt-3 h-4 w-32 rounded bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"
            ></div>
          </div>
          <MediaItemsHeaderBar
            v-else
            v-model:is-sort-menu-open="isSortMenuOpen"
            v-model:is-view-menu-open="isViewMenuOpen"
            :grid-size="gridSize"
            :grid-size-options="gridSizeOptions"
            :is-all-selected="
              selectedMediaIds.size === sortedMediaItems.length && sortedMediaItems.length > 0
            "
            :is-uploading="isUploading"
            :selected-count="selectedMediaIds.size"
            :show-filename="showFilename"
            :sort-options="sortOptions"
            :sort-order="sortOrder"
            :title="selectedSet?.name || 'Highlights'"
            :total-items="sortedMediaItems.length"
            :view-mode="viewMode"
            @sort-change="handleSortChange"
            @grid-size-change="handleGridSizeChange"
            @filename-toggle="handleFilenameToggle"
            @set-view-mode="viewMode = $event"
            @toggle-select-all="handleToggleSelectAll"
            @add-media="handleAddMedia"
          />

          <!-- Bulk Actions Bar -->
          <BulkActionsBar
            :is-all-selected="selectedMediaIds.size === sortedMediaItems.length"
            :is-favorite-loading="isBulkFavoriteLoading"
            :selected-count="selectedMediaIds.size"
            @delete="handleBulkDelete"
            @edit="handleBulkEdit"
            @favorite="handleBulkFavorite"
            @move="showMoveCopyModal = true"
            @tag="handleBulkTag"
            @view="handleBulkView"
            @watermark="handleBulkWatermark"
            @clear-selection="selectedMediaIds = new Set()"
            @select-all="handleToggleSelectAll"
          />

          <!-- Media Grid/List View -->
          <div v-if="isLoadingMedia" class="mb-8">
            <!-- Skeletons while switching sets -->
            <div
              v-if="viewMode === 'grid'"
              :class="[
                'grid gap-4',
                gridSize === 'small'
                  ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
                  : gridSize === 'medium'
                    ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
              ]"
            >
              <div
                v-for="i in 16"
                :key="`skeleton-media-${i}`"
                class="aspect-square rounded-xl bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"
              ></div>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="i in 8"
                :key="`skeleton-row-${i}`"
                class="h-20 rounded-xl bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"
              ></div>
            </div>
          </div>
          <div v-else-if="sortedMediaItems.length > 0" class="mb-8">
            <TransitionGroup
              v-if="viewMode === 'grid'"
              name="media-grid"
              tag="div"
              :class="[
                'grid gap-4',
                gridSize === 'small'
                  ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
                  : gridSize === 'medium'
                    ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
              ]"
            >
              <MediaGridItemCard
                v-for="item in sortedMediaItems"
                :key="item.id"
                :is-selected="selectedMediaIds.has(item.id)"
                :item="item"
                :placeholder-image="placeholderImage"
                :show-filename="showFilename"
                @delete="handleDeleteMedia(item)"
                @download="handleDownloadMedia(item)"
                @open="handleOpenMedia(item)"
                @rename="handleRenameMedia(item)"
                @replace="handleReplacePhoto(item)"
                @watermark="handleWatermarkMedia(item)"
                @toggle-selection="handleToggleMediaSelection(item.id)"
                @open-viewer="openMediaViewer(item)"
                @image-error="handleImageError"
                @quick-share="handleQuickShare(item)"
                @move-copy="handleMoveCopy(item)"
                @copy-filenames="handleCopyFilenames(item)"
                @set-as-cover="handleSetAsCover(item)"
                @remove-watermark="handleRemoveWatermark(item)"
              />
            </TransitionGroup>
            <TransitionGroup v-else name="media-list" tag="div" class="space-y-2">
              <MediaListItemRow
                v-for="item in sortedMediaItems"
                :key="item.id"
                :is-selected="selectedMediaIds.has(item.id)"
                :item="item"
                :placeholder-image="placeholderImage"
                :show-filename="showFilename"
                :subtitle="formatMediaDate(item.createdAt)"
                @delete="handleDeleteMedia(item)"
                @download="handleDownloadMedia(item)"
                @open="handleOpenMedia(item)"
                @rename="handleRenameMedia(item)"
                @replace="handleReplacePhoto(item)"
                @watermark="handleWatermarkMedia(item)"
                @toggle-selection="handleToggleMediaSelection(item.id)"
                @open-viewer="openMediaViewer(item)"
                @image-error="handleImageError"
                @quick-share="handleQuickShare(item)"
                @move-copy="handleMoveCopy(item)"
                @copy-filenames="handleCopyFilenames(item)"
                @set-as-cover="handleSetAsCover(item)"
                @remove-watermark="handleRemoveWatermark(item)"
              />
            </TransitionGroup>
          </div>

          <!-- Empty State / Upload Zone -->
          <MediaUploadDropzone
            v-if="!isLoadingMedia"
            v-model:is-dragging="isDragging"
            :is-empty="sortedMediaItems.length === 0"
            @browse="handleBrowseFiles"
            @drop="handleDrop"
          />
        </div>
      </main>

      <!-- Create/Edit Set Modal -->
      <CreateEditMediaSetModal
        v-model="showCreateSetModal"
        v-model:description="newSetDescription"
        v-model:name="newSetName"
        :is-creating="isCreatingSet"
        :is-editing="!!editingSetIdInModal"
        @cancel="handleCancelCreateSet"
        @confirm="handleCreateSet"
      />

      <!-- Delete Confirmation Modal -->
      <DeleteConfirmationModal
        v-model="showDeleteModal"
        :is-deleting="isDeleting"
        :item-name="getItemName(itemToDelete)"
        :title="getDeleteModalTitle()"
        :warning-message="getDeleteModalWarning()"
        description="This action cannot be undone."
        @cancel="closeDeleteModal"
        @confirm="handleConfirmDeleteItem"
      />

      <!-- Bulk Delete Confirmation Modal -->
      <DeleteConfirmationModal
        v-model="showBulkDeleteModal"
        :is-deleting="isBulkDeleteLoading"
        :item-name="`${selectedMediaIds.size} item${selectedMediaIds.size > 1 ? 's' : ''}`"
        :warning-message="`${selectedMediaIds.size} item${selectedMediaIds.size > 1 ? 's' : ''}`"
        description="This action cannot be undone."
        title="Delete Media"
        @cancel="showBulkDeleteModal = false"
        @confirm="handleConfirmBulkDelete"
      />

      <EditFilenamesModal
        v-model="showEditModal"
        v-model:append-text="editAppendText"
        :is-loading="isBulkEditLoading"
        :selected-count="selectedMediaIds.size"
        @cancel="handleCancelEdit"
        @confirm="handleConfirmEdit"
      />

      <BulkWatermarkModal
        v-model="showBulkWatermarkModal"
        v-model:selected-watermark="selectedBulkWatermark"
        :is-loading="isBulkWatermarkLoading"
        :selected-count="selectedMediaIds.size"
        :watermarks="watermarks"
        @cancel="handleCancelBulkWatermark"
        @confirm="handleConfirmBulkWatermark"
      />

      <TagModal
        v-model="showTagModal"
        v-model:tag-input="tagInput"
        :existing-tags="existingTags"
        :is-loading="isBulkTagLoading"
        :selected-count="selectedMediaIds.size"
        @cancel="handleCancelTag"
        @confirm="handleConfirmTag"
        @add-tag="handleAddTag"
        @remove-tag="existingTags = existingTags.filter(t => t !== $event)"
      />

      <DuplicateFilesModal
        v-model="showDuplicateFilesModal"
        :duplicate-file-actions="duplicateFileActions"
        :duplicate-files="duplicateFiles"
        :is-uploading="isUploading"
        @cancel="handleCancelDuplicateFiles"
        @confirm="handleConfirmDuplicateFiles"
        @set-action="duplicateFileActions.set($event[0], $event[1])"
        @replace-all="
          duplicateFiles.forEach(item => duplicateFileActions.set(item.file.name, 'replace'))
        "
        @skip-all="duplicateFiles.forEach(item => duplicateFileActions.set(item.file.name, 'skip'))"
      />

      <RenameMediaModal
        v-model="showRenameMediaModal"
        v-model:new-media-name="newMediaName"
        @cancel="handleCancelRenameMedia"
        @confirm="handleConfirmRenameMedia"
      />

      <ReplacePhotoModal
        v-model="showReplacePhotoModal"
        :is-replacing="isReplacingPhoto"
        @cancel="handleCancelReplacePhoto"
        @file-change="handleReplacePhotoFileSelect"
      />

      <WatermarkMediaModal
        v-model="showWatermarkMediaModal"
        v-model:selected-watermark="selectedWatermarkForMedia"
        :confirm-label="
          selectedWatermarkForMedia === 'none' && mediaToWatermark?.originalUrl ? 'Remove' : 'Add'
        "
        :is-editing="!!mediaToWatermark?.originalUrl"
        :is-loading="isApplyingWatermark"
        :watermarks="watermarks"
        @cancel="handleCancelWatermarkMedia"
        @confirm="handleConfirmWatermarkMedia"
      />

      <MoveCopyModal
        v-model="showMoveCopyModal"
        v-model:action="moveCopyAction"
        :available-collections="availableCollections"
        :current-collection-id="collection?.id || ''"
        :current-collection-name="collection?.name || ''"
        :is-loading-sets="isLoadingTargetCollectionSets"
        :is-moving="isMovingMedia"
        :selected-count="selectedMediaIds.size"
        :target-collection-id="targetCollectionIdForMove"
        :target-collection-sets="targetCollectionSets"
        :target-set-id="targetSetIdInCollection"
        @cancel="handleCancelMoveCopy"
        @confirm="handleConfirmMoveCopy"
        @collection-change="handleTargetCollectionChange"
        @update:target-set-id="targetSetIdInCollection = $event"
      />

      <!-- Media Viewer Modal (Single) -->
      <MediaViewerSingle
        v-if="selectedMedia && !showMediaViewer"
        :media="selectedMedia"
        :placeholder-image="placeholderImage"
        @close="closeMediaViewer"
        @image-error="handleImageError"
      />

      <!-- Media Viewer Slideshow (Multiple) -->
      <MediaViewerSlideshow
        v-if="showMediaViewer && selectedMediaForView.length > 0"
        :current-index="currentViewIndex"
        :items="selectedMediaForView"
        :placeholder-image="placeholderImage"
        @close="closeMediaViewer"
        @navigate="navigateSlideshow"
        @image-error="handleImageError"
      />
    </template>
  </CollectionLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import BulkActionsBar from '@/components/molecules/BulkActionsBar.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useGalleryStore } from '@/stores/gallery'
import { useWatermarkStore } from '@/stores/watermark'
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useMediaApi } from '@/api/media'
import { toast } from 'vue-sonner'
import MediaItemsHeaderBar from '@/components/organisms/MediaItemsHeaderBar.vue'
import MediaGridItemCard from '@/components/organisms/MediaGridItemCard.vue'
import MediaUploadDropzone from '@/components/organisms/MediaUploadDropzone.vue'
import MediaListItemRow from '@/components/organisms/MediaListItemRow.vue'
import CreateEditMediaSetModal from '@/components/organisms/CreateEditMediaSetModal.vue'
import DuplicateFilesModal from '@/components/organisms/DuplicateFilesModal.vue'
import RenameMediaModal from '@/components/organisms/RenameMediaModal.vue'
import TagModal from '@/components/organisms/TagModal.vue'
import EditFilenamesModal from '@/components/organisms/EditFilenamesModal.vue'
import BulkWatermarkModal from '@/components/organisms/BulkWatermarkModal.vue'
import ReplacePhotoModal from '@/components/organisms/ReplacePhotoModal.vue'
import WatermarkMediaModal from '@/components/organisms/WatermarkMediaModal.vue'
import MoveCopyModal from '@/components/organisms/MoveCopyModal.vue'
import MediaViewerSingle from '@/components/organisms/MediaViewerSingle.vue'
import MediaViewerSlideshow from '@/components/organisms/MediaViewerSlideshow.vue'
import { fileToDataURL } from '@/utils/fileToDataURL'
import { applyWatermarkToImage } from '@/utils/watermark/applyWatermarkToImage'
import { createThumbnail } from '@/utils/media/createThumbnail'
import { formatMediaDate } from '@/utils/media/formatMediaDate'
import { getFileBaseName } from '@/utils/media/getFileBaseName'
import { triggerFileInputClick } from '@/utils/media/triggerFileInputClick'
import { getCollectionShareLink } from '@/utils/media/getCollectionShareLink'
import { getMediaShareUrl } from '@/utils/media/getMediaShareUrl'
import { getMediaDownloadUrl } from '@/utils/media/getMediaDownloadUrl'
import { getDownloadFilename } from '@/utils/media/getDownloadFilename'
import { fetchDownloadBlob } from '@/utils/media/fetchDownloadBlob'
import { triggerBrowserDownload } from '@/utils/media/triggerBrowserDownload'
import { triggerFallbackDownloadLink } from '@/utils/media/triggerFallbackDownloadLink'
import { copyTextToClipboard } from '@/utils/clipboard/copyTextToClipboard'
import { useMediaUploadFlow } from '@/composables/useMediaUploadFlow'
// Media Sets sidebar is store-driven (Option B)
import { useBulkDeleteFlow } from '@/composables/useBulkDeleteFlow'
import { useBulkMoveToSetFlow } from '@/composables/useBulkMoveToSetFlow'
import { useMoveCopyFlow } from '@/composables/useMoveCopyFlow'
import { useBulkWatermarkFlow } from '@/composables/useBulkWatermarkFlow'
import { useBulkTagFlow } from '@/composables/useBulkTagFlow'
import { useBulkEditFilenamesFlow } from '@/composables/useBulkEditFilenamesFlow'
import { useBulkFavoriteFlow } from '@/composables/useBulkFavoriteFlow'
import { useMediaShareDownloadActions } from '@/composables/useMediaShareDownloadActions'
import { useMediaRenameDeleteActions } from '@/composables/useMediaRenameDeleteActions'
import { useReplacePhotoFlow } from '@/composables/useReplacePhotoFlow'
import { useMediaWatermarkActions } from '@/composables/useMediaWatermarkActions'
import { useCollectionCoverActions } from '@/composables/useCollectionCoverActions'
import { useMediaViewerFlow } from '@/composables/useMediaViewerFlow'
import { useMediaSelectionFlow } from '@/composables/useMediaSelectionFlow'
import { useCollectionLoadFlow } from '@/composables/useCollectionLoadFlow'
import { useCollectionMediaItemsFlow } from '@/composables/useCollectionMediaItemsFlow'
import { useMediaListUiPrefs } from '@/composables/useMediaListUiPrefs'
import { getMediaFilename } from '@/utils/media/getMediaFilename'
import { createThumbnailFromDataURL } from '@/utils/media/createThumbnailFromDataURL'
import { useCollectionMediaSetsSidebarStore } from '@/stores/collectionMediaSetsSidebar'
import { storeToRefs } from 'pinia'

// Toast helper fallback (used in many places)
const description = ''

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const watermarkStore = useWatermarkStore()
const mediaApi = useMediaApi()
const mediaSetsSidebar = useCollectionMediaSetsSidebarStore()
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
} = storeToRefs(mediaSetsSidebar)

// Store actions (must be pulled from the store itself, not `storeToRefs`)
const { handleCreateSet, handleCancelCreateSet } = mediaSetsSidebar

const collection = ref(null)
const collectionStatus = ref('draft')
const eventDate = ref(null)
// Sidebar collapse state with persistence
const { isSidebarCollapsed } = useSidebarCollapse()
const selectedWatermark = ref('none')
const selectedPresetId = ref('none')
const isDragging = ref(false)
const viewMode = ref('grid')
const gridSize = ref('small')
const showFilename = ref(true)
const selectedMediaIds = ref(new Set())
const showMoveCopyModal = ref(false)
const moveCopyAction = ref('move')
const targetCollectionIdForMove = ref('')
const targetSetIdInCollection = ref('')
const isMovingMedia = ref(false)
const availableCollections = computed(() => {
  return galleryStore.collections.filter(c => c.id !== collection.value?.id)
})
const targetCollectionSets = ref([])
const isLoadingTargetCollectionSets = ref(false)
const isBulkFavoriteLoading = ref(false)
const isBulkTagLoading = ref(false)
const isBulkEditLoading = ref(false)
const isBulkDeleteLoading = ref(false)
const isUpdatingSetCounts = ref(false)
const sortOrder = ref('uploaded-new-old')
const isSortMenuOpen = ref(false)
const isViewMenuOpen = ref(false)
const mediaItems = ref([])
const isLoadingMedia = ref(false)
const selectedMedia = ref(null)
const selectedMediaForView = ref([])
const currentViewIndex = ref(0)
const showMediaViewer = ref(false)
const showBulkDeleteModal = ref(false)
const showEditModal = ref(false)
const showTagModal = ref(false)
const showBulkWatermarkModal = ref(false)
const selectedBulkWatermark = ref('none')
const isBulkWatermarkLoading = ref(false)
const editAppendText = ref('')
const tagInput = ref('')
const existingTags = ref([])
const showRenameMediaModal = ref(false)
const mediaToRename = ref(null)
const newMediaName = ref('')
const showReplacePhotoModal = ref(false)
const mediaToReplace = ref(null)
const isReplacingPhoto = ref(false)
const showWatermarkMediaModal = ref(false)
const mediaToWatermark = ref(null)
const selectedWatermarkForMedia = ref('none')
const isApplyingWatermark = ref(false)

// Fallback placeholder image (SVG data URL)
const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='

// Handle image load errors
const handleImageError = event => {
  const img = event.target
  if (img.src !== placeholderImage) {
    img.src = placeholderImage
  }
}
const isLoading = ref(false)
const isSavingPreset = ref(false)
const isSavingWatermark = ref(false)
const setNameInputRef = ref(null)
const fileInputRef = ref(null)
const {
  showDeleteModal,
  itemToDelete,
  isDeleting,
  openDeleteModal,
  closeDeleteModal,
  getItemName,
} = useDeleteConfirmation()

// MediaSet type definition removed (TypeScript syntax not allowed in JS)

// `mediaSets`, `sortedMediaSets`, and drag state are store refs (via `storeToRefs`)

const selectedSet = computed(() => {
  const sets = sortedMediaSets.value || []
  return sets.find(set => set.id === selectedSetId.value) || sets[0]
})

// Sort options
const sortOptions = [
  { label: 'Uploaded (New → Old)', value: 'uploaded-new-old' },
  { label: 'Uploaded (Old → New)', value: 'uploaded-old-new' },
  { label: 'Date Taken (New → Old)', value: 'date-taken-new-old' },
  { label: 'Date Taken (Old → New)', value: 'date-taken-old-new' },
  { label: 'Name (A → Z)', value: 'name-a-z' },
  { label: 'Name (Z → A)', value: 'name-z-a' },
  { label: 'Random', value: 'random' },
]

const gridSizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
]

// Sorted media items based on sort order
const sortedMediaItems = computed(() => {
  const items = [...mediaItems.value]

  switch (sortOrder.value) {
    case 'uploaded-new-old':
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'uploaded-old-new':
      return items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'date-taken-new-old':
      // Assuming dateTaken is stored in description or we use createdAt
      return items.sort((a, b) => {
        const dateA = a.dateTaken ? new Date(a.dateTaken).getTime() : 0
        const dateB = b.dateTaken ? new Date(b.dateTaken).getTime() : 0
        return dateB - dateA
      })
    case 'date-taken-old-new':
      return items.sort((a, b) => {
        const dateA = a.dateTaken ? new Date(a.dateTaken).getTime() : 0
        const dateB = b.dateTaken ? new Date(b.dateTaken).getTime() : 0
        return dateA - dateB
      })
    case 'name-a-z':
      return items.sort((a, b) => {
        const nameA = (a.title || '').toLowerCase()
        const nameB = (b.title || '').toLowerCase()
        return nameA.localeCompare(nameB)
      })
    case 'name-z-a':
      return items.sort((a, b) => {
        const nameA = (a.title || '').toLowerCase()
        const nameB = (b.title || '').toLowerCase()
        return nameB.localeCompare(nameA)
      })
    case 'random':
      return items.sort(() => Math.random() - 0.5)
    default:
      return items
  }
})

const { handleSortChange, handleGridSizeChange, handleFilenameToggle } = useMediaListUiPrefs({
  sortOrder,
  isSortMenuOpen,
  gridSize,
  isViewMenuOpen,
  showFilename,
})

const { openMediaViewer, closeMediaViewer, navigateSlideshow } = useMediaViewerFlow({
  selectedMedia,
  selectedMediaForView,
  currentViewIndex,
  showMediaViewer,
})

const { updateSetCounts, loadMediaItems } = useCollectionMediaItemsFlow({
  collection,
  selectedSetId,
  mediaItems,
  isLoadingMedia,
  isUpdatingSetCounts,
  mediaApi,
  galleryStore,
  mediaSetsSidebar,
  mediaSets,
  description,
})

// When user selects a different set, reload the media list to reflect that set.
watch(
  () => selectedSetId.value,
  async () => {
    // Clear the previous set’s media immediately to avoid showing stale items.
    mediaItems.value = []
    await loadMediaItems()
  }
)

// Media item context menu handlers
const handleOpenMedia = item => {
  // Show in media viewer instead of opening in new tab
  openMediaViewer(item)
}

const { handleQuickShare, handleDownloadMedia, handleCopyFilenames, handleCopyLink } =
  useMediaShareDownloadActions({
    getMediaShareUrl,
    getMediaDownloadUrl,
    getDownloadFilename,
    fetchDownloadBlob,
    triggerBrowserDownload,
    triggerFallbackDownloadLink,
    copyTextToClipboard,
    getMediaFilename,
    getCollectionShareLink,
    route,
    description,
  })

const handleMoveCopy = item => {
  // Select the single item and open the move/copy modal
  selectedMediaIds.value.clear()
  selectedMediaIds.value.add(item.id)
  moveCopyAction.value = 'move'
  showMoveCopyModal.value = true
  if (collection.value) {
    targetCollectionIdForMove.value = collection.value.id
    handleTargetCollectionChange(collection.value.id)
  }
}

// (moved to useMediaShareDownloadActions)

const { handleSetAsCover, handleCoverImageUpload } = useCollectionCoverActions({
  collection,
  galleryStore,
  createThumbnailFromDataURL,
  description,
})

const { handleReplacePhoto, handleCancelReplacePhoto, handleReplacePhotoFileSelect } =
  useReplacePhotoFlow({
    mediaToReplace,
    showReplacePhotoModal,
    isReplacingPhoto,
    selectedWatermark,
    watermarkStore,
    mediaApi,
    mediaItems,
    createThumbnail,
    getFileBaseName,
    fileToDataURL,
    applyWatermarkToImage,
    description,
  })

const {
  handleWatermarkMedia,
  handleCancelWatermarkMedia,
  handleRemoveWatermark,
  handleConfirmWatermarkMedia,
} = useMediaWatermarkActions({
  showWatermarkMediaModal,
  mediaToWatermark,
  selectedWatermarkForMedia,
  selectedWatermark,
  isApplyingWatermark,
  watermarkStore,
  mediaApi,
  mediaItems,
  applyWatermarkToImage,
  description,
})

// (moved to useMediaRenameDeleteActions)

const getDeleteModalTitle = () => {
  if (!itemToDelete.value) return 'Delete'
  const item = itemToDelete.value
  return item.collectionId ? 'Delete Media' : 'Delete Set'
}

const getDeleteModalWarning = () => {
  if (!itemToDelete.value) return 'This action cannot be undone.'
  const item = itemToDelete.value
  return item.collectionId
    ? 'This media item will be permanently deleted.'
    : 'This set will be permanently deleted.'
}

// (moved to useMediaRenameDeleteActions)

const { handleToggleMediaSelection, handleToggleSelectAll } = useMediaSelectionFlow({
  selectedMediaIds,
  sortedMediaItems,
  description,
})

// Bulk action handlers
const { handleBulkDelete, handleConfirmBulkDelete } = useBulkDeleteFlow({
  selectedMediaIds,
  showBulkDeleteModal,
  isBulkDeleteLoading,
  mediaApi,
  mediaItems,
  updateSetCounts,
  description,
})

const { handleBulkMoveToSet } = useBulkMoveToSetFlow({
  selectedMediaIds,
  collection,
  isMovingMedia,
  mediaApi,
  loadMediaItems,
  updateSetCounts,
  description,
})

const { handleTargetCollectionChange, handleCancelMoveCopy, handleConfirmMoveCopy } =
  useMoveCopyFlow({
    showMoveCopyModal,
    moveCopyAction,
    targetCollectionIdForMove,
    targetSetIdInCollection,
    targetCollectionSets,
    isLoadingTargetCollectionSets,
    isMovingMedia,
    selectedMediaIds,
    collection,
    mediaSets,
    mediaItems,
    selectedSetId,
    galleryStore,
    mediaApi,
    loadMediaItems,
    updateSetCounts,
    description,
  })

// Bulk action handlers
const { handleBulkFavorite } = useBulkFavoriteFlow({
  selectedMediaIds,
  isBulkFavoriteLoading,
  mediaItems,
  mediaApi,
  loadMediaItems,
  description,
})

const handleBulkView = () => {
  if (selectedMediaIds.value.size === 0) return

  const ids = Array.from(selectedMediaIds.value)
  const items = mediaItems.value.filter(m => ids.includes(m.id))

  // Filter to only images for preview
  const imageItems = items.filter(item => item.type === 'image')

  if (imageItems.length === 0) {
    toast.info('No images to view', {
      description,
    })
    return
  }

  selectedMediaForView.value = imageItems
  currentViewIndex.value = 0
  showMediaViewer.value = true
}

const { handleBulkTag, handleCancelTag, handleAddTag, handleConfirmTag } = useBulkTagFlow({
  selectedMediaIds,
  mediaItems,
  showTagModal,
  tagInput,
  existingTags,
  isBulkTagLoading,
  mediaApi,
  loadMediaItems,
  description,
})

const { handleBulkEdit, handleCancelEdit, handleConfirmEdit } = useBulkEditFilenamesFlow({
  selectedMediaIds,
  showEditModal,
  editAppendText,
  isBulkEditLoading,
  mediaItems,
  mediaApi,
  loadMediaItems,
  description,
})

const { handleBulkWatermark, handleCancelBulkWatermark, handleConfirmBulkWatermark } =
  useBulkWatermarkFlow({
    selectedMediaIds,
    showBulkWatermarkModal,
    selectedBulkWatermark,
    isBulkWatermarkLoading,
    watermarkStore,
    mediaApi,
    mediaItems,
    applyWatermarkToImage,
    description,
  })

// (edit handlers moved to useBulkEditFilenamesFlow)

const watermarks = computed(() => watermarkStore.watermarks)

const { loadCollection } = useCollectionLoadFlow({
  collection,
  collectionStatus,
  eventDate,
  selectedPresetId,
  selectedWatermark,
  mediaSets,
  selectedSetId,
  sortedMediaSets,
  isLoading,
  isSavingPreset,
  isSavingWatermark,
  route,
  router,
  galleryStore,
  watermarkStore,
  updateSetCounts,
  loadMediaItems,
})

const goBack = () => {
  router.push({ name: 'manageCollections' })
}

// Media Sets CRUD/drag/drop is handled by `useCollectionMediaSetsSidebarStore`.

const {
  handleRenameMedia,
  handleCancelRenameMedia,
  handleConfirmRenameMedia,
  handleDeleteMedia,
  handleConfirmDeleteItem,
} = useMediaRenameDeleteActions({
  showRenameMediaModal,
  mediaToRename,
  newMediaName,
  itemToDelete,
  openDeleteModal,
  closeDeleteModal,
  mediaItems,
  selectedMediaIds,
  mediaApi,
  updateSetCounts,
  handleConfirmDeleteSet: mediaSetsSidebar.confirmDeleteSet,
  description,
})

const handleAddMedia = () => {
  triggerFileInputClick(fileInputRef.value)
}

const handleBrowseFiles = () => {
  triggerFileInputClick(fileInputRef.value)
}

const {
  isUploading,
  showDuplicateFilesModal,
  duplicateFiles,
  filesToUpload,
  duplicateFileActions,
  processFiles,
  handleConfirmDuplicateFiles,
  handleCancelDuplicateFiles,
  uploadFiles,
  handleFileSelect,
  handleDrop,
} = useMediaUploadFlow({
  collection,
  selectedSetId,
  mediaItems,
  selectedWatermark,
  watermarkStore,
  mediaApi,
  updateSetCounts,
  isDragging,
  description,
})

// (moved to useMediaShareDownloadActions)

// (store handles media set drag/drop)

// Watch for route changes
watch(
  () => route.params.uuid,
  () => {
    loadCollection()
  }
)
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Custom scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 175, 0.4);
  border-radius: 4px;
  transition: background 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 175, 0.6);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(51, 85, 99, 0.4);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(51, 85, 99, 0.6);
}

/* Smooth transitions for set list items */
.set-list-enter-active,
.set-list-leave-active {
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.set-list-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.set-list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.set-list-move {
  transition: transform 0.2s cubic-bezier(0, 0, 0.2, 1);
}

/* Indicator bar transition */
.indicator-enter-active,
.indicator-leave-active {
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.indicator-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.media-list-enter-active,
.media-list-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}
.media-list-enter-from,
.media-list-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
.media-list-move {
  transition: transform 180ms ease;
}

.media-grid-enter-active,
.media-grid-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}
.media-grid-enter-from,
.media-grid-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
.media-grid-move {
  transition: transform 200ms ease;
}

.indicator-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Smooth animations for card interactions */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Smooth hover transitions */
.group:hover .opacity-0 {
  transition: opacity 0.2s;
}

/* Fade transition for title editing */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Slide up transition for bulk actions bar */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Smooth scale utilities */
.scale-102 {
  transform: scale(1.02);
}

/* Fade transition for loading overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up transition for bulk actions bar */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
