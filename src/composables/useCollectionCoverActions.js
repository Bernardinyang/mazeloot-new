import { toast } from 'vue-sonner'

export function useCollectionCoverActions({
  collection,
  galleryStore,
  createThumbnailFromDataURL,
  description,
} = {}) {
  const handleSetAsCover = async item => {
    if (!collection.value) return

    try {
      await galleryStore.updateCollection(collection.value.id, {
        thumbnail: item.thumbnail || item.url,
        image: item.url,
      })
      toast.success('Cover updated', {
        description,
      })
    } catch (error) {
      console.error('Failed to set cover:', error)
      toast.error('Failed to set cover', {
        description,
      })
    }
  }

  const handleCoverImageUpload = async imageUrl => {
    if (!collection.value) return

    try {
      // Create a thumbnail from the uploaded image
      const thumbnail = await createThumbnailFromDataURL(imageUrl)

      const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
        thumbnail,
        image: imageUrl,
      })

      // Update local collection reference
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
      console.error('Failed to upload cover image:', error)
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
