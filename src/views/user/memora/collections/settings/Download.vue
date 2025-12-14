<template>
  <CollectionLayout
    :collection="collection"
    :is-loading="isLoading"
    :is-editing-name="false"
    :editing-name="''"
    :is-saving-name="false"
    v-model:collection-status="collectionStatus"
    :is-saving-status="false"
    :event-date="eventDate"
    :selected-preset-id="selectedPresetId"
    :selected-preset-name="selectedPresetName"
    :selected-watermark="selectedWatermark"
    :selected-watermark-name="selectedWatermarkName"
    :presets="presets"
    :watermarks="watermarks"
    v-model:active-tab="activeTab"
    v-model:is-sidebar-collapsed="isSidebarCollapsed"
    @go-back="goBack"
    @handle-status-change="handleStatusChange"
    @handle-date-change="handleDateChange"
    @handle-preset-change="handlePresetChange"
    @handle-watermark-change="handleWatermarkChange"
  >
    <template #sidebar>
      <!-- SETTINGS Section - Expanded -->
      <div v-if="activeTab === 'settings' && !isSidebarCollapsed" class="space-y-5">
        <h2 class="text-xs font-bold uppercase tracking-wider mb-4" :class="theme.textSecondary">
          SETTINGS
        </h2>
        <div class="space-y-1">
          <router-link
            v-if="collection?.id"
            :to="{ name: 'collectionSettingsGeneral', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
            :class="[
              $route.name === 'collectionSettingsGeneral'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
          >
            <Settings class="h-4 w-4 flex-shrink-0" :class="theme.textSecondary" />
            <span class="text-sm font-medium" :class="theme.textPrimary">General</span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :to="{ name: 'collectionSettingsPrivacy', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
            :class="[
              $route.name === 'collectionSettingsPrivacy'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
          >
            <Lock class="h-4 w-4 flex-shrink-0" :class="theme.textSecondary" />
            <span class="text-sm font-medium" :class="theme.textPrimary">Privacy</span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :to="{ name: 'collectionSettingsDownload', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group justify-between"
            :class="[
              $route.name?.toString().startsWith('collectionSettingsDownload')
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
          >
            <div class="flex items-center gap-3">
              <Download class="h-4 w-4 flex-shrink-0" :class="theme.textSecondary" />
              <span class="text-sm font-medium" :class="theme.textPrimary">Download</span>
            </div>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-semibold"
              :class="
                downloadEnabled
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              "
            >
              {{ downloadEnabled ? 'ON' : 'OFF' }}
            </span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :to="{ name: 'collectionSettingsFavorite', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group justify-between"
            :class="[
              $route.name === 'collectionSettingsFavorite'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
          >
            <div class="flex items-center gap-3">
              <Heart class="h-4 w-4 flex-shrink-0" :class="theme.textSecondary" />
              <span class="text-sm font-medium" :class="theme.textPrimary">Favorite</span>
            </div>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-semibold"
              :class="
                favoriteEnabled
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              "
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
                :to="{ name: 'collectionSettingsGeneral', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200"
                :class="[
                  $route.name === 'collectionSettingsGeneral'
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                ]"
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
                :to="{ name: 'collectionSettingsPrivacy', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200"
                :class="[
                  $route.name === 'collectionSettingsPrivacy'
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                ]"
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
                :to="{ name: 'collectionSettingsDownload', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200 relative"
                :class="[
                  $route.name?.toString().startsWith('collectionSettingsDownload')
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                ]"
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
                :to="{ name: 'collectionSettingsFavorite', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200 relative"
                :class="[
                  $route.name === 'collectionSettingsFavorite'
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                ]"
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
      <div
        class="flex-1 overflow-y-auto custom-scrollbar"
        :class="isSidebarCollapsed ? 'ml-0' : ''"
      >
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 class="h-8 w-8 animate-spin mx-auto" :class="theme.textSecondary" />
            <p class="text-sm" :class="theme.textSecondary">Loading settings...</p>
          </div>
        </div>

        <div
          v-else
          class="max-w-[50%] mx-auto p-6 md:p-8 transition-all duration-300"
          :class="isSidebarCollapsed ? 'max-w-full' : ''"
        >
          <!-- Page Header -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl md:text-3xl font-bold" :class="theme.textPrimary">
                Download Settings
              </h1>
              <button
                class="w-5 h-5 rounded-full border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-95"
                :class="theme.borderSecondary"
                title="More information"
              >
                <Info class="h-3 w-3" :class="theme.textSecondary" />
              </button>
            </div>
            <p class="text-sm leading-relaxed max-w-2xl" :class="theme.textSecondary">
              Configure download settings including photo sizes, PIN requirements, and download
              restrictions.
            </p>
          </div>

          <!-- Sub-tabs -->
          <div class="flex gap-1 border-b mb-8" :class="theme.borderSecondary">
            <router-link
              v-if="collection?.id"
              :to="{ name: 'collectionSettingsDownloadGeneral', params: { uuid: collection.id } }"
              class="px-4 py-2.5 text-sm font-medium transition-all duration-200 relative hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-t-lg"
              :class="[
                $route.name === 'collectionSettingsDownloadGeneral'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 font-semibold'
                  : theme.textSecondary + ' hover:text-teal-600 dark:hover:text-teal-400',
              ]"
            >
              General Settings
            </router-link>
            <router-link
              v-if="collection?.id"
              :to="{ name: 'collectionSettingsDownloadAdvanced', params: { uuid: collection.id } }"
              class="px-4 py-2.5 text-sm font-medium transition-all duration-200 relative hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-t-lg"
              :class="[
                $route.name === 'collectionSettingsDownloadAdvanced'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 font-semibold'
                  : theme.textSecondary + ' hover:text-teal-600 dark:hover:text-teal-400',
              ]"
            >
              Advanced Settings
            </router-link>
          </div>

          <!-- Router View for child routes -->
          <router-view />
        </div>
      </div>
    </template>
  </CollectionLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Settings, Lock, Download, Heart, Loader2, Info, RefreshCw } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import CollectionLayout from '@/components/organisms/CollectionLayout.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { usePresetStore } from '@/stores/preset'
