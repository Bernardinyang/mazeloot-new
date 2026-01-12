<template>
  <!-- Settings View -->
  <RawFilesSettingsGeneral
    v-if="route.query?.tab === 'settings' && route.query?.section === 'general'"
  />

  <!-- Default Photos View -->
  <RawFilesLayout
    v-else
    :is-loading="isLoading || isUpdatingCoverPhoto"
    :raw-files="rawFiles"
    @go-back="goBack"
  >
    <template #content>
      <input
        ref="fileInputRef"
        accept="image/*,video/*,audio/*,.cr2,.nef,.arw,.dng,.raf,.rw2,.orf,.pef,.3fr,.crw,.mrw,.srw,.x3f,.heic,.heif,.mov,.mts,.m2ts,.mod,.tod,.mxf,.avchd,.mp4,.avi,.mkv,.flv,.3gp,.3g2,.m4v,.wmv,.dv,.ts,.trp,.mp3,.wav,.aac,.flac,.m4a,.ogg,.amr,.aiff,.wma,.zip,.rar,.7z,.tar,.gz"
        class="hidden"
        multiple
        type="file"
        :disabled="rawFiles?.status === 'completed'"
        @change="handleFileSelect"
      />

      <main
        class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-all duration-300 relative"
        :class="isDragging ? 'ring-4 ring-accent/20' : ''"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
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
        <ContentLoader v-if="isLoading" message="Loading raw files..." />

        <div v-else class="p-8">
          <!-- Header Skeleton when loading and no set selected -->
          <div v-if="isLoadingMedia && !selectedSetId" class="mb-6">
            <div class="h-8 w-64 rounded-lg bg-gray-200/70 dark:bg-gray-800/70 animate-pulse mb-4"></div>
            <div class="flex items-center gap-3 flex-wrap">
              <div class="h-9 w-24 rounded-lg bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"></div>
              <div class="h-9 w-24 rounded-lg bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"></div>
              <div class="h-9 w-32 rounded-lg bg-gray-200/70 dark:bg-gray-800/70 animate-pulse ml-auto"></div>
            </div>
          </div>
          <MediaItemsHeaderBar
            v-else-if="selectedSetId"
            :is-uploading="isUploading"
            :selected-count="selectedCountInCurrentSet"
            :title="selectedSet?.name || 'All Media'"
            :total-items="sortedMediaItems.length"
            :selection-status="rawFiles?.status"
            :disable-upload="rawFiles?.status === 'completed'"
            :view-mode="viewMode"
            :grid-size="gridSize"
            :sort-order="sortOrder"
            :show-filename="showFilename"
            store-type="raw_files"
            @toggle-select-all="handleToggleSelectAll"
            @add-media="handleAddMedia"
            @update:view-mode="viewMode = $event; saveDisplaySettings()"
            @update:grid-size="gridSize = $event; saveDisplaySettings()"
            @update:sort-order="sortOrder = $event; saveDisplaySettings()"
            @update:show-filename="showFilename = $event; saveDisplaySettings()"
          />

          <BulkActionsBar
            v-if="selectedSetId"
            :is-all-selected="selectedMediaIds.size === sortedMediaItems.length"
            :selected-count="selectedMediaIds.size"
            :disable-actions="rawFiles?.status === 'completed'"
            @delete="handleBulkDelete"
            @edit="handleBulkEdit"
            @view="handleBulkView"
            @copy-filenames="handleBulkCopyFilenames"
            @clear-selection="selectedMediaIds = new Set()"
            @select-all="handleToggleSelectAll"
          />

          <!-- Loading Skeleton -->
          <div v-if="selectedSetId && isLoadingMedia" class="mb-8">
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
                v-for="i in 12"
                :key="`skeleton-media-${i}`"
                class="aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
              >
                <div class="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse"></div>
              </div>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="i in 6"
                :key="`skeleton-row-${i}`"
                class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
              >
                <div class="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse flex-shrink-0"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse"></div>
                  <div class="h-3 w-1/2 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse"></div>
                </div>
              </div>
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
                :show-filename="showFilename"
                :selection-status="rawFiles?.status"
                :show-management-actions="rawFiles?.status !== 'completed'"
                :phase-type="'raw_files'"
                :show-selection-checkbox="false"
                @delete="handleDeleteMedia(item)"
                @move-copy="handleMoveCopy(item)"
                @download="handleDownloadMedia(item)"
                @copy-filenames="handleCopyFilenames(item)"
                @star-click="handleStarMedia(item)"
                @open="handleOpenMedia(item)"
                @rename="handleRenameMedia(item)"
                @replace="handleReplacePhoto(item)"
                @toggle-selection="handleToggleMediaSelection(getItemId(item))"
                @open-viewer="openMediaViewer(item)"
                @view-details="handleViewDetails(item)"
                @image-error="handleImageError"
              />
            </TransitionGroup>
            <TransitionGroup v-else class="space-y-2" name="media-list" tag="div">
              <MediaListItemRow
                v-for="item in sortedMediaItems"
                :key="item.id"
                :is-selected="selectedMediaIds.has(getItemId(item))"
                :item="item"
                :placeholder-image="placeholderImage"
                :show-filename="showFilename"
                :selection-status="rawFiles?.status"
                :show-management-actions="rawFiles?.status !== 'completed'"
                :subtitle="formatMediaDate(item.createdAt)"
                :phase-type="'raw_files'"
                :show-selection-checkbox="false"
                @delete="handleDeleteMedia(item)"
                @download="handleDownloadMedia(item)"
                @copy-filenames="handleCopyFilenames(item)"
                @star-click="handleStarMedia(item)"
                @open="handleOpenMedia(item)"
                @rename="handleRenameMedia(item)"
                @replace="handleReplacePhoto(item)"
                @move-copy="handleMoveCopy(item)"
                @toggle-selection="handleToggleMediaSelection(getItemId(item))"
                @open-viewer="openMediaViewer(item)"
                @view-details="handleViewDetails(item)"
                @image-error="handleImageError"
              />
            </TransitionGroup>

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

          <div
            v-if="
              !isLoadingMedia &&
              rawFiles &&
              rawFiles.status !== 'completed' &&
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
              message="No sets in this raw files phase"
              @action="mediaSetsSidebar.handleAddSet"
            />
          </div>
          <MediaUploadDropzone
            v-else-if="
              !isLoadingMedia &&
              rawFiles &&
              rawFiles.status !== 'completed' &&
              mediaSets.length > 0
            "
            v-model:is-dragging="isDragging"
            :is-empty="sortedMediaItems.length === 0"
            @browse="handleBrowseFiles"
            @drop="handleDrop"
          />
          <div
            v-else-if="sortedMediaItems.length === 0 && !isLoadingMedia"
            class="text-center py-16"
          >
            <p :class="theme.textSecondary" class="text-lg mb-4">
              No media in this raw files phase yet
            </p>
            <p :class="theme.textTertiary" class="text-sm">
              <span v-if="rawFiles && rawFiles.status === 'completed'">
                This raw files phase has been completed.
              </span>
              <span v-else>Select a set from the sidebar or upload media to get started.</span>
            </p>
          </div>
        </div>
      </main>

      <CreateEditMediaSetModal
        v-model="mediaSetsSidebar.showCreateSetModal"
        v-model:description="mediaSetsSidebar.newSetDescription"
        v-model:name="mediaSetsSidebar.newSetName"
        context="raw_files"
        :is-creating="mediaSetsSidebar.isCreatingSet"
        :is-editing="!!mediaSetsSidebar.editingSetIdInModal"
        @cancel="mediaSetsSidebar.handleCancelCreateSet"
        @confirm="mediaSetsSidebar.handleCreateSet"
      />

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

      <DeleteConfirmationModal
        v-model="showBulkDeleteModal"
        :is-deleting="isBulkDeleteLoading"
        :item-name="`${selectedMediaIds.size} item${selectedMediaIds.size > 1 ? 's' : ''}`"
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

      <DuplicateFilesModal
        :key="duplicateFileActionsKey"
        v-model="showDuplicateFilesModal"
        :duplicate-file-actions="duplicateFileActionsObject"
        :duplicate-files="duplicateFiles"
        :is-uploading="isUploadingFromWorkflow"
        @cancel="cancelDuplicateFiles"
        @confirm="confirmDuplicateFiles"
        @set-action="setDuplicateAction"
        @replace-all="replaceAllDuplicates"
        @skip-all="skipAllDuplicates"
      />

      <UploadProgressBar
        v-model="showUploadProgress"
        :is-uploading="isUploadingFromWorkflow"
        :overall-progress="overallProgressFromWorkflow"
        :upload-errors="uploadErrorsFromWorkflow"
        :upload-progress="uploadProgressFromWorkflow"
        @cancel="cancelUploadFromWorkflow"
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
        :raw-files-id="rawFiles?.id || rawFiles?.uuid"
        :set-id="selectedSetId || null"
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
        context="raw_files"
        :available-collections="availableRawFiles"
        :current-collection-id="rawFiles?.id || ''"
        :current-collection-name="rawFiles?.name || ''"
        :target-collection-id="targetRawFilesId"
        :target-collection-sets="targetRawFilesSets"
        :is-loading-sets="isLoadingTargetSets"
        :target-set-id="targetSetId"
        :is-moving="isMovingMedia"
        :selected-count="selectedMediaIds.size"
        @raw-files-change="handleTargetRawFilesChange"
        @update:target-set-id="targetSetId = $event"
        @cancel="handleCancelMoveCopy"
        @confirm="handleConfirmMoveCopy"
      />
    </template>
  </RawFilesLayout>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RawFilesLayout from '@/shared/layouts/RawFilesLayout.vue'
