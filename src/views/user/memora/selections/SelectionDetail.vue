<template>
  <SelectionLayout
    :is-loading="isLoading || isUpdatingCoverPhoto"
    :selection="selection"
    @go-back="goBack"
  >
    <template #content>
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
        <ContentLoader v-if="isLoading" message="Loading selection..." />

        <div v-else class="p-8">
          <!-- Section Header -->
          <div v-if="isLoadingMedia" class="mb-6">
            <div class="h-7 w-56 rounded bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"></div>
            <div
              class="mt-3 h-4 w-32 rounded bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"
            ></div>
          </div>
          <MediaItemsHeaderBar
            v-else-if="selectedSetId"
            :is-uploading="isUploading"
            :selected-count="selectedMediaIds.size"
            :title="selectedSet?.name || 'All Media'"
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
              :class="[
                'grid gap-4',
                gridSize === 'small'
                  ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
                  : gridSize === 'medium'
                    ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
              ]"
              name="media-grid"
              tag="div"
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
                @view-details="handleViewDetails(item)"
                @image-error="handleImageError"
                @move-copy="handleMoveCopy(item)"
                @copy-filenames="handleCopyFilenames(item)"
                @set-as-cover="handleSetAsCover(item)"
                @remove-watermark="handleRemoveWatermark(item)"
              />
            </TransitionGroup>
            <TransitionGroup v-else class="space-y-2" name="media-list" tag="div">
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
                @view-details="handleViewDetails(item)"
                @image-error="handleImageError"
                @move-copy="handleMoveCopy(item)"
                @copy-filenames="handleCopyFilenames(item)"
                @set-as-cover="handleSetAsCover(item)"
                @remove-watermark="handleRemoveWatermark(item)"
              />
            </TransitionGroup>
          </div>

          <!-- Empty State / Upload Zone -->
          <!-- Show empty state when no sets exist -->
          <div
            v-if="
              !isLoadingMedia &&
              selection &&
              selection.status !== 'completed' &&
              mediaSets.length === 0
            "
            class="flex items-center justify-center py-16"
          >
            <EmptyState
              :action-icon="Plus"
              :icon="FolderPlus"
              action-label="Create Set"
              description="Create a set to organize and upload your media files."
              message="No sets in this selection"
              @action="mediaSetsSidebar.handleAddSet"
            />
          </div>
          <!-- Show upload zone when sets exist but no media -->
          <MediaUploadDropzone
            v-else-if="
              !isLoadingMedia &&
              selection &&
              selection.status !== 'completed' &&
              mediaSets.length > 0
            "
            v-model:is-dragging="isDragging"
            :is-empty="sortedMediaItems.length === 0"
            @browse="handleBrowseFiles"
            @drop="handleDrop"
          />
          <!-- Show empty state for completed selections or when no media -->
          <div
            v-else-if="sortedMediaItems.length === 0 && !isLoadingMedia"
            class="text-center py-16"
          >
            <p :class="theme.textSecondary" class="text-lg mb-4">No media in this selection yet</p>
            <p :class="theme.textTertiary" class="text-sm">
              <span v-if="selection && selection.status === 'completed'">
                This selection has been completed.
              </span>
              <span v-else>Select a set from the sidebar or upload media to get started.</span>
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
        :is-uploading="isUploading"
        :overall-progress="overallProgress"
        :upload-errors="uploadErrors"
        :upload-progress="uploadProgress"
        @cancel="cancelUpload"
        @close="showUploadProgress = false"
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
        :confirm-label="
          selectedWatermarkForMedia === 'none' && mediaToWatermark?.originalUrl ? 'Remove' : 'Add'
        "
        :is-editing="!!mediaToWatermark?.originalUrl"
        :is-loading="isApplyingWatermark"
        :watermarks="watermarks"
        @cancel="handleCancelWatermarkMedia"
        @confirm="handleConfirmWatermarkMedia"
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
        @close="closeMediaViewer"
        @download="handleDownloadMedia"
        @image-error="handleImageError"
      />

      <MediaDetailSidebar
        v-model="showMediaDetailSidebar"
        :media="selectedMediaForDetails"
        :placeholder-image="placeholderImage"
        @view="openMediaViewer"
        @download="handleDownloadMedia"
      />

      <MoveCopyModal
        v-model="showMoveCopyModal"
        v-model:action="moveCopyAction"
        context="selection"
        :available-collections="availableSelections"
        :current-collection-id="selection?.id || ''"
        :current-collection-name="selection?.name || ''"
        :target-collection-id="targetSelectionId"
        :target-collection-sets="targetSelectionSets"
        :is-loading-sets="isLoadingTargetSets"
        :target-set-id="targetSetId"
        :is-moving="isMovingMedia"
        :selected-count="selectedMediaIds.size"
        @selection-change="handleTargetSelectionChange"
        @update:target-set-id="targetSetId = $event"
        @cancel="handleCancelMoveCopy"
        @confirm="handleConfirmMoveCopy"
      />
    </template>
  </SelectionLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SelectionLayout from '@/layouts/SelectionLayout.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import BulkActionsBar from '@/components/molecules/BulkActionsBar.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import MediaItemsHeaderBar from '@/components/organisms/MediaItemsHeaderBar.vue'
