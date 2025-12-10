/**
 * Composable for product-specific navigation
 * Returns navigation items based on the current product/route
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { NavItem } from '@/types/navigation'
import { PRODUCT_NAVIGATION, PRODUCT_NAVIGATION_LABELS } from '@/constants/productNavigation'

export type ProductId = 'memora' | 'overview' | 'collections' | 'default'

/**
 * Detect the current product from the route
 */
export function getProductFromRoute(path: string): ProductId {
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

  const currentProduct = computed<ProductId>(() => {
    return getProductFromRoute(route.path)
  })

  const navigationItems = computed<NavItem[]>(() => {
    return PRODUCT_NAVIGATION[currentProduct.value] || PRODUCT_NAVIGATION.default
  })

  const navigationLabel = computed<string>(() => {
    return PRODUCT_NAVIGATION_LABELS[currentProduct.value] || PRODUCT_NAVIGATION_LABELS.default
  })

  /**
   * Get navigation items for a specific product
   */
  const getNavigationForProduct = (productId: ProductId): NavItem[] => {
    return PRODUCT_NAVIGATION[productId] || PRODUCT_NAVIGATION.default
  }

  /**
   * Get navigation label for a specific product
   */
  const getNavigationLabelForProduct = (productId: ProductId): string => {
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