import type { Collection } from '@/api/collections'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const presetStore = usePresetStore()

// Collection data
const collection = ref<Collection | null>(null)
const isLoading = ref(false)
const collectionStatus = ref<'draft' | 'published'>('draft')
const eventDate = ref<Date | null>(null)
const selectedPresetId = ref<string>('none')
const selectedPresetName = computed(() => {
  if (selectedPresetId.value === 'none') return null
  const preset = presets.value.find((p: any) => p.id === selectedPresetId.value)
  return preset?.name || null
})
const selectedWatermark = ref('none')
const selectedWatermarkName = computed(() => {
  if (selectedWatermark.value === 'none') return null
  const watermark = watermarks.value.find((w: any) => w.id === selectedWatermark.value)
  return watermark?.name || null
})
const presets = computed(() => presetStore.presets)
const watermarks = computed(() => galleryStore.watermarks || [])

// UI State
const activeTab = ref<'photos' | 'design' | 'settings' | 'activities'>('settings')
const { isSidebarCollapsed } = useSidebarCollapse()

// Download settings state
const downloadEnabled = ref(true)
const favoriteEnabled = ref(true)
const photoDownload = ref(true)
const highResolutionEnabled = ref(true)
const webSizeEnabled = ref(true)
const webSize = ref('1024px')
const downloadPinEnabled = ref(true)
const downloadPin = ref('2434')

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid as string
  if (!collectionId) return

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    collectionStatus.value = collectionData.status === 'active' ? 'published' : 'draft'
    eventDate.value = collectionData.eventDate ? new Date(collectionData.eventDate) : null
    selectedPresetId.value = (collectionData as any).presetId || 'none'
    selectedWatermark.value = (collectionData as any).watermarkId || 'none'
    photoDownload.value = (collectionData as any).photoDownload !== false
    highResolutionEnabled.value = (collectionData as any).highResolutionEnabled !== false
    webSizeEnabled.value = (collectionData as any).webSizeEnabled !== false
    webSize.value = (collectionData as any).webSize || '1024px'
    downloadPinEnabled.value = (collectionData as any).downloadPinEnabled !== false
    downloadPin.value = (collectionData as any).downloadPin || '2434'
    downloadEnabled.value = (collectionData as any).downloadEnabled !== false
    favoriteEnabled.value = (collectionData as any).favoriteEnabled !== false
  } catch (error: any) {
    toast.error('Failed to load collection', {
      description: error.message || 'An error occurred while loading the collection.',
    })
  } finally {
    isLoading.value = false
  }
})

// Navigation
const goBack = () => {
  router.push({ name: 'manageCollections' })
}

// Handle status change
const handleStatusChange = async (newStatus: string) => {
  if (!collection.value || !newStatus) return

  try {
    const apiStatus =
      newStatus === 'published' ? 'active' : (newStatus as 'draft' | 'active' | 'archived')
    await galleryStore.updateCollection(collection.value.id, {
      status: apiStatus,
    } as any)

    collectionStatus.value = newStatus as 'draft' | 'published'
    toast.success('Collection status updated successfully')
  } catch (error: any) {
    toast.error('Failed to update collection status', {
      description: error.message || 'An error occurred while updating.',
    })
  }
}

// Handle date change
const handleDateChange = async (newDate: Date | null) => {
  if (!collection.value) return

  try {
    const dateString = newDate instanceof Date ? newDate.toISOString() : newDate || null
    await galleryStore.updateCollection(collection.value.id, {
      eventDate: dateString,
    } as any)

    eventDate.value = newDate
    toast.success('Event date updated successfully')
  } catch (error: any) {
    toast.error('Failed to update event date', {
      description: error.message || 'An error occurred while updating.',
    })
  }
}

// Handle preset change
const handlePresetChange = async (presetId: string) => {
  if (!collection.value) return
  selectedPresetId.value = presetId
}

// Handle watermark change
const handleWatermarkChange = async (watermarkId: string) => {
  if (!collection.value) return
  selectedWatermark.value = watermarkId
}

// Reset PIN
const resetPin = () => {
  downloadPin.value = Math.floor(1000 + Math.random() * 9000).toString()
  toast.success('PIN reset successfully')
}
</script>
