import { toast } from '@/shared/utils/toast'

export function useCollectionCoverActions({
  collection,
  galleryStore,
  createThumbnailFromDataURL,
  description,
} = {}) {
  const handleSetAsCover = async item => {
    if (!collection.value) return

    try {
      // Get original/best quality URL - prioritize original file URL
      const originalUrl = item.file?.url || item.file?.variants?.original || item.file?.variants?.large || item.url || item.imageUrl
      if (!originalUrl) {
        toast.error('Invalid media item', {
          description: 'The selected media item does not have a valid URL.',
        })
        return
      }

      // Use original URL for both thumbnail and image (best quality)
      const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
        thumbnail: originalUrl,
        image: originalUrl,
      })
      
      // Update the collection ref with the updated data
      if (updatedCollection) {
        collection.value = updatedCollection
      } else {
        // Fallback optimistic update
        collection.value = {
          ...collection.value,
          thumbnail: originalUrl,
          image: originalUrl,
        }
      }
      toast.success('Cover updated', {
        description,
      })
    } catch (error) {
      console.error('Failed to set cover:', error)
      toast.error('Failed to set cover', {
        description: error?.message || description || 'An error occurred while setting the cover photo.',
      })
    }
  }

  const handleCoverImageUpload = async imageUrl => {
    if (!collection.value) return

    try {
      const thumbnail = await createThumbnailFromDataURL(imageUrl)

      const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
        thumbnail,
        image: imageUrl,
      })

      if (updatedCollection) {
        collection.value = updatedCollection
      } else {
        // Fallback
        collection.value.thumbnail = thumbnail || imageUrl
        collection.value.image = imageUrl
      }

      toast.success('Cover updated', {
        description,
      })
    } catch (error) {
      toast.error('Failed to upload cover image', {
        description,
      })
    }
  }

  return {
    handleSetAsCover,
    handleCoverImageUpload,
  }
}
