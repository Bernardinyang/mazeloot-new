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
      <main
        class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-all duration-300 relative"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <ContentLoader v-if="isLoading" message="Loading collection..." />

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
            v-else-if="selectedSetId"
            v-model:is-sort-menu-open="isSortMenuOpen"
            v-model:is-view-menu-open="isViewMenuOpen"
            store-type="collection"
            :grid-size-options="gridSizeOptions"
            :is-all-selected="
              selectedMediaIds.size === sortedMediaItems.length && sortedMediaItems.length > 0
            "
            :is-uploading="isUploading"
            :selected-count="selectedMediaIds.size"
            :sort-options="sortOptions"
            :title="selectedSet?.name || 'Highlights'"
            :total-items="sortedMediaItems.length"
            @toggle-select-all="handleToggleSelectAll"
            @add-media="handleAddMedia"
          />

          <!-- Bulk Actions Bar -->
          <BulkActionsBar
            v-if="selectedSetId"
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
          <div v-if="selectedSetId && isLoadingMedia" class="mb-8">
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
          <div v-else-if="selectedSetId && sortedMediaItems.length > 0" class="mb-8">
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
                :selection-status="'collection'"
                @delete="handleDeleteMedia(item)"
                @download="handleDownloadMedia(item)"
                @open="handleOpenMedia(item)"
                @rename="handleRenameMedia(item)"
                @replace="handleReplacePhoto(item)"
                @watermark="handleWatermarkMedia(item)"
                @toggle-selection="handleToggleMediaSelection(item.id)"
                @toggle-featured="handleToggleFeatured(item)"
                @open-viewer="openMediaViewer(item)"
                @view-details="handleViewDetails(item)"
                @image-error="handleImageError"
                @quick-share="handleQuickShare(item)"
                @move-copy="handleMoveCopy(item)"
                @copy-filenames="handleCopyFilenames(item)"
                @set-as-cover="handleSetAsCover(item)"
                @remove-watermark="handleRemoveWatermark(item)"
                @star-click="handleStarMedia(item)"
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
                :selection-status="'collection'"
                :subtitle="formatMediaDate(item.createdAt)"
                @delete="handleDeleteMedia(item)"
                @download="handleDownloadMedia(item)"
                @open="handleOpenMedia(item)"
                @rename="handleRenameMedia(item)"
                @replace="handleReplacePhoto(item)"
                @watermark="handleWatermarkMedia(item)"
                @toggle-selection="handleToggleMediaSelection(item.id)"
                @toggle-featured="handleToggleFeatured(item)"
                @open-viewer="openMediaViewer(item)"
                @view-details="handleViewDetails(item)"
                @image-error="handleImageError"
                @quick-share="handleQuickShare(item)"
                @move-copy="handleMoveCopy(item)"
                @copy-filenames="handleCopyFilenames(item)"
                @set-as-cover="handleSetAsCover(item)"
                @remove-watermark="handleRemoveWatermark(item)"
                @star-click="handleStarMedia(item)"
              />
            </TransitionGroup>

            <!-- Pagination -->
            <Pagination
              v-if="mediaPagination.totalPages > 1 || mediaPagination.total > 0"
              :current-page="mediaPagination.page"
              :limit="mediaPagination.limit"
              :total="mediaPagination.total"
              :total-pages="mediaPagination.totalPages"
              :show-page-size="true"
              @page-change="goToMediaPage"
              @page-size-change="setMediaPerPage"
            />
          </div>

          <!-- Empty State / Upload Zone -->
          <!-- Show empty state when no sets exist -->
          <div
            v-if="
              !isLoadingMedia &&
              collection &&
              sortedMediaSets.length === 0
            "
            class="flex items-center justify-center py-16"
          >
            <EmptyState
              :action-icon="Plus"
              :action-class="'text-white transition-colors'"
              :icon="FolderPlus"
              action-label="Create Set"
              description="Create a set to organize and upload your media files."
              message="No sets in this collection"
              @action="mediaSetsSidebar.handleAddSet"
            />
          </div>
          <!-- Show upload zone when sets exist but no media -->
          <MediaUploadDropzone
            v-else-if="
              !isLoadingMedia &&
              collection &&
              sortedMediaSets.length > 0
            "
            v-model:is-dragging="isDragging"
            :is-empty="sortedMediaItems.length === 0"
            @browse="handleBrowseFiles"
            @drop="handleDrop"
          />
          <!-- Show empty state for when no media -->
          <div
            v-else-if="sortedMediaItems.length === 0 && !isLoadingMedia"
            class="text-center py-16"
          >
            <p :class="theme.textSecondary" class="text-lg mb-4">No media in this set yet</p>
            <p :class="theme.textTertiary" class="text-sm">
              Select a set from the sidebar or upload media to get started.
            </p>
          </div>
        </div>
      </main>

      <!-- Create/Edit Set Modal -->
      <CreateEditMediaSetModal
        v-model="showCreateSetModal"
        v-model:description="newSetDescription"
        v-model:name="newSetName"
        :is-creating="isCreatingSet"
        :is-editing="!!editingSetIdInModal"
        context="collection"
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
        :key="duplicateFileActionsKey"
        v-model="showDuplicateFilesModal"
        :duplicate-file-actions="duplicateFileActionsObject"
        :duplicate-files="duplicateFiles"
        :is-uploading="isUploading"
        @cancel="handleCancelDuplicateFiles"
        @confirm="handleConfirmDuplicateFiles"
        @set-action="handleSetDuplicateAction"
        @replace-all="handleReplaceAllDuplicates"
        @skip-all="handleSkipAllDuplicates"
      />

      <UploadProgressBar
        v-model="showUploadProgress"
        :is-uploading="isUploadingFromWorkflow"
        :overall-progress="overallProgressFromWorkflow"
        :upload-errors="uploadErrorsFromWorkflow"
        :upload-progress="uploadProgressFromWorkflow"
        @cancel="cancelUpload"
        @close="handleCloseUploadProgress"
        @retry="handleRetryUpload"
      />

      <RenameMediaModal
        v-model="showRenameMediaModal"
        v-model:new-media-name="newMediaName"
        :is-renaming="isRenamingMedia"
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
        :confirm-label="watermarkConfirmLabel"
        :is-editing="hasWatermarkOnMedia"
        :is-loading="isApplyingWatermark"
        :is-loading-watermarks="watermarkStore.isLoading"
        :watermarks="watermarks"
        @cancel="handleCancelWatermarkMedia"
        @confirm="handleConfirmWatermarkMedia"
        @preview="handlePreviewWatermark"
      />

      <WatermarkPreviewModal
        v-model="showWatermarkPreviewModal"
        :media-image-url="previewMediaImageUrl"
        :watermark="previewWatermark"
        @apply="handleApplyFromPreview"
        @cancel="showWatermarkPreviewModal = false"
      />

      <MoveCopyModal
        v-model="showMoveCopyModal"
        v-model:action="moveCopyAction"
        context="collection"
        :available-collections="availableCollections"
        :current-collection-id="collection?.id || ''"
        :current-collection-name="collection?.name || ''"
        :target-collection-id="targetCollectionIdForMove"
        :target-collection-sets="targetCollectionSets"
        :is-loading-sets="isLoadingTargetCollectionSets"
        :target-set-id="targetSetIdInCollection"
        :is-moving="isMovingMedia"
        :selected-count="selectedMediaIds.size"
        @selection-change="handleTargetCollectionChange"
        @update:target-set-id="targetSetIdInCollection = $event"
        @cancel="handleCancelMoveCopy"
        @confirm="handleConfirmMoveCopy"
      />

      <!-- Media Lightbox -->
      <MediaLightbox
        v-model="showMediaViewer"
        :items="
          selectedMediaForView.length > 0
            ? selectedMediaForView
            : selectedMedia
              ? [selectedMedia]
              : []
        "
        :initial-index="currentViewIndex"
        :placeholder-image="placeholderImage"
        :collection-id="collection?.id || collection?.uuid"
        :set-id="selectedSetId || null"
        @close="closeMediaViewer"
        @download="handleDownloadMedia"
        @image-error="handleImageError"
        @favorite="handleStarMediaFromLightbox"
      />

      <MediaDetailSidebar
        v-model="showMediaDetailSidebar"
        :media="selectedMediaForDetails"
        :placeholder-image="placeholderImage"
        @view="openMediaViewer"
        @download="handleDownloadMedia"
      />

      <!-- Focal Point Modal -->
      <FocalPointModal
        v-model:is-open="showFocalPointModal"
        :image-url="focalPointImageUrl"
        :initial-focal-point="currentFocalPoint"
        @confirm="handleFocalPointConfirm"
      />

      <!-- Remove Watermark Loading Modal -->
      <CenterModal
        v-model="showRemoveWatermarkLoading"
        title="Removing Watermark"
        content-class="sm:max-w-md"
      >
        <div class="flex flex-col items-center justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-accent mb-4" />
          <p :class="theme.textPrimary" class="text-sm font-medium">
            Removing watermark from image...
          </p>
          <p :class="theme.textSecondary" class="text-xs mt-2">
            Please wait while we restore the original image.
          </p>
        </div>
      </CenterModal>
    </template>
  </CollectionLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, FolderPlus, Plus } from 'lucide-vue-next'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import BulkActionsBar from '@/components/molecules/BulkActionsBar.vue'
