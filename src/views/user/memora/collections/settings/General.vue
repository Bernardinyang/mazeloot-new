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
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
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
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
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
                  route.name === 'collectionSettingsGeneral' ? 'bg-teal-500 text-white' : '',
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
                  route.name === 'collectionSettingsPrivacy' ? 'bg-teal-500 text-white' : '',
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
                    ? 'bg-teal-500 text-white'
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
                  route.name === 'collectionSettingsFavorite' ? 'bg-teal-500 text-white' : '',
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
                General Settings
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
              Configure general settings for your collection including contact information, URL,
              tags, and display preferences.
            </p>
          </div>

          <!-- Settings Sections -->
          <div class="space-y-6">
            <!-- Collection Contact -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                  Collection Contact
                </h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                  Link this collection to one or more contacts and view in Studio Manager.
                  <a class="text-teal-600 dark:text-teal-400 hover:underline font-medium" href="#"
                    >Learn more</a
                  >
                </p>
              </div>
              <Button
                :class="[theme.borderSecondary, theme.bgCard, theme.textPrimary]"
                class="group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 hover:scale-105 active:scale-95"
                variant="outline"
              >
                <Plus
                  class="h-4 w-4 mr-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
                />
                Add Contact
              </Button>
            </div>

            <!-- Collection URL -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Collection URL</h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Choose a unique url for visitors to access your collection.
                </p>
              </div>
              <Input
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                :model-value="collectionUrl"
                class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                placeholder="mysamplecollection"
                @update:model-value="collectionUrl = $event"
              />
            </div>

            <!-- Category Tags -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Category Tags</h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Add tags to categorize different collections e.g. wedding, outdoor, summer.
                  <a class="text-teal-600 dark:text-teal-400 hover:underline font-medium" href="#"
                    >Learn more</a
                  >
                </p>
              </div>
              <Input
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                :model-value="categoryTags"
                class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                placeholder="Select or enter tags"
                @update:model-value="categoryTags = $event"
              />
            </div>

            <!-- Default Watermark -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                  Default Watermark
                </h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Set the default watermark to apply to photos. Manage watermarks in
                  <a class="text-teal-600 dark:text-teal-400 hover:underline font-medium" href="#"
                    >App settings</a
                  >.
                </p>
              </div>
              <Select
                :model-value="selectedWatermark"
                @update:model-value="handleWatermarkChange($event)"
              >
                <SelectTrigger
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                >
                  <SelectValue :placeholder="selectedWatermarkName || 'No watermark'" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgCard, theme.borderCard]">
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    value="none"
                    >No watermark
                  </SelectItem>
                  <SelectItem
                    v-for="watermark in watermarks"
                    :key="watermark.id"
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    :value="watermark.id"
                  >
                    {{ watermark.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Auto Expiry -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Auto Expiry</h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Automatically set your collection to hidden on a specific date
                  <span v-if="autoExpiryDate" class="font-medium"
                    >({{ formatDate(autoExpiryDate) }} at 11:59pm GMT+1)</span
                  >
                </p>
              </div>
              <div class="flex items-center gap-3 max-w-md">
                <Input
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  :model-value="autoExpiryDate"
                  class="flex-1 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  type="date"
                  @update:model-value="autoExpiryDate = $event"
                />
                <Button
                  :class="[theme.borderSecondary, theme.textPrimary]"
                  class="group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 hover:scale-105 active:scale-95"
                  size="sm"
                  variant="outline"
                >
                  <Plus
                    class="h-4 w-4 mr-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
                  />
                  Add expiry reminder email
                </Button>
              </div>
            </div>

            <!-- Email Registration -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Email Registration
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Track email addresses accessing this collection.
                    <a class="text-teal-600 dark:text-teal-400 hover:underline font-medium" href="#"
                      >Learn more</a
                    >
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="emailRegistration" label="" />
                </div>
              </div>
            </div>

            <!-- Gallery Assist -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Gallery Assist
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Add walk-through cards to help visitors use the collection.
                    <a class="text-teal-600 dark:text-teal-400 hover:underline font-medium" href="#"
                      >Learn more</a
                    >
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="galleryAssist" label="" />
                </div>
              </div>
            </div>

            <!-- Slideshow -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Slideshow</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Allow visitors to view the images in their collection slideshow.
                    <a class="text-teal-600 dark:text-teal-400 hover:underline font-medium" href="#"
                      >Learn more</a
                    >
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="slideshow" label="" />
                </div>
              </div>
              <Select
                v-if="slideshow"
                :model-value="slideshowOptions"
                @update:model-value="slideshowOptions = $event"
              >
                <SelectTrigger
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                >
                  <SelectValue placeholder="Additional options" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgCard, theme.borderCard]">
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    value="autoplay"
                    >Autoplay
                  </SelectItem>
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    value="loop"
                    >Loop
                  </SelectItem>
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    value="fullscreen"
                    >Fullscreen
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Social Sharing -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Social Sharing
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Allow collection visitors to share your work to social media.
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="socialSharing" label="" />
                </div>
              </div>
            </div>

            <!-- Language -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Language</h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Choose the language to display this collection in.
                </p>
              </div>
              <Select :model-value="language" @update:model-value="language = $event">
                <SelectTrigger
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                >
                  <SelectValue placeholder="English" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgCard, theme.borderCard]">
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    value="en"
                    >English
                  </SelectItem>
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    value="es"
                    >Spanish
                  </SelectItem>
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    value="fr"
                    >French
                  </SelectItem>
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    value="de"
                    >German
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CollectionLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Download, Heart, Info, Loader2, Lock, Plus, Settings } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
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
import { toast } from 'vue-sonner'

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

