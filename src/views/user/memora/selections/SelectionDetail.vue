<template>
  <!-- Settings View -->
  <SelectionSettingsGeneral
    v-if="route.query?.tab === 'settings' && route.query?.section === 'general'"
  />

  <!-- Default Photos View -->
  <SelectionLayout
    v-else
    :is-loading="isLoading || isUpdatingCoverPhoto"
    :selection="selection"
    :on-copy-filenames-per-set="handleCopyFilenamesPerSet"
    :on-copy-selected-filenames-in-set="handleCopySelectedFilenamesInSet"
    :on-copy-all-selected-filenames="handleCopyAllSelectedFilenames"
    :selected-count="selectedCountAcrossSelection"
    :is-copying-filenames="isCopyingFilenames"
    :set-progress="setProgressMap"
    :overall-progress="overallProgress"
    :on-reset-limit="handleResetSelectionLimit"
    :is-resetting-limit="isResettingLimit"
    @go-back="goBack"
  >
    <template #content>
      <input
        ref="fileInputRef"
        accept="image/*,video/*"
        class="hidden"
        multiple
        type="file"
        :disabled="selection?.status === 'completed'"
        @change="handleFileSelect"
      />

      <!-- Main Content Area -->
      <main
        class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-all duration-300 relative"
        :style="isDragging ? { '--tw-ring-color': `${selectionColor.value}33` } : {}"
        :class="isDragging ? 'ring-4' : ''"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <!-- Drag overlay when dragging files -->
        <div
          v-if="isDragging && selectedSetId"
          class="absolute inset-0 z-50 border-4 border-dashed rounded-lg flex items-center justify-center pointer-events-none"
          :style="{
            backgroundColor: `${selectionColor.value}1A`,
            borderColor: selectionColor.value,
          }"
        >
          <div class="text-center space-y-4">
            <div
              class="p-6 rounded-full"
              :style="{
                backgroundColor: `${selectionColor.value}33`,
              }"
            >
              <ImagePlus class="h-16 w-16 mx-auto" :style="{ color: selectionColor.value }" />
            </div>
            <p class="text-2xl font-bold" :style="{ color: selectionColor.value }">
              Drop files here to upload
            </p>
          </div>
        </div>
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
            :selected-count="selectedCountInCurrentSet"
            :title="selectedSet?.name || 'All Media'"
            :total-items="sortedMediaItems.length"
            :selection-status="selection?.status"
            :disable-upload="selection?.status === 'completed'"
            :on-copy-selected-filenames-in-set="
              () => handleCopySelectedFilenamesInSet(selectedSetId)
            "
            @toggle-select-all="handleToggleSelectAll"
            @add-media="handleAddMedia"
          />

          <!-- Bulk Actions Bar -->
          <BulkActionsBar
            v-if="selectedSetId"
            :is-all-selected="selectedMediaIds.size === sortedMediaItems.length"
            :is-favorite-loading="isBulkFavoriteLoading"
            :selected-count="selectedMediaIds.size"
            :disable-actions="selection?.status === 'completed'"
            @delete="handleBulkDelete"
            @edit="handleBulkEdit"
            @favorite="handleBulkFavorite"
            @move="showMoveCopyModal = true"
            @view="handleBulkView"
            @watermark="handleBulkWatermark"
            @copy-filenames="handleBulkCopyFilenames"
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
                :is-selected="selectedMediaIds.has(getItemId(item))"
                :was-selected-on-completion="
                  selection?.status === 'completed' ? item.isSelected : false
                "
                :item="item"
                :placeholder-image="placeholderImage"
                :show-filename="showFilename"
                :selection-status="selection?.status"
                :show-management-actions="selection?.status !== 'completed'"
                @delete="handleDeleteMedia(item)"
                @download="handleDownloadMedia(item)"
                @open="handleOpenMedia(item)"
                @rename="handleRenameMedia(item)"
                @replace="handleReplacePhoto(item)"
                @watermark="handleWatermarkMedia(item)"
                @toggle-selection="handleToggleMediaSelection(getItemId(item))"
                @open-viewer="openMediaViewer(item)"
                @view-details="handleViewDetails(item)"
                @image-error="handleImageError"
                @move-copy="handleMoveCopy(item)"
                @copy-filenames="handleCopyFilenames(item)"
                @set-as-cover="handleSetAsCover(item)"
                @remove-watermark="handleRemoveWatermark(item)"
                @star-click="handleStarMedia(item)"
              />
            </TransitionGroup>
            <TransitionGroup v-else class="space-y-2" name="media-list" tag="div">
              <MediaListItemRow
                v-for="item in sortedMediaItems"
                :key="item.id"
                :is-selected="selectedMediaIds.has(getItemId(item))"
                :was-selected-on-completion="
                  selection?.status === 'completed' ? item.isSelected : false
                "
                :item="item"
                :placeholder-image="placeholderImage"
                :show-filename="showFilename"
                :selection-status="selection?.status"
                :show-management-actions="selection?.status !== 'completed'"
                :subtitle="formatMediaDate(item.createdAt)"
                @delete="handleDeleteMedia(item)"
                @download="handleDownloadMedia(item)"
                @open="handleOpenMedia(item)"
                @rename="handleRenameMedia(item)"
                @replace="handleReplacePhoto(item)"
                @watermark="handleWatermarkMedia(item)"
                @toggle-selection="handleToggleMediaSelection(getItemId(item))"
                @open-viewer="openMediaViewer(item)"
                @view-details="handleViewDetails(item)"
                @image-error="handleImageError"
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
              selection &&
              selection.status !== 'completed' &&
              mediaSets.length === 0
            "
            class="flex items-center justify-center py-16"
          >
            <EmptyState
              :action-icon="Plus"
              :action-class="'text-white transition-colors'"
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
        v-model="mediaSetsSidebar.showCreateSetModal"
        v-model:description="mediaSetsSidebar.newSetDescription"
        v-model:name="mediaSetsSidebar.newSetName"
        v-model:selectionLimit="mediaSetsSidebar.newSetSelectionLimit"
        :is-creating="mediaSetsSidebar.isCreatingSet"
        :is-editing="!!mediaSetsSidebar.editingSetIdInModal"
        context="selection"
        @cancel="mediaSetsSidebar.handleCancelCreateSet"
        @confirm="mediaSetsSidebar.handleCreateSet"
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

      <!-- Selection Limit Modal -->
      <SelectionLimitModal
        v-model="showSelectionLimitModal"
        :current-limit="selection?.selectionLimit"
        :is-saving="isSavingSelectionLimit"
        @save="handleSaveSelectionLimit"
        @cancel="handleCancelSelectionLimit"
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
        :progress="bulkWatermarkProgress"
        @cancel="handleCancelBulkWatermark"
        @confirm="handleConfirmBulkWatermark"
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
        :selection-id="selection?.id || selection?.uuid"
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
          <Loader2 class="h-8 w-8 animate-spin text-teal-500 mb-4" />
          <p :class="theme.textPrimary" class="text-sm font-medium">
            Removing watermark from image...
          </p>
          <p :class="theme.textSecondary" class="text-xs mt-2">
            Please wait while we restore the original image.
          </p>
        </div>
      </CenterModal>
    </template>
  </SelectionLayout>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SelectionLayout from '@/layouts/SelectionLayout.vue'
