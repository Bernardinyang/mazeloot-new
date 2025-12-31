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
      :selection-status="null"
      :disable-add-set="props.disableAddSet"
      :is-copying-filenames="false"
      :set-progress="{}"
      :on-copy-selected-filenames-in-set="null"
      @add-set="mediaSetsSidebar.handleAddSet"
      @select-set="mediaSetsSidebar.handleSelectSet($event)"
      @edit-set="mediaSetsSidebar.handleEditSet($event)"
      @delete-set="mediaSetsSidebar.requestDeleteSet($event)"
      @copy-filenames="() => {}"
      @copy-selected-filenames="() => {}"
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
    <ProofingSettingsSidebarNav
      :proofing-id="props.proofingId"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
    />
  </div>
  <div v-else-if="props.activeTab === 'settings' && props.isSidebarCollapsed">
    <ProofingSettingsSidebarNav
      :proofing-id="props.proofingId"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import MediaSetsSidebarSection from '@/components/organisms/MediaSetsSidebarSection.vue'
import ProofingSettingsSidebarNav from '@/components/organisms/ProofingSettingsSidebarNav.vue'
import { useProofingMediaSetsSidebarStore } from '@/stores/proofingMediaSetsSidebar'

const props = defineProps({
  proofingId: { type: String, default: '' },
  projectId: { type: String, default: null },
  activeTab: { type: String, required: true },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
  disableAddSet: { type: Boolean, default: false },
})

const mediaSetsSidebar = useProofingMediaSetsSidebarStore()
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
</script>