import MediaGridItemCard from '@/components/organisms/MediaGridItemCard.vue'
import MediaUploadDropzone from '@/components/organisms/MediaUploadDropzone.vue'
import MediaListItemRow from '@/components/organisms/MediaListItemRow.vue'
import MediaDetailSidebar from '@/components/organisms/MediaDetailSidebar.vue'
import CreateEditMediaSetModal from '@/components/organisms/CreateEditMediaSetModal.vue'
import DuplicateFilesModal from '@/components/organisms/DuplicateFilesModal.vue'
import UploadProgressBar from '@/components/organisms/UploadProgressBar.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import ContentLoader from '@/components/molecules/ContentLoader.vue'
import RenameMediaModal from '@/components/organisms/RenameMediaModal.vue'
import TagModal from '@/components/organisms/TagModal.vue'
import EditFilenamesModal from '@/components/organisms/EditFilenamesModal.vue'
import BulkWatermarkModal from '@/components/organisms/BulkWatermarkModal.vue'
import ReplacePhotoModal from '@/components/organisms/ReplacePhotoModal.vue'
import WatermarkMediaModal from '@/components/organisms/WatermarkMediaModal.vue'
import MediaLightbox from '@/components/organisms/MediaLightbox.vue'
import MoveCopyModal from '@/components/organisms/MoveCopyModal.vue'
import { formatMediaDate } from '@/utils/media/formatMediaDate'
import { useSelectionStore } from '@/stores/selection.js'
import { useSelectionMediaSetsSidebarStore } from '@/stores/selectionMediaSetsSidebar'
import { storeToRefs } from 'pinia'
import { FolderPlus, Plus } from 'lucide-vue-next'
import { triggerFileInputClick } from '@/utils/media/triggerFileInputClick'
import { useSelectionWorkflow } from '@/composables/useSelectionWorkflow'
import { useSelectionsApi } from '@/api/selections'
import { apiClient } from '@/api/client'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()
const route = useRoute()
const router = useRouter()
const selectionStore = useSelectionStore()
const mediaSetsSidebar = useSelectionMediaSetsSidebarStore()

// Use store for media sets
const { selectedSetId, sortedMediaSets } = storeToRefs(mediaSetsSidebar)
const mediaSets = computed(() => mediaSetsSidebar.mediaSets)
const showCreateSetModal = ref(false)
const newSetName = ref('')
const newSetDescription = ref('')
const isCreatingSet = ref(false)
const editingSetIdInModal = ref(null)

const handleCreateSet = () => {
  showCreateSetModal.value = false
}

const handleCancelCreateSet = () => {
  showCreateSetModal.value = false
}

// Selection data
const selection = ref(null)
const selectionStatus = computed(() => selection.value?.status || 'draft')
const isDragging = ref(false)

// Get state from selection store
const { gridSize, viewMode, showFilename, sortOrder } = storeToRefs(selectionStore)
const selectedMediaIds = ref(new Set())
const showMoveCopyModal = ref(false)
const moveCopyAction = ref('move')
const isMovingMedia = ref(false)
const targetSelectionId = ref('')
const targetSetId = ref('')
const availableSelections = ref([])
const isLoadingSelections = ref(false)
const targetSelectionSets = ref([])
const isLoadingTargetSets = ref(false)
const isBulkFavoriteLoading = ref(false)
const isBulkTagLoading = ref(false)
const isBulkEditLoading = ref(false)
const isBulkDeleteLoading = ref(false)
const isUpdatingSetCounts = ref(false)
const isUpdatingCoverPhoto = ref(false)
const isLoadingMedia = ref(false)
const selectedMedia = ref(null)
const selectedMediaForView = ref([])
const currentViewIndex = ref(0)
const showMediaViewer = ref(false)
const showMediaDetailSidebar = ref(false)
const selectedMediaForDetails = ref(null)
const showBulkDeleteModal = ref(false)
const showEditModal = ref(false)
const showTagModal = ref(false)
const showBulkWatermarkModal = ref(false)
const selectedBulkWatermark = ref('none')
const showUploadProgress = ref(false)
const isBulkWatermarkLoading = ref(false)
const editAppendText = ref('')
const tagInput = ref('')
const existingTags = ref([])
const showRenameMediaModal = ref(false)
const mediaToRename = ref(null)
const newMediaName = ref('')
const isRenamingMedia = ref(false)
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

