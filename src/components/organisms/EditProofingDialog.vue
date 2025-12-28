<template>
  <SidebarModal
    :model-value="open"
    content-class="sm:max-w-md"
    title="Edit Proofing"
    @update:model-value="$emit('update:open', $event)"
  >
    <form id="edit-proofing-form" class="space-y-5" @submit.prevent="handleSubmit">
      <!-- Proofing Name -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Proofing Name </label>
        <Input
          v-model="formData.name"
          :class="[
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
          ]"
          autofocus
          placeholder="e.g. Wedding Proofing"
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
          placeholder="Optional description for this proofing"
        />
        <div class="flex items-center justify-between">
          <p :class="theme.textTertiary" class="text-xs">
            Description is shown to clients viewing this proofing.
          </p>
          <span :class="theme.textTertiary" class="text-xs">
            {{ (formData.description || '').length }}/1000
          </span>
        </div>
      </div>

      <!-- Max Revisions -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Max Revisions </label>
        <Input
          v-model.number="formData.maxRevisions"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          min="1"
          max="20"
          placeholder="5"
          type="number"
        />
        <p :class="theme.textTertiary" class="text-xs">
          Maximum number of revision rounds allowed (default: 5)
        </p>
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
            'hover:text-amber-600 dark:hover:text-amber-400',
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
          class="bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          @click="handleSubmit"
        >
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          <span v-if="isSubmitting">Updating...</span>
          <span v-else>Update Proofing</span>
        </Button>
      </div>
    </template>
  </SidebarModal>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import { Input } from '@/components/shadcn/input'
import Textarea from '@/components/shadcn/Textarea.vue'
import { Button } from '@/components/shadcn/button'
import { Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'
import ColorSelector from '@/components/molecules/ColorSelector.vue'
import { generateRandomColorFromPalette } from '@/utils/colors'
import { useProofingStore } from '@/stores/proofing'
import { toast } from '@/utils/toast'
import { useErrorHandler } from '@/composables/useErrorHandler'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  proofing: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:open', 'success'])

const theme = useThemeClasses()
const proofingStore = useProofingStore()
const { handleError } = useErrorHandler()

const formData = reactive({
  name: '',
  description: '',
  maxRevisions: 5,
  color: generateRandomColorFromPalette(),
})

const errors = ref({})
const isSubmitting = ref(false)

// Populate form only when dialog opens (not when proofing changes while open)
watch(
  () => props.open,
  newValue => {
    if (newValue && props.proofing) {
      // Only populate when dialog opens, not when it's already open
      formData.name = props.proofing.name || ''
      formData.description = props.proofing.description || ''
      formData.maxRevisions = props.proofing.maxRevisions || props.proofing.max_revisions || 5
      formData.color = props.proofing.color || generateRandomColorFromPalette()
      errors.value = {}
    } else if (!newValue) {
      // Reset form when dialog closes
      formData.name = ''
      formData.description = ''
      formData.maxRevisions = 5
      formData.color = generateRandomColorFromPalette()
      errors.value = {}
    }
  }
)

const handleCancel = () => {
  formData.name = ''
  formData.description = ''
  formData.maxRevisions = 5
  formData.color = generateRandomColorFromPalette()
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Proofing name is required'
    return
  }

  if (formData.maxRevisions < 1 || formData.maxRevisions > 20) {
    errors.value.maxRevisions = 'Max revisions must be between 1 and 20'
    return
  }

  // Check if anything actually changed
  const normalizeForComparison = desc => {
    if (desc === null || desc === undefined || desc === '') return ''
    return String(desc).trim()
  }

  const formName = formData.name.trim()
  const originalName = (props.proofing?.name || '').trim()
  const formDescription = normalizeForComparison(formData.description)
  const originalDescription = normalizeForComparison(props.proofing?.description)
  const formColor = formData.color
  const originalColor = props.proofing?.color
  const formMaxRevisions = formData.maxRevisions
  const originalMaxRevisions = props.proofing?.maxRevisions || props.proofing?.max_revisions || 5

  // Only skip update if nothing changed
  if (
    props.proofing &&
    formName === originalName &&
    formDescription === originalDescription &&
    formColor === originalColor &&
    formMaxRevisions === originalMaxRevisions
  ) {
    emit('update:open', false)
    return
  }

  if (!props.proofing) return

  isSubmitting.value = true
  try {
    const descriptionValue =
      formData.description && formData.description.trim() ? formData.description.trim() : null

    const proofingId = props.proofing.id || props.proofing.uuid
    const projectId = props.proofing.projectId || props.proofing.project_uuid || null
    const updated = await proofingStore.updateProofing(
      proofingId,
      {
        name: formData.name.trim(),
        description: descriptionValue,
        maxRevisions: formData.maxRevisions,
        color: formData.color,
      },
      projectId
    )

    toast.success('Proofing updated', {
      description: 'The proofing has been successfully updated.',
    })

    emit('update:open', false)

    emit('success', updated)
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Failed to update proofing.',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
