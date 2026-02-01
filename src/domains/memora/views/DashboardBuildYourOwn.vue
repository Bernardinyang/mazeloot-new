<template>
  <DashboardLayout>
    <template #breadcrumb>Build Your Own</template>
    <template #header>
      <div class="flex items-center justify-end w-full" />
    </template>

    <div class="space-y-10 max-w-4xl mx-auto pb-4">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Build Your Own Plan
        </h1>
        <p class="text-muted-foreground text-sm sm:text-base max-w-xl">
          Pick only what you need. Perfect for every creative.
        </p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        <p class="text-sm text-muted-foreground">Loading…</p>
      </div>
      <div v-else-if="error" class="rounded-xl border border-destructive/30 dark:border-destructive/50 bg-destructive/5 dark:bg-destructive/10 px-6 py-8 text-center text-destructive">
        {{ error }}
      </div>

      <template v-else>
        <div class="flex flex-col items-center gap-3">
          <p class="text-sm text-muted-foreground">Billing cycle</p>
          <div
            class="inline-flex rounded-full border border-border bg-muted/50 dark:bg-muted/70 p-1 shadow-inner"
            role="group"
            aria-label="Billing cycle"
          >
            <button
              type="button"
              :class="[
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                !isAnnual ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="isAnnual = false"
            >
              Monthly
            </button>
            <button
              type="button"
              :class="[
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-1.5',
                isAnnual ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="isAnnual = true"
            >
              Annual
              <span class="rounded bg-emerald-500/15 dark:bg-emerald-500/25 px-1.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">Save 17%</span>
            </button>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <article class="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-foreground">Base Plan</h2>
            <p class="mt-1 text-sm text-muted-foreground">Included in every Build Your Own plan</p>
            <div class="mt-4 flex items-baseline gap-1">
              <span class="text-2xl font-bold tabular-nums text-foreground">{{ basePriceDisplay }}</span>
              <span class="text-muted-foreground">/mo</span>
            </div>
            <ul class="mt-4 space-y-2 text-sm text-foreground/90">
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Platform access (Memora)
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {{ config?.base?.project_limit ?? 3 }} Projects
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Selection + Collection phases
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {{ formatStorage(config?.base?.storage_bytes ?? 5 * 1024 * 1024 * 1024) }} storage
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Mazeloot branding
              </li>
            </ul>
          </article>

          <article class="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 class="text-lg font-semibold text-foreground">Add-ons</h2>
            <p class="mt-1 text-sm text-muted-foreground">Select what you need</p>
            <div class="mt-4 space-y-3">
              <label
                v-for="addon in checkboxAddons"
                :key="addon.slug"
                class="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:bg-muted/50 dark:hover:bg-muted/70 has-[:checked]:border-accent/30 dark:has-[:checked]:border-accent/40 has-[:checked]:bg-accent/5 dark:has-[:checked]:bg-accent/10"
              >
                <span class="text-sm font-medium text-foreground">{{ addon.label }}</span>
                <input
                  v-model="selectedAddons[addon.slug]"
                  type="checkbox"
                  class="h-4 w-4 rounded border-input text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-background"
                />
              </label>
              <div v-if="storageAddons.length" class="border-t pt-4 mt-4 space-y-2">
                <p class="text-sm font-medium text-foreground">Storage (pick one)</p>
                <label class="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50 has-[:checked]:bg-accent/5">
                  <span class="text-sm text-foreground">None ({{ formatStorage(config?.base?.storage_bytes ?? 5 * 1024 * 1024 * 1024) }} base)</span>
                  <input v-model="selectedAddons.storage" type="radio" :value="null" class="h-4 w-4 border-input text-accent focus:ring-2 focus:ring-accent" />
                </label>
                <label
                  v-for="opt in storageAddons"
                  :key="opt.slug"
                  class="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50 dark:hover:bg-muted/70 has-[:checked]:bg-accent/5 dark:has-[:checked]:bg-accent/10"
                >
                  <span class="text-sm text-foreground">{{ opt.label }}</span>
                  <input v-model="selectedAddons.storage" type="radio" :value="opt.slug" class="h-4 w-4 border-input text-accent focus:ring-2 focus:ring-accent" />
                </label>
              </div>
            </div>
          </article>
        </div>

        <div class="rounded-2xl border-2 border-accent/30 dark:border-accent/40 bg-accent/5 dark:bg-accent/10 p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p class="text-sm text-muted-foreground">Your total</p>
              <div class="mt-1 flex items-baseline gap-1">
                <span class="text-3xl font-bold tabular-nums text-foreground">{{ monthlyTotalDisplay }}</span>
                <span class="text-muted-foreground">/mo</span>
              </div>
              <p v-if="isAnnual" class="mt-1 text-sm text-muted-foreground">
                {{ annualTotalDisplay }}/year (billed annually)
              </p>
            </div>
            <Button
              size="lg"
              class="rounded-lg shrink-0"
              :disabled="monthlyTotalCents < baseCents"
              @click="handleGetStarted"
            >
              Get Started
            </Button>
          </div>
        </div>
      </template>

      <div class="text-center">
        <RouterLink
          :to="{ name: 'memora-pricing' }"
          class="inline-flex items-center text-sm font-medium text-accent hover:underline dark:hover:text-accent/90"
        >
          View fixed plans
          <ChevronRight class="h-4 w-4 ml-1" />
        </RouterLink>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import { ChevronRight, Loader2 } from '@/shared/utils/lucideAnimated'
import { usePricingApi } from '@/domains/memora/api/pricing'
import { formatMoney } from '@/shared/utils/formatMoney'

const router = useRouter()
const { getBuildYourOwnConfig } = usePricingApi()

const isAnnual = ref(true)
const config = ref(null)
const loading = ref(true)
const error = ref(null)

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

function handleGetStarted() {
  const byoAddons = buildByoAddons()
  const billingCycle = isAnnual.value ? 'annual' : 'monthly'
  router.push({
    name: 'memora-plan-summary',
    query: {
      tier: 'byo',
      cycle: billingCycle,
      ...(byoAddons ? { byo_addons: JSON.stringify(byoAddons) } : {}),
    },
  })
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
