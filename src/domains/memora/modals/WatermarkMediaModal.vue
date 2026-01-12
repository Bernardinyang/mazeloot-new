<template>
  <SidebarModal
    :model-value="props.modelValue"
    :title="props.isEditing ? 'EDIT WATERMARK' : 'ADD WATERMARK'"
    content-class="sm:max-w-md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4">
      <p :class="theme.textSecondary" class="text-sm">
        {{
          props.isEditing
            ? 'This image has a watermark. Select a new watermark or choose "Remove Watermark" to restore the original:'
            : 'Select a watermark to apply to this image:'
        }}
      </p>
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold"> Watermark </label>
        <div v-if="props.isLoadingWatermarks" :class="theme.textSecondary" class="text-sm py-2">
          Loading watermarks...
        </div>
        <Select
          v-else
          :model-value="props.selectedWatermark"
          :disabled="props.isLoading"
          @update:model-value="emit('update:selectedWatermark', $event)"
        >
          <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput]">
            <SelectValue placeholder="Select a watermark" />
          </SelectTrigger>
          <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
            <SelectItem :class="[theme.textPrimary, theme.bgButtonHover]" value="none">
              {{ props.isEditing ? 'Remove Watermark' : 'None' }}
            </SelectItem>
            <SelectItem
              v-for="watermark in props.watermarks"
              :key="watermark.id"
              :class="[theme.textPrimary, theme.bgButtonHover]"
              :value="watermark.id"
            >
              {{ watermark.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div
        v-if="props.isEditing"
        class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
      >
        <p class="text-xs text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> Removing the watermark will restore the original image.
        </p>
      </div>
      <div class="flex items-center gap-2 pt-2">
        <button
          v-if="props.selectedWatermark && props.selectedWatermark !== 'none'"
          @click="emit('preview')"
          class="flex-1 px-4 py-2 rounded-md border text-sm font-semibold transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
          :class="[theme.borderSecondary, theme.textSecondary]"
        >
          Preview
        </button>
      </div>
    </div>
    <template #footer>
      <ActionButtonGroup
        :confirm-label="props.confirmLabel"
        :disabled="props.isLoading"
        :loading="props.isLoading"
        cancel-label="Cancel"
        loading-label="Processing..."
        @cancel="emit('cancel')"
        @confirm="emit('confirm')"
      />
    </template>
  </SidebarModal>
</template>

<script setup>
import SidebarModal from '@/shared/modals/SidebarModal.vue'
import ActionButtonGroup from '@/shared/components/molecules/ActionButtonGroup.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  isEditing: { type: Boolean, required: true },
  confirmLabel: { type: String, required: true },
  isLoading: { type: Boolean, required: true },
  isLoadingWatermarks: { type: Boolean, default: false },
  selectedWatermark: { type: String, required: true },
  watermarks: { type: Array, required: true },
})

const emit = defineEmits(['update:modelValue', 'update:selectedWatermark', 'cancel', 'confirm', 'preview'])
</script>
