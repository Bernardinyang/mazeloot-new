<template>
  <CenterModal
    :model-value="props.modelValue"
    content-class="sm:max-w-[500px]"
    title="ADD TAGS"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4 py-4">
      <p :class="theme.textSecondary" class="text-sm">
        Add tags to {{ props.selectedCount }} item{{ props.selectedCount > 1 ? 's' : '' }}
      </p>
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold"> Tags </label>
        <Input
          :model-value="props.tagInput"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          class="w-full"
          placeholder="Enter tags separated by commas"
          @update:model-value="emit('update:tagInput', $event)"
          @keydown.enter.prevent="emit('add-tag')"
        />
        <p :class="theme.textTertiary" class="text-xs">
          Separate multiple tags with commas (e.g., wedding, ceremony, outdoor)
        </p>
        <div v-if="props.existingTags.length > 0" class="flex flex-wrap gap-2 mt-2">
          <span
            v-for="tag in props.existingTags"
            :key="tag"
            class="px-2 py-1 rounded-full text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
          >
            {{ tag }}
            <button
              class="ml-1 hover:text-violet-900 dark:hover:text-violet-100"
              @click="emit('remove-tag', tag)"
            >
              ×
            </button>
          </span>
        </div>
      </div>
    </div>
    <template #footer>
      <ActionButtonGroup
        :disabled="(!props.tagInput.trim() && props.existingTags.length === 0) || props.isLoading"
        :loading="props.isLoading"
        cancel-label="Cancel"
        confirm-label="Add Tags"
        loading-label="Adding tags..."
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
  selectedCount: { type: Number, required: true },
  tagInput: { type: String, required: true },
  existingTags: { type: Array, required: true },
  isLoading: { type: Boolean, required: true },
})

const emit = defineEmits([
  'update:modelValue',
  'update:tagInput',
  'add-tag',
  'remove-tag',
  'cancel',
  'confirm',
])
</script>
