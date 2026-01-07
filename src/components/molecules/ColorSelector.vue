<template>
  <div class="space-y-2">
    <label class="text-sm font-medium" :class="theme.textPrimary"> Color </label>
    <div class="space-y-3">
      <!-- Preset Colors Grid -->
      <div class="grid grid-cols-8 gap-2">
        <button
          v-for="color in presetColors"
          :key="color.value"
          type="button"
          :class="[
            'h-10 w-10 rounded-md border-2 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center',
            modelValue === color.value
              ? 'border-gray-900 dark:border-gray-100 ring-1 ring-gray-900 dark:ring-gray-100'
              : 'border-gray-300 dark:border-gray-600',
          ]"
          :style="{ backgroundColor: color.value }"
          :title="color.label"
          @click="selectColor(color.value)"
        >
          <span
            v-if="modelValue === color.value"
            class="text-white drop-shadow-lg"
            style="text-shadow: 0 0 2px rgba(0, 0, 0, 0.5)"
          >
            ✓
          </span>
        </button>
      </div>

      <!-- Custom Color Input -->
      <div class="flex items-center gap-2">
        <input
          type="color"
          :value="modelValue || getAccentColor()"
          @input="handleColorInput"
          class="h-10 w-20 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer"
        />
        <Input
          :value="modelValue || ''"
          :placeholder="getAccentColor()"
          :class="[theme.bgInput, theme.borderInput, theme.textInput, 'flex-1']"
          @input="handleHexInput"
          maxlength="7"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Input } from '@/components/shadcn/input'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { getAccentColor } from '@/utils/colors'

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const theme = useThemeClasses()

const presetColors = [
  { value: '#8B5CF6', label: 'Violet' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#8B5CF6', label: 'Violet' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#EF4444', label: 'Red' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#F97316', label: 'Orange' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#6366F1', label: 'Indigo' },
  { value: '#84CC16', label: 'Lime' },
  { value: '#22C55E', label: 'Green' },
  { value: '#A855F7', label: 'Violet' },
  { value: '#F43F5E', label: 'Rose' },
  { value: '#0EA5E9', label: 'Sky' },
  { value: '#64748B', label: 'Slate' },
]

const selectColor = color => {
  emit('update:modelValue', color)
}

const handleColorInput = event => {
  emit('update:modelValue', event.target.value)
}

const handleHexInput = event => {
  let value = event.target.value
  // Add # if missing
  if (value && !value.startsWith('#')) {
    value = '#' + value
  }
  // Validate hex color
  if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
    emit('update:modelValue', value || null)
  }
}
</script>
