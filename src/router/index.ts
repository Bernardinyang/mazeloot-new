import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // TODO: Implement actual authentication check
  // const isAuthenticated = checkAuth() // Replace with your auth logic
  
  if (requiresAuth) {
    // For now, allow access. Later, check authentication
    // if (!isAuthenticated) {
    //   next({ name: 'login', query: { redirect: to.fullPath } })
    // } else {
    //   next()
    // }
    next()
  } else {
    next()
  }
})

// Error handling for route navigation
router.onError((error) => {
  console.error('Router error:', error)
})

export default router

