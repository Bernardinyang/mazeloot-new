import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { storage } from '@/utils/storage'

const THEME_STORAGE_KEY = 'mazeloot_theme'
const TOAST_DESIGN_STORAGE_KEY = 'mazeloot_toast_design'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(storage.get(THEME_STORAGE_KEY) || 'dark')
  const toastDesign = ref(storage.get(TOAST_DESIGN_STORAGE_KEY) || '1')
  const systemTheme = ref(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  // Get effective theme (resolves 'system' to actual theme)
  const effectiveTheme = ref(theme.value === 'system' ? systemTheme.value : theme.value)

  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = e => {
    systemTheme.value = e.matches ? 'dark' : 'light'
    if (theme.value === 'system') {
      effectiveTheme.value = systemTheme.value
      applyTheme(effectiveTheme.value)
    }
  }

  mediaQuery.addEventListener('change', handleSystemThemeChange)

  // Apply theme to document
  const applyTheme = newTheme => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }

  // Persist theme to localStorage
  const persistTheme = () => {
    storage.set(THEME_STORAGE_KEY, theme.value)
  }

  // Watch theme and persist to localStorage
  watch(theme, () => {
    persistTheme()
  })

  // Watch toast design and persist to localStorage
  watch(toastDesign, () => {
    storage.set(TOAST_DESIGN_STORAGE_KEY, toastDesign.value)
  })

  // Set toast design
  const setToastDesign = design => {
    if (['1', '2', '3', '4', '5', 'default'].includes(design)) {
      toastDesign.value = design
    } else {
      console.warn(`Invalid toast design: ${design}. Using default.`)
      toastDesign.value = '1'
    }
  }

  // Set theme
  const setTheme = newTheme => {
    theme.value = newTheme

    if (newTheme === 'system') {
      effectiveTheme.value = systemTheme.value
    } else {
      effectiveTheme.value = newTheme
    }

    applyTheme(effectiveTheme.value)
    // Persistence is handled by watcher
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    if (effectiveTheme.value === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  // Initialize theme on store creation
  applyTheme(effectiveTheme.value)

  // Watch theme changes
  watch(
    () => theme.value,
    newTheme => {
      if (newTheme === 'system') {
        effectiveTheme.value = systemTheme.value
      } else {
        effectiveTheme.value = newTheme
      }
      applyTheme(effectiveTheme.value)
    }
  )

  return {
    theme,
    toastDesign,
    systemTheme,
    effectiveTheme,
    setTheme,
    toggleTheme,
    setToastDesign,
  }
})
