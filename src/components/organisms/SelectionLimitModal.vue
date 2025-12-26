<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent :class="[theme.bgCard, theme.borderSecondary]" class="sm:max-w-[420px]">
      <DialogHeader>
        <DialogTitle :class="theme.textPrimary" class="text-xl font-bold">
          Set Selection Limit
        </DialogTitle>
        <DialogDescription :class="theme.textSecondary" class="text-sm mt-1">
          Set the maximum number of media items clients can select from this selection. Leave empty
          for unlimited.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 mt-6">
        <SelectionLimitInput
          :model-value="limitValue"
          :disabled="isSaving"
          description="Clients will be able to select up to this many items from this selection (applies to all sets unless a set has its own limit)."
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
          :class="['bg-teal-500 hover:bg-teal-600 text-white']"
          :disabled="isSaving"
          @click="handleSave"
        >
          <Loader2 v-if="isSaving" class="h-4 w-4 mr-2 animate-spin" />
          {{ isSaving ? 'Saving...' : 'Save' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
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