import ContentLoader from '@/components/molecules/ContentLoader.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useGalleryStore } from '@/stores/gallery'
import { useWatermarkStore } from '@/stores/watermark'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useMediaApi } from '@/api/media'
import { toast } from '@/utils/toast'
import MediaItemsHeaderBar from '@/components/organisms/MediaItemsHeaderBar.vue'
import MediaGridItemCard from '@/components/organisms/MediaGridItemCard.vue'
import MediaUploadDropzone from '@/components/organisms/MediaUploadDropzone.vue'
import MediaListItemRow from '@/components/organisms/MediaListItemRow.vue'
import CreateEditMediaSetModal from '@/components/organisms/CreateEditMediaSetModal.vue'
import DuplicateFilesModal from '@/components/organisms/DuplicateFilesModal.vue'
import UploadProgressBar from '@/components/organisms/UploadProgressBar.vue'
import RenameMediaModal from '@/components/organisms/RenameMediaModal.vue'
import TagModal from '@/components/organisms/TagModal.vue'
import EditFilenamesModal from '@/components/organisms/EditFilenamesModal.vue'
import BulkWatermarkModal from '@/components/organisms/BulkWatermarkModal.vue'
import ReplacePhotoModal from '@/components/organisms/ReplacePhotoModal.vue'
import WatermarkMediaModal from '@/components/organisms/WatermarkMediaModal.vue'
import WatermarkPreviewModal from '@/components/organisms/WatermarkPreviewModal.vue'
import MediaLightbox from '@/components/organisms/MediaLightbox.vue'
import MediaDetailSidebar from '@/components/organisms/MediaDetailSidebar.vue'
import MoveCopyModal from '@/components/organisms/MoveCopyModal.vue'
import FocalPointModal from '@/components/organisms/FocalPointModal.vue'
import CenterModal from '@/components/molecules/CenterModal.vue'
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
import { useCollectionWorkflow } from '@/composables/useCollectionWorkflow'
// Media Sets sidebar is store-driven (Option B)
import { useBulkMoveToSetFlow } from '@/composables/useBulkMoveToSetFlow'
import { useMoveCopyFlow } from '@/composables/useMoveCopyFlow'
import { useBulkWatermarkFlow } from '@/composables/useBulkWatermarkFlow'
import { useBulkTagFlow } from '@/composables/useBulkTagFlow'
import { useMediaShareDownloadActions } from '@/composables/useMediaShareDownloadActions'
import { useMediaWatermarkActions } from '@/composables/useMediaWatermarkActions'
import { useCollectionCoverActions } from '@/composables/useCollectionCoverActions'
import { useMediaViewerFlow } from '@/composables/useMediaViewerFlow'
import { useMediaSelectionFlow } from '@/composables/useMediaSelectionFlow'
import { useCollectionLoadFlow } from '@/composables/useCollectionLoadFlow'
import { useAsyncPagination } from '@/composables/useAsyncPagination'
import { useMediaActions } from '@/composables/useMediaActions'
import { useCollectionsApi } from '@/api/collections'
import Pagination from '@/components/molecules/Pagination.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
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
// Use gallery store for view settings
const { viewMode, gridSize, showFilename, sortOrder } = storeToRefs(galleryStore)
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
const isRenamingMedia = ref(false)
const isUpdatingSetCounts = ref(false)
const isSortMenuOpen = ref(false)
const isViewMenuOpen = ref(false)
const mediaItems = ref([])
const selectedMedia = ref(null)
const selectedMediaForView = ref([])
const currentViewIndex = ref(0)
const showMediaViewer = ref(false)
const showMediaDetailSidebar = ref(false)
const selectedMediaForDetails = ref(null)

