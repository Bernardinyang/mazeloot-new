<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <PublicNav />

    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-12 sm:mb-16">
        <a
          href="/founders"
          class="inline-block mb-4 px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
        >
          Founder's Pricing: 40% off forever for first 500 customers →
        </a>
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">Pricing</h1>
        <p class="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Choose the plan that works best for your photography business
        </p>

        <div class="flex items-center justify-center gap-4 mt-8">
          <span :class="['text-sm font-medium', !isAnnual && 'text-foreground']">Monthly</span>
          <button
            type="button"
            role="switch"
            :aria-checked="isAnnual"
            class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-primary"
            @click="isAnnual = !isAnnual"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform',
                isAnnual ? 'translate-x-5' : 'translate-x-1',
              ]"
            />
          </button>
          <span :class="['text-sm font-medium', isAnnual && 'text-foreground']">
            Annual
            <span class="text-green-600 dark:text-green-500 text-xs ml-1">(Save 17%)</span>
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-0">
        <Card
          v-for="tier in tiers"
          :key="tier.id"
          :class="[
            'p-8 relative',
            tier.popular && 'border-2 border-gray-900 dark:border-gray-100',
          ]"
        >
          <div
            v-if="tier.popular"
            class="absolute top-0 right-0 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1 text-xs font-semibold rounded-bl-lg"
          >
            POPULAR
          </div>
          <CardHeader>
            <CardTitle class="text-2xl mb-2">{{ tier.name }}</CardTitle>
            <div class="text-4xl font-bold mb-4">
              ${{ displayPrice(tier) }}
              <span class="text-lg font-normal text-muted-foreground">/month</span>
            </div>
            <CardDescription>{{ tier.description }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <ul class="space-y-3">
              <li
                v-for="feature in tier.features"
                :key="feature"
                class="flex items-start gap-3"
              >
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{{ feature }}</span>
              </li>
            </ul>
            <Button
              class="w-full mt-6"
              :variant="tier.popular ? 'default' : 'outline'"
              @click="router.push({ name: 'register', query: tier.id !== 'starter' ? { plan: tier.id, billing: isAnnual ? 'annual' : 'monthly' } : {} })"
            >
              {{ tier.id === 'starter' ? 'Get Started' : 'Get Started' }}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div class="mt-20 text-center">
        <h2 class="text-3xl font-bold mb-4">All plans include</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
          <div class="flex items-start gap-3">
            <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div class="font-semibold mb-1">SSL Security</div>
              <div class="text-sm text-muted-foreground">Secure data encryption</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div class="font-semibold mb-1">Regular Updates</div>
              <div class="text-sm text-muted-foreground">New features and improvements</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div class="font-semibold mb-1">No Client Account Required</div>
              <div class="text-sm text-muted-foreground">Clients access via link, no sign-up</div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import Card from '@/shared/components/shadcn/Card.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import { Check } from '@/shared/utils/lucideAnimated'

const router = useRouter()
const isAnnual = ref(true)

const tiers = computed(() => [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for getting started',
    priceMonthly: 0,
    priceAnnual: 0,
    popular: false,
    features: [
      '3 Projects',
      '2 Collections',
      '5GB Storage',
      'Selection + Collection phases',
      'Mazeloot branding',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For solo photographers with regular clients',
    priceMonthly: 15,
    priceAnnual: 12,
    popular: true,
    features: [
      'Unlimited Projects',
      'Unlimited Collections',
      '100GB Storage',
      'Proofing phase (5 revisions)',
      'Custom domain',
      'Remove branding',
      '3 Watermarks, 5 Presets',
      'Basic analytics',
      'Download PIN',
      'Email support',
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    description: 'For growing photographers and event specialists',
    priceMonthly: 35,
    priceAnnual: 28,
    popular: false,
    features: [
      'Everything in Pro',
      '500GB Storage',
      '10 revisions per proofing',
      'Raw Files phase',
      'Unlimited watermarks & presets',
      'Advanced analytics',
      'Client email registration',
      'Auto-expiry, slideshow',
      'Social sharing',
      'Priority support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For studios and high-volume operations',
    priceMonthly: 59,
    priceAnnual: 49,
    popular: false,
    features: [
      'Everything in Studio',
      'Unlimited Storage',
      '20 revisions per proofing',
      'Team collaboration (5 seats)',
      'White-label',
      'Multi-brand support',
      'API access',
      'Advanced SEO',
      '24/7 support',
    ],
  },
])

function displayPrice(tier) {
  if (tier.priceMonthly === 0) return '0'
  return isAnnual.value ? tier.priceAnnual : tier.priceMonthly
}
</script>
