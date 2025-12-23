import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { storage } from '@/utils/storage'

const ACTION_HISTORY_STORAGE_KEY = 'mazeloot_action_history'
const ACTION_HISTORY_INDEX_KEY = 'mazeloot_action_history_index'

/**
 * Global action history store for undo/redo functionality
 * Tracks the last N actions across the entire application
 *
 * Note: Action history persists across route changes but NOT across page reloads
 * because undo/redo functions contain closures that can't be serialized.
 * The history is cleared on page reload for safety.
 */
export const useActionHistoryStore = defineStore('actionHistory', () => {
  // Initialize from sessionStorage (only for current session)
  // We don't restore functions, just metadata for display purposes
  const history = ref([])
  const currentIndex = ref(-1)
  const maxHistorySize = ref(5)

  /**
   * Clear history on page load (since functions can't be restored)
   * This ensures we start fresh after reload
   */
  const init = () => {
    // Clear any stale data from previous session
    storage.remove(ACTION_HISTORY_STORAGE_KEY)
    storage.remove(ACTION_HISTORY_INDEX_KEY)
    history.value = []
    currentIndex.value = -1
  }

  // Initialize on store creation
  init()

  /**
   * Add an action to the history
   * @param {Object} action - Action object with { type, description, undo, redo }
   */
  const addAction = action => {
    // Remove any actions after current index (when we're in the middle of history)
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1)
    }

    // Add new action
    history.value.push({
      id: Date.now(),
      timestamp: new Date(),
      ...action,
    })

    // Limit history size
    if (history.value.length > maxHistorySize.value) {
      history.value.shift()
      currentIndex.value = history.value.length - 1
    } else {
      currentIndex.value = history.value.length - 1
    }
  }

  /**
   * Undo the last action
   */
  const undo = async () => {
    if (!canUndo.value) return false

    const action = history.value[currentIndex.value]
    try {
      await action.undo()
      currentIndex.value--
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Redo the last undone action
   */
  const redo = async () => {
    if (!canRedo.value) return false

    currentIndex.value++
    const action = history.value[currentIndex.value]
    try {
      await action.redo()
      return true
    } catch (error) {
      currentIndex.value-- // Rollback on error
      return false
    }
  }

  /**
   * Clear all history
   */
  const clearHistory = () => {
    history.value = []
    currentIndex.value = -1
  }

  /**
   * Set the maximum history size
   */
  const setMaxHistorySize = size => {
    maxHistorySize.value = size
    // Trim history if needed
    if (history.value.length > maxHistorySize.value) {
      history.value = history.value.slice(-maxHistorySize.value)
      currentIndex.value = history.value.length - 1
    }
  }

  /**
   * Get the last action description
   */
  const lastActionDescription = computed(() => {
    if (currentIndex.value >= 0 && currentIndex.value < history.value.length) {
      return history.value[currentIndex.value].description
    }
    return null
  })

  /**
   * Check if undo is possible
   */
  const canUndo = computed(() => {
    return currentIndex.value >= 0
  })

  /**
   * Check if redo is possible
   */
  const canRedo = computed(() => {
    return currentIndex.value < history.value.length - 1
  })

  /**
   * Get history items for display
   */
  const historyItems = computed(() => {
    return history.value.map((action, index) => ({
      ...action,
      isCurrent: index === currentIndex.value,
      canUndo: index <= currentIndex.value,
    }))
  })

  // Watch history changes to persist metadata (for display/debugging)
  // Note: We don't persist the undo/redo functions as they can't be serialized
  watch(
    () =>
      history.value.map(a => ({
        id: a.id,
        type: a.type,
        description: a.description,
        timestamp: a.timestamp,
      })),
    metadata => {
      // Only store metadata, not functions
      try {
        storage.set(ACTION_HISTORY_STORAGE_KEY, metadata)
        storage.set(ACTION_HISTORY_INDEX_KEY, currentIndex.value)
      } catch (error) {}
    },
    { deep: true }
  )

  return {
    history: historyItems,
    canUndo,
    canRedo,
    lastActionDescription,
    maxHistorySize,
    addAction,
    undo,
    redo,
    clearHistory,
    setMaxHistorySize,
    init,
  }
})
