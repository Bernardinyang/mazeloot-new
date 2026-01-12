import { ref, computed, nextTick } from 'vue'
import { defineStore } from 'pinia'
import { toast } from '@/shared/utils/toast'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { useRoute, useRouter } from 'vue-router'

/**
 * Shared state for Raw Files header/navigation
 * - Manages name editing, status, and header actions
 * - Reduces prop drilling between RawFilesLayout and RawFilesTopNav
 */
export const useRawFilesHeaderStore = defineStore('rawFilesHeader', () => {
  const rawFilesApi = useRawFilesApi()
  const route = useRoute()
  const router = useRouter()

  // Raw Files reference (set by layout)
  const rawFiles = ref(null)

  // Name editing state
  const isEditingName = ref(false)
  const editingName = ref('')
  const isSavingName = ref(false)
  const isBlurringName = ref(false)
  const nameInputRef = ref(null)

  // Status state
  const rawFilesStatus = ref('draft') // 'draft' | 'completed'
  const isSavingStatus = ref(false)
  const isPublishing = ref(false)

  // Email modal state
  const showAddEmailModal = ref(false)

  // Share modal state
  const showShareModal = ref(false)

  const effectiveStatus = computed(() => {
    return rawFiles.value?.status || rawFilesStatus.value || 'draft'
  })

  const isLoading = ref(false)

  const setRawFiles = rf => {
    rawFiles.value = rf
    if (rf?.status) {
      rawFilesStatus.value = rf.status
    }
  }

  /**
   * Start editing the raw files name
   */
  const startEditingName = () => {
    if (!rawFiles.value) return
    isEditingName.value = true
    editingName.value = rawFiles.value.name || ''
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
        if (trimmedName && trimmedName !== rawFiles.value?.name) {
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
   * Save the raw files name
   */
  const saveName = async () => {
    if (!rawFiles.value) return
    const trimmedName = editingName.value.trim()
    if (!trimmedName) {
      cancelEditingName()
      return
    }

    if (trimmedName === rawFiles.value.name) {
      cancelEditingName()
      return
    }

    isSavingName.value = true
    try {
      const updatedRawFiles = await rawFilesApi.updateRawFiles(rawFiles.value.id, {
        name: trimmedName,
      })
      if (updatedRawFiles) {
        rawFiles.value.name = trimmedName
      }
      cancelEditingName()
      toast.success('Name updated', {
        description: 'The raw files name has been updated.',
      })
    } catch (error) {
      toast.error('Failed to update name', {
        description: 'An unknown error occurred',
      })
      editingName.value = rawFiles.value?.name || ''
    } finally {
      isSavingName.value = false
    }
  }

  /**
   * Update raw files (for unpublishing, etc.)
   */
  const updateRawFiles = async updateData => {
    if (!rawFiles.value) return

    isSavingStatus.value = true
    try {
      const updatedRawFiles = await rawFilesApi.updateRawFiles(rawFiles.value.id, updateData)
      if (updatedRawFiles) {
        rawFiles.value = updatedRawFiles
        rawFilesStatus.value = updatedRawFiles.status || 'draft'
      }
      toast.success('Raw files updated', {
        description: 'The raw files have been updated successfully.',
      })
      return updatedRawFiles
    } catch (error) {
      toast.error('Failed to update raw files', {
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
   * Publish raw files (change status to active)
   */
  const handlePublish = async (skipValidation = false) => {
    if (!rawFiles.value) return

    const currentStatus = rawFiles.value.status
    const newStatus =
      currentStatus === 'draft' || currentStatus === 'completed' ? 'active' : 'draft'

    // Validate that at least one email is in allowed_emails before publishing to active
    if (newStatus === 'active' && !skipValidation) {
      const allowedEmails = rawFiles.value.allowedEmails || rawFiles.value.allowed_emails || []
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
      const updatedRawFiles = await rawFilesApi.publishRawFiles(rawFiles.value.id)
      if (updatedRawFiles) {
        rawFiles.value = updatedRawFiles
        rawFilesStatus.value = updatedRawFiles.status || 'draft'

        const finalStatus = updatedRawFiles.status
        const messages = {
          draft: {
            title: 'Raw files unpublished',
            description: 'The raw files have been moved back to draft.',
          },
          active:
            currentStatus === 'completed'
              ? {
                  title: 'Raw files republished',
                  description: 'The raw files have been republished and are now active.',
                }
              : {
                  title: 'Raw files published',
                  description: 'The raw files have been published and are now active.',
                },
        }

        const message = messages[finalStatus] || messages['active']
        toast.success(message.title, { description: message.description })
      }
      return updatedRawFiles
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
        const backendMessage = error?.message || error?.response?.data?.message || 'Failed to update raw files status'
        toast.error(backendMessage)
      }
      throw error
    } finally {
      isPublishing.value = false
    }
  }

  return {
    // State
    rawFiles,
    isEditingName,
    editingName,
    isSavingName,
    isBlurringName,
    nameInputRef,
    rawFilesStatus,
    isSavingStatus,
    isPublishing,
    showShareModal,
    isLoading,

    // Computed
    effectiveStatus,

    // Actions
    setRawFiles,
    startEditingName,
    cancelEditingName,
    handleNameBlur,
    saveName,
    handlePublish,
    openShareModal,
    closeShareModal,
    updateRawFiles,
    showAddEmailModal,
  }
})
