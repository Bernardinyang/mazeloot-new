<template>
  <SidebarModal
    :model-value="open"
    title="New Selection"
    content-class="sm:max-w-md"
    @update:model-value="$emit('update:open', $event)"
  >
    <form id="selection-form" @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Selection Name -->
      <div class="space-y-2">
        <label class="text-sm font-medium" :class="theme.textPrimary"> Selection Name </label>
        <Input
          v-model="formData.name"
          placeholder="e.g. Wedding Selections"
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
            'hover:text-teal-600 dark:hover:text-teal-400',
          ]"
          @click="handleCancel"
          :disabled="props.isSubmitting || isLocalSubmitting"
        >
          Cancel
        </Button>
        <Button
          type="button"
          @click="handleSubmit"
          :disabled="!formData.name.trim() || props.isSubmitting || isLocalSubmitting"
          class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2
            v-if="props.isSubmitting || isLocalSubmitting"
            class="mr-2 h-4 w-4 animate-spin"
          />
          <span v-if="props.isSubmitting || isLocalSubmitting">Creating...</span>
          <span v-else>Create Selection</span>
        </Button>
      </div>
    </template>
  </SidebarModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'
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

const formData = ref({
  name: '',
  color: generateRandomColorFromPalette(), // Random color from palette
})

const errors = ref({})
const isLocalSubmitting = ref(false)

// Reset form when dialog opens/closes
watch(
  () => props.open,
  newValue => {
    if (!newValue) {
      // Reset form when dialog closes
      formData.value = {
        name: '',
        color: generateRandomColorFromPalette(),
      }
      errors.value = {}
    }
  }
)

const handleCancel = () => {
  formData.value = {
    name: '',
  }
  errors.value = {}
  emit('update:open', false)
}

const handleSubmit = async () => {
  errors.value = {}

  if (!formData.value.name.trim()) {
    errors.value.name = 'Selection name is required'
    return
  }

  try {
    // keep a local guard to prevent double-submits even if parent is slow to flip prop
    if (isLocalSubmitting.value || props.isSubmitting) return
    isLocalSubmitting.value = true

    emit('create', {
      name: formData.value.name.trim(),
      color: formData.value.color,
    })
  } catch (error) {
    console.error('Failed to create selection:', error)
  } finally {
    isLocalSubmitting.value = false
  }
}
</script>
