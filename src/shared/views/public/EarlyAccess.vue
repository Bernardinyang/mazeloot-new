<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
    <PublicNav />
    
    <!-- Hero Section -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
      <div class="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
          <Star class="h-4 w-4" />
          <span>Exclusive Early Access Program</span>
        </div>
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Join Early Access
        </h1>
        <p class="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Get exclusive access to new features, special discounts, and help shape the future of Mazeloot
        </p>
      </div>

      <!-- Benefits Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        <div class="group relative p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Percent class="h-7 w-7 text-white" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Exclusive Discounts</h3>
          <p class="text-gray-600 dark:text-gray-400">Get special pricing on all products and plans</p>
        </div>

        <div class="group relative p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Sparkles class="h-7 w-7 text-white" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Early Features</h3>
          <p class="text-gray-600 dark:text-gray-400">Access new features before they're released publicly</p>
        </div>

        <div class="group relative p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-yellow-200/50 dark:border-yellow-800/50 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Zap class="h-7 w-7 text-white" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Priority Support</h3>
          <p class="text-gray-600 dark:text-gray-400">Get faster response times and dedicated support</p>
        </div>

        <div class="group relative p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <HardDrive class="h-7 w-7 text-white" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Extra Storage</h3>
          <p class="text-gray-600 dark:text-gray-400">Increased storage limits for your projects</p>
        </div>

        <div class="group relative p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Badge class="h-7 w-7 text-white" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Exclusive Badge</h3>
          <p class="text-gray-600 dark:text-gray-400">Show off your early adopter status with a special badge</p>
        </div>

        <div class="group relative p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-pink-200/50 dark:border-pink-800/50 hover:border-pink-300 dark:hover:border-pink-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare class="h-7 w-7 text-white" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Shape the Product</h3>
          <p class="text-gray-600 dark:text-gray-400">Your feedback directly influences our roadmap</p>
        </div>
      </div>

      <!-- Registration Form -->
      <div class="max-w-2xl mx-auto">
        <Card class="p-6 sm:p-8 md:p-12 border-2 border-purple-200 dark:border-purple-800 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
          <CardHeader class="text-center mb-6 sm:mb-8 space-y-3">
            <CardTitle class="text-3xl sm:text-4xl mb-1 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Request Early Access
            </CardTitle>
            <CardDescription class="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              <span class="block">
                Already have an account?
                <RouterLink
                  to="/login"
                  class="ml-1 text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  Sign in
                </RouterLink>
                to request early access from your dashboard.
              </span>
              <span class="block mt-1">
                New here? Create an account below to join the early access program.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label for="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    v-model="form.first_name"
                    required
                    placeholder="John"
                    :disabled="isSubmitting"
                    class="mt-2"
                  />
                </div>
                <div>
                  <Label for="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    v-model="form.last_name"
                    required
                    placeholder="Doe"
                    :disabled="isSubmitting"
                    class="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label for="email">Email Address</Label>
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  :disabled="isSubmitting"
                  class="mt-2"
                />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    v-model="form.password"
                    type="password"
                    required
                    placeholder="Create a secure password"
                    :disabled="isSubmitting"
                    class="mt-2"
                  />
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    At least 8 characters, with upper, lower case and a number
                  </p>
                </div>
                <div>
                  <Label for="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    v-model="form.confirmPassword"
                    type="password"
                    required
                    placeholder="Re-enter your password"
                    :disabled="isSubmitting"
                    class="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label for="reason">Why do you want early access? (Optional)</Label>
                <textarea
                  id="reason"
                  v-model="form.reason"
                  rows="3"
                  placeholder="Tell us why you're interested in early access..."
                  :disabled="isSubmitting"
                  class="mt-2 w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                ></textarea>
              </div>
              <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
              </div>
              <div v-if="success" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p class="text-sm text-green-600 dark:text-green-400">{{ success }}</p>
              </div>
              <Button
                type="submit"
                class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                size="lg"
                :disabled="isSubmitting || !form.first_name || !form.last_name || !form.email || !form.password || !form.confirmPassword || form.password !== form.confirmPassword"
              >
                <Loader2 v-if="isSubmitting" class="h-5 w-5 mr-2 animate-spin" />
                <Star v-else class="h-5 w-5 mr-2" />
                {{ isSubmitting ? 'Registering...' : 'Register & Request Early Access' }}
              </Button>
              <p class="text-center text-sm text-gray-600 dark:text-gray-400">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      <!-- Additional Info -->
      <div class="max-w-3xl mx-auto mt-12 sm:mt-16 text-center">
        <div class="p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">How It Works</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 mx-auto md:mx-0">
                <span class="text-purple-600 dark:text-purple-400 font-bold">1</span>
              </div>
              <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">Register</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Create your account and request early access</p>
            </div>
            <div>
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 mx-auto md:mx-0">
                <span class="text-blue-600 dark:text-blue-400 font-bold">2</span>
              </div>
              <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">Review</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Our team reviews your request</p>
            </div>
            <div>
              <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3 mx-auto md:mx-0">
                <span class="text-green-600 dark:text-green-400 font-bold">3</span>
              </div>
              <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">Access</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Get notified when you're approved</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12 mt-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
        © {{ new Date().getFullYear() }} Mazeloot Inc. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import Label from '@/shared/components/shadcn/Label.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import { RouterLink } from 'vue-router'
import {
  Star,
  Percent,
  Sparkles,
  Zap,
  HardDrive,
  Badge,
  MessageSquare,
  Loader2,
} from 'lucide-vue-next'
import { apiClient } from '@/shared/api/client'
import { toast } from '@/shared/utils/toast'

const router = useRouter()

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  reason: '',
})

const isSubmitting = ref(false)
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
  if (
    !form.value.first_name ||
    !form.value.last_name ||
    !form.value.email ||
    !form.value.password ||
    !form.value.confirmPassword
  ) {
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  isSubmitting.value = true
  error.value = ''
  success.value = ''

  try {
    // Register user
    const registerResponse = await apiClient.post(
      '/v1/auth/register',
      {
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        email: form.value.email,
        password: form.value.password,
        password_confirmation: form.value.confirmPassword,
        acceptTerms: true,
      },
      { skipAuth: true }
    )

    // If email verification is required, handle it
    if (registerResponse.data.requires_verification) {
      success.value = 'Account created! Please check your email to verify your account. After verification, your early access request will be submitted.'
      toast.success('Account created! Please verify your email.')
      router.push({ name: 'login', query: { earlyAccess: 'true' } })
      return
    }

    // If user is automatically verified, request early access
    if (registerResponse.data.token) {
      // Store token temporarily
      const tempToken = registerResponse.data.token
      
      // Request early access
      try {
        await apiClient.post(
          '/v1/early-access/request',
          {
            reason: form.value.reason || null,
          },
          { headers: { Authorization: `Bearer ${tempToken}` } }
        )
        
        success.value = 'Account created and early access requested! You\'ll be notified when approved.'
        toast.success('Early access requested successfully!')
        router.push({ name: 'login', query: { earlyAccess: 'true' } })
      } catch (eaError) {
        // Registration succeeded but early access request failed
        success.value = 'Account created! You can request early access from your dashboard after logging in.'
        toast.success('Account created successfully!')
        router.push({ name: 'login' })
      }
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to register. Please try again.'
    error.value = errorMessage
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>
