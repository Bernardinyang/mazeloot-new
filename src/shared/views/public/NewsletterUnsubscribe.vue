<template>
  <div class="min-h-screen bg-gradient-to-br dark:from-[#0f0f23] dark:via-indigo-950/50 dark:to-[#0f0f23] light:from-gray-50 light:via-white light:to-gray-100 dark:text-gray-100 light:text-gray-900">
    <PublicNav />
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-red-500/10 blur-[100px]" aria-hidden="true" />
      <div class="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-orange-500/8 blur-[80px]" aria-hidden="true" />
      
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <Transition
            enter-active-class="transition duration-500 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 dark:text-red-300 light:text-red-600 text-sm font-medium mb-6 backdrop-blur-sm">
              <Mail class="h-4 w-4" />
              <span>Newsletter</span>
            </div>
          </Transition>
          <Transition
            enter-active-class="transition duration-700 ease-out delay-100"
            enter-from-class="opacity-0 translate-y-6"
            enter-to-class="opacity-100 translate-y-0"
          >
            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 dark:bg-gradient-to-r dark:from-white dark:via-red-200 dark:to-orange-200 light:bg-gradient-to-r light:from-gray-900 light:via-red-600 light:to-orange-600 bg-clip-text text-transparent">
              Unsubscribe
            </h1>
          </Transition>
          <Transition
            enter-active-class="transition duration-700 ease-out delay-200"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
          >
            <p class="text-lg sm:text-xl md:text-2xl dark:text-gray-300 light:text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
              We're sorry to see you go. You can resubscribe anytime.
            </p>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Unsubscribe Section -->
    <section class="relative pb-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto">
          <Transition
            enter-active-class="transition duration-700 ease-out delay-300"
            enter-from-class="opacity-0 translate-y-8 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
          >
            <div class="group relative rounded-3xl dark:bg-white/5 light:bg-white dark:backdrop-blur-xl light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 p-4 sm:p-8 md:p-10 lg:p-12 shadow-2xl dark:shadow-black/20 light:shadow-gray-200/50 hover:shadow-3xl transition-all duration-300">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div class="absolute inset-0 rounded-3xl ring-1 ring-inset dark:ring-white/5 light:ring-gray-200/50" />
              <div class="relative">
                <!-- Loading State -->
                <Transition
                  enter-active-class="transition duration-300 ease-out"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition duration-200 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div v-if="loading" class="text-center py-16">
                    <div class="flex flex-col items-center gap-6">
                      <div class="relative">
                        <span class="size-16 animate-spin rounded-full border-4 border-red-200/30 border-t-red-500 dark:border-red-500/30 dark:border-t-red-400" aria-hidden="true" />
                        <div class="absolute inset-0 size-16 animate-ping rounded-full border-4 border-red-500/20" aria-hidden="true" />
                      </div>
                      <div class="space-y-2">
                        <p class="text-base font-medium dark:text-white light:text-gray-900">Loading...</p>
                        <p class="text-sm dark:text-gray-400 light:text-gray-500">Verifying your unsubscribe request</p>
                      </div>
                    </div>
                  </div>
                </Transition>

                <!-- Success State -->
                <Transition
                  v-if="!loading"
                  enter-active-class="transition duration-500 ease-out"
                  enter-from-class="opacity-0 scale-95 translate-y-4"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition duration-200 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div v-if="success" class="text-center py-8">
                    <div class="flex flex-col items-center gap-6">
                      <div class="relative">
                        <div class="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 ring-4 ring-green-500/10 dark:ring-green-500/20">
                          <svg class="size-10 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </div>
                        <div class="absolute inset-0 size-20 animate-ping rounded-full bg-green-500/20" aria-hidden="true" />
                      </div>
                      <div class="space-y-3">
                        <h2 class="text-3xl font-bold dark:text-white light:text-gray-900">Successfully unsubscribed</h2>
                        <div class="space-y-2">
                          <p class="text-lg dark:text-gray-300 light:text-gray-600">
                            <span v-if="email">
                              <span class="font-semibold dark:text-white light:text-gray-900 px-2 py-1 rounded-lg dark:bg-white/5 light:bg-gray-100">{{ email }}</span>
                              <span class="block mt-2">has been removed from our newsletter.</span>
                            </span>
                            <span v-else>You've been removed from our newsletter.</span>
                          </p>
                          <p class="text-sm dark:text-gray-400 light:text-gray-500">
                            We're sorry to see you go. You can resubscribe anytime.
                          </p>
                        </div>
                      </div>
                      <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
                        <RouterLink
                          :to="{ name: 'home' }"
                          class="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:from-primary-400 hover:to-accent-400 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all"
                        >
                          <span>Back to home</span>
                          <svg class="size-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </RouterLink>
                        <button
                          type="button"
                          @click="resubscribe"
                          class="inline-flex items-center justify-center gap-2 rounded-xl dark:border-white/20 light:border-gray-300 dark:bg-white/5 light:bg-gray-50 px-6 py-3.5 text-sm font-medium dark:text-white/90 light:text-gray-900 transition-all dark:hover:border-white/30 dark:hover:bg-white/10 light:hover:border-gray-400 light:hover:bg-gray-100 hover:-translate-y-0.5"
                        >
                          <Mail class="size-4" />
                          <span>Resubscribe</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition>

                <!-- Error State -->
                <Transition
                  v-if="!loading && !success"
                  enter-active-class="transition duration-500 ease-out"
                  enter-from-class="opacity-0 scale-95 translate-y-4"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition duration-200 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div v-if="error" class="text-center py-8">
                    <div class="flex flex-col items-center gap-6">
                      <div class="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 dark:from-red-500/30 dark:to-orange-500/30 ring-4 ring-red-500/10 dark:ring-red-500/20">
                        <svg class="size-10 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                      </div>
                      <div class="space-y-3">
                        <h2 class="text-3xl font-bold dark:text-white light:text-gray-900">Unable to unsubscribe</h2>
                        <p class="text-base dark:text-gray-300 light:text-gray-600 max-w-md">
                          {{ error }}
                        </p>
                      </div>
                      <div class="mt-6">
                        <RouterLink
                          :to="{ name: 'home' }"
                          class="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:from-primary-400 hover:to-accent-400 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all"
                        >
                          <span>Back to home</span>
                          <svg class="size-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </RouterLink>
                      </div>
                    </div>
                  </div>
                </Transition>

                <!-- Confirmation State -->
                <Transition
                  v-if="!loading && !success && !error"
                  enter-active-class="transition duration-500 ease-out"
                  enter-from-class="opacity-0 scale-95 translate-y-4"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition duration-200 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div class="text-center py-8">
                    <div class="space-y-8">
                      <div class="space-y-4">
                        <div class="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 border border-red-500/20 dark:border-red-500/30">
                          <svg class="size-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-9 9m4.5-1.206a8.959 8.959 0 0 1-4.5 1.207" />
                          </svg>
                        </div>
                        <div class="space-y-2">
                          <h2 class="text-2xl font-bold dark:text-white light:text-gray-900">Confirm unsubscribe</h2>
                          <p class="text-base dark:text-gray-300 light:text-gray-600">
                            <span v-if="email">
                              Unsubscribe <span class="font-semibold dark:text-white light:text-gray-900 px-2 py-1 rounded-lg dark:bg-white/5 light:bg-gray-100">{{ email }}</span> from our newsletter?
                            </span>
                            <span v-else>Click the button below to confirm you want to unsubscribe from our newsletter.</span>
                          </p>
                          <p class="text-sm dark:text-gray-400 light:text-gray-500">
                            You can resubscribe anytime from our homepage.
                          </p>
                        </div>
                      </div>
                      <div>
                        <button
                          type="button"
                          :disabled="processing"
                          @click="handleUnsubscribe"
                          class="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-red-500/25 hover:from-red-400 hover:to-red-500 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                          <span v-if="processing" class="flex items-center gap-2">
                            <span class="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                            <span>Unsubscribing...</span>
                          </span>
                          <span v-else class="flex items-center gap-2">
                            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-9 9m4.5-1.206a8.959 8.959 0 0 1-4.5 1.207" />
                            </svg>
                            <span>Unsubscribe</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative border-t dark:border-white/10 light:border-gray-200 bg-transparent py-12 px-6 lg:px-8">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.02)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="relative mx-auto max-w-7xl">
        <div class="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <div class="max-w-sm">
            <RouterLink :to="{ name: 'home' }" class="inline-block transition-transform hover:scale-105">
              <MazelootLogo size="sm" container-class="h-9" />
            </RouterLink>
            <p class="mt-3 text-sm leading-6 dark:text-gray-400 light:text-gray-700">
              Client galleries and proofing for creatives who care about the details. One workflow, one link.
            </p>
          </div>
          <nav class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm" aria-label="Footer">
            <RouterLink :to="{ name: 'home' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900 hover:underline underline-offset-4">Home</RouterLink>
            <RouterLink :to="{ name: 'contact' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900 hover:underline underline-offset-4">Contact us</RouterLink>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Transition } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import { Mail } from '@/shared/utils/lucideAnimated'
