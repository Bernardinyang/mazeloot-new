/**
 * Error tracking composable - ready for Sentry or other error tracking services
 * Configure via environment variables:
 * - VITE_SENTRY_DSN for Sentry
 */

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
const isProduction = typeof window !== 'undefined' 
  ? (window.location.hostname === 'mazeloot.com' || window.location.hostname.endsWith('.mazeloot.com'))
  : false

/**
 * Initialize error tracking
 */
export function initErrorTracking() {
  if (!isProduction || !SENTRY_DSN) return

  // Sentry initialization would go here
  // Example:
  // import * as Sentry from '@sentry/vue'
  // Sentry.init({
  //   dsn: SENTRY_DSN,
  //   integrations: [...],
  //   tracesSampleRate: 1.0,
  // })
}

/**
 * Capture exception
 */
export function captureException(error, context = {}) {
  if (!isProduction) {
    console.error('Error (dev mode):', error, context)
    return
  }

  // Sentry capture would go here
  // Example:
  // Sentry.captureException(error, {
  //   contexts: { custom: context },
  // })
}

/**
 * Capture message
 */
export function captureMessage(message, level = 'info', context = {}) {
  if (!isProduction) {
    console.log(`[${level}]`, message, context)
    return
  }

  // Sentry capture would go here
  // Example:
  // Sentry.captureMessage(message, {
  //   level,
  //   contexts: { custom: context },
  // })
}
