<template>
  <div class="flex items-center justify-end gap-3">
    <Button
      variant="outline"
      @click="$emit('cancel')"
      :disabled="disabled"
      :class="cancelButtonClass"
    >
      {{ cancelLabel }}
    </Button>
    <Button :class="confirmButtonClass" @click="$emit('confirm')" :disabled="disabled || loading">
      <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
      <span v-if="loading">{{ loadingLabel }}</span>
      <span v-else>{{ confirmLabel }}</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/shadcn/button'
import { Loader2 } from 'lucide-vue-next'

interface Props {
  loading?: boolean
  disabled?: boolean
  cancelLabel?: string
  confirmLabel?: string
  loadingLabel?: string
  cancelButtonClass?: string
  confirmButtonClass?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  loadingLabel: 'Loading...',
  cancelButtonClass: '',
  confirmButtonClass: 'bg-teal-500 hover:bg-teal-600 text-white',
})

defineEmits<{
  cancel: []
  confirm: []
}>()
</script>
