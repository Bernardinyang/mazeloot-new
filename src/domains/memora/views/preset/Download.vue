<template>
  <PresetLayout>
    <div
      :class="isSidebarCollapsed ? 'max-w-[calc(100vw-8rem)]' : 'max-w-3xl'"
      class="mx-auto p-8 pb-16 transition-all duration-300"
    >
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-2">
          <h1 :class="theme.textPrimary" class="text-3xl font-bold">Download</h1>
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-x-2"
            enter-to-class="opacity-100 scale-100 translate-x-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-x-0"
            leave-to-class="opacity-0 scale-95 -translate-x-2"
          >
            <div
              v-if="hasUnsavedChanges && !isSubmitting && !isSaving"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
              <span>Unsaved changes</span>
            </div>
          </Transition>
        </div>
        <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
          Configure download settings and restrictions for collections created from this preset.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="presetStore.isLoading || isLoadingData || !currentPreset" class="space-y-8">
        <div v-for="i in 5" :key="i" :class="[theme.borderSecondary, theme.bgCard]" class="space-y-4 p-6 rounded-2xl border-2">
          <div class="space-y-2">
            <Skeleton class="h-5 w-32" />
            <Skeleton class="h-4 w-64" />
          </div>
          <Skeleton class="h-12 w-full" />
        </div>
      </div>

      <div v-else class="space-y-8 max-w-3xl">
        <!-- Upgrade Banner -->
        <div
          :class="[
            'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20',
            'border-blue-300 dark:border-blue-800/50',
          ]"
          class="rounded-xl border-2 p-5 space-y-3 transition-all duration-200 hover:shadow-md"
        >
          <div class="flex items-start gap-4">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center"
            >
              <Info class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="flex-1 space-y-3">
              <div>
                <h3 class="text-sm font-semibold mb-1.5 text-blue-900 dark:text-blue-100">
                  Upgrade for Premium Features
                </h3>
                <p class="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
                  Original size photos and video downloads are available on upgraded accounts. You
                  may save Presets with these settings, then upgrade at any time for them to apply.
                </p>
              </div>
              <UpgradePopover v-model:open="showUpgradePopover">
                <template #trigger>
                  <a
                    class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 underline transition-colors group"
                    href="#"
                    @click.prevent="showUpgradePopover = true"
                  >
                    <span>Upgrade</span>
                    <ArrowRight
                      class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                </template>
              </UpgradePopover>
            </div>
          </div>
        </div>

        <!-- Media Download Section -->
        <div
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.photoDownload
              ? 'ring-2 ring-accent/20 dark:ring-accent/20 shadow-sm border-accent/30'
              : '',
          ]"
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-2">Media Download</h3>
            </div>
            <div class="flex-shrink-0 pt-1">
              <ToggleSwitch
                v-model="formData.photoDownload"
                label=""
                off-label="Off"
                on-label="On"
              />
            </div>
          </div>

          <!-- Additional Options (Collapsible) -->
          <div
            v-if="formData.photoDownload"
            :class="theme.borderSecondary"
            class="space-y-4 pt-4 border-t"
          >
            <button
              :class="[
                showPhotoOptions
                  ? 'text-accent bg-accent/10 dark:bg-accent/20'
                  : '',
              ]"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              @click="showPhotoOptions = !showPhotoOptions"
            >
              <span>Additional options</span>
              <ChevronDown
                :class="showPhotoOptions ? 'rotate-180' : ''"
                class="h-4 w-4 transition-transform duration-200"
              />
            </button>

            <!-- Media Downloadable Sizes -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[1000px]"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-[1000px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="showPhotoOptions" class="space-y-4 overflow-hidden">
                <div>
                  <h4 :class="theme.textPrimary" class="text-base font-semibold mb-3">
                    Media Downloadable Sizes
                  </h4>

                  <!-- High Resolution -->
                  <div
                    :class="[
                      formData.highResolutionEnabled
                        ? 'bg-accent/10 dark:bg-accent/20 border-accent/30 dark:border-accent/30'
                        : '',
                      theme.bgCard,
                    ]"
                    class="space-y-3 mb-5 p-4 rounded-xl border transition-all duration-200"
                  >
                    <label class="flex items-start gap-3 cursor-pointer group">
                      <input
                        v-model="formData.highResolutionEnabled"
                        :class="formData.highResolutionEnabled ? 'border-accent bg-accent' : ''"
                        class="mt-1 h-4 w-4 rounded border-2 text-accent focus:ring-2 focus:ring-accent/20 cursor-pointer transition-all"
                        type="checkbox"
                      />
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1.5">
                          <span :class="theme.textPrimary" class="text-sm font-semibold">
                            High Resolution
                          </span>
                          <span
                            class="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium"
                          >
                            Original - Upgrade required
                          </span>
                          <UpgradePopover v-model:open="showUpgradePopover">
                            <template #trigger>
                              <a
                                class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors"
                                href="#"
                                @click.prevent="showUpgradePopover = true"
                              >
                                Upgrade
                              </a>
                            </template>
                          </UpgradePopover>
                        </div>
                        <div
                          v-if="formData.highResolutionEnabled"
                          class="flex items-center gap-4 mt-3 pl-1"
                        >
                          <label class="flex items-center gap-2.5 cursor-pointer group/radio">
                            <input
                              v-model="formData.highResolutionSize"
                              class="h-4 w-4 text-accent focus:ring-2 focus:ring-accent/20 cursor-pointer transition-all"
                              type="radio"
                              value="3600px"
                            />
                            <span
                              :class="
                                formData.highResolutionSize === '3600px'
                                  ? 'text-accent'
                                  : ''
                              "
                              class="text-sm font-medium transition-colors"
                              >3600px</span
                            >
                          </label>
                          <label class="flex items-center gap-2.5 cursor-not-allowed opacity-50">
                            <input
                              v-model="formData.highResolutionSize"
                              class="h-4 w-4 text-accent focus:ring-2 focus:ring-accent/20 cursor-not-allowed"
                              disabled
                              type="radio"
                              value="original"
                            />
                            <span :class="theme.textSecondary" class="text-sm font-medium"
                              >Original</span
                            >
                            <span
                              class="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300"
                            >
                              Premium
                            </span>
                          </label>
                        </div>
                      </div>
                    </label>
                  </div>

                  <!-- Web Size -->
                  <div
                    :class="[
                      formData.webSizeEnabled
                        ? 'bg-accent/10 dark:bg-accent/20 border-accent/30 dark:border-accent/30'
                        : '',
                      theme.bgCard,
                    ]"
                    class="space-y-3 p-4 rounded-xl border transition-all duration-200"
                  >
                    <label class="flex items-start gap-3 cursor-pointer group">
                      <input
                        v-model="formData.webSizeEnabled"
                        :class="formData.webSizeEnabled ? 'border-accent bg-accent' : ''"
                        class="mt-1 h-4 w-4 rounded border-2 text-accent focus:ring-2 focus:ring-accent/20 cursor-pointer transition-all"
                        type="checkbox"
                      />
                      <div class="flex-1">
                        <span :class="theme.textPrimary" class="text-sm font-semibold mb-2 block"
                          >Web Size</span
                        >
                        <div
                          v-if="formData.webSizeEnabled"
                          class="flex items-center gap-4 mt-3 pl-1 flex-wrap"
                        >
                          <label class="flex items-center gap-2.5 cursor-pointer group/radio">
                            <input
                              v-model="formData.webSize"
                              class="h-4 w-4 text-accent focus:ring-2 focus:ring-accent/20 cursor-pointer transition-all"
                              type="radio"
                              value="2048px"
                            />
                            <span
                              :class="
                                formData.webSize === '2048px'
                                  ? 'text-accent'
                                  : ''
                              "
                              class="text-sm font-medium transition-colors"
                              >2048px</span
                            >
                          </label>
                          <label class="flex items-center gap-2.5 cursor-pointer group/radio">
                            <input
                              v-model="formData.webSize"
                              class="h-4 w-4 text-accent focus:ring-2 focus:ring-accent/20 cursor-pointer transition-all"
                              type="radio"
                              value="1024px"
                            />
                            <span
                              :class="
                                formData.webSize === '1024px'
                                  ? 'text-accent'
                                  : ''
                              "
                              class="text-sm font-medium transition-colors"
                              >1024px</span
                            >
                          </label>
                          <label class="flex items-center gap-2.5 cursor-pointer group/radio">
                            <input
                              v-model="formData.webSize"
                              class="h-4 w-4 text-accent focus:ring-2 focus:ring-accent/20 cursor-pointer transition-all"
                              type="radio"
                              value="640px"
                            />
                            <span
                              :class="
                                formData.webSize === '640px'
                                  ? 'text-accent'
                                  : ''
                              "
                              class="text-sm font-medium transition-colors"
                              >640px</span
                            >
                          </label>
                        </div>
                      </div>
                    </label>
                  </div>

                  <p :class="theme.textSecondary" class="text-xs mt-4 leading-relaxed pl-1">
                    Allow photos to be downloaded in select sizes.
                    <a
                      class="text-accent hover:text-accent underline transition-colors font-medium"
                      href="#"
                    >
                      Learn more
                    </a>
                  </p>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Video Download Section -->
        <div
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.videoDownload
              ? 'ring-2 ring-accent/20 dark:ring-accent/20 shadow-sm border-accent/30'
              : '',
          ]"
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-2">Video Download</h3>
              <p :class="theme.textSecondary" class="text-sm leading-relaxed">
                Allow videos to be downloaded for offline viewing.
                <a
                  class="text-accent hover:text-accent underline transition-colors font-medium"
                  href="#"
                >
                  Learn more
                </a>
              </p>
            </div>
            <div class="flex-shrink-0 pt-1">
              <ToggleSwitch
                v-model="formData.videoDownload"
                label=""
                off-label="Off"
                on-label="On"
              />
            </div>
          </div>
        </div>

        <!-- Download PIN Section -->
        <div
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.downloadPin ? 'ring-2 ring-accent/20 dark:ring-accent/20' : '',
          ]"
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-200"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-2">Download PIN</h3>
              <p :class="theme.textSecondary" class="text-sm leading-relaxed">
                Set a 4-digit PIN that will be used for all collections created from this preset.
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 max-w-md">
            <input
              v-model="formData.downloadPin"
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                'flex-1 font-mono focus:ring-2 focus:ring-accent/20 transition-all px-3 py-2 rounded-lg border',
              ]"
              type="text"
              maxlength="4"
              pattern="[0-9]{4}"
              placeholder="1234"
              @input="formData.downloadPin = $event.target.value.replace(/\D/g, '').slice(0, 4)"
            />
            <Button
              :class="[theme.borderSecondary, theme.textPrimary]"
              class="group hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all duration-200 hover:scale-105 active:scale-95"
              size="sm"
              variant="outline"
              @click="handleGeneratePin"
            >
              <RefreshCw
                class="h-4 w-4 mr-2 group-hover:text-accent transition-colors"
              />
              Generate
            </Button>
          </div>
        </div>

        <!-- Advanced Settings Section -->
        <div
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.restrictToContacts ? 'ring-2 ring-accent/20 dark:ring-accent/20' : '',
          ]"
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-200"
        >
          <h3 :class="theme.textPrimary" class="text-lg font-bold uppercase tracking-wide">
            Advanced Settings
          </h3>
          <div class="space-y-3 pt-2">
            <label
              :class="formData.restrictToContacts ? 'bg-accent/10 dark:bg-accent/20' : ''"
              class="flex items-center gap-3 cursor-pointer group p-3 rounded-lg transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
            >
              <input
                v-model="formData.restrictToContacts"
                :class="formData.restrictToContacts ? 'border-accent bg-accent' : ''"
                class="h-4 w-4 rounded border-2 text-accent focus:ring-2 focus:ring-accent/20 cursor-pointer transition-all"
                type="checkbox"
              />
              <span :class="theme.textPrimary" class="text-sm font-medium flex-1">
                Restrict Downloads to Collection Contacts
              </span>
            </label>
            <p :class="theme.textSecondary" class="text-xs leading-relaxed pl-7">
              Only allow downloads for users who are added to the collection.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="max-w-3xl">
        <div
          :class="theme.borderSecondary"
          class="flex justify-between items-center mt-12 pt-8 border-t"
        >
          <Button
            :class="[
              theme.textSecondary,
              theme.bgButtonHover,
              'hover:text-accent transition-colors duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            ]"
            :disabled="isSubmitting || isSaving"
            variant="ghost"
            @click="handlePrevious"
          >
            <ArrowLeft class="mr-2 h-4 w-4" />
            Back
          </Button>
          <div class="flex items-center gap-3">
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 scale-95 translate-x-2"
              enter-to-class="opacity-100 scale-100 translate-x-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 scale-100 translate-x-0"
              leave-to-class="opacity-0 scale-95 translate-x-2"
            >
              <span
                v-if="hasUnsavedChanges && !isSubmitting && !isSaving"
                :class="theme.textTertiary"
                class="text-xs"
              >
                Unsaved changes
              </span>
            </Transition>
            <Button
              variant="primary"
              :loading="isSubmitting || isSaving"
              :icon="ArrowRight"
              loading-label="Saving..."
              class="shadow-lg hover:shadow-xl transition-all duration-200 px-6"
              @click="handleNext"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Unsaved Changes Modal -->
    <UnsavedChangesModal
      v-model="showUnsavedChangesModal"
      :is-saving="isSubmitting || isSaving"
      @cancel="handleCancelNavigation"
      @discard="handleDiscardAndLeave"
      @save="handleSaveAndLeave"
    />
  </PresetLayout>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/shared/composables/useUnsavedChangesGuard'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Info, Loader2, RefreshCw } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import PresetLayout from '@/shared/layouts/PresetLayout.vue'