// Load selection data
const isLoading = ref(false)
const loadSelection = async () => {
  const selectionId = route.params.id
  if (!selectionId) {
    console.error('No selection ID in route params')
    return
  }

  isLoading.value = true
  try {
    const selectionData = await selectionStore.fetchSelection(selectionId)
    selection.value = selectionData

    // Media sets are automatically initialized by SelectionLayout via the store
    // No need to manually set them here

    // Load media items for the selected set (if one is selected)
    // Note: If no set is selected, handleSelectSet will trigger the watcher to load media
    if (selectedSetId.value) {
      await loadMediaItems()
    } else if (selectionData.mediaSets && selectionData.mediaSets.length > 0) {
      // If no set is selected but sets exist, select the first one
      // The watcher on selectedSetId will automatically load media
      mediaSetsSidebar.handleSelectSet(selectionData.mediaSets[0].id)
    }
  } catch (error) {
    console.error('Failed to load selection:', error)
    // Optionally redirect back or show error message
  } finally {
    isLoading.value = false
  }
}

// Load selection on mount
onMounted(() => {
  loadSelection()
})

// Watch for modal opening to load selections
watch(showMoveCopyModal, isOpen => {
  if (isOpen) {
    // Only load selections when modal opens
    if (availableSelections.value.length === 0) {
      loadAvailableSelections()
    }
    // Initialize with current selection
    if (selection.value) {
      targetSelectionId.value = selection.value.id
      handleTargetSelectionChange(selection.value.id)
    }
  }
})
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
  return itemToDelete.value?.name || 'Item'
}

const selectedSet = computed(() => {
  return mediaSets.value.find(set => set.id === selectedSetId.value) || mediaSets.value[0]
})

// Initialize media items as empty array
const mediaItems = ref([])

// Load media items for the selected set
const selectionsApi = useSelectionsApi()
const loadMediaItems = async () => {
  if (!selection.value?.id || !selectedSetId.value) {
    return
  }

  // Prevent multiple simultaneous calls
  if (isLoadingMedia.value) {
    return
  }

  isLoadingMedia.value = true
  try {
    // Always include sortBy if it exists, otherwise omit it (backend will use default)
    const params = sortOrder.value ? { sortBy: sortOrder.value } : {}
    const setMedia = await selectionsApi.fetchSetMedia(
      selection.value.id,
      selectedSetId.value,
      params
    )
    // Update media items for the selected set
    const otherMedia = mediaItems.value.filter(item => item.setId !== selectedSetId.value)
    const currentSetMedia = Array.isArray(setMedia)
      ? setMedia.map(m => ({ ...m, setId: selectedSetId.value }))
      : []
    mediaItems.value = [...otherMedia, ...currentSetMedia]
  } catch (error) {
    console.error('Failed to load media items:', error)
  } finally {
    isLoadingMedia.value = false
  }
}

// Initialize selection workflow for uploads
const {
  processFiles,
  uploadMediaToSet,
  handleConfirmDuplicateFiles: confirmDuplicateFiles,
  handleCancelDuplicateFiles: cancelDuplicateFiles,
  handleSetDuplicateAction: setDuplicateAction,
  handleReplaceAllDuplicates: replaceAllDuplicates,
  handleSkipAllDuplicates: skipAllDuplicates,
  isUploading: isUploadingFromWorkflow,
  showDuplicateFilesModal: showDuplicateModal,
  duplicateFiles: duplicateFilesFromWorkflow,
  duplicateFileActions: duplicateFileActionsFromWorkflow,
  duplicateFileActionsObject: duplicateFileActionsObjectFromWorkflow,
} = useSelectionWorkflow({
  selectionId: () => selection.value?.id,
  loadMediaItems,
  existingMedia: () => mediaItems.value,
})

// Update isUploading ref to match workflow
watch(isUploadingFromWorkflow, val => {
  isUploading.value = val
  // Set flag when upload completes to prevent watch from triggering
  if (!val) {
    justUploaded.value = true
    // Clear flag after a delay to allow loadMediaItems from uploadMediaToSet to complete
    setTimeout(() => {
      justUploaded.value = false
    }, 500)
  }
})

