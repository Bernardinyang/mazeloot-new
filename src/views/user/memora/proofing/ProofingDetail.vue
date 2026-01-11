<template>
  <!-- Settings View -->
  <ProofingSettingsGeneral
    v-if="route.query?.tab === 'settings' && route.query?.section === 'general'"
  />

  <!-- Default Photos View -->
  <ProofingLayout
    v-else
    :is-loading="isLoading || isUpdatingCoverPhoto"
    :proofing="proofing"
    :overall-progress="overallProgress"
    @go-back="goBack"
  >
    <template #content>
      <input
        ref="fileInputRef"
        accept="image/*,video/*"
        class="hidden"
        multiple
        type="file"
        :disabled="proofing?.status === 'completed'"
        @change="handleFileSelect"
      />

      <!-- Main Content Area -->
      <main
        class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-all duration-300 relative"
        :style="isDragging ? { '--tw-ring-color': `${proofingColor.value}33` } : {}"
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
            backgroundColor: `${proofingColor.value}1A`,
            borderColor: proofingColor.value,
          }"
        >
          <div class="text-center space-y-4">
            <div
              class="p-6 rounded-full"
              :style="{
                backgroundColor: `${proofingColor.value}33`,
              }"
            >
              <ImagePlus class="h-16 w-16 mx-auto" :style="{ color: proofingColor.value }" />
            </div>
            <p class="text-2xl font-bold" :style="{ color: proofingColor.value }">
              Drop files here to upload
            </p>
          </div>
        </div>
        <ContentLoader v-if="isLoading" message="Loading proofing..." />

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
            :selection-status="proofing?.status"
            store-type="proofing"
            :disable-upload="proofing?.status === 'completed'"
            @toggle-select-all="handleToggleSelectAll"
            @add-media="handleAddMedia"
          />

          <!-- Bulk Actions Bar -->
          <BulkActionsBar
            v-if="selectedSetId"
            :is-all-selected="selectedMediaIds.size === sortedMediaItems.length"
            :is-favorite-loading="isBulkFavoriteLoading"
            :selected-count="selectedMediaIds.size"
            :disable-actions="proofing?.status === 'completed'"
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
                  proofing?.status === 'completed' ? item.isCompleted : false
                "
                :item="item"
                :placeholder-image="placeholderImage"
                :show-filename="showFilename"
                :selection-status="null"
                :show-management-actions="proofing?.status !== 'completed'"
                :comment-count="getItemCommentCount(item)"
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
                @request-closure="handleRequestClosure(item)"
                @view-closure-history="handleViewClosureHistory(item)"
                @upload-revision="handleUploadRevision(item)"
                @view-revision-history="handleViewRevisionHistory(item)"
                @request-approval="handleRequestApproval(item)"
                @toggle-featured="handleToggleFeatured(item)"
                :closure-requests="getClosureRequestsForMedia(item)"
                :approval-requests="getApprovalRequestsForMedia(item)"
                :max-revisions="proofing?.maxRevisions || proofing?.max_revisions || null"
                :is-revision-limit-exceeded="isRevisionLimitExceededForMedia(item)"
              />
            </TransitionGroup>
            <TransitionGroup v-else class="space-y-2" name="media-list" tag="div">
              <MediaListItemRow
                v-for="item in sortedMediaItems"
                :key="item.id"
                :is-selected="selectedMediaIds.has(getItemId(item))"
                :was-selected-on-completion="
                  proofing?.status === 'completed' ? item.isCompleted : false
                "
                :item="item"
                :placeholder-image="placeholderImage"
                :show-filename="showFilename"
                :selection-status="null"
                :show-management-actions="proofing?.status !== 'completed'"
                :subtitle="formatMediaDate(item.createdAt)"
                :comment-count="getItemCommentCount(item)"
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
                @request-closure="handleRequestClosure(item)"
                @view-closure-history="handleViewClosureHistory(item)"
                @upload-revision="handleUploadRevision(item)"
                @view-revision-history="handleViewRevisionHistory(item)"
                @request-approval="handleRequestApproval(item)"
                @toggle-featured="handleToggleFeatured(item)"
                :closure-requests="getClosureRequestsForMedia(item)"
                :approval-requests="getApprovalRequestsForMedia(item)"
                :max-revisions="proofing?.maxRevisions || proofing?.max_revisions || null"
                :is-revision-limit-exceeded="isRevisionLimitExceededForMedia(item)"
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
              proofing &&
              proofing.status !== 'completed' &&
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
              message="No sets in this proofing"
              @action="mediaSetsSidebar.handleAddSet"
            />
          </div>
          <!-- Show upload zone when sets exist but no media -->
          <MediaUploadDropzone
            v-else-if="
              !isLoadingMedia && proofing && proofing.status !== 'completed' && mediaSets.length > 0
            "
            :is-dragging="isDragging"
            :is-empty="sortedMediaItems.length === 0"
            @browse="handleBrowseFiles"
            @drop="handleDrop"
            @update:is-dragging="isDragging = $event"
          />
          <!-- Show empty state for completed proofing or when no media -->
          <div
            v-else-if="sortedMediaItems.length === 0 && !isLoadingMedia"
            class="text-center py-16"
          >
            <p :class="theme.textSecondary" class="text-lg mb-4">No media in this proofing yet</p>
            <p :class="theme.textTertiary" class="text-sm">
              <span v-if="proofing && proofing.status === 'completed'">
                This proofing has been completed.
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
        :is-creating="mediaSetsSidebar.isCreatingSet"
        :is-editing="!!mediaSetsSidebar.editingSetIdInModal"
        context="proofing"
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
        :description="getDeleteModalDescription()"
        @cancel="closeDeleteModal"
        @confirm="handleConfirmDeleteItem"
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
        :proofing-id="proofing?.id || proofing?.uuid"
        :set-id="selectedSetId || null"
        :project-id="route.params.projectId || proofing?.projectId || null"
        @close="closeMediaViewer"
        @download="handleDownloadMedia"
        @image-error="handleImageError"
        @open-comments="handleOpenCommentsFromLightbox"
        @favorite="handleStarMediaFromLightbox"
      />

      <!-- Media Comment Lightbox -->
      <MediaCommentLightbox
        v-model="showCommentLightbox"
        :initial-index="commentLightboxIndex"
        :items="commentLightboxItems"
        :proofing-id="proofing?.id || proofing?.uuid"
        :set-id="selectedSetId || null"
        :project-id="route.params.projectId || null"
        :creative-email="userStore.user?.email || null"
        :allowed-emails="proofing?.allowedEmails || proofing?.allowed_emails || []"
        :closure-requests-map="closureRequestsMap"
        :approval-requests-map="approvalRequestsMap"
        @close="handleCloseCommentLightbox"
        @back-to-lightbox="handleCloseCommentLightbox"
        @comment-added="handleCommentAdded"
        @comment-updated="handleCommentUpdated"
        @comment-deleted="handleCommentDeleted"
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
        context="proofing"
        :available-collections="availableProofings"
        :current-collection-id="proofing?.id || ''"
        :current-collection-name="proofing?.name || ''"
        :target-collection-id="targetProofingId"
        :target-collection-sets="targetProofingSets"
        :is-loading-sets="isLoadingTargetSets"
        :target-set-id="targetSetId"
        :is-moving="isMovingMedia"
        :selected-count="selectedMediaIds.size"
        @selection-change="handleTargetProofingChange"
        @update:target-set-id="targetSetId = $event"
        @cancel="handleCancelMoveCopy"
        @confirm="handleConfirmMoveCopy"
      />

      <!-- Focal Point Modal -->
      <CoverFocalPointModal
        :is-open="showFocalPointModal"
        :image-url="focalPointImageUrl"
        :initial-focal-point="currentFocalPoint"
        title="SET FOCAL POINT"
        @update:is-open="showFocalPointModal = $event"
        @confirm="handleFocalPointConfirm"
      />

      <!-- Remove Watermark Confirmation Modal -->
      <DeleteConfirmationModal
        v-model="showRemoveWatermarkConfirm"
        title="Remove Watermark"
        question="Are you sure you want to remove the watermark from"
        :item-name="itemToRemoveWatermark?.filename || itemToRemoveWatermark?.name"
        fallback-name="this media"
        description="The watermark will be removed from this media item and the original image will be restored."
        confirm-label="Remove"
        loading-label="Removing..."
        :is-deleting="showRemoveWatermarkLoading"
        @confirm="confirmRemoveWatermark"
        @cancel="cancelRemoveWatermark"
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

      <!-- Request Closure Modal -->
      <RequestClosureModal
        v-if="requestClosureMediaItem"
        v-model="showRequestClosureModal"
        :media-id="requestClosureMediaItem.id || requestClosureMediaItem.uuid"
        :media-item="requestClosureMediaItem"
        :comments="requestClosureMediaItem.feedback || []"
        :is-video="(requestClosureMediaItem.type || requestClosureMediaItem.file?.type) === 'video'"
        :allow-reply="false"
        :guest-email="null"
        :creative-email="userStore.user?.email || null"
        @request-closure="handleRequestClosureSubmit"
      />

      <!-- Closure History Modal -->
      <ClosureHistoryModal
        v-model="showClosureHistoryModal"
        :closure-requests="closureHistoryData"
      />

      <!-- Request Approval Modal -->
      <RequestApprovalModal
        v-if="requestApprovalMediaItem"
        v-model="showRequestApprovalModal"
        :is-submitting="isSubmittingApprovalRequest"
        :max-revisions="proofing?.maxRevisions || proofing?.max_revisions || 5"
        @confirm="handleRequestApprovalSubmit"
        @cancel="handleRequestApprovalCancel"
      />

      <!-- Upload Revision Modal -->
      <UploadRevisionModal
        v-model="showUploadRevisionModal"
        :is-uploading="isUploadingRevision"
        :media-item="mediaForRevision"
        :current-revision-number="calculatedRevisionNumber"
        :max-revisions="proofing?.maxRevisions || proofing?.max_revisions || 5"
        @confirm="handleConfirmUploadRevision"
        @cancel="handleCancelUploadRevision"
      />

      <!-- Revision History Sidebar -->
      <RevisionHistorySidebar
        v-model="showRevisionHistorySidebar"
        :media-item="revisionHistoryMediaItem"
        :placeholder-image="placeholderImage"
        :max-revisions="proofing?.maxRevisions || proofing?.max_revisions || null"
        @view="handleViewRevisionFromHistory"
        @download="handleDownloadRevisionFromHistory"
        @revision-click="handleRevisionClick"
      />

      <!-- Revision Details Modal -->
      <RevisionDetailsModal
        v-model="showRevisionDetailsModal"
        :revision="selectedRevision"
        :media-item="revisionHistoryMediaItem"
      />
    </template>
  </ProofingLayout>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useDownloadProtection } from '@/composables/useDownloadProtection'
