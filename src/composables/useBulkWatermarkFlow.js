import { toast } from '@/utils/toast'

export function useBulkWatermarkFlow({
  selectedMediaIds,
  showBulkWatermarkModal,
  selectedBulkWatermark,
  isBulkWatermarkLoading,
  watermarkStore,
  mediaApi,
  mediaItems,
  applyWatermarkToImage,
  description,
} = {}) {
  const handleBulkWatermark = () => {
    if (selectedMediaIds.value.size === 0) return
    selectedBulkWatermark.value = 'none'
    showBulkWatermarkModal.value = true
  }

  const handleCancelBulkWatermark = () => {
    showBulkWatermarkModal.value = false
    selectedBulkWatermark.value = 'none'
  }

  const handleConfirmBulkWatermark = async () => {
    if (selectedMediaIds.value.size === 0) return

    isBulkWatermarkLoading.value = true
    try {
      const ids = Array.from(selectedMediaIds.value)
      const items = mediaItems.value.filter(m => ids.includes(m.id))
      const imageItems = items.filter(item => item.type === 'image')

      if (imageItems.length === 0) {
        toast.error('No images selected', {
          description,
        })
        return
      }

      let watermark
      if (selectedBulkWatermark.value && selectedBulkWatermark.value !== 'none') {
        try {
          watermark = await watermarkStore.fetchWatermark(selectedBulkWatermark.value)
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

      let successCount = 0
      let errorCount = 0

      for (const item of imageItems) {
        try {
          // Get original image URL (before watermark)
          let originalImageUrl = item.originalUrl || item.url
          let imageUrl = originalImageUrl

          // If the URL is not a data URL, we need to fetch it first
          if (!imageUrl || !imageUrl.startsWith('data:')) {
            try {
              const urlToFetch = imageUrl || item.thumbnail || ''
              if (urlToFetch) {
                const response = await fetch(urlToFetch, { mode: 'cors' })
                if (response.ok) {
                  const blob = await response.blob()
                  imageUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result)
                    reader.onerror = reject
                    reader.readAsDataURL(blob)
                  })
                }
              }
            } catch (error) {
              console.warn('Could not fetch image for watermarking:', item.id, error)
              if (!imageUrl) {
                imageUrl = item.thumbnail || item.url || ''
              }
            }
          }

          if (!imageUrl) {
            errorCount++
            continue
          }

          if (!watermark && item.originalUrl) {
            // Removing watermark - restore original
            await mediaApi.updateMedia(item.id, {
              url: item.originalUrl,
              originalUrl: undefined,
              thumbnail: undefined,
            })

            const index = mediaItems.value.findIndex(m => m.id === item.id)
            if (index !== -1) {
              mediaItems.value[index].url = item.originalUrl
              mediaItems.value[index].originalUrl = undefined
              mediaItems.value[index].thumbnail = undefined
            }
            successCount++
          } else if (watermark) {
            // Applying watermark
            const watermarkedUrl = await applyWatermarkToImage(imageUrl, watermark)
            const originalUrlToStore = item.originalUrl || originalImageUrl

            await mediaApi.updateMedia(item.id, {
              url: watermarkedUrl,
              originalUrl: originalUrlToStore,
            })

            const index = mediaItems.value.findIndex(m => m.id === item.id)
            if (index !== -1) {
              mediaItems.value[index].url = watermarkedUrl
              mediaItems.value[index].originalUrl = originalUrlToStore

              // Update thumbnail with watermark
              try {
                const watermarkedThumbnail = await applyWatermarkToImage(imageUrl, watermark)
                mediaItems.value[index].thumbnail = watermarkedThumbnail
                await mediaApi.updateMedia(item.id, {
                  thumbnail: watermarkedThumbnail,
                })
              } catch (error) {
                console.warn('Could not create watermarked thumbnail:', item.id, error)
              }
            }
            successCount++
          } else {
            // No watermark selected and no existing watermark - skip
            successCount++
          }
        } catch (error) {
          console.error('Failed to apply watermark to item:', item.id, error)
          errorCount++
        }
      }

      showBulkWatermarkModal.value = false
      selectedBulkWatermark.value = 'none'

      if (errorCount > 0) {
        toast.warning('Watermark applied with errors', {
          description: `${errorCount} failed.`,
        })
      } else {
        toast.success('Watermark applied', {
          description,
        })
      }
    } catch (error) {
      console.error('Failed to apply bulk watermark:', error)
      toast.error('Failed to apply watermark', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      isBulkWatermarkLoading.value = false
    }
  }

  return {
    handleBulkWatermark,
    handleCancelBulkWatermark,
    handleConfirmBulkWatermark,
  }
}
