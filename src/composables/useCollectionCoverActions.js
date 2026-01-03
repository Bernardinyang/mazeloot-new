import { toast } from '@/utils/toast'

export function useCollectionCoverActions({
  collection,
  galleryStore,
  createThumbnailFromDataURL,
  description,
} = {}) {
  const handleSetAsCover = async item => {
    if (!collection.value) return

    try {
      // Get media URL - try multiple possible locations
      const mediaUrl = item.url || item.file?.url || item.imageUrl
      if (!mediaUrl) {
        toast.error('Invalid media item', {
          description: 'The selected media item does not have a valid URL.',
        })
        return
      }

      // Get thumbnail URL - prefer thumbnail, fallback to media URL
      const thumbnailUrl = item.thumbnail || item.thumbnailUrl || item.file?.thumbnailUrl || mediaUrl

      const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
        thumbnail: thumbnailUrl,
        image: mediaUrl,
      })
      
      // Update the collection ref with the updated data
      if (updatedCollection) {
        collection.value = updatedCollection
      } else {
        // Fallback optimistic update
        collection.value = {
          ...collection.value,
          thumbnail: thumbnailUrl,
          image: mediaUrl,
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
