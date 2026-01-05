<template>
  <CollectionLayout
    v-model:active-tab="activeTab"
    v-model:collection-status="collectionStatus"
    v-model:is-sidebar-collapsed="isSidebarCollapsed"
    :collection="collection"
    :editing-name="''"
    :event-date="eventDate"
    :is-editing-name="false"
    :is-loading="isLoading"
    :is-saving-name="false"
    :is-saving-status="false"
    :presets="presets"
    :selected-preset-id="selectedPresetId"
    :selected-preset-name="selectedPresetName"
    :selected-watermark="selectedWatermark"
    :selected-watermark-name="selectedWatermarkName"
    :watermarks="watermarks"
    @go-back="goBack"
    @handle-status-change="handleStatusChange"
    @handle-date-change="handleDateChange"
    @handle-preset-change="handlePresetChange"
    @handle-watermark-change="handleWatermarkChange"
  >
    <template #sidebar>
      <!-- SETTINGS Section - Expanded -->
      <div v-if="activeTab === 'settings' && !isSidebarCollapsed" class="space-y-5">
        <h2 :class="theme.textSecondary" class="text-xs font-bold uppercase tracking-wider mb-4">
          SETTINGS
        </h2>
        <div class="space-y-1">
          <router-link
            v-if="collection?.id"
            :class="[
              route.name === 'collectionSettingsGeneral'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
            ]"
            :to="{ name: 'collectionSettingsGeneral', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
          >
            <Settings :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
            <span :class="theme.textPrimary" class="text-sm font-medium">General</span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :class="[
              route.name === 'collectionSettingsPrivacy'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
            ]"
            :to="{ name: 'collectionSettingsPrivacy', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
          >
            <Lock :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
            <span :class="theme.textPrimary" class="text-sm font-medium">Privacy</span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :class="[
              route.name?.toString().startsWith('collectionSettingsDownload')
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
            ]"
            :to="{ name: 'collectionSettingsDownload', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group justify-between"
          >
            <div class="flex items-center gap-3">
              <Download :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
              <span :class="theme.textPrimary" class="text-sm font-medium">Download</span>
            </div>
            <span
              :class="
                downloadEnabled
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : ''
              "
              class="px-2 py-0.5 rounded-full text-xs font-semibold"
            >
              {{ downloadEnabled ? 'ON' : 'OFF' }}
            </span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :class="[
              route.name === 'collectionSettingsFavorite'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
            ]"
            :to="{ name: 'collectionSettingsFavorite', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group justify-between"
          >
            <div class="flex items-center gap-3">
              <Heart :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
              <span :class="theme.textPrimary" class="text-sm font-medium">Favorite</span>
            </div>
            <span
              :class="
                favoriteEnabled
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : ''
              "
              class="px-2 py-0.5 rounded-full text-xs font-semibold"
            >
              {{ favoriteEnabled ? 'ON' : 'OFF' }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- SETTINGS Section - Collapsed -->
      <div
        v-if="activeTab === 'settings' && isSidebarCollapsed"
        class="flex flex-col items-center gap-2 pt-4"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                v-if="collection?.id"
                :class="[
                  route.name === 'collectionSettingsGeneral' ? 'bg-accent text-accent-foreground' : '',
                ]"
                :to="{ name: 'collectionSettingsGeneral', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200"
              >
                <Settings class="h-5 w-5" />
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>General</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                v-if="collection?.id"
                :class="[
                  route.name === 'collectionSettingsPrivacy' ? 'bg-accent text-accent-foreground' : '',
                ]"
                :to="{ name: 'collectionSettingsPrivacy', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200"
              >
                <Lock class="h-5 w-5" />
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Privacy</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                v-if="collection?.id"
                :class="[
                  route.name?.toString().startsWith('collectionSettingsDownload')
                    ? 'bg-accent text-accent-foreground'
                    : '',
                ]"
                :to="{ name: 'collectionSettingsDownload', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200 relative"
              >
                <Download class="h-5 w-5" />
                <span
                  v-if="downloadEnabled"
                  class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
                ></span>
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                v-if="collection?.id"
                :class="[
                  route.name === 'collectionSettingsFavorite' ? 'bg-accent text-accent-foreground' : '',
                ]"
                :to="{ name: 'collectionSettingsFavorite', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200 relative"
              >
                <Heart class="h-5 w-5" />
                <span
                  v-if="favoriteEnabled"
                  class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
                ></span>
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Favorite</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </template>

    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading settings...</p>
          </div>
        </div>

        <div v-else class="max-w-[50%] p-6 md:p-8 transition-all duration-300">
          <!-- Page Header -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-2">
              <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold">
                Favorite Settings
              </h1>
              <button
                :class="theme.borderSecondary"
                class="w-5 h-5 rounded-full border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-95"
                title="More information"
              >
                <Info :class="theme.textSecondary" class="h-3 w-3" />
              </button>
            </div>
            <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
              Configure favorite settings for your collection including photo favorites, notes, and
              preset lists.
            </p>
          </div>

          <!-- Settings Sections -->
          <div class="space-y-6">
            <!-- Favorite Photos -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Favorite Photos
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Allow visitors to favorite photos. You can review these afterwards in Favorite
                    Activity.
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="favoritePhotos" label="" />
                </div>
              </div>
            </div>

            <!-- Favorite Notes -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Favorite Notes
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Allow clients to add notes to photos they have favorited.
                    <a class="text-teal-600 dark:text-teal-400 hover:underline font-medium" href="#"
                      >Learn more</a
                    >
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="favoriteNotes" label="" />
                </div>
              </div>
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
                <Check class="h-4 w-4 text-teal-500" />
                <span :class="theme.textSecondary">All changes saved</span>
              </div>
              <Button
                :disabled="!hasChanges || isSaving"
                class="bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                @click="handleSave"
              >
                <Loader2 v-if="isSaving" class="h-4 w-4 mr-2 animate-spin" />
                <Check v-else-if="!hasChanges" class="h-4 w-4 mr-2" />
                {{ isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CollectionLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, Download, Heart, Info, Loader2, Lock, Settings } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { usePresetStore } from '@/stores/preset'
import { toast } from '@/utils/toast'

const description = ''

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const presetStore = usePresetStore()

// Collection data
const collection = ref(null)
const isLoading = ref(false)
const collectionStatus = ref('draft')
const eventDate = ref(null)
const selectedPresetId = ref('none')
const selectedPresetName = computed(() => {
  if (selectedPresetId.value === 'none') return null
  const preset = presets.value.find(p => p.id === selectedPresetId.value)
  return preset?.name || null
})
const selectedWatermark = ref('none')
const selectedWatermarkName = computed(() => {
  if (selectedWatermark.value === 'none') return null
  const watermark = watermarks.value.find(w => w.id === selectedWatermark.value)
  return watermark?.name || null
})
const presets = computed(() => presetStore.presets)
const watermarks = computed(() => galleryStore.watermarks || [])

// UI State
const activeTab = ref('settings')
const { isSidebarCollapsed } = useSidebarCollapse()

// Favorite settings state
const favoritePhotos = ref(true)
const favoriteNotes = ref(true)
const downloadEnabled = ref(true)
const favoriteEnabled = ref(true)

// Save state
const isSaving = ref(false)
const originalData = ref(null)

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  // Check if collection is already in store
  const existingCollection = galleryStore.collections.find(c => c.id === collectionId)
  if (existingCollection) {
    collection.value = existingCollection
    collectionStatus.value = existingCollection.status === 'active' ? 'published' : 'draft'
    eventDate.value = existingCollection.eventDate ? new Date(existingCollection.eventDate) : null
    selectedPresetId.value = existingCollection.presetId || 'none'
    selectedWatermark.value = existingCollection.watermarkId || 'none'
    favoritePhotos.value = existingCollection.favoritePhotos !== false
    favoriteNotes.value = existingCollection.favoriteNotes !== false
    downloadEnabled.value = existingCollection.downloadEnabled !== false
    favoriteEnabled.value = existingCollection.favoriteEnabled !== false
    
    // Store original data
    originalData.value = {
      favoritePhotos: existingCollection.favoritePhotos !== false,
      favoriteNotes: existingCollection.favoriteNotes !== false,
    }
    return
  }

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    collectionStatus.value = collectionData.status === 'active' ? 'published' : 'draft'
    eventDate.value = collectionData.eventDate ? new Date(collectionData.eventDate) : null
    selectedPresetId.value = collectionData.presetId || 'none'
    selectedWatermark.value = collectionData.watermarkId || 'none'
    favoritePhotos.value = collectionData.favoritePhotos !== false
    favoriteNotes.value = collectionData.favoriteNotes !== false
    downloadEnabled.value = collectionData.downloadEnabled !== false
    favoriteEnabled.value = collectionData.favoriteEnabled !== false
    
    // Store original data
    originalData.value = {
      favoritePhotos: collectionData.favoritePhotos !== false,
      favoriteNotes: collectionData.favoriteNotes !== false,
    }
  } catch (error) {
    toast.error('Failed to load collection', {
      description,
    })
  } finally {
    isLoading.value = false
  }
})

