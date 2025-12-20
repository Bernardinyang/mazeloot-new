<template>
  <nav
    :class="theme.borderSecondary"
    class="flex items-center justify-between px-6 py-3.5 border-b bg-white dark:bg-gray-900 shadow-sm"
    style="min-height: 3.5rem"
  >
    <!-- Left Side: Back Button, Title/Status Section -->
    <div class="flex items-start gap-3 min-w-0">
      <!-- Section 1: Back Button -->
      <button
        :class="[theme.borderSecondary, theme.bgCard]"
        class="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 shadow-sm border hover:shadow-md hover:scale-105 active:scale-95"
        title="Go back"
        @click="handleGoBack"
      >
        <ChevronLeft class="h-5 w-5 text-gray-700 dark:text-gray-300 font-semibold" />
      </button>

      <!-- Section 2: Title and Status Row -->
      <div class="flex flex-col min-w-0">
        <div
          v-if="!isLoading"
          class="flex items-center gap-3 mb-1 group"
          style="min-height: 1.5rem"
        >
          <div class="flex items-center gap-2 min-w-0">
            <Transition mode="out-in" name="fade">
              <h1
                v-if="!isEditingName"
                key="title"
                class="text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 cursor-text hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95"
                style="line-height: 1.5rem"
                @click="headerStore.startEditingName()"
              >
                {{ selection?.name || 'Loading...' }}
              </h1>
              <div
                v-else
                key="input"
                class="flex items-center gap-2 min-w-0 animate-[fadeIn_0.2s_ease-in-out]"
                style="min-height: 1.5rem; animation: fadeIn 0.2s ease-in-out"
              >
                <input
                  ref="nameInputRef"
                  :class="theme.textPrimary"
                  v-model="editingName"
                  class="text-lg font-bold leading-tight bg-transparent border-none outline-none focus:ring-0 p-0 m-0 flex-1 min-w-0 transition-all duration-200"
                  style="height: 1.5rem; line-height: 1.5rem"
                  @blur="headerStore.handleNameBlur()"
                  @keydown.enter="headerStore.saveName()"
                  @keydown.esc="headerStore.cancelEditingName()"
                />
                <button
                  :disabled="isSavingName"
                  class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                  style="height: 1.5rem; width: 1.5rem"
                  @click="headerStore.saveName()"
                  @mousedown.prevent
                >
                  <Check v-if="!isSavingName" class="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <Loader2 v-else class="h-4 w-4 text-teal-600 dark:text-teal-400 animate-spin" />
                </button>
                <button
                  :disabled="isSavingName"
                  class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                  style="height: 1.5rem; width: 1.5rem"
                  @click="headerStore.cancelEditingName()"
                  @mousedown.prevent
                >
                  <X :class="theme.textSecondary" class="h-4 w-4" />
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Status Badge Row -->
        <div v-if="!isLoading" class="flex items-center gap-2">
          <StatusBadge :status="selectionStatus || 'draft'" />
        </div>
      </div>
    </div>

    <!-- Right Side: Actions -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <Button
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary]"
        :disabled="isLoading"
        @click="headerStore.openShareModal()"
      >
        <Share2 class="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button
        v-if="selectionStatus !== 'completed'"
        variant="default"
        size="sm"
        class="bg-teal-500 hover:bg-teal-600 text-white"
        :disabled="isLoading"
        @click="headerStore.handleComplete()"
      >
        <CheckCircle2 class="h-4 w-4 mr-2" />
        Complete Selection
      </Button>
    </div>
  </nav>
</template>

<script setup>
import { ChevronLeft, Check, X, Loader2, CheckCircle2, Share2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import StatusBadge from '@/components/molecules/StatusBadge.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { storeToRefs } from 'pinia'
import { useSelectionHeaderStore } from '@/stores/selectionHeader'

const theme = useThemeClasses()

const props = defineProps({
  goBack: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits(['goBack'])

// Use the selection header store instead of props
const headerStore = useSelectionHeaderStore()
const {
  selection,
  effectiveStatus,
  editingName,
  isEditingName,
  isLoading,
  isSavingName,
  nameInputRef,
} = storeToRefs(headerStore)

const selectionStatus = effectiveStatus

const handleGoBack = () => {
  if (props.goBack) {
    props.goBack()
  } else {
    emit('goBack')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
