<template>
  <div :class="['flex gap-2', layout === 'vertical' ? 'flex-col' : 'flex-row', containerClass]">
    <slot>
      <!-- Default buttons if no slot content provided -->
      <Button
        v-if="cancelLabel"
        type="button"
        :variant="cancelVariant || (cancelButtonClass ? 'default' : 'ghost')"
        :class="[
          cancelButtonClass || theme.textSecondary,
          cancelButtonClass || theme.bgButtonHover,
          cancelButtonClass ? '' : 'hover:text-accent',
          cancelButtonClass,
        ]"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        {{ cancelLabel }}
      </Button>
      <Button
        v-if="confirmLabel"
        type="button"
        :variant="confirmVariant || 'accent'"
        :loading="loading"
        :loading-label="loadingLabel || 'Loading...'"
        :disabled="disabled"
        :class="confirmButtonClass"
        @click="$emit('confirm')"
      >
        {{ confirmLabel }}
      </Button>
    </slot>
  </div>
</template>

<script setup>
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  layout: {
    type: String,
    default: 'horizontal',
    validator: value => ['vertical', 'horizontal'].includes(value),
  },
  containerClass: {
    type: String,
    default: '',
  },
  confirmLabel: {
    type: String,
    default: '',
  },
  cancelLabel: {
    type: String,
    default: 'Cancel',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loadingLabel: {
    type: String,
    default: 'Loading...',
  },
  confirmButtonClass: {
    type: String,
    default: '',
  },
  confirmVariant: {
    type: String,
    default: 'accent',
    validator: value =>
      ['default', 'accent', 'primary', 'destructive', 'success', 'warning', 'outline', 'secondary', 'ghost', 'link'].includes(value),
  },
  cancelButtonClass: {
    type: String,
    default: '',
  },
  cancelVariant: {
    type: String,
    default: null,
    validator: value =>
      !value ||
      ['default', 'accent', 'primary', 'destructive', 'success', 'warning', 'outline', 'secondary', 'ghost', 'link'].includes(value),
  },
})

defineEmits(['confirm', 'cancel'])
</script>
