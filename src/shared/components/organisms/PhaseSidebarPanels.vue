<template>
  <!-- PHOTOS Section (common across all phases) -->
  <div v-if="props.activeTab === 'photos' && !props.isSidebarCollapsed">
    <MediaSetsSidebarSection
      :active-tab="props.activeTab"
      :drag-over-index="dragOverIndex"
      :dragged-set-id="draggedSetId"
      :editing-set-id="editingSetId"
      :editing-set-name="editingSetName"
      :is-loading="props.isLoading"
      :is-saving-sets="isSavingSets"
      :is-sidebar-collapsed="props.isSidebarCollapsed"
      :media-sets="mediaSets"
      :selected-set-id="selectedSetId"
      :sorted-media-sets="sortedMediaSets"
      :selection-status="selectionStatus"
      :disable-add-set="disableAddSet"
      :is-copying-filenames="isCopyingFilenames"
      :set-progress="setProgress"
      :on-copy-selected-filenames-in-set="onCopySelectedFilenamesInSet"
      @add-set="mediaSetsStore.handleAddSet"
      @select-set="mediaSetsStore.handleSelectSet($event)"
      @edit-set="mediaSetsStore.handleEditSet($event)"
      @delete-set="mediaSetsStore.requestDeleteSet($event)"
      @copy-filenames="handleCopyFilenames"
      @copy-selected-filenames="handleCopySelectedFilenames"
      @save-set-name="mediaSetsStore.saveSetName($event)"
      @cancel-set-name-edit="mediaSetsStore.cancelSetNameEdit"
      @set-drag-start="handleSetDragStart"
      @set-drag-over="handleSetDragOver"
      @set-drag-leave="mediaSetsStore.handleSetDragLeave"
      @set-drop="handleSetDrop"
      @set-drag-end="mediaSetsStore.handleSetDragEnd"
      @update:editing-set-name="mediaSetsStore.editingSetName = $event"
    />
  </div>

  <!-- Phase-specific tabs -->
  <slot name="phaseTabs" :activeTab="props.activeTab" :isSidebarCollapsed="props.isSidebarCollapsed" />
</template>

<script setup>
import { computed, inject } from 'vue'
import { storeToRefs } from 'pinia'
import MediaSetsSidebarSection from '@/shared/components/organisms/MediaSetsSidebarSection.vue'
import { usePhaseMediaSetsStore } from '@/domains/memora/composables/usePhaseMediaSetsStore'

// Try to inject filtered media sets (for proofing detail to show only latest revisions)
const filteredMediaSets = inject('filteredMediaSets', null)

const props = defineProps({
  phaseType: {
    type: String,
    required: true,
    validator: value => ['collection', 'selection', 'proofing'].includes(value),
  },
  phaseId: { type: String, default: '' },
  activeTab: { type: String, required: true },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
  // Phase-specific props
  downloadEnabled: { type: Boolean, default: false },
  favoriteEnabled: { type: Boolean, default: false },
  disableAddSet: { type: Boolean, default: false },
  projectId: { type: String, default: null },
})

const mediaSetsStore = usePhaseMediaSetsStore(props.phaseType)
const {
  dragOverIndex,
  draggedSetId,
  editingSetId,
  editingSetName,
  isSavingSets,
  mediaSets: storeMediaSets,
  selectedSetId: selectedSetIdRef,
  sortedMediaSets: storeSortedMediaSets,
} = storeToRefs(mediaSetsStore)

// Use filtered sets if provided (for proofing detail), otherwise use store sets
const mediaSets = computed(() => filteredMediaSets?.value || storeMediaSets.value)
const sortedMediaSets = computed(() => {
  if (filteredMediaSets?.value) {
    return [...filteredMediaSets.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }
  return storeSortedMediaSets.value
})

// Ensure selectedSetId is reactive
const selectedSetId = computed(() => selectedSetIdRef.value)

// Inject phase-specific actions (for selection)
const phaseActions = inject('selectionActions', null)

const selectionStatus = computed(() => {
  if (props.phaseType === 'selection' && phaseActions) {
    return phaseActions.selectionStatus?.value || phaseActions.selectionStatus
  }
  return null
})

const disableAddSet = computed(() => {
  if (props.phaseType === 'selection' && phaseActions) {
    return selectionStatus.value === 'completed' || selectionStatus.value === 'active'
  }
  return props.disableAddSet
})

const isCopyingFilenames = computed(() => {
  if (props.phaseType === 'selection' && phaseActions) {
    return phaseActions.isCopyingFilenames?.value ?? false
  }
  return false
})

const setProgress = computed(() => {
  if (props.phaseType === 'selection' && phaseActions) {
    return phaseActions.setProgress?.value || phaseActions.setProgress || {}
  }
  return {}
})

const onCopySelectedFilenamesInSet = computed(() => {
  if (props.phaseType === 'selection' && phaseActions) {
    return phaseActions.onCopySelectedFilenamesInSet
  }
  return null
})

const handleCopyFilenames = setId => {
  if (props.phaseType === 'selection' && phaseActions?.onCopyFilenamesPerSet) {
    phaseActions.onCopyFilenamesPerSet(setId)
  }
}

const handleCopySelectedFilenames = setId => {
  if (props.phaseType === 'selection' && phaseActions?.onCopySelectedFilenamesInSet) {
    phaseActions.onCopySelectedFilenamesInSet(setId)
  }
}

const handleSetDragStart = (event, setId, index) => {
  if (props.phaseType === 'selection' || props.phaseType === 'proofing') {
    mediaSetsStore.handleSetDragStart({ setId, index })
  } else {
    mediaSetsStore.handleSetDragStart(event)
  }
}

const handleSetDragOver = (event, index) => {
  if (props.phaseType === 'selection' || props.phaseType === 'proofing') {
    mediaSetsStore.handleSetDragOver({ index })
  } else {
    mediaSetsStore.handleSetDragOver(event)
  }
}

const handleSetDrop = (event, index) => {
  if (props.phaseType === 'selection' || props.phaseType === 'proofing') {
    mediaSetsStore.handleSetDrop({ index })
  } else {
    mediaSetsStore.handleSetDrop(event)
  }
}
</script>