import ToggleSwitch from '@/shared/components/molecules/ToggleSwitch.vue'
import UnsavedChangesModal from '@/domains/memora/modals/UnsavedChangesModal.vue'
import UpgradePopover from '@/shared/components/molecules/UpgradePopover.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { usePresetStore } from '@/domains/memora/stores/preset'
import { Skeleton } from '@/shared/components/shadcn/skeleton'
import { generatePin } from '@/shared/utils/generatePin'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const presetStore = usePresetStore()

// Inject sidebar collapse state from PresetLayout
const isSidebarCollapsed = inject('isSidebarCollapsed', ref(false))

const currentPreset = computed(() => {
  const idParam = route.params.id
  if (idParam) {
    return presetStore.getPresetById(idParam)
  }
  return undefined
})

const presetId = computed(() => {
  return currentPreset.value?.id || null
})

const isSubmitting = ref(false)
const isLoadingData = ref(false)
const showUnsavedChangesModal = ref(false)
const showPhotoOptions = ref(true) // Auto-expand by default
const showUpgradePopover = ref(false)

// Default download values - declare these first
const defaultPhotoDownload = false
const defaultHighResolutionEnabled = false
const defaultHighResolutionSize = '3600px'
const defaultWebSizeEnabled = false
const defaultWebSize = '1024px'
const defaultVideoDownload = false
const defaultDownloadPin = null
const defaultRestrictToContacts = false