import DeleteConfirmationModal from '@/domains/memora/modals/DeleteConfirmationModal.vue'
import BulkActionsBar from '@/shared/components/molecules/BulkActionsBar.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import MediaItemsHeaderBar from '@/shared/components/organisms/MediaItemsHeaderBar.vue'
import MediaGridItemCard from '@/shared/components/organisms/MediaGridItemCard.vue'
import MediaUploadDropzone from '@/shared/components/organisms/MediaUploadDropzone.vue'
import MediaListItemRow from '@/shared/components/organisms/MediaListItemRow.vue'
import MediaDetailSidebar from '@/shared/components/organisms/MediaDetailSidebar.vue'
import CreateEditMediaSetModal from '@/domains/memora/modals/CreateEditMediaSetModal.vue'
import DuplicateFilesModal from '@/domains/memora/modals/DuplicateFilesModal.vue'
import UploadProgressBar from '@/shared/components/organisms/UploadProgressBar.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import ContentLoader from '@/shared/components/molecules/ContentLoader.vue'
import RenameMediaModal from '@/domains/memora/modals/RenameMediaModal.vue'
import EditFilenamesModal from '@/domains/memora/modals/EditFilenamesModal.vue'
import ReplacePhotoModal from '@/domains/memora/modals/ReplacePhotoModal.vue'
import MediaLightbox from '@/shared/components/organisms/MediaLightbox.vue'
import MoveCopyModal from '@/domains/memora/modals/MoveCopyModal.vue'
import { formatMediaDate } from '@/shared/utils/media/formatMediaDate'
import { FolderPlus, ImagePlus, Plus } from 'lucide-vue-next'
import { triggerFileInputClick } from '@/shared/utils/media/triggerFileInputClick'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles.js'
import { toast } from '@/shared/utils/toast'
import Pagination from '@/shared/components/molecules/Pagination.vue'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination.js'
import { useRawFilesMediaSetsSidebarStore } from '@/domains/memora/stores/rawFilesMediaSetsSidebar'
import RawFilesSettingsGeneral from '@/domains/memora/views/user/memora/rawFiles/settings/General.vue'
import { storeToRefs } from 'pinia'
import { useRawFilesWorkflow } from '@/domains/memora/composables/useRawFilesWorkflow'
import { useMediaActions } from '@/domains/memora/composables/useMediaActions'

