/**
 * Composable for managing multiple loading states
 * Consolidates loading state management for better organization
 */
import { ref, type Ref } from 'vue'

export interface LoadingStates {
  [key: string]: Ref<boolean>
}

export function useLoadingStates(keys: string[], initialValue: boolean = false) {
  const states: LoadingStates = {}

  keys.forEach(key => {
    states[key] = ref(initialValue)
  })

  const setLoading = (key: string, value: boolean) => {
    if (states[key]) {
      states[key].value = value
    }
  }

  const setAllLoading = (value: boolean) => {
    keys.forEach(key => {
      if (states[key]) {
        states[key].value = value
      }
    })
  }

  const isLoading = (key: string): boolean => {
    return states[key]?.value ?? false
  }

  return {
    states,
    setLoading,
    setAllLoading,
    isLoading,
  }
}
