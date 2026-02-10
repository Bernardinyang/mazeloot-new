<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <!-- Sidebar is unified in CollectionLayout -->
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="max-w-full md:max-w-[50%] p-4 sm:p-6 md:p-8 transition-all duration-300">
          <!-- Skeleton Header -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-2">
              <Skeleton class="h-9 w-64 rounded-lg" />
              <Skeleton class="h-5 w-5 rounded-full" />
            </div>
            <Skeleton class="h-4 w-96 rounded-md" />
          </div>

          <!-- Skeleton Settings Sections -->
          <div class="space-y-6">
            <div class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600/70">
              <div>
                <Skeleton class="h-6 w-32 rounded-md mb-2" />
                <Skeleton class="h-3 w-80 rounded-md mb-3" />
              </div>
              <Skeleton class="h-10 w-64 rounded-md" />
            </div>
            <div class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600/70">
              <div>
                <Skeleton class="h-6 w-40 rounded-md mb-2" />
                <Skeleton class="h-3 w-72 rounded-md mb-3" />
              </div>
              <Skeleton class="h-10 w-64 rounded-md" />
            </div>
            <div class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600/70">
              <div>
                <Skeleton class="h-6 w-36 rounded-md mb-2" />
                <Skeleton class="h-3 w-96 rounded-md mb-3" />
              </div>
              <div class="flex items-center gap-3">
                <Skeleton class="h-5 w-5 rounded" />
                <Skeleton class="h-4 w-48 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="max-w-full md:max-w-[50%] p-4 sm:p-6 md:p-8 transition-all duration-300">
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
              Configure general settings for your collection including URL,
              tags, and display preferences.
            </p>
          </div>

          <!-- Settings Sections -->
          <div class="space-y-6">
            <!-- Name -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Name</h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  The name of this collection.
                </p>
              </div>
              <Input
                v-model="collectionName"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-md focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="Enter collection name"
                @keydown.enter="handleSave"
              />
            </div>

            <!-- Event Date -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Event Date</h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  The date associated with this collection.
                </p>
              </div>
              <Popover v-model:open="isDatePickerOpen">
                <PopoverTrigger as-child>
                  <button
                    :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                    class="max-w-md text-left px-3 py-2 rounded-md focus:ring-2 focus:ring-violet-500/20 transition-all flex items-center justify-between"
                  >
                    <span>{{ eventDate ? formatDate(eventDate) : 'Select date' }}</span>
                    <ChevronDown class="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent :class="[theme.bgCard, theme.borderCard, 'w-auto p-0']" align="start">
                  <Calendar
                    :model-value="eventDate"
                    @update:model-value="handleDatePickerChange"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <!-- Preset -->
            <div
              v-if="presets && presets.length > 0"
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Preset</h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Apply a preset configuration to this collection. This will update all settings from the preset.
                </p>
              </div>
              <div class="flex items-center gap-3">
                <Select
                  :model-value="selectedPresetId"
                  @update:model-value="handlePresetChange($event)"
                >
                  <SelectTrigger
                    :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                    class="max-w-md focus:ring-2 focus:ring-violet-500/20 transition-all"
                  >
                    <SelectValue :placeholder="selectedPresetName || 'No preset'" />
                  </SelectTrigger>
                  <SelectContent :class="[theme.bgCard, theme.borderCard]">
                    <SelectItem
                      :class="[
                        theme.textPrimary,
                        theme.bgButtonHover,
                        'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                      ]"
                      value="none"
                      >No preset
                    </SelectItem>
                    <SelectItem
                      v-for="preset in presets"
                      :key="preset.id"
                      :class="[
                        theme.textPrimary,
                        theme.bgButtonHover,
                        'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                      ]"
                      :value="preset.id"
                    >
                      {{ preset.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  v-if="selectedPresetId !== 'none'"
                  variant="accent"
                  :loading="isApplyingPreset"
                  :icon="Sparkles"
                  loading-label="Applying..."
                  @click="handleApplyPreset"
                >
                  Apply Preset
                </Button>
              </div>
            </div>

            <!-- Default Watermark -->
            <div
              v-if="watermarks && watermarks.length > 0"
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                  Default Watermark
                </h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Set the default watermark to apply to photos. Manage watermarks in
                  <a class="text-violet-600 dark:text-violet-400 hover:underline font-medium" href="#"
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
                  class="max-w-md focus:ring-2 focus:ring-violet-500/20 transition-all"
                >
                  <SelectValue :placeholder="selectedWatermarkName || 'No watermark'" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgCard, theme.borderCard]">
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-violet-50 dark:hover:bg-violet-950/20',
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
                      'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                    ]"
                    :value="watermark.id"
                  >
                    {{ watermark.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Description -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Description</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Optional description shown to clients viewing this collection.
                  </p>
                </div>
              </div>
              <Textarea
                v-model="collectionDescription"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-2xl min-h-[100px] resize-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="Enter a description for this collection..."
                :maxlength="1000"
                @keydown.enter.prevent="handleSave"
              />
              <div class="flex items-center justify-between max-w-2xl">
                <p :class="theme.textTertiary" class="text-xs">
                  Description is shown to clients viewing this collection.
                </p>
                <span :class="theme.textTertiary" class="text-xs">
                  {{ (collectionDescription || '').length }}/1000
                </span>
              </div>
            </div>

            <!-- Email Registration -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Email Registration
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Track email addresses accessing this collection.
                    <a class="text-violet-600 dark:text-violet-400 hover:underline font-medium" href="#"
                      >Learn more</a
                    >
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="emailRegistration" label="" :disabled="true" />
                </div>
              </div>
            </div>

            <!-- Gallery Assist -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Gallery Assist
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Add walk-through cards to help visitors use the collection.
                    <a class="text-violet-600 dark:text-violet-400 hover:underline font-medium" href="#"
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
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Slideshow</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Allow visitors to view the images in their collection as a slideshow.
                    <a
                      href="#"
                      class="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline font-medium transition-colors"
                      >Learn more</a
                    >
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <div class="flex items-center gap-3">
                    <span
                      class="text-sm font-medium min-w-[2.5rem] text-right transition-colors"
                      :class="slideshow ? theme.textPrimary : theme.textSecondary"
                    >
                      {{ slideshow ? 'On' : 'Off' }}
                    </span>
                    <label class="relative inline-flex items-center group cursor-pointer">
                      <input type="checkbox" v-model="slideshow" class="sr-only peer" />
                      <div
                        class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"
                        :class="
                          slideshow
                            ? 'bg-violet-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        "
                      ></div>
                    </label>
                </div>
              </div>
              </div>

              <!-- Additional Options (Expandable) -->
              <div
                v-if="slideshow"
                class="pt-4 border-t space-y-5"
                :class="theme.borderSecondary"
              >
                <button
                  @click="showSlideshowOptions = !showSlideshowOptions"
                  class="flex items-center gap-2 text-sm font-semibold transition-colors group"
                    :class="[
                    showSlideshowOptions
                      ? 'text-violet-600 dark:text-violet-400'
                      : theme.textPrimary,
                    'hover:text-violet-600 dark:hover:text-violet-400',
                  ]"
                >
                  <ChevronDown
                    class="h-4 w-4 transition-transform duration-200"
                    :class="showSlideshowOptions ? 'rotate-180' : ''"
                  />
                  Additional options
                </button>

                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 max-h-0"
                  enter-to-class="opacity-100 max-h-[500px]"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 max-h-[500px]"
                  leave-to-class="opacity-0 max-h-0"
                >
                  <div v-if="showSlideshowOptions" class="space-y-5 pl-6 overflow-hidden">
                    <!-- Slideshow Speed -->
                    <div class="space-y-3">
                      <label class="text-sm font-semibold block" :class="theme.textPrimary">
                        Slideshow Speed
                      </label>
                      <div class="flex items-center gap-6">
                        <label
                          class="flex items-center gap-2.5 cursor-pointer group"
                          :class="slideshowSpeed === 'slow' ? '' : 'opacity-60 hover:opacity-100'"
                        >
                          <input
                            type="radio"
                            v-model="slideshowSpeed"
                            value="slow"
                            class="w-4 h-4 text-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all cursor-pointer"
                            :checked="slideshowSpeed === 'slow'"
                          />
                          <span
                            class="text-sm font-medium transition-colors"
                            :class="
                              slideshowSpeed === 'slow'
                                ? theme.textPrimary
                                : theme.textSecondary
                            "
                          >
                            Slow
                          </span>
                        </label>
                        <label
                          class="flex items-center gap-2.5 cursor-pointer group"
                          :class="
                            slideshowSpeed === 'regular' ? '' : 'opacity-60 hover:opacity-100'
                          "
                        >
                          <input
                            type="radio"
                            v-model="slideshowSpeed"
                            value="regular"
                            class="w-4 h-4 text-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all cursor-pointer"
                            :checked="slideshowSpeed === 'regular'"
                          />
                          <span
                            class="text-sm font-medium transition-colors"
                            :class="
                              slideshowSpeed === 'regular'
                                ? theme.textPrimary
                                : theme.textSecondary
                            "
                          >
                            Regular
                          </span>
                        </label>
                        <label
                          class="flex items-center gap-2.5 cursor-pointer group"
                          :class="slideshowSpeed === 'fast' ? '' : 'opacity-60 hover:opacity-100'"
                        >
                          <input
                            type="radio"
                            v-model="slideshowSpeed"
                            value="fast"
                            class="w-4 h-4 text-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all cursor-pointer"
                            :checked="slideshowSpeed === 'fast'"
                          />
                          <span
                            class="text-sm font-medium transition-colors"
                            :class="
                              slideshowSpeed === 'fast'
                                ? theme.textPrimary
                                : theme.textSecondary
                            "
                          >
                            Fast
                          </span>
                        </label>
                      </div>
                    </div>

                    <!-- Auto Loop -->
                    <div
                      class="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-violet-500/50"
                      :class="[theme.borderSecondary, theme.bgCard]"
                    >
                      <div class="flex-1">
                        <h4 class="text-sm font-semibold mb-1" :class="theme.textPrimary">
                          Auto Loop
                        </h4>
                        <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                          Automatically loop the slideshow when it reaches the end.
                        </p>
                      </div>
                      <div class="flex items-center gap-3 flex-shrink-0">
                        <span
                          class="text-sm font-medium min-w-[2.5rem] text-right transition-colors"
                          :class="
                            slideshowAutoLoop ? theme.textPrimary : theme.textSecondary
                          "
                        >
                          {{ slideshowAutoLoop ? 'On' : 'Off' }}
                        </span>
                        <label class="relative inline-flex items-center group cursor-pointer">
                          <input
                            type="checkbox"
                            v-model="slideshowAutoLoop"
                            class="sr-only peer"
                          />
                          <div
                            class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"
                            :class="
                              slideshowAutoLoop
                                ? 'bg-violet-500'
                                : 'bg-gray-300 dark:bg-gray-600'
                            "
                          ></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Social Sharing -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
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
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
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
                  class="max-w-md focus:ring-2 focus:ring-violet-500/20 transition-all"
                >
                  <SelectValue placeholder="English" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgCard, theme.borderCard]">
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                    ]"
                    value="en"
                    >English
                  </SelectItem>
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                    ]"
                    value="es"
                    >Spanish
                  </SelectItem>
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                    ]"
                    value="fr"
                    >French
                  </SelectItem>
                  <SelectItem
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                    ]"
                    value="de"
                    >German
                  </SelectItem>
                </SelectContent>
              </Select>
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
                <Check class="h-4 w-4 text-violet-500" />
                <span :class="theme.textSecondary">All changes saved</span>
              </div>
              <Button
                variant="accent"
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
      </div>
    </template>
  </CollectionLayout>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, ChevronDown, Download, Heart, Info, Lock, Settings, Sparkles } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import { Textarea } from '@/shared/components/shadcn/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/shadcn/tooltip'
