<template>
  <SidebarModal
    :model-value="open"
    title="New Collection"
    content-class="sm:max-w-md"
    @update:model-value="$emit('update:open', $event)"
  >
    <form id="collection-form" @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Collection Name -->
      <div class="space-y-2">
        <label class="text-sm font-medium" :class="theme.textPrimary"> Collection Name </label>
        <Input
          v-model="formData.name"
          placeholder="e.g. Jessie & Ryan"
          :class="[
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
          ]"
          autofocus
        />
        <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
      </div>

      <!-- Event Date -->
      <div class="space-y-2">
        <label class="text-sm font-medium" :class="theme.textPrimary"> Event Date </label>
        <DatePicker v-model="formData.eventDate" placeholder="Event Date" format="MMM dd, yyyy" />
      </div>

      <!-- Preset -->
      <div v-if="presets && presets.length > 0" class="space-y-2">
        <label class="text-sm font-medium" :class="theme.textPrimary"> Preset </label>
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
      <div v-if="watermarks && watermarks.length > 0" class="space-y-2">
        <label class="text-sm font-medium" :class="theme.textPrimary"> Watermark </label>
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
          type="button"
          variant="ghost"
          :class="[
            theme.textSecondary,
            theme.bgButtonHover,
          ]"
          @click="handleCancel"
          :disabled="props.isSubmitting || isLocalSubmitting"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          @click="handleSubmit"
          :disabled="!formData.name.trim() || props.isSubmitting || isLocalSubmitting"
          :loading="props.isSubmitting || isLocalSubmitting"
          loading-label="Creating..."
        >
          Create Collection
        </Button>
      </div>
    </template>
  </SidebarModal>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import SidebarModal from '@/shared/modals/SidebarModal.vue'
import { Input } from '@/shared/components/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'
import { Button } from '@/shared/components/shadcn/button'
import DatePicker from '@/shared/components/shadcn/DatePicker.vue'
import { Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { usePresetStore } from '@/domains/memora/stores/preset'
import { useWatermarkStore } from '@/domains/memora/stores/watermark'
import { useGalleryStore } from '@/shared/stores/gallery'
import ColorSelector from '@/shared/components/molecules/ColorSelector.vue'
import { generateRandomColorFromPalette } from '@/shared/utils/colors'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:open', 'create'])

const theme = useThemeClasses()
const presetStore = usePresetStore()
const watermarkStore = useWatermarkStore()
const galleryStore = useGalleryStore()

const getExistingColors = () => {
  if (!galleryStore || !galleryStore.collections) {
    return []
  }
  return galleryStore.collections.map(c => c.color).filter(Boolean)
}

const formData = reactive({
  name: '',
  eventDate: null,
  presetId: 'none',
  watermarkId: 'none',
  color: generateRandomColorFromPalette(getExistingColors()),
})

const errors = ref({})
const isLocalSubmitting = ref(false)

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
        // Set default preset if none selected
        if (formData.presetId === 'none' && presetStore.defaultPreset) {
          formData.presetId = presetStore.defaultPreset.id
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

// Reset form when dialog opens/closes
watch(
  () => props.open,
  newValue => {
    if (!newValue) {
      // Reset form when dialog closes
      formData.name = ''
      formData.eventDate = null
      formData.presetId = 'none'
      formData.watermarkId = 'none'
      formData.color = generateRandomColorFromPalette(getExistingColors())
      errors.value = {}
    } else {
      // When opening, refresh color to avoid duplicates
      formData.color = generateRandomColorFromPalette(getExistingColors())
    }
  }
)

const handleCancel = () => {
  formData.name = ''
  formData.eventDate = null
  formData.presetId = 'none'
  formData.watermarkId = 'none'
      formData.color = generateRandomColorFromPalette(getExistingColors())
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Collection name is required'
    return
  }

  try {
    // keep a local guard to prevent double-submits even if parent is slow to flip prop
    if (isLocalSubmitting.value || props.isSubmitting) return
    isLocalSubmitting.value = true

    // Convert date to ISO string if it's a Date object
    const eventDateString =
      formData.eventDate instanceof Date
        ? formData.eventDate.toISOString()
        : formData.eventDate || undefined

    emit('create', {
      name: formData.name.trim(),
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