const theme = useThemeClasses()
const route = useRoute()
const router = useRouter()
const rawFilesApi = useRawFilesApi()
const mediaSetsSidebar = useRawFilesMediaSetsSidebarStore()

const { selectedSetId, sortedMediaSets } = storeToRefs(mediaSetsSidebar)
const mediaSets = computed(() => mediaSetsSidebar.mediaSets)

const rawFiles = ref(null)
const isDragging = ref(false)
const selectedMediaIds = ref(new Set())
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const isDeleting = ref(false)
const isBulkDeleteLoading = ref(false)
const isBulkEditLoading = ref(false)
const isUpdatingCoverPhoto = ref(false)
const selectedMedia = ref(null)
const selectedMediaForView = ref([])
const currentViewIndex = ref(0)
const showMediaViewer = ref(false)
const showMediaDetailSidebar = ref(false)
const selectedMediaForDetails = ref(null)
const showBulkDeleteModal = ref(false)
const showEditModal = ref(false)
const editAppendText = ref('')
const showRenameMediaModal = ref(false)
const mediaToRename = ref(null)
const newMediaName = ref('')
const isRenamingMedia = ref(false)
const showReplacePhotoModal = ref(false)
const mediaToReplace = ref(null)
const isReplacingPhoto = ref(false)

// Move/Copy modal state
const showMoveCopyModal = ref(false)
const moveCopyAction = ref('move')
const isMovingMedia = ref(false)
const targetRawFilesId = ref('')
const targetSetId = ref('')
const availableRawFiles = ref([])
const isLoadingRawFiles = ref(false)
const targetRawFilesSets = ref([])
const isLoadingTargetSets = ref(false)

// Display settings with localStorage persistence
const getDisplaySettingsKey = () => {
  const rawFilesId = route.params.id
  return rawFilesId ? `rawFiles_${rawFilesId}_display` : null
}

const loadDisplaySettings = () => {
  const key = getDisplaySettingsKey()
  if (!key) return

  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      const settings = JSON.parse(saved)
      if (settings.viewMode) viewMode.value = settings.viewMode
      if (settings.gridSize) gridSize.value = settings.gridSize
      if (settings.showFilename !== undefined) showFilename.value = settings.showFilename
      if (settings.sortOrder) sortOrder.value = settings.sortOrder
    }
  } catch (error) {
    console.error('Error loading display settings:', error)
  }
}

