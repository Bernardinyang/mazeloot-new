<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 translate-y-full scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-full scale-95"
  >
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 lg:p-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      aria-modal="true"
    >
      <!-- Backdrop blur overlay -->
      <div class="absolute inset-0 -z-10 bg-gradient-to-t from-black/20 via-black/10 to-transparent backdrop-blur-sm" />
      
      <div
        class="group relative mx-auto max-w-4xl rounded-2xl border dark:border-white/10 light:border-gray-200/80 dark:bg-gradient-to-br dark:from-gray-900/98 dark:via-gray-900/95 dark:to-gray-800/98 light:bg-gradient-to-br light:from-white/98 light:via-white/95 light:to-gray-50/98 backdrop-blur-xl shadow-2xl dark:shadow-black/40 light:shadow-gray-900/10 overflow-hidden"
      >
        <!-- Animated gradient background -->
        <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.05)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
        
        <!-- Subtle glow effect -->
        <div aria-hidden="true" class="absolute top-0 left-0 h-32 w-32 bg-gradient-to-br from-primary-500/10 to-accent-500/10 blur-2xl opacity-50" />
        
        <div class="relative p-5 sm:p-6 lg:p-8">
          <!-- Mobile: Stacked layout -->
          <div class="flex flex-col gap-4 sm:hidden">
            <!-- Header with icon -->
            <div class="flex items-start gap-3">
              <div class="flex shrink-0 items-center justify-center size-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 dark:from-primary-500/30 dark:to-accent-500/30 ring-2 ring-primary-500/10 dark:ring-primary-500/20">
                <svg class="size-5 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016Z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3
                  id="cookie-consent-title"
                  class="text-base font-bold dark:text-white light:text-gray-900 mb-1.5"
                >
                  Cookie Preferences
                </h3>
                <p
                  id="cookie-consent-description"
                  class="text-xs leading-5 dark:text-gray-300 light:text-gray-600"
                >
                  We use cookies to enhance your experience, analyze traffic, and personalize content.
                </p>
              </div>
            </div>
            
            <!-- Buttons -->
            <div class="flex flex-col gap-2.5">
              <Button
                size="sm"
                @click="acceptAll"
                class="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25 hover:from-primary-400 hover:to-accent-400 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.98] transition-all"
              >
                Accept All
              </Button>
              <div class="flex gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  @click="rejectAll"
                  class="flex-1 dark:border-white/20 light:border-gray-300 dark:hover:bg-white/5 light:hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                  Reject
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  @click="openPreferences"
                  class="flex-1 dark:border-white/20 light:border-gray-300 dark:hover:bg-white/5 light:hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                  Settings
                </Button>
              </div>
            </div>
          </div>
          
          <!-- Desktop: Horizontal layout -->
          <div class="hidden sm:flex sm:items-center sm:gap-6">
            <!-- Icon and content -->
            <div class="flex items-start gap-4 flex-1 min-w-0">
              <div class="flex shrink-0 items-center justify-center size-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 dark:from-primary-500/30 dark:to-accent-500/30 ring-2 ring-primary-500/10 dark:ring-primary-500/20">
                <svg class="size-6 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016Z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3
                  id="cookie-consent-title"
                  class="text-lg font-bold dark:text-white light:text-gray-900 mb-2"
                >
                  Cookie Preferences
                </h3>
                <p
                  id="cookie-consent-description"
                  class="text-sm leading-6 dark:text-gray-300 light:text-gray-600"
                >
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
            </div>
            
            <!-- Buttons -->
            <div class="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                @click="rejectAll"
                class="dark:border-white/20 light:border-gray-300 dark:hover:bg-white/5 light:hover:bg-gray-50 hover:scale-105 transition-all"
              >
                Reject All
              </Button>
              <Button
                variant="outline"
                size="sm"
                @click="openPreferences"
                class="dark:border-white/20 light:border-gray-300 dark:hover:bg-white/5 light:hover:bg-gray-50 hover:scale-105 transition-all"
              >
                Preferences
              </Button>
              <Button
                size="sm"
                @click="acceptAll"
                class="bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25 hover:from-primary-400 hover:to-accent-400 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all"
              >
                Accept All
              </Button>
            </div>
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
