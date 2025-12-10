import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { storage } from '@/utils/storage'

const THEME_STORAGE_KEY = 'mazeloot_theme'

type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(storage.get<Theme>(THEME_STORAGE_KEY) || 'dark')
  const systemTheme = ref<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  // Get effective theme (resolves 'system' to actual theme)
  const effectiveTheme = ref<'light' | 'dark'>(
    theme.value === 'system' ? systemTheme.value : theme.value
  )

  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    systemTheme.value = e.matches ? 'dark' : 'light'
    if (theme.value === 'system') {
      effectiveTheme.value = systemTheme.value
      applyTheme(effectiveTheme.value)
    }
  }

  mediaQuery.addEventListener('change', handleSystemThemeChange)

  // Apply theme to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
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

  // Set theme
  const setTheme = (newTheme: Theme) => {
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
    effectiveTheme,
    setTheme,
    toggleTheme,
  }
})
