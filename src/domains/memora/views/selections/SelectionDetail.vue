<template>
  <!-- Settings View -->
  <SelectionSettingsGeneral
    v-if="route.query?.tab === 'settings' && route.query?.section === 'general'"
  />

  <!-- Default Photos View -->
  <SelectionLayout
    v-else
    :is-copying-filenames="isCopyingFilenames"
    :is-loading="isLoading || isUpdatingCoverPhoto"
    :is-resetting-limit="isResettingLimit"
    :on-copy-all-selected-filenames="handleCopyAllSelectedFilenames"
    :on-copy-filenames-per-set="handleCopyFilenamesPerSet"
    :on-copy-selected-filenames-in-set="handleCopySelectedFilenamesInSet"
    :on-reset-limit="handleResetSelectionLimit"
    :overall-progress="overallProgress"
    :selected-count="selectedCountAcrossSelection"
    :selection="selection"
    :set-progress="setProgressMap"
    @go-back="goBack"
  >
    <template #content>
      <input
        ref="fileInputRef"
        :disabled="selection?.status === 'completed'"
        accept="image/*,video/*"
        class="hidden"
        multiple
        type="file"
        @change="handleFileSelect"
      />

      <!-- Main Content Area -->
      <main
        :class="isDragging ? 'ring-4 ring-accent/20' : ''"
        class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-all duration-300 relative"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        @dragover.prevent="handleDragOver"
      >
        <!-- Drag overlay when dragging files -->
        <div
          v-if="isDragging && selectedSetId"
          class="absolute inset-0 z-50 border-4 border-dashed border-accent rounded-lg flex items-center justify-center pointer-events-none bg-accent/10"
        >
          <div class="text-center space-y-4">
            <div class="p-6 rounded-full bg-accent/20">
              <ImagePlus class="h-16 w-16 mx-auto text-accent" />
            </div>
            <p class="text-2xl font-bold text-accent">Drop files here to upload</p>
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
            :disable-upload="selection?.status === 'completed'"
            :is-uploading="isUploading"
            :on-copy-selected-filenames-in-set="
              () => handleCopySelectedFilenamesInSet(selectedSetId)
            "
            :selected-count="selectedCountInCurrentSet"
            :selection-status="selection?.status"
            :title="selectedSet?.name || 'All Media'"
            :total-items="sortedMediaItems.length"
            @toggle-select-all="handleToggleSelectAll"
            @add-media="handleAddMedia"
          />

          <!-- Bulk Actions Bar -->
          <BulkActionsBar
            v-if="selectedSetId"
            :disable-actions="selection?.status === 'completed'"
            :is-all-selected="selectedMediaIds.size === sortedMediaItems.length"
            :is-favorite-loading="isBulkFavoriteLoading"
            :selected-count="selectedMediaIds.size"
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
                :item="item"
                :placeholder-image="placeholderImage"
                :selection-status="selection?.status"
                :show-filename="showFilename"
                :show-management-actions="selection?.status !== 'completed'"
                :was-selected-on-completion="
                  selection?.status === 'completed' ? item.isSelected : false
                "
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
                @toggle-featured="handleToggleFeatured(item)"
                @toggle-recommended="handleToggleRecommended(item)"
                phase="selection"
              />
            </TransitionGroup>
            <TransitionGroup v-else class="space-y-2" name="media-list" tag="div">
              <MediaListItemRow
                v-for="item in sortedMediaItems"
                :key="item.id"
                :is-selected="selectedMediaIds.has(getItemId(item))"
                :item="item"
                :placeholder-image="placeholderImage"
                :selection-status="selection?.status"
                :show-filename="showFilename"
                :show-management-actions="selection?.status !== 'completed'"
                :subtitle="formatMediaDate(item.createdAt)"
                :was-selected-on-completion="
                  selection?.status === 'completed' ? item.isSelected : false
                "
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
                @toggle-featured="handleToggleFeatured(item)"
                @toggle-recommended="handleToggleRecommended(item)"
                phase="selection"
              />
            </TransitionGroup>

            <!-- Pagination -->
            <Pagination
              v-if="mediaPagination.totalPages > 1 || mediaPagination.total > 0"
              :current-page="mediaPagination.page"
              :limit="mediaPagination.limit"
              :show-page-size="true"
              :total="mediaPagination.total"
              :total-pages="mediaPagination.totalPages"
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
              :action-class="'text-white transition-colors'"
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
        :description="getDeleteModalDescription()"
        :is-deleting="isDeleting"
        :item-name="getItemName(itemToDelete)"
        :title="getDeleteModalTitle()"
        :warning-message="getDeleteModalWarning()"
        @cancel="closeDeleteModal"
        @confirm="handleConfirmDeleteItem"
      />

      <!-- Selection Limit Modal -->
      <SelectionLimitModal
        v-model="showSelectionLimitModal"
        :current-limit="selection?.selectionLimit"
        :is-saving="isSavingSelectionLimit"
        @cancel="handleCancelSelectionLimit"
        @save="handleSaveSelectionLimit"
      />

      <!-- Bulk Delete Confirmation Modal -->
      <DeleteConfirmationModal
        v-model="showBulkDeleteModal"
        :is-deleting="isBulkDeleteLoading"
        :item-name="`${selectedMediaIds.size} item${selectedMediaIds.size > 1 ? 's' : ''}`"
        :warning-message="getBulkDeleteModalWarning()"
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
        :progress="bulkWatermarkProgress"
        :selected-count="selectedMediaIds.size"
        :watermarks="watermarks"
        @cancel="handleCancelBulkWatermark"
        @confirm="handleConfirmBulkWatermark"
      />

      <DuplicateFilesModal
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
        :initial-index="currentViewIndex"
        :items="
          selectedMediaForView.length > 0
            ? selectedMediaForView
            : selectedMedia
              ? [selectedMedia]
              : []
        "
        :placeholder-image="placeholderImage"
        :selection-id="selection?.id || selection?.uuid"
        :set-id="selectedSetId || null"
        @close="closeMediaViewer"
        @download="handleDownloadMedia"
        @favorite="handleStarMediaFromLightbox"
        @image-error="handleImageError"
      />

      <MediaDetailSidebar
        v-model="showMediaDetailSidebar"
        :media="selectedMediaForDetails"
        :placeholder-image="placeholderImage"
        @download="handleDownloadMedia"
        @view="openMediaViewer"
      />

      <MoveCopyModal
        v-model="showMoveCopyModal"
        v-model:action="moveCopyAction"
        :available-collections="availableSelections"
        :current-collection-id="selection?.id || ''"
        :current-collection-name="selection?.name || ''"
        :is-loading-sets="isLoadingTargetSets"
        :is-moving="isMovingMedia"
        :selected-count="selectedMediaIds.size"
        :target-collection-id="targetSelectionId"
        :target-collection-sets="targetSelectionSets"
        :target-set-id="targetSetId"
        context="selection"
        @cancel="handleCancelMoveCopy"
        @confirm="handleConfirmMoveCopy"
        @selection-change="handleTargetSelectionChange"
        @update:target-set-id="targetSetId = $event"
      />

      <!-- Focal Point Modal -->
      <CoverFocalPointModal
        :image-url="focalPointImageUrl"
        :initial-focal-point="currentFocalPoint"
        :is-open="showFocalPointModal"
        title="SET FOCAL POINT"
        @confirm="handleFocalPointConfirm"
        @update:is-open="showFocalPointModal = $event"
      />

      <!-- Remove Watermark Confirmation Modal -->
      <DeleteConfirmationModal
        v-model="showRemoveWatermarkConfirm"
        :is-deleting="showRemoveWatermarkLoading"
        :item-name="itemToRemoveWatermark?.filename || itemToRemoveWatermark?.name"
        confirm-label="Remove"
        description="The watermark will be removed from this media item and the original image will be restored."
        fallback-name="this media"
        loading-label="Removing..."
        question="Are you sure you want to remove the watermark from"
        title="Remove Watermark"
        @cancel="cancelRemoveWatermark"
        @confirm="confirmRemoveWatermark"
      />

      <!-- Remove Watermark Loading Modal -->
      <CenterModal
        v-model="showRemoveWatermarkLoading"
        content-class="sm:max-w-md"
        title="Removing Watermark"
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
  </SelectionLayout>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useDownloadProtection } from '@/shared/composables/useDownloadProtection'
