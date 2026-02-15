import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import { routes } from './routes'
import { useUserStore } from '@/shared/stores/user'
import { useAuthApi } from '@/shared/api/auth'
import { useOnboardingApi } from '@/shared/api/onboarding'
import { setPostAuthRedirect } from '@/shared/utils/localStorage'

export const isRouteLoading = ref(false)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (from.path === to.path && from.name === to.name && !window.location.hash) return false
    return { top: 0 }
  },
})

// Route exemptions that skip onboarding checks
const EXEMPT_ROUTES = ['suspended', 'onboarding', 'overview', 'overview-account', 'overview-account-general', 'overview-account-billing', 'overview-account-refer', 'productSelection', 'admin', 'admin-dashboard', 'admin-users', 'admin-user-show', 'admin-products', 'admin-product-show', 'admin-pricing', 'admin-pricing-tier-create', 'admin-pricing-tier-edit', 'admin-pricing-tier-view', 'admin-early-access', 'admin-early-access-show', 'admin-analytics', 'admin-activity-logs-users', 'admin-activity-logs-admins', 'admin-faq', 'admin-faq-create', 'admin-faq-edit']

// Cache for products and onboarding status (5 minute TTL)
const cache = {
  products: { data: null, timestamp: 0 },
  onboarding: { data: null, timestamp: 0 },
  TTL: 5 * 60 * 1000, // 5 minutes
}

/**
 * Check if cache is valid
 */
const isCacheValid = (cacheEntry) => {
  return cacheEntry?.data && (Date.now() - cacheEntry.timestamp) < cache.TTL
}

/**
 * Invalidate cache (call after mutations like completing onboarding)
 * This ensures fresh data is fetched on next navigation
 */
export const invalidateRouterCache = () => {
  cache.products = { data: null, timestamp: 0 }
  cache.onboarding = { data: null, timestamp: 0 }
}

/**
 * Get product slug from product object
 */
const getProductSlug = (product) => product?.slug || product?.product?.slug

/**
 * Get product UUID from product object
 */
const getProductUuid = (product) => product?.uuid || product?.product?.uuid

/**
 * Normalize product slug for comparison (handles underscore/hyphen variations)
 */
const normalizeProductSlug = (slug) => {
  if (!slug) return null
  return String(slug).replace(/[_-]/g, '-').toLowerCase()
}

/**
 * Build product route map dynamically from selected products
 */
const buildProductRouteMap = (selectedProducts) => {
  const routeMap = {}
  selectedProducts.forEach((product) => {
    const slug = getProductSlug(product)
    if (slug) {
      const routePrefix = `/${slug}/`
      routeMap[routePrefix] = slug
    }
  })
  return routeMap
}

/**
 * Extract product slug from route path using dynamic product route map
 */
const getProductSlugFromRoute = (path, selectedProducts) => {
  const routeMap = buildProductRouteMap(selectedProducts || [])
  for (const [routePrefix, productSlug] of Object.entries(routeMap)) {
    if (path.startsWith(routePrefix)) return productSlug
  }
  return null
}

/**
 * Check if product onboarding is completed
 */
const isProductOnboardingCompleted = (productUuid, onboardingStatus) => {
  const status = onboardingStatus.find((s) => s.product_uuid === productUuid)
  return status?.completed_at != null
}