// Download form data
const formData = reactive({
  photoDownload: defaultPhotoDownload,
  highResolutionEnabled: defaultHighResolutionEnabled,
  highResolutionSize: defaultHighResolutionSize,
  webSizeEnabled: defaultWebSizeEnabled,
  webSize: defaultWebSize,
  videoDownload: defaultVideoDownload,
  downloadPin: defaultDownloadPin,
  restrictToContacts: defaultRestrictToContacts,
})

// Store original loaded data for comparison
const originalData = ref(null)

const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoadingData.value) {
    return false
  }
  return (
    formData.photoDownload !== originalData.value.photoDownload ||
    formData.highResolutionEnabled !== originalData.value.highResolutionEnabled ||
    formData.highResolutionSize !== originalData.value.highResolutionSize ||
    formData.webSizeEnabled !== originalData.value.webSizeEnabled ||
    formData.webSize !== originalData.value.webSize ||
    formData.videoDownload !== originalData.value.videoDownload ||
    formData.downloadPin !== originalData.value.downloadPin ||
    formData.restrictToContacts !== originalData.value.restrictToContacts
  )
})

// Load preset data
const loadPresetData = () => {
  if (currentPreset.value && !isLoadingData.value) {
    isLoadingData.value = true
    const downloadData = currentPreset.value.download || {}
    const highResolution = downloadData.highResolution || {}
    const webSize = downloadData.webSize || {}
    
    const loadedData = {
      photoDownload:
        downloadData.photoDownload !== undefined
          ? downloadData.photoDownload
          : defaultPhotoDownload,
      highResolutionEnabled:
        highResolution.enabled !== undefined
          ? highResolution.enabled
          : defaultHighResolutionEnabled,
      highResolutionSize: highResolution.size || defaultHighResolutionSize,
      webSizeEnabled:
        webSize.enabled !== undefined
          ? webSize.enabled
          : defaultWebSizeEnabled,
      webSize: webSize.size || defaultWebSize,
      videoDownload:
        downloadData.videoDownload !== undefined
          ? downloadData.videoDownload
          : defaultVideoDownload,
      downloadPin:
        downloadData.downloadPin !== undefined ? downloadData.downloadPin : defaultDownloadPin,
      restrictToContacts:
        downloadData.restrictToContacts !== undefined
          ? downloadData.restrictToContacts
          : defaultRestrictToContacts,
    }
    Object.assign(formData, loadedData)
    originalData.value = { ...loadedData }
    // Auto-expand media options if media download is enabled
    showPhotoOptions.value = loadedData.photoDownload
    presetStore.setCurrentPreset(currentPreset.value.id)
    isLoadingData.value = false
  }
}

