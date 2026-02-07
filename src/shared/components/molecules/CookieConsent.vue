<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div
        class="mx-auto max-w-4xl rounded-xl border dark:border-white/10 light:border-gray-200 dark:bg-gray-900/95 light:bg-white/95 backdrop-blur-lg shadow-2xl p-6 sm:p-8"
      >
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div class="flex-1">
            <h3
              id="cookie-consent-title"
              class="text-lg font-semibold dark:text-white light:text-gray-900 mb-2"
            >
              Cookie Consent
            </h3>
            <p
              id="cookie-consent-description"
              class="text-sm dark:text-gray-300 light:text-gray-700 leading-relaxed"
            >
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. You can manage your preferences at any time.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              @click="openPreferences"
              class="w-full sm:w-auto"
            >
              Preferences
            </Button>
            <Button
              variant="outline"
              size="sm"
              @click="rejectAll"
              class="w-full sm:w-auto"
            >
              Reject All
            </Button>
            <Button
              size="sm"
              @click="acceptAll"
              class="w-full sm:w-auto"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Button } from '@/shared/components/shadcn/button'

const COOKIE_CONSENT_KEY = 'mazeloot_cookie_consent'
const COOKIE_PREFERENCES_KEY = 'mazeloot_cookie_preferences'

const showBanner = ref(false)

const getConsentStatus = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(COOKIE_CONSENT_KEY)
}

const acceptAll = () => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
  localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify({
    necessary: true,
    analytics: true,
    marketing: true,
  }))
  
  showBanner.value = false
  
  // Initialize analytics if consent given
  if (import.meta.env.VITE_GA_ID || import.meta.env.VITE_PLAUSIBLE_DOMAIN) {
    import('@/shared/composables/useAnalytics.js').then(({ initAnalytics }) => {
      initAnalytics()
    })
  }
}

const rejectAll = () => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected')
  localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify({
    necessary: true,
    analytics: false,
    marketing: false,
  }))
  
  showBanner.value = false
}

const openPreferences = () => {
  // Could open a modal with detailed preferences
  // For now, just accept all
  acceptAll()
}

onMounted(() => {
  const consent = getConsentStatus()
  if (!consent) {
    showBanner.value = true
  } else {
    // If already accepted, initialize analytics
    const preferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
    if (preferences) {
      const prefs = JSON.parse(preferences)
      if (prefs.analytics) {
        import('@/shared/composables/useAnalytics.js').then(({ initAnalytics }) => {
          initAnalytics()
        })
      }
    }
  }
})
</script>
