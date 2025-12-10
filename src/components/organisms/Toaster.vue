<template>
  <Toaster position="top-right" richColors :theme="toastTheme" />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const toastTheme = computed(() => {
  // Map effectiveTheme to vue-sonner theme values ('light' or 'dark')
  return themeStore.effectiveTheme === 'dark' ? 'dark' : 'light'
})
</script>
