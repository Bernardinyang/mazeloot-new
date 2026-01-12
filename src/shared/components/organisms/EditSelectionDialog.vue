<template>
  <SidebarModal
    :model-value="open"
    content-class="sm:max-w-md"
    title="Edit Selection"
    @update:model-value="$emit('update:open', $event)"
  >
    <form id="edit-selection-form" class="space-y-5" @submit.prevent="handleSubmit">
      <!-- Selection Name -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Selection Name </label>
        <Input
          v-model="formData.name"
          :class="[
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
          ]"
          autofocus
          placeholder="e.g. Wedding Selections"
        />
        <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Description </label>
        <Textarea
          v-model="formData.description"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          :maxlength="1000"
          class="w-full min-h-[100px] resize-none"
          placeholder="Optional description for this selection"
        />
        <div class="flex items-center justify-between">
          <p :class="theme.textTertiary" class="text-xs">
            Description is shown to clients viewing this selection.
          </p>
          <span :class="theme.textTertiary" class="text-xs">
            {{ (formData.description || '').length }}/1000
          </span>
        </div>
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
          variant="primary"
          :disabled="!formData.name.trim()"
          :loading="isSubmitting"
          loading-label="Updating..."
          type="button"
          @click="handleSubmit"
        >
          Update Selection
        </Button>
      </div>
    </template>
  </SidebarModal>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import SidebarModal from '@/shared/modals/SidebarModal.vue'
import { Input } from '@/shared/components/shadcn/input'
import { Textarea } from '@/shared/components/shadcn/textarea'
import { Button } from '@/shared/components/shadcn/button'
import { Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import ColorSelector from '@/shared/components/molecules/ColorSelector.vue'
import { generateRandomColorFromPalette } from '@/shared/utils/colors'
import { useSelectionStore } from '@/domains/memora/stores/selection'
import { toast } from '@/shared/utils/toast'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  selection: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:open', 'success'])

const theme = useThemeClasses()
const selectionStore = useSelectionStore()
const { handleError } = useErrorHandler()

const formData = reactive({
  name: '',
  description: '',
  color: generateRandomColorFromPalette(),
})

const errors = ref({})
const isSubmitting = ref(false)

// Populate form only when dialog opens (not when selection changes while open)
watch(
  () => props.open,
  newValue => {
    if (newValue && props.selection) {
      // Only populate when dialog opens, not when it's already open
      formData.name = props.selection.name || ''
      formData.description = props.selection.description || ''
      formData.color = props.selection.color || generateRandomColorFromPalette()
      errors.value = {}
    } else if (!newValue) {
      // Reset form when dialog closes
      formData.name = ''
      formData.description = ''
      formData.color = generateRandomColorFromPalette()
      errors.value = {}
    }
  }
)

const handleCancel = () => {
  formData.name = ''
  formData.description = ''
  formData.color = generateRandomColorFromPalette()
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Selection name is required'
    return
  }

  // Check if anything actually changed
  // Normalize descriptions for comparison (treat null, undefined, and empty string as equivalent)
  const normalizeForComparison = desc => {
    if (desc === null || desc === undefined || desc === '') return ''
    return String(desc).trim()
  }

  const formName = formData.name.trim()
  const originalName = (props.selection?.name || '').trim()
  const formDescription = normalizeForComparison(formData.description)
  const originalDescription = normalizeForComparison(props.selection?.description)
  const formColor = formData.color
  const originalColor = props.selection?.color

  // Only skip update if nothing changed
  if (
    props.selection &&
    formName === originalName &&
    formDescription === originalDescription &&
    formColor === originalColor
  ) {
    emit('update:open', false)
    return
  }

  if (!props.selection) return

  isSubmitting.value = true
  try {
    // Perform the update action inside the modal
    // Always include description - normalize empty string to null
    const descriptionValue =
      formData.description && formData.description.trim() ? formData.description.trim() : null

    const updated = await selectionStore.updateSelection(props.selection.id, {
      name: formData.name.trim(),
      description: descriptionValue, // Always send description (null if empty)
      color: formData.color,
    })

    toast.success('Selection updated', {
      description: 'The selection has been successfully updated.',
    })

    emit('update:open', false)

    // Emit success event with updated data for parent to handle side effects
    emit('success', updated)
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Failed to update selection.',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
