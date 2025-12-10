/**
 * Composable for handling delete confirmation modals
 * Provides reusable state and handlers for delete operations
 */

import { ref } from 'vue'

export interface DeleteItem {
  id: string | number
  name?: string
  title?: string
  [key: string]: any
}

export function useDeleteConfirmation<T extends DeleteItem>() {
  const showDeleteModal = ref(false)
  const itemToDelete = ref<T | null>(null)
  const isDeleting = ref(false)

  const openDeleteModal = (item: T) => {
    itemToDelete.value = item
    showDeleteModal.value = true
  }

  const closeDeleteModal = () => {
    showDeleteModal.value = false
    itemToDelete.value = null
    isDeleting.value = false
  }

  const getItemName = (item: T | null): string => {
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
