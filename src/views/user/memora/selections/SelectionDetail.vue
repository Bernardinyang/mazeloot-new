<template>
  <SelectionLayout :selection="selection" :is-loading="isLoading" @go-back="goBack">
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
            <p :class="theme.textSecondary" class="text-sm font-medium">Loading selection...</p>
          </div>
        </div>

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
            :title="selectedSet?.name || 'All Media'"
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
              :icon="FolderPlus"
              message="No sets in this selection"
              description="Create a set to organize and upload your media files."
              action-label="Create Set"
              :action-icon="Plus"
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
        v-model="showDuplicateFilesModal"
        :duplicate-file-actions="duplicateFileActions"
        :duplicate-files="duplicateFiles"
        :is-uploading="isUploading"
        @cancel="handleCancelDuplicateFiles"
        @confirm="handleConfirmDuplicateFiles(selectedSetId)"
        @set-action="duplicateFileActions.set($event[0], $event[1])"
        @replace-all="
          duplicateFiles.forEach(item => duplicateFileActions.set(item.file.name, 'replace'))
        "
        @skip-all="duplicateFiles.forEach(item => duplicateFileActions.set(item.file.name, 'skip'))"
      />

      <UploadProgressBar
        v-model="showUploadProgress"
        :upload-progress="uploadProgress"
        :overall-progress="overallProgress"
        :upload-errors="uploadErrors"
        :is-uploading="isUploading"
        @cancel="cancelUpload"
        @close="showUploadProgress = false"
        @retry="handleRetryUpload"
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
  </SelectionLayout>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, FolderPlus, Plus } from 'lucide-vue-next'
import SelectionLayout from '@/layouts/SelectionLayout.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import BulkActionsBar from '@/components/molecules/BulkActionsBar.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation'
import { useMediaApi } from '@/api/media'
import { useSelectionsApi } from '@/api/selections'
import { toast } from '@/utils/toast'
import MediaItemsHeaderBar from '@/components/organisms/MediaItemsHeaderBar.vue'
import MediaGridItemCard from '@/components/organisms/MediaGridItemCard.vue'
import MediaUploadDropzone from '@/components/organisms/MediaUploadDropzone.vue'
import MediaListItemRow from '@/components/organisms/MediaListItemRow.vue'
import CreateEditMediaSetModal from '@/components/organisms/CreateEditMediaSetModal.vue'
import DuplicateFilesModal from '@/components/organisms/DuplicateFilesModal.vue'
import UploadProgressBar from '@/components/organisms/UploadProgressBar.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import RenameMediaModal from '@/components/organisms/RenameMediaModal.vue'
import TagModal from '@/components/organisms/TagModal.vue'
import EditFilenamesModal from '@/components/organisms/EditFilenamesModal.vue'
import BulkWatermarkModal from '@/components/organisms/BulkWatermarkModal.vue'
import ReplacePhotoModal from '@/components/organisms/ReplacePhotoModal.vue'
import WatermarkMediaModal from '@/components/organisms/WatermarkMediaModal.vue'
import MediaViewerSingle from '@/components/organisms/MediaViewerSingle.vue'
import MediaViewerSlideshow from '@/components/organisms/MediaViewerSlideshow.vue'
import { useSelectionStore } from '@/stores/selection'
import { useSelectionMediaSetsSidebarStore } from '@/stores/selectionMediaSetsSidebar'
import { useWatermarkStore } from '@/stores/watermark'
import { useSelectionCoverActions } from '@/composables/useSelectionCoverActions'
import { createThumbnailFromDataURL } from '@/utils/media/createThumbnailFromDataURL'
import { formatMediaDate } from '@/utils/media/formatMediaDate'
import { triggerFileInputClick } from '@/utils/media/triggerFileInputClick'
import { useMediaListUiPrefs } from '@/composables/useMediaListUiPrefs'
import { useMediaViewerFlow } from '@/composables/useMediaViewerFlow'
import { useMediaSelectionFlow } from '@/composables/useMediaSelectionFlow'
import { useMediaShareDownloadActions } from '@/composables/useMediaShareDownloadActions'
import { useMediaRenameDeleteActions } from '@/composables/useMediaRenameDeleteActions'
import { useReplacePhotoFlow } from '@/composables/useReplacePhotoFlow'
import { useMediaWatermarkActions } from '@/composables/useMediaWatermarkActions'
import { useBulkDeleteFlow } from '@/composables/useBulkDeleteFlow'
import { useBulkTagFlow } from '@/composables/useBulkTagFlow'
import { useBulkEditFilenamesFlow } from '@/composables/useBulkEditFilenamesFlow'
import { useBulkWatermarkFlow } from '@/composables/useBulkWatermarkFlow'
import { useSelectionWorkflow } from '@/composables/useSelectionWorkflow'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const selectionStore = useSelectionStore()
const mediaApi = useMediaApi()
const selectionsApi = useSelectionsApi()
const watermarkStore = useWatermarkStore()
const mediaSetsSidebar = useSelectionMediaSetsSidebarStore()

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

