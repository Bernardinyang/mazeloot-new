import { toast } from '@/utils/toast'

/**
 * Media list + set-count logic extracted from Photos.vue.
 * Keeps behavior identical; just centralizes the async flows.
 */
export function useCollectionMediaItemsFlow({
  collection,
  selectedSetId,
  mediaItems,
  isLoadingMedia,
  isUpdatingSetCounts,
  mediaApi,
  galleryStore,
  mediaSetsSidebar,
  mediaSets,
  description = '',
}) {
  const updateSetCounts = async targetCollectionId => {
    const collectionId = targetCollectionId || collection.value?.id
    if (!collectionId) return

    isUpdatingSetCounts.value = true
    try {
      // Fetch all media for the collection
      const allMedia = await mediaApi.fetchCollectionMedia(collectionId)

      // If updating for current collection, update local sets
      if (collectionId === collection.value?.id) {
        mediaSets.value.forEach(set => {
          const count = allMedia.filter(m => m.setId === set.id).length
          set.count = count
        })
        // Save updated counts
        await mediaSetsSidebar.saveMediaSets()
      } else {
        // If updating for another collection, update that collection's sets in the store
        const targetCollection = galleryStore.collections.find(c => c.id === collectionId)
        if (targetCollection && targetCollection.mediaSets) {
          const updatedSets = targetCollection.mediaSets.map(set => {
            const count = allMedia.filter(m => m.setId === set.id).length
            return { ...set, count }
          })

          await galleryStore.updateCollection(collectionId, {
            mediaSets: updatedSets,
          })
        }
      }
    } catch (error) {
      // Keep existing behavior: log only
    } finally {
      isUpdatingSetCounts.value = false
    }
  }

  const loadMediaItems = async () => {
    if (!collection.value) {
      mediaItems.value = []
      return
    }

    isLoadingMedia.value = true
    try {
      const items = await mediaApi.fetchCollectionMedia(
        collection.value.id,
        selectedSetId.value || undefined
      )
      mediaItems.value = items
    } catch (error) {
      toast.error('Failed to load media', {
        description:
          error instanceof Error ? error.message : description || 'An unknown error occurred',
      })
    } finally {
      isLoadingMedia.value = false
    }
  }

  return { updateSetCounts, loadMediaItems }
}
