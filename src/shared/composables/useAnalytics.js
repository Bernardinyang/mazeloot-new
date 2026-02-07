/**
 * Analytics composable - ready for Google Analytics, Plausible, or other providers
 * Configure via environment variables:
 * - VITE_GA_ID for Google Analytics
 * - VITE_PLAUSIBLE_DOMAIN for Plausible
 */

const isProduction = typeof window !== 'undefined' 
  ? (window.location.hostname === 'mazeloot.com' || window.location.hostname.endsWith('.mazeloot.com'))
  : false

const GA_ID = import.meta.env.VITE_GA_ID
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN

/**
 * Track page view
 */
export function trackPageView(path, title) {
  if (!isProduction) return

  // Google Analytics
  if (GA_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ID, {
      page_path: path,
      page_title: title,
    })
  }

  // Plausible
  if (PLAUSIBLE_DOMAIN && typeof window !== 'undefined' && window.plausible) {
    window.plausible('pageview', {
      url: path,
    })
  }
}

/**
 * Track custom event
 */
export function trackEvent(eventName, eventData = {}) {
  if (!isProduction) return

  // Google Analytics
  if (GA_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData)
  }

  // Plausible
  if (PLAUSIBLE_DOMAIN && typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, {
      props: eventData,
    })
  }
}

/**
 * Initialize analytics
 * Only initializes if user has consented (checked via localStorage)
 */
export function initAnalytics() {
  if (typeof window === 'undefined') return
  
  // Check cookie consent
  const consent = localStorage.getItem('mazeloot_cookie_consent')
  const preferences = localStorage.getItem('mazeloot_cookie_preferences')
  
  if (consent !== 'accepted') return
  
  let analyticsEnabled = false
  if (preferences) {
    try {
      const prefs = JSON.parse(preferences)
      analyticsEnabled = prefs.analytics === true
    } catch (e) {
      // If preferences are invalid, don't initialize
      return
    }
  }
  
  if (!analyticsEnabled) return

  // Google Analytics
  if (GA_ID) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, {
      page_path: window.location.pathname,
    })
  }

  // Plausible
  if (PLAUSIBLE_DOMAIN) {
    const script = document.createElement('script')
    script.defer = true
    script.setAttribute('data-domain', PLAUSIBLE_DOMAIN)
    script.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(script)
  }
}