// Settings state
const collectionUrl = ref('')
const categoryTags = ref('')
const autoExpiryDate = ref(null)
const emailRegistration = ref(false)
const galleryAssist = ref(false)
const slideshow = ref(true)
const slideshowOptions = ref('')
const socialSharing = ref(true)
const language = ref('en')
const downloadEnabled = ref(true)
const favoriteEnabled = ref(true)

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    collectionStatus.value = collectionData.status === 'active' ? 'published' : 'draft'
    eventDate.value = collectionData.eventDate ? new Date(collectionData.eventDate) : null
    selectedPresetId.value = collectionData.presetId || 'none'
    selectedWatermark.value = collectionData.watermarkId || 'none'
    collectionUrl.value = collectionData.url || ''
    categoryTags.value = collectionData.tags?.join(', ') || ''
    autoExpiryDate.value = collectionData.expiryDate || null
    emailRegistration.value = collectionData.emailRegistration || false
    galleryAssist.value = collectionData.galleryAssist || false
    slideshow.value = collectionData.slideshow !== false
    slideshowOptions.value = Array.isArray(collectionData.slideshowOptions)
      ? collectionData.slideshowOptions[0] || ''
      : ''
    socialSharing.value = collectionData.socialSharing !== false
    language.value = collectionData.language || 'en'
    downloadEnabled.value = collectionData.downloadEnabled !== false
    favoriteEnabled.value = collectionData.favoriteEnabled !== false
  } catch (error) {
    toast.error('Failed to load collection', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  } finally {
    isLoading.value = false
  }
})

// Navigation
const goBack = () => {
  router.push({ name: 'collectionPhotos', params: { uuid: collection.value?.id } })
}

// Handle status change
const handleStatusChange = async newStatus => {
  if (!collection.value || !newStatus) return

  try {
    const apiStatus = newStatus === 'published' ? 'active' : 'draft'
    await galleryStore.updateCollection(collection.value.id, {
      status: apiStatus,
    })

    collectionStatus.value = newStatus === 'published' ? 'published' : 'draft'
    toast.success('Collection status updated successfully')
  } catch (error) {
    toast.error('Failed to update collection status', {
      description,
    })
  }
}

// Handle date change
const handleDateChange = async newDate => {
  if (!collection.value) return

  try {
    const dateString = newDate instanceof Date ? newDate.toISOString() : null
    await galleryStore.updateCollection(collection.value.id, {
      eventDate: dateString,
    })

    eventDate.value = newDate
    toast.success('Event date updated successfully')
  } catch (error) {
    toast.error('Failed to update event date', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

// Handle preset change
const handlePresetChange = async presetId => {
  if (!collection.value) return
  selectedPresetId.value = presetId
  // Auto-save preset change
}

// Handle watermark change
const handleWatermarkChange = async watermarkId => {
  if (!collection.value) return
  selectedWatermark.value = watermarkId
  try {
    await galleryStore.updateCollection(collection.value.id, {
      watermarkId: watermarkId === 'none' ? undefined : watermarkId,
    })
    toast.success('Watermark updated successfully')
  } catch (error) {
    toast.error('Failed to update watermark', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

// Watch and save settings changes
watch(collectionUrl, async newUrl => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, { url: newUrl })
  } catch (error) {
    toast.error('Failed to update URL', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
})

watch(categoryTags, async newTags => {
  if (!collection.value) return
  try {
    const tagsArray = newTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    await galleryStore.updateCollection(collection.value.id, { tags: tagsArray })
  } catch (error) {
    toast.error('Failed to update tags', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
})

watch(autoExpiryDate, async newDate => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      expiryDate,
    })
  } catch (error) {
    toast.error('Failed to update expiry date')
  }
})

watch(emailRegistration, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      emailRegistration,
    })
  } catch (error) {
    toast.error('Failed to update email registration')
  }
})

watch(galleryAssist, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, { galleryAssist: newValue })
  } catch (error) {
    toast.error('Failed to update gallery assist', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
})

watch(slideshow, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, { slideshow: newValue })
  } catch (error) {
    toast.error('Failed to update slideshow', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
})

watch(slideshowOptions, async newOption => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      slideshowOptions: Array.isArray(newOption) ? newOption : [newOption],
    })
  } catch (error) {
    toast.error('Failed to update slideshow options')
  }
})

watch(socialSharing, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, { socialSharing: newValue })
  } catch (error) {
    toast.error('Failed to update social sharing', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
})

watch(language, async newLanguage => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, { language: newLanguage })
  } catch (error) {
    toast.error('Failed to update language', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
})

// Format date helper
const formatDate = dateString => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
