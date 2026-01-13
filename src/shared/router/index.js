import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useUserStore } from '@/shared/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top on navigation/reload
    if (savedPosition) {
      return savedPosition
    }
    // Skip scrolling if only query parameters changed (same path)
    if (from.path === to.path && from.name === to.name) {
      return false
    }
    return { top: 0 }
  },
})

/**
 * Navigation guard middleware
 * Prevents guests from accessing authenticated routes and vice versa
 */
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // Check if route explicitly requires auth (must be true, not just truthy)
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth === true)
  const isGuestRoute = to.matched.some(record => record.meta.isGuestRoute === true)
  // Check if route explicitly allows public access
  const isPublicRoute = to.matched.some(record => record.meta.requiresAuth === false)

  // Use the store's isAuthenticated computed property for consistency
  const isAuthenticated = userStore.isAuthenticated

  // If route explicitly allows public access, allow it
  if (isPublicRoute) {
    next()
    return
  }

  if (requiresAuth) {
    if (!isAuthenticated) {
      // Guest trying to access authenticated route - redirect to login
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
      return
    }
    
    // Redirect new users from memora dashboard to getting started
    if (to.name === 'memoraDashboard' && userStore.isNewUser) {
      next({ name: 'gettingStarted' })
      return
    }
    
    // User is authenticated, allow access
    next()
    return
  }

  if (isGuestRoute) {
    if (isAuthenticated) {
      // Authenticated user trying to access guest route - redirect to overview
      next({ name: 'overview' })
      return
    }
    // Guest user accessing guest route - allow access
    next()
    return
  }

  // Public routes (no auth required, no redirect needed)
  next()
})

// Error handling for route navigation
router.onError(error => {})

export default router
