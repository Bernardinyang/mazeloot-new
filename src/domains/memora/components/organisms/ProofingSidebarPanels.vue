<template>
  <PhaseSidebarPanels
    phase-type="proofing"
    :phase-id="props.proofingId"
    :active-tab="props.activeTab"
    :is-sidebar-collapsed="props.isSidebarCollapsed"
    :is-loading="props.isLoading"
    :disable-add-set="props.disableAddSet"
    :project-id="props.projectId"
  >
    <template #phaseTabs="{ activeTab: tab, isSidebarCollapsed: collapsed }">
      <!-- SETTINGS Section -->
      <div v-if="tab === 'settings' && !collapsed">
        <ProofingSettingsSidebarNav
          :proofing-id="props.proofingId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
      <div v-else-if="tab === 'settings' && collapsed">
        <ProofingSettingsSidebarNav
          :proofing-id="props.proofingId"
          :is-sidebar-collapsed="collapsed"
          :is-loading="props.isLoading"
        />
      </div>
    </template>
  </PhaseSidebarPanels>
</template>

<script setup>
import PhaseSidebarPanels from '@/shared/components/organisms/PhaseSidebarPanels.vue'
import ProofingSettingsSidebarNav from '@/domains/memora/components/organisms/ProofingSettingsSidebarNav.vue'

const props = defineProps({
  proofingId: { type: String, default: '' },
  projectId: { type: String, default: null },
  activeTab: { type: String, required: true },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
  disableAddSet: { type: Boolean, default: false },
})
</script>