import SelectionSettingsGeneral from '@/views/user/memora/selections/settings/General.vue'
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
import EditFilenamesModal from '@/components/organisms/EditFilenamesModal.vue'
import BulkWatermarkModal from '@/components/organisms/BulkWatermarkModal.vue'
import ReplacePhotoModal from '@/components/organisms/ReplacePhotoModal.vue'
import WatermarkMediaModal from '@/components/organisms/WatermarkMediaModal.vue'
import WatermarkPreviewModal from '@/components/organisms/WatermarkPreviewModal.vue'
import MediaLightbox from '@/components/organisms/MediaLightbox.vue'
import MoveCopyModal from '@/components/organisms/MoveCopyModal.vue'
import FocalPointModal from '@/components/organisms/FocalPointModal.vue'
import CenterModal from '@/components/molecules/CenterModal.vue'
import { formatMediaDate } from '@/utils/media/formatMediaDate'
import { useSelectionStore } from '@/stores/selection.js'
import { useSelectionMediaSetsSidebarStore } from '@/stores/selectionMediaSetsSidebar'
import { storeToRefs } from 'pinia'
import { FolderPlus, ImagePlus, Plus } from 'lucide-vue-next'
import { triggerFileInputClick } from '@/utils/media/triggerFileInputClick'
import { useSelectionWorkflow } from '@/composables/useSelectionWorkflow'
import { useSelectionActions } from '@/composables/useSelectionActions'
import { useSelectionProgress } from '@/composables/useSelectionProgress'
import { useSelectionsApi } from '@/api/selections'
import { useMediaWatermarkActions } from '@/composables/useMediaWatermarkActions'
import { apiClient } from '@/api/client'
import { toast } from '@/utils/toast'
import { useActionHistoryStore } from '@/stores/actionHistory'
import { darkenColor } from '@/utils/colors'
import Pagination from '@/components/molecules/Pagination.vue'
import { useAsyncPagination } from '@/composables/useAsyncPagination.js'
import { useWatermarkStore } from '@/stores/watermark'

const theme = useThemeClasses()
const route = useRoute()
const router = useRouter()
const selectionStore = useSelectionStore()
const mediaSetsSidebar = useSelectionMediaSetsSidebarStore()
const watermarkStore = useWatermarkStore()

// Get selection color from parent (provided by SelectionLayout)
const selectionColor = inject(
  'selectionColor',
  computed(() => '#10B981')
)
const getSelectionHoverColor = inject('getSelectionHoverColor', () => '#059669')

// Get hover color (slightly darker) for use in this component
const selectionHoverColor = computed(() => {
  return darkenColor(selectionColor.value, 10)
})

// Action history for undo/redo (global store)
const actionHistory = useActionHistoryStore()

// Helper to get undo action button for toasts
const getUndoAction = () => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const undoShortcut = isMac ? '⌘Z' : 'Ctrl+Z'

  return {
    label: `Undo ${undoShortcut}`,
    onClick: async () => {
      if (actionHistory.canUndo) {
        const description = actionHistory.lastActionDescription
        await actionHistory.undo()
        toast.success('Undone', {
          description: description ? `Reverted: ${description}` : 'Action has been undone',
        })
      }
    },
  }
}

// Use store for media sets
const { selectedSetId, sortedMediaSets } = storeToRefs(mediaSetsSidebar)
const mediaSets = computed(() => mediaSetsSidebar.mediaSets)

// Selection data
const selection = ref(null)
const selectionStatus = computed(() => selection.value?.status || 'draft')
const isDragging = ref(false)

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
const isBulkEditLoading = ref(false)
const isBulkDeleteLoading = ref(false)
const isUpdatingSetCounts = ref(false)
const isUpdatingCoverPhoto = ref(false)
const selectedMedia = ref(null)
const selectedMediaForView = ref([])
const currentViewIndex = ref(0)
const showMediaViewer = ref(false)
const showMediaDetailSidebar = ref(false)

// Focal point modal state
const showFocalPointModal = ref(false)
const focalPointImageUrl = ref(null)
const selectedMediaForCover = ref(null)
const currentFocalPoint = ref({ x: 50, y: 50 })
const selectedMediaForDetails = ref(null)
const showBulkDeleteModal = ref(false)
const showEditModal = ref(false)
const showBulkWatermarkModal = ref(false)
const selectedBulkWatermark = ref('none')
const showUploadProgress = ref(false)
const isBulkWatermarkLoading = ref(false)
const bulkWatermarkProgress = ref(null)
const isBulkWatermarkCancelled = ref(false)
const editAppendText = ref('')
const showRenameMediaModal = ref(false)
const mediaToRename = ref(null)
const newMediaName = ref('')
const isRenamingMedia = ref(false)
const showReplacePhotoModal = ref(false)
const mediaToReplace = ref(null)
const isReplacingPhoto = ref(false)
const showWatermarkMediaModal = ref(false)
const showWatermarkPreviewModal = ref(false)
const mediaToWatermark = ref(null)
const selectedWatermarkForMedia = ref('none')
const isApplyingWatermark = ref(false)
const showRemoveWatermarkLoading = ref(false)
const previewMediaImageUrl = ref('')
const previewWatermark = ref(null)

// Fallback placeholder image (SVG data URL)
const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='

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
    return
  }

  isLoading.value = true
  try {
    const selectionData = await selectionStore.fetchSelection(selectionId)
    selection.value = selectionData

    // Set context and load media sets
    await mediaSetsSidebar.setContext(
      selectionId,
      selectionData.mediaSets || null
    )
    
    // Load sets if not provided in selection data
    if (!selectionData.mediaSets || selectionData.mediaSets.length === 0) {
      await mediaSetsSidebar.loadMediaSets()
    }

    // Check if setId is in route query and set it first
    if (route.query.setId) {
      const setIdFromRoute = route.query.setId
      if (mediaSetsSidebar.mediaSets.some(s => s.id === setIdFromRoute)) {
        mediaSetsSidebar.handleSelectSet(setIdFromRoute)
      }
    }

    // Auto-select first set if none selected and sets exist
    if (!selectedSetId.value && mediaSetsSidebar.mediaSets.length > 0) {
      mediaSetsSidebar.handleSelectSet(mediaSetsSidebar.mediaSets[0].id)
    }

    // Load media items for the selected set (if one is selected)
    if (selectedSetId.value) {
      await loadMediaItems()
    }
  } catch (error) {
    // Optionally redirect back or show error message
  } finally {
    isLoading.value = false
  }
}

