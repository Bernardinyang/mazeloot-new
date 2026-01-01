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
  bulkWatermarkProgress,
  isBulkWatermarkCancelled,
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
          toast.error('Failed to fetch watermark', {
            description,
          })
          return
        }
      }

      let successCount = 0
      let errorCount = 0
      const totalItems = imageItems.length
      
      // Initialize progress
      if (bulkWatermarkProgress) {
        bulkWatermarkProgress.value = {
          current: 0,
          total: totalItems,
          percentage: 0,
          currentItem: null,
        }
      }
      
      if (isBulkWatermarkCancelled) {
        isBulkWatermarkCancelled.value = false
      }

      for (let i = 0; i < imageItems.length; i++) {
        // Check for cancellation
        if (isBulkWatermarkCancelled && isBulkWatermarkCancelled.value) {
          toast.info('Watermark operation cancelled', { description: '' })
          break
        }
        
        const item = imageItems[i]
        
        // Update progress
        if (bulkWatermarkProgress) {
          bulkWatermarkProgress.value = {
            current: i,
            total: totalItems,
            percentage: Math.round((i / totalItems) * 100),
            currentItem: item.file?.filename || item.filename || `Item ${i + 1}`,
          }
        }
        try {
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

              try {
                const watermarkedThumbnail = await applyWatermarkToImage(imageUrl, watermark)
                mediaItems.value[index].thumbnail = watermarkedThumbnail
                await mediaApi.updateMedia(item.id, {
                  thumbnail: watermarkedThumbnail,
                })
              } catch (error) {}
            }
            successCount++
          } else {
            // No watermark selected and no existing watermark - skip
            successCount++
          }
        } catch (error) {
          errorCount++
        }
      }

      // Final progress update
      if (bulkWatermarkProgress) {
        bulkWatermarkProgress.value = {
          current: totalItems,
          total: totalItems,
          percentage: 100,
          currentItem: null,
        }
      }
      
      showBulkWatermarkModal.value = false
      selectedBulkWatermark.value = 'none'

      if (isBulkWatermarkCancelled && isBulkWatermarkCancelled.value) {
        toast.info('Watermark operation cancelled', {
          description: `${successCount} of ${totalItems} items processed.`,
        })
      } else if (errorCount > 0) {
        toast.warning('Watermark applied with errors', {
          description: `${successCount} succeeded, ${errorCount} failed.`,
        })
      } else {
        toast.success('Watermark applied', {
          description: `Successfully applied to ${successCount} item${successCount !== 1 ? 's' : ''}.`,
        })
      }
    } catch (error) {
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
