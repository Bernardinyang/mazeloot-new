import { ref } from 'vue'
import { getProductPreferences } from '@/shared/api/productPreferences'

const domainCache = ref(null)
const isLoadingDomain = ref(false)

/**
 * Get user's domain for Memora product
 * @returns {Promise<string>} User's domain or 'default' as fallback
 */
export async function getUserDomain() {
  if (domainCache.value !== null) {
    return domainCache.value
  }

  if (isLoadingDomain.value) {
    // Wait for ongoing request
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!isLoadingDomain.value && domainCache.value !== null) {
          clearInterval(checkInterval)
          resolve(domainCache.value)
        }
      }, 100)
    })
  }

  isLoadingDomain.value = true
  try {
    const response = await getProductPreferences()
    // Response structure: { data: [...] } or just [...]
    const preferences = Array.isArray(response) ? response : (response.data || [])
    const memoraPreference = preferences.find(p => p.product?.slug === 'memora')
    const domain = memoraPreference?.domain || 'default'
    domainCache.value = domain
    return domain
  } catch (error) {
    console.error('Failed to get user domain:', error)
    return 'default'
  } finally {
    isLoadingDomain.value = false
  }
}

/**
 * Clear domain cache (useful after domain updates)
 */
export function clearDomainCache() {
  domainCache.value = null
}