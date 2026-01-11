<template>
  <SidebarModal
    :model-value="open"
    title="New Project"
    content-class="sm:max-w-md"
    @update:model-value="$emit('update:open', $event)"
  >
    <form id="project-form" @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Project Name -->
      <div class="space-y-2">
        <label class="text-sm font-medium" :class="theme.textPrimary"> Project Name </label>
        <Input
          v-model="formData.name"
          placeholder="e.g. Jessie & Ryan Wedding"
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

      <!-- Description -->
      <div class="space-y-2">
        <label class="text-sm font-medium" :class="theme.textPrimary"> Description </label>
        <Input
          v-model="formData.description"
          placeholder="Optional project description"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
        />
      </div>

      <!-- Event Date -->
      <div class="space-y-2">
        <label class="text-sm font-medium" :class="theme.textPrimary"> Event Date </label>
        <DatePicker v-model="formData.eventDate" placeholder="Event Date" format="MMM dd, yyyy" />
      </div>

      <!-- Phase Selection -->
      <div class="space-y-3">
        <label class="text-sm font-medium" :class="theme.textPrimary"> Project Phases </label>
        <p class="text-xs" :class="theme.textSecondary">
          Select which phases to include in this project. You can add more later.
        </p>
        <div class="space-y-4">
          <!-- Selections Phase -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="formData.hasSelections"
                class="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <div class="flex-1">
                <span class="text-sm font-medium" :class="theme.textPrimary">Selections</span>
                <p class="text-xs" :class="theme.textSecondary">
                  Raw media upload for client selection
                </p>
              </div>
            </label>
            <!-- Selection Settings (shown when checked) -->
            <div
              v-if="formData.hasSelections"
              class="ml-6 space-y-3 pl-4 border-l-2"
              :class="theme.borderSecondary"
            >
              <div class="space-y-2">
                <label class="text-xs font-medium" :class="theme.textPrimary">Selection Name</label>
                <Input
                  v-model="formData.selectionSettings.name"
                  placeholder="Selections"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-medium" :class="theme.textPrimary">Description</label>
                <Input
                  v-model="formData.selectionSettings.description"
                  placeholder="Optional description"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-medium" :class="theme.textPrimary"
                  >Selection Limit</label
                >
                <Input
                  v-model.number="formData.selectionSettings.selectionLimit"
                  type="number"
                  min="0"
                  placeholder="0 (unlimited)"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                />
                <p class="text-xs" :class="theme.textSecondary">
                  Maximum number of media items clients can select (0 = unlimited)
                </p>
              </div>
            </div>
          </div>

          <!-- Proofing Phase -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="formData.hasProofing"
                class="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <div class="flex-1">
                <span class="text-sm font-medium" :class="theme.textPrimary">Proofing</span>
                <p class="text-xs" :class="theme.textSecondary">
                  Edited media review with client feedback
                </p>
              </div>
            </label>
            <!-- Proofing Settings (shown when checked) -->
            <div
              v-if="formData.hasProofing"
              class="ml-6 space-y-3 pl-4 border-l-2"
              :class="theme.borderSecondary"
            >
              <div class="space-y-2">
                <label class="text-xs font-medium" :class="theme.textPrimary">Proofing Name</label>
                <Input
                  v-model="formData.proofingSettings.name"
                  placeholder="Proofing"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-medium" :class="theme.textPrimary">Max Revisions</label>
                <Input
                  v-model.number="formData.proofingSettings.maxRevisions"
                  type="number"
                  min="1"
                  max="20"
                  placeholder="5"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                />
                <p class="text-xs" :class="theme.textSecondary">
                  Maximum number of revision rounds allowed
                </p>
              </div>
            </div>
          </div>

          <!-- Collections Phase -->
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="formData.hasCollections"
                class="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <div class="flex-1">
                <span class="text-sm font-medium" :class="theme.textPrimary">Collections</span>
                <p class="text-xs" :class="theme.textSecondary">Final approved media for sharing</p>
              </div>
            </label>
            <!-- Collection Settings (shown when checked) -->
            <div
              v-if="formData.hasCollections"
              class="ml-6 space-y-3 pl-4 border-l-2"
              :class="theme.borderSecondary"
            >
              <div class="space-y-2">
                <label class="text-xs font-medium" :class="theme.textPrimary"
                  >Collection Name</label
                >
                <Input
                  v-model="formData.collectionSettings.name"
                  placeholder="Collections"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-medium" :class="theme.textPrimary">Description</label>
                <Input
                  v-model="formData.collectionSettings.description"
                  placeholder="Optional description"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                />
              </div>
            </div>
          </div>
        </div>
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
            'hover:text-accent',
          ]"
          @click="handleCancel"
          :disabled="props.isSubmitting || isLocalSubmitting"
        >
          Cancel
        </Button>
        <Button
          type="button"
          @click="handleSubmit"
          variant="primary"
          :disabled="
            !formData.name.trim() ||
            (!formData.hasSelections && !formData.hasProofing && !formData.hasCollections)
          "
          :loading="props.isSubmitting || isLocalSubmitting"
          loading-label="Creating..."
        >
          Create Project
        </Button>
      </div>
    </template>
  </SidebarModal>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
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
import { usePresetStore } from '@/stores/preset'
import { useWatermarkStore } from '@/stores/watermark'
import ColorSelector from '@/components/molecules/ColorSelector.vue'
import { generateRandomColorFromPalette } from '@/utils/colors'

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

