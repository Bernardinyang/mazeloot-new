<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
    <SelectionTopNav
      :selection="selection"
      :selection-status="effectiveSelectionStatus"
      :editing-name="editingName"
      :is-editing-name="isEditingName"
      :is-loading="isLoading"
      :is-saving-name="isSavingName"
      @go-back="$emit('goBack')"
      @start-editing-name="startEditingName"
      @update:editing-name="editingName = $event"
      @save-name="saveName"
      @cancel-editing-name="cancelEditingName"
      @handle-name-blur="handleNameBlur"
      @update:selection-status="selectionStatus = $event"
      @handle-status-change="handleStatusChange"
      @handle-complete="handleComplete"
      @handle-share="showShareModal = true"
    />

    <!-- Main Content Area (Sidebar + Content) -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar -->
      <SelectionSidebar
        :active-tab="activeTab"
        :selection="selection"
        :is-loading="isLoading"
        :is-sidebar-collapsed="isSidebarCollapsed"
        @update:is-sidebar-collapsed="isSidebarCollapsed = $event"
        @handle-cover-image-upload="handleCoverImageUpload"
      >
        <SelectionSidebarPanels
          :active-tab="activeTab"
          :selection-id="selection?.id || ''"
          :is-loading="isLoading"
          :is-sidebar-collapsed="isSidebarCollapsed"
        />
      </SelectionSidebar>

      <!-- Main Content Slot -->
      <main class="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
        <slot name="content" />
      </main>
    </div>
  </div>

  <!-- Share Modal -->
  <SelectionShareModal
    v-model="showShareModal"
    :selection-id="selection?.id || ''"
    :selection-name="selection?.name || 'Selection'"
  />

  <!-- Media Set Delete Confirmation (store-driven, avoids prop-drilling) -->
  <DeleteConfirmationModal
    v-model="showDeleteSetModal"
    :is-deleting="isDeletingSet"
    :item-name="setToDelete?.name || 'Media Set'"
    description="This action cannot be undone."
    title="Delete Media Set"
    warning-message="Delete this media set?"
    @cancel="mediaSetsSidebar.cancelDeleteSet"
    @confirm="mediaSetsSidebar.confirmDeleteSet"
  />

  <!-- Create/Edit Set Modal -->
  <CreateEditMediaSetModal
    v-model="showCreateSetModal"
    v-model:name="newSetName"
    v-model:description="newSetDescription"
    :is-creating="isCreatingSet"
    :is-editing="!!editingSetIdInModal"
    @cancel="mediaSetsSidebar.handleCancelCreateSet"
    @confirm="mediaSetsSidebar.handleCreateSet"
  />
</template>

<script setup>
import SelectionSidebar from '../components/organisms/SelectionSidebar.vue'
import SelectionTopNav from '../components/organisms/SelectionTopNav.vue'
import SelectionSidebarPanels from '../components/organisms/SelectionSidebarPanels.vue'
import SelectionShareModal from '../components/organisms/SelectionShareModal.vue'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import CreateEditMediaSetModal from '@/components/organisms/CreateEditMediaSetModal.vue'
import { useSelectionMediaSetsSidebarStore } from '@/stores/selectionMediaSetsSidebar'
import { useSelectionStore } from '@/stores/selection'
import { useSelectionHeaderActions } from '@/composables/useSelectionHeaderActions'
import { useRoute, useRouter } from 'vue-router'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useSelectionCoverActions } from '@/composables/useSelectionCoverActions'
import { createThumbnailFromDataURL } from '@/utils/media/createThumbnailFromDataURL'

const props = defineProps({
  selection: { type: [Object, null], default: null },
  isLoading: { type: Boolean, required: true },
})

defineEmits(['goBack'])

const route = useRoute()
const router = useRouter()
const selectionStore = useSelectionStore()

// Local, mutable selection ref:
const selection = ref(props.selection)
watch(
  () => props.selection,
  s => {
    selection.value = s
  },
  { immediate: true }
)

// Sidebar collapse state (persisted, owned by the layout for consistency across all selection pages)
const { isSidebarCollapsed } = useSidebarCollapse()

const tabFromRouteName = routeName => {
  const n = routeName?.toString?.() ?? ''
  if (n === 'selectionPhotos' || n === 'selectionPreview') return 'photos'
  if (n.startsWith('selectionSettings')) return 'settings'
  // Check query parameter for tab
  if (route.query?.tab) {
    return route.query.tab
  }
  return 'photos'
}

const activeTab = computed(() => tabFromRouteName(route.name))

// Header state is now owned by the layout (reduces prop drilling)
const isEditingName = ref(false)
const editingName = ref('')
const isSavingName = ref(false)
const isBlurringName = ref(false)
const nameInputRef = ref(null)

const selectionStatus = ref('draft') // 'draft' | 'completed'
const isSavingStatus = ref(false)

const mediaSetsSidebar = useSelectionMediaSetsSidebarStore()

// Share modal state
const showShareModal = ref(false)

// Use storeToRefs for reactive properties
const {
  showDeleteSetModal,
  setToDelete,
  isDeletingSet,
  showCreateSetModal,
  newSetName,
  newSetDescription,
  isCreatingSet,
  editingSetIdInModal,
} = storeToRefs(mediaSetsSidebar)

const effectiveSelectionStatus = computed(() => {
  return selectionStatus.value
})

watch(
  () => selection.value,
  s => {
    if (!s) return
    selectionStatus.value = s.status === 'completed' ? 'completed' : 'draft'
  },
  { immediate: true }
)

watch(
  () => [selection.value?.id, selection.value?.mediaSets],
  ([id, sets]) => {
    if (!id) return

    // Only update if we're not currently saving to avoid race conditions
    if (mediaSetsSidebar.isSavingSets) {
      return
    }

    // If IDs match, update context
    if (id === mediaSetsSidebar.selectionId) {
      // Only update if the sets are actually different to avoid unnecessary updates
      const currentSets = JSON.stringify(mediaSetsSidebar.mediaSets)
      const newSets = JSON.stringify(sets || [])
      if (currentSets !== newSets) {
        mediaSetsSidebar.setContext(id, sets || [])
      }
    } else {
      // If IDs don't match, always set context (new selection loaded)
      mediaSetsSidebar.setContext(id, sets || [])
    }
  },
  { immediate: true }
)

const {
  handleComplete,
  handleStatusChange,
  startEditingName,
  cancelEditingName,
  handleNameBlur,
  saveName,
} = useSelectionHeaderActions({
  selection,
  selectionStatus,
  isSavingStatus,
  isEditingName,
  editingName,
  isSavingName,
  isBlurringName,
  nameInputRef,
  selectionStore,
  route,
  router,
  description: 'An unknown error occurred',
})

const { handleCoverImageUpload } = useSelectionCoverActions({
  selection,
  selectionStore,
  createThumbnailFromDataURL,
  description: 'The cover photo has been updated.',
})
</script>
