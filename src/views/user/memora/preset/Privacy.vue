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

      <div class="space-y-8 max-w-3xl">
        <!-- Collection Password Section -->
        <div
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.collectionPassword ? 'ring-2 ring-teal-500/20 dark:ring-teal-400/20' : '',
          ]"
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-200"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-2">Collection Password</h3>
              <p :class="theme.textSecondary" class="text-sm leading-relaxed">
                If enabled, all collections created from this collection preset will have a secure
                password set automatically at the time of their creation.
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
            formData.showOnHomepage ? 'ring-2 ring-teal-500/20 dark:ring-teal-400/20' : '',
          ]"
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-200"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-2">Show on Homepage</h3>
              <p :class="theme.textSecondary" class="text-sm leading-relaxed">
                Show your collections on your Homepage. Manage Homepage in
                <router-link
                  :to="{ name: 'homepageConfig' }"
                  class="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 underline transition-colors font-medium"
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
              'hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200',
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
              :disabled="isSubmitting || isSaving"
              class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 px-6"
              @click="handleNext"
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
      @cancel="handleCancelNavigation"
      @discard="handleDiscardAndLeave"
      @save="handleSaveAndLeave"
    />
  </PresetLayout>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import PresetLayout from '@/layouts/PresetLayout.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import UnsavedChangesModal from '@/components/organisms/UnsavedChangesModal.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from 'vue-sonner'
import { usePresetStore } from '@/stores/preset'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const presetStore = usePresetStore()

// Inject sidebar collapse state from PresetLayout
const isSidebarCollapsed = inject < Ref < boolean >> ('isSidebarCollapsed', ref(false))

// Get preset from store based on route params
const currentPreset = computed(() => {
  const nameParam = route.params.name
  if (nameParam) {
    return presetStore.getPresetByName(nameParam)
  }
  return undefined
})

const presetId = computed(() => {
  return currentPreset.value?.id || null
})

const isSubmitting = ref(false)
const isLoadingData = ref(false)
const showUnsavedChangesModal = ref(false)

// Privacy form data
const formData = ref({
  collectionPassword,
  showOnHomepage,
})

// Store original loaded data for comparison
const originalData = ref(null)

// Check if there are actual unsaved changes by comparing with original data
const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoadingData.value) {
    return false
  }
  return (
    formData.value.collectionPassword !== originalData.value.collectionPassword ||
    formData.value.showOnHomepage !== originalData.value.showOnHomepage
  )
})

// Load preset data
const loadPresetData = () => {
  if (currentPreset.value) {
    isLoadingData.value = true
    const privacyData = currentPreset.value.privacy || {}
    const loadedData = {
      collectionPassword:
        privacyData.collectionPassword !== undefined ? privacyData.collectionPassword : '',
      showOnHomepage: privacyData.showOnHomepage !== undefined ? privacyData.showOnHomepage : false,
    }
    formData.value = { ...loadedData }
    originalData.value = { ...loadedData }
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
  { immediate: true }
)

// Keyboard shortcut handler
let keyDownHandler = null

// Initialize on mount
onMounted(() => {
  loadPresetData()

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
      privacy,
    })
    // Update original data after successful save
    if (originalData.value) {
      originalData.value = { ...formData.value }
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
    toast.success('Preset saved successfully', {
      description,
      icon,
    })
  }
}

const handlePrevious = async () => {
  isSubmitting.value = true
  try {
    const success = await savePresetPrivacy()
    if (success) {
      router.push({
        name,
        params,
      })
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
      router.push({
        name,
        params,
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
    saveFunction,
    discardFunction,
    showUnsavedChangesModal,
  })
</script>
