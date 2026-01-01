import { nextTick } from 'vue'
import { toast } from '@/utils/toast'

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function useMediaWatermarkActions({
  showWatermarkMediaModal,
  mediaToWatermark,
  selectedWatermarkForMedia,
  selectedWatermark,
  isApplyingWatermark,
  watermarkStore,
  mediaApi,
  selectionsApi,
  proofingApi,
  selectionId,
  setId,
  mediaItems,
  applyWatermarkToImage,
  description,
  reloadMedia,
  showRemoveWatermarkLoading,
} = {}) {
  const handleWatermarkMedia = item => {
    if (item.type !== 'image') {
      toast.error('Invalid media type', {
        description,
      })
      return
    }
    mediaToWatermark.value = item
    // Check if media has watermark - handle null/undefined/empty string
    const currentWatermarkUuid = item.watermarkUuid || item.watermark_uuid
    const hasWatermark = currentWatermarkUuid && currentWatermarkUuid !== null && currentWatermarkUuid !== ''
    
    // If media has watermark, show current watermark UUID, otherwise default to 'none'
    selectedWatermarkForMedia.value = hasWatermark ? currentWatermarkUuid : (selectedWatermark.value || 'none')
    showWatermarkMediaModal.value = true
  }

  const handleCancelWatermarkMedia = () => {
    showWatermarkMediaModal.value = false
    mediaToWatermark.value = null
    selectedWatermarkForMedia.value = 'none'
  }

  const handleRemoveWatermark = async item => {
    if (item.type !== 'image') {
      toast.error('Invalid media type', {
        description,
      })
      return
    }

    const selectionIdValue = typeof selectionId === 'function' ? selectionId() : selectionId?.value ?? selectionId
    const setIdValue = typeof setId === 'function' ? setId() : setId?.value ?? setId
    
    if ((!proofingApi || !proofingApi.removeWatermarkFromMedia) && (!selectionsApi || !selectionsApi.removeWatermarkFromMedia)) {
      toast.error('API not available', {
        description,
      })
      return
    }

    // Show loading modal
    if (showRemoveWatermarkLoading) {
      showRemoveWatermarkLoading.value = true
    }
    isApplyingWatermark.value = true
    try {
      let updatedMedia
      if (proofingApi && proofingApi.removeWatermarkFromMedia) {
        updatedMedia = await proofingApi.removeWatermarkFromMedia(selectionIdValue, setIdValue, item.id)
      } else {
        updatedMedia = await selectionsApi.removeWatermarkFromMedia(selectionIdValue, setIdValue, item.id)
      }
      
      const index = mediaItems.value.findIndex(m => m.id === item.id)
      if (index !== -1 && updatedMedia?.data) {
        const timestamp = Date.now()
        
        // Update file URLs with cache buster
        if (updatedMedia.data.file?.url) {
          const url = updatedMedia.data.file.url
          const separator = url.includes('?') ? '&' : '?'
          updatedMedia.data.file.url = `${url}${separator}_t=${timestamp}`
        }
        if (updatedMedia.data.largeImageUrl) {
          const url = updatedMedia.data.largeImageUrl
          const separator = url.includes('?') ? '&' : '?'
          updatedMedia.data.largeImageUrl = `${url}${separator}_t=${timestamp}`
        }
        if (updatedMedia.data.thumbnailUrl) {
          const url = updatedMedia.data.thumbnailUrl
          const separator = url.includes('?') ? '&' : '?'
          updatedMedia.data.thumbnailUrl = `${url}${separator}_t=${timestamp}`
        }
        
        // Ensure watermarkUuid is cleared
        updatedMedia.data.watermarkUuid = null
        updatedMedia.data.watermark_uuid = null
        
        // Replace entire media item with refreshed data
        mediaItems.value.splice(index, 1, { ...updatedMedia.data })
        await nextTick()
      }

      // Reload media to ensure UI is updated
      if (reloadMedia && typeof reloadMedia === 'function') {
        await reloadMedia()
      }

      toast.success('Watermark removed', {
        description,
      })
    } catch (error) {
      toast.error('Failed to remove watermark', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      isApplyingWatermark.value = false
      // Hide loading modal
      if (showRemoveWatermarkLoading) {
        showRemoveWatermarkLoading.value = false
      }
    }
  }

  const handleConfirmWatermarkMedia = async () => {
    if (!mediaToWatermark.value) return

    isApplyingWatermark.value = true
    try {
      const currentWatermarkUuid = mediaToWatermark.value.watermarkUuid || mediaToWatermark.value.watermark_uuid
      const hasExistingWatermark = !!(currentWatermarkUuid && currentWatermarkUuid !== null && currentWatermarkUuid !== '')
      const isRemoving = selectedWatermarkForMedia.value === 'none'
      
      // If removing watermark
      if (isRemoving && hasExistingWatermark) {
        const selectionIdValue = typeof selectionId === 'function' ? selectionId() : selectionId?.value ?? selectionId
        const setIdValue = typeof setId === 'function' ? setId() : setId?.value ?? setId
        
        if (!selectionsApi || !selectionIdValue || !setIdValue) {
          toast.error('API not available', {
            description,
          })
          return
        }

        const updatedMedia = await selectionsApi.removeWatermarkFromMedia(selectionIdValue, setIdValue, mediaToWatermark.value.id)
        
        const index = mediaItems.value.findIndex(m => m.id === mediaToWatermark.value?.id)
        if (index !== -1 && updatedMedia?.data) {
          const timestamp = Date.now()
          
          // Update file URL with cache buster
          if (updatedMedia.data.file?.url) {
            const url = updatedMedia.data.file.url
            const separator = url.includes('?') ? '&' : '?'
            updatedMedia.data.file.url = `${url}${separator}_t=${timestamp}`
          }
          
          // Update largeImageUrl with cache buster
          if (updatedMedia.data.largeImageUrl) {
            const url = updatedMedia.data.largeImageUrl
            const separator = url.includes('?') ? '&' : '?'
            updatedMedia.data.largeImageUrl = `${url}${separator}_t=${timestamp}`
          }
          
          // Update thumbnailUrl with cache buster
          if (updatedMedia.data.thumbnailUrl) {
            const url = updatedMedia.data.thumbnailUrl
            const separator = url.includes('?') ? '&' : '?'
            updatedMedia.data.thumbnailUrl = `${url}${separator}_t=${timestamp}`
          }
          
          // Ensure watermarkUuid is cleared
          updatedMedia.data.watermarkUuid = null
          updatedMedia.data.watermark_uuid = null
          
        // Replace the entire media item with refreshed data
        mediaItems.value.splice(index, 1, { ...updatedMedia.data })
        
        // Force Vue reactivity by triggering a re-render
        await nextTick()
      }

      showWatermarkMediaModal.value = false
      mediaToWatermark.value = null
      selectedWatermarkForMedia.value = 'none'

      // Reload media to ensure UI is updated
      if (reloadMedia && typeof reloadMedia === 'function') {
        await reloadMedia()
      }

      toast.success('Watermark removed', {
        description,
      })
      return
      }

      // Applying/updating watermark
      if (!selectedWatermarkForMedia.value || selectedWatermarkForMedia.value === 'none') {
        toast.error('Please select a watermark', {
          description,
        })
        isApplyingWatermark.value = false
        return
      }

      let watermark
      try {
        watermark = await watermarkStore.fetchWatermark(selectedWatermarkForMedia.value)
        if (!watermark) {
          throw new Error('Watermark not found')
        }
      } catch (error) {
        toast.error('Failed to fetch watermark', {
          description,
        })
        isApplyingWatermark.value = false
        return
      }

      const selectionIdValue = typeof selectionId === 'function' ? selectionId() : selectionId?.value ?? selectionId
      const setIdValue = typeof setId === 'function' ? setId() : setId?.value ?? setId
      
      let updatedMedia
      if (proofingApi && proofingApi.applyWatermarkToMedia) {
        updatedMedia = await proofingApi.applyWatermarkToMedia(
          selectionIdValue,
          setIdValue,
          mediaToWatermark.value.id,
          watermark.id
        )
      } else if (selectionsApi && selectionsApi.applyWatermarkToMedia) {
        updatedMedia = await selectionsApi.applyWatermarkToMedia(
          selectionIdValue,
          setIdValue,
          mediaToWatermark.value.id,
          watermark.id
        )
      } else {
        toast.error('API not available', {
          description,
        })
        isApplyingWatermark.value = false
        return
      }

      const index = mediaItems.value.findIndex(m => m.id === mediaToWatermark.value?.id)
      if (index !== -1 && updatedMedia?.data) {
        // Force complete replacement of media item to ensure all URLs are updated
        const timestamp = Date.now()
        
        // Update file URL with cache buster
        if (updatedMedia.data.file?.url) {
          const url = updatedMedia.data.file.url
          const separator = url.includes('?') ? '&' : '?'
          updatedMedia.data.file.url = `${url}${separator}_t=${timestamp}`
        }
        
        // Update largeImageUrl with cache buster
        if (updatedMedia.data.largeImageUrl) {
          const url = updatedMedia.data.largeImageUrl
          const separator = url.includes('?') ? '&' : '?'
          updatedMedia.data.largeImageUrl = `${url}${separator}_t=${timestamp}`
        }
        
        // Update thumbnailUrl with cache buster
        if (updatedMedia.data.thumbnailUrl) {
          const url = updatedMedia.data.thumbnailUrl
          const separator = url.includes('?') ? '&' : '?'
          updatedMedia.data.thumbnailUrl = `${url}${separator}_t=${timestamp}`
        }
        
        // Ensure watermarkUuid is set
        updatedMedia.data.watermarkUuid = watermark.id
        updatedMedia.data.watermark_uuid = watermark.id
        
        // Replace the entire media item with refreshed data
        // Use spread operator to create new object for Vue reactivity
        mediaItems.value.splice(index, 1, { ...updatedMedia.data })
        
        // Force Vue reactivity by triggering a re-render
        await nextTick()
      }

      showWatermarkMediaModal.value = false
      mediaToWatermark.value = null
      selectedWatermarkForMedia.value = 'none'

      // Reload media to ensure UI is updated
      if (reloadMedia && typeof reloadMedia === 'function') {
        await reloadMedia()
      }

      toast.success(hasExistingWatermark ? 'Watermark updated' : 'Watermark applied', {
        description,
      })
    } catch (error) {
      toast.error('Failed to apply watermark', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      isApplyingWatermark.value = false
    }
  }

  return {
    handleWatermarkMedia,
    handleCancelWatermarkMedia,
    handleRemoveWatermark,
    handleConfirmWatermarkMedia,
  }
}
