import { onMounted, watch } from 'vue'
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
} = {}) {
  const loadCollection = async () => {
    const uuid = route.params.uuid
    if (!uuid) {
      toast.error('Collection ID is required')
      await router.push({ name: 'manageCollections' })
      return
    }

    isLoading.value = true
    try {
      // First ensure collections are loaded
      await galleryStore.fetchCollections()

      const collectionData = await galleryStore.fetchCollection(uuid)
      if (!collectionData) {
        console.error('Collection not found:', uuid)
        toast.error('Collection not found', {
          description: 'The collection you are looking for does not exist.',
        })
        await router.push({ name: 'collections' })
        return
      }

      // Update local collection reference
      collection.value = collectionData
      // Map 'active' status to 'published' for display
      collectionStatus.value = collectionData.status === 'active' ? 'published' : 'draft'

      // Set event date if available (as Date object for datepicker, but stored)
      // API stores 'date' field
      const dateString = collectionData.date
      if (dateString) {
        try {
          const dateValue = typeof dateString === 'string' ? new Date(dateString) : dateString
          // Check if date is valid
          if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
            eventDate.value = dateValue
          } else if (typeof dateString === 'string') {
            // Try parsing string
            const parsed = new Date(dateString)
            if (!isNaN(parsed.getTime())) {
              eventDate.value = parsed
            } else {
              console.warn('Invalid date value:', dateString)
              eventDate.value = null
            }
          } else {
            eventDate.value = null
          }
        } catch (error) {
          console.error('Error parsing date:', error, dateString)
          eventDate.value = null
        }
      } else {
        eventDate.value = null
      }

      // Set preset if available (assuming collection has presetId field)
      const presetId = collectionData.presetId
      selectedPresetId.value = presetId != null ? String(presetId) : 'none'

      // Set watermark if available (assuming collection has watermarkId field)
      const watermarkId = collectionData.watermarkId
      selectedWatermark.value = watermarkId != null ? String(watermarkId) : 'none'

      // Load media sets from collection data
      if (collectionData.mediaSets && collectionData.mediaSets.length > 0) {
        mediaSets.value = collectionData.mediaSets.map(set => ({
          id: set.id,
          name: set.name,
          description: set.description,
          count: set.count,
          order: set.order,
        }))
      } else {
        // Initialize with default "Highlights" set if no sets exist
        mediaSets.value = [{ id: 'highlights', name: 'Highlights', count: 0, order: 0 }]
      }

      // Set default selected set
      if (mediaSets.value.length > 0) {
        selectedSetId.value = sortedMediaSets.value[0]?.id || mediaSets.value[0].id
      }

      // Update set counts based on actual media
      await updateSetCounts()
    } catch (error) {
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
          // Update local collection ref with latest data from store
          collection.value = { ...collection.value, ...updatedCollection }
          // Update local state to reflect changes (only if not currently saving to avoid race conditions)
          if (!isSavingPreset.value) {
            const newPresetId = updatedCollection.presetId
            selectedPresetId.value = newPresetId != null ? String(newPresetId) : 'none'
          }
          if (!isSavingWatermark.value) {
            const newWatermarkId = updatedCollection.watermarkId
            selectedWatermark.value = newWatermarkId != null ? String(newWatermarkId) : 'none'
          }
          // Update status if changed
          collectionStatus.value = updatedCollection.status === 'active' ? 'published' : 'draft'

          // Update media sets if they changed
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

  onMounted(async () => {
    await loadCollection()
    // loadCollection sets selectedSetId, which will trigger loadMediaItems via watch
    // But we also call it explicitly here to ensure media loads even if watch doesn't fire
    if (selectedSetId.value) {
      await loadMediaItems()
    }
    try {
      await watermarkStore.fetchWatermarks()
    } catch (error) {
      console.error('Failed to fetch watermarks:', error)
    }
  })

  return {
    loadCollection,
  }
}
