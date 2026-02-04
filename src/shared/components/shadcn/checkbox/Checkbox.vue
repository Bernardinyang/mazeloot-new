<template>
  <label
    :class="[
      'inline-flex items-start gap-3 cursor-pointer select-none',
      disabled && 'cursor-not-allowed opacity-60',
      rootClass,
    ]"
  >
    <span class="relative inline-flex shrink-0">
      <input
        v-bind="$attrs"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        class="peer sr-only"
        @change="$emit('update:modelValue', $event.target.checked)"
      >
      <span
        :class="[
          'flex h-5 w-5 items-center justify-center rounded-md border-2 border-input transition-colors',
          'peer-disabled:pointer-events-none peer-disabled:opacity-50',
          modelValue
            ? 'border-primary bg-primary text-primary-foreground'
            : 'bg-background',
        ]"
      >
        <Check v-if="modelValue" class="h-3 w-3 shrink-0" aria-hidden />
      </span>
    </span>
    <span v-if="$slots.default" class="text-sm leading-5">
      <slot />
    </span>
  </label>
</template>

<script setup>
import { Check } from '@/shared/utils/lucideAnimated'

defineOptions({ inheritAttrs: false })

defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  rootClass: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>
