/**
 * Pagination composable
 * Handles pagination state and calculations
 */

import { ref, computed } from 'vue'

export interface UsePaginationOptions {
  totalItems: number
  itemsPerPage?: number
  initialPage?: number
}

export function usePagination(options: UsePaginationOptions) {
  const currentPage = ref(options.initialPage || 1)
  const itemsPerPage = ref(options.itemsPerPage || 10)
  const totalItems = ref(options.totalItems)

  /**
   * Total pages
   */
  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage.value)
  })

  /**
   * Current page items range
   */
  const range = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return { start, end }
  })

  /**
   * Check if has next page
   */
  const hasNext = computed(() => {
    return currentPage.value < totalPages.value
  })

  /**
   * Check if has previous page
   */
  const hasPrev = computed(() => {
    return currentPage.value > 1
  })

  /**
   * Go to next page
   */
  const next = () => {
    if (hasNext.value) {
      currentPage.value++
    }
  }

  /**
   * Go to previous page
   */
  const prev = () => {
    if (hasPrev.value) {
      currentPage.value--
    }
  }

  /**
   * Go to specific page
   */
  const goTo = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  /**
   * Update total items
   */
  const updateTotal = (total: number) => {
    totalItems.value = total
    // Reset to page 1 if current page is out of bounds
    const newTotalPages = Math.ceil(total / itemsPerPage.value)
    if (currentPage.value > newTotalPages) {
      currentPage.value = 1
    }
  }

  /**
   * Update items per page
   */
  const updateItemsPerPage = (perPage: number) => {
    itemsPerPage.value = perPage
    // Reset to page 1
    currentPage.value = 1
  }

  /**
   * Reset pagination
   */
  const reset = () => {
    currentPage.value = 1
  }

  return {
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    range,
    hasNext,
    hasPrev,
    next,
    prev,
    goTo,
    updateTotal,
    updateItemsPerPage,
    reset,
  }
}
