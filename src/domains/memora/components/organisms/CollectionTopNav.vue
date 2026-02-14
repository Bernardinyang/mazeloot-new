<template>
  <nav
    :class="[theme.borderSecondary, 'flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-3.5 border-b bg-white dark:bg-gray-950/95 shadow-sm gap-3 sm:gap-0 min-h-auto sm:min-h-[3.5rem]']"
  >

    <!-- Left Side: Back Button, Title/Status Section, Date/Preset/Watermark -->
    <div class="flex items-start gap-2 sm:gap-3 min-w-0 flex-1 w-full sm:w-auto">
      <!-- Section 1: Back Button -->
      <button
        :class="[theme.borderSecondary, theme.bgCard]"
        class="p-2.5 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 shadow-sm border hover:shadow-md hover:scale-105 active:scale-95 touch-manipulation"
        title="Go back"
        @click="emit('goBack')"
      >
        <ChevronLeft class="h-5 w-5 text-gray-700 dark:text-gray-300 font-semibold" />
      </button>

      <!-- Section 2: Title, then Status/Phase Badges, then Date/Preset/Watermark -->
      <div class="flex flex-col min-w-0">
        <!-- Title Row -->
        <div
          v-if="!props.isLoading"
          class="flex items-center gap-2 mb-1 group"
          style="min-height: 1.5rem"
        >
          <!-- Cover thumbnail -->
          <div
            class="flex-shrink-0 h-7 w-7 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600/70"
            title="Cover photo - Set from media items"
          >
            <img
              v-if="props.collection?.thumbnail || props.collection?.image"
              :alt="`${props.collection?.name || 'Collection'} cover`"
              :src="props.collection?.thumbnail || props.collection?.image"
              class="h-full w-full object-cover"
            />
          </div>
          <Transition mode="out-in" name="fade">
            <h1
              v-if="!props.isEditingName"
              key="title"
              class="text-base sm:text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 cursor-text hover:text-accent transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 truncate"
              style="line-height: 1.5rem"
              @click="emit('startEditingName')"
            >
              {{ props.collection?.name || 'Loading...' }}
            </h1>
            <div
              v-else
              key="input"
              class="flex items-center gap-2 min-w-0 animate-[fadeIn_0.2s_ease-in-out]"
              style="min-height: 1.5rem; animation: fadeIn 0.2s ease-in-out"
            >
              <input
                ref="nameInputRef"
                :class="theme.textPrimary"
                :model-value="props.editingName"
                class="text-lg font-bold leading-tight bg-transparent border-none outline-none focus:ring-0 p-0 m-0 flex-1 min-w-0 transition-all duration-200"
                style="height: 1.5rem; line-height: 1.5rem"
                @blur="emit('handleNameBlur')"
                @input="emit('update:editingName', $event?.target?.value)"
                @keydown.enter="emit('saveName')"
                @keydown.esc="emit('cancelEditingName')"
              />
              <Button
                :disabled="props.isSavingName"
                variant="ghost"
                size="icon-sm"
                class="p-1 flex-shrink-0 hover:scale-110 active:scale-95"
                :loading="props.isSavingName"
                :icon="!props.isSavingName ? Check : null"
                @click="emit('saveName')"
                @mousedown.prevent
              />
              <Button
                :disabled="props.isSavingName"
                variant="ghost"
                size="icon-sm"
                class="p-1 flex-shrink-0 hover:scale-110 active:scale-95"
                :icon="X"
                @click="emit('cancelEditingName')"
                @mousedown.prevent
              />
            </div>
          </Transition>
        </div>
        <!-- Status/Phase Badges and Date Row (under title) -->
        <div
          v-if="!props.isLoading"
          class="flex items-center gap-2 mb-1 flex-wrap"
          style="min-height: 1.25rem"
        >
          <PhaseBadge :phase="phaseType" />
          <StatusBadge :status="collectionStatusDisplay" />
          
          <!-- Inline Date Picker -->
          <Popover v-model:open="isDatePickerOpen">
            <PopoverTrigger as-child>
              <button
                class="text-xs text-left text-gray-500 dark:text-gray-300 hover:text-accent transition-all duration-200 ease-out flex items-center gap-1 sm:gap-1.5 group px-1.5 sm:px-2 py-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:scale-[1.02] active:scale-95"
                style="line-height: 1.25rem"
              >
                <span class="opacity-70 transition-opacity duration-200 hidden sm:inline">Date:</span>
                <span class="font-medium transition-colors duration-200 truncate">{{
                  props.eventDate ? formatDate(props.eventDate) : 'Add date'
                }}</span>
                <ChevronDown
                  class="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200 shrink-0"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent :class="[theme.bgCard, theme.borderCard, 'w-auto p-0']" align="start">
              <Calendar
                :model-value="props.eventDate"
                @update:model-value="handleDatePickerChange"
              />
            </PopoverContent>
          </Popover>
        </div>
        <!-- Loading State for Title Row -->
        <div v-else class="flex items-center gap-2 mb-1" style="min-height: 1.5rem">
          <!-- Cover thumbnail skeleton -->
          <div
            class="flex-shrink-0 h-7 w-7 rounded-lg bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse"
          ></div>
          <!-- Title skeleton -->
          <div class="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700/80 animate-pulse"></div>
        </div>
        <!-- Loading State for Badges/Date Row -->
        <div v-if="props.isLoading" class="flex items-center gap-2 mb-1 flex-wrap" style="min-height: 1.25rem">
          <div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700/80 animate-pulse"></div>
          <div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700/80 animate-pulse"></div>
          <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700/80 animate-pulse"></div>
        </div>

      </div>
    </div>

    <!-- Right Side: Theme, Preview, Share, Publish -->
    <div v-if="props.isLoading" class="flex items-center gap-2 flex-shrink-0 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
      <div class="h-7 w-20 rounded-lg bg-gray-200 dark:bg-gray-700/80 animate-pulse"></div>
      <div class="h-8 w-16 sm:w-20 rounded-md bg-gray-200 dark:bg-gray-700/80 animate-pulse"></div>
      <div class="h-8 w-16 sm:w-20 rounded-md bg-gray-200 dark:bg-gray-700/80 animate-pulse"></div>
      <div class="h-8 w-20 sm:w-24 rounded-md bg-gray-200 dark:bg-gray-700/80 animate-pulse"></div>
      <div class="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700/80 animate-pulse"></div>
    </div>
    <div v-else class="flex items-center gap-2 flex-shrink-0 flex-wrap justify-start sm:justify-end w-full sm:w-auto">
      <!-- Storage indicator -->
      <div
        v-if="props.collection"
        :class="[
          'flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all',
          'bg-purple-50/50 dark:bg-purple-950/30 border-purple-200/50 dark:border-purple-800/50',
          'hover:bg-purple-100/50 dark:hover:bg-purple-900/40',
        ]"
      >
        <HardDrive class="h-3.5 w-3.5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
        <span class="text-xs font-semibold text-purple-700 dark:text-purple-300">
          {{ formatBytes(props.collection.storageUsedBytes ?? 0) }}
        </span>
      </div>

      <!-- Preview Button -->
      <Button
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary, 'shrink-0']"
        @click="emit('handlePreview')"
      >
        <Eye class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
        <span class="hidden sm:inline">Preview</span>
      </Button>

      <!-- Share Button (when published) -->
      <Button
        v-if="props.collectionStatus === 'published'"
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary, 'shrink-0']"
        :disabled="props.isLoading"
        @click="emit('handleShare')"
      >
        <Share2 class="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
        <span class="hidden sm:inline">Share</span>
      </Button>

      <!-- Publish/Unpublish Buttons -->
      <Button
        v-if="props.collectionStatus === 'published'"
        variant="destructive"
        size="sm"
        :class="['shrink-0']"
        :disabled="props.isSavingStatus"
        :loading="props.isSavingStatus"
        loading-label="Unpublishing..."
        :icon="!props.isSavingStatus ? X : null"
        @click="emit('handleUnpublish')"
      >
        <span class="hidden sm:inline">Unpublish</span>
        <span class="sm:hidden">Unpub</span>
      </Button>
      <Button
        v-else
        variant="accent"
        size="sm"
        :class="['shrink-0']"
        :loading="props.isSavingStatus"
        loading-label="Publishing..."
        class="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
        @click="emit('handlePublish')"
      >
        Publish
      </Button>

      <!-- Theme Toggle (last) -->
      <div
        :class="[
          'bg-gray-100/50 dark:bg-gray-800/50',
        ]"
        class="rounded-lg"
      >
        <ThemeToggle />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Loader2,
  Share2,
  X,
  HardDrive,
  Eye,
} from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button/index'
import { Calendar } from '@/shared/components/shadcn/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/shadcn/popover/index'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import StatusBadge from '@/shared/components/atoms/StatusBadge.vue'
import PhaseBadge from '@/shared/components/molecules/PhaseBadge.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  collection: { type: [Object, null], default: null },
  isLoading: { type: Boolean, required: true },
  isEditingName: { type: Boolean, required: true },
  editingName: { type: String, required: true },
  isSavingName: { type: Boolean, required: true },
  collectionStatus: { type: String, required: true },
  isSavingStatus: { type: Boolean, required: true },
  eventDate: { type: [Date, null], default: null },
  selectedPresetId: { type: String, required: true },
  selectedPresetName: { type: [String, null], default: null },
  selectedWatermark: { type: String, required: true },
  selectedWatermarkName: { type: [String, null], default: null },
  presets: { type: Array, required: true },
  watermarks: { type: Array, required: true },
  isDatePickerOpen: { type: Boolean, required: true },
  isPresetPopoverOpen: { type: Boolean, required: true },
  isWatermarkPopoverOpen: { type: Boolean, required: true },
  phaseType: {
    type: String,
    default: 'collection',
    validator: value => ['collection', 'selection', 'proofing'].includes(value),
  },
})

