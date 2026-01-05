<template>
  <div>
    <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <ProofingTopNav :go-back="() => $emit('goBack')" :overall-progress="props.overallProgress" />

      <!-- Main Content Area (Sidebar + Content) -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Left Sidebar -->
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

        <!-- Main Content Slot -->
        <main class="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
          <slot name="content" />
        </main>
      </div>
    </div>

    <!-- Media Set Delete Confirmation (store-driven, avoids prop-drilling) -->
    <DeleteConfirmationModal
      v-model="showDeleteSetModal"
      :is-deleting="isDeletingSet"
      :item-name="setToDelete?.name || 'Media Set'"
      description="This action cannot be undone."
      title="Delete Media Set"
      warning-message="Delete this media set?"
      @cancel="mediaSetsSidebar.cancelDeleteSet"
      @confirm="mediaSetsSidebar.confirmDeleteSet"
    />

    <!-- Create/Edit Set Modal -->
    <CreateEditMediaSetModal
      v-model="showCreateSetModal"
      v-model:description="newSetDescription"
      v-model:name="newSetName"
      :is-creating="isCreatingSet"
      :is-editing="!!editingSetIdInModal"
      context="proofing"
      @cancel="mediaSetsSidebar.handleCancelCreateSet"
      @confirm="mediaSetsSidebar.handleCreateSet"
    />

    <!-- Share Modal -->
    <ProofingShareModal
      v-model="headerStore.showShareModal"
      :proofing-id="proofing?.id || ''"
      :proofing-name="proofing?.name || 'Proofing'"
      :project-id="proofing?.projectId || proofing?.project_uuid || null"
      :password="proofing?.password || ''"
    />
  </div>
</template>

<script setup>
import ProofingSidebar from '../components/organisms/ProofingSidebar.vue'
import ProofingTopNav from '../components/organisms/ProofingTopNav.vue'
import ProofingSidebarPanels from '../components/organisms/ProofingSidebarPanels.vue'
import ProofingShareModal from '../components/organisms/ProofingShareModal.vue'
import { computed, provide, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import CreateEditMediaSetModal from '@/components/organisms/CreateEditMediaSetModal.vue'
import { useProofingMediaSetsSidebarStore } from '@/stores/proofingMediaSetsSidebar'
import { useProofingStore } from '@/stores/proofing'
import { useProofingHeaderStore } from '@/stores/proofingHeader'
import { useRoute } from 'vue-router'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { darkenColor } from '@/utils/colors'

const props = defineProps({
  proofing: { type: [Object, null], default: null },
  isLoading: { type: Boolean, required: true },
  overallProgress: { type: Object, default: null },
})

defineEmits(['goBack'])

// Get proofing theme color (with fallback to teal-500)
const proofingColor = computed(() => {
  return props.proofing?.color || '#10B981' // Default teal-500
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

// Use storeToRefs for reactive properties
const {
  showDeleteSetModal,
  setToDelete,
  isDeletingSet,
  showCreateSetModal,
  newSetName,
  newSetDescription,
  isCreatingSet,
  editingSetIdInModal,
} = storeToRefs(mediaSetsSidebar)

watch(
  () => [proofing.value?.id, proofing.value?.mediaSets, proofing.value?.projectId],
  ([id, sets, projectId]) => {
    if (!id) return

    // Only update if we're not currently saving to avoid race conditions
    if (mediaSetsSidebar.isSavingSets) {
      return
    }

    // If IDs match, update context
    if (id === mediaSetsSidebar.proofingId) {
      // Only update if the sets are actually different to avoid unnecessary updates
      const currentSets = JSON.stringify(mediaSetsSidebar.mediaSets)
      const newSets = JSON.stringify(sets || [])
      if (currentSets !== newSets) {
        mediaSetsSidebar.setContext(id, sets || [], projectId || null)
      }
    } else {
      // If IDs don't match, always set context (new proofing loaded)
      mediaSetsSidebar.setContext(id, sets || [], projectId || null)
    }
  },
  { immediate: true }
)
</script>
