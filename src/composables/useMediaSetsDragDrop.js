export function useMediaSetsDragDrop({
  mediaSets,
  sortedMediaSets,
  saveMediaSets,
  draggedSetId,
  draggedSetIndex,
  dragOverIndex,
} = {}) {
  const handleSetDragStart = (e, setId, index) => {
    draggedSetId.value = setId
    draggedSetIndex.value = index
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', setId)
    }
  }

  const handleSetDragEnd = () => {
    draggedSetId.value = null
    draggedSetIndex.value = null
    dragOverIndex.value = null
  }

  const handleSetDragOver = e => {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }
    dragOverIndex.value = index
  }

  const handleSetDragLeave = () => {
    dragOverIndex.value = null
  }

  const handleSetDrop = async (e, dropIndex) => {
    e.preventDefault()
    dragOverIndex.value = null

    if (draggedSetIndex.value === null || draggedSetId.value === null) return

    const draggedIndex = draggedSetIndex.value

    if (draggedIndex === dropIndex) return

    // Reorder the sets using sortedMediaSets order
    const sorted = [...sortedMediaSets.value]
    const [draggedSet] = sorted.splice(draggedIndex, 1)
    sorted.splice(dropIndex, 0, draggedSet)

    sorted.forEach((set, index) => {
      set.order = index
    })

    mediaSets.value.forEach(set => {
      const updated = sorted.find(s => s.id === set.id)
      if (updated) {
        set.order = updated.order ?? 0
      }
    })

    await saveMediaSets()

    draggedSetId.value = null
    draggedSetIndex.value = null
  }

  return {
    handleSetDragStart,
    handleSetDragEnd,
    handleSetDragOver,
    handleSetDragLeave,
    handleSetDrop,
  }
}