// Sync selectedSetId with route query parameter
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
      if (mediaSetsSidebar.mediaSets.some(s => s.id === setIdFromRoute)) {
        isUpdatingFromRoute = true
        mediaSetsSidebar.handleSelectSet(setIdFromRoute)
        isUpdatingFromRoute = false
      }
    }
  }
)

// Helper to determine if photos tab is active
const isPhotosTabActive = computed(() => {
  const tab = route.query.tab
  const routeName = route.name?.toString() ?? ''
  return (
    tab === 'photos' ||
    routeName === 'selectionPhotos' ||
    routeName === 'selectionPreview' ||
    (!tab && routeName !== 'selectionSettings')
  )
})

// Auto-select first set when photos tab is clicked and sets exist
watch(
  () => route.query.tab,
  newTab => {
    // When photos tab is active and no set is selected, auto-select first set if available
    if (newTab === 'photos' || (!newTab && isPhotosTabActive.value)) {
      // Wait a bit for mediaSets to be loaded
      const checkAndSelect = () => {
        if (!selectedSetId.value && mediaSetsSidebar.mediaSets.length > 0 && !route.query.setId) {
          isUpdatingFromRoute = true
          mediaSetsSidebar.handleSelectSet(mediaSetsSidebar.mediaSets[0].id)
          isUpdatingFromRoute = false
        }
      }

      // Check immediately and also after a short delay to ensure mediaSets are loaded
      checkAndSelect()
      setTimeout(checkAndSelect, 100)
    }
  },
  { immediate: true }
)

// Also watch for when mediaSets become available while on photos tab
watch(
  () => mediaSetsSidebar.mediaSets.length,
  () => {
    if (
      isPhotosTabActive.value &&
      !selectedSetId.value &&
      mediaSetsSidebar.mediaSets.length > 0 &&
      !route.query.setId
    ) {
      isUpdatingFromRoute = true
      mediaSetsSidebar.handleSelectSet(mediaSetsSidebar.mediaSets[0].id)
      isUpdatingFromRoute = false
    }
  }
)

// Watch route params to reload when selection ID changes
watch(
  () => route.params.id,
  () => {
    loadSelection()
  }
)

// Initialize selectedSetId from route query on mount
onMounted(async () => {
  loadSelection()
  
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
  if (!itemToDelete.value) return 'Item'
  const item = itemToDelete.value
  // For media items, try to get filename from file relationship
  return item.file?.filename || item.filename || item.title || item.name || 'Item'
}

const selectedSet = computed(() => {
  return mediaSets.value.find(set => set.id === selectedSetId.value) || mediaSets.value[0]
})

// Initialize media items as empty array
const mediaItems = ref([])

// Load media items for the selected set with pagination
const selectionsApi = useSelectionsApi()

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
  if (!selection.value?.id || !selectedSetId.value) {
    return { data: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1 } }
  }

  const backendSortBy = convertSortOrder(sortOrder.value)
  const fetchParams = {
    ...params,
  }

  if (backendSortBy) {
    fetchParams.sortBy = backendSortBy
  }

  const response = await selectionsApi.fetchSetMedia(
    selection.value.id,
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
  autoFetch: false, // We'll call fetch manually when selection/set changes
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
  if (!selection.value?.id || !selectedSetId.value) {
    return
  }

  // Use pagination fetch
  await fetchMedia()
}

// Update isLoadingMedia to use pagination loading state
const isLoadingMedia = computed(() => isLoadingMediaPagination.value)

// Initialize selection workflow for uploads
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
} = useSelectionWorkflow({
  selectionId: () => selection.value?.id,
  loadMediaItems,
  existingMedia: () => mediaItems.value,
  // Reload media sets after successful upload to update counts
  onUploadComplete: async results => {
    if (results.successful.length > 0) {
      await mediaSetsSidebar.loadMediaSets()
    }
  },
})

