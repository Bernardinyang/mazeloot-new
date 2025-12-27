<template>
  <SidebarModal
    :model-value="open"
    title="Edit Project"
    :description="project?.name || 'Update project details'"
    content-class="sm:max-w-md"
    @update:model-value="$emit('update:open', $event)"
  >
    <form id="edit-project-form" @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Project Name -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium">
          Project Name <span class="text-red-500">*</span>
        </label>
        <Input
          v-model="formData.name"
          :class="[
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
          ]"
          autofocus
          placeholder="e.g. Jessie & Ryan Wedding"
        />
        <p v-if="errors.name" class="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle class="h-3 w-3" />
          {{ errors.name }}
        </p>
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Description </label>
        <Textarea
          v-model="formData.description"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          :maxlength="500"
          class="w-full min-h-[100px] resize-none"
          placeholder="Optional description for this project"
        />
        <div class="flex items-center justify-between">
          <p :class="theme.textTertiary" class="text-xs">
            Description helps identify your project.
          </p>
          <span :class="theme.textTertiary" class="text-xs">
            {{ (formData.description || '').length }}/500
          </span>
        </div>
      </div>

      <!-- Event Date -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Event Date </label>
        <DatePicker
          v-model="formData.eventDate"
          placeholder="Select event date (optional)"
          format="MMM dd, yyyy"
        />
        <p :class="theme.textTertiary" class="text-xs">The date associated with this project.</p>
      </div>

      <!-- Color -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Project Color </label>
        <ColorSelector v-model="formData.color" />
        <p :class="theme.textTertiary" class="text-xs">
          Color used to identify this project throughout the interface.
        </p>
      </div>

      <!-- Preset -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Preset </label>
        <Select v-model="formData.presetId">
          <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput]">
            <SelectValue placeholder="Select preset" />
          </SelectTrigger>
          <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
            <SelectItem
              value="none"
              label="No preset"
              :class="[theme.textPrimary, theme.bgButtonHover]"
            >
              No preset
            </SelectItem>
            <SelectItem
              v-for="preset in presets"
              :key="preset.id"
              :value="preset.id"
              :label="preset.name"
              :class="[theme.textPrimary, theme.bgButtonHover]"
            >
              {{ preset.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <p :class="theme.textTertiary" class="text-xs">
          Apply a preset configuration to this project.
        </p>
      </div>

      <!-- Watermark -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Watermark </label>
        <Select v-model="formData.watermarkId">
          <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput]">
            <SelectValue placeholder="Select watermark" />
          </SelectTrigger>
          <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
            <SelectItem
              value="none"
              label="No watermark"
              :class="[theme.textPrimary, theme.bgButtonHover]"
            >
              No watermark
            </SelectItem>
            <SelectItem
              v-for="watermark in watermarks"
              :key="watermark.id"
              :value="watermark.id"
              :label="watermark.name"
              :class="[theme.textPrimary, theme.bgButtonHover]"
            >
              {{ watermark.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <p :class="theme.textTertiary" class="text-xs">Add a watermark to media in this project.</p>
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <Button
          :class="[
            theme.textSecondary,
            theme.bgButtonHover,
            'hover:text-teal-600 dark:hover:text-teal-400',
          ]"
          :disabled="props.isSubmitting || isLocalSubmitting"
          type="button"
          variant="ghost"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button
          :disabled="
            !formData.name.trim() || !hasChanges || props.isSubmitting || isLocalSubmitting
          "
          class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          @click="handleSubmit"
        >
          <Loader2
            v-if="props.isSubmitting || isLocalSubmitting"
            class="mr-2 h-4 w-4 animate-spin"
          />
          <span v-if="props.isSubmitting || isLocalSubmitting">Updating...</span>
          <span v-else>Update Project</span>
        </Button>
      </div>
    </template>
  </SidebarModal>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import { Input } from '@/components/shadcn/input'
import Textarea from '@/components/shadcn/Textarea.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Button } from '@/components/shadcn/button'
import DatePicker from '@/components/shadcn/DatePicker.vue'
import { Loader2, AlertCircle } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { usePresetStore } from '@/stores/preset'
import { useWatermarkStore } from '@/stores/watermark'
import ColorSelector from '@/components/molecules/ColorSelector.vue'
import { generateRandomColorFromPalette } from '@/utils/colors'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  project: {
    type: Object,
    default: null,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:open', 'update'])

const theme = useThemeClasses()
const presetStore = usePresetStore()
const watermarkStore = useWatermarkStore()

const formData = reactive({
  name: '',
  description: '',
  eventDate: null,
  presetId: 'none',
  watermarkId: 'none',
  color: generateRandomColorFromPalette(),
})

const errors = ref({})
const isLocalSubmitting = ref(false)

const presets = computed(() => presetStore.presets)
const watermarks = computed(() => watermarkStore.watermarks)

// Check if form has changes
const hasChanges = computed(() => {
  if (!props.project) return false

  const normalizeForComparison = val => {
    if (val === null || val === undefined || val === '') return ''
    return String(val).trim()
  }

  const normalizeDate = date => {
    if (!date) return null
    if (date instanceof Date) return date.toISOString()
    return date
  }

  const formName = formData.name.trim()
  const originalName = (props.project?.name || '').trim()
  const formDescription = normalizeForComparison(formData.description)
  const originalDescription = normalizeForComparison(props.project?.description)
  const formColor = formData.color
  const originalColor = props.project?.color || generateRandomColorFromPalette()
  const formEventDate = normalizeDate(formData.eventDate)
  const originalEventDate = normalizeDate(props.project?.date || props.project?.eventDate)
  const formPresetId = formData.presetId === 'none' ? null : formData.presetId
  const originalPresetId = props.project?.presetId || null
  const formWatermarkId = formData.watermarkId === 'none' ? null : formData.watermarkId
  const originalWatermarkId = props.project?.watermarkId || null

  return !(
    formName === originalName &&
    formDescription === originalDescription &&
    formColor === originalColor &&
    formEventDate === originalEventDate &&
    formPresetId === originalPresetId &&
    formWatermarkId === originalWatermarkId
  )
})

// Load watermarks on mount
onMounted(async () => {
  try {
    await watermarkStore.fetchWatermarks()
  } catch (error) {}
})

// Populate form when dialog opens with project data
watch(
  () => props.open,
  newValue => {
    if (newValue && props.project) {
      // Populate form with project data
      formData.name = props.project.name || ''
      formData.description = props.project.description || ''
      // Handle event date - convert string to Date object if needed
      const eventDateValue = props.project.date || props.project.eventDate
      if (eventDateValue) {
        formData.eventDate =
          eventDateValue instanceof Date ? eventDateValue : new Date(eventDateValue)
      } else {
        formData.eventDate = null
      }
      formData.presetId = props.project.presetId || 'none'
      formData.watermarkId = props.project.watermarkId || 'none'
      formData.color = props.project.color || generateRandomColorFromPalette()
      errors.value = {}
    } else if (!newValue) {
      // Reset form when dialog closes
      formData.name = ''
      formData.description = ''
      formData.eventDate = null
      formData.presetId = 'none'
      formData.watermarkId = 'none'
      formData.color = generateRandomColorFromPalette()
      errors.value = {}
    }
  }
)

const handleCancel = () => {
  formData.name = ''
  formData.description = ''
  formData.eventDate = null
  formData.presetId = 'none'
  formData.watermarkId = 'none'
  formData.color = generateRandomColorFromPalette()
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Project name is required'
    return
  }

  // Check if anything actually changed
  const normalizeForComparison = val => {
    if (val === null || val === undefined || val === '') return ''
    return String(val).trim()
  }

  const formName = formData.name.trim()
  const originalName = (props.project?.name || '').trim()
  const formDescription = normalizeForComparison(formData.description)
  const originalDescription = normalizeForComparison(props.project?.description)
  const formColor = formData.color
  const originalColor = props.project?.color || generateRandomColorFromPalette()

  // Normalize event dates for comparison
  const normalizeDate = date => {
    if (!date) return null
    if (date instanceof Date) return date.toISOString()
    return date
  }
  const formEventDate = normalizeDate(formData.eventDate)
  const originalEventDate = normalizeDate(props.project?.date || props.project?.eventDate)

  const formPresetId = formData.presetId === 'none' ? null : formData.presetId
  const originalPresetId = props.project?.presetId || null
  const formWatermarkId = formData.watermarkId === 'none' ? null : formData.watermarkId
  const originalWatermarkId = props.project?.watermarkId || null

  // Only skip update if nothing changed
  if (
    props.project &&
    formName === originalName &&
    formDescription === originalDescription &&
    formColor === originalColor &&
    formEventDate === originalEventDate &&
    formPresetId === originalPresetId &&
    formWatermarkId === originalWatermarkId
  ) {
    emit('update:open', false)
    return
  }

  if (!props.project) return

  try {
    // keep a local guard to prevent double-submits even if parent is slow to flip prop
    if (isLocalSubmitting.value || props.isSubmitting) return
    isLocalSubmitting.value = true

    // Convert date to ISO string if it's a Date object
    const eventDateString =
      formData.eventDate instanceof Date
        ? formData.eventDate.toISOString()
        : formData.eventDate || undefined

    emit('update', {
      id: props.project.id,
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      eventDate: eventDateString,
      presetId: formData.presetId === 'none' ? undefined : formData.presetId,
      watermarkId: formData.watermarkId === 'none' ? undefined : formData.watermarkId,
      color: formData.color,
    })
  } catch (error) {
  } finally {
    isLocalSubmitting.value = false
  }
}
</script>
