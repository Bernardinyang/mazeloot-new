import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestRoute = to.matched.some(record => record.meta.isGuestRoute)

  // Check authentication status
  const hasUser = !!userStore.user
  const hasToken = !!userStore.token
  const isAuthenticated = hasUser && hasToken

  // Handle protected routes (requires authentication)
  if (requiresAuth) {
    if (!isAuthenticated) {
      // User doesn't have user and token, redirect to login
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

  // Handle guest routes (login, register, etc.)
  if (isGuestRoute) {
    if (isAuthenticated) {
      // User is authenticated but trying to access guest route, redirect to overview
      next({ name: 'overview' })
      return
    }
    // User is not authenticated, allow access to guest routes
    next()
    return
  }

  // Public routes (no auth required, no redirect needed)
  next()
})

// Error handling for route navigation
router.onError(error => {
  console.error('Router error:', error)
})

export default router