// Update duplicate files modal state
watch(showDuplicateModal, val => {
  showDuplicateFilesModal.value = val
})

watch(duplicateFilesFromWorkflow, val => {
  duplicateFiles.value = val
})

watch(duplicateFileActionsFromWorkflow, val => {
  duplicateFileActions.value = val
})

// Watch for selectedSetId changes to load media
// Skip if upload is in progress or just completed to avoid duplicate calls
watch(
  selectedSetId,
  () => {
    if (
      selection.value?.id &&
      selectedSetId.value &&
      !isUploading.value &&
      !isLoadingMedia.value &&
      !justUploaded.value
    ) {
      loadMediaItems()
    }
  },
  { immediate: false }
)

// Filter media items by selected set
const filteredMediaItems = computed(() => {
  if (!selectedSetId.value) {
    return []
  }
  return mediaItems.value.filter(item => item.setId === selectedSetId.value)
})

// Media items are now sorted/filtered by the backend
const sortedMediaItems = computed(() => filteredMediaItems.value)

// No handlers needed - state is managed internally by MediaItemsHeaderBar and accessed via inject

const openMediaViewer = item => {
  // Find the index of the item in the sorted media items
  const index = sortedMediaItems.value.findIndex(m => m.id === item.id)

  // Set all media items for lightbox navigation
  selectedMediaForView.value = sortedMediaItems.value
  currentViewIndex.value = index >= 0 ? index : 0
  showMediaViewer.value = true
}

const closeMediaViewer = () => {
  showMediaViewer.value = false
  selectedMedia.value = null
  selectedMediaForView.value = []
  currentViewIndex.value = 0
}

const handleViewDetails = item => {
  selectedMediaForDetails.value = item
  showMediaDetailSidebar.value = true
}

// UI-only handlers - no functionality
const handleOpenMedia = item => {
  openMediaViewer(item)
}

const handleDownloadMedia = async item => {
  if (!item?.id) {
    toast.error('Media not found', {
      description: 'Unable to download media. Please try again.',
    })
    return
  }

  try {
    toast.loading('Preparing download...', {
      id: 'download-media',
    })

    const { blob, filename } = await selectionsApi.downloadMedia(item.id)

    // Trigger browser download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.dismiss('download-media')
    toast.success('Download started', {
      description: `Downloading ${filename}`,
    })
  } catch (error) {
    toast.dismiss('download-media')
    console.error('Download error:', error)
    toast.error('Download failed', {
      description: error.message || 'Unable to download media. Please try again.',
    })
  }
}

const handleCopyFilenames = async item => {
  try {
    const filename = item?.file?.filename || item?.filename || item?.title || 'untitled.jpg'
    await navigator.clipboard.writeText(filename)
    toast.success('Filename copied', {
      description: 'The filename has been copied to your clipboard.',
    })
  } catch (error) {
    console.error('Failed to copy filename:', error)
    toast.error('Failed to copy', {
      description: error instanceof Error ? error.message : 'Could not copy to clipboard',
    })
  }
}

const handleMoveCopy = item => {
  selectedMediaIds.value.clear()
  selectedMediaIds.value.add(item.id)
  moveCopyAction.value = 'move'
  targetSelectionId.value = selection.value?.id || ''
  targetSetId.value = ''
  showMoveCopyModal.value = true
}

// Load available selections for move/copy modal
const loadAvailableSelections = async () => {
  isLoadingSelections.value = true
  try {
    const result = await selectionStore.fetchAllSelections({ perPage: 100 })
    availableSelections.value = Array.isArray(result) ? result : result?.data || []
  } catch (error) {
    console.error('Failed to load selections:', error)
    availableSelections.value = []
  } finally {
    isLoadingSelections.value = false
  }
}