// Watch upload state to control progress modal
watch(isUploadingFromWorkflow, async (val, oldVal) => {
  // Show upload progress modal when upload starts
  if (val) {
    showUploadProgress.value = true
  }
  if (!val && oldVal) {
    justUploaded.value = true
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

    // Note: Media sets are now reloaded via onUploadComplete callback in useSelectionWorkflow
    // This watch is kept for modal management only

    // Clear flag after a delay to allow loadMediaItems from uploadMediaToSet to complete
    setTimeout(() => {
      justUploaded.value = false
    }, 500)
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

// Watch for selectedSetId changes to load media
// Skip if upload is in progress or just completed to avoid duplicate calls
watch(
  selectedSetId,
  newSetId => {
    if (
      selection.value?.id &&
      newSetId &&
      !isUploading.value &&
      !isLoadingMedia.value &&
      !justUploaded.value
    ) {
      loadMediaItems()
    } else if (!newSetId) {
      // Clear media items when no set is selected (shows empty state)
      mediaItems.value = []
    }
  },
  { immediate: false }
)

// Watch for sortOrder changes to reload media with new sorting
watch(
  sortOrder,
  () => {
    if (selection.value?.id && selectedSetId.value && !isUploading.value && !isLoadingMedia.value) {
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

const handleStarMediaFromLightbox = async ({ item }) => {
  // Handle star from MediaLightbox - just call the existing handler
  // The item already has the updated state from MediaLightbox's optimistic update
  await handleStarMedia(item)
}

const handleStarMedia = async item => {
  if (!item?.id || !selection.value?.id || !selectedSetId.value) {
    return
  }

  try {
    const oldStarredStatus = item.isStarred
    const result = await selectionsApi.starMedia(selection.value.id, selectedSetId.value, item.id)

    // ApiResponse wraps data in { data: { starred: bool } }
    const newStarredStatus = result?.data?.starred ?? result?.starred ?? false

    // Directly mutate the property to preserve the object reference
    const mediaItem = mediaItems.value.find(m => m.id === item.id)
    if (mediaItem) {
      mediaItem.isStarred = newStarredStatus
    }

    // Update in selectedMediaForView if it's there
    const viewItem = selectedMediaForView.value.find(m => m.id === item.id)
    if (viewItem) {
      viewItem.isStarred = newStarredStatus
    }

    // Also update the item prop directly (it's the same reference from sortedMediaItems)
    if (item) {
      item.isStarred = newStarredStatus
    }

    // Add to action history for undo
    if (oldStarredStatus !== newStarredStatus) {
      actionHistory.addAction({
        type: 'star',
        description: `${newStarredStatus ? 'Starred' : 'Unstarred'} "${item.file?.filename || item.filename || 'media'}"`,
        undo: async () => {
          try {
            const result = await selectionsApi.starMedia(
              selection.value.id,
              selectedSetId.value,
              item.id
            )
            const mediaItem = mediaItems.value.find(m => m.id === item.id)
            if (mediaItem) {
              mediaItem.isStarred = oldStarredStatus
            }
            if (item) {
              item.isStarred = oldStarredStatus
            }
          } catch (error) {}
        },
        redo: async () => {
          try {
            const result = await selectionsApi.starMedia(
              selection.value.id,
              selectedSetId.value,
              item.id
            )
            const mediaItem = mediaItems.value.find(m => m.id === item.id)
            if (mediaItem) {
              mediaItem.isStarred = newStarredStatus
            }
            if (item) {
              item.isStarred = newStarredStatus
            }
          } catch (error) {}
        },
      })
    }
  } catch (error) {
    toast.error('Failed to star media', {
      description:
        error instanceof Error ? error.message : 'An error occurred while starring the media.',
    })
  }
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
    toast.error('Failed to copy', {
      description: error instanceof Error ? error.message : 'Could not copy to clipboard',
    })
  }
}

// Use selection actions composable
const selectionId = computed(() => selection.value?.id)
const { copyFilenames, resetSelectionLimit, isCopyingFilenames, isResettingLimit } =
  useSelectionActions(selectionId)

// Use media watermark actions composable
const {
  handleWatermarkMedia: handleWatermarkMediaFromComposable,
  handleCancelWatermarkMedia: handleCancelWatermarkMediaFromComposable,
  handleConfirmWatermarkMedia: handleConfirmWatermarkMediaFromComposable,
  handleRemoveWatermark: handleRemoveWatermarkFromComposable,
} = useMediaWatermarkActions({
  showWatermarkMediaModal,
  mediaToWatermark,
  selectedWatermarkForMedia,
  selectedWatermark: computed(() => selection.value?.watermarkId || 'none'),
  isApplyingWatermark,
  watermarkStore,
  mediaApi: null,
  selectionsApi,
  selectionId,
  setId: selectedSetId,
  mediaItems,
  applyWatermarkToImage: null,
  description: '',
  reloadMedia: loadMediaItems,
  showRemoveWatermarkLoading,
})

// Use selection progress composable
const {
  overallProgress: overallProgressFromComposable,
  setsProgress,
  getSetProgress,
} = useSelectionProgress(
  () => mediaItems.value,
  () => mediaSets.value
)

// Override overallProgress for completed selections to use selection's stored counts
const overallProgress = computed(() => {
  // For completed selections, use the selection's stored counts (stable values)
  if (selection.value?.status === 'completed') {
    // Try different property names that might come from the backend
    const selected =
      selection.value.selected_count ||
      selection.value.selectedCount ||
      selection.value.selectedMediaCount ||
      0
    const total = selection.value.media_count || selection.value.mediaCount || 0
    const percentage = total > 0 ? Math.round((selected / total) * 100) : 0

    return {
      selected,
      total,
      percentage,
    }
  }

  // For active/draft selections, use the composable's progress
  return overallProgressFromComposable.value
})

// Create a computed object for set progress (for easy lookup)
const setProgressMap = computed(() => {
  const map = {}
  if (mediaSets.value && mediaItems.value) {
    mediaSets.value.forEach(set => {
      map[set.id] = getSetProgress(set.id)
    })
  }
  return map
})

// Count of items with isSelected: true in current set
const selectedCountInCurrentSet = computed(() => {
  if (!selectedSetId.value) return 0
  return sortedMediaItems.value.filter(item => item.isSelected === true).length
})

// Count of items with isSelected: true across entire selection
// Use selection's stored count from backend for accuracy (includes all sets, not just loaded ones)
const selectedCountAcrossSelection = computed(() => {
  // For completed selections, use the selection's stored count
  if (selection.value?.status === 'completed') {
    return (
      selection.value.selected_count ||
      selection.value.selectedCount ||
      selection.value.selectedMediaCount ||
      0
    )
  }

  // For active/draft selections, count from loaded media items
  return mediaItems.value.filter(item => item.isSelected === true).length
})

const handleBulkCopyFilenames = async () => {
  if (selectedMediaIds.value.size === 0) {
    toast.info('No items selected', {
      description: 'Please select some media items to copy filenames.',
    })
    return
  }

  try {
    const selectedItems = sortedMediaItems.value.filter(item =>
      selectedMediaIds.value.has(getItemId(item))
    )

    // Extract filenames from selected items
    const filenames = selectedItems.map(item => {
      return item?.file?.filename || item?.filename || item?.title || 'untitled.jpg'
    })

    // Join with comma and space
    const filenamesText = filenames.join(', ')

    // Copy to clipboard
    await navigator.clipboard.writeText(filenamesText)

    toast.success('Filenames copied', {
      description: `${filenames.length} filename(s) copied to clipboard.`,
    })
  } catch (error) {
    toast.error('Failed to copy filenames', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

// Copy filenames of items with isSelected: true in a specific set
const handleCopySelectedFilenamesInSet = async setId => {
  if (!setId) return

  // For completed selections, use the backend API to get selected filenames for the set
  if (selection.value?.status === 'completed') {
    try {
      const result = await selectionsApi.getSelectedFilenames(selection.value.id, setId)
      const filenames = result.filenames || []

      if (filenames.length === 0) {
        toast.info('No selected items', {
          description: 'No items with selected status in this set.',
        })
        return
      }

      // Copy to clipboard (join with comma and space for consistency)
      const filenamesText = filenames.join(', ')
      await navigator.clipboard.writeText(filenamesText)

      toast.success('Filenames copied', {
        description: `${filenames.length} selected filename(s) from this set copied to clipboard.`,
      })
    } catch (error) {
      toast.error('Failed to copy filenames', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
    return
  }

  // For active/draft selections, use loaded media items
  const setItems = mediaItems.value.filter(item => item.setId === setId)
  const selectedItems = setItems.filter(item => item.isSelected === true)

  if (selectedItems.length === 0) {
    toast.info('No selected items', {
      description: 'No items with selected status in this set.',
    })
    return
  }

  try {
    const filenames = selectedItems.map(item => {
      return item?.file?.filename || item?.filename || item?.title || 'untitled.jpg'
    })

    const filenamesText = filenames.join(', ')
    await navigator.clipboard.writeText(filenamesText)

    toast.success('Filenames copied', {
      description: `${filenames.length} selected filename(s) from this set copied to clipboard.`,
    })
  } catch (error) {
    toast.error('Failed to copy filenames', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

// Copy filenames of all items with isSelected: true across the entire selection
const handleCopyAllSelectedFilenames = async () => {
  // For completed selections, use the backend API to get all selected filenames across all sets
  if (selection.value?.status === 'completed') {
    try {
      const result = await selectionsApi.getSelectedFilenames(selection.value.id, null)
      const filenames = result.filenames || []

      if (filenames.length === 0) {
        toast.info('No selected items', {
          description: 'No items with selected status in this selection.',
        })
        return
      }

      // Copy to clipboard (join with comma and space for consistency)
      const filenamesText = filenames.join(', ')
      await navigator.clipboard.writeText(filenamesText)

      toast.success('Filenames copied', {
        description: `${filenames.length} selected filename(s) across all sets copied to clipboard.`,
      })
    } catch (error) {
      toast.error('Failed to copy filenames', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
    return
  }

  // For active/draft selections, use loaded media items
  const selectedItems = mediaItems.value.filter(item => item.isSelected === true)

  if (selectedItems.length === 0) {
    toast.info('No selected items', {
      description: 'No items with selected status in this selection.',
    })
    return
  }

  try {
    const filenames = selectedItems.map(item => {
      return item?.file?.filename || item?.filename || item?.title || 'untitled.jpg'
    })

    const filenamesText = filenames.join(', ')
    await navigator.clipboard.writeText(filenamesText)

    toast.success('Filenames copied', {
      description: `${filenames.length} selected filename(s) across all sets copied to clipboard.`,
    })
  } catch (error) {
    toast.error('Failed to copy filenames', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

// Handle copy filenames per set
const handleCopyFilenamesPerSet = async setId => {
  await copyFilenames(setId)
}

// Handle reset selection limit
const handleResetSelectionLimit = async () => {
  try {
    const updatedSelection = await resetSelectionLimit()
    if (updatedSelection) {
      selection.value = updatedSelection
    }
  } catch (error) {
    // Error is already handled in composable
  }
}

// Selection limit modals state
const showSelectionLimitModal = ref(false)
const isSavingSelectionLimit = ref(false)

// Handle selection limit modal
const handleOpenSelectionLimitModal = () => {
  showSelectionLimitModal.value = true
}

const handleSaveSelectionLimit = async limit => {
  if (!selection.value?.id) return

  isSavingSelectionLimit.value = true
  try {
    const updatedSelection = await selectionsApi.updateSelection(selection.value.id, {
      selectionLimit: limit,
    })
    selection.value = updatedSelection
    showSelectionLimitModal.value = false
  } catch (error) {
    toast.error('Failed to update selection limit', {
      description: error?.message || 'An unknown error occurred',
    })
  } finally {
    isSavingSelectionLimit.value = false
  }
}

const handleCancelSelectionLimit = () => {
  showSelectionLimitModal.value = false
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
    availableSelections.value = []
  } finally {
    isLoadingSelections.value = false
  }
}

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
    targetSelectionSets.value = []
    toast.error('Failed to load sets', {
      description: 'Unable to load sets for the selected selection.',
    })
  } finally {
    isLoadingTargetSets.value = false
  }
}

const handleCancelMoveCopy = () => {
  showMoveCopyModal.value = false
  targetSelectionId.value = selection.value?.id || ''
  targetSetId.value = ''
  targetSelectionSets.value = []
  moveCopyAction.value = 'move'
}

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
    toast.error(`Failed to ${moveCopyAction.value} media`, {
      description: error instanceof Error ? error.message : 'An unknown error occurred.',
    })
  } finally {
    isMovingMedia.value = false
  }
}

const handleToggleMediaSelection = id => {
  // Normalize ID to string
  const normalizedId = id ? String(id) : ''
  if (!normalizedId) return

  // Create a new Set to trigger reactivity
  const newSet = new Set(selectedMediaIds.value)
  if (newSet.has(normalizedId)) {
    newSet.delete(normalizedId)
  } else {
    newSet.add(normalizedId)
  }
  selectedMediaIds.value = newSet
}

// Helper to get item ID (handles both id and uuid, always returns string)
const getItemId = item => {
  if (!item) return ''
  const id = item.id ?? item.uuid
  return id ? String(id) : ''
}

const handleToggleSelectAll = () => {
  const newSet = new Set(selectedMediaIds.value)
  if (newSet.size === sortedMediaItems.value.length) {
    newSet.clear()
  } else {
    sortedMediaItems.value.forEach(item => {
      newSet.add(getItemId(item))
    })
  }
  selectedMediaIds.value = newSet
}

const handleBulkDelete = () => {
  if (selectedMediaIds.value.size === 0) {
    return
  }
  showBulkDeleteModal.value = true
}

const handleConfirmBulkDelete = async () => {
  if (selectedMediaIds.value.size === 0 || !selection.value?.id || !selectedSetId.value) {
    showBulkDeleteModal.value = false
    return
  }

  const idsToDelete = Array.from(selectedMediaIds.value)
  const count = idsToDelete.length
  const deletedItems = []

  isBulkDeleteLoading.value = true
  try {
    let successCount = 0
    let errorCount = 0

    for (const mediaId of idsToDelete) {
      try {
        const item = mediaItems.value.find(m => m.id === mediaId)
        if (!item) continue

        await selectionsApi.deleteMedia(selection.value.id, selectedSetId.value, mediaId)

        // Store item data for undo
        deletedItems.push({
          ...item,
          originalIndex: mediaItems.value.findIndex(m => m.id === mediaId),
        })

        // Remove from local array
        const index = mediaItems.value.findIndex(m => m.id === mediaId)
        if (index !== -1) {
          mediaItems.value.splice(index, 1)
        }

        // Remove from selection
        selectedMediaIds.value.delete(mediaId)
        successCount++
      } catch (error) {
        errorCount++
      }
    }

    // Reload media sets to update counts
    await mediaSetsSidebar.loadMediaSets()

    // Add to action history for undo
    if (successCount > 0 && deletedItems.length > 0) {
      actionHistory.addAction({
        type: 'bulk-delete',
        description: `Deleted ${successCount} item${successCount > 1 ? 's' : ''}`,
        undo: async () => {
          // Re-upload deleted items (this is complex - would need to restore from backend)
          // For now, we'll just show a message that undo isn't fully supported for deletes
          toast.info('Undo not available', {
            description: 'Deleted items cannot be restored. Please re-upload if needed.',
          })
        },
        redo: async () => {
          // Re-delete items
          for (const item of deletedItems) {
            try {
              await selectionsApi.deleteMedia(selection.value.id, selectedSetId.value, item.id)
              const index = mediaItems.value.findIndex(m => m.id === item.id)
              if (index !== -1) {
                mediaItems.value.splice(index, 1)
              }
              selectedMediaIds.value.delete(item.id)
            } catch (error) {}
          }
          await mediaSetsSidebar.loadMediaSets()
        },
      })
    }

    // Show appropriate toast based on results
    if (errorCount === 0) {
      toast.success('Media deleted', {
        description: `${successCount} item${successCount > 1 ? 's' : ''} deleted successfully.`,
        action: getUndoAction(),
      })
    } else if (successCount > 0) {
      toast.warning('Partial deletion', {
        description: `${successCount} item${successCount > 1 ? 's' : ''} deleted, ${errorCount} failed.`,
      })
    } else {
      toast.error('Failed to delete media', {
        description: `Failed to delete ${errorCount} item${errorCount > 1 ? 's' : ''}.`,
      })
    }

    showBulkDeleteModal.value = false
  } catch (error) {
    toast.error('Failed to delete media', {
      description:
        error instanceof Error ? error.message : 'An error occurred while deleting media.',
    })
  } finally {
    isBulkDeleteLoading.value = false
  }
}

const handleBulkFavorite = async () => {
  if (selectedMediaIds.value.size === 0 || !selection.value?.id || !selectedSetId.value) {
    return
  }

  const ids = Array.from(selectedMediaIds.value)
  const items = mediaItems.value.filter(m => ids.includes(m.id))

  // Determine if we should star or unstar based on current state
  // If all selected items are starred, unstar them; otherwise, star them
  const allStarred = items.every(item => item.isStarred)
  const targetStarred = !allStarred
  const starOperations = []

  isBulkFavoriteLoading.value = true
  try {
    let successCount = 0
    let errorCount = 0

    for (const item of items) {
      try {
        // Only toggle if the current state doesn't match the target state
        if (item.isStarred !== targetStarred) {
          const oldStarredStatus = item.isStarred
          const result = await selectionsApi.starMedia(
            selection.value.id,
            selectedSetId.value,
            item.id
          )
          const newStarredStatus = result?.data?.starred ?? result?.starred ?? false

          // Store operation for undo
          starOperations.push({
            itemId: item.id,
            oldStarred: oldStarredStatus,
            newStarred: newStarredStatus,
          })

          const mediaItem = mediaItems.value.find(m => m.id === item.id)
          if (mediaItem) {
            mediaItem.isStarred = newStarredStatus
          }

          if (newStarredStatus === targetStarred) {
            successCount++
          }
        } else {
          // Already in the target state, count as success
          successCount++
        }
      } catch (error) {
        errorCount++
      }
    }

    // Add to action history for undo
    if (successCount > 0 && starOperations.length > 0) {
      actionHistory.addAction({
        type: 'bulk-star',
        description: `${targetStarred ? 'Starred' : 'Unstarred'} ${successCount} item${successCount > 1 ? 's' : ''}`,
        undo: async () => {
          for (const op of starOperations) {
            try {
              // Toggle back to original state
              if (op.newStarred !== op.oldStarred) {
                const result = await selectionsApi.starMedia(
                  selection.value.id,
                  selectedSetId.value,
                  op.itemId
                )
                const mediaItem = mediaItems.value.find(m => m.id === op.itemId)
                if (mediaItem) {
                  mediaItem.isStarred = op.oldStarred
                }
              }
            } catch (error) {}
          }
        },
        redo: async () => {
          for (const op of starOperations) {
            try {
              // Toggle back to new state
              if (op.newStarred !== op.oldStarred) {
                const result = await selectionsApi.starMedia(
                  selection.value.id,
                  selectedSetId.value,
                  op.itemId
                )
                const mediaItem = mediaItems.value.find(m => m.id === op.itemId)
                if (mediaItem) {
                  mediaItem.isStarred = op.newStarred
                }
              }
            } catch (error) {}
          }
        },
      })
    }

    if (errorCount === 0) {
      toast.success(targetStarred ? 'Media starred' : 'Media unstarred', {
        description: `${successCount} item${successCount > 1 ? 's' : ''} ${targetStarred ? 'starred' : 'unstarred'} successfully. You can undo this action.`,
        action: getUndoAction(),
        duration: 5000,
      })
    } else if (successCount > 0) {
      toast.warning('Partial success', {
        description: `${successCount} item${successCount > 1 ? 's' : ''} updated, ${errorCount} failed.`,
      })
    } else {
      toast.error('Failed to update media', {
        description: `Failed to ${targetStarred ? 'star' : 'unstar'} ${errorCount} item${errorCount > 1 ? 's' : ''}.`,
      })
    }
  } catch (error) {
    toast.error('Failed to update media', {
      description:
        error instanceof Error ? error.message : 'An error occurred while updating media.',
    })
  } finally {
    isBulkFavoriteLoading.value = false
  }
}

const handleSetAsCover = async item => {
  if (!selection.value?.id || !item?.id || isUpdatingCoverPhoto.value) return

  const isVideo = item.type === 'video' || item.file?.type === 'video'

  if (isVideo) {
    // For videos, set cover directly without focal point
    const coverUrl = item.file?.url || item.url
    if (!coverUrl) {
      toast.error('Invalid media', {
        description: 'Media does not have a valid URL.',
      })
      return
    }

    isUpdatingCoverPhoto.value = true
    try {
      await selectionsApi.setCoverPhotoFromMedia(selection.value.id, item.id)

      if (selection.value) {
        selection.value.coverPhotoUrl = coverUrl
        selection.value.cover_photo_url = coverUrl
        selection.value = { ...selection.value }
      }

      toast.success('Cover photo updated', {
        description: 'The cover photo has been set successfully.',
      })
    } catch (error) {
      toast.error('Failed to set cover photo', {
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while setting the cover photo.',
      })
    } finally {
      isUpdatingCoverPhoto.value = false
    }
    return
  }

  // For images, open focal point modal
  const coverUrl = item.thumbnailUrl || item.file?.variants?.thumb || item.file?.url || null
  if (!coverUrl) {
    toast.error('Invalid media', {
      description: 'Media does not have a valid URL.',
    })
    return
  }

  const existingFocalPoint = selection.value?.coverFocalPoint ||
    selection.value?.cover_focal_point || { x: 50, y: 50 }

  selectedMediaForCover.value = item
  focalPointImageUrl.value = coverUrl
  currentFocalPoint.value = existingFocalPoint
  showFocalPointModal.value = true
}

const handleFocalPointConfirm = async focalPoint => {
  if (!selection.value?.id || !selectedMediaForCover.value?.id || isUpdatingCoverPhoto.value) return

  isUpdatingCoverPhoto.value = true

  try {
    await selectionsApi.setCoverPhotoFromMedia(
      selection.value.id,
      selectedMediaForCover.value.id,
      focalPoint
    )

    if (selection.value) {
      const coverUrl = focalPointImageUrl.value
      selection.value.coverPhotoUrl = coverUrl
      selection.value.cover_photo_url = coverUrl
      selection.value.coverFocalPoint = focalPoint
      selection.value.cover_focal_point = focalPoint
      // Force reactivity
      selection.value = { ...selection.value }
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

const handleBulkView = () => {
  if (selectedMediaIds.value.size === 0) {
    toast.info('No items selected', {
      description: 'Please select some media items to view.',
    })
    return
  }

  const ids = Array.from(selectedMediaIds.value)
  const items = mediaItems.value.filter(m => ids.includes(m.id))
  const imageItems = items.filter(item => {
    const itemType = item.type || item.file?.type
    return itemType === 'image'
  })

  if (imageItems.length === 0) {
    toast.info('No images to view', {
      description:
        'The selected items do not contain any images. Only images can be viewed in the lightbox.',
    })
    return
  }

  selectedMediaForView.value = imageItems
  currentViewIndex.value = 0
  showMediaViewer.value = true

  // Use nextTick to ensure the component has updated
  nextTick(() => {})
}

const handleBulkEdit = () => {
  if (selectedMediaIds.value.size === 0) {
    return
  }
  editAppendText.value = ''
  showEditModal.value = true
}

const handleCancelEdit = () => {
  showEditModal.value = false
  editAppendText.value = ''
}

const handleConfirmEdit = async () => {
  if (
    selectedMediaIds.value.size === 0 ||
    !editAppendText.value.trim() ||
    !selection.value?.id ||
    !selectedSetId.value
  ) {
    return
  }

  const ids = Array.from(selectedMediaIds.value)
  const appendText = editAppendText.value.trim()
  const items = mediaItems.value.filter(m => ids.includes(m.id))
  const renameOperations = []

  isBulkEditLoading.value = true
  try {
    let successCount = 0
    let errorCount = 0

    for (const item of items) {
      try {
        const currentFilename =
          item.file?.filename || item.filename || item.title || `media-${item.id}`

        // Extract extension
        const lastDotIndex = currentFilename.lastIndexOf('.')
        let nameWithoutExt = currentFilename
        let extension = ''

        if (lastDotIndex > 0) {
          // Has extension
          nameWithoutExt = currentFilename.substring(0, lastDotIndex)
          extension = currentFilename.substring(lastDotIndex)
        }

        // Append text before extension
        const newFilename = nameWithoutExt + appendText + extension

        // Call rename API
        await selectionsApi.renameMedia(
          selection.value.id,
          selectedSetId.value,
          item.id,
          newFilename
        )

        // Store operation for undo
        renameOperations.push({
          itemId: item.id,
          oldFilename: currentFilename,
          newFilename,
        })

        const mediaItem = mediaItems.value.find(m => m.id === item.id)
        if (mediaItem) {
          if (mediaItem.file) {
            mediaItem.file.filename = newFilename
          } else {
            mediaItem.filename = newFilename
          }
        }

        successCount++
      } catch (error) {
        errorCount++
      }
    }

    // Add to action history for undo
    if (successCount > 0 && renameOperations.length > 0) {
      actionHistory.addAction({
        type: 'bulk-rename',
        description: `Renamed ${successCount} item${successCount > 1 ? 's' : ''} (append: "${appendText}")`,
        undo: async () => {
          for (const op of renameOperations) {
            try {
              await selectionsApi.renameMedia(
                selection.value.id,
                selectedSetId.value,
                op.itemId,
                op.oldFilename
              )
              const mediaItem = mediaItems.value.find(m => m.id === op.itemId)
              if (mediaItem) {
                if (mediaItem.file) {
                  mediaItem.file.filename = op.oldFilename
                } else {
                  mediaItem.filename = op.oldFilename
                }
              }
            } catch (error) {}
          }
        },
        redo: async () => {
          for (const op of renameOperations) {
            try {
              await selectionsApi.renameMedia(
                selection.value.id,
                selectedSetId.value,
                op.itemId,
                op.newFilename
              )
              const mediaItem = mediaItems.value.find(m => m.id === op.itemId)
              if (mediaItem) {
                if (mediaItem.file) {
                  mediaItem.file.filename = op.newFilename
                } else {
                  mediaItem.filename = op.newFilename
                }
              }
            } catch (error) {}
          }
        },
      })
    }

    // Show appropriate toast based on results
    if (errorCount === 0) {
      toast.success('Filenames updated', {
        description: `${successCount} item${successCount > 1 ? 's' : ''} updated successfully. You can undo this action.`,
        action: getUndoAction(),
        duration: 5000,
      })
    } else if (successCount > 0) {
      toast.warning('Partial update', {
        description: `${successCount} item${successCount > 1 ? 's' : ''} updated, ${errorCount} failed.`,
      })
    } else {
      toast.error('Failed to update filenames', {
        description: `Failed to update ${errorCount} item${errorCount > 1 ? 's' : ''}.`,
      })
    }

    showEditModal.value = false
    editAppendText.value = ''
  } catch (error) {
    toast.error('Failed to update filenames', {
      description:
        error instanceof Error ? error.message : 'An error occurred while updating filenames.',
    })
  } finally {
    isBulkEditLoading.value = false
  }
}

const handleBulkWatermark = () => {
  showBulkWatermarkModal.value = true
}

const handleCancelBulkWatermark = () => {
  if (isBulkWatermarkLoading.value) {
    // Cancel operation in progress
    isBulkWatermarkCancelled.value = true
  } else {
    showBulkWatermarkModal.value = false
    selectedBulkWatermark.value = 'none'
  }
}

const handleConfirmBulkWatermark = async () => {
  if (!selectedBulkWatermark.value || selectedBulkWatermark.value === 'none') {
    toast.error('Please select a watermark', { description: '' })
    return
  }
  
  isBulkWatermarkLoading.value = true
  bulkWatermarkProgress.value = { current: 0, total: 0, percentage: 0, currentItem: null }
  isBulkWatermarkCancelled.value = false
  
  try {
    const ids = Array.from(selectedMediaIds.value)
    const items = mediaItems.value.filter(m => ids.includes(m.id))
    const imageItems = items.filter(item => item.type === 'image')
    
    if (imageItems.length === 0) {
      toast.error('No images selected', { description: '' })
      return
    }
    
    const watermark = await watermarkStore.fetchWatermark(selectedBulkWatermark.value)
    const totalItems = imageItems.length
    
    bulkWatermarkProgress.value = {
      current: 0,
      total: totalItems,
      percentage: 0,
      currentItem: null,
    }
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < imageItems.length; i++) {
      if (isBulkWatermarkCancelled.value) {
        break
      }
      
      const item = imageItems[i]
      bulkWatermarkProgress.value = {
        current: i,
        total: totalItems,
        percentage: Math.round((i / totalItems) * 100),
        currentItem: item.file?.filename || item.filename || `Item ${i + 1}`,
      }
      
      try {
        const selectionIdValue = selection.value?.id
        const setIdValue = selectedSetId.value
        
        if (selectionsApi && selectionsApi.applyWatermarkToMedia) {
          await selectionsApi.applyWatermarkToMedia(selectionIdValue, setIdValue, item.id, selectedBulkWatermark.value)
          successCount++
        } else {
          errorCount++
        }
      } catch (error) {
        errorCount++
      }
    }
    
    bulkWatermarkProgress.value = {
      current: totalItems,
      total: totalItems,
      percentage: 100,
      currentItem: null,
    }
    
    showBulkWatermarkModal.value = false
    selectedBulkWatermark.value = 'none'
    
    if (isBulkWatermarkCancelled.value) {
      toast.info('Watermark operation cancelled', {
        description: `${successCount} of ${totalItems} items processed.`,
      })
    } else if (errorCount > 0) {
      toast.warning('Watermark applied with errors', {
        description: `${successCount} succeeded, ${errorCount} failed.`,
      })
    } else {
      toast.success('Watermark applied', {
        description: `Successfully applied to ${successCount} item${successCount !== 1 ? 's' : ''}.`,
      })
    }
    
    await loadMediaItems()
  } catch (error) {
    toast.error('Failed to apply watermark', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  } finally {
    isBulkWatermarkLoading.value = false
    bulkWatermarkProgress.value = null
  }
}

const watermarks = computed(() => watermarkStore.watermarks)

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

    const updatedFilename = result?.data?.filename || result?.filename || finalFilename
    const index = mediaItems.value.findIndex(m => m.id === mediaToRename.value?.id)
    if (index !== -1) {
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

    // Add to action history for undo
    actionHistory.addAction({
      type: 'rename',
      description: `Renamed "${originalFilename}" to "${updatedFilename}"`,
      undo: async () => {
        try {
          const result = await selectionsApi.renameMedia(
            selection.value.id,
            selectedSetId.value,
            mediaToRename.value.id,
            originalFilename
          )
          const index = mediaItems.value.findIndex(m => m.id === mediaToRename.value?.id)
          if (index !== -1) {
            if (mediaItems.value[index].file) {
              mediaItems.value[index].file.filename = originalFilename
            } else {
              mediaItems.value[index].file = { filename: originalFilename }
            }
            mediaItems.value[index].filename = originalFilename
            mediaItems.value = [...mediaItems.value]
          }
        } catch (error) {}
      },
      redo: async () => {
        try {
          const result = await selectionsApi.renameMedia(
            selection.value.id,
            selectedSetId.value,
            mediaToRename.value.id,
            updatedFilename
          )
          const index = mediaItems.value.findIndex(m => m.id === mediaToRename.value?.id)
          if (index !== -1) {
            if (mediaItems.value[index].file) {
              mediaItems.value[index].file.filename = updatedFilename
            } else {
              mediaItems.value[index].file = { filename: updatedFilename }
            }
            mediaItems.value[index].filename = updatedFilename
            mediaItems.value = [...mediaItems.value]
          }
        } catch (error) {}
      },
    })

    toast.success('Media renamed', {
      description: 'The filename has been updated successfully. You can undo this action.',
      action: getUndoAction(),
      duration: 5000,
    })

    handleCancelRenameMedia()
  } catch (error) {
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

const handleConfirmDeleteItem = async () => {
  if (!itemToDelete.value || isDeleting.value) return

  const item = itemToDelete.value

  if (item.collectionId || item.setId || item.id) {
    // It's a MediaItem
    isDeleting.value = true

    try {
      const itemData = { ...item }
      const originalIndex = mediaItems.value.findIndex(m => m.id === item.id)

      // Use the selections API delete function
      await selectionsApi.deleteMedia(selection.value.id, selectedSetId.value, item.id)

      // Remove from local array
      const index = mediaItems.value.findIndex(m => m.id === item.id)
      if (index !== -1) {
        mediaItems.value.splice(index, 1)
        // Force reactivity
        mediaItems.value = [...mediaItems.value]
      }

      // Remove from selection if selected
      selectedMediaIds.value.delete(item.id)

      // Reload media sets to update counts
      await mediaSetsSidebar.loadMediaSets()

      // Add to action history for undo
      actionHistory.addAction({
        type: 'delete',
        description: `Deleted "${itemData.file?.filename || itemData.filename || 'media'}"`,
        undo: async () => {
          toast.info('Undo not available', {
            description: 'Deleted items cannot be restored. Please re-upload if needed.',
          })
        },
        redo: async () => {
          // Re-delete
          try {
            await selectionsApi.deleteMedia(selection.value.id, selectedSetId.value, item.id)
            const index = mediaItems.value.findIndex(m => m.id === item.id)
            if (index !== -1) {
              mediaItems.value.splice(index, 1)
            }
            selectedMediaIds.value.delete(item.id)
            await mediaSetsSidebar.loadMediaSets()
          } catch (error) {}
        },
      })

      toast.success('Media deleted', {
        description: 'The media item has been deleted successfully. You can undo this action.',
        action: getUndoAction(),
        duration: 5000,
      })

      closeDeleteModal()
    } catch (error) {
      toast.error('Failed to delete media', {
        description:
          error instanceof Error ? error.message : 'An error occurred while deleting the media.',
      })
    } finally {
      isDeleting.value = false
    }
  } else {
    // It's a MediaSet - this should be handled elsewhere
    closeDeleteModal()
  }
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
    toast.error('Failed to replace photo', {
      description:
        error instanceof Error ? error.message : 'An error occurred while replacing the photo.',
    })
  } finally {
    isReplacingPhoto.value = false
  }
}

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
  if (selection.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed selection.',
    })
    return
  }
  triggerFileInputClick(fileInputRef.value)
}

const handleBrowseFiles = () => {
  if (selection.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed selection.',
    })
    return
  }
  triggerFileInputClick(fileInputRef.value)
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

// Remove local definitions - use from workflow instead
// Local refs that sync with workflow state (for backward compatibility)
const isUploading = computed(() => isUploadingFromWorkflow.value)
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

const handleFileSelect = async event => {
  const files = Array.from(event.target.files || [])
  if (files.length === 0) return

  if (selection.value?.status === 'completed') {
    event.target.value = ''
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed selection.',
    })
    return
  }

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
    } else {
    }
  } catch (error) {
  } finally {
    isProcessingFiles.value = false
  }
}

const handleDragOver = e => {
  if (selection.value?.status === 'completed') {
    return
  }
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

  if (selection.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed selection.',
    })
    return
  }

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
    } else {
    }
  } catch (error) {
  } finally {
    isProcessingFiles.value = false
  }
}

const handleRetryUpload = async (fileId, retryFn) => {
  if (!retryFn || typeof retryFn !== 'function') {
    toast.error('Retry failed', {
      description: 'Invalid retry function.',
    })
    return
  }

  if (!selection.value?.id || !selectedSetId.value) {
    toast.error('Invalid context', {
      description: 'Selection or set not found.',
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

    // Don't remove from errors array here - let the retry function handle it
    // This allows multiple retries if the first one fails

    // Call the retry function which will re-upload the file
    await retryFn()

    // Reload media items after successful retry
    await loadMediaItems()

    toast.success('Upload retried', {
      description: 'The file upload has been retried successfully.',
    })
  } catch (error) {
    // The error is already updated in the errors array by the retry function
    toast.error('Retry failed', {
      description:
        error instanceof Error ? error.message : 'An error occurred while retrying the upload.',
    })
  }
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
