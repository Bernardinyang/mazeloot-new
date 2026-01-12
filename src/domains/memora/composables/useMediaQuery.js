import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for reactive media query matching
 * @param {string} query - Media query string (e.g., '(max-width: 768px)')
 * @returns {import('vue').Ref<boolean>} - Reactive boolean indicating if query matches
 */
export function useMediaQuery(query) {
  const matches = ref(false)

  const mediaQuery = window.matchMedia(query)

  const updateMatches = () => {
    matches.value = mediaQuery.matches
  }

  onMounted(() => {
    updateMatches()
    // Use addListener for older browsers, addEventListener for modern ones
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMatches)
    } else {
      mediaQuery.addListener(updateMatches)
    }
  })

  onUnmounted(() => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', updateMatches)
    } else {
      mediaQuery.removeListener(updateMatches)
    }
  })

  return matches
}
