import { ref } from 'vue'
import { toast } from '@/utils/toast'
import { useSelectionStore } from '@/stores/selection'
import { useSelectionsApi } from '@/api/selections'

/**
 * Reusable composable for selection actions
 * Handles copy filenames, reset limit, and other selection operations
 */
export function useSelectionActions(selectionId) {
  const selectionStore = useSelectionStore()
  const selectionsApi = useSelectionsApi()

  const isCopyingFilenames = ref(false)
  const isResettingLimit = ref(false)

  /**
   * Copy filenames for a selection (optionally filtered by set)
   * @param {string|null} setId - Optional set ID to filter by set
   * @returns {Promise<string[]>} Array of filenames
   */
  const copyFilenames = async (setId = null) => {
    if (!selectionId.value) {
      throw new Error('Selection ID is required')
    }

    isCopyingFilenames.value = true
    try {
      const result = await selectionsApi.getSelectedFilenames(selectionId.value, setId)
      const filenames = result.filenames || []

      if (filenames.length === 0) {
        toast.info('No files selected', {
          description: setId ? 'No selected files in this set.' : 'Please select some media first.',
        })
        return []
      }

      // Copy to clipboard
      const text = filenames.join('\n')
      await navigator.clipboard.writeText(text)

      toast.success('Filenames copied', {
        description: `${filenames.length} filename(s) copied to clipboard.`,
      })

      return filenames
    } catch (error) {
      const errorMessage = error?.message || 'Failed to copy filenames'
      toast.error('Failed to copy filenames', {
        description: errorMessage,
      })
      throw error
    } finally {
      isCopyingFilenames.value = false
    }
  }

  /**
   * Reset selection limit
   * @returns {Promise<Object>} Updated selection
   */
  const resetSelectionLimit = async () => {
    if (!selectionId.value) {
      throw new Error('Selection ID is required')
    }

    isResettingLimit.value = true
    try {
      const updatedSelection = await selectionsApi.resetSelectionLimit(selectionId.value)

      toast.success('Selection limit reset', {
        description: 'Clients can now add more selections to this selection.',
      })

      return updatedSelection
    } catch (error) {
      const errorMessage = error?.message || 'Failed to reset selection limit'
      toast.error('Failed to reset limit', {
        description: errorMessage,
      })
      throw error
    } finally {
      isResettingLimit.value = false
    }
  }

  return {
    copyFilenames,
    resetSelectionLimit,
    isCopyingFilenames,
    isResettingLimit,
  }
}