// Focal point modal state
const showFocalPointModal = ref(false)
const focalPointImageUrl = ref(null)
const selectedMediaForCover = ref(null)
const currentFocalPoint = ref({ x: 50, y: 50 })

const showWatermarkPreviewModal = ref(false)
const previewMediaImageUrl = ref('')
const previewWatermark = ref(null)
const showRemoveWatermarkLoading = ref(false)
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
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const isDeleting = ref(false)

const openDeleteModal = item => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const getItemName = () => {
  if (!itemToDelete.value) return 'Item'
  const item = itemToDelete.value
  // For media items, try to get filename from file relationship
  return item.file?.filename || item.filename || item.title || item.name || 'Item'
}

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

// Filter media items by selected set
const filteredMediaItems = computed(() => {
  if (!selectedSetId.value) {
    return []
  }
  return mediaItems.value.filter(item => item.setId === selectedSetId.value)
})

// Media items are now sorted/filtered by the backend
const sortedMediaItems = computed(() => filteredMediaItems.value)

const { closeMediaViewer } = useMediaViewerFlow({
  selectedMedia,
  selectedMediaForView,
  currentViewIndex,
  showMediaViewer,
})

// Override openMediaViewer to work with lightbox
const openMediaViewer = item => {
  // Find the index of the item in the sorted media items
  const index = sortedMediaItems.value.findIndex(m => m.id === item.id)

  selectedMediaForView.value = sortedMediaItems.value
  currentViewIndex.value = index >= 0 ? index : 0
  showMediaViewer.value = true
}

// Load media items for the selected set with pagination
const collectionsApi = useCollectionsApi()

// Convert frontend sort format to backend format
const convertSortOrder = sortValue => {
  if (!sortValue) return null

  if (sortValue === 'random') return 'random'

  // Map frontend format to backend format
  const mapping = {
    'uploaded-new-old': 'uploaded-desc',
    'uploaded-old-new': 'uploaded-asc',
    'date-taken-new-old': 'date-taken-desc',
    'date-taken-old-new': 'date-taken-asc',
    'name-a-z': 'name-asc',
    'name-z-a': 'name-desc',
  }

  return mapping[sortValue] || sortValue
}

/**
 * Fetch function for pagination
 */