const emit = defineEmits([
  'goBack',
  'startEditingName',
  'update:editingName',
  'saveName',
  'cancelEditingName',
  'handleNameBlur',
  'update:collectionStatus',
  'handleStatusChange',
  'handleDateChange',
  'handlePresetChange',
  'handleWatermarkChange',
  'handlePreview',
  'handleShare',
  'handlePublish',
  'handleUnpublish',
  'update:isDatePickerOpen',
  'update:isPresetPopoverOpen',
  'update:isWatermarkPopoverOpen',
])

const theme = useThemeClasses()
const nameInputRef = ref(null)

const isDatePickerOpen = computed({
  get: () => props.isDatePickerOpen,
  set: v => emit('update:isDatePickerOpen', v),
})
const isPresetPopoverOpen = computed({
  get: () => props.isPresetPopoverOpen,
  set: v => emit('update:isPresetPopoverOpen', v),
})
const isWatermarkPopoverOpen = computed({
  get: () => props.isWatermarkPopoverOpen,
  set: v => emit('update:isWatermarkPopoverOpen', v),
})

const handleDatePickerChange = date => {
  isDatePickerOpen.value = false
  emit('handleDateChange', date)
}

const handlePresetSelect = presetId => {
  isPresetPopoverOpen.value = false
  emit('handlePresetChange', presetId)
}

const handleWatermarkSelect = watermarkId => {
  isWatermarkPopoverOpen.value = false
  emit('handleWatermarkChange', watermarkId)
}

const collectionStatusDisplay = computed(() => {
  return props.collectionStatus?.toUpperCase() || 'DRAFT'
})

const formatDate = date => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatBytes = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
</script>