import { useRoute, useRouter } from 'vue-router'
import SelectionLayout from '@/domains/memora/layouts/SelectionLayout.vue'
import { useSidebarCollapse } from '@/shared/composables/useSidebarCollapse'
import SelectionSettingsGeneral from '@/domains/memora/views/selections/settings/General.vue'
import DeleteConfirmationModal from '@/shared/components/organisms/DeleteConfirmationModal.vue'
import BulkActionsBar from '@/shared/components/molecules/BulkActionsBar.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import MediaItemsHeaderBar from '@/shared/components/organisms/MediaItemsHeaderBar.vue'
import MediaGridItemCard from '@/shared/components/organisms/MediaGridItemCard.vue'
import MediaUploadDropzone from '@/shared/components/organisms/MediaUploadDropzone.vue'
import MediaListItemRow from '@/shared/components/organisms/MediaListItemRow.vue'
import MediaDetailSidebar from '@/shared/components/organisms/MediaDetailSidebar.vue'
import CreateEditMediaSetModal from '@/shared/components/organisms/CreateEditMediaSetModal.vue'
import DuplicateFilesModal from '@/shared/components/organisms/DuplicateFilesModal.vue'
import UploadProgressBar from '@/shared/components/organisms/UploadProgressBar.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import ContentLoader from '@/shared/components/molecules/ContentLoader.vue'
import RenameMediaModal from '@/shared/components/organisms/RenameMediaModal.vue'
import EditFilenamesModal from '@/shared/components/organisms/EditFilenamesModal.vue'
import BulkWatermarkModal from '@/shared/components/organisms/BulkWatermarkModal.vue'
import ReplacePhotoModal from '@/shared/components/organisms/ReplacePhotoModal.vue'
import WatermarkMediaModal from '@/shared/components/organisms/WatermarkMediaModal.vue'
import WatermarkPreviewModal from '@/shared/components/organisms/WatermarkPreviewModal.vue'
import MediaLightbox from '@/shared/components/organisms/MediaLightbox.vue'
import MoveCopyModal from '@/shared/components/organisms/MoveCopyModal.vue'
import CoverFocalPointModal from '@/shared/components/organisms/CoverFocalPointModal.vue'
import CenterModal from '@/shared/components/molecules/CenterModal.vue'
import { formatMediaDate } from '@/domains/memora/utils/media/formatMediaDate'
import { useSelectionStore } from '@/domains/memora/stores/selection.js'
import { useSelectionMediaSetsSidebarStore } from '@/domains/memora/stores/selectionMediaSetsSidebar'
import { storeToRefs } from 'pinia'
import { FolderPlus, ImagePlus, Loader2, Plus } from '@/shared/utils/lucideAnimated'
import { triggerFileInputClick } from '@/domains/memora/utils/media/triggerFileInputClick'
import { useSelectionWorkflow } from '@/domains/memora/composables/useSelectionWorkflow'
import { useSelectionActions } from '@/domains/memora/composables/useSelectionActions'
import { useSelectionProgress } from '@/domains/memora/composables/useSelectionProgress'
import { useSelectionsApi } from '@/domains/memora/api/selections'
import { getErrorMessage } from '@/shared/utils/errors'
import { useMediaWatermarkActions } from '@/domains/memora/composables/useMediaWatermarkActions'
import { useMediaActions } from '@/domains/memora/composables/useMediaActions'
import { apiClient } from '@/shared/api/client'
import { toast } from '@/shared/utils/toast'
import Pagination from '@/shared/components/molecules/Pagination.vue'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination.js'
import { useWatermarkStore } from '@/domains/memora/stores/watermark'
import SelectionLimitModal from '@/domains/memora/components/organisms/SelectionLimitModal.vue'

