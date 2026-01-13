import { nextTick } from 'vue'
import { toast } from '@/shared/utils/toast'

export function useSelectionHeaderActions({
  selection,
  selectionStatus,
  isSavingStatus,
  isEditingName,
  editingName,
  isSavingName,
  isBlurringName,
  nameInputRef,
  selectionStore,
  route,
  router,
  description,
} = {}) {
  const handleComplete = async () => {
    if (!selection.value) return

    isSavingStatus.value = true
    try {
      await selectionStore.completeSelection(selection.value.id)
      selectionStatus.value = 'completed'
      selection.value.status = 'completed'
      toast.success('Selection completed', {
        description,
      })
    } catch (error) {
      toast.error('Failed to complete selection', {
        description,
      })
    } finally {
      isSavingStatus.value = false
    }
  }

  const handleStatusChange = async newStatus => {
    if (!selection.value || !newStatus) return

    isSavingStatus.value = true
    try {
      const apiStatus = newStatus === 'completed' ? 'completed' : 'draft'
      await selectionStore.updateSelection(selection.value.id, {
        status: apiStatus,
      })
      selection.value.status = apiStatus
      selectionStatus.value = newStatus
    } catch (error) {
      toast.error('Failed to update status', {
        description,
      })
      selectionStatus.value = selection.value.status === 'completed' ? 'completed' : 'draft'
    } finally {
      isSavingStatus.value = false
    }
  }

  const startEditingName = () => {
    if (!selection.value) return
    isEditingName.value = true
    editingName.value = selection.value.name
    nextTick(() => {
      nameInputRef.value?.focus()
      nameInputRef.value?.select()
    })
  }

  const cancelEditingName = () => {
    isEditingName.value = false
    editingName.value = ''
  }

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
        description,
      })
    } catch (error) {
      toast.error('Failed to update name', {
        description,
      })
      editingName.value = selection.value.name
    } finally {
      isSavingName.value = false
    }
  }

  return {
    handleComplete,
    handleStatusChange,
    startEditingName,
    cancelEditingName,
    handleNameBlur,
    saveName,
  }
}