const { handleCreateSet, handleCancelCreateSet } = mediaSetsSidebar

const selection = ref(null)
const selectionStatus = ref('draft')
const isDragging = ref(false)
const viewMode = ref('grid')
const gridSize = ref('small')
const showFilename = ref(true)
const selectedMediaIds = ref(new Set())
const showMoveCopyModal = ref(false)
const moveCopyAction = ref('move')
const isMovingMedia = ref(false)
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
const showUploadProgress = ref(false)
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
const fileInputRef = ref(null)
const {
  showDeleteModal,
  itemToDelete,
  isDeleting,
  openDeleteModal,
  closeDeleteModal,
  getItemName,
} = useDeleteConfirmation()

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
  // If no set is selected, show all media (or empty if no sets exist)
  if (!selectedSetId.value) {
    // If there are sets but none selected, return empty
    if (mediaSets.value.length > 0) {
      return []
    }
    // If no sets exist, show all media
    return mediaItems.value
  }
  // Filter by selected set
  return mediaItems.value.filter(item => item.setId === selectedSetId.value)
})

// Sorted media items based on sort order
const sortedMediaItems = computed(() => {
  const items = [...filteredMediaItems.value]

  switch (sortOrder.value) {
    case 'uploaded-new-old':
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'uploaded-old-new':
      return items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'date-taken-new-old':
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
        const nameA = (a.title || a.name || '').toLowerCase()
        const nameB = (b.title || b.name || '').toLowerCase()
        return nameA.localeCompare(nameB)
      })
    case 'name-z-a':
      return items.sort((a, b) => {
        const nameA = (a.title || a.name || '').toLowerCase()
        const nameB = (b.title || b.name || '').toLowerCase()
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

const updateSetCounts = async () => {
  if (!selection.value || isUpdatingSetCounts.value) return
  isUpdatingSetCounts.value = true
  try {
    // Update set counts based on actual media
    for (const set of mediaSets.value) {
      const count = mediaItems.value.filter(item => item.setId === set.id).length
      set.count = count
    }
    // Save updated sets
    await mediaSetsSidebar.saveMediaSets()
  } catch (error) {
    console.error('Failed to update set counts:', error)
  } finally {
    isUpdatingSetCounts.value = false
  }
}

const loadMediaItems = async () => {
  if (!selection.value) return

  // If a set is selected, load media for that set
  if (selectedSetId.value) {
    isLoadingMedia.value = true
    try {
      const media = await selectionsApi.fetchSetMedia(selection.value.id, selectedSetId.value)
      mediaItems.value = media || []
      await updateSetCounts()
    } catch (error) {
      console.error('Failed to load media:', error)
      mediaItems.value = []
    } finally {
      isLoadingMedia.value = false
    }
  } else {
    // No set selected, clear media items
    mediaItems.value = []
  }
}

// When user selects a different set, show loading state briefly
watch(
  () => selectedSetId.value,
  () => {
    // Show loading state when set changes
    isLoadingMedia.value = true
    // Brief delay to show loading state, then filter (which is instant)
    setTimeout(() => {
      isLoadingMedia.value = false
    }, 200)
  }
)

// Media item context menu handlers
const handleOpenMedia = item => {
  // Show in media viewer instead of opening in new tab
  openMediaViewer(item)
}

const { handleQuickShare, handleDownloadMedia, handleCopyFilenames } = useMediaShareDownloadActions(
  {
    getMediaShareUrl: () => '',
    getMediaDownloadUrl: () => '',
    getDownloadFilename: () => '',
    fetchDownloadBlob: () => Promise.resolve(new Blob()),
    triggerBrowserDownload: () => {},
    triggerFallbackDownloadLink: () => {},
    copyTextToClipboard: async text => {
      await navigator.clipboard.writeText(text)
    },
    getMediaFilename: item => item.title || item.name || 'media',
    getCollectionShareLink: () => '',
    route,
    description: '',
  }
)

const handleMoveCopy = item => {
  // Select the single item and open the move/copy modal
  selectedMediaIds.value.clear()
  selectedMediaIds.value.add(item.id)
  moveCopyAction.value = 'move'
  showMoveCopyModal.value = true
}

const { handleToggleMediaSelection, handleToggleSelectAll } = useMediaSelectionFlow({
  selectedMediaIds,
  sortedMediaItems,
  description: '',
})

// Bulk action handlers
const { handleBulkDelete, handleConfirmBulkDelete } = useBulkDeleteFlow({
  selectedMediaIds,
  showBulkDeleteModal,
  isBulkDeleteLoading,
  mediaApi,
  deleteMediaFn: async mediaId => {
    // Use selections API for deleting media in selections
    if (selection.value?.id && selectedSetId.value) {
      await selectionsApi.deleteMedia(selection.value.id, selectedSetId.value, mediaId)
    } else {
      throw new Error('Selection ID or Set ID is missing')
    }
  },
  mediaItems,
  updateSetCounts,
  description: '',
})

const handleBulkFavorite = async () => {
  if (selectedMediaIds.value.size === 0) return
  isBulkFavoriteLoading.value = true
  try {
    // Selection media doesn't have favorite functionality, so this is a no-op
    toast.info('Favorite functionality not available for selections')
    selectedMediaIds.value.clear()
  } catch (error) {
    console.error('Failed to favorite media:', error)
    toast.error('Failed to favorite media')
  } finally {
    isBulkFavoriteLoading.value = false
  }
}

// Track if we're updating cover to prevent watch from overwriting
const isUpdatingCover = ref(false)

const { handleSetAsCover, handleCoverImageUpload } = useSelectionCoverActions({
  selection,
  selectionStore,
  createThumbnailFromDataURL,
  isUpdatingCover,
  description: 'The cover photo has been updated.',
})

const handleBulkView = () => {
  if (selectedMediaIds.value.size === 0) return

  const ids = Array.from(selectedMediaIds.value)
  const items = mediaItems.value.filter(m => ids.includes(m.id))

  // Filter to only images for preview
  const imageItems = items.filter(item => item.type === 'image')

  if (imageItems.length === 0) {
    toast.info('No images to view', {
      description: '',
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
  description: '',
})

const { handleBulkEdit, handleCancelEdit, handleConfirmEdit } = useBulkEditFilenamesFlow({
  selectedMediaIds,
  showEditModal,
  editAppendText,
  isBulkEditLoading,
  mediaItems,
  mediaApi,
  loadMediaItems,
  description: '',
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
    applyWatermarkToImage: async () => '',
    description: '',
  })

const watermarks = computed(() => watermarkStore.watermarks)

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
  deleteMediaFn: async mediaId => {
    // Use selections API for deleting media in selections
    if (selection.value?.id && selectedSetId.value) {
      await selectionsApi.deleteMedia(selection.value.id, selectedSetId.value, mediaId)
    } else {
      throw new Error('Selection ID or Set ID is missing')
    }
  },
  updateSetCounts,
  handleConfirmDeleteSet: mediaSetsSidebar.confirmDeleteSet,
  description: '',
})

const { handleReplacePhoto, handleCancelReplacePhoto, handleReplacePhotoFileSelect } =
  useReplacePhotoFlow({
    mediaToReplace,
    showReplacePhotoModal,
    isReplacingPhoto,
    selectedWatermark: ref('none'),
    watermarkStore,
    mediaApi,
    mediaItems,
    createThumbnail: async () => '',
    getFileBaseName: name => name.replace(/\.[^/.]+$/, ''),
    fileToDataURL: async () => '',
    applyWatermarkToImage: async () => '',
    description: '',
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
  selectedWatermark: ref('none'),
  isApplyingWatermark,
  watermarkStore,
  mediaApi,
  mediaItems,
  applyWatermarkToImage: async () => '',
  description: '',
})

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

const {
  uploadMediaToSet,
  processFiles: processFilesForUpload,
  handleConfirmDuplicateFiles,
  handleCancelDuplicateFiles,
  cancelUpload,
  uploadProgress,
  overallProgress,
  uploadErrors,
  isUploading,
  showDuplicateFilesModal,
  duplicateFiles,
  duplicateFileActions,
} = useSelectionWorkflow({
  selectionId: () => selection.value?.id,
  loadMediaItems,
  existingMedia: () => mediaItems.value,
})

// Watch isUploading to show/hide progress modal
watch(isUploading, uploading => {
  if (uploading) {
    showUploadProgress.value = true
  }
})

const handleFileSelect = async event => {
  const files = Array.from(event.target.files || [])
  if (files.length === 0) return

  // Ensure a set is selected before uploading
  if (!selectedSetId.value && mediaSets.value.length > 0) {
    // Auto-select the first set if none is selected
    mediaSetsSidebar.handleSelectSet(mediaSets.value[0].id)
  }

  if (!selectedSetId.value) {
    toast.error('No set selected', {
      description: 'Please select a set from the sidebar before uploading.',
    })
    event.target.value = ''
    return
  }

  // Process files (checks for duplicates)
  const result = await processFilesForUpload(files)

  if (result?.hasDuplicates) {
    // Duplicate modal will be shown, wait for user confirmation
    return
  }

  // No duplicates, proceed with upload
  if (result?.filesToUpload && result.filesToUpload.length > 0) {
    await uploadMediaToSet(result.filesToUpload, selectedSetId.value)
  }

  event.target.value = '' // Reset input
}

const handleDrop = async event => {
  event.preventDefault()
  if (isDragging) isDragging.value = false

  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return

  // Ensure a set is selected before uploading
  if (!selectedSetId.value && mediaSets.value.length > 0) {
    // Auto-select the first set if none is selected
    mediaSetsSidebar.handleSelectSet(mediaSets.value[0].id)
  }

  if (!selectedSetId.value) {
    toast.error('No set selected', {
      description: 'Please select a set from the sidebar before uploading.',
    })
    return
  }

  // Process files (checks for duplicates)
  const result = await processFilesForUpload(Array.from(files))

  if (result?.hasDuplicates) {
    // Duplicate modal will be shown, wait for user confirmation
    return
  }

  // No duplicates, proceed with upload
  if (result?.filesToUpload && result.filesToUpload.length > 0) {
    await uploadMediaToSet(result.filesToUpload, selectedSetId.value)
  }
}

const handleRetryUpload = async (fileId, retryFn) => {
  if (retryFn && typeof retryFn === 'function') {
    try {
      await retryFn()
      if (loadMediaItems) {
        await loadMediaItems()
      }
    } catch (error) {
      console.error('Retry failed:', error)
    }
  }
}

const loadSelection = async () => {
  const selectionId = route.params.id
  if (!selectionId) return

  isLoading.value = true
  try {
    const selectionData = await selectionStore.fetchSelection(selectionId)
    selection.value = selectionData
    selectionStatus.value = selectionData.status === 'completed' ? 'completed' : 'draft'

    // Initialize sets sidebar
    mediaSetsSidebar.setContext(selectionData.id, selectionData.mediaSets || [])

    // Load media for this selection
    await loadMediaItems()
  } catch (error) {
    console.error('Failed to load selection:', error)
  } finally {
    isLoading.value = false
  }
}

// Watch for selection updates in the store
watch(
  () => selectionStore.currentSelection,
  updatedSelection => {
    if (updatedSelection && selection.value && updatedSelection.id === selection.value.id) {
      // Don't overwrite thumbnail/image if we're currently updating the cover
      if (isUpdatingCover.value) {
        // Only update other fields, preserve thumbnail/image
        selection.value = {
          ...selection.value,
          ...updatedSelection,
          thumbnail: selection.value.thumbnail, // Preserve current
          image: selection.value.image, // Preserve current
          mediaSets: updatedSelection.mediaSets || selection.value.mediaSets || [],
        }
        // Clear flag after a short delay
        setTimeout(() => {
          isUpdatingCover.value = false
        }, 1000)
      } else {
        selection.value = {
          ...selection.value,
          ...updatedSelection,
          mediaSets: updatedSelection.mediaSets || selection.value.mediaSets || [],
        }
      }
    }
  },
  { deep: true }
)

watch(
  () => selectionStore.selections,
  selections => {
    if (selection.value) {
      const updatedSelection = selections.find(s => s.id === selection.value?.id)
      if (updatedSelection && updatedSelection.id === selection.value.id) {
        // Don't overwrite thumbnail/image if we're currently updating the cover
        if (isUpdatingCover.value) {
          // Only update other fields, preserve thumbnail/image
          selection.value = {
            ...selection.value,
            ...updatedSelection,
            thumbnail: selection.value.thumbnail, // Preserve current
            image: selection.value.image, // Preserve current
            mediaSets: updatedSelection.mediaSets || selection.value.mediaSets || [],
          }
        } else {
          selection.value = {
            ...selection.value,
            ...updatedSelection,
            mediaSets: updatedSelection.mediaSets || selection.value.mediaSets || [],
          }
        }
      }
    }
  },
  { deep: true }
)

const goBack = () => {
  router.push({ name: 'selections' })
}

onMounted(() => {
  loadSelection()
})

watch(
  () => route.params.id,
  () => {
    loadSelection()
  }
)

// Watch for media sets changes (when a new set is created/updated/deleted)
watch(
  () => mediaSets.value,
  async (newSets, oldSets) => {
    if (!selection.value) return

    const oldLength = oldSets?.length || 0
    const newLength = newSets.length

    // If a new set was created, reload the selection to get updated data
    if (newLength > oldLength) {
      // Reload selection to get updated media sets with counts
      try {
        const updatedSelection = await selectionStore.fetchSelection(selection.value.id)
        selection.value = updatedSelection
        // Update media sets in sidebar with fresh data from API
        await mediaSetsSidebar.loadMediaSets()
      } catch (error) {
        console.error('Failed to reload selection:', error)
      }

      // Auto-select the newly created set if none is selected
      if (!selectedSetId.value) {
        const newSet = newSets[newSets.length - 1]
        if (newSet) {
          mediaSetsSidebar.handleSelectSet(newSet.id)
        }
      } else if (selectedSetId.value) {
        // If a set is already selected, reload its media (which will be empty for new sets)
        loadMediaItems()
      }
    } else if (newLength < oldLength) {
      // A set was deleted, reload media items if a set is still selected
      if (selectedSetId.value) {
        loadMediaItems()
      }
    }
  },
  { deep: true }
)

// Watch for selectedSetId changes to reload media when switching sets
watch(selectedSetId, (newSetId, oldSetId) => {
  if (newSetId && newSetId !== oldSetId && selection.value) {
    // Load media for the newly selected set (will be empty if it's a new set)
    loadMediaItems()
  } else if (!newSetId && oldSetId) {
    // Set was deselected, clear media items
    mediaItems.value = []
  }
})
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
