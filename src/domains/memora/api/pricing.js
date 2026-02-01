/**
 * Memora pricing API (fixed tiers + Build Your Own)
 */

import { apiClient } from '@/shared/api/client'

export const usePricingApi = () => {
  const getTiers = async () => {
    const response = await apiClient.get('/v1/pricing/tiers', { skipAuth: true })
    return response.data
  }

  const getBuildYourOwnConfig = async () => {
    const response = await apiClient.get('/v1/pricing/build-your-own', { skipAuth: true })
    return response.data
  }

  const getStripeConfig = async () => {
    const response = await apiClient.get('/v1/pricing/config', { skipAuth: true })
    return response.data
  }

  return {
    getTiers,
    getBuildYourOwnConfig,
    getStripeConfig,
  }
}

export const useSubscriptionApi = () => {
  const getCheckoutOptions = async () => {
    const response = await apiClient.get('/v1/memora/subscription/checkout-options')
    return response.data?.data ?? response.data
  }

  const getOrderSummary = async (tier, billingCycle, currency, byoAddons = null) => {
    const params = { tier, billing_cycle: billingCycle, currency }
    if (byoAddons && typeof byoAddons === 'object' && Object.keys(byoAddons).length > 0) {
      params.byo_addons = JSON.stringify(byoAddons)
    }
    const response = await apiClient.get('/v1/memora/subscription/order-summary', { params })
    return response.data?.data ?? response.data
  }

  const getPreview = async (tier, billingCycle, currency, byoAddons = null) => {
    const params = { tier, billing_cycle: billingCycle, currency }
    if (byoAddons && typeof byoAddons === 'object' && Object.keys(byoAddons).length > 0) {
      params.byo_addons = JSON.stringify(byoAddons)
    }
    const response = await apiClient.get('/v1/memora/subscription/preview', { params })
    return response.data?.data ?? response.data
  }

  const createCheckout = async (tier, billingCycle, paymentProvider, currency, byoAddons = null) => {
    const response = await apiClient.post('/v1/memora/subscription/checkout', {
      tier,
      billing_cycle: billingCycle,
      payment_provider: paymentProvider,
      currency,
      byo_addons: byoAddons,
    })
    return response.data?.data ?? response.data
  }

  const createPortalSession = async () => {
    const response = await apiClient.post('/v1/memora/subscription/portal')
    return response.data
  }

  const getStatus = async () => {
    const response = await apiClient.get('/v1/memora/subscription/status')
    return response.data?.data ?? response.data
  }

  const getCanDowngrade = async () => {
    const response = await apiClient.get('/v1/memora/subscription/can-downgrade')
    return response.data?.data ?? response.data
  }

  const cancelSubscription = async () => {
    const response = await apiClient.post('/v1/memora/subscription/cancel')
    return response.data?.data ?? response.data
  }

  const getHistory = async (limit = 20) => {
    const response = await apiClient.get('/v1/memora/subscription/history', { params: { limit } })
    const raw = response.data?.data ?? response.data
    return Array.isArray(raw) ? raw : []
  }

  const getUsage = async () => {
    const response = await apiClient.get('/v1/memora/subscription/usage')
    return response.data?.data ?? response.data
  }

  const completeTestCheckout = async (sessionId, paymentProvider = null) => {
    const body = { session_id: sessionId }
    if (paymentProvider) body.payment_provider = paymentProvider
    const response = await apiClient.post('/v1/memora/subscription/complete-test-checkout', body)
    return response.data
  }

  return {
    getCheckoutOptions,
    getOrderSummary,
    getPreview,
    createCheckout,
    createPortalSession,
    getStatus,
    getCanDowngrade,
    cancelSubscription,
    getHistory,
    getUsage,
    completeTestCheckout,
  }
}
