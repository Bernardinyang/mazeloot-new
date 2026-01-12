import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { toast } from '@/shared/utils/toast'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { debounce } from '@/shared/utils/debounce'

export const useRawFilesMediaSetsSidebarStore = defineStore('rawFilesMediaSetsSidebar', () => {
  const rawFilesApi = useRawFilesApi()

  const rawFilesId = ref('')
  const mediaSets = ref([])
  const sortedMediaSets = computed(() =>
    [...mediaSets.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  )

  const selectedSetId = ref(null)
  const editingSetId = ref(null)
  const editingSetName = ref('')
  const showCreateSetModal = ref(false)
  const editingSetIdInModal = ref(null)
  const newSetName = ref('')
  const newSetDescription = ref('')
  const isCreatingSet = ref(false)
  const draggedSetId = ref(null)
  const draggedSetIndex = ref(null)
  const dragOverIndex = ref(null)
  const isSavingSets = ref(false)

  const setContext = async (id, sets = null) => {
    const previousRawFilesId = rawFilesId.value
    
    if (previousRawFilesId && previousRawFilesId !== id) {
      mediaSets.value = []
      selectedSetId.value = null
    }
    
    rawFilesId.value = id || ''

    if (sets !== null) {
      mediaSets.value = Array.isArray(sets) ? sets : []
    } else if (id) {
      try {
        const fetchedSets = await rawFilesApi.fetchMediaSets(id)
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

    if (selectedSetId.value && !mediaSets.value.some(s => s.id === selectedSetId.value)) {
      selectedSetId.value = null
    }
    if (!selectedSetId.value && mediaSets.value.length > 0) {
      selectedSetId.value = mediaSets.value[0].id
    }
  }

  const loadMediaSets = async () => {
    if (!rawFilesId.value) return
    try {
      const fetchedSets = await rawFilesApi.fetchMediaSets(rawFilesId.value)
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
      console.error('Failed to load media sets:', error)
    }
  }

  const handleSelectSet = setId => {
    selectedSetId.value = setId
  }

  const handleAddSet = () => {
    newSetName.value = ''
    newSetDescription.value = ''
    editingSetIdInModal.value = null
    showCreateSetModal.value = true
  }

  const handleCancelCreateSet = () => {
    showCreateSetModal.value = false
    newSetName.value = ''
    newSetDescription.value = ''
    editingSetIdInModal.value = null
  }

  const handleCreateSet = async () => {
    if (!rawFilesId.value || !newSetName.value.trim()) return

    isCreatingSet.value = true
    try {
      const newSet = await rawFilesApi.createMediaSet(rawFilesId.value, {
        name: newSetName.value.trim(),
        description: newSetDescription.value?.trim() || null,
      })
      await loadMediaSets()
      showCreateSetModal.value = false
      newSetName.value = ''
      newSetDescription.value = ''
      if (newSet && newSet.id) {
        handleSelectSet(newSet.id)
      }
      toast.success('Set created', { description: 'Media set has been created.' })
    } catch (error) {
      toast.error('Failed to create set', { description: error.message || 'An error occurred.' })
    } finally {
      isCreatingSet.value = false
    }
  }

  return {
    rawFilesId,
    mediaSets,
    sortedMediaSets,
    selectedSetId,
    editingSetId,
    editingSetName,
    showCreateSetModal,
    editingSetIdInModal,
    newSetName,
    newSetDescription,
    isCreatingSet,
    draggedSetId,
    draggedSetIndex,
    dragOverIndex,
    isSavingSets,
    setContext,
    loadMediaSets,
    handleSelectSet,
    handleAddSet,
    handleCancelCreateSet,
    handleCreateSet,
  }
})
