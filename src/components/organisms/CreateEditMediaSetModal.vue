<template>
  <CenterModal
    :model-value="props.modelValue"
    :title="props.isEditing ? 'EDIT PHOTO SET' : 'CREATE PHOTO SET'"
    content-class="sm:max-w-[500px]"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-6 py-4">
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold">
          Photo Set Name <span class="text-red-500">*</span>
        </label>
        <Input
          :model-value="props.name"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          class="w-full"
          placeholder="e.g. Ceremony, Reception, Getting ready"
          @update:model-value="emit('update:name', $event)"
          @keydown.enter="emit('confirm')"
          @keydown.esc="emit('cancel')"
        />
      </div>

      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold"> Description </label>
        <Textarea
          :model-value="props.description"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          :maxlength="500"
          class="w-full min-h-[100px] resize-none"
          placeholder="Optional"
          @update:model-value="emit('update:description', $event)"
        />
        <div class="flex items-center justify-between">
          <p :class="theme.textTertiary" class="text-xs">
            Description is shown to clients viewing this photo set for additional storytelling.
          </p>
          <span :class="theme.textTertiary" class="text-xs">
            {{ (props.description || '').length }}/500
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <ActionButtonGroup
        :confirm-label="props.isEditing ? 'Update' : 'Create'"
        :disabled="props.isCreating"
        :loading="props.isCreating"
        :loading-label="props.isEditing ? 'Updating...' : 'Creating...'"
        cancel-label="Cancel"
        @cancel="emit('cancel')"
        @confirm="emit('confirm')"
      />
    </template>
  </CenterModal>
</template>

<script setup lang="ts">
import { useThemeClasses } from '@/composables/useThemeClasses'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import CenterModal from '@/components/molecules/CenterModal.vue'
import { Input } from '@/components/shadcn/input'
import Textarea from '@/components/shadcn/Textarea.vue'

const theme = useThemeClasses()

const props = defineProps<{
  modelValue: boolean
  isEditing: boolean
  isCreating: boolean
  name: string
  description: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:name': [value: string]
  'update:description': [value: string]
  cancel: []
  confirm: []
}>()
</script>
