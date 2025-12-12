<template>
  <PresetLayout>
    <div
      class="mx-auto p-8 pb-16 transition-all duration-300"
      :class="isSidebarCollapsed ? 'max-w-[calc(100vw-8rem)]' : 'max-w-7xl'"
    >
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-3xl font-bold" :class="theme.textPrimary">Download</h1>
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
        <p class="text-sm leading-relaxed max-w-2xl" :class="theme.textSecondary">
          Configure download settings and restrictions for collections created from this preset.
        </p>
      </div>

      <div class="space-y-8 max-w-3xl">
        <!-- Upgrade Banner -->
        <div
          class="rounded-xl border-2 p-5 space-y-3 transition-all duration-200 hover:shadow-md"
          :class="[
            'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20',
            'border-blue-300 dark:border-blue-800/50',
          ]"
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
                    href="#"
                    @click.prevent="showUpgradePopover = true"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 underline transition-colors group"
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

        <!-- Photo Download Section -->
        <div
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-200"
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.photoDownload ? 'ring-2 ring-teal-500/20 dark:ring-teal-400/20' : '',
          ]"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 class="text-lg font-bold mb-2" :class="theme.textPrimary">Photo Download</h3>
            </div>
            <div class="flex-shrink-0 pt-1">
              <ToggleSwitch
                v-model="formData.photoDownload"
                label=""
                on-label="On"
                off-label="Off"
              />
            </div>
          </div>

          <!-- Additional Options (Collapsible) -->
          <div
            v-if="formData.photoDownload"
            class="space-y-4 pt-4 border-t"
            :class="theme.borderSecondary"
          >
            <button
              @click="showPhotoOptions = !showPhotoOptions"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              :class="[
                showPhotoOptions
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20'
                  : theme.textSecondary,
              ]"
            >
              <span>Additional options</span>
              <ChevronDown
                class="h-4 w-4 transition-transform duration-200"
                :class="showPhotoOptions ? 'rotate-180' : ''"
              />
            </button>

            <!-- Photo Downloadable Sizes -->
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
                  <h4 class="text-base font-semibold mb-3" :class="theme.textPrimary">
                    Photo Downloadable Sizes
                  </h4>

                  <!-- High Resolution -->
                  <div
                    class="space-y-3 mb-5 p-4 rounded-xl border transition-all duration-200"
                    :class="[
                      formData.highResolutionEnabled
                        ? 'bg-teal-50/30 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/30'
                        : [theme.borderSecondary, theme.bgCard],
                    ]"
                  >
                    <label class="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        v-model="formData.highResolutionEnabled"
                        class="mt-1 h-4 w-4 rounded border-2 text-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer transition-all"
                        :class="
                          formData.highResolutionEnabled
                            ? 'border-teal-500 bg-teal-500'
                            : theme.borderSecondary
                        "
                      />
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1.5">
                          <span class="text-sm font-semibold" :class="theme.textPrimary">
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
                                href="#"
                                @click.prevent="showUpgradePopover = true"
                                class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors"
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
                              type="radio"
                              v-model="formData.highResolutionSize"
                              value="3600px"
                              class="h-4 w-4 text-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer transition-all"
                            />
                            <span
                              class="text-sm font-medium transition-colors"
                              :class="
                                formData.highResolutionSize === '3600px'
                                  ? 'text-teal-600 dark:text-teal-400'
                                  : theme.textSecondary
                              "
                              >3600px</span
                            >
                          </label>
                          <label class="flex items-center gap-2.5 cursor-not-allowed opacity-50">
                            <input
                              type="radio"
                              v-model="formData.highResolutionSize"
                              value="original"
                              disabled
                              class="h-4 w-4 text-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-not-allowed"
                            />
                            <span class="text-sm font-medium" :class="theme.textSecondary"
                              >Original</span
                            >
                            <span
                              class="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
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
                    class="space-y-3 p-4 rounded-xl border transition-all duration-200"
                    :class="[
                      formData.webSizeEnabled
                        ? 'bg-teal-50/30 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/30'
                        : [theme.borderSecondary, theme.bgCard],
                    ]"
                  >
                    <label class="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        v-model="formData.webSizeEnabled"
                        class="mt-1 h-4 w-4 rounded border-2 text-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer transition-all"
                        :class="
                          formData.webSizeEnabled
                            ? 'border-teal-500 bg-teal-500'
                            : theme.borderSecondary
                        "
                      />
                      <div class="flex-1">
                        <span class="text-sm font-semibold mb-2 block" :class="theme.textPrimary"
                          >Web Size</span
                        >
                        <div
                          v-if="formData.webSizeEnabled"
                          class="flex items-center gap-4 mt-3 pl-1 flex-wrap"
                        >
                          <label class="flex items-center gap-2.5 cursor-pointer group/radio">
                            <input
                              type="radio"
                              v-model="formData.webSize"
                              value="2048px"
                              class="h-4 w-4 text-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer transition-all"
                            />
                            <span
                              class="text-sm font-medium transition-colors"
                              :class="
                                formData.webSize === '2048px'
                                  ? 'text-teal-600 dark:text-teal-400'
                                  : theme.textSecondary
                              "
                              >2048px</span
                            >
                          </label>
                          <label class="flex items-center gap-2.5 cursor-pointer group/radio">
                            <input
                              type="radio"
                              v-model="formData.webSize"
                              value="1024px"
                              class="h-4 w-4 text-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer transition-all"
                            />
                            <span
                              class="text-sm font-medium transition-colors"
                              :class="
                                formData.webSize === '1024px'
                                  ? 'text-teal-600 dark:text-teal-400'
                                  : theme.textSecondary
                              "
                              >1024px</span
                            >
                          </label>
                          <label class="flex items-center gap-2.5 cursor-pointer group/radio">
                            <input
                              type="radio"
                              v-model="formData.webSize"
                              value="640px"
                              class="h-4 w-4 text-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer transition-all"
                            />
                            <span
                              class="text-sm font-medium transition-colors"
                              :class="
                                formData.webSize === '640px'
                                  ? 'text-teal-600 dark:text-teal-400'
                                  : theme.textSecondary
                              "
                              >640px</span
                            >
                          </label>
                        </div>
                      </div>
                    </label>
                  </div>

                  <p class="text-xs mt-4 leading-relaxed pl-1" :class="theme.textSecondary">
                    Allow photos to be downloaded in select sizes.
                    <a
                      href="#"
                      class="text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 underline transition-colors font-medium"
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
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-200"
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.videoDownload ? 'ring-2 ring-teal-500/20 dark:ring-teal-400/20' : '',
          ]"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 class="text-lg font-bold mb-2" :class="theme.textPrimary">Video Download</h3>
              <p class="text-sm leading-relaxed" :class="theme.textSecondary">
                Allow videos to be downloaded for offline viewing.
                <a href="#" class="text-teal-500 hover:text-teal-600 underline transition-colors">
                  Learn more
                </a>
              </p>
            </div>
            <div class="flex-shrink-0 pt-1">
              <ToggleSwitch
                v-model="formData.videoDownload"
                label=""
                on-label="On"
                off-label="Off"
              />
            </div>
          </div>
        </div>

        <!-- Download PIN Section -->
        <div
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-200"
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.downloadPin ? 'ring-2 ring-teal-500/20 dark:ring-teal-400/20' : '',
          ]"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 class="text-lg font-bold mb-2" :class="theme.textPrimary">Download PIN</h3>
              <p class="text-sm leading-relaxed" :class="theme.textSecondary">
                If enabled, all collections created from this collection preset will have a download
                PIN set automatically at the time of their creation.
              </p>
            </div>
            <div class="flex-shrink-0 pt-1">
              <ToggleSwitch v-model="formData.downloadPin" label="" on-label="On" off-label="Off" />
            </div>
          </div>
        </div>

        <!-- Advanced Settings Section -->
        <div
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-200"
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.restrictToContacts ? 'ring-2 ring-teal-500/20 dark:ring-teal-400/20' : '',
          ]"
        >
          <h3 class="text-lg font-bold uppercase tracking-wide" :class="theme.textPrimary">
            Advanced Settings
          </h3>
          <div class="space-y-3 pt-2">
            <label
              class="flex items-center gap-3 cursor-pointer group p-3 rounded-lg transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
              :class="formData.restrictToContacts ? 'bg-teal-50/30 dark:bg-teal-950/20' : ''"
            >
              <input
                type="checkbox"
                v-model="formData.restrictToContacts"
                class="h-4 w-4 rounded border-2 text-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer transition-all"
                :class="
                  formData.restrictToContacts
                    ? 'border-teal-500 bg-teal-500'
                    : theme.borderSecondary
                "
              />
              <span class="text-sm font-medium flex-1" :class="theme.textPrimary">
                Restrict Downloads to Collection Contacts
              </span>
            </label>
            <p class="text-xs leading-relaxed pl-7" :class="theme.textSecondary">
              Only allow downloads for users who are added as contacts to the collection.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="max-w-3xl">
        <div
          class="flex justify-between items-center mt-12 pt-8 border-t"
          :class="theme.borderSecondary"
        >
          <Button
            @click="handlePrevious"
            variant="ghost"
            :disabled="isSubmitting || isSaving"
            :class="[
              theme.textSecondary,
              theme.bgButtonHover,
              'hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            ]"
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
                class="text-xs"
                :class="theme.textTertiary"
              >
                Unsaved changes
              </span>
            </Transition>
            <Button
              @click="handleNext"
              :disabled="isSubmitting || isSaving"
              class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 px-6"
            >
              <Loader2 v-if="isSubmitting || isSaving" class="mr-2 h-4 w-4 animate-spin" />
              <ArrowRight v-else class="mr-2 h-4 w-4" />
              <span v-if="isSubmitting || isSaving">Saving...</span>
              <span v-else>Next</span>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Unsaved Changes Modal -->
    <UnsavedChangesModal
      v-model="showUnsavedChangesModal"
      :is-saving="isSubmitting || isSaving"
      @save="handleSaveAndLeave"
      @discard="handleDiscardAndLeave"
      @cancel="handleCancelNavigation"
    />
  </PresetLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, inject } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { Loader2, Check, ArrowLeft, ArrowRight, Info, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import PresetLayout from '@/layouts/PresetLayout.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import UnsavedChangesModal from '@/components/organisms/UnsavedChangesModal.vue'
import UpgradePopover from '@/components/molecules/UpgradePopover.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from 'vue-sonner'
import { usePresetStore } from '@/stores/preset'
import type { Preset } from '@/stores/preset'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const presetStore = usePresetStore()

// Inject sidebar collapse state from PresetLayout
const isSidebarCollapsed = inject<Ref<boolean>>('isSidebarCollapsed', ref(false))

// Get preset from store based on route params
const currentPreset = computed((): Preset | undefined => {
  const nameParam = route.params.name as string
  if (nameParam) {
    return presetStore.getPresetByName(nameParam)
  }
  return undefined
})

const presetId = computed((): string | null => {
  return currentPreset.value?.id || null
})

const isSubmitting = ref(false)
const isLoadingData = ref(false)
const showUnsavedChangesModal = ref(false)
const showPhotoOptions = ref(true) // Auto-expand by default
const showUpgradePopover = ref(false)

// Download form data
interface DownloadFormData {
  photoDownload: boolean
  highResolutionEnabled: boolean
  highResolutionSize: string
  webSizeEnabled: boolean
  webSize: string
  videoDownload: boolean
  downloadPin: boolean
  restrictToContacts: boolean
}

const formData = ref<DownloadFormData>({
  photoDownload: true,
  highResolutionEnabled: true,
  highResolutionSize: '3600px',
  webSizeEnabled: true,
  webSize: '1024px',
  videoDownload: false,
  downloadPin: true,
  restrictToContacts: false,
})

// Store original loaded data for comparison
const originalData = ref<DownloadFormData | null>(null)

// Check if there are actual unsaved changes by comparing with original data
const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoadingData.value) {
    return false
  }
  return (
    formData.value.photoDownload !== originalData.value.photoDownload ||
    formData.value.highResolutionEnabled !== originalData.value.highResolutionEnabled ||
    formData.value.highResolutionSize !== originalData.value.highResolutionSize ||
    formData.value.webSizeEnabled !== originalData.value.webSizeEnabled ||
    formData.value.webSize !== originalData.value.webSize ||
    formData.value.videoDownload !== originalData.value.videoDownload ||
    formData.value.downloadPin !== originalData.value.downloadPin ||
    formData.value.restrictToContacts !== originalData.value.restrictToContacts
  )
})

