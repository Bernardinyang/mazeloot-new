<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <PublicNav />
    <PublicBreadcrumbBanner :breadcrumbs="[{ to: '/', label: 'Home' }, { label: 'Pricing' }]" />

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

        <div v-if="!loading && !error" class="flex flex-col items-center gap-4 mt-8">
          <div class="flex items-center justify-center gap-4">
            <span :class="['text-sm font-medium', !isAnnual && 'text-foreground']">Monthly</span>
            <button
              type="button"
              role="switch"
              :aria-checked="isAnnual"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-primary"
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
              <span class="text-green-600 dark:text-green-500 text-xs ml-1">(Save {{ annualSavePct }}%)</span>
            </span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <p class="text-sm text-muted-foreground">Prices in</p>
            <select
              :value="currencyStore.currency"
              aria-label="Currency"
              class="rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm"
              @change="currencyStore.setCurrency($event.target.value)"
            >
              <option v-for="c in SUPPORTED_CURRENCIES" :key="c.code" :value="c.code">
                {{ c.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">Loading…</div>
      <div v-else-if="error" class="text-center py-12 text-destructive">{{ error }}</div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-0"
      >
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
              {{ displayPrice(tier) }}
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
              :disabled="checkoutLoading === tier.id"
              @click="handleGetStarted(tier)"
            >
              {{ checkoutLoading === tier.id ? 'Loading…' : 'Get Started' }}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div class="mt-12 text-center">
        <a
          href="/build-your-own"
          class="inline-block text-sm font-medium text-primary hover:underline"
        >
          Or build your own plan →
        </a>
      </div>

      <div class="mt-12 text-center">
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import PublicBreadcrumbBanner from '@/shared/components/molecules/PublicBreadcrumbBanner.vue'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import Card from '@/shared/components/shadcn/Card.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import { Check } from '@/shared/utils/lucideAnimated'
import { usePricingApi, useSubscriptionApi } from '@/domains/memora/api/pricing'
import { useUserStore } from '@/shared/stores/user'
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '@/shared/stores/currency'
import { formatMoney } from '@/shared/utils/formatMoney'
import { convertUsdCentsToFormatted } from '@/shared/utils/convertCurrency'
import { getAnnualSavePct } from '@/shared/utils/pricing'
import { toast } from '@/shared/utils/toast'
import { useSeoMeta } from '@/shared/composables/useSeoMeta'
import { trackPageView } from '@/shared/composables/useAnalytics'

const BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}`
  : 'https://mazeloot.com'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const { getTiers, getCurrencyRates } = usePricingApi()
const annualSavePct = getAnnualSavePct()
const { getPreview, createCheckout } = useSubscriptionApi()

const isAnnual = ref(true)
const tiers = ref([])
const loading = ref(true)
const error = ref(null)
const checkoutLoading = ref(null)
const convertedPrices = ref({})
const currencyRates = ref({})
const convertedLoading = ref(false)

async function fetchConvertedPrices() {
  const cur = currencyStore.currency
  if (cur === 'usd' || tiers.value.length === 0) {
    convertedPrices.value = {}
    currencyRates.value = {}
    return
  }
  convertedLoading.value = true
  try {
    const nonStarter = tiers.value.filter((t) => t.id !== 'starter')
    const [rates, ...previewResults] = await Promise.all([
      getCurrencyRates(),
      ...nonStarter.flatMap((tier) => [
        getPreview(tier.id, 'monthly'),
        getPreview(tier.id, 'annual'),
      ]),
    ])
    currencyRates.value = rates || {}
    const results = {}
    nonStarter.forEach((tier, i) => {
      const monthlyRes = previewResults[i * 2]
      const annualRes = previewResults[i * 2 + 1]
      results[tier.id] = {
        monthlyCents: monthlyRes?.amount_cents ?? tier.price_monthly_cents ?? 0,
        annualCents: annualRes?.amount_cents ?? tier.price_annual_cents ?? 0,
      }
    })
    convertedPrices.value = results
  } catch {
    convertedPrices.value = {}
    currencyRates.value = {}
  } finally {
    convertedLoading.value = false
  }
}

watch(
  () => [currencyStore.currency, isAnnual.value, tiers.value],
  () => fetchConvertedPrices(),
  { immediate: false }
)

function displayPrice(tier) {
  const cur = currencyStore.currency
  if (cur === 'usd') {
    if (tier.price_monthly_cents === 0) return formatMoney(0, 'usd')
    const cents = isAnnual.value ? Math.round(tier.price_annual_cents / 12) : tier.price_monthly_cents
    return formatMoney(cents, 'usd')
  }
  const c = convertedPrices.value[tier.id]
  if (!c) return convertedLoading.value ? '…' : '—'
  const usdCents = isAnnual.value ? Math.round(c.annualCents / 12) : c.monthlyCents
  return convertUsdCentsToFormatted(usdCents, cur, currencyRates.value)
}

async function handleGetStarted(tier) {
  // Starter tier - just go to register
  if (tier.id === 'starter') {
    router.push({ name: 'register' })
    return
  }

  // If not logged in, redirect to register with plan params
  if (!userStore.isAuthenticated) {
    router.push({
      name: 'register',
      query: { plan: tier.id, billing: isAnnual.value ? 'annual' : 'monthly' },
    })
    return
  }

  // User is logged in - create checkout session
  try {
    checkoutLoading.value = tier.id
    const billingCycle = isAnnual.value ? 'annual' : 'monthly'
    const result = await createCheckout(tier.id, billingCycle)

    if (result.checkout_url) {
      window.location.href = result.checkout_url
    }
  } catch (e) {
    toast.apiError(e, 'Failed to start checkout')
  } finally {
    checkoutLoading.value = null
  }
}

// SEO Meta Tags
useSeoMeta({
  title: 'Pricing - Choose Your Plan | Mazeloot',
  description: 'Choose the plan that works best for your photography business. Flexible pricing with monthly and annual options.',
  image: `${BASE_URL}/og-image.png`,
  url: `${BASE_URL}/pricing`,
})

onMounted(async () => {
  trackPageView('/pricing', 'Pricing')
  
  try {
    tiers.value = await getTiers()
    if (currencyStore.currency !== 'usd') await fetchConvertedPrices()
  } catch (e) {
    error.value = e?.message ?? 'Failed to load pricing'
  } finally {
    loading.value = false
  }
})
</script>
