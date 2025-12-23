<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
    <SelectionTopNav :go-back="() => $emit('goBack')" />

    <!-- Main Content Area (Sidebar + Content) -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar -->
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

      <!-- Main Content Slot -->
      <main class="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
        <slot name="content" />
      </main>
    </div>
  </div>

  <!-- Share Modal -->
  <SelectionShareModal
    v-model="headerStore.showShareModal"
    :selection-id="selection?.id || ''"
    :selection-name="selection?.name || 'Selection'"
  />

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
    @cancel="mediaSetsSidebar.handleCancelCreateSet"
    @confirm="mediaSetsSidebar.handleCreateSet"
  />
</template>

<script setup>
import SelectionSidebar from '../components/organisms/SelectionSidebar.vue'
import SelectionTopNav from '../components/organisms/SelectionTopNav.vue'
import SelectionSidebarPanels from '../components/organisms/SelectionSidebarPanels.vue'
import SelectionShareModal from '../components/organisms/SelectionShareModal.vue'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import CreateEditMediaSetModal from '@/components/organisms/CreateEditMediaSetModal.vue'
import { useSelectionMediaSetsSidebarStore } from '@/stores/selectionMediaSetsSidebar'
import { useSelectionStore } from '@/stores/selection'
import { useSelectionHeaderStore } from '@/stores/selectionHeader'
import { useRoute, useRouter } from 'vue-router'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'

const props = defineProps({
  selection: { type: [Object, null], default: null },
  isLoading: { type: Boolean, required: true },
})

defineEmits(['goBack'])

const route = useRoute()
const router = useRouter()
const selectionStore = useSelectionStore()
const headerStore = useSelectionHeaderStore()

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

const activeTab = computed(() => tabFromRouteName(route.name))

const mediaSetsSidebar = useSelectionMediaSetsSidebarStore()

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
  () => [selection.value?.id, selection.value?.mediaSets],
  ([id, sets]) => {
    if (!id) return

    // Only update if we're not currently saving to avoid race conditions
    if (mediaSetsSidebar.isSavingSets) {
      return
    }

    // If IDs match, update context
    if (id === mediaSetsSidebar.selectionId) {
      // Only update if the sets are actually different to avoid unnecessary updates
      const currentSets = JSON.stringify(mediaSetsSidebar.mediaSets)
      const newSets = JSON.stringify(sets || [])
      if (currentSets !== newSets) {
        mediaSetsSidebar.setContext(id, sets || [])
      }
    } else {
      // If IDs don't match, always set context (new selection loaded)
      mediaSetsSidebar.setContext(id, sets || [])
    }
  },
  { immediate: true }
)
</script>
