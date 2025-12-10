<template>
  <div class="space-y-2 text-center">
    <Label v-if="label" :for="id">{{ label }}</Label>
    <div class="flex justify-center gap-2">
      <input
        v-for="(digit, index) in code"
        :key="index"
        :id="index === 0 ? id : undefined"
        :ref="el => (inputRefs[index] = el as HTMLInputElement)"
        v-model="code[index]"
        type="text"
        maxlength="1"
        class="flex h-12 w-12 rounded-md border border-input bg-background text-center text-lg font-semibold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        @input="handleInput(index, $event)"
        @keydown="handleKeyDown(index, $event)"
        @paste="handlePaste"
      />
    </div>
    <div v-if="showResend" class="text-xs text-muted-foreground mt-2">
      Didn't receive the code?
      <button
        type="button"
        @click="handleResend"
        class="text-primary hover:underline"
        :disabled="resendCooldown > 0"
      >
        {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Label from '@/components/shadcn/Label.vue'

interface Props {
  modelValue?: string
  label?: string
  id?: string
  length?: number
  showResend?: boolean
  resendCooldown?: number
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  showResend: true,
  resendCooldown: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  resend: []
  complete: [value: string]
}>()

const code = ref<string[]>(Array(props.length).fill(''))
const inputRefs = ref<(HTMLInputElement | null)[]>([])

const isComplete = computed(() => {
  return code.value.every(digit => digit !== '')
})

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/[^0-9]/g, '')

  if (value && index < code.value.length - 1) {
    code.value[index] = value
    inputRefs.value[index + 1]?.focus()
  } else if (value) {
    code.value[index] = value
  } else {
    code.value[index] = ''
  }

  updateModelValue()

  if (isComplete.value) {
    emit('complete', code.value.join(''))
  }
}

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !code.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text').replace(/[^0-9]/g, '')
  if (pastedData) {
    const digits = pastedData.slice(0, props.length).split('')
    digits.forEach((digit, index) => {
      if (index < code.value.length) {
        code.value[index] = digit
      }
    })
    const nextEmptyIndex = digits.length < code.value.length ? digits.length : code.value.length - 1
    inputRefs.value[nextEmptyIndex]?.focus()
    updateModelValue()

    if (isComplete.value) {
      emit('complete', code.value.join(''))
    }
  }
}

const handleResend = () => {
  emit('resend')
}

const updateModelValue = () => {
  emit('update:modelValue', code.value.join(''))
}

const reset = () => {
  code.value = Array(props.length).fill('')
  inputRefs.value[0]?.focus()
  updateModelValue()
}

watch(
  () => props.modelValue,
  newValue => {
    if (!newValue || newValue.length === 0) {
      reset()
    }
  }
)

onMounted(() => {
  inputRefs.value[0]?.focus()
})

defineExpose({
  reset,
  focus: () => inputRefs.value[0]?.focus(),
})
</script>