// Handle target selection change
const handleTargetSelectionChange = async selectionId => {
  targetSelectionId.value = selectionId
  targetSetId.value = '' // Reset set selection when selection changes

  if (!selectionId) {
    targetSelectionSets.value = []
    return
  }

  isLoadingTargetSets.value = true
  try {
    let allSets = []
    // If it's the current selection, use local mediaSets
    if (selectionId === selection.value?.id) {
      allSets = mediaSets.value.map(set => ({
        id: set.id,
        name: set.name,
        description: set.description,
        count: set.count,
        order: set.order,
      }))
    } else {
      // Fetch sets from API for other selections
      const sets = await selectionsApi.fetchMediaSets(selectionId)
      allSets = Array.isArray(sets) ? sets : []
    }

    // Filter out the current set to prevent moving/copying to the same set
    // Only filter if we're in the same selection (moving within the same selection)
    if (selectionId === selection.value?.id && selectedSetId.value) {
      targetSelectionSets.value = allSets.filter(set => set.id !== selectedSetId.value)
    } else {
      targetSelectionSets.value = allSets
    }

    // Auto-select the first set if available and only one set exists
    if (targetSelectionSets.value.length === 1) {
      targetSetId.value = targetSelectionSets.value[0].id
    }
  } catch (error) {
    console.error('Failed to load selection sets:', error)
    targetSelectionSets.value = []
    toast.error('Failed to load sets', {
      description: 'Unable to load sets for the selected selection.',
    })
  } finally {
    isLoadingTargetSets.value = false
  }
}

// Handle cancel move/copy
const handleCancelMoveCopy = () => {
  showMoveCopyModal.value = false
  targetSelectionId.value = selection.value?.id || ''
  targetSetId.value = ''
  targetSelectionSets.value = []
  moveCopyAction.value = 'move'
}

// Handle confirm move/copy
const handleConfirmMoveCopy = async () => {
  // Validate inputs
  if (!targetSelectionId.value || selectedMediaIds.value.size === 0) {
    toast.error('Missing selection', {
      description: 'Please select a target selection.',
    })
    return
  }

  if (!targetSetId.value) {
    toast.error('Missing set', {
      description: 'Please select a target set.',
    })
    return
  }

  if (!selection.value?.id || !selectedSetId.value) {
    toast.error('Invalid context', {
      description: 'Unable to determine source selection or set.',
    })
    return
  }

  const mediaIds = Array.from(selectedMediaIds.value)
  const targetSet = targetSetId.value

  // Validate: Prevent moving/copying to the same set
  if (targetSet === selectedSetId.value && targetSelectionId.value === selection.value?.id) {
    toast.error(`Cannot ${moveCopyAction.value} to same set`, {
      description: `The media is already in this set. Please select a different set.`,
    })
    return
  }

  isMovingMedia.value = true
  try {
    if (moveCopyAction.value === 'move') {
      // Move: Use the new backend endpoint
      const result = await selectionsApi.moveMediaToSet(
        selection.value.id,
        selectedSetId.value,
        mediaIds,
        targetSet
      )

      toast.success('Media moved', {
        description: `${result.moved_count || mediaIds.length} item${(result.moved_count || mediaIds.length) > 1 ? 's' : ''} moved successfully.`,
      })

      // Reload media sets to update counts
      if (targetSelectionId.value === selection.value?.id) {
        await mediaSetsSidebar.loadMediaSets()
      }

      // Reload media items to reflect changes
      await loadMediaItems()
      selectedMediaIds.value.clear()
      handleCancelMoveCopy()
    } else {
      // Copy: Use the new backend endpoint
      const result = await selectionsApi.copyMediaToSet(
        selection.value.id,
        selectedSetId.value,
        mediaIds,
        targetSet
      )

      toast.success('Media copied', {
        description: `${result.copied_count || result.media?.length || mediaIds.length} item${(result.copied_count || result.media?.length || mediaIds.length) > 1 ? 's' : ''} copied successfully.`,
      })

      // Reload media sets to update counts (target set will have increased count)
      if (targetSelectionId.value === selection.value?.id) {
        await mediaSetsSidebar.loadMediaSets()
      }

      // Reload media items if we're still viewing the same set
      if (targetSelectionId.value === selection.value?.id && targetSet === selectedSetId.value) {
        await loadMediaItems()
      }

      selectedMediaIds.value.clear()
      handleCancelMoveCopy()
    }
  } catch (error) {
    console.error('Failed to move/copy media:', error)
    toast.error(`Failed to ${moveCopyAction.value} media`, {
      description: error instanceof Error ? error.message : 'An unknown error occurred.',
    })
  } finally {
    isMovingMedia.value = false
  }
}

const handleToggleMediaSelection = id => {
  if (selectedMediaIds.value.has(id)) {
    selectedMediaIds.value.delete(id)
  } else {
    selectedMediaIds.value.add(id)
  }
}

const handleToggleSelectAll = () => {
  if (selectedMediaIds.value.size === sortedMediaItems.value.length) {
    selectedMediaIds.value.clear()
  } else {
    sortedMediaItems.value.forEach(item => {
      selectedMediaIds.value.add(item.id)
    })
  }
}

const handleBulkDelete = () => {
  showBulkDeleteModal.value = true
}