// Check for unsaved changes
const hasChanges = computed(() => {
  if (!originalData.value) return false
  return (
    favoritePhotos.value !== originalData.value.favoritePhotos ||
    favoriteNotes.value !== originalData.value.favoriteNotes
  )
})

// Save all changes
const handleSave = async () => {
  if (!collection.value || !hasChanges.value || isSaving.value) return

  isSaving.value = true
  try {
    await galleryStore.updateCollection(collection.value.id, {
      favoritePhotos: favoritePhotos.value,
      favoriteNotes: favoriteNotes.value,
    })

    // Update original data
    originalData.value = {
      favoritePhotos: favoritePhotos.value,
      favoriteNotes: favoriteNotes.value,
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

// Navigation
const goBack = () => {
  router.push({ name: 'collectionPhotos', params: { uuid: collection.value?.id } })
}

const handleStatusChange = async newStatus => {
  if (!collection.value || !newStatus) return

  try {
    const apiStatus = newStatus === 'published' ? 'active' : 'draft'
    await galleryStore.updateCollection(collection.value.id, {
      status,
    })

    collectionStatus.value = newStatus === 'published' ? 'published' : 'draft'
    toast.success('Collection status updated successfully')
  } catch (error) {
    toast.error('Failed to update collection status', {
      description,
    })
  }
}

const handleDateChange = async newDate => {
  if (!collection.value) return

  try {
    const dateString = newDate instanceof Date ? newDate.toISOString() : null
    await galleryStore.updateCollection(collection.value.id, {
      eventDate,
    })

    eventDate.value = newDate
    toast.success('Event date updated successfully')
  } catch (error) {
    toast.error('Failed to update event date', {
      description,
    })
  }
}

const handlePresetChange = async presetId => {
  if (!collection.value) return
  selectedPresetId.value = presetId
}

const handleWatermarkChange = async watermarkId => {
  if (!collection.value) return
  selectedWatermark.value = watermarkId
}

</script>
