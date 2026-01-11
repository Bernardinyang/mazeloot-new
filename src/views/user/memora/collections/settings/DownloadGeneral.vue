<template>
  <div v-if="isLoading" class="space-y-6">
    <!-- Skeleton Loader -->
    <div
      v-for="i in 3"
      :key="i"
      class="space-y-4 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600/70"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <Skeleton class="h-6 w-40 rounded-md mb-2" />
          <Skeleton class="h-3 w-80 rounded-md mb-3" />
        </div>
        <Skeleton class="h-6 w-12 rounded-md" />
      </div>
      <div class="space-y-3">
        <Skeleton class="h-4 w-48 rounded-md" />
        <Skeleton class="h-10 w-64 rounded-md" />
      </div>
    </div>
  </div>
  <div v-else class="space-y-6">
    <!-- Media Download -->
    <div
      :class="[theme.borderSecondary, theme.bgCard]"
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Media Download</h3>
          <p :class="theme.textSecondary" class="text-xs leading-relaxed">
            Allow visitors to download media in your gallery.
          </p>
        </div>
        <div class="flex-shrink-0 pt-1">
          <ToggleSwitch v-model="photoDownload" label="" />
        </div>
      </div>

      <!-- Media Download Sizes (Nested) -->
      <Transition>
        <div
          v-if="photoDownload"
          :class="theme.borderSecondary"
          class="mt-4 pt-4 border-t space-y-4"
        >
      <div>
        <h4 :class="theme.textPrimary" class="text-base font-semibold mb-1.5">Media Download Sizes</h4>
        <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-4">
          Allow media to be downloaded in select sizes.
          <a class="text-accent hover:underline font-medium" href="#"
            >Learn more</a
          >
        </p>
      </div>
      <div class="space-y-4">
        <!-- High Resolution -->
        <div class="space-y-3">
          <label
            class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <input
              v-model="highResolutionEnabled"
              class="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent transition-all"
              type="checkbox"
            />
            <span :class="theme.textPrimary" class="text-sm font-medium">High Resolution</span>
          </label>
          <div v-if="highResolutionEnabled" class="ml-7 space-y-2.5">
            <div
              class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <input
                class="w-4 h-4 opacity-50 cursor-not-allowed"
                disabled
                name="highRes"
                type="radio"
                value="original"
              />
              <span :class="theme.textSecondary" class="text-sm">
                Original - Upgrade required.
                <a
                  class="text-accent hover:underline font-medium transition-colors"
                  href="#"
                  >Upgrade</a
                >
              </span>
            </div>
            <div
              class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <input
                class="w-4 h-4 opacity-50 cursor-not-allowed"
                disabled
                name="highRes"
                type="radio"
                value="3600px"
              />
              <span :class="theme.textSecondary" class="text-sm">3600px</span>
            </div>
          </div>
        </div>

        <!-- Web Size -->
        <div class="space-y-3">
          <label
            class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <input
              v-model="webSizeEnabled"
              class="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent transition-all"
              type="checkbox"
            />
            <span :class="theme.textPrimary" class="text-sm font-medium">Web Size</span>
          </label>
          <div v-if="webSizeEnabled" class="ml-7 space-y-2.5">
            <label
              class="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <input
                v-model="webSize"
                class="w-4 h-4 text-accent focus:ring-accent"
                name="webSize"
                type="radio"
                value="2048px"
              />
              <span :class="theme.textPrimary" class="text-sm font-medium">2048px</span>
            </label>
            <label
              class="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <input
                v-model="webSize"
                class="w-4 h-4 text-accent focus:ring-accent"
                name="webSize"
                type="radio"
                value="1024px"
              />
              <span :class="theme.textPrimary" class="text-sm font-medium">1024px</span>
            </label>
            <label
              class="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <input
                v-model="webSize"
                class="w-4 h-4 text-accent focus:ring-accent"
                name="webSize"
                type="radio"
                value="640px"
              />
              <span :class="theme.textPrimary" class="text-sm font-medium">640px</span>
            </label>
          </div>
        </div>
      </div>
        </div>
      </Transition>
    </div>

    <!-- Download PIN -->
    <div
      :class="[theme.borderSecondary, theme.bgCard]"
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Download PIN</h3>
          <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
            Require visitors to enter a 4-digit PIN to download photos and videos.
          </p>
        </div>
        <div class="flex-shrink-0 pt-1">
          <ToggleSwitch v-model="downloadPinEnabled" label="" />
        </div>
      </div>
      <div v-if="downloadPinEnabled" class="flex items-center gap-3 max-w-md">
        <PasswordInput
          :model-value="downloadPin"
          :input-class="cn(
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            'flex-1 font-mono focus:ring-2 focus:ring-accent/20 transition-all'
          )"
          :maxlength="4"
          readonly
          @update:model-value="downloadPin = $event.slice(0, 10)"
        />
        <Button
          :class="[theme.borderSecondary, theme.textPrimary]"
          class="group hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all duration-200 hover:scale-105 active:scale-95"
          size="sm"
          variant="outline"
          @click="resetPin"
        >
          <RefreshCw
            class="h-4 w-4 mr-2 group-hover:text-accent transition-colors"
          />
          Reset PIN
        </Button>
        <Button
          v-if="downloadPin"
          :class="[theme.borderSecondary, theme.textPrimary]"
          class="group hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all duration-200 hover:scale-105 active:scale-95"
          size="sm"
          variant="outline"
          @click="copyPin"
        >
          <Copy class="h-4 w-4 group-hover:text-accent transition-colors" />
        </Button>
      </div>
    </div>

    <!-- Save Button -->
    <div :class="theme.borderSecondary" class="mt-10 pt-6 border-t">
      <div class="flex items-center justify-between gap-3">
        <div v-if="hasChanges" class="flex items-center gap-2 text-sm">
          <div class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span :class="theme.textSecondary">You have unsaved changes</span>
        </div>
        <div v-else class="flex items-center gap-2 text-sm">
          <Check class="h-4 w-4 text-accent" />
          <span :class="theme.textSecondary">All changes saved</span>
        </div>
        <Button
          variant="primary"
          :disabled="!hasChanges"
          :loading="isSaving"
          :icon="!hasChanges ? Check : null"
          loading-label="Saving..."
          @click="handleSave"
        >
          {{ hasChanges ? 'Save Changes' : 'Saved' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/shadcn/button'
import PasswordInput from '@/components/molecules/PasswordInput.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { Check, Copy, RefreshCw } from 'lucide-vue-next'
import { Skeleton } from '@/components/shadcn/skeleton'
import { toast } from '@/utils/toast'
import { useGalleryStore } from '@/stores/gallery'
import { cn } from '@/lib/utils'
import { generatePin } from '@/utils/generatePin'

const route = useRoute()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

const collection = ref(null)
const isLoading = ref(true)

const photoDownload = ref(true)
const highResolutionEnabled = ref(true)
const webSizeEnabled = ref(true)
const webSize = ref('1024px')
const downloadPinEnabled = ref(true)
const downloadPin = ref('2434')

// Save state
const isSaving = ref(false)
const originalData = ref(null)

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  isLoading.value = true
  
  // Check if collection is already in store (from parent component)
  const existingCollection = galleryStore.collections.find(c => c.id === collectionId)
  if (existingCollection) {
    collection.value = existingCollection
    photoDownload.value = existingCollection.photoDownload !== false
    highResolutionEnabled.value = existingCollection.highResolutionEnabled !== false
    webSizeEnabled.value = existingCollection.webSizeEnabled !== false
    webSize.value = existingCollection.webSize || '1024px'
    downloadPinEnabled.value = existingCollection.downloadPinEnabled || false
    downloadPin.value = existingCollection.downloadPin || '2434'
    
    // Store original data
    originalData.value = {
      photoDownload: existingCollection.photoDownload !== false,
      highResolutionEnabled: existingCollection.highResolutionEnabled !== false,
      webSizeEnabled: existingCollection.webSizeEnabled !== false,
      webSize: existingCollection.webSize || '1024px',
      downloadPinEnabled: existingCollection.downloadPinEnabled || false,
      downloadPin: existingCollection.downloadPin || '2434',
    }
    isLoading.value = false
    return
  }

  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    photoDownload.value = collectionData.photoDownload !== false
    highResolutionEnabled.value = collectionData.highResolutionEnabled !== false
    webSizeEnabled.value = collectionData.webSizeEnabled !== false
    webSize.value = collectionData.webSize || '1024px'
    downloadPinEnabled.value = collectionData.downloadPinEnabled || false
    downloadPin.value = collectionData.downloadPin || '2434'
    
    // Store original data
    originalData.value = {
      photoDownload: collectionData.photoDownload !== false,
      highResolutionEnabled: collectionData.highResolutionEnabled !== false,
      webSizeEnabled: collectionData.webSizeEnabled !== false,
      webSize: collectionData.webSize || '1024px',
      downloadPinEnabled: collectionData.downloadPinEnabled || false,
      downloadPin: collectionData.downloadPin || '2434',
    }
    isLoading.value = false
  } catch (error) {
    toast.error('Failed to load collection')
    isLoading.value = false
  }
})