const handleConfirmBulkDelete = () => {
  showBulkDeleteModal.value = false
  selectedMediaIds.value.clear()
}

const handleBulkFavorite = () => {
  // UI only
}

const handleSetAsCover = async item => {
  if (!selection.value?.id || !item?.id || isUpdatingCoverPhoto.value) return

  // Get the thumbnail URL from the media item for immediate update
  const thumbnailUrl = item.thumbnailUrl || item.file?.variants?.thumb || item.file?.url || null

  if (!thumbnailUrl) {
    toast.error('Invalid media', {
      description: 'Media does not have a valid thumbnail URL.',
    })
    return
  }

  isUpdatingCoverPhoto.value = true

  try {
    await selectionsApi.setCoverPhotoFromMedia(selection.value.id, item.id)

    // Update local selection reference immediately (optimistic update)
    if (selection.value) {
      selection.value.coverPhotoUrl = thumbnailUrl
      selection.value.cover_photo_url = thumbnailUrl
      // Force reactivity
      selection.value = { ...selection.value }
    }

    toast.success('Cover photo updated', {
      description: 'The cover photo has been set successfully.',
    })
  } catch (error) {
    console.error('Failed to set cover photo:', error)

    // Revert optimistic update on error
    if (selection.value) {
      // Could reload here, but for now just show error
    }

    toast.error('Failed to set cover photo', {
      description:
        error instanceof Error ? error.message : 'An error occurred while setting the cover photo.',
    })
  } finally {
    isUpdatingCoverPhoto.value = false
  }
}

const handleCoverImageUpload = () => {
  // UI only
}

const handleBulkView = () => {
  if (selectedMediaIds.value.size === 0) return
  const ids = Array.from(selectedMediaIds.value)
  const items = mediaItems.value.filter(m => ids.includes(m.id))
  const imageItems = items.filter(item => item.type === 'image')
  if (imageItems.length > 0) {
    selectedMediaForView.value = imageItems
    currentViewIndex.value = 0
    showMediaViewer.value = true
  }
}

const handleBulkTag = () => {
  showTagModal.value = true
}

const handleCancelTag = () => {
  showTagModal.value = false
}

const handleAddTag = () => {
  // UI only
}

const handleConfirmTag = () => {
  showTagModal.value = false
}

const handleBulkEdit = () => {
  showEditModal.value = true
}

const handleCancelEdit = () => {
  showEditModal.value = false
}

const handleConfirmEdit = () => {
  showEditModal.value = false
}

const handleBulkWatermark = () => {
  showBulkWatermarkModal.value = true
}

const handleCancelBulkWatermark = () => {
  showBulkWatermarkModal.value = false
}

const handleConfirmBulkWatermark = () => {
  showBulkWatermarkModal.value = false
}

const watermarks = ref([])

const handleRenameMedia = item => {
  mediaToRename.value = item
  // Use filename from file relationship, with fallbacks
  const fullFilename = item.file?.filename || item.filename || item.title || item.name || ''
  // Extract just the name without extension for editing
  const extension = fullFilename ? fullFilename.split('.').pop() : ''
  const hasExtension = fullFilename.includes('.') && extension && extension.length < 10 // Heuristic: extension is short
  newMediaName.value = hasExtension
    ? fullFilename.substring(0, fullFilename.lastIndexOf('.'))
    : fullFilename
  showRenameMediaModal.value = true
}

const handleCancelRenameMedia = () => {
  showRenameMediaModal.value = false
  mediaToRename.value = null
  newMediaName.value = ''
}

