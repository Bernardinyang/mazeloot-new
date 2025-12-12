<template>
  <CenterModal
    v-model="isOpen"
    :title="title"
    :description="description"
    content-class="sm:max-w-[425px]"
  >
    <div class="space-y-4 py-4">
      <div class="space-y-2">
        <p class="text-sm" :class="theme.textSecondary">
          Are you sure you want to delete
          <span class="font-semibold" :class="theme.textPrimary">
            {{ itemName || fallbackName }} </span
          >?
        </p>
        <p class="text-xs" :class="theme.textTertiary">
          {{ warningMessage }}
        </p>
      </div>
    </div>

    <template #footer>
      <ActionButtonGroup
        :loading="isDeleting"
        :disabled="isDeleting"
        cancel-label="Cancel"
        confirm-label="Delete"
        loading-label="Deleting..."
        confirm-button-class="bg-red-500 hover:bg-red-600 text-white"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      />
    </template>
  </CenterModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CenterModal from '@/components/molecules/CenterModal.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'

interface Props {
  modelValue: boolean
  itemName?: string
  fallbackName?: string
  title?: string
  description?: string
  warningMessage?: string
  isDeleting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Delete Item',
  description: 'This action cannot be undone.',
  fallbackName: 'this item',
  warningMessage: 'This item will be permanently removed from your account.',
  isDeleting: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

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
