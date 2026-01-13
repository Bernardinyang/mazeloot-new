<template>
  <CenterModal
    :model-value="props.modelValue"
    content-class="sm:max-w-[500px]"
    title="REQUEST APPROVAL"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4 py-4">
      <div
        class="p-3 rounded-lg border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
      >
        <p :class="theme.textPrimary" class="text-sm font-medium mb-1">Revision Limit Exceeded</p>
        <p :class="theme.textSecondary" class="text-xs">
          The maximum revision limit ({{ maxRevisions }}) has been reached for this media. Request
          approval from the client to proceed with additional revisions.
        </p>
      </div>

      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-medium">Message (Optional)</label>
        <Textarea
          v-model="message"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          :disabled="props.isSubmitting"
          :maxlength="1000"
          placeholder="Explain why you need approval for additional revisions..."
          rows="4"
        />
        <p :class="theme.textTertiary" class="text-xs">
          Optional: Provide details about why additional revisions are needed
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <Button :disabled="props.isSubmitting" variant="outline" @click="handleCancel">
          Cancel
        </Button>
        <Button
          :disabled="props.isSubmitting"
          class="bg-amber-500 hover:bg-amber-600 text-white"
          @click="handleConfirm"
        >
          <Loader2 v-if="props.isSubmitting" class="h-4 w-4 mr-2 animate-spin" />
          <span v-if="props.isSubmitting">Sending...</span>
          <span v-else>Request Approval</span>
        </Button>
      </div>
    </template>
  </CenterModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import CenterModal from '@/shared/components/molecules/CenterModal.vue'
import { Button } from '@/shared/components/shadcn/button'
import { Textarea } from '@/shared/components/shadcn/textarea'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  isSubmitting: { type: Boolean, default: false },
  maxRevisions: { type: Number, default: 5 },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const message = ref('')

const handleCancel = () => {
  emit('cancel')
  message.value = ''
}

const handleConfirm = () => {
  emit('confirm', {
    message: message.value || null,
  })
}

watch(
  () => props.modelValue,
  open => {
    if (!open) {
      message.value = ''
    }
  }
)
</script>
