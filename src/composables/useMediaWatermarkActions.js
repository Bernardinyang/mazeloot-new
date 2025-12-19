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
  mediaItems,
  applyWatermarkToImage,
  description,
} = {}) {
  const handleWatermarkMedia = item => {
    if (item.type !== 'image') {
      toast.error('Invalid media type', {
        description,
      })
      return
    }
    mediaToWatermark.value = item
    // Check if image already has a watermark (has originalUrl stored)
    // If it does, we're editing/removing, otherwise we're adding
    selectedWatermarkForMedia.value = item.originalUrl ? 'none' : selectedWatermark.value || 'none'
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

    if (!item.originalUrl) {
      toast.info('No watermark', {
        description,
      })
      return
    }

    isApplyingWatermark.value = true
    try {
      // Restore original image
      await mediaApi.updateMedia(item.id, {
        url: item.originalUrl,
        originalUrl: undefined, // Clear originalUrl since we're removing watermark
        thumbnail: undefined, // Remove watermarked thumbnail
      })

      // Update local item
      const index = mediaItems.value.findIndex(m => m.id === item.id)
      if (index !== -1) {
        mediaItems.value[index].url = item.originalUrl
        mediaItems.value[index].originalUrl = undefined
        mediaItems.value[index].thumbnail = undefined
      }

      toast.success('Watermark removed', {
        description,
      })
    } catch (error) {
      console.error('Failed to remove watermark:', error)
      toast.error('Failed to remove watermark', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      isApplyingWatermark.value = false
    }
  }

  const handleConfirmWatermarkMedia = async () => {
    if (!mediaToWatermark.value) return

    isApplyingWatermark.value = true
    try {
      let watermark
      if (selectedWatermarkForMedia.value && selectedWatermarkForMedia.value !== 'none') {
        try {
          watermark = await watermarkStore.fetchWatermark(selectedWatermarkForMedia.value)
          if (!watermark) {
            throw new Error('Watermark not found')
          }
        } catch (error) {
          console.error('Failed to fetch watermark:', error)
          toast.error('Failed to fetch watermark', {
            description,
          })
          return
        }
      }

      // If removing watermark and we have originalUrl, restore it
      if (!watermark && mediaToWatermark.value.originalUrl) {
        // Restore original image
        await mediaApi.updateMedia(mediaToWatermark.value.id, {
          url: mediaToWatermark.value.originalUrl,
          originalUrl: undefined, // Clear originalUrl since we're removing watermark
          thumbnail: undefined, // Remove watermarked thumbnail
        })

        // Update local item
        const index = mediaItems.value.findIndex(m => m.id === mediaToWatermark.value?.id)
        if (index !== -1) {
          mediaItems.value[index].url = mediaToWatermark.value.originalUrl
          mediaItems.value[index].originalUrl = undefined
          mediaItems.value[index].thumbnail = undefined
        }

        showWatermarkMediaModal.value = false
        mediaToWatermark.value = null
        selectedWatermarkForMedia.value = 'none'

        toast.success('Watermark removed', {
          description,
        })
        return
      }

      // Applying watermark - need to get the original image
      // Use originalUrl if available, otherwise current URL is the original
      const originalImageUrl = mediaToWatermark.value.originalUrl || mediaToWatermark.value.url
      let imageUrl = originalImageUrl

      // If the URL is not a data URL, we need to fetch it first
      if (!imageUrl || !imageUrl.startsWith('data:')) {
        try {
          // Try to fetch the image and convert to data URL
          const urlToFetch = imageUrl || mediaToWatermark.value.thumbnail || ''
          if (urlToFetch) {
            const response = await fetch(urlToFetch, { mode: 'cors' })
            if (response.ok) {
              const blob = await response.blob()
              imageUrl = await blobToDataURL(blob)
            }
          }
        } catch (error) {
          console.warn('Could not fetch image for watermarking, using existing URL:', error)
          // If fetch fails, try to use the URL directly
          if (!imageUrl) {
            imageUrl = mediaToWatermark.value.thumbnail || mediaToWatermark.value.url || ''
          }
        }
      }

      if (!imageUrl) {
        throw new Error('No image URL available for watermarking')
      }

      // Apply watermark to the original image
      if (!watermark) {
        throw new Error('Watermark is required when applying')
      }

      const watermarkedUrl = await applyWatermarkToImage(imageUrl, watermark)

      // Store original URL if not already stored
      const originalUrlToStore = mediaToWatermark.value.originalUrl || originalImageUrl

      // Update media item with watermarked URL and preserve original
      await mediaApi.updateMedia(mediaToWatermark.value.id, {
        url: watermarkedUrl,
        originalUrl: originalUrlToStore, // Store original for future removal
      })

      // Update local item
      const index = mediaItems.value.findIndex(m => m.id === mediaToWatermark.value?.id)
      if (index !== -1) {
        mediaItems.value[index].url = watermarkedUrl
        mediaItems.value[index].originalUrl = originalUrlToStore

        // Update thumbnail with watermark
        try {
          const watermarkedThumbnail = await applyWatermarkToImage(imageUrl, watermark)
          mediaItems.value[index].thumbnail = watermarkedThumbnail
          await mediaApi.updateMedia(mediaToWatermark.value.id, {
            thumbnail: watermarkedThumbnail,
          })
        } catch (error) {
          console.warn('Could not create watermarked thumbnail:', error)
        }
      }

      showWatermarkMediaModal.value = false
      mediaToWatermark.value = null
      selectedWatermarkForMedia.value = 'none'

      toast.success('Watermark applied', {
        description,
      })
    } catch (error) {
      console.error('Failed to apply watermark:', error)
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
