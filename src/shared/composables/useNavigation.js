import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useNavigation() {
  const route = useRoute()
  const router = useRouter()

  /**
   * Navigate to a route using a route object (preferred) or route name
   * @param location - Route location (object with name/path/params/query, or route name string)
   */
  const navigateTo = location => {
    // If it's already a route object, use it directly
    if (typeof location === 'object' && location !== null) {
      router.push(location)
      return
    }

    // If it's a string, treat it as a route name (not a path)
    // This enforces using route names instead of paths
    if (typeof location === 'string') {
      router.push({ name: location })
      return
    }

    // Fallback (shouldn't happen)
    router.push(location)
  }

  const isActiveRoute = (urlOrName, routeName) => {
    if (routeName && route.name === routeName) {
      return true
    }

    if (routeName && route.meta?.parent === routeName) {
      return true
    }

    // Fallback to URL comparison
    if (urlOrName) {
      // Remove query params and trailing slashes for comparison
      const routePath = route.path.split('?')[0].replace(/\/$/, '')
      const comparePath = urlOrName.split('?')[0].replace(/\/$/, '')

      // Exact match
      if (routePath === comparePath) {
        return true
      }

      // Only if comparePath is not empty and routePath is longer
      if (comparePath && routePath.startsWith(comparePath + '/')) {
        return true
      }
    }

    return false
  }

  const currentRoute = computed(() => route)

  return {
    navigateTo,
    isActiveRoute,
    currentRoute,
    route,
    router,
  }
}
