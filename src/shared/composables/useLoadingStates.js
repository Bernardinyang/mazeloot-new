/**
 * Composable for managing multiple loading states
 * Consolidates loading state management for better organization
 */
import { ref } from 'vue'

export function useLoadingStates(keys, initialValue = false) {
  const states = {}

  keys.forEach(key => {
    states[key] = ref(initialValue)
  })

  const setLoading = (key, value) => {
    if (states[key]) {
      states[key].value = value
    }
  }

  const setAllLoading = value => {
    keys.forEach(key => {
      if (states[key]) {
        states[key].value = value
      }
    })
  }

  const isLoading = key => {
    return states[key]?.value ?? false
  }

  return {
    states,
    setLoading,
    setAllLoading,
    isLoading,
  }
}
