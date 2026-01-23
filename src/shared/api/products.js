/**
 * Products API Client
 */

import { apiClient } from './client'

export const useProductsApi = () => {
  /**
   * Get all active products
   */
  const getProducts = async () => {
    const response = await apiClient.get('/v1/products')
    return response.data
  }

  /**
   * Get product by slug
   */
  const getProduct = async (slug) => {
    const response = await apiClient.get(`/v1/products/${slug}`)
    return response.data
  }

  /**
   * Get user's selected products
   */
  const getSelectedProducts = async () => {
    const response = await apiClient.get('/v1/products/selected')
    return response.data
  }

  /**
   * Select products
   */
  const selectProducts = async (productUuids, token = null) => {
    const payload = { products: productUuids }
    if (token) {
      payload.token = token
    }
    const response = await apiClient.post('/v1/products/select', payload)
    return response.data
  }

  return {
    getProducts,
    getProduct,
    getSelectedProducts,
    selectProducts,
  }
}
