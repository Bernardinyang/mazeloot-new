<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent :class="[theme.bgCard, theme.borderSecondary]" class="sm:max-w-[420px]">
      <DialogHeader>
        <DialogTitle :class="theme.textPrimary" class="text-xl font-bold">
          Set Selection Limit
        </DialogTitle>
        <DialogDescription :class="theme.textSecondary" class="text-sm mt-1">
          Set the maximum number of media items clients can select from this set. Leave empty for
          unlimited.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 mt-6">
        <SelectionLimitInput
          :model-value="limitValue"
          :disabled="isSaving"
          description="Clients will be able to select up to this many items from this set."
          @update:model-value="limitValue = $event"
          @enter="handleSave"
          @esc="handleCancel"
        />
      </div>

      <DialogFooter class="mt-6">
        <Button
          variant="ghost"
          :class="[theme.textSecondary, theme.bgButtonHover]"
          :disabled="isSaving"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          :loading="isSaving"
          loading-label="Saving..."
          @click="handleSave"
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import SelectionLimitInput from '@/components/molecules/SelectionLimitInput.vue'
import { normalizeSelectionLimit } from '@/utils/selectionLimit'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  currentLimit: {
    type: Number,
    default: null,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const limitValue = ref(props.currentLimit ?? null)

watch(
  () => props.currentLimit,
  newLimit => {
    limitValue.value = newLimit ?? null
  }
)

watch(
  () => props.modelValue,
  open => {
    if (open) {
      limitValue.value = props.currentLimit ?? null
    }
  }
)

const handleSave = () => {
  const value = normalizeSelectionLimit(limitValue.value)
  emit('save', value)
}

const handleCancel = () => {
  limitValue.value = props.currentLimit ?? null
  emit('cancel')
}
</script>
