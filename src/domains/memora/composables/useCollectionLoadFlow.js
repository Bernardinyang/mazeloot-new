import { nextTick, watch } from 'vue'
import { toast } from '@/shared/utils/toast'

export function useCollectionLoadFlow({
  collection,
  collectionStatus,
  eventDate,
  selectedPresetId,
  selectedWatermark,
  mediaSets,
  selectedSetId,
  sortedMediaSets,
  isLoading,
  isSavingPreset,
  isSavingWatermark,
  route,
  router,
  galleryStore,
  watermarkStore,
  updateSetCounts,
  loadMediaItems,
  mediaSetsSidebar,
  mediaItems,
} = {}) {
  const loadCollection = async (collectionUuid) => {
    if (!collectionUuid) {
      toast.error('Collection ID is required')
      await router.push({ name: 'manageCollections' })
      return
    }

    isLoading.value = true
    try {
      // Always fetch collection by UUID from API (force refresh from backend)
      const collectionData = await galleryStore.fetchCollection(collectionUuid, true)
      if (!collectionData) {
        toast.error('Collection not found', {
          description: 'The collection you are looking for does not exist.',
        })
        await router.push({ name: 'collections' })
        return
      }

      collection.value = collectionData
      // Map 'active' status to 'published' for display
      collectionStatus.value = collectionData.status === 'active' ? 'published' : 'draft'

      // Backend returns eventDate (extracted from settings)
      const dateString = collectionData.eventDate || collectionData.date
      if (dateString) {
        try {
          const dateValue = typeof dateString === 'string' ? new Date(dateString) : dateString
          if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
            eventDate.value = dateValue
          } else if (typeof dateString === 'string') {
            // Try parsing string
            const parsed = new Date(dateString)
            if (!isNaN(parsed.getTime())) {
              eventDate.value = parsed
            } else {
              eventDate.value = null
            }
          } else {
            eventDate.value = null
          }
        } catch (error) {
          eventDate.value = null
        }
      } else {
        eventDate.value = null
      }

      const presetId = collectionData.presetId
      selectedPresetId.value = presetId != null ? String(presetId) : 'none'

      const watermarkId = collectionData.watermarkId
      selectedWatermark.value = watermarkId != null ? String(watermarkId) : 'none'

      // Load media sets from collection data
      const mappedMediaSets = collectionData.mediaSets && collectionData.mediaSets.length > 0
        ? collectionData.mediaSets.map(set => ({
            id: set.id,
            name: set.name,
            description: set.description,
            count: set.count,
            order: set.order,
          }))
        : []

      // Set context in sidebar store and always fetch fresh media sets from API
      // This will auto-select the first set if none is selected
      if (mediaSetsSidebar) {
        await mediaSetsSidebar.setContext(collectionData.id || '', null)
        await nextTick()
        // Update local mediaSets from store after setContext
        if (mediaSetsSidebar.mediaSets && mediaSetsSidebar.mediaSets.length > 0) {
          mediaSets.value = mediaSetsSidebar.mediaSets
        } else {
          mediaSets.value = mappedMediaSets
        }
      } else {
        mediaSets.value = mappedMediaSets
      }

      // Determine which set to select: route query > store auto-selection > first set
      let targetSetId = null
      const availableSets = mediaSetsSidebar?.mediaSets || mediaSets.value
      if (route.query.setId) {
        const setIdFromRoute = route.query.setId
        const matchingSet = availableSets.find(s => s.id === setIdFromRoute)
        if (matchingSet) {
          targetSetId = setIdFromRoute
        }
      }
      
      // If no route query, use store's auto-selected set or first set
      if (!targetSetId && availableSets.length > 0) {
        if (mediaSetsSidebar) {
          targetSetId = mediaSetsSidebar.selectedSetId || availableSets[0].id
        } else {
          targetSetId = selectedSetId.value || availableSets[0].id
        }
      }

      // Ensure the target set is selected
      if (targetSetId) {
        if (mediaSetsSidebar && mediaSetsSidebar.selectedSetId !== targetSetId) {
          mediaSetsSidebar.handleSelectSet(targetSetId)
        } else if (!mediaSetsSidebar && selectedSetId.value !== targetSetId) {
          selectedSetId.value = targetSetId
        }
      }

      // Load media items for the selected set (if one is selected)
      // Wait for selection to be set
      await nextTick()
      const currentSelectedSetId = mediaSetsSidebar?.selectedSetId ?? selectedSetId.value
      if (currentSelectedSetId && loadMediaItems) {
        await loadMediaItems()
      } else if (!currentSelectedSetId) {
        // Clear media if no set selected
        if (mediaItems) {
          mediaItems.value = []
        }
      }
    } catch (error) {
      console.error('Failed to load collection:', error)
      toast.error('Failed to load collection', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
      router.push({ name: 'manageCollections' })
    } finally {
      isLoading.value = false
    }
  }

  watch(
    () => galleryStore.collections,
    collections => {
      if (collection.value) {
        const updatedCollection = collections.find(c => c.id === collection.value?.id)
        if (updatedCollection && updatedCollection.id === collection.value.id) {
          collection.value = { ...collection.value, ...updatedCollection }
          if (!isSavingPreset.value) {
            const newPresetId = updatedCollection.presetId
            selectedPresetId.value = newPresetId != null ? String(newPresetId) : 'none'
          }
          if (!isSavingWatermark.value) {
            const newWatermarkId = updatedCollection.watermarkId
            selectedWatermark.value = newWatermarkId != null ? String(newWatermarkId) : 'none'
          }
          collectionStatus.value = updatedCollection.status === 'active' ? 'published' : 'draft'

          if (updatedCollection.mediaSets) {
            mediaSets.value = updatedCollection.mediaSets.map(set => ({
              id: set.id,
              name: set.name,
              description: set.description,
              count: set.count,
              order: set.order,
            }))
          }
        }
      }
    },
    { deep: true }
  )

  return {
    loadCollection,
  }
}
