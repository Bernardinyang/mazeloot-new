<template>
  <PresetLayout>
    <div
      :class="isSidebarCollapsed ? 'max-w-[calc(100vw-8rem)]' : 'max-w-3xl'"
      class="mx-auto p-8 pb-16 transition-all duration-300"
    >
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-2">
          <h1 :class="theme.textPrimary" class="text-3xl font-bold">Privacy</h1>
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
          Configure privacy and visibility settings for collections created from this preset.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="presetStore.isLoading || isLoadingData || !currentPreset" class="space-y-8">
        <div v-for="i in 3" :key="i" :class="[theme.borderSecondary, theme.bgCard]" class="space-y-4 p-6 rounded-2xl border-2">
          <div class="space-y-2">
            <Skeleton class="h-5 w-32" />
            <Skeleton class="h-4 w-64" />
          </div>
          <Skeleton class="h-12 w-full" />
        </div>
      </div>

      <div v-else class="space-y-8 max-w-3xl">
        <!-- Collection Password Section -->
        <div
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.collectionPassword
              ? 'ring-2 ring-accent/20 dark:ring-accent/20 shadow-sm border-accent/30'
              : '',
          ]"
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-2">Collection Password</h3>
              <p :class="theme.textSecondary" class="text-sm leading-relaxed">
                If enabled, all collections created from this preset will have password protection enabled.
                The actual password will be set when creating each collection.
              </p>
            </div>
            <div class="flex-shrink-0 pt-1">
              <ToggleSwitch
                v-model="formData.collectionPassword"
                label=""
                off-label="Off"
                on-label="On"
              />
            </div>
          </div>
        </div>

        <!-- Show on Homepage Section -->
        <div
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.showOnHomepage
              ? 'ring-2 ring-accent/20 dark:ring-accent/20 shadow-sm border-accent/30'
              : '',
          ]"
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-2">Show on Homepage</h3>
              <p :class="theme.textSecondary" class="text-sm leading-relaxed">
                Show your collections on your Homepage. Manage Homepage in
                <router-link
                  :to="{ name: 'homepageConfig' }"
                  class="text-accent hover:text-accent underline transition-colors font-medium"
                >
                  Settings
                </router-link>
                .
              </p>
            </div>
            <div class="flex-shrink-0 pt-1">
              <ToggleSwitch
                v-model="formData.showOnHomepage"
                label=""
                off-label="Off"
                on-label="On"
              />
            </div>
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
            <span
              v-if="hasUnsavedChanges && !isSubmitting && !isSaving"
              :class="theme.textTertiary"
              class="text-xs"
            >
              Unsaved changes
            </span>
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
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import PresetLayout from '@/layouts/PresetLayout.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import UnsavedChangesModal from '@/components/organisms/UnsavedChangesModal.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from '@/utils/toast'
import { usePresetStore } from '@/stores/preset'
import { Skeleton } from '@/components/shadcn/skeleton'

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

// Default privacy values - declare these first
const defaultCollectionPassword = false
const defaultShowOnHomepage = false

// Privacy form data
const formData = reactive({
  collectionPassword: defaultCollectionPassword,
  showOnHomepage: defaultShowOnHomepage,
})

// Store original loaded data for comparison
const originalData = ref(null)

const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoadingData.value) {
    return false
  }
  return (
    formData.collectionPassword !== originalData.value.collectionPassword ||
    formData.showOnHomepage !== originalData.value.showOnHomepage
  )
})

// Load preset data
const loadPresetData = () => {
  if (currentPreset.value && !isLoadingData.value) {
    isLoadingData.value = true
    const privacyData = currentPreset.value.privacy || {}
    const loadedData = {
      collectionPassword:
        privacyData.collectionPassword !== undefined ? privacyData.collectionPassword : false,
      showOnHomepage: privacyData.showOnHomepage !== undefined ? privacyData.showOnHomepage : false,
    }
    Object.assign(formData, loadedData)
    originalData.value = { ...loadedData }
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

// Helper function to save preset privacy
const savePresetPrivacy = async () => {
  if (!presetId.value) {
    toast.error('Preset not found')
    return false
  }

  try {
    await presetStore.updatePreset(presetId.value, {
      privacy: formData,
    })
    if (originalData.value) {
      originalData.value = { ...formData }
    }
    return true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    toast.error('Failed to save preset', {
      description: errorMessage,
    })
    return false
  }
}

const handleSave = async () => {
  const success = await savePresetPrivacy()
  if (success) {
    toast.success('Preset saved successfully')
  }
}

const handlePrevious = async () => {
  isSubmitting.value = true
  try {
    const success = await savePresetPrivacy()
    if (success) {
      if (presetId.value) {
        router.push({
          name: 'presetDesign',
          params: { id: presetId.value },
        })
      }
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleNext = async () => {
  isSubmitting.value = true
  try {
    const success = await savePresetPrivacy()
    if (success) {
      if (presetId.value) {
        router.push({
          name: 'presetDownload',
          params: { id: presetId.value },
        })
      }
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
    saveFunction: savePresetPrivacy,
    discardFunction: discardChanges,
    showUnsavedChangesModal,
  })
</script>
