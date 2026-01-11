<template>
  <PhaseSidebarPanels
    phase-type="collection"
    :phase-id="props.collectionId"
    :active-tab="props.activeTab"
    :is-sidebar-collapsed="props.isSidebarCollapsed"
    :is-loading="props.isLoading"
    :download-enabled="props.downloadEnabled"
    :favorite-enabled="props.favoriteEnabled"
  >
    <template #phaseTabs="{ activeTab: tab, isSidebarCollapsed: collapsed }">
      <!-- DESIGN Section -->
      <div v-if="tab === 'design' && !collapsed">
        <CollectionDesignSidebarNav
          :collection-id="props.collectionId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
      <div v-else-if="tab === 'design' && collapsed">
        <CollectionDesignSidebarNav
          :collection-id="props.collectionId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>

      <!-- SETTINGS Section -->
      <div v-else-if="tab === 'settings' && !collapsed">
        <CollectionSettingsSidebarNav
          :collection-id="props.collectionId"
          :download-enabled="props.downloadEnabled"
          :favorite-enabled="props.favoriteEnabled"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
      <div v-else-if="tab === 'settings' && collapsed">
        <CollectionSettingsSidebarNav
          :collection-id="props.collectionId"
          :download-enabled="props.downloadEnabled"
          :favorite-enabled="props.favoriteEnabled"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>

      <!-- ACTIVITIES Section -->
      <div v-else-if="tab === 'activities' && !collapsed">
        <CollectionActivitiesSidebarNav
          :collection-id="props.collectionId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
      <div v-else-if="tab === 'activities' && collapsed">
        <CollectionActivitiesSidebarNav
          :collection-id="props.collectionId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
    </template>
  </PhaseSidebarPanels>
</template>

<script setup>
import PhaseSidebarPanels from '@/components/organisms/PhaseSidebarPanels.vue'
import CollectionDesignSidebarNav from '@/components/organisms/CollectionDesignSidebarNav.vue'
import CollectionSettingsSidebarNav from '@/components/organisms/CollectionSettingsSidebarNav.vue'
import CollectionActivitiesSidebarNav from '@/components/organisms/CollectionActivitiesSidebarNav.vue'

const props = defineProps({
  collectionId: { type: String, default: '' },
  activeTab: { type: String, required: true },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
  downloadEnabled: { type: Boolean, default: false },
  favoriteEnabled: { type: Boolean, default: false },
})
</script>
