<template>
  <SelectionLayout :is-loading="isLoading" :selection="selection" @go-back="goBack">
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
        {{ selectedMediaIds }}

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
                @image-error="handleImageError"
                @quick-share="handleQuickShare(item)"
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
import { computed, ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import SelectionLayout from '@/layouts/SelectionLayout.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import BulkActionsBar from '@/components/molecules/BulkActionsBar.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
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
import { formatMediaDate } from '@/utils/media/formatMediaDate'

const theme = useThemeClasses()

// UI State only - no functionality
const selectedSetId = ref('set-1')
const mediaSets = ref([
  { id: 'set-1', name: 'Set 1', description: '', count: 8, order: 0 },
  { id: 'set-2', name: 'Set 2', description: '', count: 5, order: 1 },
])
const sortedMediaSets = computed(() => mediaSets.value)
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

// Mock static data
const selection = ref({
  id: 'selection-1',
  name: 'Wedding Photos',
  status: 'draft',
  color: '#10B981',
  createdAt: '2024-01-15T10:00:00Z',
})
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

// Mock static media data
const mediaItems = ref([
  {
    id: 'media-1',
    title: 'Photo 1',
    url: 'https://via.placeholder.com/400',
    type: 'image',
    createdAt: '2024-01-15T10:00:00Z',
    setId: 'set-1',
  },
  {
    id: 'media-2',
    title: 'Photo 2',
    url: 'https://via.placeholder.com/400',
    type: 'image',
    createdAt: '2024-01-15T11:00:00Z',
    setId: 'set-1',
  },
  {
    id: 'media-3',
    title: 'Photo 3',
    url: 'https://via.placeholder.com/400',
    type: 'image',
    createdAt: '2024-01-15T12:00:00Z',
    setId: 'set-1',
  },
  {
    id: 'media-4',
    title: 'Photo 4',
    url: 'https://via.placeholder.com/400',
    type: 'image',
    createdAt: '2024-01-15T13:00:00Z',
    setId: 'set-1',
  },
  {
    id: 'media-5',
    title: 'Photo 5',
    url: 'https://via.placeholder.com/400',
    type: 'image',
    createdAt: '2024-01-15T14:00:00Z',
    setId: 'set-1',
  },
  {
    id: 'media-6',
    title: 'Photo 6',
    url: 'https://via.placeholder.com/400',
    type: 'image',
    createdAt: '2024-01-15T15:00:00Z',
    setId: 'set-1',
  },
  {
    id: 'media-7',
    title: 'Photo 7',
    url: 'https://via.placeholder.com/400',
    type: 'image',
    createdAt: '2024-01-15T16:00:00Z',
    setId: 'set-1',
  },
  {
    id: 'media-8',
    title: 'Photo 8',
    url: 'https://via.placeholder.com/400',
    type: 'image',
    createdAt: '2024-01-15T17:00:00Z',
    setId: 'set-1',
  },
])

// Filter media items by selected set
const filteredMediaItems = computed(() => {
  if (!selectedSetId.value) {
    return []
  }
  return mediaItems.value.filter(item => item.setId === selectedSetId.value)
})

// Media items are now sorted/filtered by the backend
const sortedMediaItems = computed(() => filteredMediaItems.value)

// UI-only handlers
const handleSortChange = value => {
  sortOrder.value = value
  isSortMenuOpen.value = false
}

const handleGridSizeChange = value => {
  gridSize.value = value
  isViewMenuOpen.value = false
}

const handleFilenameToggle = event => {
  showFilename.value = event.target.checked
}

const openMediaViewer = item => {
  selectedMedia.value = item
  selectedMediaForView.value = [item]
  currentViewIndex.value = 0
  showMediaViewer.value = true
}

const closeMediaViewer = () => {
  showMediaViewer.value = false
}

const navigateSlideshow = direction => {
  // UI only - no functionality
}

// UI-only handlers - no functionality
const handleOpenMedia = item => {
  openMediaViewer(item)
}

const handleQuickShare = () => {
  // UI only
}

const handleDownloadMedia = () => {
  // UI only
}

const handleCopyFilenames = () => {
  // UI only
}

const handleMoveCopy = item => {
  selectedMediaIds.value.clear()
  selectedMediaIds.value.add(item.id)
  moveCopyAction.value = 'move'
  showMoveCopyModal.value = true
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

const handleSetAsCover = () => {
  // UI only
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
  newMediaName.value = item.title || item.name || ''
  showRenameMediaModal.value = true
}

const handleCancelRenameMedia = () => {
  showRenameMediaModal.value = false
  mediaToRename.value = null
}

const handleConfirmRenameMedia = () => {
  showRenameMediaModal.value = false
  mediaToRename.value = null
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

const handleReplacePhotoFileSelect = () => {
  // UI only
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
  // UI only
}

const handleBrowseFiles = () => {
  // UI only
}

const handleConfirmDuplicateFiles = () => {
  showDuplicateFilesModal.value = false
}

const handleCancelDuplicateFiles = () => {
  showDuplicateFilesModal.value = false
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

const handleFileSelect = () => {
  // UI only
}

const handleDrop = () => {
  // UI only
}

const handleRetryUpload = () => {
  // UI only
}

const goBack = () => {
  // UI only - no navigation
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
