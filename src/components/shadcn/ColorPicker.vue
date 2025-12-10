<template>
  <div class="relative" ref="pickerRef">
    <div class="flex items-center gap-2">
      <button
        type="button"
        :class="cn(
          'h-10 w-10 rounded-md border border-input cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          $attrs.class
        )"
        :style="{ backgroundColor: displayColor }"
        @click="togglePicker"
      />
      <input
        :value="displayColor"
        :class="cn(
          'flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          $attrs.class
        )"
        type="text"
        :placeholder="placeholder"
        @input="handleInput"
        @blur="handleBlur"
        v-bind="$attrs"
      />
    </div>

    <!-- Color Picker Popover -->
    <div
      v-if="showPicker"
      class="absolute z-50 mt-1 w-64 rounded-md border p-4 shadow-lg"
      :class="[
        'bg-white dark:bg-gray-800',
        'border-gray-200 dark:border-gray-700',
        'text-gray-900 dark:text-gray-100'
      ]"
    >
      <!-- Preset Colors -->
      <div class="mb-4">
        <label class="text-sm font-medium mb-2 block">Preset Colors</label>
        <div class="grid grid-cols-8 gap-2">
          <button
            v-for="color in presetColors"
            :key="color"
            type="button"
            class="h-8 w-8 rounded-md border-2 cursor-pointer hover:scale-110 transition-transform"
            :class="displayColor === color ? 'border-primary' : 'border-input'"
            :style="{ backgroundColor: color }"
            @click="selectColor(color)"
          />
        </div>
      </div>

      <!-- Custom Color Input -->
      <div>
        <label class="text-sm font-medium mb-2 block">Custom Color</label>
        <input
          type="color"
          :value="displayColor"
          @input="handleColorInput"
          class="w-full h-10 rounded-md border border-input cursor-pointer"
        />
      </div>

      <!-- Hex Input -->
      <div class="mt-4">
        <label class="text-sm font-medium mb-2 block">Hex Code</label>
        <input
          :value="displayColor"
          @input="handleInput"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="#000000"
          maxlength="7"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '#000000',
  placeholder: '#000000'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPicker = ref(false)
const pickerRef = ref<HTMLElement | null>(null)
const internalValue = ref(props.modelValue || '#000000')

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== internalValue.value) {
    internalValue.value = newValue
  }
})

// Close picker when clicking outside
onClickOutside(pickerRef, () => {
  showPicker.value = false
})

const displayColor = computed({
  get: () => internalValue.value || props.modelValue || '#000000',
  set: (value: string) => {
    internalValue.value = value
    emit('update:modelValue', value)
  }
})

const presetColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#008000', '#000080',
  '#800000', '#808000', '#008080', '#C0C0C0', '#FFD700',
  '#FF6347', '#40E0D0', '#EE82EE', '#F0E68C', '#98FB98',
  '#F5DEB3', '#FF69B4', '#CD5C5C', '#4B0082', '#32CD32',
  '#00CED1', '#FF1493', '#1E90FF', '#B22222', '#228B22'
]

const togglePicker = () => {
  showPicker.value = !showPicker.value
}

const closePicker = () => {
  showPicker.value = false
}

const selectColor = (color: string) => {
  displayColor.value = color
  closePicker()
}

const handleColorInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  displayColor.value = target.value
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.trim()
  
  // Add # if missing
  if (value && !value.startsWith('#')) {
    value = '#' + value
  }
  
  // Validate hex color
  if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
    displayColor.value = value || '#000000'
  }
}

const handleBlur = () => {
  // Ensure valid hex color on blur
  if (!displayColor.value.match(/^#[0-9A-Fa-f]{6}$/)) {
    displayColor.value = '#000000'
  }
}
</script>

