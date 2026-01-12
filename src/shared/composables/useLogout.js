/**
 * useLogout Composable
 * Handles user logout by clearing all stores and localStorage, then redirecting to login
 */

import { useRouter } from 'vue-router'
import { useUserStore } from '@/shared/stores/user'
import { useGalleryStore } from '@/shared/stores/gallery'
import { useWatermarkStore } from '@/domains/memora/stores/watermark'
import { useProjectStore } from '@/domains/memora/stores/project'
import { usePresetStore } from '@/domains/memora/stores/preset'
import { useSelectionStore } from '@/domains/memora/stores/selection'
import { useProofingStore } from '@/domains/memora/stores/proofing'
import { useCollectionMediaSetsSidebarStore } from '@/domains/memora/stores/collectionMediaSetsSidebar'
import { useSelectionMediaSetsSidebarStore } from '@/domains/memora/stores/selectionMediaSetsSidebar'
import { toast } from '@/shared/utils/toast'

export function useLogout() {
  const router = useRouter()
  const userStore = useUserStore()
  const galleryStore = useGalleryStore()
  const watermarkStore = useWatermarkStore()
  const projectStore = useProjectStore()
  const presetStore = usePresetStore()
  const selectionStore = useSelectionStore()
  const proofingStore = useProofingStore()
  const collectionMediaSetsSidebarStore = useCollectionMediaSetsSidebarStore()
  const selectionMediaSetsSidebarStore = useSelectionMediaSetsSidebarStore()

  /**
   * Clear all user-related data from stores
   */
  const clearAllStores = () => {
    try {
      // Clear user store (handles its own localStorage via watchers)
      userStore.clearAuth()
    } catch (e) {}

    try {
      // Clear gallery store
      galleryStore.collections = []
      galleryStore.starredCollectionIds = new Set()
      galleryStore.error = null
    } catch (e) {}

    try {
      // Clear watermark store
      watermarkStore.watermarks = []
      watermarkStore.currentWatermark = null
      watermarkStore.error = null
    } catch (e) {}

    try {
      // Clear project store
      projectStore.projects = []
      projectStore.currentProject = null
      projectStore.error = null
      projectStore.isLoading = false
    } catch (e) {}

    try {
      // Clear preset store
      presetStore.presets = []
      presetStore.currentPreset = null
    } catch (e) {}

    try {
      // Clear selection store
      selectionStore.selections = []
      selectionStore.currentSelection = null
      selectionStore.selectedMedia = []
      selectionStore.error = null
      selectionStore.isLoading = false
    } catch (e) {}

    try {
      // Clear proofing store
      proofingStore.proofings = []
      proofingStore.currentProofing = null
      proofingStore.feedback = []
      proofingStore.revisions = []
      proofingStore.error = null
      proofingStore.isLoading = false
    } catch (e) {}

    try {
      // Clear sidebar stores
      collectionMediaSetsSidebarStore.items = []
      selectionMediaSetsSidebarStore.items = []
    } catch (e) {}

    // Note: User store watchers handle localStorage cleanup automatically
    // when clearAuth() sets user.value and token.value to null
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