const saveDisplaySettings = () => {
  const key = getDisplaySettingsKey()
  if (!key) return

  try {
    const settings = {
      viewMode: viewMode.value,
      gridSize: gridSize.value,
      showFilename: showFilename.value,
      sortOrder: sortOrder.value,
    }
    localStorage.setItem(key, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving display settings:', error)
  }
}

const viewMode = ref('grid')
const gridSize = ref('medium')
const showFilename = ref(true)
const sortOrder = ref('uploaded-new-old')

const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='

const handleImageError = event => {
  const img = event.target
  if (img.src !== placeholderImage) {
    img.src = placeholderImage
  }
}

const isLoading = ref(false)
const isLoadingMedia = ref(false)
const mediaItems = ref([])
const showUploadProgress = ref(false)
const showDuplicateFilesModal = ref(false)
const duplicateFiles = ref([])
const duplicateFileActions = ref(new Map())
const duplicateFileActionsObject = ref({})
const duplicateFileActionsKey = ref(0)

const selectedSet = computed(() => {
  if (!selectedSetId.value) return null
  return mediaSets.value.find(s => s.id === selectedSetId.value)
})

const sortedMediaItems = computed(() => {
  const items = [...mediaItems.value]
  
  if (!sortOrder.value || sortOrder.value === 'uploaded-new-old') {
    return items.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0)
      const dateB = new Date(b.createdAt || 0)
      return dateB - dateA
    })
  }
  
  if (sortOrder.value === 'uploaded-old-new') {
    return items.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0)
      const dateB = new Date(b.createdAt || 0)
      return dateA - dateB
    })
  }
  
  if (sortOrder.value === 'name-a-z') {
    return items.sort((a, b) => {
      const nameA = (a.filename || a.title || '').toLowerCase()
      const nameB = (b.filename || b.title || '').toLowerCase()
      return nameA.localeCompare(nameB)
    })
  }
  
  if (sortOrder.value === 'name-z-a') {
    return items.sort((a, b) => {
      const nameA = (a.filename || a.title || '').toLowerCase()
      const nameB = (b.filename || b.title || '').toLowerCase()
      return nameB.localeCompare(nameA)
    })
  }
  
  if (sortOrder.value === 'date-taken-new-old') {
    return items.sort((a, b) => {
      const dateA = new Date(a.dateTaken || a.createdAt || 0)
      const dateB = new Date(b.dateTaken || b.createdAt || 0)
      return dateB - dateA
    })
  }
  
  if (sortOrder.value === 'date-taken-old-new') {
    return items.sort((a, b) => {
      const dateA = new Date(a.dateTaken || a.createdAt || 0)
      const dateB = new Date(b.dateTaken || b.createdAt || 0)
      return dateA - dateB
    })
  }
  
  if (sortOrder.value === 'random') {
    return items.sort(() => Math.random() - 0.5)
  }
  
  // Default: order field
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

const selectedCountInCurrentSet = computed(() => {
  return selectedMediaIds.size
})

