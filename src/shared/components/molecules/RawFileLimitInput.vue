<template>
  <div class="space-y-2">
    <label :class="theme.textPrimary" class="text-sm font-semibold"> Raw File Limit </label>
    <Input
      :class="[theme.bgInput, theme.borderInput, theme.textInput]"
      :model-value="displayValue"
      :disabled="disabled"
      class="w-full"
      min="1"
      placeholder="Enter number (leave empty for unlimited)"
      type="number"
      @update:model-value="handleInput"
      @keydown.enter="$emit('enter')"
      @keydown.esc="$emit('esc')"
    />
    <p :class="theme.textSecondary" class="text-xs">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useRawFileLimitInput } from '@/domains/memora/composables/useRawFileLimitInput'
import { Input } from '@/shared/components/shadcn/input'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'enter', 'esc'])

const { handleLimitChange, formatForDisplay } = useRawFileLimitInput()

const displayValue = computed(() => formatForDisplay(props.modelValue))

const handleInput = value => {
  const normalized = handleLimitChange(value)
  emit('update:modelValue', normalized)
}
</script>
