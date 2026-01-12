<template>
  <CenterModal
    :model-value="props.modelValue"
    content-class="sm:max-w-[500px]"
    title="EDIT FILENAMES"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4 py-4">
      <p :class="theme.textSecondary" class="text-sm">
        Append text to {{ props.selectedCount }} item{{
          props.selectedCount > 1 ? 's' : ''
        }}
        filename{{ props.selectedCount > 1 ? 's' : '' }}
      </p>
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold"> Text to Append </label>
        <Input
          :model-value="props.appendText"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          class="w-full"
          placeholder="e.g., _edited, _final"
          @update:model-value="emit('update:appendText', $event)"
          @keydown.enter="emit('confirm')"
        />
        <p :class="theme.textTertiary" class="text-xs">
          This text will be appended to all selected filenames.
        </p>
      </div>
    </div>
    <template #footer>
      <ActionButtonGroup
        :disabled="!props.appendText.trim() || props.isLoading"
        :loading="props.isLoading"
        cancel-label="Cancel"
        confirm-label="Apply"
        @cancel="emit('cancel')"
        @confirm="emit('confirm')"
      />
    </template>
  </CenterModal>
</template>

<script setup>
import CenterModal from '@/shared/modals/CenterModal.vue'
import ActionButtonGroup from '@/shared/components/molecules/ActionButtonGroup.vue'
import { Input } from '@/shared/components/shadcn/input'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  selectedCount: { type: Number, required: true },
  appendText: { type: String, required: true },
  isLoading: { type: Boolean, required: true },
})

const emit = defineEmits(['update:modelValue', 'update:appendText', 'cancel', 'confirm'])
</script>