const loadRawFiles = async () => {
  const rawFilesId = route.params.id
  if (!rawFilesId) return

  isLoading.value = true
  try {
    const rawFilesData = await rawFilesApi.fetchRawFiles(rawFilesId)
    rawFiles.value = rawFilesData

    await mediaSetsSidebar.setContext(rawFilesId, null)
    await nextTick()

    let targetSetId = null
    if (route.query.setId) {
      const setIdFromRoute = route.query.setId
      const matchingSet = mediaSetsSidebar.mediaSets.find(s => s.id === setIdFromRoute)
      if (matchingSet) {
        targetSetId = setIdFromRoute
      }
    }

    if (!targetSetId && mediaSetsSidebar.mediaSets.length > 0) {
      targetSetId = mediaSetsSidebar.selectedSetId || mediaSetsSidebar.mediaSets[0].id
    }

    if (targetSetId && mediaSetsSidebar.selectedSetId !== targetSetId) {
      mediaSetsSidebar.handleSelectSet(targetSetId)
      await nextTick()
    }

    const finalSelectedSetId = mediaSetsSidebar.selectedSetId || selectedSetId.value
    if (finalSelectedSetId) {
      await loadMediaItems()
    } else {
      mediaItems.value = []
    }
    
    // Load display settings after raw files is loaded
    loadDisplaySettings()
  } catch (error) {
    console.error('Error loading raw files:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchMediaItems = async params => {
  if (!selectedSetId.value) return { data: [], pagination: { total: 0, page: 1, limit: 50 } }
  const response = await rawFilesApi.fetchSetMedia(route.params.id, selectedSetId.value, params)
  return {
    data: Array.isArray(response) ? response : response.data || [],
    pagination: response.pagination || { total: 0, page: 1, limit: 50 },
  }
}

const {
  data: mediaItemsData,
  pagination: mediaPagination,
  isLoading: isLoadingMediaData,
  fetch: fetchMedia,
  goToPage: goToMediaPage,
  setPerPage: setMediaPerPage,
} = useAsyncPagination(fetchMediaItems, {
  initialPage: 1,
  initialPerPage: 50,
  autoFetch: false,
})

watch(mediaItemsData, newItems => {
  mediaItems.value = newItems || []
})

watch(isLoadingMediaData, val => {
  isLoadingMedia.value = val
})

const loadMediaItems = async () => {
  await fetchMedia()
}

watch(selectedSetId, async newSetId => {
  if (newSetId) {
    router.replace({
      query: {
        ...route.query,
        setId: newSetId,
      },
    })
    await loadMediaItems()
    selectedMediaIds.value = new Set()
  } else {
    const query = { ...route.query }
    delete query.setId
    router.replace({ query })
  }
})

watch(
  () => route.query.setId,
  setIdFromRoute => {
    if (!setIdFromRoute) {
      if (selectedSetId.value) {
        mediaSetsSidebar.handleSelectSet(null)
      }
      return
    }

    if (setIdFromRoute !== selectedSetId.value) {
      if (mediaSetsSidebar.mediaSets.some(s => s.id === setIdFromRoute)) {
        mediaSetsSidebar.handleSelectSet(setIdFromRoute)
      }
    }
  }
)

watch(
  () => route.params.id,
  () => {
    loadRawFiles()
  }
)

const goBack = () => {
  router.push({ name: 'rawFiles' })
}

const fileInputRef = ref(null)
const isProcessingFiles = ref(false)

const getItemId = item => item.id || item.uuid

// Initialize raw files workflow
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
} = useRawFilesWorkflow({
  rawFilesId: computed(() => rawFiles.value?.id),
  loadMediaItems,
  existingMedia: () => mediaItems.value,
  onUploadComplete: async results => {
    if (results.successful.length > 0) {
      await mediaSetsSidebar.loadMediaSets()
      await loadRawFiles()
    }
  },
})

// Initialize media actions
const {
  handleConfirmBulkDelete: handleConfirmBulkDeleteFromActions,
  handleConfirmEdit: handleConfirmEditFromActions,
  handleReplacePhotoFileSelect: handleReplacePhotoFileSelectFromActions,
  handleDeleteMedia: handleDeleteMediaFromActions,
  handleConfirmDeleteItem: handleConfirmDeleteItemFromActions,
  handleStarMedia,
  handleDownloadMedia: handleDownloadMediaFromActions,
  handleCopyFilenames,
  handleBulkCopyFilenames,
  handleBulkView: handleBulkViewFromActions,
  handleBulkDelete: handleBulkDeleteFromActions,
  handleBulkEdit: handleBulkEditFromActions,
  openDeleteModal,
  closeDeleteModal: closeDeleteModalFromActions,
} = useMediaActions({
  contextType: 'raw_files',
  api: rawFilesApi,
  context: rawFiles,
  contextId: computed(() => rawFiles.value?.id),
  setId: selectedSetId,
  mediaItems,
  selectedMediaIds,
  sortedMediaItems,
  loadMediaItems,
  loadMediaSets: () => mediaSetsSidebar.loadMediaSets(),
  loadPhaseDetail: loadRawFiles,
  getItemId,
  modals: {
    openDeleteModal: item => {
      itemToDelete.value = item
      showDeleteModal.value = true
    },
    closeDeleteModal: () => {
      showDeleteModal.value = false
      itemToDelete.value = null
    },
    itemToDelete,
    showBulkDeleteModal,
    showEditModal,
    editAppendText,
    showReplacePhotoModal,
    mediaToReplace,
    showMediaViewer,
  },
  loading: {
    isDeleting,
    isBulkDeleteLoading,
    isBulkEditLoading,
    isReplacingPhoto,
  },
  helpers: {
    selectedMediaForView,
    currentViewIndex,
  },
})

const handleFileSelect = async event => {
  if (isUploadingFromWorkflow.value || isProcessingFiles.value) {
    event.target.value = ''
    return
  }

  const files = Array.from(event.target.files || [])
  event.target.value = ''

  if (files.length === 0) return

  if (rawFiles.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed raw files phase.',
    })
    return
  }

  // Auto-select or create a set if none is selected
  let targetSetId = selectedSetId.value
  if (!targetSetId) {
    if (mediaSetsSidebar.mediaSets.length > 0) {
      // Auto-select the first set
      targetSetId = mediaSetsSidebar.mediaSets[0].id
      mediaSetsSidebar.handleSelectSet(targetSetId)
    } else {
      // Auto-create a default set
      try {
        const newSet = await rawFilesApi.createMediaSet(rawFiles.value.id, {
          name: 'Set 1',
          description: null,
        })
        await mediaSetsSidebar.loadMediaSets()
        targetSetId = newSet.id
        mediaSetsSidebar.handleSelectSet(targetSetId)
        await nextTick()
      } catch (error) {
        console.error('Failed to create set:', error)
        toast.error('Failed to create set', {
          description: 'Please create a set from the sidebar first.',
        })
        return
      }
    }
  }

  isProcessingFiles.value = true
  try {
    const { hasDuplicates, filesToUpload } = await processFiles(files, targetSetId)

    if (hasDuplicates) {
      return
    }

    if (filesToUpload.length > 0) {
      await uploadMediaToSet(filesToUpload, targetSetId)
    }
  } catch (error) {
    console.error('File upload error:', error)
    toast.error('Upload failed', {
      description: error.message || 'An error occurred while uploading files.',
    })
  } finally {
    isProcessingFiles.value = false
  }
}

