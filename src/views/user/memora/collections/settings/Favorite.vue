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
              $route.name === 'collectionSettingsGeneral'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
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
              $route.name === 'collectionSettingsPrivacy'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
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
              $route.name?.toString().startsWith('collectionSettingsDownload')
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
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
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              "
              class="px-2 py-0.5 rounded-full text-xs font-semibold"
            >
              {{ downloadEnabled ? 'ON' : 'OFF' }}
            </span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :class="[
              $route.name === 'collectionSettingsFavorite'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
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
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
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
                  $route.name === 'collectionSettingsGeneral'
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
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
                  $route.name === 'collectionSettingsPrivacy'
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
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
                  $route.name?.toString().startsWith('collectionSettingsDownload')
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
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
                  $route.name === 'collectionSettingsFavorite'
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
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
      <div
        :class="isSidebarCollapsed ? 'ml-0' : ''"
        class="flex-1 overflow-y-auto custom-scrollbar"
      >
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading settings...</p>
          </div>
        </div>

        <div
          v-else
          :class="isSidebarCollapsed ? 'max-w-full' : ''"
          class="max-w-[50%] p-6 md:p-8 transition-all duration-300"
        >
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

            <!-- Preset Favorite Lists -->
            <div
              :class="theme.borderSecondary"
              class="p-6 rounded-2xl border-2 bg-teal-50/50 dark:bg-teal-900/10 transition-all duration-300"
            >
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-100 dark:bg-teal-900/30 flex-shrink-0"
                >
                  <Heart class="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-2">
                    Preset Favorite Lists
                  </h3>
                  <p :class="theme.textSecondary" class="text-sm mb-4 leading-relaxed">
                    Create Favorite lists and set selection limits for your clients to make
                    selections for albums, free downloads, retouching and more.
                  </p>
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 hover:scale-105 active:scale-95"
                    size="sm"
                    variant="outline"
                  >
                    Create Favorite List
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CollectionLayout>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Download, Heart, Info, Loader2, Lock, Settings } from 'lucide-vue-next'
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

// Favorite settings state
const favoritePhotos = ref(true)
const favoriteNotes = ref(true)
const downloadEnabled = ref(true)
const favoriteEnabled = ref(true)

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
    favoritePhotos.value = (collectionData as any).favoritePhotos !== false
    favoriteNotes.value = (collectionData as any).favoriteNotes !== false
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

// Watch and save favorite settings changes
watch(favoritePhotos, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      favoritePhotos: newValue,
      favoriteEnabled: newValue || favoriteNotes.value,
    } as any)
  } catch (error: any) {
    toast.error('Failed to update favorite photos')
  }
})

watch(favoriteNotes, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      favoriteNotes: newValue,
      favoriteEnabled: favoritePhotos.value || newValue,
    } as any)
  } catch (error: any) {
    toast.error('Failed to update favorite notes')
  }
})
</script>
