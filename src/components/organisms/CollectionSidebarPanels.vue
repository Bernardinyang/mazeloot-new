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
      @select-set="mediaSetsSidebar.selectedSetId = $event"
      @edit-set="mediaSetsSidebar.handleEditSet($event)"
      @delete-set="mediaSetsSidebar.requestDeleteSet($event)"
      @save-set-name="mediaSetsSidebar.saveSetName($event)"
      @cancel-set-name-edit="mediaSetsSidebar.cancelSetNameEdit"
      @set-drag-start="mediaSetsSidebar.handleSetDragStart($event)"
      @set-drag-over="mediaSetsSidebar.handleSetDragOver($event)"
      @set-drag-leave="mediaSetsSidebar.handleSetDragLeave"
      @set-drop="mediaSetsSidebar.handleSetDrop($event)"
      @set-drag-end="mediaSetsSidebar.handleSetDragEnd"
      @update:editing-set-name="mediaSetsSidebar.editingSetName = $event"
    />
  </div>

  <!-- DESIGN Section -->
  <div v-else-if="props.activeTab === 'design' && !props.isSidebarCollapsed">
    <CollectionDesignSidebarNav
      :collection-id="props.collectionId"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
    />
  </div>
  <div v-else-if="props.activeTab === 'design' && props.isSidebarCollapsed">
    <CollectionDesignSidebarNav
      :collection-id="props.collectionId"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
    />
  </div>

  <!-- SETTINGS Section -->
  <div v-else-if="props.activeTab === 'settings' && !props.isSidebarCollapsed">
    <CollectionSettingsSidebarNav
      :collection-id="props.collectionId"
      :download-enabled="props.downloadEnabled"
      :favorite-enabled="props.favoriteEnabled"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
    />
  </div>
  <div v-else-if="props.activeTab === 'settings' && props.isSidebarCollapsed">
    <CollectionSettingsSidebarNav
      :collection-id="props.collectionId"
      :download-enabled="props.downloadEnabled"
      :favorite-enabled="props.favoriteEnabled"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
    />
  </div>

  <!-- ACTIVITIES Section -->
  <div v-else-if="props.activeTab === 'activities' && !props.isSidebarCollapsed">
    <CollectionActivitiesSidebarNav
      :collection-id="props.collectionId"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
    />
  </div>
  <div v-else-if="props.activeTab === 'activities' && props.isSidebarCollapsed">
    <CollectionActivitiesSidebarNav
      :collection-id="props.collectionId"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
    />
  </div>
</template>

<script setup>
import MediaSetsSidebarSection from '@/components/organisms/MediaSetsSidebarSection.vue'
import CollectionDesignSidebarNav from '@/components/organisms/CollectionDesignSidebarNav.vue'
import CollectionSettingsSidebarNav from '@/components/organisms/CollectionSettingsSidebarNav.vue'
import CollectionActivitiesSidebarNav from '@/components/organisms/CollectionActivitiesSidebarNav.vue'
import { useCollectionMediaSetsSidebarStore } from '@/stores/collectionMediaSetsSidebar'

const props = defineProps({
  collectionId: { type: String, default: '' },
  activeTab: { type: String, required: true },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
  downloadEnabled: { type: Boolean, default: false },
  favoriteEnabled: { type: Boolean, default: false },
})

const mediaSetsSidebar = useCollectionMediaSetsSidebarStore()
</script>