const handleDragOver = e => {
  if (rawFiles.value?.status === 'completed') {
    return
  }
  if (e.dataTransfer?.types?.includes('Files')) {
    e.preventDefault()
    if (selectedSetId.value && !isUploadingFromWorkflow.value && !isProcessingFiles.value) {
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

  if (rawFiles.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed raw files phase.',
    })
    return
  }

  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return

  if (isUploadingFromWorkflow.value || isProcessingFiles.value) {
    return
  }

  // Auto-select or create a set if none is selected
  let targetSetId = selectedSetId.value
  if (!targetSetId) {
    if (mediaSetsSidebar.mediaSets.length > 0) {
      // Auto-select the first set
      targetSetId = mediaSetsSidebar.mediaSets[0].id
      mediaSetsSidebar.handleSelectSet(targetSetId)
    } else {
      // Auto-create a default set
      try {
        const newSet = await rawFilesApi.createMediaSet(rawFiles.value.id, {
          name: 'Set 1',
          description: null,
        })
        await mediaSetsSidebar.loadMediaSets()
        targetSetId = newSet.id
        mediaSetsSidebar.handleSelectSet(targetSetId)
        await nextTick()
      } catch (error) {
        console.error('Failed to create set:', error)
        toast.error('Failed to create set', {
          description: 'Please create a set from the sidebar first.',
        })
        return
      }
    }
  }

  isProcessingFiles.value = true
  try {
    const fileArray = Array.from(files)
    const { hasDuplicates, filesToUpload } = await processFiles(fileArray, targetSetId)

    if (hasDuplicates) {
      return
    }

    if (filesToUpload.length > 0) {
      await uploadMediaToSet(filesToUpload, targetSetId)
    }
  } catch (error) {
    console.error('File drop error:', error)
    toast.error('Upload failed', {
      description: error.message || 'An error occurred while uploading files.',
    })
  } finally {
    isProcessingFiles.value = false
  }
}

const handleAddMedia = async () => {
  if (!rawFiles.value) {
    toast.error('Raw files not loaded', {
      description: 'Please wait for the raw files to load.',
    })
    return
  }

  if (rawFiles.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed raw files phase.',
    })
    return
  }

  // Ensure we have a set selected or created
  if (!selectedSetId.value) {
    if (mediaSetsSidebar.mediaSets.length > 0) {
      const firstSetId = mediaSetsSidebar.mediaSets[0].id
      mediaSetsSidebar.handleSelectSet(firstSetId)
      await nextTick()
    } else {
      try {
        const newSet = await rawFilesApi.createMediaSet(rawFiles.value.id, {
          name: 'Set 1',
          description: null,
        })
        await mediaSetsSidebar.loadMediaSets()
        mediaSetsSidebar.handleSelectSet(newSet.id)
        await nextTick()
      } catch (error) {
        console.error('Failed to create set:', error)
        toast.error('Failed to create set', {
          description: 'Please create a set from the sidebar first.',
        })
        return
      }
    }
  }

  if (fileInputRef.value) {
    triggerFileInputClick(fileInputRef)
  } else {
    console.error('File input ref is not available')
    toast.error('Upload unavailable', {
      description: 'File input is not initialized. Please refresh the page.',
    })
  }
}

const handleBrowseFiles = async () => {
  if (!rawFiles.value) {
    toast.error('Raw files not loaded', {
      description: 'Please wait for the raw files to load.',
    })
    return
  }

  if (rawFiles.value?.status === 'completed') {
    toast.info('Upload disabled', {
      description: 'Cannot upload media to a completed raw files phase.',
    })
    return
  }

  // Ensure we have a set selected or created
  if (!selectedSetId.value) {
    if (mediaSetsSidebar.mediaSets.length > 0) {
      const firstSetId = mediaSetsSidebar.mediaSets[0].id
      mediaSetsSidebar.handleSelectSet(firstSetId)
      await nextTick()
    } else {
      try {
        const newSet = await rawFilesApi.createMediaSet(rawFiles.value.id, {
          name: 'Set 1',
          description: null,
        })
        await mediaSetsSidebar.loadMediaSets()
        mediaSetsSidebar.handleSelectSet(newSet.id)
        await nextTick()
      } catch (error) {
        console.error('Failed to create set:', error)
        toast.error('Failed to create set', {
          description: 'Please create a set from the sidebar first.',
        })
        return
      }
    }
  }

  if (fileInputRef.value) {
    triggerFileInputClick(fileInputRef)
  } else {
    console.error('File input ref is not available')
    toast.error('Upload unavailable', {
      description: 'File input is not initialized. Please refresh the page.',
    })
  }
}

const handleToggleSelectAll = () => {
  if (selectedMediaIds.size === sortedMediaItems.value.length) {
    selectedMediaIds.value = new Set()
  } else {
    selectedMediaIds.value = new Set(sortedMediaItems.value.map(item => getItemId(item)))
  }
}

const handleToggleMediaSelection = itemId => {
  if (selectedMediaIds.value.has(itemId)) {
    selectedMediaIds.value.delete(itemId)
  } else {
    selectedMediaIds.value.add(itemId)
  }
}

const handleDeleteMedia = item => {
  handleDeleteMediaFromActions(item)
}

const handleDownloadMedia = item => {
  handleDownloadMediaFromActions(item)
}

const handleOpenMedia = item => {
  openMediaViewer(item)
}

const handleRenameMedia = item => {
  mediaToRename.value = item
  newMediaName.value = item.filename || item.name || ''
  showRenameMediaModal.value = true
}

const handleReplacePhoto = item => {
  mediaToReplace.value = item
  showReplacePhotoModal.value = true
}

