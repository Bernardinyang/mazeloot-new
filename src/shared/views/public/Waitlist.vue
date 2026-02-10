<template>
  <div class="min-h-screen bg-gradient-to-br dark:from-[#0f0f23] dark:via-indigo-950/50 dark:to-[#0f0f23] light:from-gray-50 light:via-white light:to-gray-100 dark:text-gray-100 light:text-gray-900">
    <PublicNav />
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/15 blur-[100px]" aria-hidden="true" />
      <div class="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[80px]" aria-hidden="true" />
      
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 dark:text-indigo-300 light:text-indigo-600 text-sm font-medium mb-6 backdrop-blur-sm">
            <Bell class="h-4 w-4" />
            <span>Launching Soon</span>
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 dark:bg-gradient-to-r dark:from-white dark:via-indigo-200 dark:to-violet-200 light:bg-gradient-to-r light:from-gray-900 light:via-indigo-600 light:to-violet-600 bg-clip-text text-transparent">
            Join the Waitlist
          </h1>
          <p class="text-lg sm:text-xl md:text-2xl dark:text-gray-300 light:text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            Be the first to know when we officially launch. Get early access and exclusive updates.
          </p>
          <p class="text-sm dark:text-gray-400 light:text-gray-500">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>

    <!-- Form Section -->
    <section class="relative pb-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-xl mx-auto">
          <div class="relative rounded-2xl dark:bg-white/5 light:bg-white dark:backdrop-blur-xl light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 p-4 sm:p-8 md:p-10 shadow-2xl">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5" />
            <div class="relative">
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-2">
                  <Label for="name" class="dark:text-gray-200 light:text-gray-700 font-medium">Full Name</Label>
                  <Input
                    id="name"
                    v-model="form.name"
                    required
                    placeholder="John Doe"
                    :disabled="isSubmitting"
                    class="mt-1 dark:bg-white/5 light:bg-white dark:border-white/20 light:border-gray-300 dark:text-white light:text-gray-900 placeholder:text-gray-500 focus:border-indigo-400 focus:ring-indigo-400/50 h-12"
                    autocomplete="name"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="email" class="dark:text-gray-200 light:text-gray-700 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    :disabled="isSubmitting"
                    class="mt-1 dark:bg-white/5 light:bg-white dark:border-white/20 light:border-gray-300 dark:text-white light:text-gray-900 placeholder:text-gray-500 focus:border-indigo-400 focus:ring-indigo-400/50 h-12"
                    autocomplete="email"
                  />
                </div>
                
                <Transition
                  enter-active-class="transition duration-300 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <div v-if="error" class="p-4 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                    <p class="text-sm dark:text-red-300 light:text-red-600 flex items-center gap-2">
                      <span class="size-1.5 rounded-full bg-red-400" />
                      {{ error }}
                    </p>
                  </div>
                </Transition>
                
                <Transition
                  enter-active-class="transition duration-300 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <div v-if="success" class="p-4 rounded-lg bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                    <p class="text-sm dark:text-green-300 light:text-green-600 flex items-center gap-2">
                      <span class="size-1.5 rounded-full bg-green-400" />
                      {{ success }}
                    </p>
                  </div>
                </Transition>
                
                <Button
                  type="submit"
                  class="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-500/40 hover:-translate-y-0.5 border-0 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  :disabled="isSubmitting || !form.name || !form.email"
                >
                  <Loader2 v-if="isSubmitting" class="h-5 w-5 mr-2 animate-spin" />
                  <span v-if="!isSubmitting">Join Waitlist</span>
                  <span v-else>Joining...</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="relative py-16 sm:py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div class="group relative p-4 sm:p-6 md:p-8 rounded-xl dark:bg-white/5 light:bg-white dark:backdrop-blur-sm light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bell class="h-6 w-6 text-indigo-300" />
              </div>
              <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-2">Early Access</h3>
              <p class="text-sm dark:text-gray-400 light:text-gray-600 leading-relaxed">Be among the first to try our platform and shape the future of creative workflows</p>
            </div>
            <div class="group relative p-4 sm:p-6 md:p-8 rounded-xl dark:bg-white/5 light:bg-white dark:backdrop-blur-sm light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Gift class="h-6 w-6 text-indigo-300" />
              </div>
              <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-2">Exclusive Benefits</h3>
              <p class="text-sm dark:text-gray-400 light:text-gray-600 leading-relaxed">Special offers, features, and discounts reserved for early adopters</p>
            </div>
            <div class="group relative p-4 sm:p-6 md:p-8 rounded-xl dark:bg-white/5 light:bg-white dark:backdrop-blur-sm light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 sm:col-span-2 md:col-span-1">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail class="h-6 w-6 text-indigo-300" />
              </div>
              <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-2">Stay Updated</h3>
              <p class="text-sm dark:text-gray-400 light:text-gray-600 leading-relaxed">Get notified about launch dates, new features, and platform updates</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t dark:border-white/10 light:border-gray-200 dark:bg-[#0f0f23]/50 light:bg-gray-50/80 dark:backdrop-blur-sm light:backdrop-blur-sm py-12 mt-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p class="dark:text-gray-400 light:text-gray-600">© {{ new Date().getFullYear() }} Mazeloot Inc. All rights reserved.</p>
          <nav class="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Legal">
            <RouterLink :to="{ name: 'privacy' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900">Privacy Policy</RouterLink>
            <span class="dark:text-gray-600 light:text-gray-400" aria-hidden="true">•</span>
            <RouterLink :to="{ name: 'terms' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900">Terms of Service</RouterLink>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import Label from '@/shared/components/shadcn/Label.vue'
import { Bell, Gift, Mail, Loader2 } from '@/shared/utils/lucideAnimated'
import { apiClient } from '@/shared/api/client'
import { toast } from '@/shared/utils/toast'
import { Transition } from 'vue'
import { useSeoMeta } from '@/shared/composables/useSeoMeta'
import { trackPageView } from '@/shared/composables/useAnalytics'

const BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}`
  : 'https://mazeloot.com'

const route = useRoute()

const form = ref({
  name: '',
  email: '',
})

const isSubmitting = ref(false)
const error = ref('')
const success = ref('')

// SEO Meta Tags
useSeoMeta({
  title: 'Join the Waitlist - Early Access | Mazeloot',
  description: 'Be the first to know when we officially launch. Get early access and exclusive updates. No spam, unsubscribe anytime.',
  image: `${BASE_URL}/og-image.png`,
  url: `${BASE_URL}/waitlist`,
})

onMounted(() => {
  trackPageView('/waitlist', 'Waitlist')
  
  // Pre-fill email from query param
  if (route.query.email) {
    form.value.email = route.query.email
  }
})

const handleSubmit = async () => {
  if (!form.value.name || !form.value.email) {
    return
  }

  isSubmitting.value = true
  error.value = ''
  success.value = ''

  try {
    await apiClient.post(
      '/v1/public/waitlist',
      {
        name: form.value.name,
        email: form.value.email,
      },
      { skipAuth: true }
    )
    
    success.value = 'Thanks for joining! We\'ll notify you when we launch.'
    toast.success('Successfully joined the waitlist!')
    form.value = { name: '', email: '' }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to join waitlist. Please try again.'
    error.value = errorMessage
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>
