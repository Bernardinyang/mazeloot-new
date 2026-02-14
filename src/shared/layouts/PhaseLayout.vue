<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Top Navigation -->
    <slot name="topNav" />

    <!-- Main Content Area (Sidebar + Content) -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Desktop Sidebar (hidden on mobile) -->
      <div class="hidden md:block shrink-0 h-full">
        <slot name="sidebar">
          <div class="w-64 h-full border-r border-gray-200 dark:border-gray-800">
            <slot name="sidebarContent" />
          </div>
        </slot>
      </div>

      <!-- Main Content Slot -->
      <main class="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden p-4 md:p-6">
        <!-- Mobile Sidebar Trigger Button -->
        <Button
          v-if="isMobile && !isMobileSidebarOpen"
          :class="['md:hidden mb-4 min-h-[44px] touch-manipulation', theme.bgButtonHover, theme.textPrimary]"
          size="sm"
          variant="outline"
          @click="isMobileSidebarOpen = true"
        >
          <Menu class="h-4 w-4 mr-2 shrink-0" />
          Menu
        </Button>
        
        <slot name="content" />
      </main>
    </div>
  </div>

  <!-- Mobile Sidebar (Sheet/Drawer) -->
  <Sheet v-model:open="isMobileSidebarOpen">
    <SheetContent
      :class="[theme.bgCard, theme.borderSecondary, 'w-[min(20rem,100vw-2rem)] p-0 max-w-[100vw]']"
      side="left"
    >
      <div class="h-full overflow-y-auto ">
        <slot name="sidebar">
          <div class="w-full border-r border-gray-200 dark:border-gray-800">
            <slot name="sidebarContent" />
          </div>
        </slot>
      </div>
    </SheetContent>
  </Sheet>

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
import { computed, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { Menu } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Sheet, SheetContent } from '@/shared/components/shadcn/sheet'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import DeleteConfirmationModal from '@/shared/components/organisms/DeleteConfirmationModal.vue'
import CreateEditMediaSetModal from '@/shared/components/organisms/CreateEditMediaSetModal.vue'
import { usePhaseMediaSetsStore } from '@/domains/memora/composables/usePhaseMediaSetsStore'

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
const theme = useThemeClasses()

const isMobile = useMediaQuery('(max-width: 768px)')
const isMobileSidebarOpen = ref(false)
</script>