const handleViewDetails = item => {
  selectedMediaForDetails.value = item
  showMediaDetailSidebar.value = true
}

const openMediaViewer = item => {
  // Check if file can be opened in MediaLightbox (only images and videos)
  const mediaType = item?.type || item?.file?.type
  const canOpen = mediaType === 'image' || mediaType === 'video'
  
  if (!canOpen) {
    return
  }
  
  selectedMedia.value = item
  const index = sortedMediaItems.value.findIndex(i => getItemId(i) === getItemId(item))
  currentViewIndex.value = index >= 0 ? index : 0
  selectedMediaForView.value = sortedMediaItems.value
  showMediaViewer.value = true
}

const closeMediaViewer = () => {
  showMediaViewer.value = false
  selectedMedia.value = null
  selectedMediaForView.value = []
}

const handleBulkDelete = () => {
  handleBulkDeleteFromActions()
}

const handleBulkEdit = () => {
  handleBulkEditFromActions()
}

const handleBulkView = () => {
  handleBulkViewFromActions()
}

const handleConfirmBulkDelete = async () => {
  await handleConfirmBulkDeleteFromActions()
}

const handleCancelEdit = () => {
  showEditModal.value = false
  editAppendText.value = ''
}

const handleConfirmEdit = async () => {
  await handleConfirmEditFromActions()
}

const handleConfirmDeleteItem = async () => {
  await handleConfirmDeleteItemFromActions()
}

const closeDeleteModal = () => {
  closeDeleteModalFromActions()
}

const getItemName = item => {
  if (!item) return 'Media'
  return item.filename || item.name || 'Media'
}

const getDeleteModalTitle = () => {
  return 'Delete Media'
}

const getDeleteModalWarning = () => {
  return null
}

const getDeleteModalDescription = () => {
  return 'This action cannot be undone.'
}

const handleCancelRenameMedia = () => {
  showRenameMediaModal.value = false
  mediaToRename.value = null
  newMediaName.value = ''
}

const handleConfirmRenameMedia = async () => {
  if (!mediaToRename.value || !newMediaName.value.trim()) return
  isRenamingMedia.value = true
  try {
    await rawFilesApi.renameMedia(
      route.params.id,
      selectedSetId.value,
      getItemId(mediaToRename.value),
      newMediaName.value.trim()
    )
    await loadMediaItems()
    showRenameMediaModal.value = false
    mediaToRename.value = null
    newMediaName.value = ''
    toast.success('Media renamed')
  } catch (error) {
    toast.error('Failed to rename media', { description: error.message })
  } finally {
    isRenamingMedia.value = false
  }
}

const handleCancelReplacePhoto = () => {
  showReplacePhotoModal.value = false
  mediaToReplace.value = null
}

const handleReplacePhotoFileSelect = async file => {
  await handleReplacePhotoFileSelectFromActions(file)
}

// Sync duplicate files modal state
watch(showDuplicateModal, val => {
  showDuplicateFilesModal.value = val
})

watch(duplicateFilesFromWorkflow, val => {
  duplicateFiles.value = val
})

watch(duplicateFileActionsFromWorkflow, val => {
  duplicateFileActions.value = val
})

watch(duplicateFileActionsObjectFromWorkflow, val => {
  duplicateFileActionsObject.value = val
  duplicateFileActionsKey.value++
}, { deep: true })

// Watch upload state to control progress modal
watch(isUploadingFromWorkflow, async (val, oldVal) => {
  if (val) {
    showUploadProgress.value = true
  }
  if (!val && oldVal) {
    const hasFailedUploads = Object.values(uploadProgressFromWorkflow.value || {}).some(
      p => p.status === 'failed'
    )
    if (!hasFailedUploads) {
      setTimeout(() => {
        showUploadProgress.value = false
      }, 1000)
    }
  }
})

watch(
  () => uploadErrorsFromWorkflow.value?.length || 0,
  errorCount => {
    if (errorCount > 0 && !isUploadingFromWorkflow.value) {
      showUploadProgress.value = true
    }
  }
)

const handleRetryUpload = async (fileId, retryFn) => {
  if (!retryFn || typeof retryFn !== 'function') {
    toast.error('Retry failed', {
      description: 'Invalid retry function.',
    })
    return
  }

  if (!rawFiles.value?.id || !selectedSetId.value) {
    toast.error('Invalid context', {
      description: 'Raw files phase or set not found.',
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
        error instanceof Error ? error.message : 'An error occurred while retrying the upload.',
    })
  }
}

// Move/Copy handlers
watch(showMoveCopyModal, isOpen => {
  if (isOpen) {
    if (availableRawFiles.value.length === 0) {
      loadAvailableRawFiles()
    }
    if (rawFiles.value) {
      targetRawFilesId.value = rawFiles.value.id
      handleTargetRawFilesChange(rawFiles.value.id)
    }
  }
})

