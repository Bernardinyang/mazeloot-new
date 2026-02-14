<template>
  <PhaseLayout phase-type="proofing">
    <template #topNav>
      <ProofingTopNav :go-back="() => $emit('goBack')" :overall-progress="props.overallProgress" :phase-type="phaseType" />
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
          :set-limit-reached="props.setLimitReached"
        />
      </ProofingSidebar>
    </template>

    <template #content>
      <slot name="content" />
    </template>

    <template #shareModal>
      <ShareModal
        v-model="headerStore.showShareModal"
        route-name="clientProofing"
        :route-params="{ domain: proofing?.brandingDomain || undefined }"
        :route-query="{ proofingId: proofing?.id || '' }"
        title="Share Proofing"
        description="Share this proofing with your client via link, QR code, WhatsApp, or email."
        :password="proofing?.password || ''"
        password-description="Share this password with visitors to access this proofing"
        :item-name="proofing?.name || 'Proofing'"
        qr-code-description="Scan this QR code to access the proofing"
        :download-file-name="`proofing-${proofing?.id || 'qr'}-qr-code.png`"
      />
    </template>
  </PhaseLayout>
</template>

<script setup>
import PhaseLayout from '@/shared/layouts/PhaseLayout.vue'
import ProofingSidebar from '@/domains/memora/components/organisms/ProofingSidebar.vue'
import ProofingTopNav from '@/domains/memora/components/organisms/ProofingTopNav.vue'
import ProofingSidebarPanels from '@/domains/memora/components/organisms/ProofingSidebarPanels.vue'
import ShareModal from '@/shared/components/organisms/ShareModal.vue'
import { computed, provide, ref, watch } from 'vue'
import { useProofingMediaSetsSidebarStore } from '@/domains/memora/stores/proofingMediaSetsSidebar'
import { useProofingStore } from '@/domains/memora/stores/proofing'
import { useProofingHeaderStore } from '@/domains/memora/stores/proofingHeader'
import { useRoute } from 'vue-router'
import { useSidebarCollapse } from '@/shared/composables/useSidebarCollapse'
import { darkenColor, getAccentColor } from '@/shared/utils/colors'

const props = defineProps({
  proofing: { type: [Object, null], default: null },
  isLoading: { type: Boolean, required: true },
  overallProgress: { type: Object, default: null },
  setLimitReached: { type: Boolean, default: false },
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

const phaseType = 'proofing'

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
