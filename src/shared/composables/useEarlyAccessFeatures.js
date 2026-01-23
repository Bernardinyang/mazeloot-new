/**
 * Early Access Features Composable
 * Provides utilities for checking early access features
 */

import { computed } from 'vue'
import { useUserStore } from '@/shared/stores/user'
import { useAuthApi } from '@/shared/api/auth'

export function useEarlyAccessFeatures() {
  const userStore = useUserStore()
  const authApi = useAuthApi()

  const hasEarlyAccess = computed(() => {
    return userStore.hasEarlyAccess
  })

  const availableFeatures = computed(() => {
    return userStore.earlyAccessFeatures
  })

  const releaseVersion = computed(() => {
    return userStore.earlyAccessRewards?.release_version ?? null
  })

  const hasFeature = (feature) => {
    if (!hasEarlyAccess.value) return false
    return availableFeatures.value.includes(feature)
  }

  const checkFeature = async (feature) => {
    try {
      const response = await authApi.checkFeature?.(feature)
      return response?.has_access ?? false
    } catch {
      return false
    }
  }

  const getRewards = () => {
    return userStore.earlyAccessRewards
  }

  return {
    hasEarlyAccess,
    availableFeatures,
    releaseVersion,
    hasFeature,
    checkFeature,
    getRewards,
  }
}
