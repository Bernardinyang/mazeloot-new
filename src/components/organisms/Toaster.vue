<template>
  <Toaster position="top-right" richColors :theme="toastTheme" closeButton />
</template>

<script setup>
import { Toaster } from 'vue-sonner'
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const toastTheme = computed(() => {
  // Map effectiveTheme to vue-sonner theme values ('light' or 'dark')
  return themeStore.effectiveTheme === 'dark' ? 'dark' : 'light'
})
</script>

<style>
/* Ensure close button is on the right side of toast */
[data-sonner-toast] {
  padding-right: 2.5rem !important;
}

[data-sonner-toast] [data-close-button] {
  right: 0.5rem !important;
  left: auto !important;
}

/* Hide toast titles - show only description */
[data-sonner-toast] [data-title] {
  display: none !important;
}
</style>
