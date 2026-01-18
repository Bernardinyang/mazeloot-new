<template>
  <nav
    :class="[
      theme.borderSecondary,
      'flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-3 border-b bg-white dark:bg-gray-900 shadow-sm gap-3 sm:gap-4 min-h-[3.5rem]',
    ]"
  >
    <!-- Left Side: Back Button, Title/Status Section -->
    <div class="flex items-center gap-3 min-w-0 flex-1 w-full sm:w-auto">
      <!-- Section 1: Back Button -->
      <button
        :class="[theme.borderSecondary, theme.bgCard]"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 shadow-sm border hover:shadow-md"
        title="Go back"
        @click="handleGoBack"
      >
        <ChevronLeft class="h-4 w-4 text-gray-700 dark:text-gray-300" />
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
                class="text-base sm:text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 cursor-text transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 hover:text-accent truncate"
                style="line-height: 1.5rem"
                @click="headerStore.startEditingName()"
              >
                {{ rawFile?.name || 'Loading...' }}
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
        <div v-if="!isLoading" class="flex items-center gap-2 flex-wrap">
          <PhaseBadge :phase="phaseType" />
          <StatusBadge :status="rawFileStatus || 'draft'" />
          <!-- RawFile Progress (when completed) -->
          <span
            v-if="rawFile?.status === 'completed' && overallProgress"
            :class="theme.textSecondary"
            class="text-xs font-medium"
          >
            {{ overallProgress.selected }} of {{ overallProgress.total }} selected
          </span>
          <!-- Completed by email -->
          <span
            v-if="rawFile?.completedByEmail"
            :class="theme.textSecondary"
            class="text-xs italic"
          >
            Completed by: {{ rawFile.completedByEmail }}
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
      <!-- Storage indicator -->
      <div
        v-if="rawFile?.storageUsedBytes !== undefined"
        :class="[
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all',
          'bg-purple-50/50 dark:bg-purple-950/30 border-purple-200/50 dark:border-purple-800/50',
          'hover:bg-purple-100/50 dark:hover:bg-purple-900/40',
        ]"
      >
        <HardDrive class="h-3.5 w-3.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
        <span class="text-xs font-semibold text-purple-700 dark:text-purple-300 whitespace-nowrap">
          {{ formatBytes(rawFile.storageUsedBytes || 0) }}
        </span>
      </div>

      <!-- Action Buttons Group -->
      <div class="flex items-center gap-2">
        <Button
          v-if="props.onCopyAllSelectedFilenames && rawFileStatus === 'completed'"
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
          v-if="rawFileStatus !== 'completed'"
          :class="[theme.borderSecondary, theme.textPrimary]"
          :disabled="isLoading"
          size="sm"
          variant="outline"
          @click="handlePreview"
        >
          <Eye class="h-4 w-4 mr-2" />
          <span class="hidden md:inline">Preview</span>
        </Button>
        <Button
          v-if="rawFileStatus === 'active'"
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
        v-if="rawFileStatus === 'active' || rawFileStatus === 'draft' || rawFileStatus === 'completed'"
        :class="[theme.borderSecondary, 'h-6 w-px']"
      ></div>

      <!-- Publish/Unpublish Button -->
      <Button
        v-if="rawFileStatus === 'active'"
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
        v-if="rawFileStatus === 'draft' || rawFileStatus === 'completed'"
        :disabled="isLoading"
        :icon="CheckCircle2"
        :loading="isPublishing"
        loading-label="Publishing..."
        size="sm"
        variant="accent"
        @click="headerStore.handlePublish()"
      >
        <span class="hidden md:inline">
          {{ rawFileStatus === 'completed' ? 'Republish' : 'Publish RawFile' }}
        </span>
        <span class="md:hidden">Publish</span>
      </Button>

      <!-- Theme Toggle -->
      <div :class="[theme.borderSecondary, 'h-6 w-px mx-1']"></div>
      <ThemeToggle />
    </div>

    <!-- Add Email Modal -->
    <AddEmailModal
      :current-emails="rawFile?.allowedEmails || rawFile?.allowed_emails || []"
      :open="showAddEmailModal"
      :selection-id="rawFile?.id"
      context="rawFile"
      @update:open="showAddEmailModal = $event"
      @save-and-publish="handleEmailsSaved"
    />
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { Check, CheckCircle2, ChevronLeft, Copy, Eye, HardDrive, Share2, X } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import StatusBadge from '@/shared/components/molecules/StatusBadge.vue'
import PhaseBadge from '@/shared/components/molecules/PhaseBadge.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { storeToRefs } from 'pinia'
import { useRawFileHeaderStore } from '@/domains/memora/stores/rawFileHeader'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import AddEmailModal from '@/shared/components/organisms/AddEmailModal.vue'
import { useRouter } from 'vue-router'

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
    default: 'rawFile',
    validator: value => ['collection', 'rawFile', 'proofing'].includes(value),
  },
})

const emit = defineEmits(['goBack'])

// Use the rawFile header store instead of props
const headerStore = useRawFileHeaderStore()
const {
  rawFile,
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

const rawFileStatus = computed(() => {
  return rawFile.value?.status || effectiveStatus.value || 'draft'
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
  // Update rawFile with new emails
  if (rawFile.value) {
    rawFile.value.allowedEmails = savedEmails
    rawFile.value.allowed_emails = savedEmails
  }

  // Try to publish again (skip validation since we just added emails)
  await headerStore.handlePublish(true)
}

const handlePreview = () => {
  if (!rawFile.value) return

  const rawFileId = rawFile.value.id || rawFile.value.uuid

  const route = router.resolve({
    name: 'clientRawFiles',
    query: {
      rawFileId,
      preview: true,
    },
  })

  window.open(route.href, '_blank')
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
