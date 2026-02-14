<template>
  <PhaseSidebarPanels
    phase-type="selection"
    :phase-id="props.selectionId"
    :active-tab="props.activeTab"
    :is-sidebar-collapsed="props.isSidebarCollapsed"
    :is-loading="props.isLoading"
    :set-limit-reached="props.setLimitReached"
  >
    <template #phaseTabs="{ activeTab: tab, isSidebarCollapsed: collapsed }">
      <!-- SETTINGS Section -->
      <div v-if="tab === 'settings' && !collapsed">
        <SelectionSettingsSidebarNav
          :selection-id="props.selectionId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
      <div v-else-if="tab === 'settings' && collapsed">
        <SelectionSettingsSidebarNav
          :selection-id="props.selectionId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
    </template>
  </PhaseSidebarPanels>
</template>

<script setup>
import PhaseSidebarPanels from '@/shared/components/organisms/PhaseSidebarPanels.vue'
import SelectionSettingsSidebarNav from '@/domains/memora/components/organisms/SelectionSettingsSidebarNav.vue'

const props = defineProps({
  selectionId: { type: String, default: '' },
  activeTab: { type: String, required: true },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
  setLimitReached: { type: Boolean, default: false },
})
</script>
