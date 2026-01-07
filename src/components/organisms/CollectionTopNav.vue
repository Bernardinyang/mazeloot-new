<template>
  <nav
    :class="theme.borderSecondary"
    class="flex items-center justify-between px-6 py-3.5 border-b bg-white dark:bg-gray-900 shadow-sm"
    style="min-height: 3.5rem"
  >

    <!-- Left Side: Back Button, Title/Status Section, Date/Preset/Watermark -->
    <div class="flex items-start gap-3 min-w-0">
      <!-- Section 1: Back Button -->
      <button
        :class="[theme.borderSecondary, theme.bgCard]"
        class="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 shadow-sm border hover:shadow-md hover:scale-105 active:scale-95"
        title="Go back"
        @click="emit('goBack')"
      >
        <ChevronLeft class="h-5 w-5 text-gray-700 dark:text-gray-300 font-semibold" />
      </button>

      <!-- Section 2: Title and Status, then Date/Preset/Watermark -->
      <div class="flex flex-col min-w-0">
        <!-- Title and Status Row -->
        <div
          v-if="!props.isLoading"
          class="flex items-center gap-3 mb-1 group"
          style="min-height: 1.5rem"
        >
          <div class="flex items-center gap-2 min-w-0">
            <!-- Cover thumbnail -->
            <div
              class="flex-shrink-0 h-7 w-7 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
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
                class="text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 cursor-text hover:text-accent transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95"
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

          <!-- Status Dropdown (next to title) -->
          <div class="flex-shrink-0">
            <Select
              :disabled="props.isSavingStatus"
              :model-value="props.collectionStatus"
              @update:model-value="emit('update:collectionStatus', $event)"
            >
              <SelectTrigger
                :class="[
                  'h-6 px-2.5 text-xs font-semibold rounded-full border-0',
                  'bg-gray-100 dark:bg-gray-800',
                  'text-gray-700 dark:text-gray-300 uppercase tracking-wide',
                  'hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
                  'w-auto min-w-[70px]',
                  props.isSavingStatus ? 'opacity-50 cursor-wait' : '',
                ]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                <SelectItem
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  label="DRAFT"
                  value="draft"
                  @click="emit('handleStatusChange', 'draft')"
                >
                  DRAFT
                </SelectItem>
                <SelectItem
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  label="PUBLISHED"
                  value="published"
                  @click="emit('handleStatusChange', 'published')"
                >
                  PUBLISHED
                </SelectItem>
                <SelectItem
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  label="ARCHIVED"
                  value="archived"
                  @click="emit('handleStatusChange', 'archived')"
                >
                  ARCHIVED
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <!-- Loading State for Title and Status Row -->
        <div v-else class="flex items-center gap-3 mb-1" style="min-height: 1.5rem">
          <div class="flex items-center gap-2 min-w-0">
            <!-- Cover thumbnail skeleton -->
            <div
              class="flex-shrink-0 h-7 w-7 rounded-lg bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse"
            ></div>
            <!-- Title skeleton -->
            <div class="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>
          <!-- Status dropdown skeleton -->
          <div class="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>

        <!-- Date, Preset, and Watermark Row (under title/status) -->
        <div
          v-if="!props.isLoading"
          class="flex items-center gap-2.5 flex-wrap"
          style="min-height: 1.25rem"
        >
          <!-- Inline Date Picker -->
          <Popover v-model:open="isDatePickerOpen">
            <PopoverTrigger as-child>
              <button
                class="text-xs text-left text-gray-500 dark:text-gray-400 hover:text-accent transition-all duration-200 ease-out flex items-center gap-1.5 group px-2 py-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02] active:scale-95"
                style="line-height: 1.25rem"
              >
                <span class="opacity-70 transition-opacity duration-200">Date:</span>
                <span class="font-medium transition-colors duration-200">{{
                  props.eventDate ? formatDate(props.eventDate) : 'Add event date'
                }}</span>
                <ChevronDown
                  class="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200"
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

          <!-- Separator (only show if watermark section is visible) -->
          <div
            v-if="props.watermarks && props.watermarks.length > 0"
            class="h-3 w-px bg-gray-300 dark:bg-gray-600 transition-opacity duration-200"
          ></div>

          <!-- Watermark Dropdown (only show if watermarks exist) -->
          <Popover v-if="props.watermarks && props.watermarks.length > 0" v-model:open="isWatermarkPopoverOpen">
            <PopoverTrigger as-child>
              <button
                class="text-xs text-left text-gray-500 dark:text-gray-400 hover:text-accent transition-all duration-200 ease-out flex items-center gap-1.5 group px-2 py-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02] active:scale-95"
                style="line-height: 1.25rem"
              >
                <span class="opacity-70 transition-opacity duration-200">Watermark:</span>
                <span class="font-medium transition-colors duration-200">{{
                  props.selectedWatermarkName || 'No watermark'
                }}</span>
                <ChevronDown
                  class="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent :class="[theme.bgCard, theme.borderCard, 'w-64 p-0']" align="start">
              <div :class="theme.borderSecondary" class="p-3 border-b">
                <h4 :class="theme.textPrimary" class="text-sm font-semibold">Select Watermark</h4>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <button
                  :class="[
                    props.selectedWatermark === 'none'
                      ? 'bg-accent/10 dark:bg-accent/20 text-accent'
                      : theme.textPrimary,
                  ]"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  @click="handleWatermarkSelect('none')"
                >
                  No watermark
                </button>
                <button
                  v-for="watermark in props.watermarks"
                  :key="watermark.id"
                  :class="[
                    props.selectedWatermark === watermark.id
                      ? 'bg-accent/10 dark:bg-accent/20 text-accent'
                      : theme.textPrimary,
                  ]"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  @click="handleWatermarkSelect(watermark.id)"
                >
                  {{ watermark.name }}
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div
          v-else
          class="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
          style="min-height: 1.25rem"
        ></div>
      </div>
    </div>

    <!-- Right Side: Theme, Preview, Share, Publish -->
    <div v-if="props.isLoading" class="flex items-center gap-3 flex-shrink-0">
      <div class="h-9 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-9 w-9 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-9 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div class="h-9 w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    </div>
    <div v-else class="flex items-center gap-3 flex-shrink-0">
      <!-- Theme Toggle -->
      <ThemeToggle />

      <!-- Preview Button -->
      <Button
        :class="[theme.textSecondary, theme.bgButtonHover]"
        class="px-4 py-2 text-sm font-medium"
        variant="ghost"
        @click="emit('handlePreview')"
      >
        Preview
      </Button>

      <!-- Share Button (when published) -->
      <Button
        v-if="props.collectionStatus === 'published'"
        variant="outline"
        size="sm"
        :class="[theme.borderSecondary, theme.textPrimary]"
        :disabled="props.isLoading"
        @click="emit('handleShare')"
      >
        <Share2 class="h-4 w-4 mr-2" />
        Share
      </Button>

      <!-- Publish/Unpublish Buttons -->
      <Button
        v-if="props.collectionStatus === 'published'"
        variant="destructive"
        size="sm"
        class="bg-red-500 hover:bg-red-600 text-white"
        :disabled="props.isSavingStatus"
        :loading="props.isSavingStatus"
        loading-label="Unpublishing..."
        :icon="!props.isSavingStatus ? X : null"
        @click="emit('handleUnpublish')"
      >
        Unpublish
      </Button>
      <Button
        v-else
        variant="default"
        :loading="props.isSavingStatus"
        loading-label="Publishing..."
        class="px-5 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
        @click="emit('handlePublish')"
      >
        Publish
      </Button>
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
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button/index'
import { Calendar } from '@/components/shadcn/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover/index'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select/index'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

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

const formatDate = date => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
