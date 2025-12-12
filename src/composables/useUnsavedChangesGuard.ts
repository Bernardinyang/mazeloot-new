/**
 * Composable for handling unsaved changes navigation guard
 * Provides reusable logic for intercepting navigation when there are unsaved changes
 */

import { ref, type Ref, type ComputedRef } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export interface UseUnsavedChangesGuardOptions {
  hasUnsavedChanges: Ref<boolean> | ComputedRef<boolean>
  isSubmitting: Ref<boolean>
  isSaving: Ref<boolean> | ComputedRef<boolean>
  saveFunction: () => Promise<boolean>
  discardFunction?: () => void
  showUnsavedChangesModal: Ref<boolean>
}

export function useUnsavedChangesGuard(options: UseUnsavedChangesGuardOptions) {
  const router = useRouter()
  const {
    hasUnsavedChanges,
    isSubmitting,
    isSaving,
    saveFunction,
    discardFunction,
    showUnsavedChangesModal,
  } = options

  let pendingNavigation: (() => void) | null = null
  let targetRoute: RouteLocationNormalized | null = null

  /**
   * Handle save and leave action
   */
  const handleSaveAndLeave = async () => {
    const success = await saveFunction()
    if (success) {
      showUnsavedChangesModal.value = false
      if (targetRoute) {
        // Navigate to the target route after saving
        router.push(targetRoute)
        targetRoute = null
        pendingNavigation = null
      } else if (pendingNavigation) {
        // Fallback to next() if targetRoute is not available
        pendingNavigation()
        pendingNavigation = null
      }
    }
  }

  /**
   * Handle discard and leave action
   */
  const handleDiscardAndLeave = () => {
    // Reset form data to original state if discard function is provided
    if (discardFunction) {
      discardFunction()
    }
    showUnsavedChangesModal.value = false
    if (targetRoute) {
      // Navigate to the target route after discarding
      router.push(targetRoute)
      targetRoute = null
      pendingNavigation = null
    } else if (pendingNavigation) {
      // Fallback to next() if targetRoute is not available
      pendingNavigation()
      pendingNavigation = null
    }
  }

  /**
   * Handle cancel navigation action
   */
  const handleCancelNavigation = () => {
    pendingNavigation = null
    targetRoute = null
  }

  /**
   * Set up route guard to intercept navigation when there are unsaved changes
   */
  onBeforeRouteLeave(
    (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      if (hasUnsavedChanges.value && !isSubmitting.value && !isSaving.value) {
        showUnsavedChangesModal.value = true
        targetRoute = to
        pendingNavigation = () => next()
        // Prevent navigation for now
        next(false)
      } else {
        // Allow navigation if no unsaved changes
        next()
      }
    }
  )

  return {
    handleSaveAndLeave,
    handleDiscardAndLeave,
    handleCancelNavigation,
  }
}