// Check for unsaved changes
const hasChanges = computed(() => {
  if (!originalData.value) return false
  return (
    photoDownload.value !== originalData.value.photoDownload ||
    highResolutionEnabled.value !== originalData.value.highResolutionEnabled ||
    webSizeEnabled.value !== originalData.value.webSizeEnabled ||
    webSize.value !== originalData.value.webSize ||
    downloadPinEnabled.value !== originalData.value.downloadPinEnabled ||
    downloadPin.value !== originalData.value.downloadPin
  )
})

// Save all changes
const handleSave = async () => {
  if (!collection.value || !hasChanges.value || isSaving.value) return

  isSaving.value = true
  try {
    // Ensure downloadPin is exactly 4 numeric characters
    let pin = null
    if (downloadPinEnabled.value) {
      if (downloadPin.value && /^\d{4}$/.test(downloadPin.value)) {
        pin = downloadPin.value
      } else {
        // Generate a new 4-digit PIN if invalid or empty
        pin = generatePin(4)
        downloadPin.value = pin
      }
    }
    
    await galleryStore.updateCollection(collection.value.id, {
      photoDownload: photoDownload.value,
      highResolutionEnabled: highResolutionEnabled.value,
      webSizeEnabled: webSizeEnabled.value,
      webSize: webSize.value,
      downloadPinEnabled: downloadPinEnabled.value,
      downloadPin: pin,
    })

    // Update original data
    originalData.value = {
      photoDownload: photoDownload.value,
      highResolutionEnabled: highResolutionEnabled.value,
      webSizeEnabled: webSizeEnabled.value,
      webSize: webSize.value,
      downloadPinEnabled: downloadPinEnabled.value,
      downloadPin: downloadPin.value,
    }

    toast.success('Settings saved successfully')
  } catch (error) {
    toast.error('Failed to save settings', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  } finally {
    isSaving.value = false
  }
}

const resetPin = () => {
  // Generate a 4-digit numeric PIN
  downloadPin.value = generatePin(4)
  toast.success('PIN reset. Click "Save Changes" to apply.')
}

const copyPin = async () => {
  if (!downloadPin.value) return
  try {
    await navigator.clipboard.writeText(downloadPin.value)
    toast.success('PIN copied to clipboard')
  } catch (error) {
    toast.error('Failed to copy PIN')
  }
}

</script>
