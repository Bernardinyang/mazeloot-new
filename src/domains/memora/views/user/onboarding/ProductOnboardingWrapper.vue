<template>
  <component :is="onboardingComponent" v-if="onboardingComponent" />
  <div v-else class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p class="text-gray-600 dark:text-gray-400">Product not found</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductPreferences } from '@/shared/api/productPreferences'
import MemoraOnboarding from '@/domains/memora/views/user/onboarding/memora/Onboarding.vue'

const route = useRoute()
const router = useRouter()
const productSlug = route.params.productSlug

const onboardingComponent = computed(() => {
  switch (productSlug) {
    case 'memora':
      return MemoraOnboarding
    case 'connect-stream':
      return () => import('@/domains/memora/views/user/onboarding/connect-stream/Onboarding.vue')
    case 'creator-iq':
      return () => import('@/domains/memora/views/user/onboarding/creator-iq/Onboarding.vue')
    case 'gear-hub':
      return () => import('@/domains/memora/views/user/onboarding/gear-hub/Onboarding.vue')
    case 'vendor-iq':
      return () => import('@/domains/memora/views/user/onboarding/vendor-iq/Onboarding.vue')
    case 'gig-finder':
      return () => import('@/domains/memora/views/user/onboarding/gig-finder/Onboarding.vue')
    case 'profolio':
      return () => import('@/domains/memora/views/user/onboarding/profolio/Onboarding.vue')
    default:
      return null
  }
})

const productDashboardMap = {
  memora: 'memoraDashboard',
}

onMounted(async () => {
  try {
    const preferences = await getProductPreferences()
    const productPreference = Array.isArray(preferences) 
      ? preferences.find(p => p.product?.slug === productSlug || p.product?.id === productSlug)
      : preferences?.data?.find(p => p.product?.slug === productSlug || p.product?.id === productSlug)
    
    if (productPreference?.onboarding_completed) {
      const dashboardRoute = productDashboardMap[productSlug]
      if (dashboardRoute) {
        router.push({ name: dashboardRoute })
      }
    }
  } catch (error) {
    // Ignore errors, let user continue with onboarding
  }
})
</script>