const theme = useThemeClasses()
const route = useRoute()
const router = useRouter()
const selectionStore = useSelectionStore()
const mediaSetsSidebar = useSelectionMediaSetsSidebarStore()
const watermarkStore = useWatermarkStore()
const { isSidebarCollapsed } = useSidebarCollapse()

// Initialize download protection
const { cleanup: cleanupProtection } = useDownloadProtection({
  enabled: true,
  showWarnings: false,
})

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
// Loading guard to prevent duplicate requests
const isLoadingSelection = ref(false)

const loadSelection = async () => {
  const selectionId = route.params.id
  if (!selectionId) {
    return
  }

  // Prevent duplicate concurrent requests
  if (isLoadingSelection.value) {
    return
  }

  // If selection is already loaded with the same ID, skip unless switching phases
  const previousSelectionId = selection.value?.id
  if (previousSelectionId === selectionId && !isLoading.value) {
    return
  }

  isLoadingSelection.value = true
  isLoading.value = true
  try {
    // Clear media items when switching to a different phase
    if (previousSelectionId && previousSelectionId !== selectionId) {
      mediaItems.value = []
    }

    const selectionData = await selectionStore.fetchSelection(selectionId)
    selection.value = selectionData

    // Set context and always fetch fresh media sets from API
    await mediaSetsSidebar.setContext(selectionId, null)

    // Wait for store state to update
    await nextTick()

    // Determine which set to select: route query > store auto-selection > first set
    let targetSetId = null
    if (route.query.setId) {
      const setIdFromRoute = route.query.setId
      const matchingSet = mediaSetsSidebar.mediaSets.find(s => s.id === setIdFromRoute)
      if (matchingSet) {
        targetSetId = setIdFromRoute
      }
    }

    // If no route query, use store's auto-selected set or first set
    if (!targetSetId && mediaSetsSidebar.mediaSets.length > 0) {
      targetSetId = mediaSetsSidebar.selectedSetId || mediaSetsSidebar.mediaSets[0].id
    }

    // Ensure the target set is selected
    if (targetSetId && mediaSetsSidebar.selectedSetId !== targetSetId) {
      mediaSetsSidebar.handleSelectSet(targetSetId)
      await nextTick()
    }

    // Load media items for the selected set
    const finalSelectedSetId = mediaSetsSidebar.selectedSetId || selectedSetId.value
    if (finalSelectedSetId) {
      await loadMediaItems()
    } else {
      mediaItems.value = []
    }
  } catch (error) {
    console.error('Error loading selection:', error)
    // Optionally redirect back or show error message
  } finally {
    isLoading.value = false
    isLoadingSelection.value = false
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
// Watch for route changes to handle navigation between different selections
watch(
  () => route.params.id,
  selectionId => {
    if (selectionId) {
      loadSelection()
    }
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
  const setId = selectedSetId.value || mediaSetsSidebar.selectedSetId
  if (!selection.value?.id || !setId) {
    return { data: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1 } }
  }

  const backendSortBy = convertSortOrder(sortOrder.value)
  const fetchParams = {
    ...params,
  }

  if (backendSortBy) {
    fetchParams.sortBy = backendSortBy
  }

  const response = await selectionsApi.fetchSetMedia(selection.value.id, setId, fetchParams)

  // Handle both paginated and non-paginated responses
  if (response && typeof response === 'object' && 'data' in response && 'pagination' in response) {
    // Paginated response - map items to include setId
    return {
      data: Array.isArray(response.data) ? response.data.map(m => ({ ...m, setId })) : [],
      pagination: response.pagination,
    }
  } else if (Array.isArray(response)) {
    // Non-paginated array response (backward compatibility)
    const mapped = response.map(m => ({ ...m, setId }))
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
    const currentSetId = selectedSetId.value || mediaSetsSidebar.selectedSetId
    const otherMedia = mediaItems.value.filter(item => item.setId !== currentSetId)
    mediaItems.value = [...otherMedia, ...newItems]
  },
  { immediate: true }
)

// Load media items for the selected set
const loadMediaItems = async () => {
  const setId = selectedSetId.value || mediaSetsSidebar.selectedSetId
  if (!selection.value?.id || !setId) {
    return
  }

  // Only load if set is visually active (photos tab and sidebar not collapsed)
  const tabFromRouteName = routeName => {
    const n = routeName?.toString?.() ?? ''
    if (n === 'selectionPhotos' || n === 'selectionPreview') return 'photos'
    if (n.startsWith('selectionSettings')) return 'settings'
    if (route.query?.tab) return route.query.tab
    return 'photos'
  }
  const activeTab = route.query?.tab || tabFromRouteName(route.name)
  const isVisuallyActive = activeTab === 'photos' && !isSidebarCollapsed.value

  if (!isVisuallyActive) {
    return
  }

  // Use pagination fetch
  await fetchMedia()
}

// Listen for background upload events after page reload
const handleBackgroundLoadMediaItems = event => {
  const { contextType, contextId, setId } = event.detail
  if (
    contextType === 'selection' &&
    contextId === selection.value?.id &&
    setId === selectedSetId.value
  ) {
    loadMediaItems()
  }
}

const handleBackgroundUploadComplete = event => {
  const { contextType, contextId, results } = event.detail
  if (
    contextType === 'selection' &&
    contextId === selection.value?.id &&
    results.successful.length > 0
  ) {
    // Reload media sets after successful upload
    if (mediaSetsSidebar) {
      mediaSetsSidebar.loadMediaSets()
    }
  }
}

onMounted(() => {
  window.addEventListener('backgroundUpload:loadMediaItems', handleBackgroundLoadMediaItems)
  window.addEventListener('backgroundUpload:uploadComplete', handleBackgroundUploadComplete)
})

onUnmounted(() => {
  cleanupProtection()
  window.removeEventListener('backgroundUpload:loadMediaItems', handleBackgroundLoadMediaItems)
  window.removeEventListener('backgroundUpload:uploadComplete', handleBackgroundUploadComplete)
})

// Update isLoadingMedia to use pagination loading state
const isLoadingMedia = computed(() => isLoadingMediaPagination.value)

// Watch for selectedSetId changes to load media
let isInitialLoad = true
watch(
  selectedSetId,
  async (newSetId, oldSetId) => {
    // Skip if this is the initial load and we're already loading in loadSelection
    if (isInitialLoad && oldSetId === undefined) {
      isInitialLoad = false
      return
    }

    if (selection.value?.id && newSetId) {
      // Only skip if actively uploading to avoid interrupting upload flow
      if (!isUploading.value) {
        await loadMediaItems()
      }
    } else if (!newSetId) {
      mediaItems.value = []
    }
  },
  { immediate: false } // Don't trigger on initial load, loadSelection handles it
)

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
  // Reload media sets and phase detail after successful upload to update counts and storage
  onUploadComplete: async results => {
    if (results.successful.length > 0) {
      await mediaSetsSidebar.loadMediaSets()
      await loadSelection()
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

const handleToggleFeatured = async item => {
  if (!item?.id && !item?.uuid) {
    toast.error('Invalid media item')
    return
  }

  const mediaId = item.id || item.uuid
  const isCurrentlyFeatured = item.isFeatured || item.is_featured || false

  try {
    toast.loading(
      isCurrentlyFeatured ? 'Removing from featured list...' : 'Adding to featured list...',
      {
        id: 'toggle-featured',
      }
    )

    const { apiClient } = await import('@/shared/api/client')
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

      toast.success(
      updatedMedia.is_featured ? 'Added to featured' : 'Removed from featured',
      {
        id: 'toggle-featured',
      }
    )
  } catch (error) {
    toast.error('Failed to update featured status', {
      description: error?.response?.data?.message || error?.message || 'Please try again',
      id: 'toggle-featured',
    })
  }
}

const handleToggleRecommended = async item => {
  if (!item?.id && !item?.uuid || !selection.value?.id || !selectedSetId.value) {
    toast.error('Invalid media item or context')
    return
  }

  const mediaId = item.id || item.uuid
  const isCurrentlyRecommended = item.isRecommended || item.is_recommended || false

  try {
    toast.loading(
      isCurrentlyRecommended ? 'Removing recommendation...' : 'Marking as recommended...',
      {
        id: 'toggle-recommended',
      }
    )

    const response = await selectionsApi.toggleRecommended(
      selection.value.id,
      selectedSetId.value,
      mediaId
    )

    // API method returns response.data, which is already the MediaResource (API client extracts data.data)
    const updatedMedia = response
    const isRecommended = updatedMedia?.is_recommended ?? updatedMedia?.isRecommended ?? !isCurrentlyRecommended

    // Update local state - match the pattern used in handleToggleFeatured
    const mediaIndex = mediaItems.value.findIndex(m => {
      const mId = m.id || m.uuid
      return mId && String(mId) === String(mediaId)
    })
    
    if (mediaIndex !== -1) {
      // Update in mediaItems array
      mediaItems.value[mediaIndex] = {
        ...mediaItems.value[mediaIndex],
        isRecommended,
        is_recommended: isRecommended,
      }
      
      // Also update in selectedMediaForView if item is in lightbox
      const viewIndex = selectedMediaForView.value.findIndex(m => {
        const mId = m.id || m.uuid
        return mId && String(mId) === String(mediaId)
      })
      if (viewIndex !== -1) {
        selectedMediaForView.value[viewIndex] = {
          ...selectedMediaForView.value[viewIndex],
          isRecommended,
          is_recommended: isRecommended,
        }
      }
    }

    toast.success(
      isRecommended ? 'Marked as recommended' : 'Removed recommendation',
      {
        id: 'toggle-recommended',
      }
    )
  } catch (error) {
    toast.error('Failed to update recommendation status', {
      description: error?.response?.data?.message || error?.message || 'Please try again',
      id: 'toggle-recommended',
    })
  }
}

const getItemId = item => {
  if (!item) return ''
  const id = item.id ?? item.uuid
  return id ? String(id) : ''
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
  confirmRemoveWatermark: confirmRemoveWatermarkFromComposable,
  cancelRemoveWatermark: cancelRemoveWatermarkFromComposable,
  showRemoveWatermarkConfirm: showRemoveWatermarkConfirmFromComposable,
  itemToRemoveWatermark: itemToRemoveWatermarkFromComposable,
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
  handleDownloadMedia,
  handleCopyFilenames,
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
  contextType: 'selection',
  api: selectionsApi,
  context: selection,
  contextId: computed(() => selection.value?.id),
  setId: selectedSetId,
  mediaItems,
  selectedMediaIds,
  sortedMediaItems,
  loadMediaItems,
  loadMediaSets: () => mediaSetsSidebar.loadMediaSets(),
  loadPhaseDetail: loadSelection,
  getItemId,
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
        description: getErrorMessage(error, 'An unknown error occurred'),
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
      description: getErrorMessage(error, 'An unknown error occurred'),
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
        description: getErrorMessage(error, 'An unknown error occurred'),
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
      description: getErrorMessage(error, 'An unknown error occurred'),
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

const handleSetAsCover = async item => {
  if (!selection.value?.id || !item?.id || isUpdatingCoverPhoto.value) return

  // For both images and videos, open focal point modal
  const coverUrl =
    item.file?.url ||
    item.file?.variants?.original ||
    item.file?.variants?.large ||
    item.url ||
    null
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
    const isVideo =
      selectedMediaForCover.value.type === 'video' ||
      selectedMediaForCover.value.file?.type === 'video'

    await selectionsApi.setCoverPhotoFromMedia(
      selection.value.id,
      selectedMediaForCover.value.id,
      isVideo ? focalPoint : focalPoint
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
          await selectionsApi.applyWatermarkToMedia(
            selectionIdValue,
            setIdValue,
            item.id,
            selectedBulkWatermark.value
          )
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
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
  } finally {
    isBulkWatermarkLoading.value = false
    bulkWatermarkProgress.value = null
  }
}

const watermarks = computed(() => watermarkStore.watermarks)

const handleWatermarkMedia = handleWatermarkMediaFromComposable
const handleCancelWatermarkMedia = handleCancelWatermarkMediaFromComposable
const handleConfirmWatermarkMedia = handleConfirmWatermarkMediaFromComposable
const handleRemoveWatermark = handleRemoveWatermarkFromComposable
const confirmRemoveWatermark = confirmRemoveWatermarkFromComposable
const cancelRemoveWatermark = cancelRemoveWatermarkFromComposable
const showRemoveWatermarkConfirm = showRemoveWatermarkConfirmFromComposable
const itemToRemoveWatermark = itemToRemoveWatermarkFromComposable

const handlePreviewWatermark = async () => {
  if (
    !mediaToWatermark.value ||
    !selectedWatermarkForMedia.value ||
    selectedWatermarkForMedia.value === 'none'
  ) {
    return
  }

  const imageUrl =
    mediaToWatermark.value.largeImageUrl ||
    mediaToWatermark.value.file?.url ||
    mediaToWatermark.value.thumbnailUrl
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
  if (!itemToDelete.value) return null
  const item = itemToDelete.value

  // For media items, show location (selection and set)
  if (item.collectionId || item.setId) {
    const locationParts = []

    if (selection.value?.name) {
      locationParts.push(`Selection: ${selection.value.name}`)
    }

    if (item.setId && mediaSets.value) {
      const set = mediaSets.value.find(s => s.id === item.setId)
      if (set?.name) {
        locationParts.push(`Set: ${set.name}`)
      }
    }

    return locationParts.length > 0 ? locationParts.join('\n') : null
  }

  // For sets, don't show location info
  return null
}

const getBulkDeleteModalWarning = () => {
  if (selectedMediaIds.value.size === 0) return null

  const selectedItems = mediaItems.value.filter(item => selectedMediaIds.value.has(getItemId(item)))

  if (selectedItems.length === 0) return null

  // Group items by set
  const itemsBySet = new Map()

  selectedItems.forEach(item => {
    const setId = item.setId
    if (!setId) return

    if (!itemsBySet.has(setId)) {
      itemsBySet.set(setId, [])
    }
    itemsBySet.get(setId).push(item)
  })

  const locationParts = []

  if (selection.value?.name) {
    locationParts.push(`Selection: ${selection.value.name}`)
  }

  itemsBySet.forEach((items, setId) => {
    const set = mediaSets.value?.find(s => s.id === setId)
    const setName = set?.name || 'Unknown Set'
    const count = items.length
    locationParts.push(`Set: ${setName} (${count} item${count > 1 ? 's' : ''})`)
  })

  return locationParts.length > 0 ? locationParts.join('\n') : null
}

const getDeleteModalDescription = () => {
  if (!itemToDelete.value) return 'This action cannot be undone.'
  const item = itemToDelete.value
  return item.collectionId || item.setId
    ? 'This media item will be permanently deleted.\n\nThis action cannot be undone.'
    : 'This set will be permanently deleted.\n\nThis action cannot be undone.'
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
  // Set flag immediately to prevent race conditions
  if (isUploading.value || isProcessingFiles.value) {
    event.target.value = ''
    return
  }

  const files = Array.from(event.target.files || [])
  // Reset input immediately to prevent duplicate events
  event.target.value = ''

  if (files.length === 0) return

  if (selection.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed selection.',
    })
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
    const { hasDuplicates, filesToUpload } = await processFiles(files, selectedSetId.value)

    if (hasDuplicates) {
      // Duplicate modal will be shown by the workflow
      return
    }

    if (filesToUpload.length > 0) {
      await uploadMediaToSet(filesToUpload, selectedSetId.value)
    }
  } catch (error) {
    console.error('File upload error:', error)
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