import { Calendar } from '@/shared/components/shadcn/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/shadcn/popover/index'
import CollectionLayout from '@/domains/memora/layouts/CollectionLayout.vue'
import ToggleSwitch from '@/shared/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useSidebarCollapse } from '@/shared/composables/useSidebarCollapse'
import { useGalleryStore } from '@/shared/stores/gallery'
import { usePresetStore } from '@/domains/memora/stores/preset'
import { useWatermarkStore } from '@/domains/memora/stores/watermark'
import { usePresetsApi } from '@/domains/memora/api/presets'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const presetStore = usePresetStore()
const watermarkStore = useWatermarkStore()
const presetsApi = usePresetsApi()

// Collection data
const collection = ref(null)
const isLoading = ref(true)
const collectionStatus = ref('draft')
const eventDate = ref(null)
const selectedPresetId = ref('none')
const isApplyingPreset = ref(false)
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
const watermarks = computed(() => watermarkStore.watermarks || [])

// UI State
const { isSidebarCollapsed } = useSidebarCollapse()

// Settings state
const collectionName = ref('')
const collectionDescription = ref('')
const emailRegistration = ref(true)
const isDatePickerOpen = ref(false)
const galleryAssist = ref(false)
const slideshow = ref(true)
const showSlideshowOptions = ref(true)
const slideshowSpeed = ref('regular')
const slideshowAutoLoop = ref(true)
const socialSharing = ref(true)
const language = ref('en')
const downloadEnabled = ref(true)
const favoriteEnabled = ref(true)

