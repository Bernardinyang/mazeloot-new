<template>
  <PhaseLayout phase-type="selection">
    <template #topNav>
      <SelectionTopNav
        :go-back="() => $emit('goBack')"
        :overall-progress="props.overallProgress"
        :on-reset-limit="props.onResetLimit"
        :is-resetting-limit="props.isResettingLimit"
        :on-copy-all-selected-filenames="props.onCopyAllSelectedFilenames"
        :selected-count="props.selectedCount"
      />
    </template>

    <template #sidebar>
      <SelectionSidebar
        :active-tab="activeTab"
        :is-loading="isLoading"
        :is-sidebar-collapsed="isSidebarCollapsed"
        :selection="selection"
        @update:is-sidebar-collapsed="isSidebarCollapsed = $event"
      >
        <SelectionSidebarPanels
          :active-tab="activeTab"
          :is-loading="isLoading"
          :is-sidebar-collapsed="isSidebarCollapsed"
          :selection-id="selection?.id || ''"
        />
      </SelectionSidebar>
    </template>

    <template #content>
      <slot name="content" />
    </template>

    <template #shareModal>
      <SelectionShareModal
        v-model="headerStore.showShareModal"
        :selection-id="selection?.id || ''"
        :selection-name="selection?.name || 'Selection'"
        :project-id="selection?.projectId || selection?.project_uuid || null"
        :password="selection?.password || ''"
      />
    </template>
  </PhaseLayout>
</template>

<script setup>
import PhaseLayout from '@/layouts/PhaseLayout.vue'
import SelectionSidebar from '../components/organisms/SelectionSidebar.vue'
import SelectionTopNav from '../components/organisms/SelectionTopNav.vue'
import SelectionSidebarPanels from '../components/organisms/SelectionSidebarPanels.vue'
import SelectionShareModal from '../components/organisms/SelectionShareModal.vue'
import { computed, provide, ref, watch } from 'vue'
import { useSelectionMediaSetsSidebarStore } from '@/stores/selectionMediaSetsSidebar'
import { useSelectionStore } from '@/stores/selection'
import { useSelectionHeaderStore } from '@/stores/selectionHeader'
import { useRoute, useRouter } from 'vue-router'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  selection: { type: [Object, null], default: null },
  isLoading: { type: Boolean, required: true },
  // Optional props for selection actions and progress
  onCopyFilenamesPerSet: { type: Function, default: null },
  onCopySelectedFilenamesInSet: { type: Function, default: null },
  onCopyAllSelectedFilenames: { type: Function, default: null },
  selectedCount: { type: Number, default: 0 },
  isCopyingFilenames: { type: Boolean, default: false },
  setProgress: { type: Object, default: () => ({}) },
  overallProgress: { type: Object, default: null },
  onResetLimit: { type: Function, default: null },
  isResettingLimit: { type: Boolean, default: false },
})

defineEmits(['goBack'])

// Provide selection actions and progress data for child components
provide('selectionActions', {
  onCopyFilenamesPerSet: props.onCopyFilenamesPerSet,
  onCopySelectedFilenamesInSet: props.onCopySelectedFilenamesInSet,
  isCopyingFilenames: computed(() => props.isCopyingFilenames),
  setProgress: computed(() => props.setProgress),
  selectionStatus: computed(() => selection.value?.status),
})

const route = useRoute()
const router = useRouter()
const selectionStore = useSelectionStore()
const headerStore = useSelectionHeaderStore()
const themeStore = useThemeStore()

// Local, mutable selection ref:
const selection = ref(props.selection)
watch(
  () => props.selection,
  s => {
    selection.value = s
    headerStore.setSelection(s)
  },
  { immediate: true }
)

const { isSidebarCollapsed } = useSidebarCollapse()

const tabFromRouteName = routeName => {
  const n = routeName?.toString?.() ?? ''
  if (n === 'selectionPhotos' || n === 'selectionPreview') return 'photos'
  if (n.startsWith('selectionSettings')) return 'settings'
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

const mediaSetsSidebar = useSelectionMediaSetsSidebarStore()

// Note: setContext is now handled by SelectionDetail.vue to avoid race conditions
// The layout watcher is kept for cases where selection changes without going through SelectionDetail
watch(
  () => selection.value?.id,
  async (id) => {
    if (!id) return

    // Only update if we're not currently saving to avoid race conditions
    if (mediaSetsSidebar.isSavingSets) {
      return
    }

    // Always fetch fresh from API, not from cached selection.mediaSets
    // Only update if the ID actually changed to avoid unnecessary fetches
    if (id && id !== mediaSetsSidebar.selectionId) {
      await mediaSetsSidebar.setContext(id, null)
    }
  },
  { immediate: false } // Changed to false - let detail views handle initial load
)
</script>
