import { watch } from 'vue'
import { toast } from '@/utils/toast'

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

      mediaSets.value = mappedMediaSets

      // Set context in sidebar store to ensure media sets are visible
      if (mediaSetsSidebar) {
        mediaSetsSidebar.setContext(collectionData.id || '', mappedMediaSets)
      }

      // Check if setId is in route query and set it first (like SelectionDetail)
      if (route.query.setId) {
        const setIdFromRoute = route.query.setId
        if (mediaSets.value.some(s => s.id === setIdFromRoute)) {
          if (mediaSetsSidebar) {
            mediaSetsSidebar.handleSelectSet(setIdFromRoute)
          } else {
            selectedSetId.value = setIdFromRoute
          }
        }
      }

      // Auto-select first set if none selected and sets exist
      if (!selectedSetId.value && mediaSets.value.length > 0) {
        const firstSetId = sortedMediaSets.value[0]?.id || mediaSets.value[0].id
        if (mediaSetsSidebar) {
          mediaSetsSidebar.handleSelectSet(firstSetId)
        } else {
          selectedSetId.value = firstSetId
        }
      }

      // Load media items for the selected set (if one is selected)
      if (selectedSetId.value && loadMediaItems) {
        await loadMediaItems()
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