const handleMoveCopy = item => {
  // If item is provided, select it first (for single item move/copy from dropdown)
  if (item) {
    selectedMediaIds.value.clear()
    selectedMediaIds.value.add(getItemId(item))
  } else {
    // If no item provided, check if any items are already selected (for bulk move/copy)
    if (selectedMediaIds.value.size === 0) {
      toast.error('No items selected', {
        description: 'Please select at least one item to move or copy.',
      })
      return
    }
  }
  moveCopyAction.value = 'move'
  targetRawFilesId.value = rawFiles.value?.id || ''
  targetSetId.value = ''
  showMoveCopyModal.value = true
}

const loadAvailableRawFiles = async () => {
  isLoadingRawFiles.value = true
  try {
    const result = await rawFilesApi.fetchAllRawFiles({ perPage: 100 })
    availableRawFiles.value = Array.isArray(result) ? result : result?.data || []
  } catch (error) {
    availableRawFiles.value = []
    console.error('Failed to load raw files:', error)
  } finally {
    isLoadingRawFiles.value = false
  }
}

const handleTargetRawFilesChange = async rawFilesId => {
  targetRawFilesId.value = rawFilesId
  targetSetId.value = ''

  if (!rawFilesId) {
    targetRawFilesSets.value = []
    return
  }

  isLoadingTargetSets.value = true
  try {
    let allSets = []
    if (rawFilesId === rawFiles.value?.id) {
      allSets = mediaSetsSidebar.mediaSets.map(set => ({
        id: set.id,
        name: set.name,
        description: set.description,
        count: set.count,
        order: set.order,
      }))
    } else {
      const sets = await rawFilesApi.fetchMediaSets(rawFilesId)
      allSets = Array.isArray(sets) ? sets : []
    }

    if (rawFilesId === rawFiles.value?.id && selectedSetId.value) {
      targetRawFilesSets.value = allSets.filter(set => set.id !== selectedSetId.value)
    } else {
      targetRawFilesSets.value = allSets
    }

    if (targetRawFilesSets.value.length === 1) {
      targetSetId.value = targetRawFilesSets.value[0].id
    }
  } catch (error) {
    targetRawFilesSets.value = []
    toast.error('Failed to load sets', {
      description: 'Unable to load sets for the selected raw files phase.',
    })
  } finally {
    isLoadingTargetSets.value = false
  }
}

const handleCancelMoveCopy = () => {
  showMoveCopyModal.value = false
  targetRawFilesId.value = rawFiles.value?.id || ''
  targetSetId.value = ''
  targetRawFilesSets.value = []
  moveCopyAction.value = 'move'
}

const handleConfirmMoveCopy = async () => {
  if (!targetRawFilesId.value || selectedMediaIds.value.size === 0) {
    toast.error('Missing selection', {
      description: 'Please select a target raw files phase.',
    })
    return
  }

  if (!targetSetId.value) {
    toast.error('Missing set', {
      description: 'Please select a target set.',
    })
    return
  }

  isMovingMedia.value = true
  try {
    const mediaIds = Array.from(selectedMediaIds.value)
    
    if (moveCopyAction.value === 'move') {
      await rawFilesApi.moveMediaToSet(
        rawFiles.value.id,
        selectedSetId.value,
        mediaIds,
        targetSetId.value
      )
      toast.success('Media moved', {
        description: `${mediaIds.length} item${mediaIds.length > 1 ? 's' : ''} moved successfully.`,
      })
    } else {
      await rawFilesApi.copyMediaToSet(
        rawFiles.value.id,
        selectedSetId.value,
        mediaIds,
        targetSetId.value
      )
      toast.success('Media copied', {
        description: `${mediaIds.length} item${mediaIds.length > 1 ? 's' : ''} copied successfully.`,
      })
    }

    await loadMediaItems()
    await mediaSetsSidebar.loadMediaSets()
    selectedMediaIds.value.clear()
    showMoveCopyModal.value = false
  } catch (error) {
    toast.error(moveCopyAction.value === 'move' ? 'Move failed' : 'Copy failed', {
      description: error.message || 'An error occurred while moving/copying media.',
    })
  } finally {
    isMovingMedia.value = false
  }
}

// Check if photos tab is active
const isPhotosTabActive = computed(() => {
  const tab = route.query?.tab
  const routeName = route.name
  return (
    tab === 'photos' ||
    routeName === 'rawFilesPhotos' ||
    routeName === 'rawFilesPreview' ||
    (!tab && routeName !== 'rawFilesSettings')
  )
})

// Auto-select first set when photos tab is clicked and sets exist
let isUpdatingFromRoute = false
watch(
  () => route.query.tab,
  newTab => {
    // When photos tab is active and no set is selected, auto-select first set if available
    if (newTab === 'photos' || (!newTab && isPhotosTabActive.value)) {
      // Wait a bit for mediaSets to be loaded
      const checkAndSelect = () => {
        if (
          !selectedSetId.value &&
          mediaSetsSidebar.mediaSets.length > 0 &&
          !route.query.setId
        ) {
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

onMounted(async () => {
  await loadRawFiles()
})
</script>

<style scoped>
.media-grid-enter-active,
.media-grid-leave-active {
  transition: all 0.3s ease;
}

.media-grid-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.media-grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.media-list-enter-active,
.media-list-leave-active {
  transition: all 0.3s ease;
}

.media-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.media-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
