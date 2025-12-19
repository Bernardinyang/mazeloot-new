<template>
  <div :class="['flex gap-2', layout === 'vertical' ? 'flex-col' : 'flex-row', containerClass]">
    <slot>
      <!-- Default buttons if no slot content provided -->
      <Button
        v-if="cancelLabel"
        type="button"
        variant="ghost"
        :class="[
          theme.textSecondary,
          theme.bgButtonHover,
          'hover:text-teal-600 dark:hover:text-teal-400',
          cancelButtonClass,
        ]"
        :disabled="disabled || loading"
        @click="$emit('cancel')"
      >
        {{ cancelLabel }}
      </Button>
      <Button
        v-if="confirmLabel"
        type="button"
        :class="['bg-teal-500 hover:bg-teal-600 text-white', confirmButtonClass]"
        :disabled="disabled || loading"
        @click="$emit('confirm')"
      >
        <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
        <span v-if="loading">{{ loadingLabel || 'Loading...' }}</span>
        <span v-else>{{ confirmLabel }}</span>
      </Button>
    </slot>
  </div>
</template>

<script setup>
import { Button } from '@/components/shadcn/button'
import { Loader2 } from 'lucide-vue-next'
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
