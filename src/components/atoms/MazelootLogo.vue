<template>
  <div
    :class="[
      'flex items-center',
      containerClass,
      size === 'sm' ? 'h-10' : size === 'md' ? 'h-14' : 'h-16',
    ]"
  >
    <img
      :src="logoImage"
      alt="Mazeloot"
      :class="[
        'object-contain transition-all duration-200',
        'h-full w-auto max-w-full',
        logoColorClass,
        colorClass,
      ]"
      draggable="false"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import logoImage from '@/assets/images/mazeloot.svg'

const themeStore = useThemeStore()

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value),
  },
  showText: {
    type: Boolean,
    default: true,
  },
  colorClass: {
    type: String,
    default: undefined,
  },
  containerClass: {
    type: String,
    default: '',
  },
})

const isDark = computed(() => themeStore.effectiveTheme === 'dark')

const logoColorClass = computed(() => {
  if (props.colorClass) return ''
  // White filter for dark theme, black filter for light theme
  return isDark.value
    ? 'brightness-0 invert'
    : 'brightness-0'
})
</script>
