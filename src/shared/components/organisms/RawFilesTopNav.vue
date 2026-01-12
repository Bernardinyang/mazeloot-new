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
                {{ rawFiles?.name || 'Loading...' }}
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
          <StatusBadge :status="rawFilesStatus || 'draft'" />
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
        v-if="rawFiles?.storageUsedBytes !== undefined"
        :class="[
          'flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all',
          'bg-purple-50/50 dark:bg-purple-950/30 border-purple-200/50 dark:border-purple-800/50',
          'hover:bg-purple-100/50 dark:hover:bg-purple-900/40',
        ]"
      >
        <HardDrive class="h-3.5 w-3.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
        <span class="text-xs font-semibold text-purple-700 dark:text-purple-300">
          {{ formatBytes(rawFiles.storageUsedBytes || 0) }}
        </span>
      </div>
      
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
        v-if="rawFilesStatus === 'active'"
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
        v-if="rawFilesStatus === 'active'"
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
        v-if="rawFilesStatus === 'draft' || rawFilesStatus === 'completed'"
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
            rawFilesStatus === 'completed'
              ? 'Republish'
              : 'Publish Raw Files'
          }}
        </span>
        <span class="sm:hidden">Publish</span>
      </Button>
    </div>

    <!-- Add Email Modal -->
    <AddEmailModal
      :open="showAddEmailModal"
      :raw-files-id="rawFiles?.id"
      :current-emails="rawFiles?.allowedEmails || rawFiles?.allowed_emails || []"
      context="raw_files"
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
  CheckCircle2,
  Share2,
  Eye,
  HardDrive,
} from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import StatusBadge from '@/shared/components/molecules/StatusBadge.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { storeToRefs } from 'pinia'
import { useRawFilesHeaderStore } from '@/domains/memora/stores/rawFilesHeader'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import AddEmailModal from '@/domains/memora/modals/AddEmailModal.vue'

const theme = useThemeClasses()

const props = defineProps({
  goBack: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits(['goBack'])

// Use the raw files header store instead of props
const headerStore = useRawFilesHeaderStore()
const {
  rawFiles,
  effectiveStatus,
  editingName,
  isEditingName,
  isLoading,
  isSavingName,
  nameInputRef,
  isPublishing,
  showAddEmailModal,
} = storeToRefs(headerStore)

const rawFilesStatus = computed(() => {
  return rawFiles.value?.status || effectiveStatus.value || 'draft'
})

const handleGoBack = () => {
  if (props.goBack) {
    props.goBack()
  } else {
    emit('goBack')
  }
}

const handleEmailsSaved = async savedEmails => {
  // Update raw files with new emails
  if (rawFiles.value) {
    rawFiles.value.allowedEmails = savedEmails
    rawFiles.value.allowed_emails = savedEmails
  }

  // Try to publish again (skip validation since we just added emails)
  await headerStore.handlePublish(true)
}

const handlePreview = async () => {
  if (!rawFiles.value) return

  const rawFilesId = rawFiles.value.id || rawFiles.value.uuid
  const { getUserDomain } = await import('@/shared/composables/useUserDomain')
  const domain = await getUserDomain()
  const previewUrl = `${window.location.origin}/memora/${domain}/raw-files/${rawFilesId}?preview=true`

  window.open(previewUrl, '_blank')
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
