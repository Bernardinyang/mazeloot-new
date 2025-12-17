<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent :class="[theme.bgCard, theme.borderCard, 'sm:max-w-[500px]']">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold" :class="theme.textPrimary">New Collection</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
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
        <div class="space-y-2">
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
        <div class="space-y-2">
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

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            :class="[
              theme.textSecondary,
              theme.bgButtonHover,
              'hover:text-teal-600 dark:hover:text-teal-400',
            ]"
            @click="handleCancel"
            :disabled="props.isSubmitting || isLocalSubmitting"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            :disabled="!formData.name.trim() || props.isSubmitting || isLocalSubmitting"
            class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2
              v-if="props.isSubmitting || isLocalSubmitting"
              class="mr-2 h-4 w-4 animate-spin"
            />
            <span v-if="props.isSubmitting || isLocalSubmitting">Creating...</span>
            <span v-else>Create Collection</span>
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { Dialog, DialogContent } from '@/components/shadcn/dialog'
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
import { usePresetStore } from '@/stores/preset'
import { useWatermarkStore } from '@/stores/watermark'

const props = defineProps<{
  open: boolean
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  create: [data: { name: string; eventDate?: string; presetId?: string; watermarkId?: string }]
}>()

const theme = useThemeClasses()
const presetStore = usePresetStore()
const watermarkStore = useWatermarkStore()

const formData = ref({
  name: '',
  eventDate: null as Date | string | null,
  presetId: 'none',
  watermarkId: 'none',
})

const errors = ref<{ name?: string }>({})
const isLocalSubmitting = ref(false)

const presets = computed(() => presetStore.presets)
const watermarks = computed(() => watermarkStore.watermarks)

// Load watermarks on mount
onMounted(async () => {
  try {
    await watermarkStore.fetchWatermarks()
  } catch (error) {
    console.error('Failed to fetch watermarks:', error)
  }
})

// Reset form when dialog opens/closes
watch(
  () => props.open,
  (newValue: boolean) => {
    if (!newValue) {
      // Reset form when dialog closes
      formData.value = {
        name: '',
        eventDate: null,
        presetId: 'none',
        watermarkId: 'none',
      }
      errors.value = {}
    }
  }
)

const handleCancel = () => {
  formData.value = {
    name: '',
    eventDate: null,
    presetId: 'none',
    watermarkId: 'none',
  }
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'Collection name is required'
    return
  }

  try {
    // keep a local guard to prevent double-submits even if parent is slow to flip prop
    if (isLocalSubmitting.value || props.isSubmitting) return
    isLocalSubmitting.value = true

    // Convert date to ISO string if it's a Date object
    const eventDateString =
      formData.value.eventDate instanceof Date
        ? formData.value.eventDate.toISOString()
        : formData.value.eventDate || undefined

    emit('create', {
      name: formData.value.name.trim(),
      eventDate: eventDateString,
      presetId: formData.value.presetId === 'none' ? undefined : formData.value.presetId,
      watermarkId: formData.value.watermarkId === 'none' ? undefined : formData.value.watermarkId,
    })
  } catch (error) {
    console.error('Failed to create collection:', error)
  } finally {
    isLocalSubmitting.value = false
  }
}
</script>
