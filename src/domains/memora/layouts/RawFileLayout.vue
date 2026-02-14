<template>
  <PhaseLayout :phase-type="phaseType">
    <template #topNav>
      <RawFileTopNav
        :go-back="() => $emit('goBack')"
        :overall-progress="props.overallProgress"
        :on-reset-limit="props.onResetLimit"
        :is-resetting-limit="props.isResettingLimit"
        :on-copy-all-selected-filenames="props.onCopyAllSelectedFilenames"
        :selected-count="props.selectedCount"
        :phase-type="phaseType"
      />
    </template>

    <template #sidebar>
      <RawFileSidebar
        :active-tab="activeTab"
        :is-loading="isLoading"
        :is-sidebar-collapsed="isSidebarCollapsed"
        :rawFile="rawFile"
        @update:is-sidebar-collapsed="isSidebarCollapsed = $event"
      >
        <RawFileSidebarPanels
          :active-tab="activeTab"
          :is-loading="isLoading"
          :is-sidebar-collapsed="isSidebarCollapsed"
          :rawFile-id="rawFile?.id || ''"
          :set-limit-reached="props.setLimitReached"
        />
      </RawFileSidebar>
    </template>

    <template #content>
      <slot name="content" />
    </template>

    <template #shareModal>
      <ShareModal
        v-model="headerStore.showShareModal"
        route-name="clientRawFiles"
        :route-params="{ domain: rawFile?.brandingDomain || undefined }"
        :route-query="{ rawFileId: rawFile?.id || '' }"
        title="Share RawFile"
        description="Share this rawFile with your client via link, QR code, WhatsApp, or email."
        :password="rawFile?.password || ''"
        password-description="Share this password with visitors to access this rawFile"
        :item-name="rawFile?.name || 'RawFile'"
        qr-code-description="Scan this QR code to access the rawFile"
        :download-file-name="`rawFile-${rawFile?.id || 'qr'}-qr-code.png`"
      />
    </template>
  </PhaseLayout>
</template>

<script setup>
import PhaseLayout from '@/shared/layouts/PhaseLayout.vue'
import RawFileSidebar from '@/domains/memora/components/organisms/RawFileSidebar.vue'
import RawFileTopNav from '@/domains/memora/components/organisms/RawFileTopNav.vue'
import RawFileSidebarPanels from '@/domains/memora/components/organisms/RawFileSidebarPanels.vue'
import ShareModal from '@/shared/components/organisms/ShareModal.vue'
import { computed, provide, ref, watch } from 'vue'
import { useRawFileMediaSetsSidebarStore } from '@/domains/memora/stores/rawFileMediaSetsSidebar'
import { useRawFileStore } from '@/domains/memora/stores/rawFile'
import { useRawFileHeaderStore } from '@/domains/memora/stores/rawFileHeader'
import { useRoute, useRouter } from 'vue-router'
import { useSidebarCollapse } from '@/shared/composables/useSidebarCollapse'
import { useThemeStore } from '@/shared/stores/theme'

const props = defineProps({
  rawFile: { type: [Object, null], default: null },
  isLoading: { type: Boolean, required: true },
  // Optional props for rawFile actions and progress
  onCopyFilenamesPerSet: { type: Function, default: null },
  onCopySelectedFilenamesInSet: { type: Function, default: null },
  onCopyAllSelectedFilenames: { type: Function, default: null },
  selectedCount: { type: Number, default: 0 },
  isCopyingFilenames: { type: Boolean, default: false },
  setProgress: { type: Object, default: () => ({}) },
  overallProgress: { type: Object, default: null },
  onResetLimit: { type: Function, default: null },
  isResettingLimit: { type: Boolean, default: false },
  setLimitReached: { type: Boolean, default: false },
})

defineEmits(['goBack'])

// Provide rawFile actions and progress data for child components
provide('rawFileActions', {
  onCopyFilenamesPerSet: props.onCopyFilenamesPerSet,
  onCopySelectedFilenamesInSet: props.onCopySelectedFilenamesInSet,
  isCopyingFilenames: computed(() => props.isCopyingFilenames),
  setProgress: computed(() => props.setProgress),
  rawFileStatus: computed(() => rawFile.value?.status),
})

const route = useRoute()
const router = useRouter()
const rawFileStore = useRawFileStore()
const headerStore = useRawFileHeaderStore()
const themeStore = useThemeStore()

// Local, mutable rawFile ref:
const rawFile = ref(props.rawFile)
watch(
  () => props.rawFile,
  s => {
    rawFile.value = s
    headerStore.setRawFile(s)
  },
  { immediate: true }
)

const { isSidebarCollapsed } = useSidebarCollapse()

const tabFromRouteName = routeName => {
  const n = routeName?.toString?.() ?? ''
  if (n === 'rawFilePhotos' || n === 'rawFilePreview') return 'photos'
  if (n.startsWith('rawFileSettings')) return 'settings'
  if (route.query?.tab) {
    return route.query.tab
  }
  return 'photos'
}

const activeTab = computed(() => {
  // Check query parameter first (for collapsed sidebar tab clicks)
  // Explicitly access route.query.tab to ensure reactivity
  const queryTab = route.query?.tab
  if (queryTab) {
    return queryTab
  }
  // Fall back to route name
  return tabFromRouteName(route.name)
})

const mediaSetsSidebar = useRawFileMediaSetsSidebarStore()

const phaseType = 'rawFile'

// Note: setContext is now handled by RawFileDetail.vue to avoid race conditions
// The layout watcher is kept for cases where rawFile changes without going through RawFileDetail
watch(
  () => rawFile.value?.id,
  async (id) => {
    if (!id) return

    // Only update if we're not currently saving to avoid race conditions
    if (mediaSetsSidebar.isSavingSets) {
      return
    }

    // Always fetch fresh from API, not from cached rawFile.mediaSets
    // Only update if the ID actually changed to avoid unnecessary fetches
    if (id && id !== mediaSetsSidebar.rawFileId) {
      await mediaSetsSidebar.setContext(id, null)
    }
  },
  { immediate: false } // Changed to false - let detail views handle initial load
)
</script>
