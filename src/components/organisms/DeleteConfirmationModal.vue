<template>
  <CenterModal
    v-model="isOpen"
    :title="title"
    content-class="sm:max-w-[425px]"
  >
    <div class="space-y-4 py-4">
      <div class="space-y-3">
        <p :class="theme.textSecondary" class="text-sm">
          {{ question }}
          <span v-if="itemName || fallbackName" :class="theme.textPrimary" class="font-semibold">
            {{ itemName || fallbackName }} </span
          >?
        </p>
        
        <!-- Phase and Set Info (if available) -->
        <div
          v-if="warningMessage"
          :class="[theme.bgCard, theme.borderSecondary]"
          class="p-3 rounded-lg border space-y-2"
        >
          <p :class="theme.textPrimary" class="text-xs font-semibold">Media Location:</p>
          <p :class="theme.textSecondary" class="text-xs whitespace-pre-line">{{ warningMessage }}</p>
        </div>
        
        <p v-if="description" :class="theme.textTertiary" class="text-xs whitespace-pre-line">
          {{ description }}
        </p>
      </div>
    </div>

    <template #footer>
      <ActionButtonGroup
        :disabled="isDeleting"
        :loading="isDeleting"
        cancel-label="Cancel"
        confirm-variant="destructive"
        :confirm-label="confirmLabel"
        :loading-label="loadingLabel"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      />
    </template>
  </CenterModal>
</template>

<script setup>
import { computed } from 'vue'
import CenterModal from '@/components/molecules/CenterModal.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  itemName: { type: String, default: undefined },
  fallbackName: { type: String, default: 'this item' },
  title: { type: String, default: 'Delete Item' },
  question: { type: String, default: 'Are you sure you want to delete' },
  description: { type: String, default: undefined },
  warningMessage: {
    type: String,
    default: undefined,
  },
  confirmLabel: { type: String, default: 'Delete' },
  loadingLabel: { type: String, default: 'Deleting...' },
  isDeleting: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const theme = useThemeClasses()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>
