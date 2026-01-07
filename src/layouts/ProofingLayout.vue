<template>
  <PhaseLayout phase-type="proofing">
    <template #topNav>
      <ProofingTopNav :go-back="() => $emit('goBack')" :overall-progress="props.overallProgress" />
    </template>

    <template #sidebar>
      <ProofingSidebar
        :active-tab="activeTab"
        :is-loading="isLoading"
        :is-sidebar-collapsed="isSidebarCollapsed"
        :proofing="proofing"
        @update:is-sidebar-collapsed="isSidebarCollapsed = $event"
      >
        <ProofingSidebarPanels
          :active-tab="activeTab"
          :is-loading="isLoading"
          :is-sidebar-collapsed="isSidebarCollapsed"
          :proofing-id="proofing?.id || ''"
          :project-id="proofing?.projectId || null"
          :disable-add-set="proofing?.status === 'completed'"
        />
      </ProofingSidebar>
    </template>

    <template #content>
      <slot name="content" />
    </template>

    <template #shareModal>
      <ProofingShareModal
        v-model="headerStore.showShareModal"
        :proofing-id="proofing?.id || ''"
        :proofing-name="proofing?.name || 'Proofing'"
        :project-id="proofing?.projectId || proofing?.project_uuid || null"
        :password="proofing?.password || ''"
      />
    </template>
  </PhaseLayout>
</template>

<script setup>
import PhaseLayout from '@/layouts/PhaseLayout.vue'
import ProofingSidebar from '../components/organisms/ProofingSidebar.vue'
import ProofingTopNav from '../components/organisms/ProofingTopNav.vue'
import ProofingSidebarPanels from '../components/organisms/ProofingSidebarPanels.vue'
import ProofingShareModal from '../components/organisms/ProofingShareModal.vue'
import { computed, provide, ref, watch } from 'vue'
import { useProofingMediaSetsSidebarStore } from '@/stores/proofingMediaSetsSidebar'
import { useProofingStore } from '@/stores/proofing'
import { useProofingHeaderStore } from '@/stores/proofingHeader'
import { useRoute } from 'vue-router'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { darkenColor, getAccentColor } from '@/utils/colors'

const props = defineProps({
  proofing: { type: [Object, null], default: null },
  isLoading: { type: Boolean, required: true },
  overallProgress: { type: Object, default: null },
})

defineEmits(['goBack'])

// Get proofing theme color (with fallback to accent)
const proofingColor = computed(() => {
  return props.proofing?.color || getAccentColor()
})

// Get hover color (slightly darker)
const getProofingHoverColor = () => {
  const color = proofingColor.value
  // Convert hex to RGB, darken by 10%
  const hex = color.replace('#', '')
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 20)
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 20)
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 20)
  return `rgb(${r}, ${g}, ${b})`
}

// Provide proofing color theming for child components
provide('proofingColor', proofingColor)
provide('getProofingHoverColor', getProofingHoverColor)

const route = useRoute()
const proofingStore = useProofingStore()
const headerStore = useProofingHeaderStore()

// Local, mutable proofing ref:
const proofing = ref(props.proofing)
watch(
  () => props.proofing,
  p => {
    proofing.value = p
    // Update header store with proofing data
    headerStore.setProofing(p)
  },
  { immediate: true }
)

const { isSidebarCollapsed } = useSidebarCollapse()

const tabFromRouteName = routeName => {
  const n = routeName?.toString?.() ?? ''
  if (n === 'proofingPhotos' || n === 'proofingPreview') return 'photos'
  if (n.startsWith('proofingSettings')) return 'settings'
  if (route.query?.tab) {
    return route.query.tab
  }
  return 'photos'
}

const activeTab = computed(() => {
  // Check query parameter first (for collapsed sidebar tab clicks)
  const queryTab = route.query?.tab
  if (queryTab) {
    return queryTab
  }
  // Fall back to route name
  return tabFromRouteName(route.name)
})

const mediaSetsSidebar = useProofingMediaSetsSidebarStore()

// Note: setContext is now handled by ProofingDetail.vue to avoid race conditions
// The layout watcher is kept for cases where proofing changes without going through ProofingDetail
watch(
  () => [proofing.value?.id, proofing.value?.projectId],
  async ([id, projectId]) => {
    if (!id) return

    // Only update if we're not currently saving to avoid race conditions
    if (mediaSetsSidebar.isSavingSets) {
      return
    }

    // Always fetch fresh from API, not from cached proofing.mediaSets
    // Only update if the ID actually changed to avoid unnecessary fetches
    if (id && id !== mediaSetsSidebar.proofingId) {
      await mediaSetsSidebar.setContext(id, null, projectId || null)
    }
  },
  { immediate: false } // Changed to false - let detail views handle initial load
)
</script>
