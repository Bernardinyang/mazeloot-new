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

<script setup lang="ts">
import { Button } from '@/components/shadcn/button'
import { Loader2 } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'

interface Props {
  isSubmitting?: boolean
  disabled?: boolean
  cancelLabel?: string
  submitLabel?: string
  submittingLabel?: string
  submitType?: 'button' | 'submit'
  submitButtonClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  disabled: false,
  cancelLabel: 'Cancel',
  submitLabel: 'Submit',
  submittingLabel: 'Submitting...',
  submitType: 'submit',
  submitButtonClass:
    'bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed',
})

const emit = defineEmits<{
  cancel: []
}>()

const theme = useThemeClasses()
</script>
