<template>
  <Button
    :type="type"
    :disabled="disabled || loading"
    :variant="variant"
    :class="buttonClass"
    @click="$emit('click')"
  >
    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
    <span v-if="loading">{{ loadingLabel }}</span>
    <span v-else>
      <slot>{{ label }}</slot>
    </span>
  </Button>
</template>

<script setup>
import { Button } from '@/components/shadcn/button'
import { Loader2 } from 'lucide-vue-next'

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
      ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'].includes(value),
  },
  buttonClass: {
    type: String,
    default: '',
  },
})

defineEmits(['click'])
</script>
