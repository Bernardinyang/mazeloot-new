import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { toast } from '@/shared/utils/toast'
import { useRawFileStore } from '@/domains/memora/stores/rawFile'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { debounce } from '@/shared/utils/debounce'

/**
 * Shared state for the Selection sidebar "Media Sets" panel.
 * - Used by rawFile views and detail sidebar.
 * - Goal: remove Media Sets prop-drilling.
 *
 * NOTE: We intentionally keep types loose to avoid TS churn during refactors.
 */
export const useRawFileMediaSetsSidebarStore = defineStore('rawFileMediaSetsSidebar', () => {
  const rawFileStore = useRawFileStore()
  const rawFilesApi = useRawFilesApi()

  // Context
  const rawFileId = ref('')
  // Alias for compatibility (legacy name from selection)
  const selectionId = rawFileId

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
  const newSetSelectionLimit = ref(null)
  const isCreatingSet = ref(false)

  // Drag/drop state
  const draggedSetId = ref(null)
  const draggedSetIndex = ref(null)
  const dragOverIndex = ref(null)

  // Persistence state
  const isSavingSets = ref(false)

  const setContext = async (id, sets = null) => {
    const previousRawFileId = rawFileId.value
    
    // If rawFile ID changed, clear media sets immediately to prevent carry-over
    if (previousRawFileId && previousRawFileId !== id) {
      mediaSets.value = []
      selectedSetId.value = null
    }
    
    rawFileId.value = id || ''

    // If sets are provided, use them; otherwise fetch from API
    if (sets !== null) {
      mediaSets.value = Array.isArray(sets) ? sets : []
    } else if (id) {
      // Fetch media sets from API
      try {
        const fetchedSets = await rawFilesApi.fetchMediaSets(id)
        // Handle different response formats
        let setsArray = []
        if (Array.isArray(fetchedSets)) {
          setsArray = fetchedSets
        } else if (fetchedSets && Array.isArray(fetchedSets.data)) {
          setsArray = fetchedSets.data
        } else if (fetchedSets && fetchedSets.sets && Array.isArray(fetchedSets.sets)) {
          setsArray = fetchedSets.sets
        }
        mediaSets.value = setsArray
      } catch (error) {
        console.error('Failed to fetch media sets:', error)
        mediaSets.value = []
      }
    } else {
      mediaSets.value = []
    }

    // Keep rawFile stable if possible
    if (selectedSetId.value && !mediaSets.value.some(s => s.id === selectedSetId.value)) {
      selectedSetId.value = null
    }
    // Always auto-select first set if none selected and sets exist
    if (!selectedSetId.value && mediaSets.value.length > 0) {
      selectedSetId.value = mediaSets.value[0].id
    }
  }

  const loadMediaSets = async () => {
    if (!rawFileId.value) return
    try {
      const fetchedSets = await rawFilesApi.fetchMediaSets(rawFileId.value)
      // Handle different response formats
      let setsArray = []
      if (Array.isArray(fetchedSets)) {
        setsArray = fetchedSets
      } else if (fetchedSets && Array.isArray(fetchedSets.data)) {
        setsArray = fetchedSets.data
      } else if (fetchedSets && fetchedSets.sets && Array.isArray(fetchedSets.sets)) {
        setsArray = fetchedSets.sets
      }

      // Sort by order to ensure consistent ordering
      setsArray.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

      // Force reactivity by creating a new array reference
      mediaSets.value = [...setsArray]

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
    if (!rawFileId.value) {
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
      const updatedSet = await rawFilesApi.updateMediaSet(rawFileId.value, setId, {
        name: editingSetName.value,
        description: set.description,
        order: set.order,
      })
      const index = mediaSets.value.findIndex(s => s.id === setId)
      if (index !== -1) {
        mediaSets.value[index] = { ...mediaSets.value[index], ...updatedSet }
      }
      cancelSetNameEdit()
    } catch (error) {
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
      const updatedSet = await rawFilesApi.updateMediaSet(rawFileId.value, setId, {
        name: editingSetName.value,
        description: set.description,
        order: set.order,
      })
      const index = mediaSets.value.findIndex(s => s.id === setId)
      if (index !== -1) {
        mediaSets.value[index] = { ...mediaSets.value[index], ...updatedSet }
      }
    } catch (error) {}
  }, 600)

  const handleAddSet = () => {
    const rawFile = rawFileStore.rawFile
    if (rawFile?.status === 'completed' || rawFile?.status === 'active') {
      toast.info('Set creation disabled', {
        description: 'Cannot create sets in a completed or active raw file.',
      })
      return
    }
    showCreateSetModal.value = true
    editingSetIdInModal.value = null
    newSetName.value = ''
    newSetDescription.value = ''
    newSetSelectionLimit.value = null
  }

  const handleEditSet = setId => {
    const rawFile = rawFileStore.rawFile
    if (rawFile?.status === 'completed' || rawFile?.status === 'active') {
      toast.info('Set editing disabled', {
        description: 'Cannot edit sets in a completed or active raw file.',
      })
      return
    }
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set) return
    showCreateSetModal.value = true
    editingSetIdInModal.value = setId
    newSetName.value = set.name || ''
    newSetDescription.value = set.description || ''
    newSetSelectionLimit.value = set.selectionLimit ?? null
  }

  const handleCancelCreateSet = () => {
    showCreateSetModal.value = false
    editingSetIdInModal.value = null
    newSetName.value = ''
    newSetDescription.value = ''
    newSetSelectionLimit.value = null
    isCreatingSet.value = false
  }

  const handleCreateSet = async () => {
    if (!ensureSelectionId()) return
    const rawFile = rawFileStore.rawFile
    if (rawFile?.status === 'completed' || rawFile?.status === 'active') {
      toast.info('Set creation disabled', {
        description: 'Cannot create sets in a completed or active raw file.',
      })
      handleCancelCreateSet()
      return
    }
    const trimmedName = newSetName.value.trim()
    if (!trimmedName) {
      toast.error('Name required', {
        description: 'Please enter a name for the photo set.',
      })
      return
    }

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
    let result = null
    try {
      if (editingSetIdInModal.value) {
        const set = mediaSets.value.find(s => s.id === editingSetIdInModal.value)
        if (set) {
          const maxOrder = mediaSets.value.reduce((acc, s) => Math.max(acc, s.order ?? 0), 0)
          result = await rawFilesApi.updateMediaSet(
            rawFileId.value,
            editingSetIdInModal.value,
            {
              name: trimmedName,
              description: newSetDescription.value || '',
              order: set.order ?? maxOrder,
              selectionLimit: newSetSelectionLimit.value ?? null, // Explicitly set to null if undefined
            }
          )
          const index = mediaSets.value.findIndex(s => s.id === editingSetIdInModal.value)
          if (index !== -1) {
            mediaSets.value[index] = { ...mediaSets.value[index], ...result }
          }
        }
      } else {
        const maxOrder = mediaSets.value.reduce((acc, s) => Math.max(acc, s.order ?? 0), 0)
        result = await rawFilesApi.createMediaSet(rawFileId.value, {
          name: trimmedName,
          description: newSetDescription.value || '',
          order: maxOrder + 1,
          selectionLimit: newSetSelectionLimit.value,
        })
        // Reload all media sets to ensure sync
        await loadMediaSets()
        // Wait a tick to ensure reactivity updates
        await new Promise(resolve => setTimeout(resolve, 100))
        // Auto-select the newly created set (set after loadMediaSets to ensure it's in the list)
        if (result && result.id) {
          selectedSetId.value = result.id
        } else if (mediaSets.value.length > 0) {
          // Fallback: select the last set (should be the newly created one)
          const sortedSets = [...mediaSets.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          selectedSetId.value = sortedSets[sortedSets.length - 1].id
        }
      }

      toast.apiSuccess(result, editingSetIdInModal.value ? 'Set updated' : 'Set created')

      handleCancelCreateSet()
    } catch (error) {
      toast.apiError(
        error,
        editingSetIdInModal.value ? 'Failed to update set' : 'Failed to create set'
      )
    } finally {
      isCreatingSet.value = false
    }
  }

  const showDeleteSetModal = ref(false)
  const setToDelete = ref(null)
  const isDeletingSet = ref(false)

  const requestDeleteSet = setId => {
    const rawFile = rawFileStore.rawFile
    if (rawFile?.status === 'completed' || rawFile?.status === 'active') {
      toast.info('Set deletion disabled', {
        description: 'Cannot delete sets in a completed or active raw file.',
      })
      return
    }
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
    const rawFile = rawFileStore.rawFile
    if (rawFile?.status === 'completed' || rawFile?.status === 'active') {
      toast.info('Set deletion disabled', {
        description: 'Cannot delete sets in a completed or active raw file.',
      })
      cancelDeleteSet()
      return
    }

    isDeletingSet.value = true
    try {
      const deletingId = setToDelete.value.id
      await rawFilesApi.deleteMediaSet(rawFileId.value, deletingId)
      mediaSets.value = mediaSets.value.filter(s => s.id !== deletingId)

      if (selectedSetId.value === deletingId) {
        // If there are other sets available, select the first one
        if (mediaSets.value.length > 0) {
          selectedSetId.value = mediaSets.value[0].id
        } else {
          // No sets available, clear rawFile to show empty state
          selectedSetId.value = null
        }
      }

      toast.success('Set deleted', {
        description: 'Photo set has been deleted.',
      })
      cancelDeleteSet()
    } catch (error) {
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
    const rawFile = rawFileStore.rawFile
    if (rawFile?.status === 'completed' || rawFile?.status === 'active') {
      handleSetDragEnd()
      return
    }
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
      await rawFilesApi.reorderMediaSets(rawFileId.value, setIds)
    } catch (error) {
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
    rawFileId,
    selectionId, // Alias for compatibility
    setContext,
    loadMediaSets,

    // sets
    mediaSets,
    sortedMediaSets,
    isSavingSets,

    // rawFile
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
    newSetSelectionLimit,
    isCreatingSet,
    handleAddSet,
    handleEditSet,
    handleCancelCreateSet,
    handleCreateSet,
    handleSelectSet,

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