// Load preset data
const loadPresetData = () => {
  if (currentPreset.value) {
    isLoadingData.value = true
    const downloadData = currentPreset.value.download || {}
    const loadedData: DownloadFormData = {
      photoDownload: downloadData.photoDownload !== undefined ? downloadData.photoDownload : true,
      highResolutionEnabled:
        downloadData.highResolutionEnabled !== undefined
          ? downloadData.highResolutionEnabled
          : true,
      highResolutionSize: downloadData.highResolutionSize || '3600px',
      webSizeEnabled:
        downloadData.webSizeEnabled !== undefined ? downloadData.webSizeEnabled : true,
      webSize: downloadData.webSize || '1024px',
      videoDownload: downloadData.videoDownload !== undefined ? downloadData.videoDownload : false,
      downloadPin: downloadData.downloadPin !== undefined ? downloadData.downloadPin : true,
      restrictToContacts:
        downloadData.restrictToContacts !== undefined ? downloadData.restrictToContacts : false,
    }
    formData.value = { ...loadedData }
    originalData.value = { ...loadedData }
    // Auto-expand photo options if photo download is enabled
    showPhotoOptions.value = loadedData.photoDownload
    presetStore.setCurrentPreset(currentPreset.value.id)
    isLoadingData.value = false
  }
}

