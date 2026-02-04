<template>
  <div class="min-h-screen bg-background">
    <PublicNav />

    <section class="container mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <header class="text-center mb-12 sm:mb-16">
        <span class="inline-block rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
          Flexible pricing
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
          Build Your Own Plan
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Pick only what you need. Perfect for every creative.
        </p>

        <div v-if="!loading && !error" class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-8">
          <div class="flex flex-col items-center gap-2">
            <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Billing</span>
            <div
              class="inline-flex rounded-full border border-border bg-muted/50 dark:bg-muted/70 p-1 shadow-inner"
              role="group"
              aria-label="Billing cycle"
            >
              <button
                type="button"
                :class="[
                  'rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 min-w-[88px]',
                  !isAnnual ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50' : 'text-muted-foreground hover:text-foreground',
                ]"
                @click="isAnnual = false"
              >
                Monthly
              </button>
              <button
                type="button"
                :class="[
                  'rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 min-w-[88px]',
                  isAnnual ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50' : 'text-muted-foreground hover:text-foreground',
                ]"
                @click="isAnnual = true"
              >
                Annual
                <span class="rounded bg-emerald-500/15 dark:bg-emerald-500/25 px-1.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">Save {{ annualSavePct }}%</span>
              </button>
            </div>
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Currency</span>
            <select
              :value="currencyStore.currency"
              aria-label="Currency"
              class="rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm min-w-[140px]"
              @change="currencyStore.setCurrency($event.target.value)"
            >
              <option v-for="c in SUPPORTED_CURRENCIES" :key="c.code" :value="c.code">
                {{ c.label }}
              </option>
            </select>
          </div>
        </div>
      </header>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 class="h-10 w-10 animate-spin text-muted-foreground" aria-hidden="true" />
        <p class="text-sm text-muted-foreground">Loading options…</p>
      </div>
      <div v-else-if="error" class="rounded-2xl border border-destructive/30 bg-destructive/5 dark:bg-destructive/10 px-6 py-10 text-center">
        <p class="text-destructive font-medium">{{ error }}</p>
      </div>

      <div v-else class="space-y-8">
        <div class="grid md:grid-cols-2 gap-6 lg:gap-8">
          <Card class="overflow-hidden border-border transition-shadow duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-2xl">
            <CardHeader class="pb-4">
              <CardTitle class="text-xl font-semibold">Base Plan</CardTitle>
              <CardDescription>Included in every Build Your Own plan</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-bold tabular-nums text-foreground">{{ basePriceDisplay }}</span>
                <span class="text-muted-foreground">/ month</span>
              </div>
              <ul class="space-y-3 text-sm text-foreground/90">
                <li class="flex items-center gap-3">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check class="h-3 w-3" />
                  </span>
                  Platform access (Memora)
                </li>
                <li class="flex items-center gap-3">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check class="h-3 w-3" />
                  </span>
                  {{ config?.base?.project_limit ?? 1 }} project{{ (config?.base?.project_limit ?? 1) !== 1 ? 's' : '' }}
                </li>
                <li class="flex items-center gap-3">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check class="h-3 w-3" />
                  </span>
                  {{ config?.base?.base_selection_limit ?? 1 }} selection phase{{ (config?.base?.base_selection_limit ?? 1) !== 1 ? 's' : '' }}
                </li>
                <li class="flex items-center gap-3">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check class="h-3 w-3" />
                  </span>
                  {{ config?.base?.base_proofing_limit ?? 1 }} proofing phase{{ (config?.base?.base_proofing_limit ?? 1) !== 1 ? 's' : '' }}
                </li>
                <li class="flex items-center gap-3">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check class="h-3 w-3" />
                  </span>
                  {{ config?.base?.base_collection_limit ?? 1 }} collection phase{{ (config?.base?.base_collection_limit ?? 1) !== 1 ? 's' : '' }}
                </li>
                <li class="flex items-center gap-3">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check class="h-3 w-3" />
                  </span>
                  {{ config?.base?.base_raw_file_limit ?? 1 }} raw file phase{{ (config?.base?.base_raw_file_limit ?? 1) !== 1 ? 's' : '' }}
                </li>
                <li v-if="(config?.base?.base_max_revisions ?? 0) > 0" class="flex items-center gap-3">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check class="h-3 w-3" />
                  </span>
                  {{ config?.base?.base_max_revisions }} max revision{{ config?.base?.base_max_revisions !== 1 ? 's' : '' }} per proofing
                </li>
                <li class="flex items-center gap-3">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check class="h-3 w-3" />
                  </span>
                  {{ formatStorage(config?.base?.storage_bytes ?? 5 * 1024 * 1024 * 1024) }} storage
                </li>
                <li class="flex items-center gap-3">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check class="h-3 w-3" />
                  </span>
                  Mazeloot branding
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card class="overflow-hidden border-border transition-shadow duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-2xl">
            <CardHeader class="pb-4">
              <CardTitle class="text-xl font-semibold">Add-ons</CardTitle>
              <CardDescription>Select what you need</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <template v-for="addon in checkboxAddons">
                <label
                  v-if="isLimitAddon(addon)"
                  :key="`limit-${addon.slug}`"
                  class="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors"
                  :class="(selectedAddons[addon.slug] || 0) > 0 ? 'border-primary/40 bg-primary/5 dark:bg-primary/10' : 'border-transparent hover:bg-muted/50 dark:hover:bg-muted/30'"
                >
                  <span class="font-medium text-foreground">{{ addon.label }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground">Qty</span>
                    <input
                      v-model.number="selectedAddons[addon.slug]"
                      type="number"
                      min="0"
                      max="999"
                      class="h-9 w-20 rounded-md border border-input bg-background px-2 text-right font-variant-numeric tabular-nums text-sm focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      :aria-label="`Quantity for ${addon.label}`"
                    />
                  </div>
                </label>
                <label
                  v-else
                  :key="`check-${addon.slug}`"
                  class="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-transparent px-4 py-3.5 text-left transition-colors hover:bg-muted/50 dark:hover:bg-muted/30 has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 "
                >
                  <span class="font-medium text-foreground">{{ addon.label }}</span>
                  <input
                    v-model="selectedAddons[addon.slug]"
                    type="checkbox"
                    class="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </label>
              </template>
              <div v-if="storageAddons.length" class="border-t border-border pt-4 mt-4 space-y-2">
                <p class="text-sm font-medium text-foreground mb-3">Storage (pick one)</p>
                <label
                  class="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-transparent px-4 py-3.5 text-left transition-colors hover:bg-muted/50 has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 "
                >
                  <span class="text-sm text-foreground">Base only ({{ formatStorage(config?.base?.storage_bytes ?? 5 * 1024 * 1024 * 1024) }})</span>
                  <input v-model="selectedAddons.storage" type="radio" :value="null" class="h-4 w-4 border-input text-primary focus:ring-2 focus:ring-primary" />
                </label>
                <label
                  v-for="opt in storageAddons"
                  :key="opt.slug"
                  class="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-transparent px-4 py-3.5 text-left transition-colors hover:bg-muted/50 dark:hover:bg-muted/30 has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 "
                >
                  <span class="text-sm font-medium text-foreground">{{ opt.label }}</span>
                  <input v-model="selectedAddons.storage" type="radio" :value="opt.slug" class="h-4 w-4 border-input text-primary focus:ring-2 focus:ring-primary" />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="rounded-2xl border-2 border-primary/20 bg-primary/5 dark:bg-primary/10 p-6 sm:p-8 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p class="text-sm font-medium text-muted-foreground mb-1">Your total</p>
              <p class="text-3xl sm:text-4xl font-bold tabular-nums text-foreground">{{ monthlyTotalDisplay }}<span class="text-lg font-normal text-muted-foreground">/mo</span></p>
              <p v-if="isAnnual" class="mt-1 text-sm text-muted-foreground">
                {{ annualTotalDisplay }} per year, billed annually
              </p>
            </div>
            <Button
              size="lg"
              class="w-full sm:w-auto min-w-[180px] rounded-xl text-base font-semibold py-6 sm:py-5"
              :disabled="checkoutLoading || monthlyTotalCents < baseCents"
              @click="handleGetStarted"
            >
              <Loader2 v-if="checkoutLoading" class="h-5 w-5 animate-spin shrink-0 mr-2" aria-hidden="true" />
              <span>{{ checkoutLoading ? 'Loading…' : 'Get Started' }}</span>
            </Button>
          </div>
        </div>
      </div>

      <p class="mt-12 text-center">
        <RouterLink to="/pricing" class="text-sm font-medium text-primary hover:underline rounded">
          View fixed plans
        </RouterLink>
      </p>
    </section>

    <footer class="border-t border-border py-8 mt-16">
      <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © {{ new Date().getFullYear() }} Mazeloot Inc.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import Card from '@/shared/components/shadcn/Card.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import { Check, Loader2 } from '@/shared/utils/lucideAnimated'
import { usePricingApi, useSubscriptionApi } from '@/domains/memora/api/pricing'
import { useUserStore } from '@/shared/stores/user'
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '@/shared/stores/currency'
import { formatMoney } from '@/shared/utils/formatMoney'
import { convertUsdCentsToFormatted } from '@/shared/utils/convertCurrency'
import { getAnnualSavePct } from '@/shared/utils/pricing'
import { toast } from '@/shared/utils/toast'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const { getBuildYourOwnConfig, getCurrencyRates } = usePricingApi()
const { createCheckout } = useSubscriptionApi()

const isAnnual = ref(true)
const config = ref(null)
const loading = ref(true)
const error = ref(null)
const checkoutLoading = ref(false)
const currencyRates = ref({})
const convertedLoading = ref(false)

async function fetchRates() {
  if (currencyStore.currency === 'usd') {
    currencyRates.value = {}
    return
  }
  convertedLoading.value = true
  try {
    currencyRates.value = (await getCurrencyRates()) || {}
  } catch {
    currencyRates.value = {}
  } finally {
    convertedLoading.value = false
  }
}

const annualSavePct = computed(() => getAnnualSavePct(config.value?.base?.annual_discount_months))
const checkboxAddons = computed(() => config.value?.checkbox_addons ?? [])
const storageAddons = computed(() => config.value?.storage_addons ?? [])

const selectedAddons = reactive({ storage: null })

function isLimitAddon(addon) {
  const s = addon.selection_limit_granted
  const p = addon.proofing_limit_granted
  const c = addon.collection_limit_granted
  const pr = addon.project_limit_granted
  const rf = addon.raw_file_limit_granted
  const rev = addon.max_revisions_granted
  return (s != null && s > 0) || (p != null && p > 0) || (c != null && c > 0) || (pr != null && pr > 0) || (rf != null && rf > 0) || (rev != null && rev > 0)
}

const baseCents = computed(() => config.value?.base?.price_monthly_cents ?? 500)
const basePriceDisplay = computed(() => {
  if (!config.value?.base) return formatMoney(500, 'usd')
  const cur = currencyStore.currency
  const usdCents = isAnnual.value
    ? Math.round((config.value.base.price_annual_cents ?? 0) / 12)
    : (config.value.base.price_monthly_cents ?? 0)
  if (cur === 'usd') return formatMoney(usdCents, 'usd')
  return convertedLoading.value ? '…' : convertUsdCentsToFormatted(usdCents, cur, currencyRates.value)
})

const addonsTotalCents = computed(() => {
  if (!config.value) return 0
  let total = 0
  const priceKey = isAnnual.value ? 'price_annual_cents' : 'price_monthly_cents'
  for (const addon of checkboxAddons.value) {
    if (isLimitAddon(addon)) {
      const qty = Math.max(0, parseInt(selectedAddons[addon.slug], 10) || 0)
      total += (addon[priceKey] ?? 0) * qty
    } else if (selectedAddons[addon.slug]) {
      total += addon[priceKey] ?? 0
    }
  }
  const storageSlug = selectedAddons.storage
  if (storageSlug) {
    const opt = storageAddons.value.find((a) => a.slug === storageSlug)
    if (opt) total += opt[priceKey] ?? 0
  }
  return total
})

const monthlyTotalCents = computed(() => {
  if (isAnnual.value) return Math.round(annualTotalCents.value / 12)
  const base = config.value?.base?.price_monthly_cents ?? 500
  return base + addonsTotalCents.value
})

const monthlyTotalDisplay = computed(() => {
  const cur = currencyStore.currency
  if (cur === 'usd') return formatMoney(monthlyTotalCents.value, 'usd')
  return convertedLoading.value ? '…' : convertUsdCentsToFormatted(monthlyTotalCents.value, cur, currencyRates.value)
})

const monthlyTotalFullCents = computed(() => {
  if (!config.value) return 500
  let total = config.value.base.price_monthly_cents
  for (const addon of checkboxAddons.value) {
    if (isLimitAddon(addon)) {
      const qty = Math.max(0, parseInt(selectedAddons[addon.slug], 10) || 0)
      total += (addon.price_monthly_cents ?? 0) * qty
    } else if (selectedAddons[addon.slug]) {
      total += addon.price_monthly_cents ?? 0
    }
  }
  const storageSlug = selectedAddons.storage
  if (storageSlug) {
    const opt = storageAddons.value.find((a) => a.slug === storageSlug)
    if (opt) total += opt.price_monthly_cents
  }
  return total
})

const annualTotalCents = computed(() => {
  if (!config.value) return 5000
  let total = config.value.base.price_annual_cents
  for (const addon of checkboxAddons.value) {
    if (isLimitAddon(addon)) {
      const qty = Math.max(0, parseInt(selectedAddons[addon.slug], 10) || 0)
      total += (addon.price_annual_cents ?? 0) * qty
    } else if (selectedAddons[addon.slug]) {
      total += addon.price_annual_cents ?? 0
    }
  }
  const storageSlug = selectedAddons.storage
  if (storageSlug) {
    const opt = storageAddons.value.find((a) => a.slug === storageSlug)
    if (opt) total += opt.price_annual_cents
  }
  return total
})

const annualTotalDisplay = computed(() => {
  const cur = currencyStore.currency
  if (cur === 'usd') return formatMoney(annualTotalCents.value, 'usd')
  return convertedLoading.value ? '…' : convertUsdCentsToFormatted(annualTotalCents.value, cur, currencyRates.value)
})

function formatStorage(bytes) {
  if (!bytes) return '0'
  const gb = bytes / (1024 * 1024 * 1024)
  return `${gb} GB`
}

function buildByoAddons() {
  const addons = {}
  for (const addon of checkboxAddons.value) {
    if (isLimitAddon(addon)) {
      const qty = Math.max(0, parseInt(selectedAddons[addon.slug], 10) || 0)
      if (qty > 0) addons[addon.slug] = qty
    } else if (selectedAddons[addon.slug]) {
      addons[addon.slug] = 1
    }
  }
  if (selectedAddons.storage) addons[selectedAddons.storage] = 1
  return Object.keys(addons).length > 0 ? addons : null
}

async function handleGetStarted() {
  const byoAddons = buildByoAddons()
  const billingCycle = isAnnual.value ? 'annual' : 'monthly'

  // If not logged in, redirect to register
  if (!userStore.isAuthenticated) {
    const addonKeys = byoAddons ? Object.keys(byoAddons).join(',') : ''
    router.push({
      name: 'register',
      query: {
        plan: 'byo',
        billing: billingCycle,
        addons: addonKeys,
      },
    })
    return
  }

  // User is logged in - create checkout session
  try {
    checkoutLoading.value = true
    const result = await createCheckout('byo', billingCycle, byoAddons)

    if (result.checkout_url) {
      window.location.href = result.checkout_url
    }
  } catch (e) {
    toast.apiError(e, 'Failed to start checkout')
  } finally {
    checkoutLoading.value = false
  }
}

onMounted(async () => {
  try {
    config.value = await getBuildYourOwnConfig()
    for (const addon of checkboxAddons.value) {
      if (isLimitAddon(addon)) {
        selectedAddons[addon.slug] = addon.is_default ? 1 : 0
      } else {
        selectedAddons[addon.slug] = addon.is_default ?? false
      }
    }
    const defaultStorage = storageAddons.value.find((a) => a.is_default)
    selectedAddons.storage = defaultStorage?.slug ?? null
    await fetchRates()
  } catch (e) {
    error.value = e?.message ?? 'Failed to load pricing'
  } finally {
    loading.value = false
  }
})

watch(
  () => [currencyStore.currency, config.value],
  () => fetchRates(),
  { immediate: false }
)
</script>
