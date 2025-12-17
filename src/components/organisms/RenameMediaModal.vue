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
          class="w-full"
          placeholder="Enter media name"
          @update:model-value="emit('update:newMediaName', $event)"
          @keydown.enter="emit('confirm')"
        />
      </div>
    </div>
    <template #footer>
      <ActionButtonGroup
        :disabled="!props.newMediaName.trim()"
        cancel-label="Cancel"
        confirm-label="Rename"
        @cancel="emit('cancel')"
        @confirm="emit('confirm')"
      />
    </template>
  </CenterModal>
</template>

<script setup>
import CenterModal from '@/components/molecules/CenterModal.vue'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import { Input } from '@/components/shadcn/input'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  newMediaName: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue', 'update:newMediaName', 'cancel', 'confirm'])
</script>