const handleConfirmRenameMedia = async () => {
  if (
    !mediaToRename.value ||
    !newMediaName.value.trim() ||
    !selection.value?.id ||
    !selectedSetId.value ||
    isRenamingMedia.value
  ) {
    return
  }

  const trimmedName = newMediaName.value.trim()
  const originalFilename = mediaToRename.value.file?.filename || mediaToRename.value.filename || ''

  // Extract original extension
  const originalExtension = originalFilename.includes('.')
    ? originalFilename.substring(originalFilename.lastIndexOf('.'))
    : ''

  // Remove any extension the user might have added
  let finalFilename = trimmedName
  if (trimmedName.includes('.')) {
    const userExtension = trimmedName.substring(trimmedName.lastIndexOf('.'))
    // If user added an extension, remove it (backend will preserve original)
    if (userExtension.length < 10) {
      // Heuristic: likely an extension
      finalFilename = trimmedName.substring(0, trimmedName.lastIndexOf('.'))
    }
  }

  // Add back the original extension if it existed
  if (originalExtension) {
    finalFilename = finalFilename + originalExtension
  }

  // Don't make API call if filename hasn't changed
  if (finalFilename === originalFilename) {
    handleCancelRenameMedia()
    return
  }

  isRenamingMedia.value = true

  try {
    const result = await selectionsApi.renameMedia(
      selection.value.id,
      selectedSetId.value,
      mediaToRename.value.id,
      finalFilename
    )

    // Update local media item with the actual returned filename (backend preserves extension)
    const updatedFilename = result?.data?.filename || result?.filename || finalFilename
    const index = mediaItems.value.findIndex(m => m.id === mediaToRename.value?.id)
    if (index !== -1) {
      // Update the file filename in the local item
      if (mediaItems.value[index].file) {
        mediaItems.value[index].file.filename = updatedFilename
      } else {
        mediaItems.value[index].file = { filename: updatedFilename }
      }
      // Also update top-level filename for backward compatibility
      mediaItems.value[index].filename = updatedFilename
      // Force reactivity
      mediaItems.value = [...mediaItems.value]
    }

    toast.success('Media renamed', {
      description: 'The filename has been updated successfully.',
    })

    handleCancelRenameMedia()
  } catch (error) {
    console.error('Failed to rename media:', error)
    toast.error('Failed to rename media', {
      description:
        error instanceof Error ? error.message : 'An error occurred while renaming the media.',
    })
  } finally {
    isRenamingMedia.value = false
  }
}

const handleDeleteMedia = item => {
  openDeleteModal(item)
}

const handleConfirmDeleteItem = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const handleReplacePhoto = item => {
  mediaToReplace.value = item
  showReplacePhotoModal.value = true
}

const handleCancelReplacePhoto = () => {
  showReplacePhotoModal.value = false
  mediaToReplace.value = null
}

const handleReplacePhotoFileSelect = async event => {
  const input = event.target
  const files = input.files
  if (!files || files.length === 0 || !mediaToReplace.value) return

  const file = files[0]
  if (!file.type.startsWith('image/')) {
    toast.error('Invalid file type', {
      description: 'Please select an image file.',
    })
    return
  }

  if (!selection.value?.id || !selectedSetId.value) {
    toast.error('Invalid context', {
      description: 'Selection or set not found.',
    })
    return
  }

  isReplacingPhoto.value = true

  try {
    // Upload the new file first (use image upload endpoint for images to get variants)
    const isImage = file.type.startsWith('image/')
    const uploadEndpoint = isImage ? '/v1/images/upload' : '/v1/uploads'

    const uploadResponse = await apiClient.upload(uploadEndpoint, file, {
      purpose: 'memora-media',
    })

    // Extract userFileUuid from response (could be in data.userFileUuid or data.data.userFileUuid)
    const userFileUuid =
      uploadResponse.data?.userFileUuid || uploadResponse.data?.data?.userFileUuid

    if (!userFileUuid) {
      throw new Error('Upload response missing userFileUuid')
    }

    // Replace the media with the new file
    const result = await selectionsApi.replaceMedia(
      selection.value.id,
      selectedSetId.value,
      mediaToReplace.value.id,
      userFileUuid
    )

    // Update local media item
    const index = mediaItems.value.findIndex(m => m.id === mediaToReplace.value?.id)
    if (index !== -1) {
      // Replace the entire media item with the updated one from the response
      const updatedMedia = result?.data || result
      if (updatedMedia) {
        mediaItems.value[index] = updatedMedia
        // Force reactivity
        mediaItems.value = [...mediaItems.value]
      }
    }

    toast.success('Photo replaced', {
      description: 'The photo has been replaced successfully.',
    })

    showReplacePhotoModal.value = false
    mediaToReplace.value = null
  } catch (error) {
    console.error('Failed to replace photo:', error)
    toast.error('Failed to replace photo', {
      description:
        error instanceof Error ? error.message : 'An error occurred while replacing the photo.',
    })
  } finally {
    isReplacingPhoto.value = false
  }
}

const handleWatermarkMedia = item => {
  mediaToWatermark.value = item
  showWatermarkMediaModal.value = true
}

const handleCancelWatermarkMedia = () => {
  showWatermarkMediaModal.value = false
  mediaToWatermark.value = null
}

const handleRemoveWatermark = () => {
  // UI only
}

const handleConfirmWatermarkMedia = () => {
  showWatermarkMediaModal.value = false
  mediaToWatermark.value = null
}

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

const handleAddMedia = () => {
  triggerFileInputClick(fileInputRef.value)
}

