/**
 * Admin API composable
 * Handles all admin-related API calls
 */

import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'

export function useAdminApi() {
  /**
   * Get dashboard statistics
   */
  const getDashboardStats = async (productSlug = null) => {
    try {
      const params = productSlug ? { product: productSlug } : {}
      const query = new URLSearchParams(params).toString()
      const response = await apiClient.get(`/v1/admin/dashboard${query ? `?${query}` : ''}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get product-specific statistics
   */
  const getProductStats = async (productSlug) => {
    try {
      const response = await apiClient.get(`/v1/admin/dashboard/products/${productSlug}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get user statistics
   */
  const getUserStats = async (productSlug = null) => {
    try {
      const params = productSlug ? { product: productSlug } : {}
      const query = new URLSearchParams(params).toString()
      const response = await apiClient.get(`/v1/admin/dashboard/users${query ? `?${query}` : ''}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get users list
   */
  const getUsers = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString()
      const response = await apiClient.get(`/v1/admin/users${query ? `?${query}` : ''}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get user details
   */
  const getUser = async (uuid) => {
    try {
      const response = await apiClient.get(`/v1/admin/users/${uuid}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update user
   */
  const updateUser = async (uuid, data) => {
    try {
      const response = await apiClient.patch(`/v1/admin/users/${uuid}`, data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update user role (super admin only)
   */
  const updateUserRole = async (uuid, role) => {
    try {
      const response = await apiClient.patch(`/v1/admin/users/${uuid}/role`, { role })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Suspend user
   */
  const suspendUser = async (uuid) => {
    try {
      const response = await apiClient.patch(`/v1/admin/users/${uuid}/suspend`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Activate user
   */
  const activateUser = async (uuid) => {
    try {
      const response = await apiClient.patch(`/v1/admin/users/${uuid}/activate`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get products list
   */
  const getProducts = async () => {
    try {
      const response = await apiClient.get('/v1/admin/products')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get product details
   */
  const getProduct = async (slug) => {
    try {
      const response = await apiClient.get(`/v1/admin/products/${slug}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update product
   */
  const updateProduct = async (slug, data) => {
    try {
      const response = await apiClient.patch(`/v1/admin/products/${slug}`, data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get users for a product
   */
  const getProductUsers = async (slug) => {
    try {
      const response = await apiClient.get(`/v1/admin/products/${slug}/users`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get product statistics
   */
  const getProductStatsForProduct = async (slug) => {
    try {
      const response = await apiClient.get(`/v1/admin/products/${slug}/stats`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get early access users
   */
  const getEarlyAccessUsers = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString()
      const response = await apiClient.get(`/v1/admin/early-access${query ? `?${query}` : ''}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get early access details
   */
  const getEarlyAccess = async (uuid) => {
    try {
      const response = await apiClient.get(`/v1/admin/early-access/${uuid}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Grant early access
   */
  const grantEarlyAccess = async (userUuid, rewards) => {
    try {
      const response = await apiClient.post('/v1/admin/early-access', {
        user_uuid: userUuid,
        ...rewards,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update early access
   */
  const updateEarlyAccess = async (uuid, rewards) => {
    try {
      const response = await apiClient.patch(`/v1/admin/early-access/${uuid}`, rewards)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Revoke early access
   */
  const revokeEarlyAccess = async (uuid) => {
    try {
      const response = await apiClient.delete(`/v1/admin/early-access/${uuid}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Rollout feature to early access users
   */
  const rolloutFeature = async (feature, options = {}) => {
    try {
      const response = await apiClient.post('/v1/admin/early-access/rollout-feature', {
        feature,
        ...options,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update release version
   */
  const updateReleaseVersion = async (version) => {
    try {
      const response = await apiClient.post('/v1/admin/early-access/release-version', { version })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get early access requests
   */
  const getEarlyAccessRequests = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString()
      const response = await apiClient.get(`/v1/admin/early-access/requests${query ? `?${query}` : ''}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get early access request details
   */
  const getEarlyAccessRequest = async (uuid) => {
    try {
      const response = await apiClient.get(`/v1/admin/early-access/requests/${uuid}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Approve early access request
   */
  const approveEarlyAccessRequest = async (uuid, rewards) => {
    try {
      const response = await apiClient.post(`/v1/admin/early-access/requests/${uuid}/approve`, rewards)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Reject early access request
   */
  const rejectEarlyAccessRequest = async (uuid, rejectionReason = null) => {
    try {
      const response = await apiClient.post(`/v1/admin/early-access/requests/${uuid}/reject`, {
        rejection_reason: rejectionReason,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get activity logs
   */
  const getActivityLogs = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString()
      const response = await apiClient.get(`/v1/admin/analytics/activity${query ? `?${query}` : ''}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get user activity
   */
  const getUserActivity = async (userUuid) => {
    try {
      const response = await apiClient.get(`/v1/admin/analytics/users/${userUuid}/activity`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get product activity
   */
  const getProductActivity = async (productSlug) => {
    try {
      const response = await apiClient.get(`/v1/admin/analytics/products/${productSlug}/activity`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get user activity logs (super admin only)
   */
  const getUserActivityLogs = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString()
      const response = await apiClient.get(`/v1/admin/activity-logs/users${query ? `?${query}` : ''}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get admin activity logs (super admin only)
   */
  const getAdminActivityLogs = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString()
      const response = await apiClient.get(`/v1/admin/activity-logs/admins${query ? `?${query}` : ''}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  return {
    getDashboardStats,
    getProductStats,
    getUserStats,
    getUsers,
    getUser,
    updateUser,
    updateUserRole,
    suspendUser,
    activateUser,
    getProducts,
    getProduct,
    updateProduct,
    getProductUsers,
    getProductStatsForProduct,
    getEarlyAccessUsers,
    getEarlyAccess,
    grantEarlyAccess,
    updateEarlyAccess,
    revokeEarlyAccess,
    rolloutFeature,
    updateReleaseVersion,
    getEarlyAccessRequests,
    getEarlyAccessRequest,
    approveEarlyAccessRequest,
    rejectEarlyAccessRequest,
    getActivityLogs,
    getUserActivity,
    getProductActivity,
    getUserActivityLogs,
    getAdminActivityLogs,
  }
}
