import { nextTick } from 'vue'
import { toast } from '@/shared/utils/toast'

export function useRawFileHeaderActions({
  rawFile,
  rawFileStatus,
  isSavingStatus,
  isEditingName,
  editingName,
  isSavingName,
  isBlurringName,
  nameInputRef,
  rawFileStore,
  route,
  router,
  description,
} = {}) {
  const handleComplete = async () => {
    if (!rawFile.value) return

    isSavingStatus.value = true
    try {
      await rawFileStore.completeRawFile(rawFile.value.id)
      rawFileStatus.value = 'completed'
      rawFile.value.status = 'completed'
      toast.success('RawFile completed', {
        description,
      })
    } catch (error) {
      toast.error('Failed to complete rawFile', {
        description,
      })
    } finally {
      isSavingStatus.value = false
    }
  }

  const handleStatusChange = async newStatus => {
    if (!rawFile.value || !newStatus) return

    isSavingStatus.value = true
    try {
      const apiStatus = newStatus === 'completed' ? 'completed' : 'draft'
      await rawFileStore.updateRawFile(rawFile.value.id, {
        status: apiStatus,
      })
      rawFile.value.status = apiStatus
      rawFileStatus.value = newStatus
    } catch (error) {
      toast.error('Failed to update status', {
        description,
      })
      rawFileStatus.value = rawFile.value.status === 'completed' ? 'completed' : 'draft'
    } finally {
      isSavingStatus.value = false
    }
  }

  const startEditingName = () => {
    if (!rawFile.value) return
    isEditingName.value = true
    editingName.value = rawFile.value.name
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
        if (trimmedName && trimmedName !== rawFile.value?.name) {
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
    if (!rawFile.value) return
    const trimmedName = editingName.value.trim()
    if (!trimmedName) {
      cancelEditingName()
      return
    }

    if (trimmedName === rawFile.value.name) {
      cancelEditingName()
      return
    }

    isSavingName.value = true
    try {
      await rawFileStore.updateRawFile(rawFile.value.id, {
        name: trimmedName,
      })
      rawFile.value.name = trimmedName
      cancelEditingName()
      toast.success('Name updated', {
        description,
      })
    } catch (error) {
      toast.error('Failed to update name', {
        description,
      })
      editingName.value = rawFile.value.name
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
