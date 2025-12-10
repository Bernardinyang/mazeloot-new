<template>
  <div class="flex items-center gap-2">
    <!-- Symbol -->
    <div :class="['relative', size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-8 w-8' : 'h-10 w-10']">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" :class="logoColor">
        <!-- Outer octagonal frame with corner cutouts -->
        <path d="M4 4h16v16H4V4z" :class="[logoColor, 'opacity-0']" />
        <!-- Central circle -->
        <circle cx="12" cy="12" r="3" :class="logoColor" fill="currentColor" />
        <!-- Eight radiating segments (camera aperture style) -->
        <path d="M12 9 L13 6 L11 6 Z" :class="logoColor" fill="currentColor" />
        <path d="M15 12 L18 13 L18 11 Z" :class="logoColor" fill="currentColor" />
        <path d="M12 15 L13 18 L11 18 Z" :class="logoColor" fill="currentColor" />
        <path d="M9 12 L6 13 L6 11 Z" :class="logoColor" fill="currentColor" />
        <path d="M13.5 9.5 L15.5 7.5 L14.5 6.5 Z" :class="logoColor" fill="currentColor" />
        <path d="M14.5 14.5 L16.5 16.5 L15.5 17.5 Z" :class="logoColor" fill="currentColor" />
        <path d="M10.5 14.5 L8.5 16.5 L9.5 17.5 Z" :class="logoColor" fill="currentColor" />
        <path d="M9.5 9.5 L7.5 7.5 L8.5 6.5 Z" :class="logoColor" fill="currentColor" />
        <!-- Corner rectangular elements -->
        <rect x="2" y="2" width="4" height="4" rx="0.5" :class="logoColor" fill="currentColor" />
        <rect x="18" y="2" width="4" height="4" rx="0.5" :class="logoColor" fill="currentColor" />
        <rect x="2" y="18" width="4" height="4" rx="0.5" :class="logoColor" fill="currentColor" />
        <rect x="18" y="18" width="4" height="4" rx="0.5" :class="logoColor" fill="currentColor" />
      </svg>
    </div>
    <!-- Text -->
    <span
      v-if="showText"
      :class="[
        'font-bold',
        size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg',
        logoColor,
      ]"
    >
      mazeloot
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    showText?: boolean
    colorClass?: string
  }>(),
  {
    size: 'md',
    showText: true,
  }
)

// Determine if dark mode based on effective theme
const isDark = computed(() => themeStore.effectiveTheme === 'dark')

// Logo color based on theme - dark logo for light mode, light logo for dark mode
const logoColor = computed(() => {
  if (props.colorClass) return props.colorClass
  // For better contrast: use darker colors in light mode, lighter in dark mode
  return isDark.value
    ? 'text-gray-200 dark:text-gray-200' // Light logo for dark background
    : 'text-gray-800 light:text-gray-800' // Dark logo for light background
})
</script>
