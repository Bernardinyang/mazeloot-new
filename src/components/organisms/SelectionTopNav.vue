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
                class="text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 cursor-text transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95"
                :style="{ '--hover-color': selectionColor.value }"
                @mouseenter="e => (e.target.style.color = selectionColor.value)"
                @mouseleave="e => (e.target.style.color = '')"
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
                  <Check
                    v-if="!isSavingName"
                    class="h-4 w-4"
                    :style="{ color: selectionColor.value }"
                  />
                  <Loader2
                    v-else
                    class="h-4 w-4 animate-spin"
                    :style="{ color: selectionColor.value }"
                  />
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

    <div class="flex items-center gap-2 flex-shrink-0">
      <Button
        v-if="props.onCopyAllSelectedFilenames && selectionStatus === 'completed'"
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary]"
        :disabled="isLoading || props.selectedCount === 0"
        @click="handleCopyAllSelectedFilenames"
      >
        <Copy class="h-4 w-4 mr-2" />
        Copy Selected ({{ props.selectedCount }})
      </Button>
      <Button
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary]"
        :disabled="isLoading"
        @click="handlePreview"
      >
        <Eye class="h-4 w-4 mr-2" />
        Preview
      </Button>
      <ThemeToggle />
      <Button
        v-if="selectionStatus === 'active'"
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
        v-if="selectionStatus === 'active'"
        variant="destructive"
        size="sm"
        class="bg-red-500 hover:bg-red-600 text-white"
        :disabled="isLoading || isPublishing"
        @click="headerStore.handlePublish()"
      >
        <Loader2 v-if="isPublishing" class="h-4 w-4 mr-2 animate-spin" />
        <X v-else class="h-4 w-4 mr-2" />
        {{ isPublishing ? 'Unpublishing...' : 'Unpublish' }}
      </Button>
      <Button
        v-if="selectionStatus === 'draft' || selectionStatus === 'completed'"
        variant="default"
        size="sm"
        class="bg-teal-500 hover:bg-teal-600 text-white"
        :disabled="isLoading || isPublishing"
        @click="headerStore.handlePublish()"
      >
        <Loader2 v-if="isPublishing" class="h-4 w-4 mr-2 animate-spin" />
        <CheckCircle2 v-else class="h-4 w-4 mr-2" />
        {{
          isPublishing
            ? 'Publishing...'
            : selectionStatus === 'completed'
              ? 'Republish'
              : 'Publish Selection'
        }}
      </Button>
    </div>

    <!-- Add Email Modal -->
    <AddEmailModal
      :open="showAddEmailModal"
      :selection-id="selection?.id"
      :current-emails="selection?.allowedEmails || selection?.allowed_emails || []"
      :selection-color="selectionColor"
      @update:open="showAddEmailModal = $event"
      @save-and-publish="handleEmailsSaved"
    />
  </nav>
</template>

<script setup>
import { computed, inject } from 'vue'
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
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import StatusBadge from '@/components/molecules/StatusBadge.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { storeToRefs } from 'pinia'
import { useSelectionHeaderStore } from '@/stores/selectionHeader'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import AddEmailModal from '@/components/organisms/AddEmailModal.vue'

const theme = useThemeClasses()

// Get selection color from parent (provided by SelectionLayout)
const selectionColor = inject(
  'selectionColor',
  computed(() => '#10B981')
)
const getSelectionHoverColor = inject('getSelectionHoverColor', () => '#059669')

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
