import { ref } from 'vue'
import { toast } from '@/utils/toast'
import { useProofingStore } from '@/stores/proofing'
import { useProofingApi } from '@/api/proofing'

/**
 * Reusable composable for proofing actions
 * Handles copy filenames and other proofing operations
 */
export function useProofingActions(proofingId) {
  const proofingStore = useProofingStore()
  const proofingApi = useProofingApi()

  const isCopyingFilenames = ref(false)

  /**
   * Copy filenames for a proofing (optionally filtered by set)
   * For proofing, we copy approved/completed media filenames
   * @param {string|null} setId - Optional set ID to filter by set
   * @returns {Promise<string[]>} Array of filenames
   */
  const copyFilenames = async (setId = null) => {
    if (!proofingId.value) {
      throw new Error('Proofing ID is required')
    }

    isCopyingFilenames.value = true
    try {
      // For proofing, we get approved/completed media filenames
      // This would need to be implemented in the API
      const result = await proofingApi.getApprovedFilenames(proofingId.value, setId)
      const filenames = result.filenames || []

      if (filenames.length === 0) {
        toast.info('No files approved', {
          description: setId
            ? 'No approved files in this set.'
            : 'Please approve some media first.',
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

  return {
    copyFilenames,
    isCopyingFilenames,
  }
}
