import { apiClient } from './client'
import { parseError } from '@/shared/utils/errors'

/**
 * Save selected products for the authenticated user
 */
export async function saveProductPreferences(products) {
  try {
    const response = await apiClient.post('/v1/product-preferences', {
      products,
    })
    return response.data
  } catch (error) {
    throw parseError(error)
  }
}

/**
 * Get user's selected products
 */
export async function getProductPreferences() {
  try {
    const response = await apiClient.get('/v1/product-preferences')
    return response.data
  } catch (error) {
    throw parseError(error)
  }
}

/**
 * Initialize product setup
 */
export async function setupProduct(productId, data) {
  try {
    const response = await apiClient.post(`/v1/product-preferences/${productId}/setup`, data)
    return response.data
  } catch (error) {
    throw parseError(error)
  }
}

/**
 * Check domain availability
 */
export async function checkDomainAvailability(domain) {
  try {
    const queryParams = new URLSearchParams({ domain })
    const response = await apiClient.get(`/v1/product-preferences/domain/check?${queryParams.toString()}`)
    return response.data
  } catch (error) {
    throw parseError(error)
  }
}
