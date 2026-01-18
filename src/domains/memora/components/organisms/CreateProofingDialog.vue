<template>
  <SidebarModal
    :model-value="open"
    content-class="sm:max-w-md"
    title="New Proofing"
    @update:model-value="$emit('update:open', $event)"
  >
    <form id="proofing-form" class="space-y-5" @submit.prevent="handleSubmit">
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
          variant="accent"
          type="button"
          :loading="isSubmitting"
          loading-label="Creating..."
          @click.stop="handleSubmit"
        >
          Create Proofing
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
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import ColorSelector from '@/shared/components/molecules/ColorSelector.vue'
import { generateRandomColorFromPalette } from '@/shared/utils/colors'
import { useProofingStore } from '@/domains/memora/stores/proofing'
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
const proofingStore = useProofingStore()
const { handleError } = useErrorHandler()

const getExistingColors = () => {
  return proofingStore.proofings.map(p => p.color).filter(Boolean)
}

const formData = reactive({
  name: '',
  description: '',
  maxRevisions: 5,
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
      formData.maxRevisions = 5
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
  formData.maxRevisions = 5
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

  isSubmitting.value = true
  try {
    const newProofing = await proofingStore.createProofing(null, {
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      maxRevisions: formData.maxRevisions || 5,
      color: formData.color,
    })

    toast.success('Proofing created', {
      description: 'Your new proofing has been created.',
    })

    emit('update:open', false)

    emit('success', newProofing)
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Failed to create proofing.',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
