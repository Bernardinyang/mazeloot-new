/**
 * Selection Workflow Composable
 * Handles selection phase operations
 */

import { toast } from 'vue-sonner'
import { useMediaApi } from '@/api/media'
import { useSelectionStore } from '@/stores/selection'

export function useSelectionWorkflow({ selectionId, loadMediaItems } = {}) {
  const mediaApi = useMediaApi()
  const selectionStore = useSelectionStore()

  // Helper to get selectionId value (handles refs, computed, functions, and plain values)
  const getSelectionId = () => {
    if (!selectionId) return null
    if (typeof selectionId === 'function') return selectionId()
    if (typeof selectionId === 'object' && selectionId !== null && 'value' in selectionId)
      return selectionId.value
    return selectionId
  }

  /**
   * Upload raw media to selection phase
   */
  const uploadRawMedia = async (files, setId) => {
    try {
      const selectionIdValue = getSelectionId()

      if (!selectionIdValue) {
        throw new Error('Selection ID is required')
      }

      const uploaded = []

      for (const file of files) {
        // Determine media type
        const type = file.type.startsWith('image/') ? 'image' : 'video'

        // Create media item (ensure plain object, no refs)
        const mediaData = {
          phase: 'selection',
          phaseId: selectionIdValue,
          setId: setId,
          type: type,
          title: file.name,
          url: URL.createObjectURL(file), // In production, upload to server first
          thumbnail: type === 'image' ? URL.createObjectURL(file) : null,
          isSelected: false,
          order: 0,
        }

        const media = await mediaApi.addMedia(null, mediaData)
        uploaded.push(media)
      }

      if (loadMediaItems) {
        await loadMediaItems()
      }

      toast.success('Media uploaded', {
        description: `${uploaded.length} file(s) uploaded successfully.`,
      })

      return uploaded
    } catch (error) {
      console.error('Failed to upload media:', error)
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Failed to upload media.',
      })
      throw error
    }
  }

  /**
   * Mark media as selected (client action)
   */
  const markMediaSelected = async mediaId => {
    try {
      await mediaApi.markMediaSelected(mediaId)

      if (loadMediaItems) {
        await loadMediaItems()
      }

      toast.success('Media selected')
    } catch (error) {
      console.error('Failed to mark media as selected:', error)
      toast.error('Failed to select media', {
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      })
      throw error
    }
  }

  /**
   * Complete selection phase
   */
  const completeSelection = async () => {
    try {
      const selectionIdValue = getSelectionId()

      if (!selectionIdValue) {
        throw new Error('Selection ID is required')
      }

      await selectionStore.completeSelection(selectionIdValue)

      toast.success('Selection completed', {
        description:
          'Unselected media will be deleted after 30 days. You can recover them before then.',
      })
    } catch (error) {
      console.error('Failed to complete selection:', error)
      toast.error('Failed to complete selection', {
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      })
      throw error
    }
  }

  /**
   * Recover deleted media (within 30 days)
   */
  const recoverDeletedMedia = async () => {
    try {
      const selectionIdValue = getSelectionId()

      if (!selectionIdValue) {
        throw new Error('Selection ID is required')
      }

      const recovered = await selectionStore.recoverMedia(selectionIdValue)

      if (loadMediaItems) {
        await loadMediaItems()
      }

      toast.success('Media recovered', {
        description: `${recovered.length} file(s) recovered successfully.`,
      })

      return recovered
    } catch (error) {
      console.error('Failed to recover media:', error)
      toast.error('Recovery failed', {
        description: error instanceof Error ? error.message : 'Failed to recover media.',
      })
      throw error
    }
  }

  /**
   * Copy selected filenames for editing
   */
  const copySelectedFilenames = async () => {
    try {
      const selectionIdValue = getSelectionId()

      if (!selectionIdValue) {
        throw new Error('Selection ID is required')
      }

      const filenames = await selectionStore.copyFilenames(selectionIdValue)

      if (filenames.length === 0) {
        toast.info('No files selected', {
          description: 'Please select some media first.',
        })
        return
      }

      // Copy to clipboard
      const text = filenames.join('\n')
      await navigator.clipboard.writeText(text)

      toast.success('Filenames copied', {
        description: `${filenames.length} filename(s) copied to clipboard.`,
      })

      return filenames
    } catch (error) {
      console.error('Failed to copy filenames:', error)
      toast.error('Failed to copy filenames', {
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      })
      throw error
    }
  }

  return {
    uploadRawMedia,
    markMediaSelected,
    completeSelection,
    recoverDeletedMedia,
    copySelectedFilenames,
  }
}
