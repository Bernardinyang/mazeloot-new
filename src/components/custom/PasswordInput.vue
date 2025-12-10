<template>
  <div class="relative">
    <input
      :type="showPassword ? 'text' : 'password'"
      :value="inputValue"
      :id="id"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :class="cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        inputClass
      )"
      @input="handleInput"
      @blur="handleBlur"
      v-bind="restAttrs"
    />
    <button
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
      @click="togglePassword"
      :aria-label="showPassword ? 'Hide password' : 'Show password'"
    >
      <Eye v-if="!showPassword" class="h-4 w-4" />
      <EyeOff v-else class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string
  value?: string
  id?: string
  placeholder?: string
  autocomplete?: string
  disabled?: boolean
  inputClass?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': [event: Event]
  'blur': [event: FocusEvent]
}>()

const attrs = useAttrs()
const showPassword = ref(false)

// Get value from either modelValue (v-model) or value (v-bind from VeeValidate)
const inputValue = computed(() => {
  // Check if we have a value from VeeValidate's field binding
  if (attrs.value !== undefined) {
    return attrs.value as string
  }
  return props.modelValue || props.value || ''
})

// Exclude props and type from attrs to avoid conflicts
const restAttrs = computed(() => {
  const { class: _, type: __, value: ___, ...rest } = attrs
  return rest
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Emit for v-model
  emit('update:modelValue', value)
  
  // Also emit input event for VeeValidate compatibility
  emit('input', event)
  
  // If there's an onChange handler from VeeValidate, call it
  if (attrs.onChange && typeof attrs.onChange === 'function') {
    attrs.onChange(value)
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
  
  // If there's an onBlur handler from VeeValidate, call it
  if (attrs.onBlur && typeof attrs.onBlur === 'function') {
    attrs.onBlur(event)
  }
}
</script>