// Save state
const isSaving = ref(false)
const originalData = ref(null)

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  // Load presets and watermarks
  try {
    if (presetStore.presets.length === 0) {
      await presetStore.loadPresets()
    }
  } catch (error) {
    console.error('Failed to load presets:', error)
  }
  
  try {
    if (watermarkStore.watermarks.length === 0) {
      await watermarkStore.fetchWatermarks()
    }
  } catch (error) {
    console.error('Failed to load watermarks:', error)
  }

  // Check if collection is already in store
  const existingCollection = galleryStore.collections.find(c => c.id === collectionId)
  if (existingCollection) {
    collection.value = existingCollection
    collectionStatus.value = existingCollection.status === 'active' ? 'published' : 'draft'
    eventDate.value = existingCollection.eventDate ? new Date(existingCollection.eventDate) : null
    selectedPresetId.value = existingCollection.presetId || 'none'
    selectedWatermark.value = existingCollection.watermarkId || 'none'
    isLoading.value = false
    collectionName.value = existingCollection.name || ''
    collectionDescription.value = existingCollection.description || ''
    emailRegistration.value = true
    galleryAssist.value = existingCollection.galleryAssist || false
    slideshow.value = existingCollection.slideshow !== false
    slideshowSpeed.value = existingCollection.slideshowSpeed || 'regular'
    slideshowAutoLoop.value = existingCollection.slideshowAutoLoop ?? true
    socialSharing.value = existingCollection.socialSharing !== false
    language.value = existingCollection.language || 'en'
    downloadEnabled.value = existingCollection.downloadEnabled !== false
    favoriteEnabled.value = existingCollection.favoriteEnabled !== false
    
    // Store original data for change detection
    originalData.value = {
      name: existingCollection.name || '',
      eventDate: existingCollection.eventDate || null,
      description: existingCollection.description || '',
      emailRegistration: true,
      galleryAssist: existingCollection.galleryAssist || false,
      slideshow: existingCollection.slideshow !== false,
      slideshowSpeed: existingCollection.slideshowSpeed || 'regular',
      slideshowAutoLoop: existingCollection.slideshowAutoLoop ?? true,
      socialSharing: existingCollection.socialSharing !== false,
      language: existingCollection.language || 'en',
    }
    isLoading.value = false
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
    collectionName.value = collectionData.name || ''
    collectionDescription.value = collectionData.description || ''
    emailRegistration.value = true
    galleryAssist.value = collectionData.galleryAssist || false
    slideshow.value = collectionData.slideshow !== false
    slideshowSpeed.value = collectionData.slideshowSpeed || 'regular'
    slideshowAutoLoop.value = collectionData.slideshowAutoLoop ?? true
    socialSharing.value = collectionData.socialSharing !== false
    language.value = collectionData.language || 'en'
    downloadEnabled.value = collectionData.downloadEnabled !== false
    favoriteEnabled.value = collectionData.favoriteEnabled !== false
    
    // Store original data for change detection
    originalData.value = {
      name: collectionData.name || '',
      eventDate: collectionData.eventDate || null,
      description: collectionData.description || '',
      emailRegistration: true,
      galleryAssist: collectionData.galleryAssist || false,
      slideshow: collectionData.slideshow !== false,
      slideshowSpeed: collectionData.slideshowSpeed || 'regular',
      slideshowAutoLoop: collectionData.slideshowAutoLoop ?? true,
      socialSharing: collectionData.socialSharing !== false,
      language: collectionData.language || 'en',
    }
  } catch (error) {
    toast.error('Failed to load collection', {
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
  } finally {
    isLoading.value = false
  }
})

