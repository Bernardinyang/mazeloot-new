import { nextTick, watch } from 'vue'
import { toast } from 'vue-sonner'
import { debounce } from '@/utils/debounce'

export function useMediaSetsFlow({
  collection,
  mediaSets,
  sortedMediaSets,
  selectedSetId,
  // modal state for create/edit
  showCreateSetModal,
  editingSetIdInModal,
  newSetName,
  newSetDescription,
  isCreatingSet,
  // inline rename state
  editingSetId,
  editingSetName,
  setNameInputRef,
  // delete confirmation composable
  itemToDelete,
  openDeleteModal,
  closeDeleteModal,
  isDeleting,
  // persistence
  isSavingSets,
  galleryStore,
  description,
} = {}) {
  const saveMediaSets = async () => {
    if (!collection.value || isSavingSets.value) return

    isSavingSets.value = true
    try {
      const setsToSave = mediaSets.value.map(set => ({
        id: set.id,
        name: set.name,
        description: set.description,
        count: set.count,
        order: set.order,
      }))

      await galleryStore.updateCollection(collection.value.id, {
        mediaSets: setsToSave,
      })

      // Update local collection ref
      if (collection.value) {
        collection.value.mediaSets = setsToSave
      }
    } catch (error) {
      console.error('Failed to save media sets:', error)
      toast.error('Failed to save media sets', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      isSavingSets.value = false
    }
  }

  const handleAddSet = () => {
    editingSetIdInModal.value = null
    newSetName.value = ''
    newSetDescription.value = ''
    showCreateSetModal.value = true
  }

  const handleEditSet = setId => {
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set) return

    editingSetIdInModal.value = setId
    newSetName.value = set.name
    newSetDescription.value = set.description || ''
    showCreateSetModal.value = true
  }

  const handleCreateSet = async () => {
    const trimmedName = newSetName.value.trim()
    if (!trimmedName) {
      toast.error('Name required', {
        description,
      })
      return
    }

    isCreatingSet.value = true
    try {
      if (editingSetIdInModal.value) {
        // Update existing set
        const set = mediaSets.value.find(s => s.id === editingSetIdInModal.value)
        if (set) {
          set.name = trimmedName
          set.description = newSetDescription.value.trim() || undefined
          await saveMediaSets()

          showCreateSetModal.value = false
          editingSetIdInModal.value = null
          newSetName.value = ''
          newSetDescription.value = ''

          toast.success('Set updated', {
            description,
          })
        }
      } else {
        // Create new set
        const maxOrder = Math.max(...mediaSets.value.map(s => s.order ?? 0), -1)
        const newSet = {
          id: `set-${Date.now()}`,
          name: newSetName.value.trim(),
          description: newSetDescription.value?.trim() || undefined,
          count: 0,
          order: maxOrder + 1,
        }
        mediaSets.value.push(newSet)
        selectedSetId.value = newSet.id
        await saveMediaSets()

        showCreateSetModal.value = false
        newSetName.value = ''
        newSetDescription.value = ''

        toast.success('Set created', {
          description,
        })
      }
    } catch (error) {
      toast.error(editingSetIdInModal.value ? 'Failed to update set' : 'Failed to create set', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      isCreatingSet.value = false
    }
  }

  const handleCancelCreateSet = () => {
    showCreateSetModal.value = false
    editingSetIdInModal.value = null
    newSetName.value = ''
    newSetDescription.value = ''
  }

  const startSetNameEdit = setId => {
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set) return
    editingSetId.value = setId
    editingSetName.value = set.name
    nextTick(() => {
      setNameInputRef.value?.focus()
      setNameInputRef.value?.select()
    })
  }

  // Auto-save set name with debounce
  const autoSaveSetName = debounce((setId, newName) => {
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set || set.name === newName) return

    set.name = newName
    saveMediaSets()
  }, 500)

  const saveSetName = setId => {
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set) return

    const trimmedName = editingSetName.value.trim()
    if (!trimmedName) {
      editingSetName.value = set.name
      editingSetId.value = null
      return
    }

    if (trimmedName !== set.name) {
      set.name = trimmedName
      saveMediaSets()
    }
    editingSetId.value = null
  }

  // Watch for set name changes while editing (auto-save)
  watch(editingSetName, newName => {
    if (editingSetId.value && newName.trim()) {
      autoSaveSetName(editingSetId.value, newName.trim())
    }
  })

  const cancelSetNameEdit = () => {
    editingSetId.value = null
    editingSetName.value = ''
  }

  const handleDeleteSet = setId => {
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set) return

    if (mediaSets.value.length === 1) {
      toast.error('Cannot delete', {
        description,
      })
      return
    }

    openDeleteModal(set)
  }

  const handleConfirmDeleteSet = async () => {
    if (!itemToDelete.value) return

    const set = itemToDelete.value
    const index = mediaSets.value.findIndex(s => s.id === set.id)

    console.log(mediaSets.value)

    if (index !== -1) {
      isDeleting.value = true
      try {
        mediaSets.value.splice(index, 1)
        if (selectedSetId.value === set.id) {
          selectedSetId.value = mediaSets.value[0]?.id || null
        }
        await saveMediaSets()
        closeDeleteModal()
        toast.success('Set deleted', {
          description,
        })
      } catch (error) {
        toast.error('Failed to delete set', {
          description,
        })
      } finally {
        isDeleting.value = false
      }
    }
  }

  return {
    saveMediaSets,
    handleAddSet,
    handleEditSet,
    handleCreateSet,
    handleCancelCreateSet,
    startSetNameEdit,
    autoSaveSetName,
    saveSetName,
    cancelSetNameEdit,
    handleDeleteSet,
    handleConfirmDeleteSet,
  }
}
