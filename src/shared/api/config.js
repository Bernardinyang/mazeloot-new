/**
 * API Configuration
 * Auto-detects environment based on hostname and uses appropriate backend URL
 */

/**
 * Detect environment based on hostname
 * - .vercel.app → DEV environment
 * - mazeloot.com → LIVE environment
 * - else → LOCAL environment
 */
const detectEnvironment = () => {
  if (typeof window === 'undefined') {
    // SSR or Node.js environment - fall back to Vite's mode
    return import.meta.env.DEV ? 'local' : 'live'
  }

  const hostname = window.location.hostname

  if (hostname.includes('.vercel.app')) {
    return 'dev'
  }

  if (hostname === 'mazeloot.com' || hostname.endsWith('.mazeloot.com')) {
    return 'live'
  }

  // Default to local for localhost, 127.0.0.1, etc.
  return 'local'
}

const environment = detectEnvironment()

/**
 * Get the appropriate backend URL based on hostname detection
 * Priority:
 * 1. Explicit VITE_API_BASE_URL (if set, use it regardless of env)
 * 2. VITE_API_BASE_URL_DEV (when hostname contains .vercel.app)
 * 3. VITE_API_BASE_URL_LIVE (when hostname is mazeloot.com)
 * 4. LOCAL URL (localhost:8000/api for local development)
 */
const getApiBaseUrl = () => {
  // If explicitly set, use it (highest priority)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }

  // Auto-detect based on hostname
  switch (environment) {
    case 'dev':
      return import.meta.env.VITE_API_BASE_URL_DEV || 'https://api-dev.mazeloot.com/api'
    case 'live':
      return import.meta.env.VITE_API_BASE_URL_LIVE || 'https://api.mazeloot.com/api'
    case 'local':
    default:
      return import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8000/api'
  }
}

const apiBaseUrl = getApiBaseUrl()

export const API_CONFIG = {
  // Base URL for API (auto-detected based on hostname)
  API_BASE_URL: apiBaseUrl,

  // Environment info
  environment, // 'dev', 'live', or 'local'
  isDevelopment: environment === 'dev' || environment === 'local',
  isProduction: environment === 'live',
  mode: import.meta.env.MODE,

  // Whether to use real API (for future mock/real API switching)
  USE_REAL_API: import.meta.env.VITE_USE_REAL_API !== 'false', // Default to true

  // Mock data delay (if using mock data)
  MOCK_DELAY: 300,
}
