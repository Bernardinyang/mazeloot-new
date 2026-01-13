<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        :class="
          cn(
            'w-full justify-start text-left font-normal h-10',
            !modelValue && 'text-muted-foreground',
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            props.class
          )
        "
        variant="outline"
      >
        <CalendarIcon class="h-4 w-4" />
        <span>{{ displayValue || placeholder }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="[theme.bgCard, theme.borderCard, 'w-auto p-0']" align="start">
      <Calendar v-model="localValue" />
    </PopoverContent>
  </Popover>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import { Calendar } from '@/shared/components/shadcn/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/shadcn/popover'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { cn } from '@/shared/lib/utils'

const theme = useThemeClasses()

interface Props {
  modelValue?: Date | string | null
  placeholder?: string
  format?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Pick a date',
  format: 'MMM dd, yyyy',
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
}>()

const isOpen = ref(false)

const localValue = computed({
  get: () => {
    if (!props.modelValue) return null
    return typeof props.modelValue === 'string' ? new Date(props.modelValue) : props.modelValue
  },
  set: (value: Date | null) => {
    emit('update:modelValue', value)
    // Close popover when date is selected
    if (value !== null) {
      isOpen.value = false
    }
  },
})

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const date = typeof props.modelValue === 'string' ? new Date(props.modelValue) : props.modelValue
  return format(date, props.format)
})
</script>
