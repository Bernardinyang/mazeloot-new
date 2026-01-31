<template>
  <textarea
    :value="modelValue"
    :class="
      cn(
        'flex w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 resize-y min-h-[80px]',
        $attrs.class
      )
    "
    v-bind="restAttrs"
    @input="handleInput"
  />
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import { cn } from '@/shared/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const attrs = useAttrs()

const restAttrs = computed(() => {
  const { class: _c, ...rest } = attrs
  return rest
})

const handleInput = (event) => {
  const target = event.target
  emit('update:modelValue', target?.value ?? '')
}
</script>
