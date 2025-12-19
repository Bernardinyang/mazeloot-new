<template>
  <SidebarModal
    :model-value="props.modelValue"
    :title="editing ? 'EDIT PHOTO SET' : 'CREATE PHOTO SET'"
    content-class="sm:max-w-md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-6">
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold">
          Photo Set Name <span class="text-red-500">*</span>
        </label>
        <Input
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          :model-value="props.name"
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
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
          :maxlength="500"
          :model-value="props.description"
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
        :confirm-label="editing ? 'Update' : 'Create'"
        :disabled="creating"
        :loading="creating"
        :loading-label="editing ? 'Updating...' : 'Creating...'"
        cancel-label="Cancel"
        @cancel="emit('cancel')"
        @confirm="emit('confirm')"
      />
    </template>
  </SidebarModal>
</template>

<script setup>
import { useThemeClasses } from '@/composables/useThemeClasses'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import { Input } from '@/components/shadcn/input'
import Textarea from '@/components/shadcn/Textarea.vue'
import { ref } from 'vue'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  isEditing: {
    type: Boolean,
    required: true,
  },
  isCreating: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

const creating = ref(props.isCreating)
const editing = ref(props.isEditing)

const emit = defineEmits([
  'update:modelValue',
  'update:name',
  'update:description',
  'cancel',
  'confirm',
])

const createSet = () => {
  creating.value = true
  emit('confirm')
}
</script>
