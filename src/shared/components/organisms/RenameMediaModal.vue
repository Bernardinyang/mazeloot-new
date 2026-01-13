<template>
  <CenterModal
    :model-value="props.modelValue"
    content-class="sm:max-w-[500px]"
    title="RENAME MEDIA"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4 py-4">
      <p :class="theme.textSecondary" class="text-sm">Enter a new name for this media item:</p>
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold"> Name </label>
        <Input
          :model-value="props.newMediaName"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          :disabled="props.isRenaming"
          class="w-full"
          placeholder="Enter media name"
          @update:model-value="emit('update:newMediaName', $event)"
          @keydown.enter="!props.isRenaming && emit('confirm')"
        />
      </div>
    </div>
    <template #footer>
      <ActionButtonGroup
        :disabled="!props.newMediaName.trim() || props.isRenaming"
        :loading="props.isRenaming"
        cancel-label="Cancel"
        confirm-label="Rename"
        @cancel="emit('cancel')"
        @confirm="emit('confirm')"
      />
    </template>
  </CenterModal>
</template>

<script setup>
import CenterModal from '@/shared/components/molecules/CenterModal.vue'
import ActionButtonGroup from '@/shared/components/molecules/ActionButtonGroup.vue'
import { Input } from '@/shared/components/shadcn/input'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  newMediaName: { type: String, required: true },
  isRenaming: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'update:newMediaName', 'cancel', 'confirm'])
</script>
