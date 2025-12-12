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

<script setup lang="ts">
import { Button } from '@/components/shadcn/button'
import { Loader2 } from 'lucide-vue-next'

interface Props {
  loading?: boolean
  disabled?: boolean
  label?: string
  loadingLabel?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  buttonClass?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  loadingLabel: 'Loading...',
  type: 'button',
  variant: 'default',
  buttonClass: '',
})

defineEmits<{
  click: []
}>()
</script>
