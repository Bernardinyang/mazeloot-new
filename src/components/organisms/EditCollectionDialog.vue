<template>
  <SidebarModal
    :model-value="open"
    content-class="sm:max-w-md"
    title="Edit Collection"
    @update:model-value="$emit('update:open', $event)"
  >
    <form id="edit-collection-form" class="space-y-5" @submit.prevent="handleSubmit">
      <!-- Collection Name -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Collection Name </label>
        <Input
          v-model="formData.name"
          :class="[
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
          ]"
          autofocus
          placeholder="e.g. Jessie & Ryan"
        />
        <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
      </div>

      <!-- Event Date -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Event Date </label>
        <DatePicker v-model="formData.eventDate" placeholder="Event Date" format="MMM dd, yyyy" />
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
      </div>

      <!-- Color -->
      <ColorSelector v-model="formData.color" />
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <Button
          :class="[
            theme.textSecondary,
            theme.bgButtonHover,
            'hover:text-accent',
          ]"
          :disabled="isSubmitting"
          type="button"
          variant="ghost"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button
          :disabled="!formData.name.trim() || isSubmitting"
          class="bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          @click="handleSubmit"
        >
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          <span v-if="isSubmitting">Updating...</span>
          <span v-else>Update Collection</span>
        </Button>
      </div>
    </template>
  </SidebarModal>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import { Input } from '@/components/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Button } from '@/components/shadcn/button'
import DatePicker from '@/components/shadcn/DatePicker.vue'
import { Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'
import ColorSelector from '@/components/molecules/ColorSelector.vue'
import { generateRandomColorFromPalette } from '@/utils/colors'
import { useGalleryStore } from '@/stores/gallery'
import { usePresetStore } from '@/stores/preset'
import { useWatermarkStore } from '@/stores/watermark'
import { toast } from '@/utils/toast'
import { useErrorHandler } from '@/composables/useErrorHandler'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  collection: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:open', 'success'])

const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const presetStore = usePresetStore()
const watermarkStore = useWatermarkStore()
const { handleError } = useErrorHandler()

const formData = reactive({
  name: '',
  eventDate: null,
  presetId: 'none',
  watermarkId: 'none',
  color: generateRandomColorFromPalette(),
})

const errors = ref({})
const isSubmitting = ref(false)

const presets = computed(() => presetStore.presets)
const watermarks = computed(() => watermarkStore.watermarks)

// Load presets and watermarks when dialog opens
watch(
  () => props.open,
  async newValue => {
    if (newValue) {
      try {
        if (presetStore.presets.length === 0) {
          await presetStore.loadPresets()
        }
      } catch (error) {}
      try {
        if (watermarkStore.watermarks.length === 0) {
          await watermarkStore.fetchWatermarks()
        }
      } catch (error) {}
    }
  }
)

// Populate form only when dialog opens
watch(
  () => props.open,
  newValue => {
    if (newValue && props.collection) {
      formData.name = props.collection.name || props.collection.title || ''
      formData.eventDate = props.collection.eventDate
        ? new Date(props.collection.eventDate)
        : null
      formData.presetId = props.collection.presetId || 'none'
      formData.watermarkId = props.collection.watermarkId || 'none'
      formData.color = props.collection.color || generateRandomColorFromPalette()
      errors.value = {}
    } else if (!newValue) {
      formData.name = ''
      formData.eventDate = null
      formData.presetId = 'none'
      formData.watermarkId = 'none'
      formData.color = generateRandomColorFromPalette()
      errors.value = {}
    }
  }
)

const handleCancel = () => {
  emit('update:open', false)
}

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Collection name is required'
    return
  }

  if (!props.collection) return

  // Check if anything changed
  const formName = formData.name.trim()
  const originalName = (props.collection.name || props.collection.title || '').trim()
  const formEventDate = formData.eventDate
    ? formData.eventDate instanceof Date
      ? formData.eventDate.toISOString()
      : formData.eventDate
    : null
  const originalEventDate = props.collection.eventDate || null
  const formPresetId = formData.presetId === 'none' ? null : formData.presetId
  const originalPresetId = props.collection.presetId || null
  const formWatermarkId = formData.watermarkId === 'none' ? null : formData.watermarkId
  const originalWatermarkId = props.collection.watermarkId || null
  const formColor = formData.color
  const originalColor = props.collection.color

  if (
    formName === originalName &&
    formEventDate === originalEventDate &&
    formPresetId === originalPresetId &&
    formWatermarkId === originalWatermarkId &&
    formColor === originalColor
  ) {
    emit('update:open', false)
    return
  }

  isSubmitting.value = true
  try {
    const eventDateString = formData.eventDate
      ? formData.eventDate instanceof Date
        ? formData.eventDate.toISOString()
        : formData.eventDate
      : null

    const updated = await galleryStore.updateCollection(String(props.collection.id), {
      name: formData.name.trim(),
      eventDate: eventDateString,
      presetId: formPresetId,
      watermarkId: formWatermarkId,
      color: formData.color,
    })

    toast.success('Collection updated', {
      description: 'The collection has been successfully updated.',
    })

    emit('update:open', false)
    emit('success', updated)
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Failed to update collection.',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