import { useRoute, useRouter } from 'vue-router'
import ProofingLayout from '@/layouts/ProofingLayout.vue'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import ProofingSettingsGeneral from '@/views/user/memora/proofing/settings/General.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import BulkActionsBar from '@/components/molecules/BulkActionsBar.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import MediaItemsHeaderBar from '@/components/organisms/MediaItemsHeaderBar.vue'
import MediaGridItemCard from '@/components/organisms/MediaGridItemCard.vue'
import MediaUploadDropzone from '@/components/organisms/MediaUploadDropzone.vue'
import MediaListItemRow from '@/components/organisms/MediaListItemRow.vue'
import MediaDetailSidebar from '@/components/organisms/MediaDetailSidebar.vue'
import CreateEditMediaSetModal from '@/components/organisms/CreateEditMediaSetModal.vue'
import RequestClosureModal from '@/components/organisms/RequestClosureModal.vue'
import ClosureHistoryModal from '@/components/organisms/ClosureHistoryModal.vue'
import UploadRevisionModal from '@/components/organisms/UploadRevisionModal.vue'
import RequestApprovalModal from '@/components/organisms/RequestApprovalModal.vue'
import RevisionHistorySidebar from '@/components/organisms/RevisionHistorySidebar.vue'
import RevisionDetailsModal from '@/components/organisms/RevisionDetailsModal.vue'
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
import MediaCommentLightbox from '@/components/organisms/MediaCommentLightbox.vue'
import MoveCopyModal from '@/components/organisms/MoveCopyModal.vue'
import CoverFocalPointModal from '@/components/organisms/CoverFocalPointModal.vue'
import CenterModal from '@/components/molecules/CenterModal.vue'
import { formatMediaDate } from '@/utils/media/formatMediaDate'
import { useProofingStore } from '@/stores/proofing'
import { useProofingMediaSetsSidebarStore } from '@/stores/proofingMediaSetsSidebar'
import { storeToRefs } from 'pinia'
import { FolderPlus, ImagePlus, Plus, Loader2 } from 'lucide-vue-next'
import { triggerFileInputClick } from '@/utils/media/triggerFileInputClick'
import { useProofingWorkflow } from '@/composables/useProofingWorkflow'
import { useProofingApi } from '@/api/proofing'
import { apiClient } from '@/api/client'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/errors'
import Pagination from '@/components/molecules/Pagination.vue'
import { useAsyncPagination } from '@/composables/useAsyncPagination.js'
import { useUserStore } from '@/stores/user'
import { useMediaActions } from '@/composables/useMediaActions'
import { useMediaWatermarkActions } from '@/composables/useMediaWatermarkActions'
import { useWatermarkStore } from '@/stores/watermark'
import { getAccentColor } from '@/utils/colors'

const theme = useThemeClasses()
const route = useRoute()
const router = useRouter()
const proofingStore = useProofingStore()
const mediaSetsSidebar = useProofingMediaSetsSidebarStore()
const userStore = useUserStore()
const { isSidebarCollapsed } = useSidebarCollapse()
const watermarkStore = useWatermarkStore()

