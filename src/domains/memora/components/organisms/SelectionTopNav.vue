<template>
  <nav
    :class="[
      theme.borderSecondary,
      'flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-3 border-b gap-3 sm:gap-4 min-h-[3.5rem]',
      'bg-gradient-to-r from-white via-primary-50/30 to-white dark:from-gray-900 dark:via-primary-900/20 dark:to-gray-900 shadow-sm',
    ]"
  >
    <!-- Left Side: Back Button, Title/Status Section -->
    <div class="flex items-center gap-3 min-w-0 flex-1 w-full sm:w-auto">
      <!-- Section 1: Back Button -->
      <button
        class="p-2 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 rounded-xl border border-primary-200 dark:border-primary-700 bg-white/80 dark:bg-gray-800/80 hover:bg-accent/10 hover:border-accent/30 dark:hover:bg-accent/20 transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow touch-manipulation"
        title="Go back"
        @click="handleGoBack"
      >
        <ChevronLeft class="h-4 w-4 text-primary-600 dark:text-primary-400" />
      </button>

      <!-- Section 2: Title and Status Row -->
      <div class="flex flex-col min-w-0 flex-1">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center gap-3 mb-1.5" style="min-height: 1.5rem">
          <div class="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
        <div v-else class="flex items-center gap-3 mb-1.5 group" style="min-height: 1.5rem">
          <div class="flex items-center gap-2 min-w-0">
            <Transition mode="out-in" name="fade">
              <h1
                v-if="!isEditingName"
                key="title"
                class="text-base sm:text-lg font-bold leading-tight cursor-text transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 truncate bg-gradient-to-r from-primary-700 via-accent-600 to-primary-600 dark:from-primary-200 dark:via-accent-400 dark:to-primary-100 bg-clip-text text-transparent hover:opacity-90"
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
                  v-model="editingName"
                  :class="theme.textPrimary"
                  class="text-lg font-bold leading-tight bg-transparent border-none outline-none focus:ring-0 p-0 m-0 flex-1 min-w-0 transition-all duration-200"
                  style="height: 1.5rem; line-height: 1.5rem"
                  @blur="headerStore.handleNameBlur()"
                  @keydown.enter="headerStore.saveName()"
                  @keydown.esc="headerStore.cancelEditingName()"
                />
                <Button
                  :disabled="isSavingName"
                  :icon="!isSavingName ? Check : null"
                  :loading="isSavingName"
                  class="p-1 flex-shrink-0 hover:scale-110 active:scale-95"
                  size="icon-sm"
                  variant="ghost"
                  @click="headerStore.saveName()"
                  @mousedown.prevent
                />
                <Button
                  :disabled="isSavingName"
                  :icon="X"
                  class="p-1 flex-shrink-0 hover:scale-110 active:scale-95"
                  size="icon-sm"
                  variant="ghost"
                  @click="headerStore.cancelEditingName()"
                  @mousedown.prevent
                />
              </div>
            </Transition>
          </div>
        </div>

        <!-- Status Badge Row -->
        <div v-if="!isLoading" class="flex items-center gap-2.5 flex-wrap">
          <PhaseBadge :phase="phaseType" />
          <StatusBadge :status="selectionStatus || 'draft'" />
          <!-- Selection Progress (when completed) -->
          <span
            v-if="selection?.status === 'completed' && overallProgress"
            class="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-800/50 text-primary-700 dark:text-primary-300"
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
    <div v-if="isLoading" class="flex items-center gap-2 flex-shrink-0">
      <div class="h-9 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-9 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-9 w-9 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-9 w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    </div>
    <div
      v-else
      class="flex items-center gap-2 flex-shrink-0 justify-end"
    >
      <!-- Action Buttons Group -->
      <div class="flex items-center gap-2">
        <Button
          v-if="props.onCopyAllSelectedFilenames && selectionStatus === 'completed'"
          :class="[theme.borderSecondary, theme.textPrimary]"
          :disabled="isLoading || props.selectedCount === 0"
          size="sm"
          variant="outline"
          @click="handleCopyAllSelectedFilenames"
        >
          <Copy class="h-4 w-4 mr-2" />
          <span class="hidden md:inline">Copy Selected ({{ props.selectedCount }})</span>
          <span class="md:hidden">Copy</span>
        </Button>
        <Button
          v-if="selectionStatus !== 'completed'"
          :disabled="isLoading"
          size="sm"
          variant="outline"
          @click="handlePreview"
        >
          <Eye class="h-4 w-4 mr-2" />
          <span class="hidden md:inline">Preview</span>
        </Button>
        <Button
          v-if="selectionStatus === 'active'"
          :class="[theme.borderSecondary, theme.textPrimary]"
          :disabled="isLoading"
          size="sm"
          variant="outline"
          @click="headerStore.openShareModal()"
        >
          <Share2 class="h-4 w-4 mr-2" />
          <span class="hidden md:inline">Share</span>
        </Button>
      </div>

      <!-- Divider -->
      <div
        v-if="selectionStatus === 'active' || selectionStatus === 'draft' || selectionStatus === 'completed'"
        :class="[theme.borderSecondary, 'h-6 w-px']"
      ></div>

      <!-- Publish/Unpublish Button -->
      <Button
        v-if="selectionStatus === 'active'"
        :disabled="isLoading || isPublishing"
        :icon="!isPublishing ? X : null"
        :loading="isPublishing"
        loading-label="Unpublishing..."
        size="sm"
        variant="destructive"
        @click="headerStore.handlePublish()"
      >
        <span class="hidden md:inline">Unpublish</span>
        <span class="md:hidden">Unpub</span>
      </Button>
      <Button
        v-if="selectionStatus === 'draft' || selectionStatus === 'completed'"
        :disabled="isLoading"
        :icon="CheckCircle2"
        :loading="isPublishing"
        loading-label="Publishing..."
        size="sm"
        variant="accent"
        class="shadow-md hover:shadow-lg transition-shadow"
        @click="headerStore.handlePublish()"
      >
        <span class="hidden md:inline">
          {{ selectionStatus === 'completed' ? 'Republish' : 'Publish Selection' }}
        </span>
        <span class="md:hidden">Publish</span>
      </Button>

      <!-- Theme Toggle -->
      <div :class="[theme.borderSecondary, 'h-6 w-px mx-1']"></div>
      <ThemeToggle />
    </div>

    <!-- Add Email Modal -->
    <AddEmailModal
      :current-emails="selection?.allowedEmails || selection?.allowed_emails || []"
      :open="showAddEmailModal"
      :selection-id="selection?.id"
      @update:open="showAddEmailModal = $event"
      @save-and-publish="handleEmailsSaved"
    />
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { Check, CheckCircle2, ChevronLeft, Copy, Eye, Share2, X } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import StatusBadge from '@/shared/components/molecules/StatusBadge.vue'
import PhaseBadge from '@/shared/components/molecules/PhaseBadge.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { storeToRefs } from 'pinia'
import { useSelectionHeaderStore } from '@/domains/memora/stores/selectionHeader'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import AddEmailModal from '@/shared/components/organisms/AddEmailModal.vue'
import { useRouter } from 'vue-router'
import { useSettingsApi } from '@/domains/memora/api/settings'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const router = useRouter()

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
  phaseType: {
    type: String,
    default: 'selection',
    validator: value => ['collection', 'selection', 'proofing'].includes(value),
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

const handleEmailsSaved = async ({ emails: savedEmails } = {}) => {
  if (selection.value && Array.isArray(savedEmails)) {
    selection.value.allowedEmails = savedEmails
    selection.value.allowed_emails = savedEmails
  }
  if (savedEmails && savedEmails.length > 0) {
    await headerStore.handlePublish(true)
  }
}

const handlePreview = async () => {
  if (!selection.value) return

  const selectionId = selection.value.id || selection.value.uuid
  const { fetchSettings } = useSettingsApi()
  const settings = await fetchSettings().catch(() => ({}))
  const domain = settings?.branding?.domain
  if (!domain) {
    toast.error('Preview unavailable', { description: 'Branding domain is not configured.' })
    return
  }

  const route = router.resolve({
    name: 'clientSelections',
    params: { domain, selectionId },
    query: { preview: true },
  })

  window.open(route.href, '_blank')
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
