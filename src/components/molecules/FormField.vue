<template>
  <div class="space-y-2">
    <Label v-if="label" :for="name">{{ label }}</Label>
    <Field :name="name" v-slot="{ field, errorMessage }">
      <component
        :is="inputComponent"
        :id="name"
        v-bind="field"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :class="cn({ 'border-destructive': errorMessage }, inputClass)"
      />
      <ErrorMessage :message="errorMessage" />
      <p v-if="hint && !errorMessage" class="text-xs text-muted-foreground">
        {{ hint }}
      </p>
    </Field>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Field } from 'vee-validate'
import Label from '@/components/shadcn/Label.vue'
import Input from '@/components/shadcn/input/Input.vue'
import PasswordInput from './PasswordInput.vue'
import ErrorMessage from '@/components/atoms/ErrorMessage.vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: undefined,
  },
  type: {
    type: String,
    default: 'text',
    validator: value => ['text', 'email', 'password', 'tel', 'number'].includes(value),
  },
  placeholder: {
    type: String,
    default: undefined,
  },
  autocomplete: {
    type: String,
    default: undefined,
  },
  hint: {
    type: String,
    default: undefined,
  },
  inputClass: {
    type: String,
    default: undefined,
  },
})

const inputComponent = computed(() => {
  return props.type === 'password' ? PasswordInput : Input
})
</script>