router.beforeEach(async (to, from, next) => {
  isRouteLoading.value = true
  const userStore = useUserStore()
  const authApi = useAuthApi()
  const onboardingApi = useOnboardingApi()

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth === true)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin === true)
  const requiresUser = to.matched.some((record) => record.meta.requiresUser === true)
  const isGuestRoute = to.matched.some((record) => record.meta.isGuestRoute === true)
  const isPublicRoute = to.matched.some((record) => record.meta.requiresAuth === false)

  // Public routes - allow immediately
  if (isPublicRoute) {
    next()
    return
  }

  // User routes - forbid admins from accessing user routes
  if (requiresUser) {
    if (userStore.isAuthenticated && userStore.isAdmin) {
      next({ name: 'admin-dashboard' })
      return
    }
  }

  // Admin routes - check admin access (before guest/auth checks)
  if (requiresAdmin) {
    if (!userStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }

    if (!userStore.isAdmin) {
      next({ name: 'overview' })
      return
    }
  }

  // Guest routes - check authentication
  if (isGuestRoute) {
    if (userStore.isAuthenticated) {
      // Redirect admins to admin dashboard, users to overview
      next(userStore.isAdmin ? { name: 'admin-dashboard' } : { name: 'overview' })
    } else {
      next()
    }
    return
  }

  // Authenticated routes
  if (requiresAuth) {
    // Redirect to login if not authenticated
    if (!userStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }

    // Admins skip all product selection and onboarding logic
    if (userStore.isAdmin) {
      // Block admins from accessing product selection or onboarding routes
      if (to.name === 'productSelection' || to.name === 'onboarding') {
        next({ name: 'admin-dashboard' })
        return
      }
      // Allow admins to proceed to admin routes or any other route
      next()
      return
    }

    // Non-admin: ensure we have user status, then redirect if suspended
    if (to.name !== 'suspended') {
      if (!userStore.user?.status) {
        try {
          const data = await authApi.getUser()
          if (data?.user) {
            userStore.updateUser({ ...data.user })
          }
        } catch {
          // ignore
        }
      }
      if (userStore.user?.status?.name === 'suspended') {
        next({ name: 'suspended' })
        return
      }
    }

    // Skip fetching for exempt routes (use cached data if available)
    const shouldFetch = !EXEMPT_ROUTES.includes(to.name)

    // Fetch user state (with caching) - only for non-admin users
    if (shouldFetch) {
      const fetchPromises = []

      // Use cache if valid, otherwise fetch
      if (isCacheValid(cache.products)) {
        userStore.selectedProducts = cache.products.data
      } else {
        fetchPromises.push(
          userStore.fetchSelectedProducts().then((products) => {
            cache.products = { data: products, timestamp: Date.now() }
            return products
          })
        )
      }

      if (isCacheValid(cache.onboarding)) {
        userStore.onboardingStatus = cache.onboarding.data
      } else {
        fetchPromises.push(
          userStore.fetchOnboardingStatus().then((status) => {
            cache.onboarding = { data: status, timestamp: Date.now() }
            return status
          })
        )
      }

      // Wait for any fetches
      if (fetchPromises.length > 0) {
        await Promise.all(fetchPromises)
      }
    }
    // For exempt routes, use existing store data (no fetch needed)

    // Product selection and onboarding checks (only for non-admin users)
    {
      // Check product selection requirement
      if (!EXEMPT_ROUTES.includes(to.name) && userStore.needsProductSelection) {
        try {
          setPostAuthRedirect({ name: to.name, params: to.params, query: to.query })
          const tokenData = await onboardingApi.generateProductSelectionToken()
          next({ name: 'productSelection', params: { token: tokenData.token } })
          return
        } catch (err) {
          console.error('Failed to generate product selection token:', err)
          next()
          return
        }
      }

      // Check product-specific onboarding requirement
      if (!EXEMPT_ROUTES.includes(to.name)) {
        const routeProductSlug = getProductSlugFromRoute(to.path, userStore.selectedProducts)

        if (routeProductSlug) {
          const normalizedRouteSlug = normalizeProductSlug(routeProductSlug)
          const routeProduct = userStore.selectedProducts.find((p) => {
            const productSlug = normalizeProductSlug(getProductSlug(p))
            return productSlug === normalizedRouteSlug
          })

          if (routeProduct) {
            const productUuid = getProductUuid(routeProduct)

            if (!isProductOnboardingCompleted(productUuid, userStore.onboardingStatus)) {
              try {
                setPostAuthRedirect({ name: to.name, params: to.params, query: to.query })
                const tokenData = await onboardingApi.generateToken(productUuid)
                const productSlug = getProductSlug(routeProduct)
                next({ name: 'onboarding', params: { productSlug, token: tokenData.token } })
                return
              } catch (err) {
                console.error('Failed to generate onboarding token:', err)
                next()
                return
              }
            }
          }
        }
      }
    }

    // Verify tokens for protected routes (only for non-admin users)
    if (to.name === 'productSelection' || to.name === 'onboarding') {
      const token = to.params.token
      if (!token) {
        next({ name: 'overview' })
        return
      }

      try {
        const isValid = await onboardingApi.verifyToken(token)
        if (!isValid?.valid) {
          next({ name: 'overview' })
          return
        }
      } catch (err) {
        console.error('Failed to verify token:', err)
        next({ name: 'overview' })
        return
      }
    }

    // Redirect new users from memora dashboard (only for non-admin users)
    if (to.name === 'memoraDashboard' && userStore.isNewUser) {
      next({ name: 'gettingStarted' })
      return
    }

    // Allow navigation
    next()
    return
  }

  // Default: allow navigation
  next()
})

router.afterEach(() => {
  isRouteLoading.value = false
})

router.onError(() => {
  isRouteLoading.value = false
})

export default router
