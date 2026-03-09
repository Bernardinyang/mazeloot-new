/**
 * Composable for managing breadcrumb separator preferences
 */

import { ref } from 'vue'

const DEFAULT_SEPARATOR = 'chevron-right'

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

export function useBreadcrumbSeparator(initialSeparator = null) {
  const separator = ref(initialSeparator || DEFAULT_SEPARATOR)
  const customSeparator = ref(null)

  const setSeparator = newSeparator => {
    if (BREADCRUMB_SEPARATORS[newSeparator] || newSeparator === 'custom') {
      separator.value = newSeparator
    } else {
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