// Check for unsaved changes
const hasChanges = computed(() => {
  if (!originalData.value) return false
  const currentEventDate = eventDate.value ? (eventDate.value instanceof Date ? eventDate.value.toISOString() : eventDate.value) : null
  const originalEventDate = originalData.value.eventDate ? (originalData.value.eventDate instanceof Date ? originalData.value.eventDate.toISOString() : originalData.value.eventDate) : null
  return (
    (collectionName.value || '') !== (originalData.value.name || '') ||
    currentEventDate !== originalEventDate ||
    (collectionDescription.value || '') !== (originalData.value.description || '') ||
    galleryAssist.value !== originalData.value.galleryAssist ||
    slideshow.value !== originalData.value.slideshow ||
    slideshowSpeed.value !== originalData.value.slideshowSpeed ||
    slideshowAutoLoop.value !== originalData.value.slideshowAutoLoop ||
    socialSharing.value !== originalData.value.socialSharing ||
    language.value !== originalData.value.language
  )
})

// Save all changes
const handleSave = async () => {
  if (!collection.value || !hasChanges.value || isSaving.value) return

  isSaving.value = true
  try {
    const dateString = eventDate.value instanceof Date ? eventDate.value.toISOString() : (eventDate.value || null)
    await galleryStore.updateCollection(collection.value.id, {
      name: collectionName.value || null,
      eventDate: dateString,
      description: collectionDescription.value || null,
      emailRegistration: true,
      galleryAssist: galleryAssist.value,
      slideshow: slideshow.value,
      slideshowSpeed: slideshowSpeed.value,
      slideshowAutoLoop: slideshowAutoLoop.value,
      socialSharing: socialSharing.value,
      language: language.value,
    })

    // Update collection ref
    if (collection.value) {
      collection.value = {
        ...collection.value,
        name: collectionName.value || collection.value.name,
        eventDate: dateString || collection.value.eventDate,
      }
    }

    // Update original data
    originalData.value = {
      name: collectionName.value || '',
      eventDate: dateString,
      description: collectionDescription.value || '',
      emailRegistration: true,
      galleryAssist: galleryAssist.value,
      slideshow: slideshow.value,
      slideshowSpeed: slideshowSpeed.value,
      slideshowAutoLoop: slideshowAutoLoop.value,
      socialSharing: socialSharing.value,
      language: language.value,
    }

    toast.success('Settings saved successfully')
  } catch (error) {
    toast.error('Failed to save settings', {
      description: getErrorMessage(error, 'An unknown error occurred'),
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

const handleDatePickerChange = date => {
  eventDate.value = date
  isDatePickerOpen.value = false
}

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
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
  }
}

const handlePresetChange = async presetId => {
  if (!collection.value) return
  selectedPresetId.value = presetId
  // Auto-save preset change
}

const handleApplyPreset = async () => {
  if (!collection.value || selectedPresetId.value === 'none') return

  // Check if there are media in any set
  const hasMedia = collection.value.mediaCount > 0 || 
    (collection.value.mediaSets && collection.value.mediaSets.some(set => (set.media_count || set.count || 0) > 0))
  
  if (hasMedia) {
    const confirmed = confirm('This collection contains media. Applying preset settings may affect existing content. Do you want to continue?')
    if (!confirmed) {
      return
    }
  }

  isApplyingPreset.value = true
  try {
    // Get preset from store, or fetch it if not loaded
    let preset = presetStore.getPresetById(selectedPresetId.value)
    if (!preset) {
      preset = await presetStore.loadPreset(selectedPresetId.value)
    }
    if (!preset) {
      toast.error('Preset not found')
      return
    }

    // Copy preset settings to collection form fields
    emailRegistration.value = true
    galleryAssist.value = preset.galleryAssist ?? false
    slideshow.value = preset.slideshow ?? true
    slideshowSpeed.value = preset.slideshowSpeed || 'regular'
    slideshowAutoLoop.value = preset.slideshowAutoLoop ?? true
    socialSharing.value = preset.socialSharing ?? true
    language.value = preset.language || 'en'
    
    // Handle collection tags - convert to comma-separated string
    if (preset.collectionTags) {
      if (Array.isArray(preset.collectionTags)) {
        categoryTags.value = preset.collectionTags.join(', ')
      } else if (typeof preset.collectionTags === 'string') {
        categoryTags.value = preset.collectionTags
      }
    }
    
    // Handle watermark
    if (preset.defaultWatermarkId) {
      selectedWatermark.value = preset.defaultWatermarkId
    }

    // Apply preset to collection via backend API
    await presetsApi.applyPresetToCollection(selectedPresetId.value, collection.value.id)
    
    // Force reload collection from backend to get all updated settings (bypass cache)
    const updatedCollection = await galleryStore.fetchCollection(collection.value.id, true)
    if (updatedCollection) {
      // Update collection reference (create new object to trigger reactivity)
      collection.value = { ...updatedCollection }
      
      // Update all form fields with new values from backend
      collectionStatus.value = updatedCollection.status === 'active' ? 'published' : 'draft'
      eventDate.value = updatedCollection.eventDate ? new Date(updatedCollection.eventDate) : null
      collectionName.value = updatedCollection.name || ''
      collectionDescription.value = updatedCollection.description || ''
      selectedPresetId.value = updatedCollection.presetId || 'none'
      selectedWatermark.value = updatedCollection.watermarkId || 'none'
      emailRegistration.value = true
      galleryAssist.value = updatedCollection.galleryAssist ?? false
      slideshow.value = updatedCollection.slideshow !== false
      slideshowSpeed.value = updatedCollection.slideshowSpeed || 'regular'
      slideshowAutoLoop.value = updatedCollection.slideshowAutoLoop ?? true
      socialSharing.value = updatedCollection.socialSharing !== false
      language.value = updatedCollection.language || 'en'
      downloadEnabled.value = updatedCollection.downloadEnabled !== false
      favoriteEnabled.value = updatedCollection.favoriteEnabled !== false
      
      // Update originalData to reflect saved state (no unsaved changes)
      const currentEventDate = updatedCollection.eventDate || null
      originalData.value = {
        name: updatedCollection.name || '',
        eventDate: currentEventDate,
        description: updatedCollection.description || '',
        emailRegistration: true,
        galleryAssist: updatedCollection.galleryAssist ?? false,
        slideshow: updatedCollection.slideshow !== false,
        slideshowSpeed: updatedCollection.slideshowSpeed || 'regular',
        slideshowAutoLoop: updatedCollection.slideshowAutoLoop ?? true,
        socialSharing: updatedCollection.socialSharing !== false,
        language: updatedCollection.language || 'en',
      }
      
      // Wait for next tick to ensure UI updates
      await nextTick()
    }

    toast.success('Preset applied successfully', {
      description: 'All collection settings have been updated from the preset.',
    })
  } catch (error) {
    toast.error('Failed to apply preset', {
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
  } finally {
    isApplyingPreset.value = false
  }
}

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
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
  }
}


// Format date helper
const formatDate = date => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
