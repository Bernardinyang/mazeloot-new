<template>
  <div class="space-y-6">
    <!-- Photo Download -->
    <div
      :class="[theme.borderSecondary, theme.bgCard]"
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Photo Download</h3>
          <p :class="theme.textSecondary" class="text-xs leading-relaxed">
            Allow visitors to download photos in your gallery.
          </p>
        </div>
        <div class="flex-shrink-0 pt-1">
          <ToggleSwitch v-model="photoDownload" label="" />
        </div>
      </div>
    </div>

    <!-- Photo Download Sizes -->
    <div
      v-if="photoDownload"
      :class="[theme.borderSecondary, theme.bgCard]"
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
    >
      <div>
        <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Photo Download Sizes</h3>
        <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-4">
          Allow photos to be downloaded in select sizes.
          <a class="text-teal-600 dark:text-teal-400 hover:underline font-medium" href="#"
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
              class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 transition-all"
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
                  class="text-teal-600 dark:text-teal-400 hover:underline font-medium transition-colors"
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
              class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 transition-all"
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
                class="w-4 h-4 text-teal-600 focus:ring-teal-500"
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
                class="w-4 h-4 text-teal-600 focus:ring-teal-500"
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
                class="w-4 h-4 text-teal-600 focus:ring-teal-500"
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

    <!-- Download PIN -->
    <div
      :class="[theme.borderSecondary, theme.bgCard]"
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
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
      <div v-if="downloadPinEnabled" class="flex items-center gap-3">
        <div
          :class="[theme.borderSecondary, theme.textPrimary]"
          class="px-4 py-2.5 rounded-lg border-2 font-mono text-lg font-semibold bg-gray-50 dark:bg-gray-800/50"
        >
          {{ downloadPin }}
        </div>
        <Button
          :class="[theme.borderSecondary, theme.textPrimary]"
          class="group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 hover:scale-105 active:scale-95"
          size="sm"
          variant="outline"
          @click="resetPin"
        >
          <RefreshCw
            class="h-4 w-4 mr-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
          />
          Reset PIN
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/shadcn/button'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { RefreshCw } from 'lucide-vue-next'
import { toast } from '@/utils/toast'
import { useGalleryStore } from '@/stores/gallery'

const route = useRoute()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

const collection = ref(null)

const photoDownload = ref(true)
const highResolutionEnabled = ref(true)
const webSizeEnabled = ref(true)
const webSize = ref('1024px')
const downloadPinEnabled = ref(true)
const downloadPin = ref('2434')

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    photoDownload.value = collectionData.photoDownload !== false
    highResolutionEnabled.value = collectionData.highResolutionEnabled !== false
    webSizeEnabled.value = collectionData.webSizeEnabled !== false
    webSize.value = collectionData.webSize || '1024px'
    downloadPinEnabled.value = collectionData.downloadPinEnabled || false
    downloadPin.value = collectionData.downloadPin || '2434'
  } catch (error) {
    toast.error('Failed to load collection')
  }
})

const resetPin = async () => {
  const newPin = Math.floor(1000 + Math.random() * 9000).toString()
  downloadPin.value = newPin
  if (collection.value) {
    try {
      await galleryStore.updateCollection(collection.value.id, {
        downloadPin,
        downloadPinEnabled,
      })
      toast.success('PIN reset successfully')
    } catch (error) {
      toast.error('Failed to reset PIN')
    }
  }
}

// Watch and save download settings changes
watch(photoDownload, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      photoDownload,
      downloadEnabled,
    })
  } catch (error) {
    toast.error('Failed to update photo download')
  }
})

watch(highResolutionEnabled, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      highResolutionEnabled,
    })
  } catch (error) {
    toast.error('Failed to update high resolution')
  }
})

watch(webSizeEnabled, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      webSizeEnabled,
    })
  } catch (error) {
    toast.error('Failed to update web size')
  }
})

watch(webSize, async newSize => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, { webSize: newSize })
  } catch (error) {
    toast.error('Failed to update web size option', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
})

watch(downloadPinEnabled, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      downloadPinEnabled: newValue,
      downloadPin: downloadPin.value,
    })
  } catch (error) {
    toast.error('Failed to update download PIN')
  }
})
</script>
