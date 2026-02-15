<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <PublicNav />
    <PublicBreadcrumbBanner :breadcrumbs="foundersBreadcrumbs" />

    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div class="max-w-4xl mx-auto text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm font-medium mb-6">
          <span>Limited to first 500 customers</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold mb-4">Founder's Pricing</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          Lock in 40% off forever. Be among the first 500 and never pay full price.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
        <div class="p-4 sm:p-6 rounded-xl border-2 border-gray-200 dark:border-gray-800">
          <div class="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Pro</div>
          <div class="text-3xl font-bold mb-4">
            $9<span class="text-lg font-normal text-muted-foreground">/mo</span>
          </div>
          <div class="text-sm text-muted-foreground line-through mb-2">Regular $15/mo</div>
          <ul class="text-sm space-y-2 mb-6">
            <li>Unlimited Projects & Collections</li>
            <li>100GB Storage</li>
            <li>Proofing phase</li>
            <li>Custom domain</li>
          </ul>
          <Button class="w-full" @click="goToRegister('pro')">
            Claim Founder's Price
          </Button>
        </div>

        <div class="p-4 sm:p-6 rounded-xl border-2 border-gray-900 dark:border-gray-100 relative">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold rounded-full">
            BEST VALUE
          </div>
          <div class="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Studio</div>
          <div class="text-3xl font-bold mb-4">
            $21<span class="text-lg font-normal text-muted-foreground">/mo</span>
          </div>
          <div class="text-sm text-muted-foreground line-through mb-2">Regular $35/mo</div>
          <ul class="text-sm space-y-2 mb-6">
            <li>Everything in Pro</li>
            <li>500GB Storage</li>
            <li>Raw Files phase</li>
            <li>Advanced analytics</li>
          </ul>
          <Button class="w-full" @click="goToRegister('studio')">
            Claim Founder's Price
          </Button>
        </div>

        <div class="p-4 sm:p-6 rounded-xl border-2 border-gray-200 dark:border-gray-800">
          <div class="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Business</div>
          <div class="text-3xl font-bold mb-4">
            $35<span class="text-lg font-normal text-muted-foreground">/mo</span>
          </div>
          <div class="text-sm text-muted-foreground line-through mb-2">Regular $59/mo</div>
          <ul class="text-sm space-y-2 mb-6">
            <li>Everything in Studio</li>
            <li>Unlimited Storage</li>
            <li>5 Team seats</li>
            <li>White-label</li>
          </ul>
          <Button class="w-full" variant="outline" @click="goToRegister('business')">
            Claim Founder's Price
          </Button>
        </div>
      </div>

      <div class="text-center">
        <p class="text-muted-foreground mb-4">
          <RouterLink :to="{ name: 'pricing' }" class="text-foreground hover:underline">
            View standard pricing
          </RouterLink>
        </p>
      </div>
    </section>

    <footer class="border-t border-gray-200 dark:border-gray-800 py-8">
      <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © {{ new Date().getFullYear() }} Mazeloot Inc.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PublicBreadcrumbBanner from '@/shared/components/molecules/PublicBreadcrumbBanner.vue'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'

const router = useRouter()
const foundersBreadcrumbs = [{ to: { name: 'home' }, label: 'Home' }, { label: "Founder's Pricing" }]

function goToRegister(plan) {
  router.push({
    name: 'register',
    query: { plan, founders: 'true' },
  })
}
</script>
