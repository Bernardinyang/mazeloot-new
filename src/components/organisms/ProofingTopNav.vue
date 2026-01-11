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
        <div class="flex items-center gap-3 mb-1 group" style="min-height: 1.5rem">
          <div class="flex items-center gap-2 min-w-0">
            <!-- Loading State -->
            <div
              v-if="isLoading"
              class="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
            ></div>
            <!-- Title Content -->
            <Transition v-else mode="out-in" name="fade">
              <h1
                v-if="!isEditingName"
                key="title"
                class="text-base sm:text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 cursor-text transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 truncate"
                :style="{ '--hover-color': proofingColor.value }"
                @mouseenter="e => (e.target.style.color = proofingColor.value)"
                @mouseleave="e => (e.target.style.color = '')"
                style="line-height: 1.5rem"
                @click="headerStore.startEditingName()"
              >
                {{ proofing?.name || 'Loading...' }}
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
                    :style="{ color: proofingColor.value }"
                  />
                  <Loader2
                    v-else
                    class="h-4 w-4 animate-spin"
                    :style="{ color: proofingColor.value }"
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
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
          ></div>
          <!-- Status Content -->
          <template v-else>
            <StatusBadge :status="proofingStatus || 'draft'" />
            <!-- Proofing Progress (when completed) -->
            <div
              v-if="proofing?.status === 'completed' && (proofing?.completedCount !== undefined || overallProgress)"
              class="flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400"
            >
              <svg
                class="w-3.5 h-3.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                {{ proofing?.completedCount ?? overallProgress?.completed ?? 0 }} of
                {{ proofing?.mediaCount ?? overallProgress?.total ?? 0 }} approved
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Right Side Actions -->
    <div v-if="isLoading" class="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-wrap">
      <div class="h-8 sm:h-9 w-16 sm:w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-8 sm:h-9 w-8 sm:w-9 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-8 sm:h-9 w-16 sm:w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-8 sm:h-9 w-20 sm:w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    </div>
    <div v-else class="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
      <!-- Storage indicator -->
      <div
        v-if="proofing?.storageUsedBytes !== undefined"
        :class="[
          'flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all',
          'bg-purple-50/50 dark:bg-purple-950/30 border-purple-200/50 dark:border-purple-800/50',
          'hover:bg-purple-100/50 dark:hover:bg-purple-900/40',
        ]"
      >
        <HardDrive class="h-3.5 w-3.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
        <span class="text-xs font-semibold text-purple-700 dark:text-purple-300">
          {{ formatBytes(proofing.storageUsedBytes || 0) }}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary, 'shrink-0']"
        :disabled="isLoading"
        @click="handlePreview"
      >
        <Eye class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2 shrink-0" />
        <span class="hidden sm:inline">Preview</span>
      </Button>
      <ThemeToggle class="shrink-0" />
      <Button
        v-if="proofingStatus === 'active'"
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary, 'shrink-0']"
        :disabled="isLoading"
        @click="headerStore.openShareModal()"
      >
        <Share2 class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2 shrink-0" />
        <span class="hidden sm:inline">Share</span>
      </Button>
      <Button
        v-if="proofingStatus === 'active'"
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
        v-if="proofingStatus === 'draft' || proofingStatus === 'completed'"
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
          {{ proofingStatus === 'completed' ? 'Republish' : 'Publish Proofing' }}
        </span>
        <span class="sm:hidden">Publish</span>
      </Button>
    </div>

    <!-- Add Email Modal -->
    <AddEmailModal
      :open="showAddEmailModal"
      :selection-id="proofing?.id"
      :current-emails="proofing?.allowedEmails || proofing?.allowed_emails || []"
      :selection-color="proofingColor"
      context="proofing"
      :project-id="proofing?.projectId || proofing?.project_uuid || null"
      @update:open="showAddEmailModal = $event"
      @save-and-publish="handleEmailsSaved"
    />
  </nav>
</template>

<script setup>
import { computed, inject } from 'vue'
import { ChevronLeft, Check, X, Loader2, CheckCircle2, Share2, Eye, HardDrive } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import StatusBadge from '@/components/molecules/StatusBadge.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { storeToRefs } from 'pinia'
import { useProofingHeaderStore } from '@/stores/proofingHeader'
import { useProofingStore } from '@/stores/proofing'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import AddEmailModal from '@/components/organisms/AddEmailModal.vue'
import { getAccentColor } from '@/utils/colors'

const theme = useThemeClasses()

// Get proofing color from parent (provided by ProofingLayout)

const proofingColor = inject(
  'proofingColor',
  computed(() => getAccentColor())
)
const getProofingHoverColor = inject('getProofingHoverColor', () => getAccentColor())

const props = defineProps({
  goBack: {
    type: Function,
    default: null,
  },
  overallProgress: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['goBack'])

// Use the proofing header store
const headerStore = useProofingHeaderStore()
const proofingStore = useProofingStore()
const {
  proofing,
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

const proofingStatus = computed(() => {
  return proofing.value?.status || effectiveStatus.value || 'draft'
})

const handleGoBack = () => {
  if (props.goBack) {
    props.goBack()
  } else {
    emit('goBack')
  }
}

const handleEmailsSaved = async ({ emails: savedEmails, updatedItem }) => {
  // Update proofing with the updated item returned from the API
  if (updatedItem && proofing.value) {
    proofing.value = updatedItem
    headerStore.setProofing(updatedItem)
  } else if (proofing.value) {
    // Fallback: update local state if updatedItem not provided
    proofing.value.allowedEmails = savedEmails
    proofing.value.allowed_emails = savedEmails
  }

  // Small delay to ensure backend has processed the update
  await new Promise(resolve => setTimeout(resolve, 200))

  // Try to publish again (skip validation since we just added emails)
  await headerStore.handlePublish(true)
}

const handlePreview = () => {
  if (!proofing.value) return

  // Generate preview URL
  const projectId = proofing.value.projectId || proofing.value.project_uuid || 'standalone'
  const proofingId = proofing.value.id || proofing.value.uuid
  const previewUrl = `${window.location.origin}/p/${projectId}/proofing?proofingId=${proofingId}&preview=true`

  // Open in new tab
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
