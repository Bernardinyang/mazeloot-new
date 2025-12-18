<template>
  <div class="flex items-center justify-end gap-3 pt-4">
    <Button
      type="button"
      variant="ghost"
      :class="[
        theme.textSecondary,
        theme.bgButtonHover,
        'hover:text-teal-600 dark:hover:text-teal-400',
      ]"
      @click="$emit('cancel')"
      :disabled="isSubmitting"
    >
      {{ cancelLabel }}
    </Button>
    <Button :type="submitType" :disabled="disabled || isSubmitting" :class="submitButtonClass">
      <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
      <span v-if="isSubmitting">{{ submittingLabel }}</span>
      <span v-else>{{ submitLabel }}</span>
    </Button>
  </div>
</template>

<script setup>
import { Button } from '@/components/shadcn/button'
import { Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'

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
    default:
      'bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed',
  },
})

const emit = defineEmits(['cancel'])

const theme = useThemeClasses()
</script>