// Watch for route changes to reload preset data
watch(
  () => route.params.name,
  () => {
    loadPresetData()
  },
  { immediate: false }
)

// Auto-expand photo options when photo download is enabled
watch(
  () => formData.value.photoDownload,
  (enabled: boolean) => {
    if (enabled && !showPhotoOptions.value) {
      showPhotoOptions.value = true
    }
  }
)

// Keyboard shortcut handler
let keyDownHandler: ((e: KeyboardEvent) => void) | null = null

// Initialize on mount
onMounted(() => {
  loadPresetData()

  // Add keyboard shortcut for save (Cmd+S / Ctrl+S)
  keyDownHandler = (e: KeyboardEvent): void => {
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

// Helper function to save preset download
const savePresetDownload = async (): Promise<boolean> => {
  if (!presetId.value) {
    toast.error('Preset not found')
    return false
  }

  try {
    await presetStore.updatePreset(presetId.value, {
      download: formData.value,
    })
    // Update original data after successful save
    if (originalData.value) {
      originalData.value = { ...formData.value }
    }
    return true
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving.'
    toast.error('Failed to save preset', {
      description: errorMessage,
    })
    return false
  }
}

const handleSave = async () => {
  const success = await savePresetDownload()
  if (success) {
    toast.success('Preset saved successfully', {
      description: 'Download settings have been updated.',
      icon: Check,
    })
  }
}

const handlePrevious = async () => {
  isSubmitting.value = true
  try {
    const success = await savePresetDownload()
    if (success) {
      router.push({
        name: 'presetPrivacy',
        params: { name: route.params.name },
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
    if (success) {
      router.push({
        name: 'presetFavorite',
        params: { name: route.params.name },
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const isSaving = computed(() => presetStore.isLoading)

// Set up unsaved changes guard
// Discard function to reset form data to original state
const discardChanges = () => {
  if (originalData.value) {
    formData.value = { ...originalData.value }
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
