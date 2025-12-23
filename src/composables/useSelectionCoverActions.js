import { toast } from '@/utils/toast'
import { storeBlob, getFile } from '@/utils/fileStorage'

export function useSelectionCoverActions({
  selection,
  selectionStore,
  createThumbnailFromDataURL,
  isUpdatingCover, // Optional flag to prevent watch from overwriting
  description,
} = {}) {
  const handleSetAsCover = async item => {
    if (!selection.value) return

    try {
      if (isUpdatingCover) {
        isUpdatingCover.value = true
      }

      let thumbnailPath = item.thumbnail || item.url
      let imagePath = item.url

      if (item.url && item.url.startsWith('file://')) {
        try {
          const imageBlob = await getFile(item.url)
          // Store as cover image
          imagePath = await storeBlob(imageBlob, `cover_${item.id}.jpg`, {
            id: `cover_${selection.value.id}_image`,
          })

          if (item.thumbnail && item.thumbnail.startsWith('file://')) {
            const thumbBlob = await getFile(item.thumbnail)
            thumbnailPath = await storeBlob(thumbBlob, `cover_thumb_${item.id}.jpg`, {
              id: `cover_${selection.value.id}_thumb`,
            })
          } else if (item.thumbnail && item.thumbnail.startsWith('data:')) {
            // Convert data URL thumbnail to IndexedDB
            const thumbResponse = await fetch(item.thumbnail)
            const thumbBlob = await thumbResponse.blob()
            thumbnailPath = await storeBlob(thumbBlob, `cover_thumb_${item.id}.jpg`, {
              id: `cover_${selection.value.id}_thumb`,
            })
          } else {
            // Use the same image for thumbnail if no separate thumbnail
            thumbnailPath = imagePath
          }
        } catch (error) {
          // Fallback to using the paths directly
          thumbnailPath = item.thumbnail || item.url
          imagePath = item.url
        }
      } else if (item.url && item.url.startsWith('data:')) {
        try {
          const response = await fetch(item.url)
          const blob = await response.blob()
          imagePath = await storeBlob(blob, `cover_${item.id}.jpg`, {
            id: `cover_${selection.value.id}_image`,
          })

          if (item.thumbnail && item.thumbnail.startsWith('data:')) {
            const thumbResponse = await fetch(item.thumbnail)
            const thumbBlob = await thumbResponse.blob()
            thumbnailPath = await storeBlob(thumbBlob, `cover_thumb_${item.id}.jpg`, {
              id: `cover_${selection.value.id}_thumb`,
            })
          } else {
            thumbnailPath = imagePath
          }
        } catch (error) {
          // If storage fails, use data URL as fallback (may cause quota issues)
          thumbnailPath = item.thumbnail || item.url
          imagePath = item.url
        }
      }

      await selectionStore.updateSelection(selection.value.id, {
        thumbnail: thumbnailPath,
        image: imagePath,
      })

      // This ensures we have the correct file:// paths
      if (selection.value) {
        selection.value.thumbnail = thumbnailPath
        selection.value.image = imagePath
        // Force reactivity by creating a new object reference
        selection.value = { ...selection.value }
      }

      // Clear flag after update completes
      if (isUpdatingCover) {
        setTimeout(() => {
          isUpdatingCover.value = false
        }, 500)
      }

      toast.success('Cover updated', {
        description: description || 'The cover photo has been updated.',
      })
    } catch (error) {
      toast.error('Failed to set cover', {
        description: description || 'An error occurred while updating the cover photo.',
      })
    }
  }

  const handleCoverImageUpload = async imageUrl => {
    if (!selection.value) return

    try {
      const thumbnailDataUrl = await createThumbnailFromDataURL(imageUrl)

      // Store both image and thumbnail in IndexedDB
      let imagePath = imageUrl
      let thumbnailPath = thumbnailDataUrl

      // If imageUrl is a data URL, store it in IndexedDB
      if (imageUrl && imageUrl.startsWith('data:')) {
        try {
          const response = await fetch(imageUrl)
          const blob = await response.blob()
          imagePath = await storeBlob(blob, `cover_upload_${selection.value.id}.jpg`, {
            id: `cover_${selection.value.id}_image`,
          })
        } catch (error) {
          // Fallback to data URL
        }
      }

      // Store thumbnail in IndexedDB
      if (thumbnailDataUrl && thumbnailDataUrl.startsWith('data:')) {
        try {
          const thumbResponse = await fetch(thumbnailDataUrl)
          const thumbBlob = await thumbResponse.blob()
          thumbnailPath = await storeBlob(thumbBlob, `cover_thumb_${selection.value.id}.jpg`, {
            id: `cover_${selection.value.id}_thumb`,
          })
        } catch (error) {
          // Fallback to data URL
        }
      }

      const updatedSelection = await selectionStore.updateSelection(selection.value.id, {
        thumbnail: thumbnailPath,
        image: imagePath,
      })

      if (selection.value) {
        selection.value.thumbnail = thumbnailPath
        selection.value.image = imagePath
      }

      // Also update if we got an updated selection from the store
      if (updatedSelection) {
        if (selection.value) {
          selection.value.thumbnail = updatedSelection.thumbnail || thumbnailPath
          selection.value.image = updatedSelection.image || imagePath
        }
      }

      toast.success('Cover updated', {
        description: description || 'The cover photo has been updated.',
      })
    } catch (error) {
      toast.error('Failed to upload cover image', {
        description: description || 'An error occurred while uploading the cover photo.',
      })
    }
  }

  return {
    handleSetAsCover,
    handleCoverImageUpload,
  }
}