const fetchSetMedia = async params => {
  if (!collection.value?.id || !selectedSetId.value) {
    return { data: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1 } }
  }

  const backendSortBy = convertSortOrder(sortOrder.value)
  const fetchParams = {
    ...params,
  }

  if (backendSortBy) {
    fetchParams.sortBy = backendSortBy
  }

  const response = await collectionsApi.fetchSetMedia(
    collection.value.id,
    selectedSetId.value,
    fetchParams
  )

  // Handle both paginated and non-paginated responses
  if (response && typeof response === 'object' && 'data' in response && 'pagination' in response) {
    // Paginated response - map items to include setId
    return {
      data: Array.isArray(response.data)
        ? response.data.map(m => ({ ...m, setId: selectedSetId.value }))
        : [],
      pagination: response.pagination,
    }
  } else if (Array.isArray(response)) {
    // Non-paginated array response (backward compatibility)
    const mapped = response.map(m => ({ ...m, setId: selectedSetId.value }))
    return {
      data: mapped,
      pagination: {
        page: 1,
        limit: mapped.length,
        total: mapped.length,
        totalPages: 1,
      },
    }
  }

  return { data: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1 } }
}

// Use async pagination composable
const {
  data: paginatedMediaItems,
  pagination: mediaPagination,
  isLoading: isLoadingMediaPagination,
  fetch: fetchMedia,
  goToPage: goToMediaPage,
  resetToFirstPage: resetMediaToFirstPage,
  setPerPage: setMediaPerPage,
} = useAsyncPagination(fetchSetMedia, {
  initialPage: 1,
  initialPerPage: 10,
  autoFetch: false, // We'll call fetch manually when collection/set changes
  watchForReset: [sortOrder], // Reset to page 1 when sort changes
})

// Keep mediaItems in sync with paginated data
watch(
  paginatedMediaItems,
  newItems => {
    // Only update mediaItems for the current set
    const otherMedia = mediaItems.value.filter(item => item.setId !== selectedSetId.value)
    mediaItems.value = [...otherMedia, ...newItems]
  },
  { immediate: true }
)

// Load media items for the selected set
const loadMediaItems = async () => {
  if (!collection.value?.id || !selectedSetId.value) {
    return
  }

  // Use pagination fetch
  await fetchMedia()
}

// Update isLoadingMedia to use pagination loading state
const isLoadingMedia = computed(() => isLoadingMediaPagination.value)

// Update set counts by reloading collection and updating sidebar context
const updateSetCounts = async () => {
  if (!collection.value?.id) return
  
  // Ensure collectionId is set in the store
  if (!mediaSetsSidebar.collectionId || mediaSetsSidebar.collectionId !== collection.value.id) {
    mediaSetsSidebar.setContext(collection.value.id, mediaSetsSidebar.mediaSets || [])
  }
  
  // Use the store's loadMediaSets which fetches fresh collection data and updates counts
  // This will force refresh from backend and update the mediaSets reactive array
  await mediaSetsSidebar.loadMediaSets()
  
  // Also update the local collection ref to keep it in sync
  const updatedCollection = await galleryStore.fetchCollection(collection.value.id, true)
  if (updatedCollection) {
    collection.value = { ...collection.value, ...updatedCollection }
  }
}

// Sync selectedSetId with route query parameter (like SelectionDetail)
let isUpdatingFromRoute = false
watch(selectedSetId, newSetId => {
  // Don't update route if we're updating from route (to avoid loops)
  if (isUpdatingFromRoute) return

  if (newSetId) {
    router.replace({
      query: {
        ...route.query,
        setId: newSetId,
      },
    })
    // Reset pagination to first page and load media for the newly selected set
    resetMediaToFirstPage()
  } else {
    // Remove setId from query if no set is selected
    const query = { ...route.query }
    delete query.setId
    router.replace({ query })
  }
})

// Watch for route query changes (browser back/forward, direct URL)
watch(
  () => route.query.setId,
  setIdFromRoute => {
    if (!setIdFromRoute) {
      // If setId is removed from route, clear selection
      if (selectedSetId.value) {
        isUpdatingFromRoute = true
        mediaSetsSidebar.handleSelectSet(null)
        isUpdatingFromRoute = false
      }
      return
    }

    // Only update if different from current selection
    if (setIdFromRoute !== selectedSetId.value) {
      // Verify the set exists in mediaSets before selecting
      if (mediaSets.value.some(s => s.id === setIdFromRoute)) {
        isUpdatingFromRoute = true
        mediaSetsSidebar.handleSelectSet(setIdFromRoute)
        isUpdatingFromRoute = false
      }
    }
  }
)

// Load media when selectedSetId changes (separate from route sync)
watch(
  () => selectedSetId.value,
  async (newSetId) => {
    if (collection.value?.id && newSetId) {
      await loadMediaItems()
    } else {
      mediaItems.value = []
    }
  }
)

// Watch for sortOrder changes to reload media with new sorting
watch(
  sortOrder,
  () => {
    if (collection.value?.id && selectedSetId.value && !isUploading.value && !isLoadingMedia.value) {
      loadMediaItems()
    }
  },
  { immediate: false }
)

// Media item context menu handlers
const handleOpenMedia = item => {
  // Show in media viewer instead of opening in new tab
  openMediaViewer(item)
}

const handleStarMediaFromLightbox = async ({ item }) => {
  // Handle star from MediaLightbox - just call the existing handler
  // The item already has the updated state from MediaLightbox's optimistic update
  await handleStarMedia(item)
}

