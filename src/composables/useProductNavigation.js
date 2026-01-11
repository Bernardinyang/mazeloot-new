/**
 * Composable for product-specific navigation
 * Returns navigation items based on the current product/route
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PRODUCT_NAVIGATION, PRODUCT_NAVIGATION_LABELS } from '@/constants/productNavigation'
import { usePresetStore } from '@/stores/preset'
import { useWatermarkStore } from '@/stores/watermark'

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

/**
 * Composable for product navigation
 */
export function useProductNavigation() {
  const route = useRoute()
  const presetStore = usePresetStore()
  const watermarkStore = useWatermarkStore()

  const currentProduct = computed(() => {
    return getProductFromRoute(route.path)
  })

  const navigationItems = computed(() => {
    const items = PRODUCT_NAVIGATION[currentProduct.value] || PRODUCT_NAVIGATION.default
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