// Initialize download protection
const { cleanup: cleanupProtection } = useDownloadProtection({
  enabled: true,
  showWarnings: false,
})

// Get proofing color from parent (provided by ProofingLayout)
const proofingColor = inject(
  'proofingColor',
  computed(() => getAccentColor())
)


// Use store for media sets
const { selectedSetId } = storeToRefs(mediaSetsSidebar)
const mediaSets = computed(() => mediaSetsSidebar.mediaSets)

// Helper function to filter media items to only latest revisions for a specific set
const getFilteredMediaForSet = (setId) => {
  if (!setId) return []
  const setMedia = mediaItems.value.filter(item => item.setId === setId)
  
  // Group by original media UUID and keep only the latest revision
  const mediaMap = new Map()
  
  setMedia.forEach(item => {
    const originalUuid = item.originalMediaId || item.original_media_uuid || item.id || item.uuid
    const revisionNumber = item.revisionNumber || item.revision_number || 0
    
    if (!mediaMap.has(originalUuid)) {
      mediaMap.set(originalUuid, item)
    } else {
      const existing = mediaMap.get(originalUuid)
      const existingRevision = existing.revisionNumber || existing.revision_number || 0
      
      if (revisionNumber > existingRevision) {
        mediaMap.set(originalUuid, item)
      }
    }
  })
  
  return Array.from(mediaMap.values())
}

// Computed property for sets with filtered counts (latest revisions only)
const mediaSetsWithFilteredCounts = computed(() => {
  return mediaSets.value.map(set => {
    const hasMediaItemsForSet = mediaItems.value.some(item => item.setId === set.id)
    // Use filtered count if we have media items loaded for this set, otherwise use API count
    const count = hasMediaItemsForSet
      ? getFilteredMediaForSet(set.id).length
      : (set.count ?? set.media_count ?? 0)
    return {
      ...set,
      count
    }
  })
})

// Provide filtered sets to child components (sidebar)
provide('filteredMediaSets', mediaSetsWithFilteredCounts)

// Proofing data
const proofing = ref(null)
const isDragging = ref(false)

const { gridSize, viewMode, showFilename, sortOrder } = storeToRefs(proofingStore)
const selectedMediaIds = ref(new Set())
const showMoveCopyModal = ref(false)
const moveCopyAction = ref('move')
const isMovingMedia = ref(false)
const targetProofingId = ref('')
const targetSetId = ref('')
const availableProofings = ref([])
const isLoadingProofings = ref(false)
const targetProofingSets = ref([])
const isLoadingTargetSets = ref(false)
const isBulkFavoriteLoading = ref(false)
const isBulkEditLoading = ref(false)
const isBulkDeleteLoading = ref(false)
const isUpdatingCoverPhoto = ref(false)
const selectedMedia = ref(null)
const selectedMediaForView = ref([])
const currentViewIndex = ref(0)
const showMediaViewer = ref(false)
const showMediaDetailSidebar = ref(false)
const showCommentLightbox = ref(false)
const commentLightboxIndex = ref(0)
const commentLightboxItems = ref([])
const showRequestClosureModal = ref(false)
const requestClosureMediaItem = ref(null)
const closureRequestsMap = ref({}) // Map of mediaId -> closure requests array
const approvalRequestsMap = ref({}) // Map of mediaId -> approval requests array
const showClosureHistoryModal = ref(false)
const closureHistoryMediaItem = ref(null)
const closureHistoryData = ref([])

// Approval request state
const showRequestApprovalModal = ref(false)
const requestApprovalMediaItem = ref(null)
const isSubmittingApprovalRequest = ref(false)
const showUploadRevisionModal = ref(false)
const mediaForRevision = ref(null)
const isUploadingRevision = ref(false)
const showRevisionHistorySidebar = ref(false)
const revisionHistoryMediaItem = ref(null)
const showRevisionDetailsModal = ref(false)
const selectedRevision = ref(null)

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

// Load proofing data
const isLoading = ref(false)
const loadProofing = async (proofingId) => {
  if (!proofingId) {
    return
  }

  isLoading.value = true
  try {
    // Clear media items when switching to a different phase
    const previousProofingId = proofing.value?.id
    if (previousProofingId && previousProofingId !== proofingId) {
      mediaItems.value = []
    }

    // Always fetch proofing from backend
    const proofingData = await proofingStore.fetchProofing(proofingId)
    proofing.value = proofingData

    // Set context and always fetch fresh media sets from API
    await mediaSetsSidebar.setContext(
      proofingId,
      null,
      proofingData.projectId || null
    )

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
    console.error('Error loading proofing:', error)
    // Optionally redirect back or show error message
  } finally {
    isLoading.value = false
  }
}

// Sync selectedSetId with route query parameter
let isUpdatingFromRoute = false
watch(selectedSetId, newSetId => {
  if (isUpdatingFromRoute) return

  if (newSetId) {
    router.replace({
      query: {
        ...route.query,
        setId: newSetId,
      },
    })
    resetMediaToFirstPage()
  } else {
    const query = { ...route.query }
    delete query.setId
    router.replace({ query })
  }
})

// Watch for route query changes
watch(
  () => route.query.setId,
  setIdFromRoute => {
    if (!setIdFromRoute) {
      if (selectedSetId.value) {
        isUpdatingFromRoute = true
        mediaSetsSidebar.handleSelectSet(null)
        isUpdatingFromRoute = false
      }
      return
    }

    if (setIdFromRoute !== selectedSetId.value) {
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
    routeName === 'proofingPhotos' ||
    routeName === 'proofingPreview' ||
    (!tab && routeName !== 'proofingSettings')
  )
})

// Auto-select first set when photos tab is clicked
watch(
  () => route.query.tab,
  newTab => {
    if (newTab === 'photos' || (!newTab && isPhotosTabActive.value)) {
      const checkAndSelect = () => {
        if (!selectedSetId.value && mediaSetsSidebar.mediaSets.length > 0 && !route.query.setId) {
          isUpdatingFromRoute = true
          mediaSetsSidebar.handleSelectSet(mediaSetsSidebar.mediaSets[0].id)
          isUpdatingFromRoute = false
        }
      }

      checkAndSelect()
      setTimeout(checkAndSelect, 100)
    }
  },
  { immediate: true }
)

// Watch for when mediaSets become available
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

// Watch route params to reload when proofing ID changes
watch(
  () => route.params.id,
  (id) => {
    if (id) {
      loadProofing(id)
    }
  }
)

// Watch for route changes to handle navigation between different proofings
watch(
  () => route.params.id,
  (proofingId) => {
    if (proofingId) {
      loadProofing(proofingId)
    }
  }
)

