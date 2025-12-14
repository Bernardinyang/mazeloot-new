import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'collection-sidebar-collapsed'

/**
 * Composable to manage sidebar collapse state with localStorage persistence
 */
export function useSidebarCollapse() {
  // Initialize from localStorage or default to false
  const getInitialState = (): boolean => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : false
  }

  const isSidebarCollapsed = ref<boolean>(getInitialState())

  // Save to localStorage whenever the state changes
  watch(isSidebarCollapsed, newValue => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue))
    }
  })

  return {
    isSidebarCollapsed,
  }
}
