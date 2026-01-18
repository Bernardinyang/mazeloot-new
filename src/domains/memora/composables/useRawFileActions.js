import { ref } from 'vue'
import { toast } from '@/shared/utils/toast'
import { useRawFileStore } from '@/domains/memora/stores/rawFile'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'

/**
 * Reusable composable for rawFile actions
 * Handles copy filenames, reset limit, and other rawFile operations
 */
export function useRawFileActions(rawFileId) {
  const rawFileStore = useRawFileStore()
  const rawFilesApi = useRawFilesApi()

  const isCopyingFilenames = ref(false)
  const isResettingLimit = ref(false)

  /**
   * Copy filenames for a rawFile (optionally filtered by set)
   * @param {string|null} setId - Optional set ID to filter by set
   * @returns {Promise<string[]>} Array of filenames
   */
  const copyFilenames = async (setId = null) => {
    if (!rawFileId.value) {
      throw new Error('RawFile ID is required')
    }

    isCopyingFilenames.value = true
    try {
      const result = await rawFilesApi.getSelectedFilenames(rawFileId.value, setId)
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
   * Reset rawFile limit
   * @returns {Promise<Object>} Updated rawFile
   */
  const resetRawFileLimit = async () => {
    if (!rawFileId.value) {
      throw new Error('RawFile ID is required')
    }

    isResettingLimit.value = true
    try {
      const updatedRawFile = await rawFilesApi.resetRawFileLimit(rawFileId.value)

      toast.success('RawFile limit reset', {
        description: 'Clients can now add more rawFiles to this rawFile.',
      })

      return updatedRawFile
    } catch (error) {
      const errorMessage = error?.message || 'Failed to reset rawFile limit'
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
    resetRawFileLimit,
    isCopyingFilenames,
    isResettingLimit,
  }
}