const { handleQuickShare, handleCopyLink, handleDownloadMedia: handleDownloadMediaFromShare, handleCopyFilenames: handleCopyFilenamesFromShare } = useMediaShareDownloadActions({
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

// Override download and copy handlers from useMediaActions with collection-specific versions
const handleDownloadMedia = handleDownloadMediaFromShare
const handleCopyFilenames = handleCopyFilenamesFromShare

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

const isUpdatingCoverPhoto = ref(false)

const handleSetAsCoverOriginal = async item => {
  if (!collection.value?.id || !item?.id || isUpdatingCoverPhoto.value) return

  const isVideo = item.type === 'video' || item.file?.type === 'video'

  if (isVideo) {
    const coverUrl = item.file?.url || item.url
    if (!coverUrl) {
      toast.error('Invalid media', {
        description: 'Media does not have a valid URL.',
      })
      return
    }

    isUpdatingCoverPhoto.value = true
    try {
      const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
        thumbnail: coverUrl,
        image: coverUrl,
      })
      
      if (updatedCollection) {
        collection.value = updatedCollection
      } else {
        collection.value = {
          ...collection.value,
          thumbnail: coverUrl,
          image: coverUrl,
        }
      }

      toast.success('Cover photo updated', {
        description: 'The cover photo has been set successfully.',
      })
    } catch (error) {
      toast.error('Failed to set cover photo', {
        description:
          error instanceof Error ? error.message : 'An error occurred while setting the cover photo.',
      })
    } finally {
      isUpdatingCoverPhoto.value = false
    }
    return
  }

  const coverUrl = item.thumbnailUrl || item.file?.variants?.thumb || item.file?.url || item.url || null
  if (!coverUrl) {
    toast.error('Invalid media', {
      description: 'Media does not have a valid URL.',
    })
    return
  }

  const existingFocalPoint = collection.value?.coverFocalPoint ||
    collection.value?.cover_focal_point || { x: 50, y: 50 }

  selectedMediaForCover.value = item
  focalPointImageUrl.value = coverUrl
  currentFocalPoint.value = existingFocalPoint
  showFocalPointModal.value = true
}

const handleFocalPointConfirm = async focalPoint => {
  if (!collection.value?.id || !selectedMediaForCover.value?.id || isUpdatingCoverPhoto.value) return

  isUpdatingCoverPhoto.value = true

  try {
    const coverUrl = focalPointImageUrl.value
    const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
      thumbnail: coverUrl,
      image: coverUrl,
      coverFocalPoint: focalPoint,
      cover_focal_point: focalPoint,
    })

    if (updatedCollection) {
      collection.value = updatedCollection
    } else {
      collection.value = {
        ...collection.value,
        thumbnail: coverUrl,
        image: coverUrl,
        coverFocalPoint: focalPoint,
        cover_focal_point: focalPoint,
      }
    }

    toast.success('Cover photo updated', {
      description: 'The cover photo has been set successfully.',
    })
  } catch (error) {
    toast.error('Failed to set cover photo', {
      description:
        error instanceof Error ? error.message : 'An error occurred while setting the cover photo.',
    })
  } finally {
    isUpdatingCoverPhoto.value = false
    selectedMediaForCover.value = null
    focalPointImageUrl.value = null
  }
}

const handleSetAsCover = handleSetAsCoverOriginal

const handleToggleFeatured = async item => {
  if (!item?.id && !item?.uuid) {
    toast.error('Invalid media item')
    return
  }
  
  const mediaId = item.id || item.uuid
  const isCurrentlyFeatured = item.isFeatured || item.is_featured || false
  
  try {
    toast.loading(isCurrentlyFeatured ? 'Removing from featured list...' : 'Adding to featured list...', {
      id: 'toggle-featured',
    })
    
    const { apiClient } = await import('@/api/client')
    const response = await apiClient.post(`/v1/memora/media/${mediaId}/toggle-featured`)
    const updatedMedia = response.data?.data || response.data
    
    // Update local state
    const mediaIndex = mediaItems.value.findIndex(m => (m.id || m.uuid) === mediaId)
    if (mediaIndex !== -1) {
      mediaItems.value[mediaIndex] = {
        ...mediaItems.value[mediaIndex],
        isFeatured: updatedMedia.is_featured ?? !isCurrentlyFeatured,
        is_featured: updatedMedia.is_featured ?? !isCurrentlyFeatured,
      }
    }
    
    toast.success(updatedMedia.is_featured ? 'Added to featured list' : 'Removed from featured list', {
      id: 'toggle-featured',
    })
  } catch (error) {
    toast.error('Failed to update featured status', {
      description: error?.response?.data?.message || error?.message || 'Please try again',
      id: 'toggle-featured',
    })
  }
}


