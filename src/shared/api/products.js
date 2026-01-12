import { apiClient } from './client'
import { parseError } from '@/shared/utils/errors'

/**
 * Get all active products
 */
export async function getProducts() {
  try {
    const response = await apiClient.get('/v1/products')
    return response.data
  } catch (error) {
    throw parseError(error)
  }
}

/**
 * Get product by slug
 */
export async function getProduct(slug) {
  try {
    const response = await apiClient.get(`/v1/products/${slug}`)
    return response.data
  } catch (error) {
    throw parseError(error)
  }
}
