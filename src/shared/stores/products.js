/**
 * Products Store
 * Manages product data and state
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductsApi } from '@/shared/api/products'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const isLoading = ref(false)

  const productsApi = useProductsApi()

  /**
   * Fetch all active products
   */
  const fetchProducts = async () => {
    isLoading.value = true
    try {
      const data = await productsApi.getProducts()
      products.value = data || []
      return products.value
    } catch (error) {
      console.error('Failed to fetch products:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get product by slug
   */
  const getProductBySlug = (slug) => {
    return products.value.find((p) => p.slug === slug)
  }

  /**
   * Get product by UUID
   */
  const getProductByUuid = (uuid) => {
    return products.value.find((p) => p.uuid === uuid)
  }

  return {
    products,
    isLoading,
    fetchProducts,
    getProductBySlug,
    getProductByUuid,
  }
})
