<template>
  <Button
    :type="type"
    :disabled="disabled"
    :loading="loading"
    :loading-label="loadingLabel"
    :variant="variant"
    :class="buttonClass"
    @click="$emit('click')"
  >
    <slot>{{ label }}</slot>
  </Button>
</template>

<script setup>
import { Button } from '@/shared/components/shadcn/button'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: undefined,
  },
  loadingLabel: {
    type: String,
    default: 'Loading...',
  },
  type: {
    type: String,
    default: 'button',
    validator: value => ['button', 'submit', 'reset'].includes(value),
  },
  variant: {
    type: String,
    default: 'default',
    validator: value =>
      ['default', 'accent', 'primary', 'destructive', 'success', 'warning', 'outline', 'secondary', 'ghost', 'link'].includes(value),
  },
  buttonClass: {
    type: String,
    default: '',
  },
})

defineEmits(['click'])
</script>
