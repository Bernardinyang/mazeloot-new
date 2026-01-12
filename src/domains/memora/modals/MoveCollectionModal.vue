<template>
  <CenterModal
    v-model="isOpen"
    :title="title"
    :description="description"
    content-class="sm:max-w-[425px] animate-scale-in"
  >
    <div class="space-y-4 py-4">
      <div class="space-y-2">
        <p class="text-sm" :class="theme.textSecondary">
          Are you sure you want to move
          <span class="font-semibold" :class="theme.textPrimary">
            {{ itemName }}
          </span>
          into
          <span class="font-semibold" :class="theme.textPrimary"> {{ targetFolderName }} </span>?
        </p>
        <p v-if="warningMessage" class="text-sm text-yellow-600 dark:text-yellow-400">
          {{ warningMessage }}
        </p>
      </div>
    </div>

    <template #footer>
      <ActionButtonGroup
        cancel-label="Cancel"
        confirm-label="Move"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      />
    </template>
  </CenterModal>
</template>

<script setup>
import { computed } from 'vue'
import CenterModal from '@/shared/modals/CenterModal.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import ActionButtonGroup from '@/shared/components/molecules/ActionButtonGroup.vue'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  targetFolderName: {
    type: String,
    required: true,
  },
  warningMessage: {
    type: String,
    default: undefined,
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const title = computed(() => 'Move Collection')
const description = computed(() => 'This action will move the collection to the selected folder.')

const handleConfirm = () => {
  emit('confirm')
  isOpen.value = false
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>
