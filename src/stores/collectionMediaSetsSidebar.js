import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'
import { useGalleryStore } from '@/stores/gallery'
import { debounce } from '@/utils/debounce'

/**
 * Shared (Option B) state for the Photos sidebar "Media Sets" panel.
 * - Used by `CollectionLayout` (sidebar UI) and `Photos.vue` (content orchestration).
 * - Goal: remove Media Sets prop-drilling through `CollectionLayout`.
 *
 * NOTE: We intentionally keep types loose to avoid TS churn during refactors.
 */
export const useCollectionMediaSetsSidebarStore = defineStore('collectionMediaSetsSidebar', () => {
  const galleryStore = useGalleryStore()

  // Context
  const collectionId = ref('')

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

  const setContext = (id, sets = []) => {
    collectionId.value = id || ''
    mediaSets.value = Array.isArray(sets) ? sets : []
    // Keep selection stable if possible
    if (selectedSetId.value && !mediaSets.value.some(s => s.id === selectedSetId.value)) {
      selectedSetId.value = null
    }
    // Keep selected set sane too
    if (!selectedSetId.value && mediaSets.value.length > 0) {
      selectedSetId.value = mediaSets.value[0].id
    }
  }

  // Click behavior: switch viewed set (media differs per set).
  const handleSelectSet = setId => {
    selectedSetId.value = setId
  }

  const ensureCollectionId = () => {
    if (!collectionId.value) {
      toast.error('Collection not loaded', { description: 'Please try again.' })
      return false
    }
    return true
  }

  const saveMediaSets = async () => {
    if (!ensureCollectionId()) return
    isSavingSets.value = true
    try {
      await galleryStore.updateCollection(collectionId.value, { mediaSets: mediaSets.value })
    } catch (error) {
      console.error('Failed to save media sets:', error)
      toast.error('Failed to save media sets', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      isSavingSets.value = false
    }
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
    if (!set) return

    set.name = editingSetName.value
    await saveMediaSets()
    cancelSetNameEdit()
  }

  const autoSaveSetName = debounce(async setId => {
    // Only autosave while editing the same set
    if (editingSetId.value !== setId) return
    const set = mediaSets.value.find(s => s.id === setId)
    if (!set) return

    set.name = editingSetName.value
    await saveMediaSets()
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
    if (!ensureCollectionId()) return
    if (!newSetName.value.trim()) return

    isCreatingSet.value = true
    try {
      if (editingSetIdInModal.value) {
        const set = mediaSets.value.find(s => s.id === editingSetIdInModal.value)
        if (set) {
          set.name = newSetName.value.trim()
          set.description = newSetDescription.value
        }
      } else {
        const maxOrder = mediaSets.value.reduce((acc, s) => Math.max(acc, s.order ?? 0), 0)
        const id = `set_${Date.now()}_${Math.random().toString(16).slice(2)}`
        mediaSets.value.push({
          id,
          name: newSetName.value.trim(),
          description: newSetDescription.value,
          order: maxOrder + 1,
          count: 0,
        })
      }

      await saveMediaSets()
      handleCancelCreateSet()
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
    if (!ensureCollectionId()) return
    if (!setToDelete.value) return

    isDeletingSet.value = true
    try {
      const deletingId = setToDelete.value.id
      mediaSets.value = mediaSets.value.filter(s => s.id !== deletingId)
      if (selectedSetId.value === deletingId) selectedSetId.value = null
      await saveMediaSets()
      cancelDeleteSet()
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

    await saveMediaSets()
    handleSetDragEnd()
  }

  const handleSetDragEnd = () => {
    draggedSetId.value = null
    draggedSetIndex.value = null
    dragOverIndex.value = null
  }

  return {
    // context
    collectionId,
    setContext,

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
