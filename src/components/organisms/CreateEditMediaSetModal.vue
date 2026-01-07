<template>
  <SidebarModal
    :model-value="props.modelValue"
    :title="editing ? 'EDIT PHOTO SET' : 'CREATE PHOTO SET'"
    content-class="sm:max-w-md"
    @update:model-value="handleModalUpdate"
  >
    <div class="relative">
      <!-- Loading Overlay -->
      <div
        v-if="props.isCreating"
        class="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm rounded-lg z-50 flex items-center justify-center"
        style="margin: -1.5rem"
      >
        <div
          :class="[theme.bgCard, theme.borderSecondary]"
          class="px-4 py-3 rounded-lg border shadow-lg"
        >
          <div class="flex items-center gap-3">
            <Loader2 class="h-5 w-5 animate-spin text-accent" />
            <span :class="theme.textPrimary" class="text-sm font-medium">
              {{ editing ? 'Updating set...' : 'Creating set...' }}
            </span>
          </div>
        </div>
      </div>

      <div class="space-y-6" :class="{ 'pointer-events-none opacity-60': props.isCreating }">
        <div class="space-y-2">
          <label :class="theme.textPrimary" class="text-sm font-semibold">
            Photo Set Name <span class="text-red-500">*</span>
          </label>
          <Input
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            :model-value="props.name"
            :disabled="props.isCreating"
            class="w-full"
            placeholder="e.g. Ceremony, Reception, Getting ready"
            @update:model-value="emit('update:name', $event)"
            @keydown.enter="!props.isCreating && emit('confirm')"
            @keydown.esc="emit('cancel')"
          />
        </div>

        <div class="space-y-2">
          <label :class="theme.textPrimary" class="text-sm font-semibold"> Description </label>
          <Textarea
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            :maxlength="500"
            :model-value="props.description"
            :disabled="props.isCreating"
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

        <SelectionLimitInput
          v-if="props.context === 'selection'"
          :model-value="props.selectionLimit"
          :disabled="props.isCreating"
          description="Set the maximum number of media items clients can select from this set. Leave empty for unlimited."
          @update:model-value="handleSelectionLimitChange($event)"
          @enter="!props.isCreating && emit('confirm')"
          @esc="emit('cancel')"
        />
      </div>
    </div>

    <template #footer>
      <ActionButtonGroup
        :confirm-label="editing ? 'Update' : 'Create'"
        :disabled="props.isCreating"
        :loading="props.isCreating"
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
import SelectionLimitInput from '@/components/molecules/SelectionLimitInput.vue'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Loader2 } from 'lucide-vue-next'
import { computed } from 'vue'

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
  selectionLimit: {
    type: Number,
    default: null,
  },
  context: {
    type: String,
    default: 'selection', // 'selection' or 'proofing'
    validator: value => ['selection', 'proofing'].includes(value),
  },
})

const editing = computed(() => props.isEditing)

const emit = defineEmits([
  'update:modelValue',
  'update:name',
  'update:description',
  'update:selectionLimit',
  'cancel',
  'confirm',
])

const handleModalUpdate = value => {
  // Prevent closing modal during loading
  if (props.isCreating) return
  emit('update:modelValue', value)
}

const handleSelectionLimitChange = value => {
  // Don't update if loading
  if (props.isCreating) return
  emit('update:selectionLimit', value)
}
</script>
