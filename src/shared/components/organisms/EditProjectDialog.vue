<template>
  <SidebarModal
    :model-value="open"
    title="Edit Project"
    :description="project?.name || 'Update project details'"
    content-class="sm:max-w-md"
    @update:model-value="$emit('update:open', $event)"
  >
    <!-- Loading State -->
    <div v-if="isLoadingProject" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
    </div>

    <form v-else id="edit-project-form" @submit.prevent="handleSubmit" class="space-y-5">
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
                <label class="text-xs font-medium" :class="theme.textPrimary">Description</label>
                <Input
                  v-model="formData.proofingSettings.description"
                  placeholder="Optional description"
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

      <!-- Color -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Project Color </label>
        <ColorSelector v-model="formData.color" />
        <p :class="theme.textTertiary" class="text-xs">
          Color used to identify this project throughout the interface.
        </p>
      </div>

      <!-- Preset -->
      <div v-if="presets && presets.length > 0" class="space-y-2">
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
      <div v-if="watermarks && watermarks.length > 0" class="space-y-2">
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
            'hover:text-accent',
          ]"
          :disabled="props.isSubmitting || isLocalSubmitting"
          type="button"
          variant="ghost"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button
          variant="accent"
          :disabled="!formData.name.trim() || !hasChanges"
          :loading="props.isSubmitting || isLocalSubmitting"
          loading-label="Updating..."
          type="button"
          @click.stop="handleSubmit"
        >
          Update Project
        </Button>
      </div>
    </template>
  </SidebarModal>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import SidebarModal from '@/shared/components/molecules/SidebarModal.vue'
import { Input } from '@/shared/components/shadcn/input'
import { Textarea } from '@/shared/components/shadcn/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'
import { Button } from '@/shared/components/shadcn/button'
import DatePicker from '@/shared/components/shadcn/DatePicker.vue'
import { Loader2, AlertCircle } from '@/shared/utils/lucideAnimated'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { usePresetStore } from '@/domains/memora/stores/preset'
import { useWatermarkStore } from '@/domains/memora/stores/watermark'
import { useProjectStore } from '@/domains/memora/stores/project'
import ColorSelector from '@/shared/components/molecules/ColorSelector.vue'
import { generateRandomColorFromPalette } from '@/shared/utils/colors'

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
const projectStore = useProjectStore()

const loadedProject = ref(null)
const isLoadingProject = ref(false)

