import { ref, computed, nextTick } from 'vue'
import { defineStore } from 'pinia'
import { toast } from '@/utils/toast'
import { useSelectionStore } from '@/stores/selection'
import { useRoute, useRouter } from 'vue-router'

/**
 * Shared state for Selection header/navigation
 * - Manages name editing, status, and header actions
 * - Reduces prop drilling between SelectionLayout and SelectionTopNav
 */
export const useSelectionHeaderStore = defineStore('selectionHeader', () => {
  const selectionStore = useSelectionStore()
  const route = useRoute()
  const router = useRouter()

  // Selection reference (set by layout)
  const selection = ref(null)

  // Name editing state
  const isEditingName = ref(false)
  const editingName = ref('')
  const isSavingName = ref(false)
  const isBlurringName = ref(false)
  const nameInputRef = ref(null)

  // Status state
  const selectionStatus = ref('draft') // 'draft' | 'completed'
  const isSavingStatus = ref(false)

  // Share modal state
  const showShareModal = ref(false)

  // Computed status from selection
  const effectiveStatus = computed(() => {
    if (selection.value?.status === 'completed') return 'completed'
    return selectionStatus.value || 'draft'
  })

  // Computed loading state
  const isLoading = computed(() => selectionStore.isLoading)

  /**
   * Set the current selection
   */
  const setSelection = sel => {
    selection.value = sel
    if (sel) {
      selectionStatus.value = sel.status === 'completed' ? 'completed' : 'draft'
    }
  }

  /**
   * Start editing the selection name
   */
  const startEditingName = () => {
    if (!selection.value) return
    isEditingName.value = true
    editingName.value = selection.value.name || ''
    nextTick(() => {
      nameInputRef.value?.focus()
      nameInputRef.value?.select()
    })
  }

  /**
   * Cancel editing name
   */
  const cancelEditingName = () => {
    isEditingName.value = false
    editingName.value = ''
  }

  /**
   * Handle name input blur
   */
  const handleNameBlur = () => {
    if (isBlurringName.value || isSavingName.value) return
    isBlurringName.value = true
    setTimeout(() => {
      if (isBlurringName.value && !isSavingName.value) {
        const trimmedName = editingName.value.trim()
        if (trimmedName && trimmedName !== selection.value?.name) {
          saveName()
        } else if (!trimmedName) {
          cancelEditingName()
        } else {
          cancelEditingName()
        }
        isBlurringName.value = false
      }
    }, 200)
  }

  /**
   * Save the selection name
   */
  const saveName = async () => {
    if (!selection.value) return
    const trimmedName = editingName.value.trim()
    if (!trimmedName) {
      cancelEditingName()
      return
    }

    if (trimmedName === selection.value.name) {
      cancelEditingName()
      return
    }

    isSavingName.value = true
    try {
      await selectionStore.updateSelection(selection.value.id, {
        name: trimmedName,
      })
      selection.value.name = trimmedName
      cancelEditingName()
      toast.success('Name updated', {
        description: 'The selection name has been updated.',
      })
    } catch (error) {
      toast.error('Failed to update name', {
        description: 'An unknown error occurred',
      })
      editingName.value = selection.value?.name || ''
    } finally {
      isSavingName.value = false
    }
  }

  /**
   * Complete the selection
   */
  const handleComplete = async () => {
    if (!selection.value) return

    isSavingStatus.value = true
    try {
      await selectionStore.completeSelection(selection.value.id)
      selectionStatus.value = 'completed'
      if (selection.value) {
        selection.value.status = 'completed'
      }
      toast.success('Selection completed', {
        description: 'The selection has been marked as completed.',
      })
    } catch (error) {
      toast.error('Failed to complete selection', {
        description: 'An unknown error occurred',
      })
    } finally {
      isSavingStatus.value = false
    }
  }

  /**
   * Handle status change
   */
  const handleStatusChange = async newStatus => {
    if (!selection.value || !newStatus) return

    isSavingStatus.value = true
    try {
      const apiStatus = newStatus === 'completed' ? 'completed' : 'draft'
      await selectionStore.updateSelection(selection.value.id, {
        status: apiStatus,
      })
      if (selection.value) {
        selection.value.status = apiStatus
      }
      selectionStatus.value = newStatus
    } catch (error) {
      toast.error('Failed to update status', {
        description: 'An unknown error occurred',
      })
      selectionStatus.value = selection.value?.status === 'completed' ? 'completed' : 'draft'
    } finally {
      isSavingStatus.value = false
    }
  }

  /**
   * Open share modal
   */
  const openShareModal = () => {
    showShareModal.value = true
  }

  /**
   * Close share modal
   */
  const closeShareModal = () => {
    showShareModal.value = false
  }

  return {
    // State
    selection,
    isEditingName,
    editingName,
    isSavingName,
    isBlurringName,
    nameInputRef,
    selectionStatus,
    isSavingStatus,
    showShareModal,
    isLoading,

    // Computed
    effectiveStatus,

    // Actions
    setSelection,
    startEditingName,
    cancelEditingName,
    handleNameBlur,
    saveName,
    handleComplete,
    handleStatusChange,
    openShareModal,
    closeShareModal,
  }
})
