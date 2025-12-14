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
                General Settings
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
              Configure general settings for your collection including contact information, URL,
              tags, and display preferences.
            </p>
          </div>

          <!-- Settings Sections -->
          <div class="space-y-6">
            <!-- Collection Contact -->
            <div
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div>
                <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">
                  Collection Contact
                </h3>
                <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                  Link this collection to one or more contacts and view in Studio Manager.
                  <a href="#" class="text-teal-600 dark:text-teal-400 hover:underline font-medium"
                    >Learn more</a
                  >
                </p>
              </div>
              <Button
                variant="outline"
                class="group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 hover:scale-105 active:scale-95"
                :class="[theme.borderSecondary, theme.bgCard, theme.textPrimary]"
              >
                <Plus
                  class="h-4 w-4 mr-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
                />
                Add Contact
              </Button>
            </div>

            <!-- Collection URL -->
            <div
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div>
                <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">Collection URL</h3>
                <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
                  Choose a unique url for visitors to access your collection.
                </p>
              </div>
              <Input
                :model-value="collectionUrl"
                @update:model-value="collectionUrl = $event"
                placeholder="mysamplecollection"
                class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
              />
            </div>

            <!-- Category Tags -->
            <div
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div>
                <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">Category Tags</h3>
                <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
                  Add tags to categorize different collections e.g. wedding, outdoor, summer.
                  <a href="#" class="text-teal-600 dark:text-teal-400 hover:underline font-medium"
                    >Learn more</a
                  >
                </p>
              </div>
              <Input
                :model-value="categoryTags"
                @update:model-value="categoryTags = $event"
                placeholder="Select or enter tags"
                class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
              />
            </div>

            <!-- Default Watermark -->
            <div
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div>
                <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">
                  Default Watermark
                </h3>
                <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
                  Set the default watermark to apply to photos. Manage watermarks in
                  <a href="#" class="text-teal-600 dark:text-teal-400 hover:underline font-medium"
                    >App settings</a
                  >.
                </p>
              </div>
              <Select
                :model-value="selectedWatermark"
                @update:model-value="handleWatermarkChange($event)"
              >
                <SelectTrigger
                  class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                >
                  <SelectValue :placeholder="selectedWatermarkName || 'No watermark'" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgCard, theme.borderCard]">
                  <SelectItem
                    value="none"
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    >No watermark</SelectItem
                  >
                  <SelectItem
                    v-for="watermark in watermarks"
                    :key="watermark.id"
                    :value="watermark.id"
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                  >
                    {{ watermark.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Auto Expiry -->
            <div
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div>
                <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">Auto Expiry</h3>
                <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
                  Automatically set your collection to hidden on a specific date
                  <span v-if="autoExpiryDate" class="font-medium"
                    >({{ formatDate(autoExpiryDate) }} at 11:59pm GMT+1)</span
                  >
                </p>
              </div>
              <div class="flex items-center gap-3 max-w-md">
                <Input
                  type="date"
                  :model-value="autoExpiryDate"
                  @update:model-value="autoExpiryDate = $event"
                  class="flex-1 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  class="group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 hover:scale-105 active:scale-95"
                  :class="[theme.borderSecondary, theme.textPrimary]"
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
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">
                    Email Registration
                  </h3>
                  <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                    Track email addresses accessing this collection.
                    <a href="#" class="text-teal-600 dark:text-teal-400 hover:underline font-medium"
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
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">
                    Gallery Assist
                  </h3>
                  <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                    Add walk-through cards to help visitors use the collection.
                    <a href="#" class="text-teal-600 dark:text-teal-400 hover:underline font-medium"
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
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">Slideshow</h3>
                  <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
                    Allow visitors to view the images in their collection as a slideshow.
                    <a href="#" class="text-teal-600 dark:text-teal-400 hover:underline font-medium"
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
                  class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                >
                  <SelectValue placeholder="Additional options" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgCard, theme.borderCard]">
                  <SelectItem
                    value="autoplay"
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    >Autoplay</SelectItem
                  >
                  <SelectItem
                    value="loop"
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    >Loop</SelectItem
                  >
                  <SelectItem
                    value="fullscreen"
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    >Fullscreen</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>

            <!-- Social Sharing -->
            <div
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">
                    Social Sharing
                  </h3>
                  <p class="text-xs leading-relaxed" :class="theme.textSecondary">
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
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div>
                <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">Language</h3>
                <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
                  Choose the language to display this collection in.
                </p>
              </div>
              <Select :model-value="language" @update:model-value="language = $event">
                <SelectTrigger
                  class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                >
                  <SelectValue placeholder="English" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgCard, theme.borderCard]">
                  <SelectItem
                    value="en"
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    >English</SelectItem
                  >
                  <SelectItem
                    value="es"
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    >Spanish</SelectItem
                  >
                  <SelectItem
                    value="fr"
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    >French</SelectItem
                  >
                  <SelectItem
                    value="de"
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                    ]"
                    >German</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CollectionLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Settings, Lock, Download, Heart, Plus, Info, Loader2 } from 'lucide-vue-next'
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

// Settings state
const collectionUrl = ref('')
const categoryTags = ref('')
const autoExpiryDate = ref<string | null>(null)
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
    collectionUrl.value = (collectionData as any).url || ''
    categoryTags.value = (collectionData as any).tags?.join(', ') || ''
    autoExpiryDate.value = (collectionData as any).expiryDate || null
    emailRegistration.value = (collectionData as any).emailRegistration || false
    galleryAssist.value = (collectionData as any).galleryAssist || false
    slideshow.value = (collectionData as any).slideshow !== false
    socialSharing.value = (collectionData as any).socialSharing !== false
    language.value = (collectionData as any).language || 'en'
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
  // Auto-save preset change
}

// Handle watermark change
const handleWatermarkChange = async (watermarkId: string) => {
  if (!collection.value) return
  selectedWatermark.value = watermarkId
  // Auto-save watermark change
}

// Format date helper
const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
