<template>
  <CenterModal
    v-model="isOpen"
    :description="description"
    :title="title"
    content-class="sm:max-w-[425px]"
  >
    <div class="space-y-4 py-4">
      <div class="space-y-2">
        <p :class="theme.textSecondary" class="text-sm">
          Are you sure you want to delete
          <span :class="theme.textPrimary" class="font-semibold">
            {{ itemName || fallbackName }} </span
          >?
        </p>
        <p :class="theme.textTertiary" class="text-xs">
          {{ warningMessage }}
        </p>
      </div>
    </div>

    <template #footer>
      <ActionButtonGroup
        :disabled="isDeleting"
        :loading="isDeleting"
        cancel-label="Cancel"
        confirm-button-class="bg-red-500 hover:bg-red-600 text-white"
        confirm-label="Delete"
        loading-label="Deleting..."
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
  description: { type: String, default: 'This action cannot be undone.' },
  warningMessage: {
    type: String,
    default: 'This item will be permanently removed from your account.',
  },
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
