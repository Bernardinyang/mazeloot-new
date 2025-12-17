/**
 * Throttle utility function
 * Limits function execution to at most once per specified time period
 */

export function throttle(func, limit) {
  let inThrottle = false

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
