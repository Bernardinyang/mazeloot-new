<template>
  <nav
    :class="theme.borderSecondary"
    class="flex items-center justify-between px-6 py-3.5 border-b bg-white dark:bg-gray-900 shadow-sm"
    style="min-height: 3.5rem"
  >
    <!-- Hidden file input for cover upload (must be mounted to allow programmatic click) -->
    <input
      ref="coverFileInputRef"
      accept="image/*"
      class="hidden"
      type="file"
      @change="handleCoverFileChange"
    />

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
            <!-- Cover thumbnail (click to change cover) -->
            <button
              class="flex-shrink-0 h-7 w-7 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition"
              title="Click to change cover"
              type="button"
              @click.stop="triggerCoverFilePicker"
            >
              <img
                v-if="props.collection?.thumbnail || props.collection?.image"
                :alt="`${props.collection?.name || 'Collection'} cover`"
                :src="props.collection?.thumbnail || props.collection?.image"
                class="h-full w-full object-cover"
              />
            </button>
            <Transition mode="out-in" name="fade">
              <h1
                v-if="!props.isEditingName"
                key="title"
                class="text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 cursor-text hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95"
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
                <button
                  :disabled="props.isSavingName"
                  class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                  style="height: 1.5rem; width: 1.5rem"
                  @click="emit('saveName')"
                  @mousedown.prevent
                >
                  <Check
                    v-if="!props.isSavingName"
                    class="h-4 w-4 text-teal-600 dark:text-teal-400"
                  />
                  <Loader2 v-else class="h-4 w-4 text-teal-600 dark:text-teal-400 animate-spin" />
                </button>
                <button
                  :disabled="props.isSavingName"
                  class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                  style="height: 1.5rem; width: 1.5rem"
                  @click="emit('cancelEditingName')"
                  @mousedown.prevent
                >
                  <X :class="theme.textSecondary" class="h-4 w-4" />
                </button>
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
              </SelectContent>
            </Select>
          </div>
        </div>
        <div v-else class="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1"></div>

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
                class="text-xs text-left text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 ease-out flex items-center gap-1.5 group px-2 py-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02] active:scale-95"
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

          <!-- Separator -->
          <div class="h-3 w-px bg-gray-300 dark:bg-gray-600 transition-opacity duration-200"></div>

          <!-- Preset Dropdown -->
          <Popover v-model:open="isPresetPopoverOpen">
            <PopoverTrigger as-child>
              <button
                class="text-xs text-left text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 ease-out flex items-center gap-1.5 group px-2 py-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02] active:scale-95"
                style="line-height: 1.25rem"
              >
                <span class="opacity-70 transition-opacity duration-200">Preset:</span>
                <span class="font-medium transition-colors duration-200">{{
                  props.selectedPresetName || 'No preset'
                }}</span>
                <ChevronDown
                  class="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent :class="[theme.bgCard, theme.borderCard, 'w-64 p-0']" align="start">
              <div :class="theme.borderSecondary" class="p-3 border-b">
                <h4 :class="theme.textPrimary" class="text-sm font-semibold">Select Preset</h4>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <button
                  :class="[
                    props.selectedPresetId === 'none'
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                      : theme.textPrimary,
                  ]"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  @click="handlePresetSelect('none')"
                >
                  No preset
                </button>
                <button
                  v-for="preset in props.presets"
                  :key="preset.id"
                  :class="[
                    props.selectedPresetId === preset.id
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                      : theme.textPrimary,
                  ]"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  @click="handlePresetSelect(preset.id)"
                >
                  {{ preset.name }}
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <!-- Separator -->
          <div class="h-3 w-px bg-gray-300 dark:bg-gray-600 transition-opacity duration-200"></div>

          <!-- Watermark Dropdown -->
          <Popover v-model:open="isWatermarkPopoverOpen">
            <PopoverTrigger as-child>
              <button
                class="text-xs text-left text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 ease-out flex items-center gap-1.5 group px-2 py-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02] active:scale-95"
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
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
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
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
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

    <!-- Right Side: Theme, More, Preview, Publish -->
    <div class="flex items-center gap-3 flex-shrink-0">
      <!-- Theme Toggle -->
      <ThemeToggle />

      <!-- More Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            :class="theme.textSecondary"
            class="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <span>More</span>
            <ChevronDown class="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent :class="[theme.bgDropdown, theme.borderSecondary]" align="end">
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click="triggerCoverFilePicker"
          >
            <Pencil class="h-4 w-4 mr-2" />
            Upload Cover Image
          </DropdownMenuItem>
          <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
            <Pencil class="h-4 w-4 mr-2" />
            Edit Collection
          </DropdownMenuItem>
          <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
            <Copy class="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
            <Settings class="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="[
              'text-red-600 dark:text-red-400',
              'hover:bg-red-50 dark:hover:bg-red-900/20',
              'cursor-pointer',
            ]"
          >
            <Trash2 class="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Preview Button -->
      <Button
        :class="[theme.textSecondary, theme.bgButtonHover]"
        class="px-4 py-2 text-sm font-medium"
        variant="ghost"
        @click="emit('handlePreview')"
      >
        Preview
      </Button>

      <!-- Publish Button -->
      <Button
        v-if="props.collectionStatus !== 'published'"
        :disabled="props.isSavingStatus"
        class="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
        @click="emit('handlePublish')"
      >
        <Loader2 v-if="props.isSavingStatus" class="mr-2 h-4 w-4 animate-spin" />
        <span v-if="props.isSavingStatus">Publishing...</span>
        <span v-else>Publish</span>
      </Button>
      <div
        v-else
        class="px-4 py-2 text-sm font-medium rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
      >
        Published
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
  Copy,
  Loader2,
  Pencil,
  Settings,
  Trash2,
  X,
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button/index'
import { Calendar } from '@/components/shadcn/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu/index'
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
  'handlePublish',
  'handle-cover-image-upload',
  'update:isDatePickerOpen',
  'update:isPresetPopoverOpen',
  'update:isWatermarkPopoverOpen',
])

const theme = useThemeClasses()
const nameInputRef = ref(null)
const coverFileInputRef = ref(null)

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

const triggerCoverFilePicker = () => {
  coverFileInputRef.value?.click?.()
}

const handleCoverFileChange = async event => {
  const file = event?.target?.files?.[0]
  if (!file) return

  try {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

    if (typeof dataUrl === 'string') {
      emit('handle-cover-image-upload', dataUrl)
    }
  } finally {
    // Allow selecting the same file again
    if (event?.target) event.target.value = ''
  }
}
</script>