// Watch for route changes to load preset and reload data
watch(
  () => route.params.id,
  async (idParam) => {
    if (idParam) {
      // Check if preset exists in store
      let preset = presetStore.getPresetById(idParam)
      
      // If not found, fetch only this single preset
      if (!preset) {
        try {
          preset = await presetStore.loadPreset(idParam)
        } catch (error) {
          // Silently fail
          console.error('Failed to load preset:', error)
        }
      }
      
      // Load preset data once we have it
      if (preset) {
        loadPresetData()
      }
    }
  },
  { immediate: true }
)

// Auto-expand media options when media download is enabled
watch(
  () => formData.photoDownload,
  enabled => {
    if (enabled && !showPhotoOptions.value) {
      showPhotoOptions.value = true
    }
  }
)

// Keyboard shortcut handler
let keyDownHandler = null

// Initialize on mount
onMounted(async () => {
  // Add keyboard shortcut for save (Cmd+S / Ctrl+S)
  keyDownHandler = e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      if (!isSaving.value && hasUnsavedChanges.value && presetId.value) {
        void handleSave()
      }
    }
  }

  window.addEventListener('keydown', keyDownHandler)
})

// Cleanup on unmount
onUnmounted(() => {
  if (keyDownHandler) {
    window.removeEventListener('keydown', keyDownHandler)
  }
})

