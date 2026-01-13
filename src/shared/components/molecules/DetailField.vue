<template>
  <div
    :class="[
      'flex',
      layout === 'horizontal' ? 'justify-between items-start gap-4' : 'flex-col gap-1',
      fieldClass,
    ]"
  >
    <label
      v-if="label"
      :class="[
        'text-xs font-medium uppercase tracking-wider',
        theme.textTertiary,
        layout === 'horizontal' ? 'flex-shrink-0' : '',
      ]"
    >
      {{ label }}
    </label>
    <div :class="['flex-1', layout === 'horizontal' ? 'text-right' : '']">
      <slot>
        <p
          v-if="value !== null && value !== undefined"
          :class="[valueClass, computedValueTextClass]"
        >
          {{ formattedValue }}
        </p>
        <p v-else :class="[valueClass, theme.textTertiary]">N/A</p>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number, Boolean, Object, Array],
    default: null,
  },
  layout: {
    type: String,
    default: 'vertical',
    validator: value => ['vertical', 'horizontal'].includes(value),
  },
  format: {
    type: String,
    default: 'text',
    validator: value => ['text', 'date', 'boolean', 'number', 'json', 'mono'].includes(value),
  },
  fieldClass: {
    type: String,
    default: '',
  },
  valueClass: {
    type: String,
    default: 'text-sm',
  },
  valueTextClass: {
    type: String,
    default: '',
  },
})

const theme = useThemeClasses()

const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined) return 'N/A'

  switch (props.format) {
    case 'date':
      if (typeof props.value === 'string' && props.value.match(/^\d{4}-\d{2}-\d{2}T/)) {
        const date = new Date(props.value)
        return date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      }
      return String(props.value)
    case 'boolean':
      return props.value ? 'Yes' : 'No'
    case 'number':
      return typeof props.value === 'number' ? props.value.toLocaleString() : String(props.value)
    case 'json':
      try {
        return JSON.stringify(props.value, null, 2)
      } catch {
        return String(props.value)
      }
    case 'mono':
      return String(props.value)
    default:
      return String(props.value)
  }
})

const computedValueTextClass = computed(() => {
  if (props.format === 'mono') {
    return 'font-mono'
  }
  return props.valueTextClass || theme.textPrimary
})
</script>
