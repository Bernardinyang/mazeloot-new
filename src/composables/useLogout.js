/**
 * useLogout Composable
 * Handles user logout by clearing all stores and localStorage, then redirecting to login
 */

import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useGalleryStore } from '@/stores/gallery'
import { useWatermarkStore } from '@/stores/watermark'
import { storage } from '@/utils/storage'
import { toast } from 'vue-sonner'

export function useLogout() {
  const router = useRouter()
  const userStore = useUserStore()
  const galleryStore = useGalleryStore()
  const watermarkStore = useWatermarkStore()

  /**
   * Clear all user-related data from stores and localStorage
   */
  const clearAllStores = () => {
    // Clear user store (handles its own localStorage via watchers)
    userStore.clearAuth()

    // Clear gallery store
    galleryStore.collections = []
    galleryStore.starredCollectionIds = new Set()
    galleryStore.error = null

    // Clear watermark store
    watermarkStore.watermarks = []
    watermarkStore.currentWatermark = null
    watermarkStore.error = null

    // Explicitly clear localStorage keys (in case watchers don't fire)
    storage.remove('mazeloot_user')
    storage.remove('mazeloot_token')
    storage.remove('mazeloot_starred_collections')
    storage.remove('mazeloot_watermarks')
    // Note: We keep theme preference (mazeloot_theme) as it's a UI preference
  }

  /**
   * Logout user and clear all stores
   */
  const logout = async () => {
    try {
      // Call user store logout (handles API call)
      await userStore.logout()

      // Clear all stores and localStorage
      clearAllStores()

      // Show success message
      toast.success('Logged out successfully', {
        description: 'You have been logged out of your account.',
      })

      // Redirect to login page
      router.push({ name: 'login' })
    } catch (error) {
      // Even if logout fails, clear local state and redirect
      console.error('Logout error:', error)

      // Force clear all stores
      clearAllStores()

      // Redirect to login
      router.push({ name: 'login' })

      toast.error('Logout error', {
        description: 'An error occurred during logout, but you have been signed out locally.',
      })
    }
  }

  return {
    logout,
  }
}
