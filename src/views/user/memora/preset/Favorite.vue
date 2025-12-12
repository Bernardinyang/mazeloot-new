<template>
  <PresetLayout>
    <div
      class="mx-auto p-8 pb-16 transition-all duration-300"
      :class="isSidebarCollapsed ? 'max-w-[calc(100vw-8rem)]' : 'max-w-7xl'"
    >
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-3xl font-bold" :class="theme.textPrimary">Favorite</h1>
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
          Configure favorite settings for collections created from this preset.
        </p>
      </div>

      <div class="space-y-6 max-w-3xl">
        <!-- Favorite Photos Section -->
        <div
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-md hover:border-teal-500/30"
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.favoritePhotos
              ? 'ring-2 ring-teal-500/20 dark:ring-teal-400/20 shadow-sm border-teal-500/30'
              : '',
          ]"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2.5 mb-2">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  :class="
                    formData.favoritePhotos
                      ? 'bg-teal-500/10 dark:bg-teal-500/20'
                      : 'bg-gray-100/50 dark:bg-gray-800/50'
                  "
                >
                  <Heart
                    class="h-4 w-4 transition-colors"
                    :class="
                      formData.favoritePhotos
                        ? 'text-teal-600 dark:text-teal-400 fill-teal-600 dark:fill-teal-400'
                        : theme.textSecondary
                    "
                  />
                </div>
                <h3 class="text-lg font-bold" :class="theme.textPrimary">Favorite Photos</h3>
              </div>
              <p class="text-sm leading-relaxed ml-11" :class="theme.textSecondary">
                Allow visitors to favorite photos. You can review these afterwards in
                <span class="font-medium text-teal-600 dark:text-teal-400">Favorite Activity</span>.
              </p>
            </div>
            <div class="flex-shrink-0 pt-1">
              <ToggleSwitch
                v-model="formData.favoritePhotos"
                label=""
                on-label="On"
                off-label="Off"
              />
            </div>
          </div>
        </div>

        <!-- Favorite Notes Section -->
        <div
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-md hover:border-teal-500/30"
          :class="[
            theme.borderSecondary,
            theme.bgCard,
            formData.favoriteNotes
              ? 'ring-2 ring-teal-500/20 dark:ring-teal-400/20 shadow-sm border-teal-500/30'
              : '',
          ]"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2.5 mb-2">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  :class="
                    formData.favoriteNotes
                      ? 'bg-teal-500/10 dark:bg-teal-500/20'
                      : 'bg-gray-100/50 dark:bg-gray-800/50'
                  "
                >
                  <StickyNote
                    class="h-4 w-4 transition-colors"
                    :class="
                      formData.favoriteNotes
                        ? 'text-teal-600 dark:text-teal-400'
                        : theme.textSecondary
                    "
                  />
                </div>
                <h3 class="text-lg font-bold" :class="theme.textPrimary">Favorite Notes</h3>
              </div>
              <p class="text-sm leading-relaxed ml-11" :class="theme.textSecondary">
                Allow clients to add notes to photos they have favorited.
                <a
                  href="#"
                  class="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 underline transition-colors font-medium"
                >
                  Learn more
                </a>
              </p>
            </div>
            <div class="flex-shrink-0 pt-1">
              <ToggleSwitch
                v-model="formData.favoriteNotes"
                label=""
                on-label="On"
                off-label="Off"
              />
            </div>
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
import { Loader2, Check, ArrowLeft, ArrowRight, Heart, StickyNote } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import PresetLayout from '@/layouts/PresetLayout.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import UnsavedChangesModal from '@/components/organisms/UnsavedChangesModal.vue'
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

// Favorite form data
interface FavoriteFormData {
  favoritePhotos: boolean
  favoriteNotes: boolean
}

const formData = ref<FavoriteFormData>({
  favoritePhotos: true,
  favoriteNotes: true,
})

// Store original loaded data for comparison
const originalData = ref<FavoriteFormData | null>(null)

// Check if there are actual unsaved changes by comparing with original data
const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoadingData.value) {
    return false
  }
  return (
    formData.value.favoritePhotos !== originalData.value.favoritePhotos ||
    formData.value.favoriteNotes !== originalData.value.favoriteNotes
  )
})

// Load preset data
const loadPresetData = () => {
  if (currentPreset.value) {
    isLoadingData.value = true
    const favoriteData = currentPreset.value.favorite || {}
    const loadedData: FavoriteFormData = {
      favoritePhotos:
        favoriteData.favoritePhotos !== undefined ? favoriteData.favoritePhotos : true,
      favoriteNotes: favoriteData.favoriteNotes !== undefined ? favoriteData.favoriteNotes : true,
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
  { immediate: false }
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

// Helper function to save preset favorite
const savePresetFavorite = async (): Promise<boolean> => {
  if (!presetId.value) {
    toast.error('Preset not found')
    return false
  }

  try {
    await presetStore.updatePreset(presetId.value, {
      favorite: formData.value,
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
  const success = await savePresetFavorite()
  if (success) {
    toast.success('Preset saved successfully', {
      description: 'Favorite settings have been updated.',
      icon: Check,
    })
  }
}

const handlePrevious = async () => {
  isSubmitting.value = true
  try {
    const success = await savePresetFavorite()
    if (success) {
      router.push({
        name: 'presetDownload',
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
    const success = await savePresetFavorite()
    if (success) {
      // Navigate to next section (Store) when it's implemented
      router.push({
        name: 'presetSettings',
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
    saveFunction: savePresetFavorite,
    discardFunction: discardChanges,
    showUnsavedChangesModal,
  })
</script>