const handleGeneratePin = () => {
  formData.downloadPin = generatePin(4)
  toast.success('PIN generated')
}

// Helper function to save preset download
const savePresetDownload = async () => {
  if (!presetId.value) {
    toast.error('Preset not found')
    return false
  }

  try {
    // Map form data to backend structure
    await presetStore.updatePreset(presetId.value, {
      download: {
        photoDownload: formData.photoDownload,
        highResolution: {
          enabled: formData.highResolutionEnabled,
          size: formData.highResolutionSize,
        },
        webSize: {
          enabled: formData.webSizeEnabled,
          size: formData.webSize,
        },
        videoDownload: formData.videoDownload,
        downloadPin: formData.downloadPin,
        restrictToContacts: formData.restrictToContacts,
      },
    })
    if (originalData.value) {
      originalData.value = { ...formData }
    }
    return true
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'An unknown error occurred')
    toast.error('Failed to save preset', {
      description: errorMessage,
    })
    return false
  }
}

const handleSave = async () => {
  const success = await savePresetDownload()
  if (success) {
    toast.success('Preset saved successfully')
  }
}

const handlePrevious = async () => {
  isSubmitting.value = true
  try {
    const success = await savePresetDownload()
    if (success && presetId.value) {
      router.push({
        name: 'presetPrivacy',
        params: { id: presetId.value },
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleNext = async () => {
  isSubmitting.value = true
  try {
    const success = await savePresetDownload()
    if (success && presetId.value) {
      router.push({
        name: 'presetFavorite',
        params: { id: presetId.value },
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const isSaving = computed(() => presetStore.isLoading)

// Discard function to reset form data to original state
const discardChanges = () => {
  if (originalData.value) {
    Object.assign(formData, originalData.value)
  }
}

const { handleSaveAndLeave, handleDiscardAndLeave, handleCancelNavigation } =
  useUnsavedChangesGuard({
    hasUnsavedChanges,
    isSubmitting,
    isSaving,
    saveFunction: savePresetDownload,
    discardFunction: discardChanges,
    showUnsavedChangesModal,
  })
</script>
