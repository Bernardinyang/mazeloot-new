import { ref, computed, nextTick } from 'vue'
import { defineStore } from 'pinia'
import { toast } from '@/utils/toast'
import { useProofingStore } from '@/stores/proofing'
import { useRoute, useRouter } from 'vue-router'

/**
 * Shared state for Proofing header/navigation
 * - Manages name editing, status, and header actions
 * - Reduces prop drilling between ProofingLayout and ProofingTopNav
 */
export const useProofingHeaderStore = defineStore('proofingHeader', () => {
  const proofingStore = useProofingStore()
  const route = useRoute()
  const router = useRouter()

  // Proofing reference (set by layout)
  const proofing = ref(null)

  // Name editing state
  const isEditingName = ref(false)
  const editingName = ref('')
  const isSavingName = ref(false)
  const isBlurringName = ref(false)
  const nameInputRef = ref(null)

  // Status state
  const proofingStatus = ref('draft') // 'draft' | 'active' | 'completed'
  const isSavingStatus = ref(false)
  const isPublishing = ref(false)

  // Email modal state
  const showAddEmailModal = ref(false)

  // Share modal state
  const showShareModal = ref(false)

  const effectiveStatus = computed(() => {
    return proofing.value?.status || proofingStatus.value || 'draft'
  })

  const isLoading = computed(() => proofingStore.isLoading)

  const setProofing = p => {
    proofing.value = p
    if (p?.status) {
      proofingStatus.value = p.status
    }
  }

  /**
   * Start editing the proofing name
   */
  const startEditingName = () => {
    if (!proofing.value) return
    isEditingName.value = true
    editingName.value = proofing.value.name || ''
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
        if (trimmedName && trimmedName !== proofing.value?.name) {
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
   * Save the proofing name
   */
  const saveName = async () => {
    if (!proofing.value) return
    const trimmedName = editingName.value.trim()
    if (!trimmedName) {
      cancelEditingName()
      return
    }

    if (trimmedName === proofing.value.name) {
      cancelEditingName()
      return
    }

    isSavingName.value = true
    try {
      const projectId = proofing.value.projectId || proofing.value.project_uuid || null
      await proofingStore.updateProofing(
        proofing.value.id,
        {
          name: trimmedName,
        },
        projectId
      )
      proofing.value.name = trimmedName
      cancelEditingName()
      toast.success('Name updated', {
        description: 'The proofing name has been updated.',
      })
    } catch (error) {
      toast.error('Failed to update name', {
        description: 'An unknown error occurred',
      })
      editingName.value = proofing.value?.name || ''
    } finally {
      isSavingName.value = false
    }
  }

  /**
   * Complete the proofing
   */
  const handleComplete = async () => {
    if (!proofing.value) return

    isSavingStatus.value = true
    try {
      const projectId = proofing.value.projectId || proofing.value.project_uuid || null
      const proofingId = proofing.value.id || proofing.value.uuid
      await proofingStore.completeProofing(proofingId, projectId)
      proofingStatus.value = 'completed'
      if (proofing.value) {
        proofing.value.status = 'completed'
      }
      toast.success('Proofing completed', {
        description: 'The proofing has been marked as completed.',
      })
    } catch (error) {
      toast.error('Failed to complete proofing', {
        description: error.message || 'An unknown error occurred',
      })
    } finally {
      isSavingStatus.value = false
    }
  }

  /**
   * Handle status change
   */
  const handleStatusChange = async newStatus => {
    if (!proofing.value || !newStatus) return

    isSavingStatus.value = true
    try {
      const projectId = proofing.value.projectId || proofing.value.project_uuid || null
      await proofingStore.updateProofing(
        proofing.value.id,
        {
          status: newStatus,
        },
        projectId
      )
      if (proofing.value) {
        proofing.value.status = newStatus
      }
      proofingStatus.value = newStatus
    } catch (error) {
      toast.error('Failed to update status', {
        description: 'An unknown error occurred',
      })
      proofingStatus.value = proofing.value?.status || 'draft'
    } finally {
      isSavingStatus.value = false
    }
  }

  /**
   * Update proofing (for unpublishing, etc.)
   */
  const updateProofing = async updateData => {
    if (!proofing.value) return

    isSavingStatus.value = true
    try {
      const projectId = proofing.value.projectId || proofing.value.project_uuid || null
      const updatedProofing = await proofingStore.updateProofing(
        proofing.value.id,
        updateData,
        projectId
      )
      if (updatedProofing) {
        proofing.value = updatedProofing
        proofingStatus.value = updatedProofing.status || 'draft'
      }
      toast.success('Proofing updated', {
        description: 'The proofing has been updated successfully.',
      })
      return updatedProofing
    } catch (error) {
      toast.error('Failed to update proofing', {
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
   * Publish proofing (change status to active)
   */
  const handlePublish = async (skipValidation = false) => {
    if (!proofing.value) return

    const currentStatus = proofing.value.status
    const newStatus =
      currentStatus === 'draft' || currentStatus === 'completed' ? 'active' : 'draft'

    // Validate that at least one email is in allowed_emails before publishing to active
    if (newStatus === 'active' && !skipValidation) {
      const allowedEmails = proofing.value.allowedEmails || proofing.value.allowed_emails || []
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
      const projectId = proofing.value.projectId || proofing.value.project_uuid || null
      const updatedProofing = await proofingStore.publishProofing(proofing.value.id, projectId)
      if (updatedProofing) {
        proofing.value = updatedProofing
        proofingStatus.value = updatedProofing.status || 'draft'

        const finalStatus = updatedProofing.status
        const messages = {
          draft: {
            title: 'Proofing unpublished',
            description: 'The proofing has been moved back to draft.',
          },
          active:
            currentStatus === 'completed'
              ? {
                  title: 'Proofing republished',
                  description: 'The proofing has been republished and is now active.',
                }
              : {
                  title: 'Proofing published',
                  description: 'The proofing has been published and is now active.',
                },
        }

        const message = messages[finalStatus] || messages['active']
        toast.success(message.title, { description: message.description })
      }
      return updatedProofing
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
        toast.error('Failed to update proofing status', {
          description: errorMessage || 'An unknown error occurred',
        })
      }
      throw error
    } finally {
      isPublishing.value = false
    }
  }

  return {
    // State
    proofing,
    isEditingName,
    editingName,
    isSavingName,
    isBlurringName,
    nameInputRef,
    proofingStatus,
    isSavingStatus,
    isPublishing,
    showShareModal,
    isLoading,

    // Computed
    effectiveStatus,

    // Actions
    setProofing,
    startEditingName,
    cancelEditingName,
    handleNameBlur,
    saveName,
    handleComplete,
    handleStatusChange,
    handlePublish,
    openShareModal,
    closeShareModal,
    updateProofing,
    showAddEmailModal,
  }
})
