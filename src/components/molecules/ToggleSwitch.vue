<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <label :class="['text-sm font-medium', theme.textPrimary]">
        {{ label }}
      </label>
      <button
        v-if="showInfo"
        type="button"
        class="relative inline-flex items-center justify-center w-4 h-4 rounded-full"
        :class="theme.textTertiary"
        @click="$emit('info-click')"
      >
        <Info class="w-4 h-4" />
      </button>
    </div>
    <label class="relative inline-flex items-center cursor-pointer group">
      <input type="checkbox" :checked="modelValue" @change="handleChange" class="sr-only peer" />
      <div
        class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
      ></div>
      <span
        class="ml-3 text-sm font-medium"
        :class="modelValue ? theme.textPrimary : theme.textSecondary"
      >
        {{ modelValue ? onLabel : offLabel }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { Info } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'

interface Props {
  modelValue: boolean
  label: string
  onLabel?: string
  offLabel?: string
  showInfo?: boolean
}

withDefaults(defineProps<Props>(), {
  onLabel: 'On',
  offLabel: 'Off',
  showInfo: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'info-click': []
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}

const theme = useThemeClasses()
</script>
