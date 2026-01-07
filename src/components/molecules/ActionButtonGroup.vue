<template>
  <div :class="['flex gap-2', layout === 'vertical' ? 'flex-col' : 'flex-row', containerClass]">
    <slot>
      <!-- Default buttons if no slot content provided -->
      <Button
        v-if="cancelLabel"
        type="button"
        :variant="cancelButtonClass ? 'default' : 'ghost'"
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
        variant="default"
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
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'

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
  cancelButtonClass: {
    type: String,
    default: '',
  },
})

defineEmits(['confirm', 'cancel'])
</script>
