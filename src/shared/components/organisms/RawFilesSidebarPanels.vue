<template>
  <PhaseSidebarPanels
    phase-type="raw_files"
    :phase-id="props.rawFilesId"
    :active-tab="props.activeTab"
    :is-sidebar-collapsed="props.isSidebarCollapsed"
    :is-loading="props.isLoading"
  >
    <template #phaseTabs="{ activeTab: tab, isSidebarCollapsed: collapsed }">
      <div v-if="tab === 'settings' && !collapsed">
        <RawFilesSettingsSidebarNav
          :raw-files-id="props.rawFilesId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
      <div v-else-if="tab === 'settings' && collapsed">
        <RawFilesSettingsSidebarNav
          :raw-files-id="props.rawFilesId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
    </template>
  </PhaseSidebarPanels>
</template>

<script setup>
import PhaseSidebarPanels from '@/shared/components/organisms/PhaseSidebarPanels.vue'
import RawFilesSettingsSidebarNav from '@/shared/components/organisms/RawFilesSettingsSidebarNav.vue'

const props = defineProps({
  rawFilesId: { type: String, default: '' },
  activeTab: { type: String, required: true },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
})
</script>
