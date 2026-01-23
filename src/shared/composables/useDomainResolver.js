/**
 * Domain Resolver Composable
 * Resolves user by domain for Memora public routes
 */

import { ref } from 'vue'
import { apiClient } from '@/shared/api/client'

export const useDomainResolver = () => {
  const domainCache = ref(new Map())

  /**
   * Resolve domain to user UUID
   */
  const resolveDomain = async (domain) => {
    // Check cache first
    if (domainCache.value.has(domain)) {
      return domainCache.value.get(domain)
    }

    try {
      // Fetch user by domain from backend
      const response = await apiClient.get(`/v1/memora/public/settings/by-domain/${domain}`, {
        skipAuth: true,
      })

      const userUuid = response.data?.user_uuid
      if (userUuid) {
        domainCache.value.set(domain, userUuid)
        return userUuid
      }

      return null
    } catch (error) {
      console.error('Failed to resolve domain:', error)
      return null
    }
  }

  /**
   * Get user UUID by domain (synchronous if cached)
   */
  const getUserByDomain = (domain) => {
    return domainCache.value.get(domain) || null
  }

  /**
   * Clear domain cache
   */
  const clearCache = () => {
    domainCache.value.clear()
  }

  return {
    resolveDomain,
    getUserByDomain,
    clearCache,
  }
}
