<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Top Navigation -->
    <slot name="topNav" />

    <!-- Main Content Area (Sidebar + Content) -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar -->
      <slot name="sidebar">
        <div class="w-64 border-r border-gray-200 dark:border-gray-800">
          <slot name="sidebarContent" />
        </div>
      </slot>

      <!-- Main Content Slot -->
      <main class="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
        <slot name="content" />
      </main>
    </div>
  </div>

  <!-- Media Set Delete Confirmation (store-driven) -->
  <DeleteConfirmationModal
    v-model="mediaSetsStore.showDeleteSetModal"
    :is-deleting="mediaSetsStore.isDeletingSet"
    :item-name="mediaSetsStore.setToDelete?.name || 'Media Set'"
    description="This action cannot be undone."
    title="Delete Media Set"
    warning-message="Delete this media set?"
    @cancel="mediaSetsStore.cancelDeleteSet"
    @confirm="mediaSetsStore.confirmDeleteSet"
  />

  <!-- Create/Edit Set Modal (if applicable) -->
  <CreateEditMediaSetModal
    v-if="showCreateSetModal"
    v-model="mediaSetsStore.showCreateSetModal"
    v-model:description="mediaSetsStore.newSetDescription"
    v-model:name="mediaSetsStore.newSetName"
    v-model:selectionLimit="mediaSetsStore.newSetSelectionLimit"
    :is-creating="mediaSetsStore.isCreatingSet"
    :is-editing="!!mediaSetsStore.editingSetIdInModal"
    :context="phaseType"
    @cancel="mediaSetsStore.handleCancelCreateSet"
    @confirm="mediaSetsStore.handleCreateSet"
  />

  <!-- Share Modal (if provided) -->
  <slot name="shareModal" />
</template>

<script setup>
import { computed } from 'vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import CreateEditMediaSetModal from '@/components/organisms/CreateEditMediaSetModal.vue'
import { usePhaseMediaSetsStore } from '@/composables/usePhaseMediaSetsStore'

const props = defineProps({
  phaseType: {
    type: String,
    required: true,
    validator: value => ['collection', 'selection', 'proofing'].includes(value),
  },
  showCreateSetModal: {
    type: Boolean,
    default: true,
  },
})

const mediaSetsStore = usePhaseMediaSetsStore(props.phaseType)
</script>
