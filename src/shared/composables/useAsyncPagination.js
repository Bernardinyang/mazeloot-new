/**
 * useAsyncPagination Composable
 * Reusable composable for handling async pagination with backend API
 */

import { ref, watch, computed } from 'vue'

/**
 * @param {Function} fetchFn - Async function that fetches data with pagination params
 * @param {Object} options - Configuration options
 * @param {number} options.initialPage - Initial page number (default: 1)
 * @param {number} options.initialPerPage - Initial items per page (default: 10)
 * @param {boolean} options.autoFetch - Whether to fetch on mount (default: true)
 * @param {Array} options.watchForReset - Reactive values that should reset pagination to page 1 when changed
 * @returns {Object} Pagination state and methods
 */
export function useAsyncPagination(fetchFn, options = {}) {
  const { initialPage = 1, initialPerPage = 10, autoFetch = true, watchForReset = [] } = options
  const initialLoading = options.initialLoading ?? !autoFetch

  // Pagination state
  const currentPage = ref(initialPage)
  const perPage = ref(initialPerPage)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  // Data and loading state - show loader on mount until first fetch completes when autoFetch is false
  const data = ref([])
  const isLoading = ref(initialLoading)
  const error = ref(null)

  /**
   * Fetch data with current pagination parameters
   * @param {Object} additionalParams - Additional parameters to pass to fetchFn
   */
  const fetch = async (additionalParams = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const params = {
        page: currentPage.value,
        perPage: perPage.value,
        ...additionalParams,
      }

      const response = await fetchFn(params)

      // Check if response has pagination structure: { data: [...], pagination: {...} }
      if (
        response &&
        typeof response === 'object' &&
        'data' in response &&
        'pagination' in response
      ) {
        data.value = Array.isArray(response.data) ? response.data : []
        pagination.value = {
          page: response.pagination.page || 1,
          limit: response.pagination.limit || perPage.value,
          total: response.pagination.total || 0,
          totalPages: response.pagination.totalPages || 1,
        }
        currentPage.value = response.pagination.page || 1
      } else if (Array.isArray(response)) {
        // Fallback for non-paginated array response (backward compatibility)
        data.value = response
        pagination.value = {
          page: 1,
          limit: perPage.value,
          total: response.length,
          totalPages: Math.ceil(response.length / perPage.value) || 1,
        }
      } else {
        // Unknown response format, treat as empty
        console.warn('Unexpected response format from fetchFn:', response)
        data.value = []
        pagination.value = {
          page: 1,
          limit: perPage.value,
          total: 0,
          totalPages: 1,
        }
      }
    } catch (err) {
      error.value = err
      data.value = []
      pagination.value = {
        page: 1,
        limit: perPage.value,
        total: 0,
        totalPages: 1,
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Change to a specific page
   * @param {number} page - Page number to navigate to
   * @param {boolean} scrollToTop - Whether to scroll to top (default: true)
   */
  const goToPage = async (page, scrollToTop = true) => {
    if (page < 1 || page > pagination.value.totalPages || page === currentPage.value) {
      return
    }

    currentPage.value = page
    await fetch()

    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  /**
   * Go to next page
   */
  const nextPage = async () => {
    if (hasNext.value) {
      await goToPage(currentPage.value + 1)
    }
  }

  /**
   * Go to previous page
   */
  const previousPage = async () => {
    if (hasPrevious.value) {
      await goToPage(currentPage.value - 1)
    }
  }

  /**
   * Reset to first page and refetch
   * @param {Object} additionalParams - Additional parameters to pass to fetchFn
   */
  const resetToFirstPage = async (additionalParams = {}) => {
    currentPage.value = 1
    await fetch(additionalParams)
  }

  /**
   * Update items per page and reset to first page
   * @param {number} newPerPage - New items per page
   */
  const setPerPage = async newPerPage => {
    perPage.value = Math.max(1, newPerPage)
    currentPage.value = 1
    await fetch()
  }

  // Computed properties
  const hasNext = computed(() => currentPage.value < pagination.value.totalPages)
  const hasPrevious = computed(() => currentPage.value > 1)
  const startItem = computed(() => {
    if (pagination.value.total === 0) return 0
    return (currentPage.value - 1) * perPage.value + 1
  })
  const endItem = computed(() => {
    const end = currentPage.value * perPage.value
    return Math.min(end, pagination.value.total)
  })
  const isEmpty = computed(() => !isLoading.value && data.value.length === 0)

  // Watch for reset triggers - reset to page 1 and refetch when watched values change
  if (watchForReset.length > 0) {
    watch(
      watchForReset,
      () => {
        currentPage.value = 1
        // Trigger refetch with new parameters
        fetch()
      },
      { deep: true }
    )
  }

  // Auto-fetch on mount if enabled
  if (autoFetch) {
    fetch()
  }

  return {
    // State
    data,
    pagination,
    currentPage,
    perPage,
    isLoading,
    error,

    // Computed
    hasNext,
    hasPrevious,
    startItem,
    endItem,
    isEmpty,

    // Methods
    fetch,
    goToPage,
    nextPage,
    previousPage,
    resetToFirstPage,
    setPerPage,
  }
}
