<template>
  <div class="space-y-2">
    <Label v-if="label" :for="id">{{ label }}</Label>
    <div class="flex justify-center gap-2">
      <input
        v-for="(_digit, index) in code"
        :key="index"
        :id="index === 0 ? id : undefined"
        :ref="el => (inputRefs[index] = el)"
        v-model="code[index]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :class="cn(
          'flex h-12 w-12 rounded-md border border-input bg-background text-center text-lg font-semibold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          inputClass
        )"
        :disabled="disabled"
        @input="handleInput(index, $event)"
        @keydown="handleKeyDown(index, $event)"
        @paste="handlePaste"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Label from '@/components/shadcn/Label.vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: undefined,
  },
  id: {
    type: String,
    default: undefined,
  },
  length: {
    type: Number,
    default: 4,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
    default: undefined,
  },
})

const emit = defineEmits(['update:modelValue', 'complete'])

const code = ref(Array(props.length).fill(''))
const inputRefs = ref([])

const isComplete = computed(() => {
  return code.value.every(digit => digit !== '')
})

const handleInput = (index, event) => {
  const target = event.target
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

const handleKeyDown = (index, event) => {
  if (event.key === 'Backspace' && !code.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const handlePaste = event => {
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
    } else if (newValue.length === props.length) {
      code.value = newValue.split('').slice(0, props.length)
    }
  }
)

onMounted(() => {
  if (props.modelValue && props.modelValue.length === props.length) {
    code.value = props.modelValue.split('').slice(0, props.length)
  } else {
    inputRefs.value[0]?.focus()
  }
})

defineExpose({
  reset,
  focus: () => inputRefs.value[0]?.focus(),
})
</script>

