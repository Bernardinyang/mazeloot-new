<template>
  <!-- PHOTOS Section -->
  <div v-if="props.activeTab === 'photos' && !props.isSidebarCollapsed">
    <MediaSetsSidebarSection
      :active-tab="props.activeTab"
      :drag-over-index="dragOverIndex"
      :dragged-set-id="draggedSetId"
      :editing-set-id="editingSetId"
      :editing-set-name="editingSetName"
      :is-loading="props.isLoading"
      :is-saving-sets="isSavingSets"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
      :media-sets="mediaSets"
      :selected-set-id="selectedSetId"
      :sorted-media-sets="sortedMediaSets"
      :selection-status="selectionActions.selectionStatus"
      :disable-add-set="selectionActions.selectionStatus === 'completed'"
      :is-copying-filenames="selectionActions.isCopyingFilenames"
      :set-progress="selectionActions.setProgress"
      :on-copy-selected-filenames-in-set="selectionActions.onCopySelectedFilenamesInSet"
      @add-set="mediaSetsSidebar.handleAddSet"
      @select-set="mediaSetsSidebar.handleSelectSet($event)"
      @edit-set="mediaSetsSidebar.handleEditSet($event)"
      @delete-set="mediaSetsSidebar.requestDeleteSet($event)"
      @copy-filenames="handleCopyFilenames"
      @copy-selected-filenames="handleCopySelectedFilenames"
      @save-set-name="mediaSetsSidebar.saveSetName($event)"
      @cancel-set-name-edit="mediaSetsSidebar.cancelSetNameEdit"
      @set-drag-start="
        (event, setId, index) => mediaSetsSidebar.handleSetDragStart({ setId, index })
      "
      @set-drag-over="(event, index) => mediaSetsSidebar.handleSetDragOver({ index })"
      @set-drag-leave="mediaSetsSidebar.handleSetDragLeave"
      @set-drop="(event, index) => mediaSetsSidebar.handleSetDrop({ index })"
      @set-drag-end="mediaSetsSidebar.handleSetDragEnd"
      @update:editing-set-name="mediaSetsSidebar.editingSetName = $event"
    />
  </div>

  <!-- SETTINGS Section -->
  <div v-else-if="props.activeTab === 'settings' && !props.isSidebarCollapsed">
    <SelectionSettingsSidebarNav
      :selection-id="props.selectionId"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
    />
  </div>
  <div v-else-if="props.activeTab === 'settings' && props.isSidebarCollapsed">
    <SelectionSettingsSidebarNav
      :selection-id="props.selectionId"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
    />
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { storeToRefs } from 'pinia'
import MediaSetsSidebarSection from '@/components/organisms/MediaSetsSidebarSection.vue'
import SelectionSettingsSidebarNav from '@/components/organisms/SelectionSettingsSidebarNav.vue'
import { useSelectionMediaSetsSidebarStore } from '@/stores/selectionMediaSetsSidebar'

const props = defineProps({
  selectionId: { type: String, default: '' },
  activeTab: { type: String, required: true },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
})

const mediaSetsSidebar = useSelectionMediaSetsSidebarStore()
const {
  mediaSets,
  sortedMediaSets,
  selectedSetId,
  editingSetId,
  editingSetName,
  draggedSetId,
  dragOverIndex,
  isSavingSets,
} = storeToRefs(mediaSetsSidebar)

// Inject selection actions and progress data
const selectionActions = inject('selectionActions', {
  onCopyFilenamesPerSet: null,
  onCopySelectedFilenamesInSet: null,
  isCopyingFilenames: false,
  setProgress: {},
  selectionStatus: null,
})

const handleCopyFilenames = setId => {
  if (selectionActions.onCopyFilenamesPerSet) {
    selectionActions.onCopyFilenamesPerSet(setId)
  }
}

const handleCopySelectedFilenames = setId => {
  if (selectionActions.onCopySelectedFilenamesInSet) {
    selectionActions.onCopySelectedFilenamesInSet(setId)
  }
}
</script>
