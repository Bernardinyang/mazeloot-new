<template>
  <nav
    :class="[theme.borderSecondary, 'flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-3.5 border-b bg-white dark:bg-gray-900 shadow-sm gap-3 sm:gap-0 min-h-auto sm:min-h-[3.5rem]']"
  >
    <!-- Left Side: Back Button, Title/Status Section -->
    <div class="flex items-start gap-2 sm:gap-3 min-w-0 flex-1 w-full sm:w-auto">
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
        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="flex items-center gap-3 mb-1"
          style="min-height: 1.5rem"
        >
          <div class="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
        <div
          v-else
          class="flex items-center gap-3 mb-1 group"
          style="min-height: 1.5rem"
        >
          <div class="flex items-center gap-2 min-w-0">
            <Transition mode="out-in" name="fade">
              <h1
                v-if="!isEditingName"
                key="title"
                class="text-base sm:text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 cursor-text transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 hover:text-accent truncate"
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
                <Button
                  :disabled="isSavingName"
                  variant="ghost"
                  size="icon-sm"
                  class="p-1 flex-shrink-0 hover:scale-110 active:scale-95"
                  :loading="isSavingName"
                  :icon="!isSavingName ? Check : null"
                  @click="headerStore.saveName()"
                  @mousedown.prevent
                />
                <Button
                  :disabled="isSavingName"
                  variant="ghost"
                  size="icon-sm"
                  class="p-1 flex-shrink-0 hover:scale-110 active:scale-95"
                  :icon="X"
                  @click="headerStore.cancelEditingName()"
                  @mousedown.prevent
                />
              </div>
            </Transition>
          </div>
        </div>

        <!-- Status Badge Row -->
        <div v-if="!isLoading" class="flex items-center gap-2 flex-wrap">
          <StatusBadge :status="selectionStatus || 'draft'" />
          <!-- Selection Progress (when completed) -->
          <span
            v-if="selection?.status === 'completed' && overallProgress"
            :class="theme.textSecondary"
            class="text-xs font-medium"
          >
            {{ overallProgress.selected }} of {{ overallProgress.total }} selected
          </span>
          <!-- Completed by email -->
          <span
            v-if="selection?.completedByEmail"
            :class="theme.textSecondary"
            class="text-xs italic"
          >
            Completed by: {{ selection.completedByEmail }}
          </span>
        </div>
      </div>
    </div>

    <!-- Right Side Actions -->
    <div v-if="isLoading" class="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-wrap">
      <div class="h-8 sm:h-9 w-16 sm:w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-8 sm:h-9 w-20 sm:w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-8 sm:h-9 w-8 sm:w-9 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-8 sm:h-9 w-20 sm:w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    </div>
    <div v-else class="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
      <!-- Storage indicator -->
      <div
        v-if="selection?.storageUsedBytes !== undefined"
        :class="[
          'flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all',
          'bg-purple-50/50 dark:bg-purple-950/30 border-purple-200/50 dark:border-purple-800/50',
          'hover:bg-purple-100/50 dark:hover:bg-purple-900/40',
        ]"
      >
        <HardDrive class="h-3.5 w-3.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
        <span class="text-xs font-semibold text-purple-700 dark:text-purple-300">
          {{ formatBytes(selection.storageUsedBytes || 0) }}
        </span>
      </div>
      
      <Button
        v-if="props.onCopyAllSelectedFilenames && selectionStatus === 'completed'"
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary, 'shrink-0']"
        :disabled="isLoading || props.selectedCount === 0"
        @click="handleCopyAllSelectedFilenames"
      >
        <Copy class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
        <span class="hidden sm:inline">Copy Selected ({{ props.selectedCount }})</span>
        <span class="sm:hidden">Copy ({{ props.selectedCount }})</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary, 'shrink-0']"
        :disabled="isLoading"
        @click="handlePreview"
      >
        <Eye class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
        <span class="hidden sm:inline">Preview</span>
      </Button>
      <ThemeToggle class="shrink-0" />
      <Button
        v-if="selectionStatus === 'active'"
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary, 'shrink-0']"
        :disabled="isLoading"
        @click="headerStore.openShareModal()"
      >
        <Share2 class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
        <span class="hidden sm:inline">Share</span>
      </Button>
      <Button
        v-if="selectionStatus === 'active'"
        variant="destructive"
        size="sm"
        :class="['shrink-0']"
        :disabled="isLoading || isPublishing"
        :loading="isPublishing"
        loading-label="Unpublishing..."
        :icon="!isPublishing ? X : null"
        @click="headerStore.handlePublish()"
      >
        <span class="hidden sm:inline">Unpublish</span>
        <span class="sm:hidden">Unpub</span>
      </Button>
      <Button
        v-if="selectionStatus === 'draft' || selectionStatus === 'completed'"
        variant="primary"
        size="sm"
        :class="['shrink-0']"
        :loading="isPublishing"
        :icon="CheckCircle2"
        loading-label="Publishing..."
        :disabled="isLoading"
        @click="headerStore.handlePublish()"
      >
        <span class="hidden sm:inline">
          {{
            selectionStatus === 'completed'
              ? 'Republish'
              : 'Publish Selection'
          }}
        </span>
        <span class="sm:hidden">Publish</span>
      </Button>
    </div>

    <!-- Add Email Modal -->
    <AddEmailModal
      :open="showAddEmailModal"
      :selection-id="selection?.id"
      :current-emails="selection?.allowedEmails || selection?.allowed_emails || []"
      @update:open="showAddEmailModal = $event"
      @save-and-publish="handleEmailsSaved"
    />
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import {
  ChevronLeft,
  Check,
  X,
  Loader2,
  CheckCircle2,
  Share2,
  RefreshCw,
  Eye,
  Copy,
  HardDrive,
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import StatusBadge from '@/components/molecules/StatusBadge.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { storeToRefs } from 'pinia'
import { useSelectionHeaderStore } from '@/stores/selectionHeader'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import AddEmailModal from '@/components/organisms/AddEmailModal.vue'

const theme = useThemeClasses()


const props = defineProps({
  goBack: {
    type: Function,
    default: null,
  },
  overallProgress: {
    type: Object,
    default: null,
  },
  onResetLimit: {
    type: Function,
    default: null,
  },
  isResettingLimit: {
    type: Boolean,
    default: false,
  },
  onCopyAllSelectedFilenames: {
    type: Function,
    default: null,
  },
  selectedCount: {
    type: Number,
    default: 0,
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
  isSavingStatus,
  isPublishing,
  showAddEmailModal,
} = storeToRefs(headerStore)

const selectionStatus = computed(() => {
  return selection.value?.status || effectiveStatus.value || 'draft'
})

const handleGoBack = () => {
  if (props.goBack) {
    props.goBack()
  } else {
    emit('goBack')
  }
}

const handleResetLimit = () => {
  if (props.onResetLimit) {
    props.onResetLimit()
  }
}

const handleEmailsSaved = async savedEmails => {
  // Update selection with new emails
  if (selection.value) {
    selection.value.allowedEmails = savedEmails
    selection.value.allowed_emails = savedEmails
  }

  // Try to publish again (skip validation since we just added emails)
  await headerStore.handlePublish(true)
}

const handlePreview = () => {
  if (!selection.value) return

  // Generate preview URL with preview=true parameter
  const projectId = selection.value.projectId || selection.value.project_uuid || 'standalone'
  const selectionId = selection.value.id || selection.value.uuid
  const previewUrl = `${window.location.origin}/p/${projectId}/selections?selectionId=${selectionId}&preview=true`

  // Open in new tab
  window.open(previewUrl, '_blank')
}

const handleCopyAllSelectedFilenames = () => {
  if (props.onCopyAllSelectedFilenames) {
    props.onCopyAllSelectedFilenames()
  }
}

const formatBytes = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
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