const handleBrowseFiles = () => {
  triggerFileInputClick(fileInputRef.value)
}

const handleConfirmDuplicateFiles = async () => {
  // Prevent multiple simultaneous uploads
  if (isUploading.value || isProcessingFiles.value) {
    console.warn('Upload or file processing already in progress, ignoring duplicate confirmation')
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

const cancelUpload = () => {
  showUploadProgress.value = false
}

const uploadProgress = ref([])
const overallProgress = ref(0)
const uploadErrors = ref([])
const isUploading = ref(false)
const showDuplicateFilesModal = ref(false)
const duplicateFiles = ref([])
const duplicateFileActions = ref({})
const duplicateFileActionsObject = ref({})
const isProcessingFiles = ref(false)
const justUploaded = ref(false) // Flag to prevent watch from triggering immediately after upload

// Watch the reactive object and sync properties - use immediate and deep watch
watch(
  () => duplicateFileActionsObjectFromWorkflow,
  newVal => {
    if (newVal && typeof newVal === 'object') {
      // Create a new object to trigger reactivity
      const updated = { ...newVal }
      // Remove properties that no longer exist
      Object.keys(duplicateFileActionsObject.value).forEach(key => {
        if (!(key in updated)) {
          delete duplicateFileActionsObject.value[key]
        }
      })
      // Update with new values - assign to trigger reactivity
      Object.assign(duplicateFileActionsObject.value, updated)
    }
  },
  { deep: true, immediate: true }
)

const handleFileSelect = async event => {
  console.log('[handleFileSelect] File input changed', {
    files: event.target.files?.length || 0,
    isUploading: isUploading.value,
    isProcessingFiles: isProcessingFiles.value,
  })

  const files = Array.from(event.target.files || [])
  if (files.length === 0) return

  // Prevent multiple simultaneous uploads or file processing
  if (isUploading.value || isProcessingFiles.value) {
    console.warn(
      '[handleFileSelect] Upload or file processing already in progress, ignoring file select'
    )
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
    console.log(
      '[handleFileSelect] Processing files:',
      files.map(f => f.name)
    )
    // Process files (checks for duplicates)
    const { hasDuplicates, filesToUpload } = await processFiles(files)

    if (hasDuplicates) {
      console.log('[handleFileSelect] Duplicates found, showing modal')
      // Duplicate modal will be shown by the workflow
      return
    }

    if (filesToUpload.length > 0) {
      console.log(
        '[handleFileSelect] Uploading files:',
        filesToUpload.map(f => f.name)
      )
      await uploadMediaToSet(filesToUpload, selectedSetId.value)
    } else {
      console.log('[handleFileSelect] No files to upload after processing')
    }
  } catch (error) {
    console.error('[handleFileSelect] Upload failed:', error)
  } finally {
    isProcessingFiles.value = false
  }
}

const handleDrop = async e => {
  e.preventDefault()
  if (isDragging) isDragging.value = false

  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return

  console.log('[handleDrop] Files dropped', {
    fileCount: files.length,
    isUploading: isUploading.value,
    isProcessingFiles: isProcessingFiles.value,
  })

  // Prevent multiple simultaneous uploads or file processing
  if (isUploading.value || isProcessingFiles.value) {
    console.warn('[handleDrop] Upload or file processing already in progress, ignoring drop')
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
    console.log(
      '[handleDrop] Processing files:',
      fileArray.map(f => f.name)
    )
    // Process files (checks for duplicates)
    const { hasDuplicates, filesToUpload } = await processFiles(fileArray)

    if (hasDuplicates) {
      console.log('[handleDrop] Duplicates found, showing modal')
      // Duplicate modal will be shown by the workflow
      return
    }

    if (filesToUpload.length > 0) {
      console.log(
        '[handleDrop] Uploading files:',
        filesToUpload.map(f => f.name)
      )
      await uploadMediaToSet(filesToUpload, selectedSetId.value)
    } else {
      console.log('[handleDrop] No files to upload after processing')
    }
  } catch (error) {
    console.error('[handleDrop] Upload failed:', error)
  } finally {
    isProcessingFiles.value = false
  }
}

const handleRetryUpload = () => {
  // UI only
}

const goBack = () => {
  router.push({ name: 'selections' })
}
</script>

<style scoped>
.media-grid-move,
.media-grid-enter-active,
.media-grid-leave-active {
  transition: all 0.3s ease;
}

.media-grid-enter-from,
.media-grid-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.media-list-move,
.media-list-enter-active,
.media-list-leave-active {
  transition: all 0.3s ease;
}

.media-list-enter-from,
.media-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