// Initialize selectedSetId from route query on mount
onMounted(async () => {
  const proofingId = route.params.id
  if (proofingId) {
    await loadProofing(proofingId)
  }
  
  try {
    await watermarkStore.fetchWatermarks()
  } catch (error) {}

  watch(
    () => mediaSetsSidebar.mediaSets.length,
    () => {
      if (route.query.setId && !selectedSetId.value && mediaSetsSidebar.mediaSets.length > 0) {
        const setIdFromRoute = route.query.setId
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

// Watch for modal opening to load proofings
watch(showMoveCopyModal, isOpen => {
  if (isOpen) {
    if (availableProofings.value.length === 0) {
      loadAvailableProofings()
    }
    if (proofing.value) {
      targetProofingId.value = proofing.value.id
      handleTargetProofingChange(proofing.value.id)
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
  return item.file?.filename || item.filename || item.title || item.name || 'Item'
}

const selectedSet = computed(() => {
  return mediaSets.value.find(set => set.id === selectedSetId.value) || mediaSets.value[0]
})

// Initialize media items as empty array
const mediaItems = ref([])

// Load media items for the selected set with pagination
const proofingApi = useProofingApi()

// Convert frontend sort format to backend format
const convertSortOrder = sortValue => {
  if (!sortValue) return null

  if (sortValue === 'random') return 'random'

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
  if (!proofing.value?.id || !setId) {
    return { data: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1 } }
  }

  const backendSortBy = convertSortOrder(sortOrder.value)
  const fetchParams = {
    ...params,
  }

  if (backendSortBy) {
    fetchParams.sortBy = backendSortBy
  }

  const response = await proofingApi.fetchSetMedia(
    proofing.value.id,
    setId,
    proofing.value.projectId,
    fetchParams
  )

  if (response && typeof response === 'object' && 'data' in response && 'pagination' in response) {
    return {
      data: Array.isArray(response.data)
        ? response.data.map(m => ({ ...m, setId }))
        : [],
      pagination: response.pagination,
    }
  } else if (Array.isArray(response)) {
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
  autoFetch: false,
  watchForReset: [sortOrder],
})

// Keep mediaItems in sync with paginated data
watch(
  paginatedMediaItems,
  newItems => {
    const currentSetId = selectedSetId.value || mediaSetsSidebar.selectedSetId
    const otherMedia = mediaItems.value.filter(item => item.setId !== currentSetId)
    mediaItems.value = [...otherMedia, ...newItems]
    // Load closure requests and approval requests for new items
    if (newItems.length > 0) {
      loadClosureRequestsForMedia(newItems)
      loadApprovalRequestsForMedia(newItems)
    }
  },
  { immediate: true }
)

// Load media items for the selected set
const loadMediaItems = async () => {
  const setId = selectedSetId.value || mediaSetsSidebar.selectedSetId
  if (!proofing.value?.id || !setId) {
    return
  }

  // Only load if set is visually active (photos tab and sidebar not collapsed)
  const tabFromRouteName = routeName => {
    const n = routeName?.toString?.() ?? ''
    if (n === 'proofingPhotos' || n === 'proofingPreview') return 'photos'
    if (n.startsWith('proofingSettings')) return 'settings'
    if (route.query?.tab) return route.query.tab
    return 'photos'
  }
  const activeTab = route.query?.tab || tabFromRouteName(route.name)
  const isVisuallyActive = activeTab === 'photos' && !isSidebarCollapsed.value
  
  if (!isVisuallyActive) {
    return
  }

  await fetchMedia()
}

// Listen for background upload events after page reload
const handleBackgroundLoadMediaItems = (event) => {
  const { contextType, contextId, setId } = event.detail
  if (contextType === 'proofing' && contextId === proofing.value?.id && setId === selectedSetId.value) {
    loadMediaItems()
  }
}

const handleBackgroundUploadComplete = (event) => {
  const { contextType, contextId, results } = event.detail
  if (contextType === 'proofing' && contextId === proofing.value?.id && results.successful.length > 0) {
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

// Initialize proofing workflow for uploads
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
  duplicateFileActionsKey,
} = useProofingWorkflow({
  proofingId: () => proofing.value?.id,
  loadMediaItems,
  existingMedia: () => mediaItems.value,
  onUploadComplete: async results => {
    if (results.successful.length > 0) {
      await mediaSetsSidebar.loadMediaSets()
      await loadProofing(proofing.value?.id)
    }
  },
})

// Watch upload state to control progress modal
watch(isUploadingFromWorkflow, async (val, oldVal) => {
  if (val) {
    showUploadProgress.value = true
  }
  if (!val && oldVal) {
    justUploaded.value = true
    const hasFailedUploads = Object.values(uploadProgressFromWorkflow.value || {}).some(
      p => p.status === 'failed'
    )
    if (!hasFailedUploads) {
      setTimeout(() => {
        showUploadProgress.value = false
      }, 1000)
    }

    setTimeout(() => {
      justUploaded.value = false
    }, 500)
  }
})

// Watch for failed uploads to keep modal open
watch(
  () => uploadErrorsFromWorkflow.value?.length || 0,
  errorCount => {
    if (errorCount > 0 && !isUploadingFromWorkflow.value) {
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
let isInitialLoad = true
watch(
  selectedSetId,
  async (newSetId, oldSetId) => {
    // Skip if this is the initial load and we're already loading in loadProofing
    if (isInitialLoad && oldSetId === undefined) {
      isInitialLoad = false
      return
    }
    
    if (proofing.value?.id && newSetId) {
      // Only skip if actively uploading to avoid interrupting upload flow
      if (!isUploading.value && !justUploaded.value) {
        await loadMediaItems()
      }
    } else if (!newSetId) {
      mediaItems.value = []
    }
  },
  { immediate: false } // Don't trigger on initial load, loadProofing handles it
)

// Watch for sortOrder changes to reload media
watch(
  sortOrder,
  () => {
    if (proofing.value?.id && selectedSetId.value && !isUploading.value && !isLoadingMedia.value) {
      loadMediaItems()
    }
  },
  { immediate: false }
)

// Filter media items by selected set and show only latest revisions
const filteredMediaItems = computed(() => {
  if (!selectedSetId.value) {
    return []
  }
  const setMedia = mediaItems.value.filter(item => item.setId === selectedSetId.value)

  // Group by original media UUID and keep only the latest revision
  const mediaMap = new Map()

  setMedia.forEach(item => {
    // Determine the original media UUID (grouping key)
    // If item has originalMediaId, it's a revision - group by originalMediaId
    // If item doesn't have originalMediaId, it's the original - group by its own UUID
    const originalUuid = item.originalMediaId || item.original_media_uuid || item.id || item.uuid
    const revisionNumber = item.revisionNumber || item.revision_number || 0

    if (!mediaMap.has(originalUuid)) {
      mediaMap.set(originalUuid, item)
    } else {
      const existing = mediaMap.get(originalUuid)
      const existingRevision = existing.revisionNumber || existing.revision_number || 0

      // Keep the one with higher revision number
      if (revisionNumber > existingRevision) {
        mediaMap.set(originalUuid, item)
      }
    }
  })

  return Array.from(mediaMap.values())
})

// Media items are now sorted/filtered by the backend
const sortedMediaItems = computed(() => filteredMediaItems.value)

const openMediaViewer = item => {
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

// Store MediaLightbox state before opening comments
const mediaLightboxStateBeforeComments = ref({
  items: [],
  index: 0,
})

const handleRequestClosure = item => {
  requestClosureMediaItem.value = item
  showRequestClosureModal.value = true
}

const handleViewClosureHistory = async item => {
  closureHistoryMediaItem.value = item
  const mediaId = item.id || item.uuid
  try {
    const result = await proofingApi.getMediaClosureRequests(mediaId)
    closureHistoryData.value = result.closure_requests || []
    showClosureHistoryModal.value = true
  } catch (error) {
    console.error('Failed to load closure history:', error)
    toast.error('Failed to load closure history', {
      description: error?.message || 'An error occurred while loading closure history.',
    })
  }
}

const getClosureRequestsForMedia = item => {
  const mediaId = item.id || item.uuid
  return closureRequestsMap.value[mediaId] || []
}

const getApprovalRequestsForMedia = item => {
  const mediaId = item.id || item.uuid
  return approvalRequestsMap.value[mediaId] || []
}

const calculatedRevisionNumber = computed(() => {
  if (!mediaForRevision.value) return 1

  const originalMediaUuid =
    mediaForRevision.value.originalMediaId ||
    mediaForRevision.value.original_media_uuid ||
    mediaForRevision.value.id ||
    mediaForRevision.value.uuid

  // Find all revisions for this original media
  const revisions = sortedMediaItems.value.filter(m => {
    const mOriginalUuid = m.originalMediaId || m.original_media_uuid || m.id || m.uuid
    return mOriginalUuid === originalMediaUuid && (m.revisionNumber || m.revision_number)
  })

  // Get max revision number
  const maxRevision = revisions.reduce((max, m) => {
    const revNum = m.revisionNumber || m.revision_number || 0
    return Math.max(max, revNum)
  }, 0)

  return maxRevision + 1
})

const handleUploadRevision = item => {
  if (!item) return
  mediaForRevision.value = item

  // Check if on second-to-last revision
  const maxRevisions = proofing.value?.maxRevisions || proofing.value?.max_revisions || 5
  const nextRevisionNumber = calculatedRevisionNumber.value

  if (nextRevisionNumber === maxRevisions - 1) {
    toast.warning('Second-to-last revision', {
      description: `This will be revision ${nextRevisionNumber} of ${maxRevisions}. Only one more revision will be allowed after this.`,
      duration: 5000,
    })
  }

  showUploadRevisionModal.value = true
}

const handleConfirmUploadRevision = async ({
  revisionNumber,
  description,
  userFileUuid,
  completedTodos = [],
}) => {
  if (!mediaForRevision.value || !userFileUuid || isUploadingRevision.value) return

  const proofingId = proofing.value?.id || proofing.value?.uuid
  const mediaId = mediaForRevision.value.id || mediaForRevision.value.uuid
  const projectId = route.params.projectId || null

  if (!proofingId || !mediaId) {
    toast.error('Missing required information', {
      description: 'Unable to upload revision. Please try again.',
    })
    return
  }

  isUploadingRevision.value = true

  try {
    const revisionMedia = await proofingApi.uploadRevision(
      projectId,
      proofingId,
      mediaId,
      revisionNumber,
      description || '',
      userFileUuid,
      completedTodos
    )

    // Refresh media items
    await loadMediaItems()

    showUploadRevisionModal.value = false
    mediaForRevision.value = null

    toast.success('Revision uploaded', {
      description: `Revision ${revisionNumber} has been uploaded successfully.`,
    })
  } catch (error) {
    console.error('Failed to upload revision', error)
    toast.error('Failed to upload revision', {
      description: error?.message || 'An unknown error occurred',
    })
  } finally {
    isUploadingRevision.value = false
  }
}

const handleCancelUploadRevision = () => {
  showUploadRevisionModal.value = false
  mediaForRevision.value = null
}

const handleViewRevisionHistory = item => {
  if (!item) return

  revisionHistoryMediaItem.value = item

  // Check if on second-to-last revision
  const maxRevisions = proofing.value?.maxRevisions || proofing.value?.max_revisions || 5
  const currentRevisionNumber = item.revisionNumber || item.revision_number || 0

  if (currentRevisionNumber === maxRevisions - 1) {
    toast.warning('Second-to-last revision', {
      description: `This is revision ${currentRevisionNumber} of ${maxRevisions}. Only one more revision is allowed.`,
      duration: 5000,
    })
  }

  showRevisionHistorySidebar.value = true
}

const handleRevisionClick = revision => {
  selectedRevision.value = revision
  showRevisionDetailsModal.value = true
}

const handleViewRevisionFromHistory = revision => {
  openMediaViewer(revision)
}

const handleDownloadRevisionFromHistory = async revision => {
  await handleDownloadMedia(revision)
}

// Load closure requests for all media items
const loadClosureRequestsForMedia = async mediaItems => {
  const requests = {}
  for (const item of mediaItems) {
    const mediaId = item.id || item.uuid
    try {
      const result = await proofingApi.getMediaClosureRequests(mediaId)
      requests[mediaId] = result.closure_requests || []
    } catch (error) {
      // Silently fail - closure requests are optional
      requests[mediaId] = []
    }
  }
  closureRequestsMap.value = { ...closureRequestsMap.value, ...requests }
}

// Load approval requests for all media items
const loadApprovalRequestsForMedia = async mediaItems => {
  const requests = {}
  for (const item of mediaItems) {
    const mediaId = item.id || item.uuid
    try {
      const result = await proofingApi.getMediaApprovalRequests(mediaId)
      requests[mediaId] = result.approval_requests || []
    } catch (error) {
      // Silently fail - approval requests are optional
      requests[mediaId] = []
    }
  }
  approvalRequestsMap.value = { ...approvalRequestsMap.value, ...requests }
}

const handleOpenCommentsFromLightbox = ({ item, index }) => {
  // Store the current MediaLightbox state before closing
  const items =
    selectedMediaForView.value.length > 0 ? selectedMediaForView.value : sortedMediaItems.value

  mediaLightboxStateBeforeComments.value = {
    items: [...items],
    index: index,
  }

  // Close the regular lightbox
  closeMediaViewer()

  // Get all media items (or use the items that were in the viewer)
  // Preserve all properties including file, url, etc.
  const itemsWithSetId = items.map(m => ({
    ...m,
    setId: m.setId || selectedSetId.value,
  }))

  // Ensure the current item is always included, even if it doesn't have feedback
  // Use the item passed from MediaLightbox directly to preserve its full structure
  const currentItemId = item.id || item.uuid
  const currentItemWithSetId = {
    ...item,
    setId: item.setId || selectedSetId.value,
  }

  // Filter to only items with feedback, but always include the current item
  const itemsWithFeedback = itemsWithSetId.filter(m => {
    const mediaId = m.id || m.uuid
    // Always include the current item, or include items with feedback
    return mediaId === currentItemId || (m.feedback && m.feedback.length > 0)
  })

  // Ensure current item is at the correct position (replace if exists, or add if not)
  const existingIndex = itemsWithFeedback.findIndex(m => {
    const mediaId = m.id || m.uuid
    return mediaId === currentItemId
  })

  if (existingIndex >= 0) {
    // Replace with the item from MediaLightbox to preserve its structure
    itemsWithFeedback[existingIndex] = currentItemWithSetId
  } else {
    // Add current item at the beginning
    itemsWithFeedback.unshift(currentItemWithSetId)
  }

  commentLightboxItems.value = itemsWithFeedback.length > 0 ? itemsWithFeedback : itemsWithSetId

  // Find the index of the current item in the comment lightbox items
  // Match by both id and uuid to ensure we find the correct item
  const commentIndex = commentLightboxItems.value.findIndex(m => {
    const mediaId = m.id || m.uuid
    return mediaId === currentItemId
  })
  commentLightboxIndex.value = commentIndex >= 0 ? commentIndex : 0

  // Open the comment lightbox
  showCommentLightbox.value = true
}

const handleCloseCommentLightbox = async () => {
  showCommentLightbox.value = false

  // Reopen MediaLightbox with the stored state
  if (mediaLightboxStateBeforeComments.value.items.length > 0) {
    selectedMediaForView.value = mediaLightboxStateBeforeComments.value.items
    currentViewIndex.value = mediaLightboxStateBeforeComments.value.index
    showMediaViewer.value = true

    // Clear the stored state
    mediaLightboxStateBeforeComments.value = { items: [], index: 0 }
  }

  // No need to reload - comment counts are updated via events
}

// Handle comment added event - update media item's feedback silently
const handleCommentAdded = ({ mediaId, comment, allComments }) => {
  updateMediaItemFeedback(mediaId, allComments)
}

// Handle comment updated event
const handleCommentUpdated = ({ mediaId, commentId, comment, allComments }) => {
  updateMediaItemFeedback(mediaId, allComments)
}

// Handle comment deleted event
const handleCommentDeleted = ({ mediaId, commentId, allComments }) => {
  updateMediaItemFeedback(mediaId, allComments)
}

// Request Closure handler
const handleRequestClosureSubmit = async ({ mediaId, todos }) => {
  try {
    const proofingId = proofing.value?.id || proofing.value?.uuid
    const result = await proofingApi.createClosureRequest(proofingId, mediaId, todos)

    toast.success('Closure request sent', {
      description: 'The closure request has been sent to the primary email.',
    })

    // Reload closure requests for this media before clearing
    const currentMediaId = mediaId
    try {
      const result = await proofingApi.getMediaClosureRequests(currentMediaId)
      closureRequestsMap.value[currentMediaId] = result.closure_requests || []
    } catch (err) {
      // Silently fail
    }

    showRequestClosureModal.value = false
    requestClosureMediaItem.value = null
  } catch (error) {
    console.error('Failed to create closure request:', error)
    toast.error('Failed to send closure request', {
      description: error?.message || 'An error occurred while sending the closure request.',
    })
  }
}

const isRevisionLimitExceededForMedia = item => {
  if (!item || !proofing.value) return false
  const maxRevisions = proofing.value?.maxRevisions || proofing.value?.max_revisions || 5
  const originalUuid = item.originalMediaId || item.original_media_uuid || item.id || item.uuid

  // Find all revisions for this media
  const allRevisions = sortedMediaItems.value.filter(m => {
    const mOriginalUuid = m.originalMediaId || m.original_media_uuid || m.id || m.uuid
    return mOriginalUuid === originalUuid
  })

  const currentRevisionNumber = item.revisionNumber || item.revision_number || 0

  return currentRevisionNumber >= maxRevisions
}

const handleRequestApproval = item => {
  if (!item) return
  requestApprovalMediaItem.value = item
  showRequestApprovalModal.value = true
}

const handleRequestApprovalSubmit = async ({ message }) => {
  if (!requestApprovalMediaItem.value || isSubmittingApprovalRequest.value) return

  const item = requestApprovalMediaItem.value
  const proofingId = proofing.value?.id || proofing.value?.uuid
  const mediaId = item.id || item.uuid

  if (!proofingId || !mediaId) {
    toast.error('Missing required information', {
      description: 'Unable to request approval. Please try again.',
    })
    return
  }

  isSubmittingApprovalRequest.value = true

  try {
    await proofingApi.createApprovalRequest(proofingId, mediaId, message)

    // Reload approval requests for this media
    try {
      const result = await proofingApi.getMediaApprovalRequests(mediaId)
      approvalRequestsMap.value[mediaId] = result.approval_requests || []
    } catch (err) {
      // Silently fail
    }

    toast.success('Approval request sent', {
      description: 'The approval request has been sent to the primary email.',
    })

    showRequestApprovalModal.value = false
    requestApprovalMediaItem.value = null
  } catch (error) {
    console.error('Failed to create approval request:', error)
    toast.error('Failed to send approval request', {
      description: error?.message || 'An error occurred while sending the approval request.',
    })
  } finally {
    isSubmittingApprovalRequest.value = false
  }
}

const handleRequestApprovalCancel = () => {
  showRequestApprovalModal.value = false
  requestApprovalMediaItem.value = null
}

// Helper to update media item's feedback array
const updateMediaItemFeedback = (mediaId, feedback) => {
  // Update in sortedMediaItems
  const mediaIndex = sortedMediaItems.value.findIndex(m => (m.id || m.uuid) === mediaId)
  if (mediaIndex !== -1) {
    sortedMediaItems.value[mediaIndex] = {
      ...sortedMediaItems.value[mediaIndex],
      feedback: feedback || [],
    }
  }

  // Update in commentLightboxItems if it exists there
  const lightboxIndex = commentLightboxItems.value.findIndex(m => (m.id || m.uuid) === mediaId)
  if (lightboxIndex !== -1) {
    commentLightboxItems.value[lightboxIndex] = {
      ...commentLightboxItems.value[lightboxIndex],
      feedback: feedback || [],
    }
  }
}

const handleViewDetails = item => {
  selectedMediaForDetails.value = item
  showMediaDetailSidebar.value = true
}

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

// Progress calculation
const overallProgress = computed(() => {
  if (proofing.value?.status === 'completed') {
    const completed = proofing.value.completedCount || 0
    const total = proofing.value.mediaCount || 0
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      selected: completed,
      total,
      percentage,
    }
  }

  // Filter to only latest revisions across all sets
  const allFilteredMedia = []
  const mediaMap = new Map()
  
  mediaItems.value.forEach(item => {
    const originalUuid = item.originalMediaId || item.original_media_uuid || item.id || item.uuid
    const revisionNumber = item.revisionNumber || item.revision_number || 0
    
    if (!mediaMap.has(originalUuid)) {
      mediaMap.set(originalUuid, item)
    } else {
      const existing = mediaMap.get(originalUuid)
      const existingRevision = existing.revisionNumber || existing.revision_number || 0
      
      if (revisionNumber > existingRevision) {
        mediaMap.set(originalUuid, item)
      }
    }
  })
  
  const filteredMediaArray = Array.from(mediaMap.values())
  const completed = filteredMediaArray.filter(m => m.isCompleted).length
  const total = filteredMediaArray.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    selected: completed,
    total,
    percentage,
  }
})

// Count of items with isCompleted: true in current set
const selectedCountInCurrentSet = computed(() => {
  if (!selectedSetId.value) return 0
  return sortedMediaItems.value.filter(item => item.isCompleted === true).length
})


const handleMoveCopy = item => {
  selectedMediaIds.value.clear()
  selectedMediaIds.value.add(item.id)
  moveCopyAction.value = 'move'
  targetProofingId.value = proofing.value?.id || ''
  targetSetId.value = ''
  showMoveCopyModal.value = true
}

// Load available proofings for move/copy modal
const loadAvailableProofings = async () => {
  isLoadingProofings.value = true
  try {
    const result = await proofingStore.fetchAllProofing({ perPage: 100 })
    availableProofings.value = Array.isArray(result) ? result : result?.data || []
  } catch (error) {
    availableProofings.value = []
  } finally {
    isLoadingProofings.value = false
  }
}

const handleTargetProofingChange = async proofingId => {
  targetProofingId.value = proofingId
  targetSetId.value = ''

  if (!proofingId) {
    targetProofingSets.value = []
    return
  }

  isLoadingTargetSets.value = true
  try {
    let allSets = []
    if (proofingId === proofing.value?.id) {
      allSets = mediaSets.value.map(set => ({
        id: set.id,
        name: set.name,
        description: set.description,
        count: set.count,
        order: set.order,
      }))
    } else {
      const sets = await proofingApi.fetchMediaSets(proofingId)
      allSets = Array.isArray(sets) ? sets : []
    }

    if (proofingId === proofing.value?.id && selectedSetId.value) {
      targetProofingSets.value = allSets.filter(set => set.id !== selectedSetId.value)
    } else {
      targetProofingSets.value = allSets
    }

    if (targetProofingSets.value.length === 1) {
      targetSetId.value = targetProofingSets.value[0].id
    }
  } catch (error) {
    targetProofingSets.value = []
    toast.error('Failed to load sets', {
      description: 'Unable to load sets for the selected proofing.',
    })
  } finally {
    isLoadingTargetSets.value = false
  }
}

const handleCancelMoveCopy = () => {
  showMoveCopyModal.value = false
  targetProofingId.value = proofing.value?.id || ''
  targetSetId.value = ''
  targetProofingSets.value = []
  moveCopyAction.value = 'move'
}

const handleConfirmMoveCopy = async () => {
  if (!targetProofingId.value || selectedMediaIds.value.size === 0) {
    toast.error('Missing proofing', {
      description: 'Please select a target proofing.',
    })
    return
  }

  if (!targetSetId.value) {
    toast.error('Missing set', {
      description: 'Please select a target set.',
    })
    return
  }

  if (!proofing.value?.id || !selectedSetId.value) {
    toast.error('Invalid context', {
      description: 'Unable to determine source proofing or set.',
    })
    return
  }

  const mediaIds = Array.from(selectedMediaIds.value)
  const targetSet = targetSetId.value

  if (targetSet === selectedSetId.value && targetProofingId.value === proofing.value?.id) {
    toast.error(`Cannot ${moveCopyAction.value} to same set`, {
      description: `The media is already in this set. Please select a different set.`,
    })
    return
  }

  isMovingMedia.value = true
  try {
    if (moveCopyAction.value === 'move') {
      const result = await proofingApi.moveMediaToSet(
        proofing.value.id,
        selectedSetId.value,
        mediaIds,
        targetSet,
        proofing.value.projectId
      )

      toast.success('Media moved', {
        description: `${result.moved_count || mediaIds.length} item${(result.moved_count || mediaIds.length) > 1 ? 's' : ''} moved successfully.`,
      })

      if (targetProofingId.value === proofing.value?.id) {
        await mediaSetsSidebar.loadMediaSets()
      }

      await loadMediaItems()
      selectedMediaIds.value.clear()
      handleCancelMoveCopy()
    } else {
      const result = await proofingApi.copyMediaToSet(
        proofing.value.id,
        selectedSetId.value,
        mediaIds,
        targetSet,
        proofing.value.projectId
      )

      toast.success('Media copied', {
        description: `${result.copied_count || result.media?.length || mediaIds.length} item${(result.copied_count || result.media?.length || mediaIds.length) > 1 ? 's' : ''} copied successfully.`,
      })

      if (targetProofingId.value === proofing.value?.id) {
        await mediaSetsSidebar.loadMediaSets()
      }

      if (targetProofingId.value === proofing.value?.id && targetSet === selectedSetId.value) {
        await loadMediaItems()
      }

      selectedMediaIds.value.clear()
      handleCancelMoveCopy()
    }
  } catch (error) {
    toast.error(`Failed to ${moveCopyAction.value} media`, {
      description: getErrorMessage(error, 'An unknown error occurred.'),
    })
  } finally {
    isMovingMedia.value = false
  }
}

const handleToggleMediaSelection = id => {
  const normalizedId = id ? String(id) : ''
  if (!normalizedId) return

  const newSet = new Set(selectedMediaIds.value)
  if (newSet.has(normalizedId)) {
    newSet.delete(normalizedId)
  } else {
    newSet.add(normalizedId)
  }
  selectedMediaIds.value = newSet
}

// Helper to get comment count for a media item (including replies)
// Counts ALL comments: both top-level comments and replies
// Uses a Set to avoid double-counting if a reply appears both in the array and nested in replies
const getItemCommentCount = item => {
  if (!item.feedback || !Array.isArray(item.feedback)) return 0

  const countedIds = new Set()

  const countComments = commentList => {
    let count = 0
    for (const comment of commentList) {
      // Skip if already counted (to avoid double-counting)
      if (countedIds.has(comment.id)) {
        continue
      }

      // Count this comment (whether it's top-level or a reply)
      count++
      countedIds.add(comment.id)

      // Count nested replies recursively
      if (comment.replies && comment.replies.length > 0) {
        count += countComments(comment.replies)
      }
    }
    return count
  }

  // Count all comments in the array (both top-level and replies)
  return countComments(item.feedback)
}

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

const handleSetAsCover = async item => {
  if (!proofing.value?.id || !item?.id || isUpdatingCoverPhoto.value) return

  // For both images and videos, open focal point modal
  const coverUrl = item.file?.url || item.file?.variants?.original || item.file?.variants?.large || item.url || null
  if (!coverUrl) {
    toast.error('Invalid media', {
      description: 'Media does not have a valid URL.',
    })
    return
  }

  const existingFocalPoint = proofing.value?.coverFocalPoint ||
    proofing.value?.cover_focal_point || { x: 50, y: 50 }

  selectedMediaForCover.value = item
  focalPointImageUrl.value = coverUrl
  currentFocalPoint.value = existingFocalPoint
  showFocalPointModal.value = true
}

const handleFocalPointConfirm = async focalPoint => {
  if (!proofing.value?.id || !selectedMediaForCover.value?.id || isUpdatingCoverPhoto.value) return

  isUpdatingCoverPhoto.value = true

  try {
    const projectId = proofing.value.projectId || proofing.value.project_uuid || null
    await proofingApi.setCoverPhoto(
      projectId,
      proofing.value.id,
      selectedMediaForCover.value.id,
      focalPoint
    )

    if (proofing.value) {
      const coverUrl = focalPointImageUrl.value
      proofing.value.coverPhotoUrl = coverUrl
      proofing.value.cover_photo_url = coverUrl
      proofing.value.coverFocalPoint = focalPoint
      proofing.value.cover_focal_point = focalPoint
      proofing.value = { ...proofing.value }
    }

    toast.success('Cover photo updated', {
      description: 'The cover photo has been set successfully.',
    })
  } catch (error) {
    toast.error('Failed to set cover photo', {
      description:
        getErrorMessage(error, 'An error occurred while setting the cover photo.'),
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
        const proofingIdValue = proofing.value?.id
        const setIdValue = selectedSetId.value
        const projectIdValue = proofing.value?.projectId || null
        
        if (proofingApi && proofingApi.applyWatermarkToMedia) {
          await proofingApi.applyWatermarkToMedia(proofingIdValue, setIdValue, item.id, selectedBulkWatermark.value, projectIdValue)
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

const proofingId = computed(() => proofing.value?.id)

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
  selectedWatermark: computed(() => proofing.value?.watermarkId || 'none'),
  isApplyingWatermark,
  watermarkStore,
  mediaApi: null,
  selectionsApi: null,
  proofingApi,
  selectionId: proofingId,
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
  contextType: 'proofing',
  api: proofingApi,
  context: proofing,
  contextId: computed(() => proofing.value?.id),
  setId: selectedSetId,
  mediaItems,
  selectedMediaIds,
  sortedMediaItems,
  loadMediaItems,
  loadMediaSets: () => mediaSetsSidebar.loadMediaSets(),
  loadPhaseDetail: () => loadProofing(proofing.value?.id),
  getItemId,
  modals: {
    openDeleteModal: openDeleteModal,
    closeDeleteModal: closeDeleteModal,
    itemToDelete: itemToDelete,
    showBulkDeleteModal: showBulkDeleteModal,
    showRenameMediaModal: showRenameMediaModal,
    mediaToRename: mediaToRename,
    newMediaName: newMediaName,
    showEditModal: showEditModal,
    editAppendText: editAppendText,
    showReplacePhotoModal: showReplacePhotoModal,
    mediaToReplace: mediaToReplace,
    showMediaViewer: showMediaViewer,
  },
  loading: {
    isDeleting: isDeleting,
    isBulkDeleteLoading: isBulkDeleteLoading,
    isRenamingMedia: isRenamingMedia,
    isBulkFavoriteLoading: isBulkFavoriteLoading,
    isBulkEditLoading: isBulkEditLoading,
    isReplacingPhoto: isReplacingPhoto,
  },
  helpers: {
    selectedMediaForView: selectedMediaForView,
    currentViewIndex: currentViewIndex,
    projectId: computed(() => proofing.value?.projectId),
  },
})

const handleWatermarkMedia = handleWatermarkMediaFromComposable
const handleCancelWatermarkMedia = handleCancelWatermarkMediaFromComposable
const handleConfirmWatermarkMedia = handleConfirmWatermarkMediaFromComposable
const handleRemoveWatermark = handleRemoveWatermarkFromComposable
const confirmRemoveWatermark = confirmRemoveWatermarkFromComposable
const cancelRemoveWatermark = cancelRemoveWatermarkFromComposable
const showRemoveWatermarkConfirm = showRemoveWatermarkConfirmFromComposable
const itemToRemoveWatermark = itemToRemoveWatermarkFromComposable

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
  return item.setId ? 'Delete Media' : 'Delete Set'
}

const getDeleteModalWarning = () => {
  if (!itemToDelete.value) return null
  const item = itemToDelete.value
  
  // For media items, show location (proofing and set)
  if (item.setId) {
    const locationParts = []
    
    if (proofing.value?.name) {
      locationParts.push(`Proofing: ${proofing.value.name}`)
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
  
  const selectedItems = mediaItems.value.filter(item => 
    selectedMediaIds.value.has(getItemId(item))
  )
  
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
  
  if (proofing.value?.name) {
    locationParts.push(`Proofing: ${proofing.value.name}`)
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
  return item.setId
    ? 'This media item will be permanently deleted.\n\nThis action cannot be undone.'
    : 'This set will be permanently deleted.\n\nThis action cannot be undone.'
}

const handleAddMedia = () => {
  if (proofing.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed proofing.',
    })
    return
  }
  triggerFileInputClick(fileInputRef.value)
}

const handleBrowseFiles = () => {
  if (proofing.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed proofing.',
    })
    return
  }
  triggerFileInputClick(fileInputRef.value)
}

const handleConfirmDuplicateFiles = async () => {
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
  toast.dismiss('upload-progress')
}

const isUploading = computed(() => isUploadingFromWorkflow.value)
const showDuplicateFilesModal = ref(false)
const duplicateFiles = ref([])
const duplicateFileActions = ref({})
const duplicateFileActionsObject = ref({})
const isProcessingFiles = ref(false)
const justUploaded = ref(false)

watch(
  () => duplicateFileActionsObjectFromWorkflow,
  newVal => {
    if (newVal && typeof newVal === 'object') {
      const updated = { ...newVal }
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

  if (proofing.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed proofing.',
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
  if (proofing.value?.status === 'completed') {
    return
  }
  if (e.dataTransfer?.types?.includes('Files')) {
    e.preventDefault()
    if (selectedSetId.value && !isUploading.value && !isProcessingFiles.value) {
      isDragging.value = true
    }
  }
}

const handleDragLeave = e => {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragging.value = false
  }
}

const handleDrop = async e => {
  e.preventDefault()
  isDragging.value = false

  if (proofing.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed proofing.',
    })
    return
  }

  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return

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

const handleRetryUpload = async (fileId, retryFn) => {
  if (!retryFn || typeof retryFn !== 'function') {
    toast.error('Retry failed', {
      description: 'Invalid retry function.',
    })
    return
  }

  if (!proofing.value?.id || !selectedSetId.value) {
    toast.error('Invalid context', {
      description: 'Proofing or set not found.',
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

    await retryFn()

    await loadMediaItems()

    toast.success('Upload retried', {
      description: 'The file upload has been retried successfully.',
    })
  } catch (error) {
    toast.error('Retry failed', {
      description:
        getErrorMessage(error, 'An error occurred while retrying the upload.'),
    })
  }
}

const goBack = () => {
  router.push({ name: 'proofing' })
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