const {
  handleWatermarkMedia: handleWatermarkMediaFromComposable,
  handleCancelWatermarkMedia: handleCancelWatermarkMediaFromComposable,
  handleRemoveWatermark: handleRemoveWatermarkFromComposable,
  handleConfirmWatermarkMedia: handleConfirmWatermarkMediaFromComposable,
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

const handleWatermarkMedia = handleWatermarkMediaFromComposable
const handleCancelWatermarkMedia = handleCancelWatermarkMediaFromComposable
const handleConfirmWatermarkMedia = handleConfirmWatermarkMediaFromComposable
const handleRemoveWatermark = handleRemoveWatermarkFromComposable

const handlePreviewWatermark = async () => {
  if (!mediaToWatermark.value || !selectedWatermarkForMedia.value || selectedWatermarkForMedia.value === 'none') {
    return
  }
  
  const imageUrl = mediaToWatermark.value.largeImageUrl || mediaToWatermark.value.file?.url || mediaToWatermark.value.thumbnailUrl
  if (!imageUrl) {
    toast.error('Image URL not available', { description: '' })
    return
  }
  
  try {
    const watermark = await watermarkStore.fetchWatermark(selectedWatermarkForMedia.value)
    previewWatermark.value = watermark
    previewMediaImageUrl.value = imageUrl
    showWatermarkPreviewModal.value = true
  } catch (error) {
    toast.error('Failed to load watermark', { description: '' })
  }
}

const handleApplyFromPreview = () => {
  showWatermarkPreviewModal.value = false
  handleConfirmWatermarkMedia()
}

const hasWatermarkOnMedia = computed(() => {
  if (!mediaToWatermark.value) return false
  const uuid = mediaToWatermark.value.watermarkUuid || mediaToWatermark.value.watermark_uuid
  return !!(uuid && uuid !== null && uuid !== '' && uuid !== undefined)
})

const watermarkConfirmLabel = computed(() => {
  if (!mediaToWatermark.value) return 'Add Watermark'
  
  const hasWatermark = hasWatermarkOnMedia.value
  const isRemoving = selectedWatermarkForMedia.value === 'none'
  
  if (isRemoving && hasWatermark) {
    return 'Remove Watermark'
  } else if (hasWatermark) {
    return 'Update Watermark'
  } else {
    return 'Add Watermark'
  }
})

// (moved to useMediaRenameDeleteActions)

const getDeleteModalTitle = () => {
  if (!itemToDelete.value) return 'Delete'
  const item = itemToDelete.value
  return item.collectionId || item.setId ? 'Delete Media' : 'Delete Set'
}

const getDeleteModalWarning = () => {
  if (!itemToDelete.value) return 'This action cannot be undone.'
  const item = itemToDelete.value
  return item.collectionId || item.setId
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
  mediaSetsSidebar,
})


// Track if we're loading display settings to prevent saves during load
const isLoadingDisplaySettings = ref(false)

// Load display settings from collection when it loads (sync with store)
watch(
  () => collection.value?.display_settings,
  displaySettings => {
    isLoadingDisplaySettings.value = true
    if (displaySettings) {
      if (displaySettings.view_mode) {
        galleryStore.setViewMode(displaySettings.view_mode)
      }
      if (displaySettings.grid_size) {
        galleryStore.setGridSize(displaySettings.grid_size)
      }
      if (displaySettings.show_filename !== undefined) {
        galleryStore.setShowFilename(displaySettings.show_filename)
      }
      if (displaySettings.sort_order) {
        galleryStore.setSortOrder(displaySettings.sort_order)
      }
    }
    // Delay to allow reactive updates to complete
    setTimeout(() => {
      isLoadingDisplaySettings.value = false
    }, 100)
  },
  { immediate: true }
)

// Save display settings to backend when they change
const isSavingDisplaySettings = ref(false)
const saveDisplaySettings = async () => {
  if (!collection.value?.id || isSavingDisplaySettings.value || isLoadingDisplaySettings.value) return

  isSavingDisplaySettings.value = true
  try {
    await galleryStore.updateCollection(collection.value.id, {
      display_settings: {
        view_mode: galleryStore.viewMode,
        grid_size: galleryStore.gridSize,
        show_filename: galleryStore.showFilename,
        sort_order: galleryStore.sortOrder,
      },
    })
  } catch (error) {
    // Silently fail - settings will be saved on next change
  } finally {
    isSavingDisplaySettings.value = false
  }
}

// Debounce saves to avoid too many API calls
let saveDisplaySettingsTimeout = null
const debouncedSaveDisplaySettings = () => {
  if (saveDisplaySettingsTimeout) {
    clearTimeout(saveDisplaySettingsTimeout)
  }
  saveDisplaySettingsTimeout = setTimeout(() => {
    saveDisplaySettings()
  }, 500)
}

watch([viewMode, gridSize, showFilename, sortOrder], () => {
  // Only save if collection is loaded and we're not loading display settings
  if (collection.value?.id && !isLoading.value && !isLoadingDisplaySettings.value) {
    debouncedSaveDisplaySettings()
  }
})

const goBack = () => {
  router.push({ name: 'manageCollections' })
}

