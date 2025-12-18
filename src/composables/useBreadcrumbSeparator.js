/**
 * Composable for managing breadcrumb separator preferences
 * Allows users to set and persist their preferred separator
 */

import { ref, watch } from 'vue'

const STORAGE_KEY = 'mazeloot_breadcrumb_separator'
const DEFAULT_SEPARATOR = 'chevron-right'

// Available separator types
export const BREADCRUMB_SEPARATORS = {
  'chevron-right': {
    label: 'Chevron Right (>)',
    value: 'chevron-right',
    icon: 'ChevronRight',
  },
  'chevron-left': {
    label: 'Chevron Left (<)',
    value: 'chevron-left',
    icon: 'ChevronLeft',
  },
  slash: {
    label: 'Slash (/)',
    value: 'slash',
    icon: 'Slash',
  },
  dot: {
    label: 'Dot (•)',
    value: 'dot',
    icon: 'Circle',
  },
}

/**
 * Get separator from localStorage or return default
 */
const getStoredSeparator = () => {
  if (typeof window === 'undefined') return DEFAULT_SEPARATOR
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored && BREADCRUMB_SEPARATORS[stored] ? stored : DEFAULT_SEPARATOR
  } catch {
    return DEFAULT_SEPARATOR
  }
}

/**
 * Save separator to localStorage
 */
const saveSeparator = separator => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, separator)
  } catch (error) {
    console.warn('Failed to save breadcrumb separator preference:', error)
  }
}

/**
 * Composable for breadcrumb separator management
 */
export function useBreadcrumbSeparator(initialSeparator = null) {
  const separator = ref(initialSeparator || getStoredSeparator())
  const customSeparator = ref(null)

  // Watch for changes and persist to localStorage
  watch(
    separator,
    newValue => {
      if (newValue && newValue !== 'custom') {
        saveSeparator(newValue)
      }
    },
    { immediate: false }
  )

  const setSeparator = newSeparator => {
    if (BREADCRUMB_SEPARATORS[newSeparator] || newSeparator === 'custom') {
      separator.value = newSeparator
    } else {
      console.warn(`Invalid separator: ${newSeparator}. Using default.`)
      separator.value = DEFAULT_SEPARATOR
    }
  }

  const setCustomSeparator = custom => {
    customSeparator.value = custom
    separator.value = 'custom'
  }

  return {
    separator,
    customSeparator,
    setSeparator,
    setCustomSeparator,
    availableSeparators: Object.values(BREADCRUMB_SEPARATORS),
  }
}
