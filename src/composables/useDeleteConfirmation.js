/**
 * Composable for handling delete confirmation modals
 * Provides reusable state and handlers for delete operations
 */

import { ref } from 'vue'

export function useDeleteConfirmation() {
  const showDeleteModal = ref(false)
  const itemToDelete = ref(null)
  const isDeleting = ref(false)

  const openDeleteModal = item => {
    itemToDelete.value = item
    showDeleteModal.value = true
  }

  const closeDeleteModal = () => {
    showDeleteModal.value = false
    itemToDelete.value = null
    isDeleting.value = false
  }

  const getItemName = item => {
    if (!item) return ''
    return item.name || item.title || 'this item'
  }

  return {
    showDeleteModal,
    itemToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    getItemName,
  }
}