// Use media actions composable
const {
  handleDeleteMedia,
  handleConfirmDeleteItem,
  handleBulkDelete,
  handleConfirmBulkDelete,
  handleRenameMedia,
  handleCancelRenameMedia,
  handleConfirmRenameMedia,
  handleStarMedia,
  handleBulkFavorite,
  handleBulkCopyFilenames,
  handleBulkView,
  handleBulkEdit,
  handleCancelEdit,
  handleConfirmEdit,
  handleReplacePhoto,
  handleCancelReplacePhoto,
  handleReplacePhotoFileSelect,
  getUndoAction,
} = useMediaActions({
  contextType: 'collection',
  api: collectionsApi,
  context: collection,
  contextId: computed(() => collection.value?.id),
  setId: selectedSetId,
  mediaItems,
  selectedMediaIds,
  sortedMediaItems,
  loadMediaItems,
  loadMediaSets: updateSetCounts,
  getItemId: item => item?.id || '',
  modals: {
    openDeleteModal,
    closeDeleteModal,
    itemToDelete,
    showBulkDeleteModal,
    showRenameMediaModal,
    mediaToRename,
    newMediaName,
    showEditModal,
    editAppendText,
    showReplacePhotoModal,
    mediaToReplace,
    showMediaViewer,
  },
  loading: {
    isDeleting,
    isBulkDeleteLoading,
    isRenamingMedia,
    isBulkFavoriteLoading,
    isBulkEditLoading,
    isReplacingPhoto,
  },
  helpers: {
    selectedMediaForView,
    currentViewIndex,
  },
})

// Media Sets CRUD/drag/drop is handled by `useCollectionMediaSetsSidebarStore`.

const handleAddMedia = () => {
  triggerFileInputClick(fileInputRef.value)
}

const handleBrowseFiles = () => {
  triggerFileInputClick(fileInputRef.value)
}

const isProcessingFiles = ref(false)

const {
  processFiles,
  uploadMediaToSet,
  handleConfirmDuplicateFiles: confirmDuplicateFiles,
  handleCancelDuplicateFiles: cancelDuplicateFiles,
  handleSetDuplicateAction: setDuplicateAction,
  handleReplaceAllDuplicates: replaceAllDuplicates,
  handleSkipAllDuplicates: skipAllDuplicates,
  cancelUpload: cancelUploadFromWorkflow,
  isUploading: isUploadingFromWorkflow,
  uploadProgress: uploadProgressFromWorkflow,
  overallProgress: overallProgressFromWorkflow,
  uploadErrors: uploadErrorsFromWorkflow,
  showDuplicateFilesModal: showDuplicateModal,
  duplicateFiles: duplicateFilesFromWorkflow,
  duplicateFileActions: duplicateFileActionsFromWorkflow,
  duplicateFileActionsObject: duplicateFileActionsObjectFromWorkflow,
  duplicateFileActionsKey: duplicateFileActionsKeyFromWorkflow,
} = useCollectionWorkflow({
  collectionId: () => collection.value?.id,
  loadMediaItems,
  existingMedia: () => mediaItems.value,
  onUploadComplete: async results => {
    if (results?.successful?.length > 0) {
      try {
        // Reload media items to show the newly uploaded media
        await loadMediaItems()
        // Reload media sets to update counts
        await mediaSetsSidebar.loadMediaSets()
      } catch (error) {
        console.error('Error reloading media after upload:', error)
      }
    }
  },
})

// Local refs that sync with workflow state (for backward compatibility)
const isUploading = computed(() => isUploadingFromWorkflow.value)
const showDuplicateFilesModal = ref(false)
const duplicateFiles = ref([])
const duplicateFileActions = ref({})
const duplicateFileActionsObject = ref({})
const showUploadProgress = ref(false)

// Watch the reactive object and sync properties - use immediate and deep watch
watch(
  () => duplicateFileActionsObjectFromWorkflow,
  newVal => {
    if (newVal && typeof newVal === 'object') {
      const updated = { ...newVal }
      // Remove properties that no longer exist
      Object.keys(duplicateFileActionsObject.value).forEach(key => {
        if (!(key in updated)) {
          delete duplicateFileActionsObject.value[key]
        }
      })
      Object.assign(duplicateFileActionsObject.value, updated)
    }
  },
  { deep: true, immediate: true }
)

// Watch upload state to control progress modal
watch(isUploadingFromWorkflow, async (val, oldVal) => {
  // Show upload progress modal when upload starts
  if (val) {
    showUploadProgress.value = true
  }
  if (!val && oldVal) {
    // Keep modal open if there are failed uploads to allow retry
    const hasFailedUploads = Object.values(uploadProgressFromWorkflow.value || {}).some(
      p => p.status === 'failed'
    )
    if (!hasFailedUploads) {
      // Close modal after a delay if no failed uploads
      setTimeout(() => {
        showUploadProgress.value = false
      }, 1000)
    }
  }
})

// Also watch for failed uploads to keep modal open
watch(
  () => uploadErrorsFromWorkflow.value?.length || 0,
  errorCount => {
    if (errorCount > 0 && !isUploadingFromWorkflow.value) {
      // Keep modal open if there are errors
      showUploadProgress.value = true
    }
  }
)

watch(showDuplicateModal, val => {
  showDuplicateFilesModal.value = val
})

watch(duplicateFilesFromWorkflow, val => {
  duplicateFiles.value = val
})

watch(duplicateFileActionsFromWorkflow, val => {
  duplicateFileActions.value = val
})

