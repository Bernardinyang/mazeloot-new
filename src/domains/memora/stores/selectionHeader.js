import { ref, computed, nextTick } from 'vue'
import { defineStore } from 'pinia'
import { toast } from '@/shared/utils/toast'
import { useSelectionStore } from '@/domains/memora/stores/selection'
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
  const isPublishing = ref(false)

  // Email modal state
  const showAddEmailModal = ref(false)

  // Share modal state
  const showShareModal = ref(false)

  const effectiveStatus = computed(() => {
    return selection.value?.status || selectionStatus.value || 'draft'
  })

  const isLoading = computed(() => selectionStore.isLoading)

  const setSelection = sel => {
    selection.value = sel
    if (sel?.status) {
      selectionStatus.value = sel.status
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
   * Update selection (for unpublishing, etc.)
   */
  const updateSelection = async updateData => {
    if (!selection.value) return

    isSavingStatus.value = true
    try {
      const updatedSelection = await selectionStore.updateSelection(selection.value.id, updateData)
      if (updatedSelection) {
        selection.value = updatedSelection
        selectionStatus.value = updatedSelection.status || 'draft'
      }
      toast.success('Selection updated', {
        description: 'The selection has been updated successfully.',
      })
      return updatedSelection
    } catch (error) {
      toast.error('Failed to update selection', {
        description: error?.message || 'An unknown error occurred',
      })
      throw error
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

  /**
   * Publish selection (change status to active)
   */
  const handlePublish = async (skipValidation = false) => {
    if (!selection.value) return

    const currentStatus = selection.value.status
    const newStatus =
      currentStatus === 'draft' || currentStatus === 'completed' ? 'active' : 'draft'

    // Validate that at least one email is in allowed_emails before publishing to active
    if (newStatus === 'active' && !skipValidation) {
      const allowedEmails = selection.value.allowedEmails || selection.value.allowed_emails || []
      const validEmails = Array.isArray(allowedEmails)
        ? allowedEmails.filter(email => email && email.trim())
        : []

      if (validEmails.length === 0) {
        // Show modal to add emails
        showAddEmailModal.value = true
        return
      }
    }

    isPublishing.value = true
    try {
      const updatedSelection = await selectionStore.publishSelection(selection.value.id)
      if (updatedSelection) {
        selection.value = updatedSelection
        selectionStatus.value = updatedSelection.status || 'draft'

        const finalStatus = updatedSelection.status
        const messages = {
          draft: {
            title: 'Selection unpublished',
            description: 'The selection has been moved back to draft.',
          },
          active:
            currentStatus === 'completed'
              ? {
                  title: 'Selection republished',
                  description: 'The selection has been republished and is now active.',
                }
              : {
                  title: 'Selection published',
                  description: 'The selection has been published and is now active.',
                },
        }

        const message = messages[finalStatus] || messages['active']
        toast.success(message.title, { description: message.description })
      }
      return updatedSelection
    } catch (error) {
      // Check if error is about missing allowed emails
      const errorMessage = error?.message || ''
      if (
        errorMessage.includes('allowed_emails') ||
        errorMessage.includes('email address must be added')
      ) {
        // Show modal to add emails
        showAddEmailModal.value = true
      } else {
        // Use exact backend error message
        const backendMessage = error?.message || error?.response?.data?.message || 'Failed to update selection status'
        toast.error(backendMessage)
      }
      throw error
    } finally {
      isPublishing.value = false
    }
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
    isPublishing,
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
    handlePublish,
    openShareModal,
    closeShareModal,
    updateSelection,
    showAddEmailModal,
  }
})
