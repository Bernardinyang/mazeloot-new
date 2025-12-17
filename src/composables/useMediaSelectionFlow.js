import { toast } from 'vue-sonner'

export function useMediaSelectionFlow({ selectedMediaIds, sortedMediaItems, description } = {}) {
  const handleToggleMediaSelection = mediaId => {
    // Create a new Set to ensure reactivity
    const newSet = new Set(selectedMediaIds.value)
    if (newSet.has(mediaId)) {
      newSet.delete(mediaId)
    } else {
      newSet.add(mediaId)
    }
    selectedMediaIds.value = newSet
  }

  const handleToggleSelectAll = () => {
    const allItemIds = sortedMediaItems.value.map(item => item.id)

    if (allItemIds.length === 0) {
      toast.info('No items', {
        description: 'There are no items to select.',
      })
      return
    }

    // Check if all items are selected by comparing sizes and verifying all IDs are in the set
    const allSelected =
      selectedMediaIds.value.size === allItemIds.length &&
      allItemIds.every(id => selectedMediaIds.value.has(id))

    if (allSelected) {
      // Deselect all - create new Set to trigger reactivity
      selectedMediaIds.value = new Set()
      toast.success('Deselected all', {
        description: 'All items have been deselected.',
      })
    } else {
      // Select all - create new Set with all IDs to trigger reactivity
      selectedMediaIds.value = new Set(allItemIds)
      toast.success('Selected all', {
        description: 'All items have been selected.',
      })
    }
  }

  return {
    handleToggleMediaSelection,
    handleToggleSelectAll,
  }
}
