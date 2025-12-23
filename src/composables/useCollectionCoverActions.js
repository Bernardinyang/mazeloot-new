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
      // For videos, use file.url (the actual video URL), for images use item.url
      const mediaUrl = item.file?.url || item.url
      const thumbnailUrl =
        item.thumbnail || item.thumbnailUrl || item.file?.thumbnailUrl || item.url

      await galleryStore.updateCollection(collection.value.id, {
        thumbnail: thumbnailUrl,
        image: mediaUrl,
      })
      toast.success('Cover updated', {
        description,
      })
    } catch (error) {
      toast.error('Failed to set cover', {
        description,
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
