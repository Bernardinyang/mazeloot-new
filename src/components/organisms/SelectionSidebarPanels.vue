<template>
  <!-- PHOTOS Section -->
  <div v-if="props.activeTab === 'photos' && !props.isSidebarCollapsed">
    <MediaSetsSidebarSection
      :active-tab="props.activeTab"
      :drag-over-index="mediaSetsSidebar.dragOverIndex"
      :dragged-set-id="mediaSetsSidebar.draggedSetId"
      :editing-set-id="mediaSetsSidebar.editingSetId"
      :editing-set-name="mediaSetsSidebar.editingSetName"
      :is-loading="props.isLoading"
      :is-saving-sets="mediaSetsSidebar.isSavingSets"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
      :media-sets="mediaSetsSidebar.mediaSets"
      :selected-set-id="mediaSetsSidebar.selectedSetId"
      :sorted-media-sets="mediaSetsSidebar.sortedMediaSets"
      @add-set="mediaSetsSidebar.handleAddSet"
      @select-set="mediaSetsSidebar.handleSelectSet($event)"
      @edit-set="mediaSetsSidebar.handleEditSet($event)"
      @delete-set="mediaSetsSidebar.requestDeleteSet($event)"
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
</template>

<script setup>
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
</script>
