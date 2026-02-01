<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <PublicNav />

    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-5xl font-bold mb-4">Build Your Own Plan</h1>
          <p class="text-xl text-gray-600 dark:text-gray-400">
            Pick only what you need. Perfect for every creative.
          </p>
        </div>

        <div v-if="loading" class="text-center py-12">Loading…</div>
        <div v-else-if="error" class="text-center py-12 text-destructive">{{ error }}</div>

        <template v-else>
          <div class="flex items-center justify-center gap-4 mb-8">
            <span :class="['text-sm font-medium', !isAnnual && 'text-foreground']">Monthly</span>
            <button
              type="button"
              role="switch"
              :aria-checked="isAnnual"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary"
              @click="isAnnual = !isAnnual"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg transition-transform',
                  isAnnual ? 'translate-x-5' : 'translate-x-1',
                ]"
              />
            </button>
            <span :class="['text-sm font-medium', isAnnual && 'text-foreground']">
              Annual <span class="text-green-600 dark:text-green-500 text-xs ml-1">(Save 17%)</span>
            </span>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <Card class="p-6">
              <CardHeader>
                <CardTitle>Base Plan</CardTitle>
                <CardDescription>Included in every Build Your Own plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold mb-4">{{ basePriceDisplay }}/mo</div>
                <ul class="space-y-2 text-sm">
                  <li>Platform access (Memora)</li>
                  <li>{{ config?.base?.project_limit ?? 3 }} Projects</li>
                  <li>Selection + Collection phases</li>
                  <li>{{ formatStorage(config?.base?.storage_bytes ?? 5 * 1024 * 1024 * 1024) }} storage</li>
                  <li>Mazeloot branding</li>
                </ul>
              </CardContent>
            </Card>

            <Card class="p-6">
              <CardHeader>
                <CardTitle>Add-ons</CardTitle>
                <CardDescription>Select what you need</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <label
                  v-for="addon in checkboxAddons"
                  :key="addon.slug"
                  class="flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{{ addon.label }}</span>
                  <input v-model="selectedAddons[addon.slug]" type="checkbox" class="rounded" />
                </label>
                <div v-if="storageAddons.length" class="border-t pt-4 mt-4">
                  <div class="text-sm font-medium mb-2">Storage (pick one)</div>
                  <div class="space-y-2">
                    <label class="flex items-center justify-between gap-4 cursor-pointer">
                      <span>None ({{ formatStorage(config?.base?.storage_bytes ?? 5 * 1024 * 1024 * 1024) }} base)</span>
                      <input v-model="selectedAddons.storage" type="radio" :value="null" class="rounded-full" />
                    </label>
                    <label
                      v-for="opt in storageAddons"
                      :key="opt.slug"
                      class="flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span>{{ opt.label }}</span>
                      <input v-model="selectedAddons.storage" type="radio" :value="opt.slug" class="rounded-full" />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card class="mt-8 p-6 border-2 border-primary/20">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div class="text-2xl font-bold">{{ monthlyTotalDisplay }}/mo</div>
                <div v-if="isAnnual" class="text-sm text-muted-foreground">
                  {{ annualTotalDisplay }}/year (billed annually)
                </div>
              </div>
              <Button
                size="lg"
                :disabled="checkoutLoading || monthlyTotalCents < baseCents"
                @click="handleGetStarted"
              >
                {{ checkoutLoading ? 'Loading…' : 'Get Started' }}
              </Button>
            </div>
          </Card>
        </template>

        <div class="mt-8 text-center">
          <RouterLink to="/pricing" class="text-muted-foreground hover:underline">
            View fixed plans
          </RouterLink>
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
      <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © {{ new Date().getFullYear() }} Mazeloot Inc.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import Card from '@/shared/components/shadcn/Card.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import { usePricingApi, useSubscriptionApi } from '@/domains/memora/api/pricing'
import { useUserStore } from '@/shared/stores/user'
import { formatMoney } from '@/shared/utils/formatMoney'
import { toast } from '@/shared/utils/toast'

const router = useRouter()
const userStore = useUserStore()
const { getBuildYourOwnConfig } = usePricingApi()
const { createCheckout } = useSubscriptionApi()

const isAnnual = ref(true)
const config = ref(null)
const loading = ref(true)
const error = ref(null)
const checkoutLoading = ref(false)

const checkboxAddons = computed(() => config.value?.checkbox_addons ?? [])
const storageAddons = computed(() => config.value?.storage_addons ?? [])

const selectedAddons = reactive({ storage: null })

const baseCents = computed(() => config.value?.base?.price_monthly_cents ?? 500)
const basePriceDisplay = computed(() => {
  if (!config.value?.base) return formatMoney(500, 'usd')
  const cents = isAnnual.value ? config.value.base.price_annual_cents / 12 : config.value.base.price_monthly_cents
  return formatMoney(cents, 'usd')
})

const addonsTotalCents = computed(() => {
  if (!config.value) return 0
  let total = 0
  for (const addon of checkboxAddons.value) {
    if (selectedAddons[addon.slug]) {
      total += isAnnual.value ? addon.price_annual_cents : addon.price_monthly_cents
    }
  }
  const storageSlug = selectedAddons.storage
  if (storageSlug) {
    const opt = storageAddons.value.find((a) => a.slug === storageSlug)
    if (opt) total += isAnnual.value ? opt.price_annual_cents : opt.price_monthly_cents
  }
  return total
})

const monthlyTotalCents = computed(() => {
  if (isAnnual.value) return Math.round(annualTotalCents.value / 12)
  const base = config.value?.base?.price_monthly_cents ?? 500
  return base + addonsTotalCents.value
})

const monthlyTotalDisplay = computed(() => formatMoney(monthlyTotalCents.value, 'usd'))

const monthlyTotalFullCents = computed(() => {
  if (!config.value) return 500
  let total = config.value.base.price_monthly_cents
  for (const addon of checkboxAddons.value) {
    if (selectedAddons[addon.slug]) total += addon.price_monthly_cents
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
    if (selectedAddons[addon.slug]) total += addon.price_annual_cents
  }
  const storageSlug = selectedAddons.storage
  if (storageSlug) {
    const opt = storageAddons.value.find((a) => a.slug === storageSlug)
    if (opt) total += opt.price_annual_cents
  }
  return total
})

const annualTotalDisplay = computed(() => formatMoney(annualTotalCents.value, 'usd'))

function formatStorage(bytes) {
  if (!bytes) return '0'
  const gb = bytes / (1024 * 1024 * 1024)
  return `${gb} GB`
}

function buildByoAddons() {
  const addons = {}
  for (const addon of checkboxAddons.value) {
    if (selectedAddons[addon.slug]) addons[addon.slug] = 1
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
      selectedAddons[addon.slug] = addon.is_default ?? false
    }
    const defaultStorage = storageAddons.value.find((a) => a.is_default)
    selectedAddons.storage = defaultStorage?.slug ?? null
  } catch (e) {
    error.value = e?.message ?? 'Failed to load pricing'
  } finally {
    loading.value = false
  }
})
</script>
