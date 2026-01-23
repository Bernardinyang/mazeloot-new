/**
 * Admin Store
 * Manages admin state and dashboard data
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAdminApi } from '@/admin/api/admin'

export const useAdminStore = defineStore('admin', () => {
  const dashboardStats = ref(null)
  const selectedProduct = ref(null)
  const isLoading = ref(false)

  const adminApi = useAdminApi()

  /**
   * Set selected product filter
   */
  const setSelectedProduct = (productSlug) => {
    selectedProduct.value = productSlug
  }

  /**
   * Fetch dashboard statistics
   */
  const fetchDashboardStats = async (productSlug = null) => {
    isLoading.value = true
    try {
      const stats = await adminApi.getDashboardStats(productSlug || selectedProduct.value)
      dashboardStats.value = stats
      return stats
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clear selected product filter
   */
  const clearProductFilter = () => {
    selectedProduct.value = null
  }

  return {
    dashboardStats,
    selectedProduct,
    isLoading,
    setSelectedProduct,
    fetchDashboardStats,
    clearProductFilter,
  }
})
