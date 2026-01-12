<template>
  <SidebarModal
    :model-value="open"
    content-class="sm:max-w-md"
    title="Edit Raw Files Phase"
    @update:model-value="$emit('update:open', $event)"
  >
    <form id="edit-raw-files-form" class="space-y-5" @submit.prevent="handleSubmit">
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Raw Files Phase Name </label>
        <Input
          v-model="formData.name"
          :class="[
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
          ]"
          autofocus
          placeholder="e.g. Wedding Raw Files"
        />
        <p v-if="errors.name" class="text-xs text-red-500 mt-1">{{ errors.name }}</p>
      </div>

      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium"> Description </label>
        <Textarea
          v-model="formData.description"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          :maxlength="1000"
          class="w-full min-h-[100px] resize-none"
          placeholder="Optional description for this raw files phase"
        />
        <div class="flex items-center justify-between">
          <p :class="theme.textTertiary" class="text-xs">
            Description is shown to clients viewing this raw files phase.
          </p>
          <span :class="theme.textTertiary" class="text-xs">
            {{ (formData.description || '').length }}/1000
          </span>
        </div>
      </div>

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
          Update Raw Files Phase
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
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import ColorSelector from '@/shared/components/molecules/ColorSelector.vue'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles.js'
import { toast } from '@/shared/utils/toast'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  rawFiles: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:open', 'success'])

const theme = useThemeClasses()
const rawFilesApi = useRawFilesApi()
const { handleError } = useErrorHandler()

const formData = reactive({
  name: '',
  description: '',
  color: '#3B82F6',
})

const errors = ref({})
const isSubmitting = ref(false)

watch(
  () => props.open,
  newValue => {
    if (newValue && props.rawFiles) {
      formData.name = props.rawFiles.name || ''
      formData.description = props.rawFiles.description || ''
      formData.color = props.rawFiles.color || '#3B82F6'
      errors.value = {}
    } else if (!newValue) {
      formData.name = ''
      formData.description = ''
      formData.color = '#3B82F6'
      errors.value = {}
    }
  }
)

watch(
  () => props.rawFiles,
  newRawFiles => {
    if (props.open && newRawFiles) {
      formData.name = newRawFiles.name || ''
      formData.description = newRawFiles.description || ''
      formData.color = newRawFiles.color || '#3B82F6'
    }
  },
  { immediate: true }
)

const handleCancel = () => {
  formData.name = ''
  formData.description = ''
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  if (!props.rawFiles || !props.rawFiles.id) return

  errors.value = {}

  if (!formData.name.trim()) {
    errors.value.name = 'Raw files phase name is required'
    return
  }

  isSubmitting.value = true
  try {
    await rawFilesApi.updateRawFiles(props.rawFiles.id, {
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      color: formData.color,
    })

    toast.success('Raw files phase updated', {
      description: 'Your raw files phase has been updated.',
    })

    emit('update:open', false)
    emit('success')
  } catch (error) {
    await handleError(error, {
      fallbackMessage: 'Failed to update raw files phase.',
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