const handleFileSelect = async event => {
  const files = Array.from(event.target.files || [])
  if (files.length === 0) return

  // Prevent multiple simultaneous uploads or file processing
  if (isUploading.value || isProcessingFiles.value) {
    event.target.value = ''
    return
  }

  // Reset input immediately to prevent duplicate events
  event.target.value = ''

  if (!selectedSetId.value) {
    toast.error('No set selected', {
      description: 'Please select a set from the sidebar first.',
    })
    return
  }

  isProcessingFiles.value = true
  try {
    const { hasDuplicates, filesToUpload } = await processFiles(files, selectedSetId.value)

    if (hasDuplicates) {
      // Duplicate modal will be shown by the workflow
      return
    }

    if (filesToUpload.length > 0) {
      await uploadMediaToSet(filesToUpload, selectedSetId.value)
    }
  } catch (error) {
  } finally {
    isProcessingFiles.value = false
  }
}

const handleDragOver = e => {
  // Only show drag overlay if files are being dragged (not internal drag operations)
  if (e.dataTransfer?.types?.includes('Files')) {
    e.preventDefault()
    if (selectedSetId.value && !isUploading.value && !isProcessingFiles.value) {
      isDragging.value = true
    }
  }
}

const handleDragLeave = e => {
  // Only hide drag overlay if we're leaving the main element (not just moving to a child)
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragging.value = false
  }
}

const handleDrop = async e => {
  e.preventDefault()
  isDragging.value = false

  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return

  // Prevent multiple simultaneous uploads or file processing
  if (isUploading.value || isProcessingFiles.value) {
    return
  }

  if (!selectedSetId.value) {
    toast.error('No set selected', {
      description: 'Please select a set from the sidebar first.',
    })
    return
  }

  isProcessingFiles.value = true
  try {
    const fileArray = Array.from(files)
    const { hasDuplicates, filesToUpload } = await processFiles(fileArray, selectedSetId.value)

    if (hasDuplicates) {
      // Duplicate modal will be shown by the workflow
      return
    }

    if (filesToUpload.length > 0) {
      await uploadMediaToSet(filesToUpload, selectedSetId.value)
    }
  } catch (error) {
    toast.error('File processing failed', {
      description: getErrorMessage(error, 'An error occurred while processing files.'),
    })
  } finally {
    isProcessingFiles.value = false
  }
}

const handleConfirmDuplicateFiles = async () => {
  // Prevent multiple simultaneous uploads
  if (isUploading.value || isProcessingFiles.value) {
    return
  }

  if (!selectedSetId.value) {
    toast.error('No set selected', {
      description: 'Please select a set from the sidebar first.',
    })
    return
  }
  await confirmDuplicateFiles(selectedSetId.value)
}

const handleCancelDuplicateFiles = () => {
  cancelDuplicateFiles()
}

const handleSetDuplicateAction = (fileName, action) => {
  setDuplicateAction(fileName, action)
}

const handleReplaceAllDuplicates = () => {
  replaceAllDuplicates()
}

const handleSkipAllDuplicates = () => {
  skipAllDuplicates()
}

const cancelUpload = async () => {
  await cancelUploadFromWorkflow()
  showUploadProgress.value = false
  // Media will be reloaded by cancelUploadFromWorkflow if loadMediaItems is provided
}

const handleCloseUploadProgress = () => {
  showUploadProgress.value = false
  // Dismiss the progress toast when modal is closed
  toast.dismiss('upload-progress')
}

const handleRetryUpload = async (fileId, retryFn) => {
  if (!retryFn || typeof retryFn !== 'function') {
    toast.error('Retry failed', {
      description: 'Invalid retry function.',
    })
    return
  }

  if (!collection.value?.id || !selectedSetId.value) {
    toast.error('Invalid context', {
      description: 'Collection or set not found.',
    })
    return
  }

  try {
    if (uploadProgressFromWorkflow.value[fileId]) {
      uploadProgressFromWorkflow.value[fileId] = {
        ...uploadProgressFromWorkflow.value[fileId],
        status: 'uploading',
        error: null,
      }
    }

    // Call the retry function which will re-upload the file
    await retryFn()
  } catch (error) {
    toast.error('Retry failed', {
      description: error?.message || 'Failed to retry upload.',
    })
  }
}

// (moved to useMediaShareDownloadActions)

// (store handles media set drag/drop)

// Watch for route changes
watch(
  () => route.params.uuid,
  (uuid) => {
    if (uuid) {
      loadCollection(uuid)
    }
  }
)

onMounted(async () => {
  const uuid = route.params.uuid
  if (uuid) {
    await loadCollection(uuid)
  }
  
  try {
    await watermarkStore.fetchWatermarks()
  } catch (error) {}

  // Check if setId is in route query and set it after mediaSets are loaded
  watch(
    () => mediaSetsSidebar.mediaSets.length,
    () => {
      if (route.query.setId && !selectedSetId.value && mediaSetsSidebar.mediaSets.length > 0) {
        const setIdFromRoute = route.query.setId
        // Verify the set exists in mediaSets before selecting
        if (mediaSetsSidebar.mediaSets.some(s => s.id === setIdFromRoute)) {
          isUpdatingFromRoute = true
          mediaSetsSidebar.handleSelectSet(setIdFromRoute)
          isUpdatingFromRoute = false
        }
      }
    },
    { immediate: true, once: true }
  )
})
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
