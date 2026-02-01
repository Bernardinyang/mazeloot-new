/**
 * Composable for product-specific navigation
 * Returns navigation items based on the current product/route
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PRODUCT_NAVIGATION, PRODUCT_NAVIGATION_LABELS } from '@/domains/memora/constants/productNavigation'
import { usePresetStore } from '@/domains/memora/stores/preset'
import { useWatermarkStore } from '@/domains/memora/stores/watermark'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'
import { useUserStore } from '@/shared/stores/user'

/**
 * Detect the current product from the route
 */
export function getProductFromRoute(path) {
  if (path.startsWith('/dashboard/memora') || path.startsWith('/memora')) {
    return 'memora'
  }
  if (path.startsWith('/overview') || path === '/dashboard') {
    return 'overview'
  }
  if (path.startsWith('/collections')) {
    return 'collections'
  }
  return 'default'
}

function filterByFeatures(items, hasFeature, isStarterPlan) {
  if (!items || !Array.isArray(items)) return items
  return items
    .filter(item => {
      if (item.hideForStarter && isStarterPlan) return false
      if (item.requiredFeature && !hasFeature(item.requiredFeature)) return false
      if (item.items) {
        const filteredSub = filterByFeatures(item.items, hasFeature, isStarterPlan)
        if (filteredSub.length === 0) return false
      }
      return true
    })
    .map(item => {
      if (item.items) {
        return { ...item, items: filterByFeatures(item.items, hasFeature, isStarterPlan) }
      }
      return item
    })
}

/**
 * Composable for product navigation
 */
export function useProductNavigation() {
  const route = useRoute()
  const presetStore = usePresetStore()
  const watermarkStore = useWatermarkStore()
  const { hasFeature } = useMemoraFeatures()
  const userStore = useUserStore()
  const isStarterPlan = computed(() => (userStore.user?.memora_tier ?? 'starter') === 'starter')

  const currentProduct = computed(() => {
    return getProductFromRoute(route.path)
  })

  const navigationItems = computed(() => {
    let items = PRODUCT_NAVIGATION[currentProduct.value] || PRODUCT_NAVIGATION.default
    if (currentProduct.value === 'memora' && Array.isArray(items)) {
      items = filterByFeatures(items, hasFeature, isStarterPlan.value)
    }
    return items
  })

  const navigationLabel = computed(() => {
    return PRODUCT_NAVIGATION_LABELS[currentProduct.value] || PRODUCT_NAVIGATION_LABELS.default
  })

  /**
   * Get navigation items for a specific product
   */
  const getNavigationForProduct = productId => {
    return PRODUCT_NAVIGATION[productId] || PRODUCT_NAVIGATION.default
  }

  /**
   * Get navigation label for a specific product
   */
  const getNavigationLabelForProduct = productId => {
    return PRODUCT_NAVIGATION_LABELS[productId] || PRODUCT_NAVIGATION_LABELS.default
  }

  return {
    currentProduct,
    navigationItems,
    navigationLabel,
    getNavigationForProduct,
    getNavigationLabelForProduct,
  }
}
