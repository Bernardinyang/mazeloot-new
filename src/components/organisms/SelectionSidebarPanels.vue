<template>
  <PhaseSidebarPanels
    phase-type="selection"
    :phase-id="props.selectionId"
    :active-tab="props.activeTab"
    :is-sidebar-collapsed="props.isSidebarCollapsed"
    :is-loading="props.isLoading"
  >
    <template #phaseTabs="{ activeTab: tab, isSidebarCollapsed: collapsed }">
      <!-- SETTINGS Section -->
      <div v-if="tab === 'settings' && !collapsed">
        <SelectionSettingsSidebarNav
          :selection-id="props.selectionId"
          :is-sidebar-collapsed="collapsed"
        />
      </div>
      <div v-else-if="tab === 'settings' && collapsed">
        <SelectionSettingsSidebarNav
          :selection-id="props.selectionId"
          :is-sidebar-collapsed="collapsed"
        />
      </div>
    </template>
  </PhaseSidebarPanels>
</template>

<script setup>
import PhaseSidebarPanels from '@/components/organisms/PhaseSidebarPanels.vue'
import SelectionSettingsSidebarNav from '@/components/organisms/SelectionSettingsSidebarNav.vue'

const props = defineProps({
  selectionId: { type: String, default: '' },
  activeTab: { type: String, required: true },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
})
</script>
