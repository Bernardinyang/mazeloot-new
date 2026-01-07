<template>
  <SidebarModal
    :model-value="props.modelValue"
    content-class="sm:max-w-md"
    title="APPLY WATERMARK"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4">
      <p :class="theme.textSecondary" class="text-sm">
        Select a watermark to apply to {{ props.selectedCount }} item{{
          props.selectedCount > 1 ? 's' : ''
        }}:
      </p>
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold"> Watermark </label>
        <Select
          :model-value="props.selectedWatermark"
          @update:model-value="emit('update:selectedWatermark', $event)"
        >
          <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput]">
            <SelectValue placeholder="Select a watermark" />
          </SelectTrigger>
          <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
            <SelectItem :class="[theme.textPrimary, theme.bgButtonHover]" value="none">
              None
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
        v-if="props.selectedWatermark === 'none'"
        class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
      >
        <p class="text-xs text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> Selecting "None" will remove any existing watermarks from the
          selected images.
        </p>
      </div>
      
      <!-- Progress Display -->
      <div
        v-if="props.isLoading && props.progress"
        class="space-y-2 pt-4 border-t"
        :class="theme.borderSecondary"
      >
        <div class="flex items-center justify-between text-sm">
          <span :class="theme.textSecondary">
            {{ props.progress.currentItem || 'Processing...' }}
          </span>
          <span :class="theme.textPrimary" class="font-semibold">
            {{ props.progress.current }} / {{ props.progress.total }}
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            class="bg-violet-500 h-full transition-all duration-300"
            :style="{ width: `${props.progress.percentage}%` }"
          ></div>
        </div>
        <p class="text-xs text-center" :class="theme.textSecondary">
          {{ props.progress.percentage }}% complete
        </p>
      </div>
    </div>
    <template #footer>
      <ActionButtonGroup
        :disabled="props.isLoading"
        :loading="props.isLoading"
        :cancel-label="props.isLoading ? 'Cancel Operation' : 'Cancel'"
        confirm-label="Apply"
        loading-label="Applying watermark..."
        @cancel="emit('cancel')"
        @confirm="emit('confirm')"
      />
    </template>
  </SidebarModal>
</template>

<script setup>
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  selectedCount: { type: Number, required: true },
  selectedWatermark: { type: String, required: true },
  watermarks: { type: Array, required: true },
  isLoading: { type: Boolean, required: true },
  progress: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'update:selectedWatermark', 'cancel', 'confirm'])
</script>
