<template>
  <PhaseSidebarPanels
    phase-type="rawFile"
    :phase-id="props.rawFileId"
    :active-tab="props.activeTab"
    :is-sidebar-collapsed="props.isSidebarCollapsed"
    :is-loading="props.isLoading"
  >
    <template #phaseTabs="{ activeTab: tab, isSidebarCollapsed: collapsed }">
      <!-- SETTINGS Section -->
      <div v-if="tab === 'settings' && !collapsed">
        <RawFileSettingsSidebarNav
          :rawFile-id="props.rawFileId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
      <div v-else-if="tab === 'settings' && collapsed">
        <RawFileSettingsSidebarNav
          :rawFile-id="props.rawFileId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
    </template>
  </PhaseSidebarPanels>
</template>

<script setup>
import PhaseSidebarPanels from '@/shared/components/organisms/PhaseSidebarPanels.vue'
import RawFileSettingsSidebarNav from '@/domains/memora/components/organisms/RawFileSettingsSidebarNav.vue'

const props = defineProps({
  rawFileId: { type: String, default: '' },
  activeTab: { type: String, required: true },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
})
</script>
