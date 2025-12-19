import { toast } from '@/utils/toast'

export function useBulkTagFlow({
  selectedMediaIds,
  mediaItems,
  showTagModal,
  tagInput,
  existingTags,
  isBulkTagLoading,
  mediaApi,
  loadMediaItems,
  description,
} = {}) {
  const handleBulkTag = () => {
    if (selectedMediaIds.value.size === 0) return
    // Collect existing tags from selected items
    const ids = Array.from(selectedMediaIds.value)
    const items = mediaItems.value.filter(m => ids.includes(m.id))
    const allTags = new Set()
    items.forEach(item => {
      const tags = item.tags || []
      if (Array.isArray(tags)) {
        tags.forEach(tag => allTags.add(tag))
      }
    })
    existingTags.value = Array.from(allTags)
    tagInput.value = ''
    showTagModal.value = true
  }

  const handleCancelTag = () => {
    showTagModal.value = false
    tagInput.value = ''
    existingTags.value = []
  }

  const handleAddTag = () => {
    if (!tagInput.value.trim()) return
    const tags = tagInput.value
      .split(',')
      .map(t => t.trim())
      .filter(t => t)
    tags.forEach(tag => {
      if (!existingTags.value.includes(tag)) {
        existingTags.value.push(tag)
      }
    })
    tagInput.value = ''
  }

  const handleConfirmTag = async () => {
    if (selectedMediaIds.value.size === 0) return

    const ids = Array.from(selectedMediaIds.value)
    const tagsToAdd = existingTags.value

    isBulkTagLoading.value = true
    try {
      for (const id of ids) {
        const item = mediaItems.value.find(m => m.id === id)
        if (item) {
          const currentTags = item.tags || []
          const updatedTags = [...new Set([...currentTags, ...tagsToAdd])]
          await mediaApi.updateMedia(String(id), {
            ...item,
            tags: updatedTags,
          })
        }
      }

      await loadMediaItems()
      showTagModal.value = false
      tagInput.value = ''
      existingTags.value = []
      toast.success('Tags added', {
        description,
      })
    } catch (error) {
      console.error('Failed to add tags:', error)
      toast.error('Failed to add tags', {
        description,
      })
    } finally {
      isBulkTagLoading.value = false
    }
  }

  return {
    handleBulkTag,
    handleCancelTag,
    handleAddTag,
    handleConfirmTag,
  }
}
