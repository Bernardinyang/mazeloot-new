import { toast } from '@/utils/toast'

export function useReplacePhotoFlow({
  mediaToReplace,
  showReplacePhotoModal,
  isReplacingPhoto,
  selectedWatermark,
  watermarkStore,
  mediaApi,
  mediaItems,
  createThumbnail,
  getFileBaseName,
  fileToDataURL,
  applyWatermarkToImage,
  description,
} = {}) {
  const handleReplacePhoto = item => {
    if (item.type !== 'image') {
      toast.error('Invalid media type', {
        description,
      })
      return
    }
    mediaToReplace.value = item
    showReplacePhotoModal.value = true
  }

  const handleCancelReplacePhoto = () => {
    showReplacePhotoModal.value = false
    mediaToReplace.value = null
  }

  const handleReplacePhotoFileSelect = async event => {
    const input = event.target
    const files = input.files
    if (!files || files.length === 0 || !mediaToReplace.value) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description,
      })
      return
    }

    isReplacingPhoto.value = true
    try {
      // Get watermark if selected
      let watermark
      if (selectedWatermark.value && selectedWatermark.value !== 'none') {
        try {
          watermark = await watermarkStore.fetchWatermark(selectedWatermark.value)
        } catch (error) {
          console.error('Failed to fetch watermark:', error)
        }
      }

      // Create thumbnail
      const thumbnail = await createThumbnail(file, watermark || undefined)
      const initialUrl = thumbnail

      // Update media item
      await mediaApi.updateMedia(mediaToReplace.value.id, {
        url: initialUrl,
        thumbnail: thumbnail,
        title: mediaToReplace.value.title,
      })

      // Update local item
      const index = mediaItems.value.findIndex(m => m.id === mediaToReplace.value?.id)
      if (index !== -1) {
        mediaItems.value[index].url = initialUrl
        mediaItems.value[index].thumbnail = thumbnail
        mediaItems.value[index].title = getFileBaseName(file.name) || mediaToReplace.value.title
      }

      const replaceId = mediaToReplace.value.id

      // Process full image with watermark in background
      ;(async () => {
        try {
          let fullUrl = await fileToDataURL(file)
          if (watermark) {
            fullUrl = await applyWatermarkToImage(fullUrl, watermark)
          }

          // Update the media item with the full image URL
          const updateIndex = mediaItems.value.findIndex(m => m.id === replaceId)
          if (updateIndex !== -1) {
            mediaItems.value[updateIndex].url = fullUrl
            await mediaApi.updateMedia(replaceId, {
              url: fullUrl,
            })
          }
        } catch (error) {
          console.error('Error processing full image:', error)
        }
      })()

      showReplacePhotoModal.value = false
      mediaToReplace.value = null

      toast.success('Photo replaced', {
        description,
      })
    } catch (error) {
      console.error('Failed to replace photo:', error)
      toast.error('Failed to replace photo', {
        description,
      })
    } finally {
      isReplacingPhoto.value = false
    }
  }

  return {
    handleReplacePhoto,
    handleCancelReplacePhoto,
    handleReplacePhotoFileSelect,
  }
}
