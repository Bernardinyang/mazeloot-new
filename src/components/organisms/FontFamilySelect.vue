<template>
  <Select :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <SelectTrigger
      :class="[
        'w-full transition-all duration-200 focus:ring-2 focus:ring-teal-500/20',
        theme.bgInput,
        theme.borderInput,
        theme.textInput,
        triggerClass,
      ]"
    >
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
      <SelectItem
        v-for="font in fontOptions"
        :key="font.id"
        :value="font.id"
        :label="font.label"
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer', font.class]"
      >
        {{ font.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup>
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: undefined,
  },
  triggerClass: {
    type: String,
    default: undefined,
  },
})

defineEmits(['update:modelValue'])

// Frequently used fonts by creatives
const fontOptions = [
  { id: 'sans', label: 'Sans Serif', class: 'font-sans' },
  { id: 'serif', label: 'Serif', class: 'font-serif' },
  { id: 'modern', label: 'Modern', class: 'font-mono' },
  { id: 'playfair', label: 'Playfair Display', class: 'font-playfair' },
  { id: 'montserrat', label: 'Montserrat', class: 'font-montserrat' },
  { id: 'lato', label: 'Lato', class: 'font-lato' },
  { id: 'raleway', label: 'Raleway', class: 'font-raleway' },
  { id: 'opensans', label: 'Open Sans', class: 'font-opensans' },
  { id: 'roboto', label: 'Roboto', class: 'font-roboto' },
  { id: 'poppins', label: 'Poppins', class: 'font-poppins' },
  { id: 'inter', label: 'Inter', class: 'font-inter' },
  { id: 'nunito', label: 'Nunito', class: 'font-nunito' },
  { id: 'merriweather', label: 'Merriweather', class: 'font-merriweather' },
  { id: 'crimson', label: 'Crimson Text', class: 'font-crimson' },
  { id: 'lora', label: 'Lora', class: 'font-lora' },
  { id: 'source', label: 'Source Sans Pro', class: 'font-source' },
  { id: 'ubuntu', label: 'Ubuntu', class: 'font-ubuntu' },
  { id: 'dancing', label: 'Dancing Script', class: 'font-dancing' },
  { id: 'pacifico', label: 'Pacifico', class: 'font-pacifico' },
  { id: 'caveat', label: 'Caveat', class: 'font-caveat' },
]

const getFontLabel = fontId => {
  const font = fontOptions.find(f => f.id === fontId)
  return font?.label || 'Select font'
}

const getFontClass = fontId => {
  const font = fontOptions.find(f => f.id === fontId)
  return font?.class || 'font-sans'
}
</script>
