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

<script setup lang="ts">
import { computed } from 'vue'
import { Field } from 'vee-validate'
import Label from '@/components/shadcn/Label.vue'
import Input from '@/components/shadcn/input/Input.vue'
import PasswordInput from './PasswordInput.vue'
import ErrorMessage from '@/components/atoms/ErrorMessage.vue'
import { cn } from '@/lib/utils'

interface Props {
  name: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
  autocomplete?: string
  hint?: string
  inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})

const inputComponent = computed(() => {
  return props.type === 'password' ? PasswordInput : Input
})
</script>
