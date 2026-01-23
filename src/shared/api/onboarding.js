/**
 * Onboarding API Client
 */

import { apiClient } from './client'

export const useOnboardingApi = () => {
  /**
   * Generate onboarding token
   */
  const generateToken = async (productUuid) => {
    const response = await apiClient.post('/v1/onboarding/token', {
      product_uuid: productUuid,
    })
    return response.data
  }

  /**
   * Verify token
   */
  const verifyToken = async (token) => {
    const response = await apiClient.get('/v1/onboarding/verify-token', {
      params: { token },
    })
    return response.data
  }

  /**
   * Get onboarding status
   */
  const getStatus = async () => {
    const response = await apiClient.get('/v1/onboarding/status')
    return response.data
  }

  /**
   * Complete onboarding step
   */
  const completeStep = async (productUuid, step, data, token) => {
    const response = await apiClient.post('/v1/onboarding/step', {
      product_uuid: productUuid,
      step,
      token,
      data,
    })
    return response.data
  }

  /**
   * Complete onboarding
   */
  const complete = async (productUuid, token) => {
    const response = await apiClient.post('/v1/onboarding/complete', {
      product_uuid: productUuid,
      token,
    })
    return response.data
  }

  /**
   * Validate domain (Memora-specific)
   */
  const validateDomain = async (domain) => {
    const response = await apiClient.post('/v1/onboarding/memora/validate-domain', {
      domain,
    })
    return response.data
  }

  /**
   * Generate product selection token
   */
  const generateProductSelectionToken = async () => {
    const response = await apiClient.post('/v1/onboarding/product-selection-token')
    return response.data
  }

  return {
    generateToken,
    verifyToken,
    getStatus,
    completeStep,
    complete,
    validateDomain,
    generateProductSelectionToken,
  }
}
