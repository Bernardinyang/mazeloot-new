import { toast } from '@/utils/toast'

export function useBulkDeleteFlow({
  selectedMediaIds,
  showBulkDeleteModal,
  isBulkDeleteLoading,
  mediaApi,
  deleteMediaFn, // Optional: custom delete function (e.g., for selections)
  mediaItems,
  updateSetCounts,
  loadMediaItems, // Function to reload media items after deletion
  loadCollection, // Optional: Function to reload collection after deletion (for updating counts)
  pagination, // Pagination object from useAsyncPagination
  goToPage, // Function to navigate to a page
  resetToFirstPage, // Function to reset to first page
  description,
} = {}) {
  const handleBulkDelete = () => {
    if (selectedMediaIds.value.size === 0) return
    showBulkDeleteModal.value = true
  }

  const handleConfirmBulkDelete = async () => {
    if (selectedMediaIds.value.size === 0 || isBulkDeleteLoading?.value) return

    const count = selectedMediaIds.value.size
    const idsToDelete = Array.from(selectedMediaIds.value)
    const currentPageBeforeDelete = pagination?.value?.page || 1

    if (isBulkDeleteLoading) {
      isBulkDeleteLoading.value = true
    }

    const deletedIds = []
    const failedIds = []
    let lastError = null

    try {
      // Delete all items (collect successes and failures)
      for (const id of idsToDelete) {
        try {
          // Use custom delete function if provided (for selections/collections), otherwise use mediaApi
          if (deleteMediaFn) {
            await deleteMediaFn(id)
          } else {
            await mediaApi.deleteMedia(id)
            const index = mediaItems.value.findIndex(m => m.id === id)
            if (index !== -1) {
              mediaItems.value.splice(index, 1)
            }
          }
          deletedIds.push(id)
        } catch (error) {
          console.error(`Failed to delete media ${id}:`, error)
          failedIds.push(id)
          lastError = error
          // Continue with next item instead of stopping
        }
      }

      // Clear selections for successfully deleted items
      deletedIds.forEach(id => selectedMediaIds.value.delete(id))

      // Reload media items to get updated pagination (only if we had successes)
      if (deletedIds.length > 0) {
        if (loadMediaItems) {
          try {
            await loadMediaItems()
          } catch (error) {
            console.error('Failed to reload media items after deletion:', error)
            // Don't throw - we'll handle pagination below
          }
        }

        // Reload collection to update media set counts
        if (loadCollection) {
          try {
            await loadCollection()
          } catch (error) {
            console.error('Failed to reload collection after deletion:', error)
            // Don't throw - this is not critical
          }
        }

        // Update set counts (if still needed after collection reload)
        if (updateSetCounts) {
          try {
            await updateSetCounts()
          } catch (error) {
            console.error('Failed to update set counts after deletion:', error)
            // Don't throw - this is not critical
          }
        }

        // Handle pagination after deletion
        if (pagination?.value && goToPage) {
          try {
            const currentTotal = pagination.value.total || 0
            const currentPage = pagination.value.page || 1
            const currentTotalPages = pagination.value.totalPages || 1

            // If no items left, go to page 1
            if (currentTotal === 0) {
              if (resetToFirstPage) {
                await resetToFirstPage()
              }
            } else if (currentPage > currentTotalPages && currentTotalPages > 0) {
              // Current page is out of bounds, go to last available page
              await goToPage(currentTotalPages)
            } else if (
              currentPage === currentPageBeforeDelete &&
              mediaItems?.value?.length === 0 &&
              currentPage > 1
            ) {
              // Current page is empty, go to previous page
              await goToPage(currentPage - 1)
            }
          } catch (error) {
            console.error('Failed to handle pagination after deletion:', error)
            // Don't throw - pagination issues are not critical
          }
        }
      }

      // Show appropriate message
      if (failedIds.length > 0 && deletedIds.length === 0) {
        // All failed
        throw lastError || new Error('Failed to delete all items')
      } else if (failedIds.length > 0) {
        // Some failed
        toast.success('Media deleted', {
          description: `${deletedIds.length} item${deletedIds.length > 1 ? 's' : ''} deleted. ${failedIds.length} item${failedIds.length > 1 ? 's' : ''} failed.`,
        })
      } else {
        // All succeeded
        toast.success('Media deleted', {
          description: `${count} item${count > 1 ? 's' : ''} deleted successfully`,
        })
      }

      showBulkDeleteModal.value = false
    } catch (error) {
      // Only show error if all deletions failed or if it's a different error
      if (deletedIds.length === 0) {
        toast.error('Failed to delete media', {
          description: error instanceof Error ? error.message : 'An error occurred while deleting media',
        })
      }
      // If some succeeded, the success message above was already shown
    } finally {
      if (isBulkDeleteLoading) {
        isBulkDeleteLoading.value = false
      }
    }
  }

  return {
    handleBulkDelete,
    handleConfirmBulkDelete,
  }
}
