import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useUserStore } from '@/shared/stores/user'
import { getProducts } from '@/shared/api/products'

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
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // Check if route explicitly requires auth (must be true, not just truthy)
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth === true)
  const isGuestRoute = to.matched.some(record => record.meta.isGuestRoute === true)
  // Check if route explicitly allows public access
  const isPublicRoute = to.matched.some(record => record.meta.requiresAuth === false)

  // Validate product route format and existence
  const path = to.path
  const pathParts = path.split('/').filter(Boolean)
  const productSlugMatch = path.match(/^\/([^/]+)/)
  const firstSegment = productSlugMatch ? productSlugMatch[1] : null
  
  // Reserved routes that are not products
  const reservedRoutes = ['overview', 'onboarding', 'login', 'register', 'verify-email', 'forgot-password', 'reset-password', 'auth', 'about', 'products', 'pricing', 'contact', 'waitlist', 'cloud-storage', 'closure-request', 'p', 'homepage']
  
  if (firstSegment && !reservedRoutes.includes(firstSegment)) {
    // Check if this might be a product route by fetching products
    // Cache products list to avoid repeated API calls
    if (!router._productsCache) {
      router._productsCache = null
      router._productsLoading = false
    }
    
    // Fetch products if not cached
    const fetchProducts = async () => {
      if (router._productsCache) {
        return router._productsCache
      }
      
      if (router._productsLoading) {
        // Wait for ongoing request
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (!router._productsLoading && router._productsCache) {
              clearInterval(checkInterval)
              resolve(router._productsCache)
            }
          }, 100)
        })
      }
      
      router._productsLoading = true
      try {
        const response = await getProducts()
        const products = Array.isArray(response) ? response : (response.data || [])
        router._productsCache = products
        return products
      } catch (error) {
        console.error('Failed to fetch products:', error)
        router._productsCache = []
        return []
      } finally {
        router._productsLoading = false
      }
    }
    
    // Check if first segment matches a product slug
    const products = await fetchProducts()
    const product = products.find(p => p.slug === firstSegment)
    
    if (product) {
      // This is a product route - validate format
      if (requiresAuth) {
        // Authenticated routes must be: /{productSlug}/...
        // Must have at least 2 segments: productSlug and something else
        if (pathParts.length < 2 || pathParts[0] !== firstSegment) {
          // Invalid format - return 404
          next({ name: 'notFound' })
          return
        }
      } else if (isPublicRoute) {
        // Public routes must be: /{productSlug}/{domainOrUsername}/...
        // Must have at least 3 segments: productSlug, domainOrUsername, and something else
        if (pathParts.length < 3 || pathParts[0] !== firstSegment) {
          // Invalid format - return 404
          next({ name: 'notFound' })
          return
        }
      } else if (pathParts.length >= 2) {
        // Product route but not explicitly authenticated or public - might be invalid
        // Check if route actually exists by checking if it matched any route
        if (to.matched.length === 0) {
          next({ name: 'notFound' })
          return
        }
      }
    } else if (pathParts.length >= 2) {
      // First segment is not a product slug and not reserved, and has multiple segments
      // This looks like an invalid product route - return 404
      // But first check if the route actually matched (might be a valid non-product route)
      if (to.matched.length === 0) {
        next({ name: 'notFound' })
        return
      }
    }
  }
  
  // If route didn't match anything, redirect to 404
  if (to.matched.length === 0 && to.name !== 'notFound') {
    next({ name: 'notFound' })
    return
  }

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
    
    // Check if route requires a specific product
    const productSlug = to.params.productSlug
    if (productSlug && productSlug !== 'memora') {
      // For now, only memora routes are implemented
      // Other products will be handled when their routes are added
      next()
      return
    }
    
    // Redirect new users from memora dashboard to getting started
    if (to.name === 'memoraDashboard' && userStore.isNewUser) {
      next({ name: 'gettingStarted', params: { productSlug: 'memora' } })
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
