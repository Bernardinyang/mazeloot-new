<template>
  <nav
    :class="[
      theme.borderSecondary,
      'flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-3.5 border-b bg-white dark:bg-gray-900 shadow-sm gap-3 sm:gap-0 min-h-auto sm:min-h-[3.5rem]',
    ]"
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
                :style="{ '--hover-color': proofingColor.value }"
                class="text-base sm:text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 cursor-text transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 truncate"
                style="line-height: 1.5rem"
                @click="headerStore.startEditingName()"
                @mouseenter="e => (e.target.style.color = proofingColor.value)"
                @mouseleave="e => (e.target.style.color = '')"
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
                  v-model="editingName"
                  :class="theme.textPrimary"
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
                    :style="{ color: proofingColor.value }"
                    class="h-4 w-4"
                  />
                  <Loader2
                    v-else
                    :style="{ color: proofingColor.value }"
                    class="h-4 w-4 animate-spin"
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
            <PhaseBadge :phase="phaseType" />
            <StatusBadge :status="proofingStatus || 'draft'" />
            <!-- Proofing Progress (when completed) -->
            <div
              v-if="
                proofing?.status === 'completed' &&
                (proofing?.completedCount !== undefined || overallProgress)
              "
              class="flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400"
            >
              <svg
                class="w-3.5 h-3.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
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
    <div
      v-else
      class="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-wrap justify-start sm:justify-end w-full sm:w-auto"
    >
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
        :class="[theme.borderSecondary, theme.textPrimary, 'shrink-0']"
        :disabled="isLoading"
        size="sm"
        variant="outline"
        @click="handlePreview"
      >
        <Eye class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2 shrink-0" />
        <span class="hidden sm:inline">Preview</span>
      </Button>
      <Button
        v-if="proofingStatus === 'active'"
        :class="[theme.borderSecondary, theme.textPrimary, 'shrink-0']"
        :disabled="isLoading"
        size="sm"
        variant="outline"
        @click="headerStore.openShareModal()"
      >
        <Share2 class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2 shrink-0" />
        <span class="hidden sm:inline">Share</span>
      </Button>
      <Button
        v-if="proofingStatus === 'active'"
        :class="['shrink-0']"
        :disabled="isLoading || isPublishing"
        :icon="!isPublishing ? X : null"
        :loading="isPublishing"
        loading-label="Unpublishing..."
        size="sm"
        variant="destructive"
        @click="headerStore.handlePublish()"
      >
        <span class="hidden sm:inline">Unpublish</span>
        <span class="sm:hidden">Unpub</span>
      </Button>
      <Button
        v-if="proofingStatus === 'draft' || proofingStatus === 'completed'"
        :class="['shrink-0']"
        :disabled="isLoading"
        :icon="CheckCircle2"
        :loading="isPublishing"
        loading-label="Publishing..."
        size="sm"
        variant="accent"
        @click="headerStore.handlePublish()"
      >
        <span class="hidden sm:inline">
          {{ proofingStatus === 'completed' ? 'Republish' : 'Publish Proofing' }}
        </span>
        <span class="sm:hidden">Publish</span>
      </Button>
      <ThemeToggle class="shrink-0" />
    </div>

    <!-- Add Email Modal -->
    <AddEmailModal
      :current-emails="proofing?.allowedEmails || proofing?.allowed_emails || []"
      :open="showAddEmailModal"
      :project-id="proofing?.projectId || proofing?.project_uuid || null"
      :selection-color="proofingColor"
      :selection-id="proofing?.id"
      context="proofing"
      @update:open="showAddEmailModal = $event"
      @save-and-publish="handleEmailsSaved"
    />
  </nav>
</template>

<script setup>
import { computed, inject } from 'vue'
import { Check, CheckCircle2, ChevronLeft, Eye, HardDrive, Loader2, Share2, X, } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import StatusBadge from '@/shared/components/molecules/StatusBadge.vue'
import PhaseBadge from '@/shared/components/molecules/PhaseBadge.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { storeToRefs } from 'pinia'
import { useProofingHeaderStore } from '@/domains/memora/stores/proofingHeader'
import { useProofingStore } from '@/domains/memora/stores/proofing'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import AddEmailModal from '@/shared/components/organisms/AddEmailModal.vue'
import { getAccentColor } from '@/shared/utils/colors'
import { useRouter } from 'vue-router'

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
  phaseType: {
    type: String,
    default: 'proofing',
    validator: value => ['collection', 'selection', 'proofing'].includes(value),
  },
})

const emit = defineEmits(['goBack'])
const router = useRouter()

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

  const proofingId = proofing.value.id || proofing.value.uuid

  const route = router.resolve({
    name: 'clientProofing',
    query: {
      proofingId,
      preview: true,
    },
  })

  window.open(route.href, '_blank')
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
