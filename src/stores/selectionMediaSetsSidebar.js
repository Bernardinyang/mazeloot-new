import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { toast } from '@/utils/toast'
import { useSelectionStore } from '@/stores/selection'
import { useSelectionsApi } from '@/api/selections'
import { debounce } from '@/utils/debounce'

/**
 * Shared state for the Selection sidebar "Media Sets" panel.
 * - Used by selection views and detail sidebar.
 * - Goal: remove Media Sets prop-drilling.
 *
 * NOTE: We intentionally keep types loose to avoid TS churn during refactors.
 */
export const useSelectionMediaSetsSidebarStore = defineStore('selectionMediaSetsSidebar', () => {
  const selectionStore = useSelectionStore()
  const selectionsApi = useSelectionsApi()

  // Context
  const selectionId = ref('')

  // Media Sets state (sidebar + content depend on these)
  const mediaSets = ref([])
  const sortedMediaSets = computed(() =>
    [...mediaSets.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  )

  const selectedSetId = ref(null)

  // Inline rename state
  const editingSetId = ref(null)
  const editingSetName = ref('')

  // Create/edit modal state
  const showCreateSetModal = ref(false)
  const editingSetIdInModal = ref(null)
  const newSetName = ref('')
  const newSetDescription = ref('')
  const isCreatingSet = ref(false)

  // Drag/drop state
  const draggedSetId = ref(null)
  const draggedSetIndex = ref(null)
  const dragOverIndex = ref(null)

  // Persistence state
  const isSavingSets = ref(false)

  const setContext = async (id, sets = null) => {
    selectionId.value = id || ''

    // If sets are provided, use them; otherwise fetch from API
    if (sets !== null) {
      mediaSets.value = Array.isArray(sets) ? sets : []
    } else if (id) {
      // Fetch media sets from API
      try {
        const fetchedSets = await selectionsApi.fetchMediaSets(id)
        mediaSets.value = Array.isArray(fetchedSets) ? fetchedSets : []
      } catch (error) {
        console.error('Failed to fetch media sets:', error)
        mediaSets.value = []
      }
    } else {
      mediaSets.value = []
    }

    // Keep selection stable if possible
    if (selectedSetId.value && !mediaSets.value.some(s => s.id === selectedSetId.value)) {
      selectedSetId.value = null
    }
    // Keep selected set sane too
    if (!selectedSetId.value && mediaSets.value.length > 0) {
      selectedSetId.value = mediaSets.value[0].id
    }
  }

  const loadMediaSets = async () => {
    if (!selectionId.value) return
    try {
      const fetchedSets = await selectionsApi.fetchMediaSets(selectionId.value)
      mediaSets.value = Array.isArray(fetchedSets) ? fetchedSets : []
      // Auto-select first set if none selected
      if (!selectedSetId.value && mediaSets.value.length > 0) {
        selectedSetId.value = mediaSets.value[0].id
      }
    } catch (error) {
      console.error('Failed to load media sets:', error)
      toast.error('Failed to load media sets', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  }

  // Click behavior: switch viewed set (media differs per set).
  const handleSelectSet = setId => {
    selectedSetId.value = setId
  }

  const ensureSelectionId = () => {
    if (!selectionId.value) {
      toast.error('Please try again.')
      return false
    }
    return true
  }

  const saveMediaSets = async () => {
    // This method is kept for backward compatibility but is no longer used
    // Media sets are now created/updated/deleted via API directly
    // This is a no-op to avoid breaking existing code
    return Promise.resolve()
  }

  const startSetNameEdit = setId => {
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set) return
    editingSetId.value = setId
    editingSetName.value = set.name || ''
  }

  const cancelSetNameEdit = () => {
    editingSetId.value = null
    editingSetName.value = ''
  }

  const saveSetName = async setId => {
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set || !ensureSelectionId()) return

    try {
      const updatedSet = await selectionsApi.updateMediaSet(selectionId.value, setId, {
        name: editingSetName.value,
        description: set.description,
        order: set.order,
      })
      // Update local state
      const index = mediaSets.value.findIndex(s => s.id === setId)
      if (index !== -1) {
        mediaSets.value[index] = { ...mediaSets.value[index], ...updatedSet }
      }
      cancelSetNameEdit()
    } catch (error) {
      console.error('Failed to update set name:', error)
      toast.error('Failed to update set name', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  }

  const autoSaveSetName = debounce(async setId => {
    // Only autosave while editing the same set
    if (editingSetId.value !== setId) return
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set || !ensureSelectionId()) return

    try {
      const updatedSet = await selectionsApi.updateMediaSet(selectionId.value, setId, {
        name: editingSetName.value,
        description: set.description,
        order: set.order,
      })
      // Update local state
      const index = mediaSets.value.findIndex(s => s.id === setId)
      if (index !== -1) {
        mediaSets.value[index] = { ...mediaSets.value[index], ...updatedSet }
      }
    } catch (error) {
      console.error('Failed to auto-save set name:', error)
    }
  }, 600)

  const handleAddSet = () => {
    showCreateSetModal.value = true
    editingSetIdInModal.value = null
    newSetName.value = ''
    newSetDescription.value = ''
  }

  const handleEditSet = setId => {
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set) return
    showCreateSetModal.value = true
    editingSetIdInModal.value = setId
    newSetName.value = set.name || ''
    newSetDescription.value = set.description || ''
  }

  const handleCancelCreateSet = () => {
    showCreateSetModal.value = false
    editingSetIdInModal.value = null
    newSetName.value = ''
    newSetDescription.value = ''
    isCreatingSet.value = false
  }

  const handleCreateSet = async () => {
    if (!ensureSelectionId()) return
    const trimmedName = newSetName.value.trim()
    if (!trimmedName) {
      toast.error('Name required', {
        description: 'Please enter a name for the photo set.',
      })
      return
    }

    // Check for duplicate name (case-insensitive)
    const duplicateSet = mediaSets.value.find(
      s =>
        s.name?.toLowerCase().trim() === trimmedName.toLowerCase() &&
        s.id !== editingSetIdInModal.value
    )

    if (duplicateSet) {
      toast.error('Duplicate name', {
        description: 'A photo set with this name already exists. Please choose a different name.',
      })
      return
    }

    isCreatingSet.value = true
    try {
      if (editingSetIdInModal.value) {
        // Update existing set
        const set = mediaSets.value.find(s => s.id === editingSetIdInModal.value)
        if (set) {
          const maxOrder = mediaSets.value.reduce((acc, s) => Math.max(acc, s.order ?? 0), 0)
          const updatedSet = await selectionsApi.updateMediaSet(
            selectionId.value,
            editingSetIdInModal.value,
            {
              name: trimmedName,
              description: newSetDescription.value || '',
              order: set.order ?? maxOrder,
            }
          )
          // Update local state
          const index = mediaSets.value.findIndex(s => s.id === editingSetIdInModal.value)
          if (index !== -1) {
            mediaSets.value[index] = { ...mediaSets.value[index], ...updatedSet }
          }
        }
      } else {
        // Create new set
        const maxOrder = mediaSets.value.reduce((acc, s) => Math.max(acc, s.order ?? 0), 0)
        const newSet = await selectionsApi.createMediaSet(selectionId.value, {
          name: trimmedName,
          description: newSetDescription.value || '',
          order: maxOrder + 1,
        })
        // Reload all media sets to ensure sync
        await loadMediaSets()
        // Auto-select the newly created set (set after loadMediaSets to ensure it's in the list)
        if (newSet && newSet.id) {
          selectedSetId.value = newSet.id
        } else if (mediaSets.value.length > 0) {
          // Fallback: select the last set (should be the newly created one)
          selectedSetId.value = mediaSets.value[mediaSets.value.length - 1].id
        }
      }

      // Show success message
      toast.success(editingSetIdInModal.value ? 'Set updated' : 'Set created', {
        description: editingSetIdInModal.value
          ? 'Photo set has been updated.'
          : 'New photo set has been created.',
      })

      handleCancelCreateSet()
    } catch (error) {
      console.error('Failed to create/update set:', error)
      toast.error(editingSetIdInModal.value ? 'Failed to update set' : 'Failed to create set', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      isCreatingSet.value = false
    }
  }

  // Delete flow: keep simple/consistent (layout will host confirmation modal)
  const showDeleteSetModal = ref(false)
  const setToDelete = ref(null)
  const isDeletingSet = ref(false)

  const requestDeleteSet = setId => {
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set) return
    setToDelete.value = set
    showDeleteSetModal.value = true
  }

  const cancelDeleteSet = () => {
    showDeleteSetModal.value = false
    setToDelete.value = null
    isDeletingSet.value = false
  }

  const confirmDeleteSet = async () => {
    if (!ensureSelectionId()) return
    if (!setToDelete.value) return

    isDeletingSet.value = true
    try {
      const deletingId = setToDelete.value.id
      await selectionsApi.deleteMediaSet(selectionId.value, deletingId)
      mediaSets.value = mediaSets.value.filter(s => s.id !== deletingId)

      // Handle selected set fallback
      if (selectedSetId.value === deletingId) {
        // If there are other sets available, select the first one
        if (mediaSets.value.length > 0) {
          selectedSetId.value = mediaSets.value[0].id
        } else {
          // No sets available, clear selection to show empty state
          selectedSetId.value = null
        }
      }

      toast.success('Set deleted', {
        description: 'Photo set has been deleted.',
      })
      cancelDeleteSet()
    } catch (error) {
      console.error('Failed to delete set:', error)
      toast.error('Failed to delete set', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      isDeletingSet.value = false
    }
  }

  // Drag/drop handlers
  const handleSetDragStart = payload => {
    draggedSetId.value = payload?.setId ?? null
    draggedSetIndex.value = payload?.index ?? null
  }

  const handleSetDragOver = payload => {
    dragOverIndex.value = payload?.index ?? null
  }

  const handleSetDragLeave = () => {
    dragOverIndex.value = null
  }

  const handleSetDrop = async payload => {
    const fromIndex = draggedSetIndex.value
    const toIndex = payload?.index ?? null
    if (fromIndex === null || toIndex === null || fromIndex === toIndex) {
      handleSetDragEnd()
      return
    }

    const sets = [...sortedMediaSets.value]
    const [moved] = sets.splice(fromIndex, 1)
    sets.splice(toIndex, 0, moved)

    // Recompute order to match UI order
    sets.forEach((s, idx) => {
      s.order = idx + 1
    })
    mediaSets.value = sets

    // Reorder via API
    if (!ensureSelectionId()) {
      handleSetDragEnd()
      return
    }
    try {
      const setIds = sets.map(s => s.id)
      await selectionsApi.reorderMediaSets(selectionId.value, setIds)
    } catch (error) {
      console.error('Failed to reorder sets:', error)
      toast.error('Failed to reorder sets', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
    handleSetDragEnd()
  }

  const handleSetDragEnd = () => {
    draggedSetId.value = null
    draggedSetIndex.value = null
    dragOverIndex.value = null
  }

  return {
    // context
    selectionId,
    setContext,
    loadMediaSets,

    // sets
    mediaSets,
    sortedMediaSets,
    isSavingSets,

    // selection
    selectedSetId,

    // inline rename
    editingSetId,
    editingSetName,
    startSetNameEdit,
    cancelSetNameEdit,
    saveSetName,
    autoSaveSetName,

    // create/edit modal
    showCreateSetModal,
    editingSetIdInModal,
    newSetName,
    newSetDescription,
    isCreatingSet,
    handleAddSet,
    handleEditSet,
    handleCancelCreateSet,
    handleCreateSet,
    handleSelectSet,

    // delete modal
    showDeleteSetModal,
    setToDelete,
    isDeletingSet,
    requestDeleteSet,
    cancelDeleteSet,
    confirmDeleteSet,

    // drag/drop
    draggedSetId,
    dragOverIndex,
    handleSetDragStart,
    handleSetDragOver,
    handleSetDragLeave,
    handleSetDrop,
    handleSetDragEnd,

    // persistence
    saveMediaSets,
  }
})
