<template>
  <SidebarModal
    :model-value="open"
    content-class="sm:max-w-md"
    title="New Selection"
    @update:model-value="$emit('update:open', $event)"
  >
    <form id="selection-form" class="space-y-5" @submit.prevent="handleSubmit">
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
          variant="accent"
          :disabled="!formData.name.trim()"
          :loading="isSubmitting"
          loading-label="Creating..."
          type="button"
          @click="handleSubmit"
        >
          Create Selection
        </Button>
      </div>
    </template>
  </SidebarModal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import SidebarModal from '@/shared/components/molecules/SidebarModal.vue'
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
})

const emit = defineEmits(['update:open', 'success'])

const theme = useThemeClasses()
const selectionStore = useSelectionStore()
const { handleError } = useErrorHandler()

const getExistingColors = () => {
  return selectionStore.selections.map(s => s.color).filter(Boolean)
}

const formData = reactive({
  name: '',
  description: '',
  color: generateRandomColorFromPalette(getExistingColors()), // Random color avoiding duplicates
})

const errors = ref({})
const isSubmitting = ref(false)

watch(
  () => props.open,
  newValue => {
    if (!newValue) {
      // Reset form when dialog closes
      formData.name = ''
      formData.description = ''
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
  formData.description = ''
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Selection name is required'
    return
  }

  isSubmitting.value = true
  try {
    const newSelection = await selectionStore.createSelection({
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      color: formData.color,
      projectUuid: null,
    })

    toast.success('Selection created', {
      description: 'Your new selection has been created.',
    })

    emit('update:open', false)

    emit('success', newSelection)
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Failed to create selection.',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