import { apiClient } from '@/shared/api/client'
import { toast } from '@/shared/utils/toast'
import { useSeoMeta } from '@/shared/composables/useSeoMeta'

const BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}`
  : 'https://mazeloot.com'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const processing = ref(false)
const success = ref(false)
const error = ref('')
const email = ref('')
const newsletterUuid = ref('')

useSeoMeta({
  title: 'Unsubscribe from Newsletter | Mazeloot',
  description: 'Unsubscribe from the Mazeloot newsletter. You can resubscribe anytime.',
  url: `${BASE_URL}/newsletter/unsubscribe`,
})

onMounted(async () => {
  const token = route.params.token
  if (!token) {
    error.value = 'Invalid unsubscribe link.'
    return
  }

  try {
    loading.value = true
    const response = await apiClient.get(`/v1/public/newsletter/token/${token}`, { skipAuth: true })
    
    if (response.data?.data) {
      email.value = response.data.data.email
      newsletterUuid.value = response.data.data.uuid
      
      if (!response.data.data.is_active) {
        success.value = true
        error.value = 'You\'re already unsubscribed from our newsletter.'
      }
    }
  } catch (err) {
    if (err.response?.status === 404 || err.response?.status === 400) {
      error.value = err.response?.data?.message || 'Invalid or expired unsubscribe link.'
    } else {
      error.value = 'Failed to load unsubscribe page. Please try again.'
    }
  } finally {
    loading.value = false
  }
})

const handleUnsubscribe = async () => {
  const token = route.params.token
  if (!token) {
    error.value = 'Invalid unsubscribe link.'
    return
  }

  processing.value = true
  error.value = ''

  try {
    const response = await apiClient.get(`/v1/public/newsletter/unsubscribe/${token}`, { skipAuth: true })
    
    if (response.data?.data?.email) {
      email.value = response.data.data.email
    }
    
    success.value = true
    toast.success('Successfully unsubscribed from newsletter')
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to unsubscribe. Please try again.'
    error.value = errorMessage
    toast.error(errorMessage)
  } finally {
    processing.value = false
  }
}

const resubscribe = () => {
  router.push({ name: 'home', hash: '#newsletter' })
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