const formData = reactive({
  name: '',
  description: '',
  eventDate: null,
  hasSelections: false,
  hasProofing: false,
  hasCollections: false,
  presetId: 'none',
  watermarkId: 'none',
  color: generateRandomColorFromPalette(), // Random color from palette
  // Phase settings
  selectionSettings: {
    name: 'Selections',
    description: '',
    selectionLimit: 0, // 0 = unlimited
  },
  proofingSettings: {
    name: 'Proofing',
    maxRevisions: 5,
  },
  collectionSettings: {
    name: 'Collections',
    description: '',
  },
})

const errors = ref({})
const isLocalSubmitting = ref(false)

const presets = computed(() => presetStore.presets)
const watermarks = computed(() => watermarkStore.watermarks)

// Reset form when dialog opens/closes and load presets/watermarks
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
    if (!newValue) {
      // Reset form when dialog closes
      formData.name = ''
      formData.description = ''
      formData.eventDate = null
      formData.hasSelections = false
      formData.hasProofing = false
      formData.hasCollections = false
      formData.presetId = 'none'
      formData.watermarkId = 'none'
      formData.color = generateRandomColorFromPalette()
      formData.selectionSettings = {
        name: 'Selections',
        description: '',
        selectionLimit: 0,
      }
      formData.proofingSettings = {
        name: 'Proofing',
        maxRevisions: 5,
      }
      formData.collectionSettings = {
        name: 'Collections',
        description: '',
      }
      errors.value = {}
    }
  }
)

const handleCancel = () => {
  formData.name = ''
  formData.description = ''
  formData.eventDate = null
  formData.hasSelections = false
  formData.hasProofing = false
  formData.hasCollections = false
  formData.presetId = 'none'
  formData.watermarkId = 'none'
  formData.color = generateRandomColorFromPalette()
  formData.selectionSettings = {
    name: 'Selections',
    description: '',
    selectionLimit: 0,
  }
  formData.proofingSettings = {
    name: 'Proofing',
    maxRevisions: 5,
  }
  formData.collectionSettings = {
    name: 'Collections',
    description: '',
  }
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Project name is required'
    return
  }

  if (!formData.hasSelections && !formData.hasProofing && !formData.hasCollections) {
    errors.value.name = 'Please select at least one phase'
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
      description: formData.description.trim() || undefined,
      eventDate: eventDateString,
      hasSelections: formData.hasSelections,
      hasProofing: formData.hasProofing,
      hasCollections: formData.hasCollections,
      presetId: formData.presetId === 'none' ? undefined : formData.presetId,
      watermarkId: formData.watermarkId === 'none' ? undefined : formData.watermarkId,
      color: formData.color,
      // Phase settings
      selectionSettings: formData.hasSelections
        ? {
            name: formData.selectionSettings.name.trim() || 'Selections',
            description: formData.selectionSettings.description.trim() || null,
            selectionLimit: formData.selectionSettings.selectionLimit || 0,
          }
        : undefined,
      proofingSettings: formData.hasProofing
        ? {
            name: formData.proofingSettings.name.trim() || 'Proofing',
            maxRevisions: formData.proofingSettings.maxRevisions || 5,
          }
        : undefined,
      collectionSettings: formData.hasCollections
        ? {
            name: formData.collectionSettings.name.trim() || 'Collections',
            description: formData.collectionSettings.description.trim() || null,
          }
        : undefined,
    })
  } catch (error) {
  } finally {
    isLocalSubmitting.value = false
  }
}
</script>
