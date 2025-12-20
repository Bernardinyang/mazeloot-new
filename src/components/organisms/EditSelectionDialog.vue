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

      <!-- Color -->
      <ColorSelector v-model="formData.color" />
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <Button
          :class="[
            theme.textSecondary,
            theme.bgButtonHover,
            'hover:text-teal-600 dark:hover:text-teal-400',
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
          class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          @click="handleSubmit"
        >
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          <span v-if="isSubmitting">Updating...</span>
          <span v-else>Update Selection</span>
        </Button>
      </div>
    </template>
  </SidebarModal>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'
import ColorSelector from '@/components/molecules/ColorSelector.vue'
import { generateRandomColorFromPalette } from '@/utils/colors'
import { useSelectionStore } from '@/stores/selection'
import { toast } from '@/utils/toast'
import { useErrorHandler } from '@/composables/useErrorHandler'

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
  color: generateRandomColorFromPalette(),
})

const errors = ref({})
const isSubmitting = ref(false)

// Populate form when dialog opens or selection changes
watch(
  () => props.open,
  newValue => {
    if (newValue && props.selection) {
      formData.name = props.selection.name || ''
      formData.color = props.selection.color || generateRandomColorFromPalette()
      errors.value = {}
    } else if (!newValue) {
      formData.name = ''
      formData.color = generateRandomColorFromPalette()
      errors.value = {}
    }
  }
)

watch(
  () => props.selection,
  newSelection => {
    if (props.open && newSelection) {
      formData.name = newSelection.name || ''
      formData.color = newSelection.color || generateRandomColorFromPalette()
      errors.value = {}
    }
  },
  { immediate: true }
)

const handleCancel = () => {
  formData.name = ''
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

  if (
    props.selection &&
    formData.name.trim() === props.selection.name &&
    formData.color === props.selection.color
  ) {
    emit('update:open', false)
    return
  }

  if (!props.selection) return

  isSubmitting.value = true
  try {
    // Perform the update action inside the modal
    const updated = await selectionStore.updateSelection(props.selection.id, {
      name: formData.name.trim(),
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
