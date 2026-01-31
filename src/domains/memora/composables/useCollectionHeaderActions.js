import { nextTick } from 'vue'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { publicCollectionUrl } from '@/shared/utils/memoraPublicUrls'

export function useCollectionHeaderActions({
  collection,
  collectionStatus,
  isSavingStatus,
  eventDate,
  isDatePickerOpen,
  isSavingDate,
  selectedPresetId,
  isPresetPopoverOpen,
  isSavingPreset,
  selectedWatermark,
  isWatermarkPopoverOpen,
  isSavingWatermark,
  isEditingName,
  editingName,
  isSavingName,
  isBlurringName,
  nameInputRef,
  galleryStore,
  route,
  router,
  description,
} = {}) {
  const handlePreview = () => {
    const collectionId =
      route.params.uuid || route.params.id || collection.value?.id || collection.value?.uuid

    if (!collectionId) {
      console.error('No collection ID found for preview')
      return
    }

    const domain = collection.value?.brandingDomain || collection.value?.projectId || collection.value?.project_uuid
    const path = publicCollectionUrl(domain, collectionId)
    if (!path) return
    const url = `${window.location.origin}${path}?preview=true`
    window.open(url, '_blank')
  }

  const handlePublish = async () => {
    if (!collection.value) return

    isSavingStatus.value = true
    try {
      await galleryStore.updateCollection(collection.value.id, {
        status: 'active',
      })
      collectionStatus.value = 'published'
      collection.value.status = 'active'
      toast.success('Collection published', {
        description,
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to publish collection')
      toast.error(errorMessage)
    } finally {
      isSavingStatus.value = false
    }
  }

  const handleUnpublish = async () => {
    if (!collection.value) return

    isSavingStatus.value = true
    try {
      await galleryStore.updateCollection(collection.value.id, {
        status: 'archived',
      })
      collectionStatus.value = 'archived'
      collection.value.status = 'archived'
      toast.success('Collection unpublished', {
        description,
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to unpublish collection')
      toast.error(errorMessage)
    } finally {
      isSavingStatus.value = false
    }
  }

  const handleStatusChange = async newStatus => {
    if (!collection.value || !newStatus) return

    isSavingStatus.value = true
    try {
      // Map frontend status to API status
      const apiStatus =
        newStatus === 'published' ? 'active' : newStatus === 'archived' ? 'archived' : 'draft'
      await galleryStore.updateCollection(collection.value.id, {
        status: apiStatus,
      })
      collection.value.status = apiStatus
      collectionStatus.value = newStatus
      // Auto-save
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to update status')
      toast.error(errorMessage)
      // Revert status on error
      const currentStatus = collection.value.status
      if (currentStatus === 'active') {
        collectionStatus.value = 'published'
      } else if (currentStatus === 'archived') {
        collectionStatus.value = 'archived'
      } else {
        collectionStatus.value = 'draft'
      }
    } finally {
      isSavingStatus.value = false
    }
  }

  const handleDateChange = async newDate => {
    if (!collection.value) return

    // Close the popover
    isDatePickerOpen.value = false

    isSavingDate.value = true
    try {
      // Convert Date to ISO string for storage, or null to clear
      const dateString = newDate instanceof Date ? newDate.toISOString() : null

      const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
        eventDate: dateString,
      })

      if (updatedCollection) {
        collection.value = updatedCollection
        const dateFromCollection = updatedCollection.eventDate || updatedCollection.date
        if (dateFromCollection) {
          const parsedDate =
            typeof dateFromCollection === 'string'
              ? new Date(dateFromCollection)
              : dateFromCollection
          if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
            eventDate.value = parsedDate
          } else {
            eventDate.value = newDate
          }
        } else {
          eventDate.value = newDate
        }
      } else {
        eventDate.value = newDate
      }

      // Auto-save
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to save event date')
      toast.error(errorMessage)
      // Revert to original date on error
      const originalDate = collection.value?.eventDate || collection.value?.date
      if (originalDate) {
        eventDate.value = typeof originalDate === 'string' ? new Date(originalDate) : originalDate
      } else {
        eventDate.value = null
      }
    } finally {
      isSavingDate.value = false
    }
  }

  const handlePresetChange = async presetId => {
    if (!collection.value) return

    const presetIdStr = String(presetId)
    // Normalize current value for comparison (handle undefined/null)
    const currentPresetId = selectedPresetId.value || 'none'

    // Only skip if the value is truly the same (but still allow setting to 'none' explicitly)
    if (presetIdStr === currentPresetId && presetIdStr !== 'none') {
      isPresetPopoverOpen.value = false
      return
    }

    selectedPresetId.value = presetIdStr

    isSavingPreset.value = true
    isPresetPopoverOpen.value = false
    try {
      const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
        presetId: presetIdStr === 'none' ? undefined : presetIdStr,
      })

      if (updatedCollection) {
        collection.value = updatedCollection
        // Ensure the value is set correctly (handle null/undefined'none')
        const newPresetId = updatedCollection.presetId
        selectedPresetId.value = newPresetId != null ? String(newPresetId) : 'none'
      } else {
        collection.value.presetId = presetIdStr === 'none' ? undefined : presetIdStr
        // Value already set above
      }

      // Auto-save
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to update preset')
      toast.error(errorMessage)
      // Revert on error
      const errorPresetId = collection.value?.presetId
      selectedPresetId.value = errorPresetId != null ? String(errorPresetId) : 'none'
    } finally {
      isSavingPreset.value = false
    }
  }

  const handleWatermarkChange = async watermarkId => {
    if (!collection.value) return

    const watermarkIdStr = String(watermarkId)
    // Normalize current value for comparison (handle undefined/null)
    const currentWatermarkId = selectedWatermark.value || 'none'

    // Only skip if the value is truly the same (but still allow setting to 'none' explicitly)
    if (watermarkIdStr === currentWatermarkId && watermarkIdStr !== 'none') {
      isWatermarkPopoverOpen.value = false
      return
    }

    selectedWatermark.value = watermarkIdStr

    isSavingWatermark.value = true
    isWatermarkPopoverOpen.value = false
    try {
      const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
        watermarkId: watermarkIdStr === 'none' ? undefined : watermarkIdStr,
      })

      if (updatedCollection) {
        collection.value = updatedCollection
        // Ensure the value is set correctly (handle null/undefined'none')
        const newWatermarkId = updatedCollection.watermarkId
        selectedWatermark.value = newWatermarkId != null ? String(newWatermarkId) : 'none'
      } else {
        collection.value.watermarkId = watermarkIdStr === 'none' ? undefined : watermarkIdStr
        // Value already set above
      }

      // Auto-save
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to update watermark')
      toast.error(errorMessage)
      // Revert on error
      const errorWatermarkId = collection.value?.watermarkId
      selectedWatermark.value = errorWatermarkId != null ? String(errorWatermarkId) : 'none'
    } finally {
      isSavingWatermark.value = false
    }
  }

  const formatDate = date => {
    if (!date) return ''
    const dateObj = date instanceof Date ? date : new Date(date)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(dateObj)
  }

  const startEditingName = () => {
    if (!collection.value) return
    isEditingName.value = true
    editingName.value = collection.value.name
    nextTick(() => {
      nameInputRef.value?.focus()
      nameInputRef.value?.select()
    })
  }

  const cancelEditingName = () => {
    isEditingName.value = false
    editingName.value = ''
  }

  const handleNameBlur = () => {
    if (isBlurringName.value || isSavingName.value) return
    isBlurringName.value = true
    setTimeout(() => {
      if (isBlurringName.value && !isSavingName.value) {
        // Only save if name has actually changed
        const trimmedName = editingName.value.trim()
        if (trimmedName && trimmedName !== collection.value?.name) {
          saveName()
        } else if (!trimmedName) {
          // If empty, just cancel without showing error
          cancelEditingName()
        } else {
          // If unchanged, just cancel
          cancelEditingName()
        }
        isBlurringName.value = false
      }
    }, 200)
  }

  const saveName = async () => {
    if (!collection.value) return

    const trimmedName = editingName.value.trim()

    if (!trimmedName) {
      toast.error('Name required', {
        description,
      })
      editingName.value = collection.value.name
      cancelEditingName()
      return
    }

    if (trimmedName === collection.value.name) {
      cancelEditingName()
      return
    }

    isSavingName.value = true
    isBlurringName.value = false

    try {
      const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
        name: trimmedName,
      })
      if (updatedCollection) {
        collection.value = updatedCollection
      } else {
        // Fallback
        collection.value.name = trimmedName
      }
      cancelEditingName()
      // Auto-save
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to update name')
      toast.error(errorMessage)
      // Revert editing name to original
      editingName.value = collection.value.name
      cancelEditingName()
    } finally {
      isSavingName.value = false
    }
  }

  return {
    handlePreview,
    handlePublish,
    handleUnpublish,
    handleStatusChange,
    handleDateChange,
    handlePresetChange,
    handleWatermarkChange,
    formatDate,
    startEditingName,
    cancelEditingName,
    handleNameBlur,
    saveName,
  }
}
