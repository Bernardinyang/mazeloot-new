import { useActionHistoryStore } from '@/shared/stores/actionHistory'

/**
 * Composable wrapper for the global action history store
 * Provides a consistent API across the application
 *
 * @param {number} maxHistorySize - Maximum number of actions to keep in history (default: 5)
 * @returns {Object} Action history store instance
 */
export function useActionHistory(maxHistorySize = 5) {
  const actionHistory = useActionHistoryStore()

  if (maxHistorySize !== actionHistory.maxHistorySize) {
    actionHistory.setMaxHistorySize(maxHistorySize)
  }

  return actionHistory
}
