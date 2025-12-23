import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * Navigation guard middleware
 * Prevents guests from accessing authenticated routes and vice versa
 */
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some(record => record.meta.isGuestRoute)

  // Use the store's isAuthenticated computed property for consistency
  const isAuthenticated = userStore.isAuthenticated

  if (requiresAuth) {
    if (!isAuthenticated) {
      // Guest trying to access authenticated route - redirect to login
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
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