const formData = reactive({
  name: '',
  description: '',
  eventDate: null,
  hasSelections: false,
  hasProofing: false,
  hasCollections: false,
  presetId: 'none',
  watermarkId: 'none',
  color: generateRandomColorFromPalette(),
  // Phase settings
  selectionSettings: {
    name: 'Selections',
    description: '',
    selectionLimit: 0,
  },
  proofingSettings: {
    name: 'Proofing',
    description: '',
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

// Get the project data to compare against (use loadedProject if available, otherwise props.project)
const projectData = computed(() => loadedProject.value || props.project)

// Check if form has changes
const hasChanges = computed(() => {
  if (!projectData.value) return false

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
  const originalName = (projectData.value?.name || '').trim()
  const formDescription = normalizeForComparison(formData.description)
  const originalDescription = normalizeForComparison(projectData.value?.description)
  const formColor = formData.color
  const originalColor = projectData.value?.color || generateRandomColorFromPalette()
  const formEventDate = normalizeDate(formData.eventDate)
  const originalEventDate = normalizeDate(projectData.value?.date || projectData.value?.eventDate)
  const formPresetId = formData.presetId === 'none' ? null : formData.presetId
  const originalPresetId = projectData.value?.presetId || null
  const formWatermarkId = formData.watermarkId === 'none' ? null : formData.watermarkId
  const originalWatermarkId = projectData.value?.watermarkId || null
  
  // Phase changes
  const formHasSelections = formData.hasSelections
  const originalHasSelections = projectData.value?.hasSelections || false
  const formHasProofing = formData.hasProofing
  const originalHasProofing = projectData.value?.hasProofing || false
  const formHasCollections = formData.hasCollections
  const originalHasCollections = projectData.value?.hasCollections || false
  
  // Phase settings changes
  const selection = projectData.value?.selection
  const formSelectionName = formData.selectionSettings.name.trim()
  const originalSelectionName = selection?.name || 'Selections'
  const formSelectionDesc = normalizeForComparison(formData.selectionSettings.description)
  const originalSelectionDesc = normalizeForComparison(selection?.description)
  const formSelectionLimit = formData.selectionSettings.selectionLimit || 0
  const originalSelectionLimit = selection?.selectionLimit ?? selection?.selection_limit ?? 0
  
  const proofing = projectData.value?.proofing
  const formProofingName = formData.proofingSettings.name.trim()
  const originalProofingName = proofing?.name || 'Proofing'
  const formProofingDesc = normalizeForComparison(formData.proofingSettings.description)
  const originalProofingDesc = normalizeForComparison(proofing?.description)
  const formProofingMaxRevisions = formData.proofingSettings.maxRevisions || 5
  const originalProofingMaxRevisions = proofing?.maxRevisions ?? proofing?.max_revisions ?? 5
  
  const formCollectionName = formData.collectionSettings.name.trim()
  const originalCollectionName = 'Collections'
  const formCollectionDesc = normalizeForComparison(formData.collectionSettings.description)
  const originalCollectionDesc = ''

  return !(
    formName === originalName &&
    formDescription === originalDescription &&
    formColor === originalColor &&
    formEventDate === originalEventDate &&
    formPresetId === originalPresetId &&
    formWatermarkId === originalWatermarkId &&
    formHasSelections === originalHasSelections &&
    formHasProofing === originalHasProofing &&
    formHasCollections === originalHasCollections &&
    (formHasSelections ? (
      formSelectionName === originalSelectionName &&
      formSelectionDesc === originalSelectionDesc &&
      formSelectionLimit === originalSelectionLimit
    ) : true) &&
    (formHasProofing ? (
      formProofingName === originalProofingName &&
      formProofingDesc === originalProofingDesc &&
      formProofingMaxRevisions === originalProofingMaxRevisions
    ) : true) &&
    (formHasCollections ? (
      formCollectionName === originalCollectionName &&
      formCollectionDesc === originalCollectionDesc
    ) : true)
  )
})

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

// Load full project data with phases when dialog opens
const loadProjectData = async () => {
  if (!props.project?.id) return
  
  isLoadingProject.value = true
  try {
    const projectData = await projectStore.fetchProject(props.project.id)
    loadedProject.value = projectData
    populateForm(projectData)
  } catch (error) {
    // Fallback to using props.project if fetch fails
    populateForm(props.project)
  } finally {
    isLoadingProject.value = false
  }
}

// Populate form with project data
const populateForm = project => {
  if (!project) return
  
  formData.name = project.name || ''
  formData.description = project.description || ''
  // Handle event date - convert string to Date object if needed
  const eventDateValue = project.date || project.eventDate
  if (eventDateValue) {
    formData.eventDate =
      eventDateValue instanceof Date ? eventDateValue : new Date(eventDateValue)
  } else {
    formData.eventDate = null
  }
  formData.presetId = project.presetId || 'none'
  formData.watermarkId = project.watermarkId || 'none'
  formData.color = project.color || generateRandomColorFromPalette()
  
  // Load phase data
  formData.hasSelections = project.hasSelections || false
  formData.hasProofing = project.hasProofing || false
  formData.hasCollections = project.hasCollections || false
  
  // Load phase settings from existing phases
  const selection = project.selection
  if (selection) {
    formData.selectionSettings = {
      name: selection.name || 'Selections',
      description: selection.description || '',
      selectionLimit: selection.selectionLimit ?? selection.selection_limit ?? 0,
    }
  } else if (formData.hasSelections) {
    // Phase enabled but no selection exists yet - keep defaults
    formData.selectionSettings = {
      name: 'Selections',
      description: '',
      selectionLimit: 0,
    }
  }
  
  const proofing = project.proofing
  if (proofing) {
    formData.proofingSettings = {
      name: proofing.name || 'Proofing',
      description: proofing.description || '',
      maxRevisions: proofing.maxRevisions ?? proofing.max_revisions ?? 5,
    }
  } else if (formData.hasProofing) {
    // Phase enabled but no proofing exists yet - keep defaults
    formData.proofingSettings = {
      name: 'Proofing',
      description: '',
      maxRevisions: 5,
    }
  }
  
  const collection = project.collection
  if (collection) {
    formData.collectionSettings = {
      name: collection.name || 'Collections',
      description: collection.description || '',
    }
  } else if (formData.hasCollections) {
    // Phase enabled but no collection exists yet - keep defaults
    formData.collectionSettings = {
      name: 'Collections',
      description: '',
    }
  }
  
  errors.value = {}
}

// Populate form when dialog opens with project data
watch(
  () => props.open,
  newValue => {
    if (newValue && props.project) {
      // Check if project has phase data loaded
      const hasPhaseData = 
        (props.project.selection !== undefined || props.project.hasSelections === false) &&
        (props.project.proofing !== undefined || props.project.hasProofing === false) &&
        (props.project.collection !== undefined || props.project.hasCollections === false)
      
      if (hasPhaseData) {
        // Use existing project data
        populateForm(props.project)
      } else {
        // Fetch full project data with phases
        loadProjectData()
      }
    } else if (!newValue) {
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
        description: '',
        maxRevisions: 5,
      }
      formData.collectionSettings = {
        name: 'Collections',
        description: '',
      }
      errors.value = {}
      loadedProject.value = null
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

  // Check if anything actually changed
  const normalizeForComparison = val => {
    if (val === null || val === undefined || val === '') return ''
    return String(val).trim()
  }

  const formName = formData.name.trim()
  const originalName = (projectData.value?.name || '').trim()
  const formDescription = normalizeForComparison(formData.description)
  const originalDescription = normalizeForComparison(projectData.value?.description)
  const formColor = formData.color
  const originalColor = projectData.value?.color || generateRandomColorFromPalette()

  // Normalize event dates for comparison
  const normalizeDate = date => {
    if (!date) return null
    if (date instanceof Date) return date.toISOString()
    return date
  }
  const formEventDate = normalizeDate(formData.eventDate)
  const originalEventDate = normalizeDate(projectData.value?.date || projectData.value?.eventDate)

  const formPresetId = formData.presetId === 'none' ? null : formData.presetId
  const originalPresetId = projectData.value?.presetId || null
  const formWatermarkId = formData.watermarkId === 'none' ? null : formData.watermarkId
  const originalWatermarkId = projectData.value?.watermarkId || null
  
  // Phase changes
  const formHasSelections = formData.hasSelections
  const originalHasSelections = projectData.value?.hasSelections || false
  const formHasProofing = formData.hasProofing
  const originalHasProofing = projectData.value?.hasProofing || false
  const formHasCollections = formData.hasCollections
  const originalHasCollections = projectData.value?.hasCollections || false
  
  // Phase settings changes
  const selection = projectData.value?.selection
  const formSelectionName = formData.selectionSettings.name.trim()
  const originalSelectionName = selection?.name || 'Selections'
  const formSelectionDesc = normalizeForComparison(formData.selectionSettings.description)
  const originalSelectionDesc = normalizeForComparison(selection?.description)
  const formSelectionLimit = formData.selectionSettings.selectionLimit || 0
  const originalSelectionLimit = selection?.selectionLimit ?? selection?.selection_limit ?? 0
  
  const proofing = projectData.value?.proofing
  const formProofingName = formData.proofingSettings.name.trim()
  const originalProofingName = proofing?.name || 'Proofing'
  const formProofingDesc = normalizeForComparison(formData.proofingSettings.description)
  const originalProofingDesc = normalizeForComparison(proofing?.description)
  const formProofingMaxRevisions = formData.proofingSettings.maxRevisions || 5
  const originalProofingMaxRevisions = proofing?.maxRevisions ?? proofing?.max_revisions ?? 5
  
  const formCollectionName = formData.collectionSettings.name.trim()
  const originalCollectionName = 'Collections'
  const formCollectionDesc = normalizeForComparison(formData.collectionSettings.description)
  const originalCollectionDesc = ''

  // Only skip update if nothing changed
  if (
    projectData.value &&
    formName === originalName &&
    formDescription === originalDescription &&
    formColor === originalColor &&
    formEventDate === originalEventDate &&
    formPresetId === originalPresetId &&
    formWatermarkId === originalWatermarkId &&
    formHasSelections === originalHasSelections &&
    formHasProofing === originalHasProofing &&
    formHasCollections === originalHasCollections &&
    (formHasSelections ? (
      formSelectionName === originalSelectionName &&
      formSelectionDesc === originalSelectionDesc &&
      formSelectionLimit === originalSelectionLimit
    ) : true) &&
    (formHasProofing ? (
      formProofingName === originalProofingName &&
      formProofingDesc === originalProofingDesc &&
      formProofingMaxRevisions === originalProofingMaxRevisions
    ) : true) &&
    (formHasCollections ? (
      formCollectionName === originalCollectionName &&
      formCollectionDesc === originalCollectionDesc
    ) : true)
  ) {
    emit('update:open', false)
    return
  }

  if (!projectData.value) return

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
      id: projectData.value.id,
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
            description: formData.proofingSettings.description.trim() || null,
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
