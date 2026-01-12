<template>
  <div class="flex items-center justify-end gap-3 pt-4">
    <Button
      type="button"
      variant="ghost"
      :class="[
        theme.textSecondary,
        theme.bgButtonHover,
        'hover:text-accent',
      ]"
      @click="$emit('cancel')"
      :disabled="isSubmitting"
    >
      {{ cancelLabel }}
    </Button>
    <Button
      :type="submitType"
      :disabled="disabled"
      :loading="isSubmitting"
      :loading-label="submittingLabel"
      :class="submitButtonClass"
      variant="primary"
    >
      {{ submitLabel }}
    </Button>
  </div>
</template>

<script setup>
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  cancelLabel: {
    type: String,
    default: 'Cancel',
  },
  submitLabel: {
    type: String,
    default: 'Submit',
  },
  submittingLabel: {
    type: String,
    default: 'Submitting...',
  },
  submitType: {
    type: String,
    default: 'submit',
    validator: value => ['button', 'submit'].includes(value),
  },
  submitButtonClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['cancel'])

const theme = useThemeClasses()
</script>
