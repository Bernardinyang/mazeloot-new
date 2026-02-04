<template>
  <DashboardLayout>
    <template #breadcrumb>Plan Summary</template>
    <template #header>
      <Button variant="ghost" size="sm" class="rounded-lg" @click="goBack">
        <ChevronLeft class="h-4 w-4 mr-1" />
        Back
      </Button>
    </template>

    <div class="max-w-6xl mx-auto pb-16 px-4 sm:px-6">
      <h1 class="text-2xl font-bold text-foreground mb-2">Your cart</h1>
      <p class="text-muted-foreground text-sm mb-8">Review your plan and complete your order</p>

      <div v-if="loading" class="flex flex-col items-center py-16 gap-3">
        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        <p class="text-sm text-muted-foreground">Loading…</p>
      </div>

      <template v-else-if="!tier || tier === 'starter'">
        <div class="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-8 text-center">
          <p class="text-destructive font-medium">Invalid plan selected</p>
          <p class="text-sm text-muted-foreground mt-1">Please select a plan from the pricing page.</p>
          <Button class="mt-4" variant="outline" @click="goBack">Go to Pricing</Button>
        </div>
      </template>

      <template v-else>
        <div class="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
          <!-- Left: Plan config & payment -->
          <div class="space-y-6">
            <!-- Plan card -->
            <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 class="text-xl font-semibold text-foreground">{{ planName }}</h2>
                  <p v-if="selectedTierData?.description" class="text-sm text-muted-foreground mt-1">{{ selectedTierData.description }}</p>
                  <p class="text-sm text-muted-foreground mt-2">{{ billingCycleLabel }} plan</p>
                </div>
                <div v-if="orderSummary?.has_discount" class="rounded-md bg-emerald-500/15 dark:bg-emerald-500/25 px-3 py-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  SAVE {{ savePercent }}%
                </div>
              </div>
              <div class="mt-4 flex items-baseline gap-2">
                <span v-if="orderSummaryLoading" class="text-2xl font-bold tabular-nums">—</span>
                <template v-else>
                  <span v-if="orderSummary?.has_discount" class="text-lg text-muted-foreground line-through tabular-nums">{{ orderSummary?.subtotal_original_formatted }}</span>
                  <span class="text-2xl font-bold tabular-nums text-foreground">{{ orderSummary?.subtotal_formatted ?? convertedAmount }}</span>
                </template>
              </div>
              <p v-if="billingCycle === 'annual'" class="text-xs text-muted-foreground mt-1">
                Renews at {{ orderSummary?.subtotal_formatted ?? convertedAmount }}/year. Cancel anytime.
              </p>
              <div v-if="effectiveCurrency !== 'usd' && !orderSummaryLoading" class="mt-3 p-3 rounded-lg bg-muted/50 dark:bg-muted/30 text-xs">
                <p class="font-medium text-foreground mb-1.5">Currency conversion</p>
                <p v-if="oneUsdEquals" class="text-muted-foreground mb-2">1 USD = {{ oneUsdEquals }}</p>
                <dl class="space-y-1 text-muted-foreground">
                  <div class="flex justify-between gap-2">
                    <dt>From (USD)</dt>
                    <dd class="tabular-nums font-medium text-foreground">{{ orderSummary?.base_subtotal_formatted ?? baseAmountFormatted }}</dd>
                  </div>
                  <div class="flex justify-between gap-2">
                    <dt>To ({{ effectiveCurrency.toUpperCase() }})</dt>
                    <dd class="tabular-nums font-medium text-foreground">{{ orderSummary?.subtotal_formatted ?? convertedAmount }}</dd>
                  </div>
              </dl>
            </div>

              <!-- What's included -->
              <div class="mt-6 pt-5 border-t border-border">
                <h4 class="text-sm font-semibold text-foreground mb-3">What's included</h4>
                <ul v-if="tier === 'byo'" class="space-y-2 text-sm">
                  <li class="flex items-start gap-2 text-foreground/90">
                    <Check class="h-4 w-4 shrink-0 text-accent mt-0.5" />
                    <span>{{ byoBasePlanText }}</span>
                  </li>
                  <li
                    v-for="item in byoSummaryItems"
                    :key="item.slug"
                    class="flex items-start gap-2 text-foreground/90"
                  >
                    <Check class="h-4 w-4 shrink-0 text-accent mt-0.5" />
                    <span>{{ item.label }}{{ item.detail ? ` (${item.detail})` : '' }}</span>
                  </li>
                </ul>
                <ul v-else class="space-y-2 text-sm">
                  <li
                    v-for="f in summaryFeatures"
                    :key="f"
                    class="flex items-start gap-2 text-foreground/90"
                  >
                    <Check class="h-4 w-4 shrink-0 text-accent mt-0.5" />
                    <span>{{ f }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Payment method -->
            <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 class="font-semibold text-foreground mb-4">Payment method</h3>
              <div class="grid gap-3 sm:grid-cols-2">
                <button
                  v-for="p in providers"
                  :key="p.id"
                  type="button"
                  :class="[
                    'flex items-center gap-3 rounded-lg border p-4 text-left transition-colors',
                    selectedProvider === p.id
                      ? 'border-accent bg-accent/10 dark:bg-accent/15 ring-1 ring-accent/30'
                      : 'border-border hover:border-accent/50 hover:bg-muted/30',
                  ]"
                  @click="selectProvider(p)"
                >
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 dark:bg-muted/60 p-1.5">
                    <PaymentProviderLogo :provider-id="p.id" :name="p.name" />
                  </span>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-foreground">{{ p.name }}</p>
                    <p class="text-xs text-muted-foreground">Cards, bank transfer, etc.</p>
                  </div>
                  <Check v-if="selectedProvider === p.id" class="h-5 w-5 shrink-0 text-accent" />
                </button>
              </div>

              <div v-if="selectedProvider && currencies.length > 0" class="mt-5">
                <h4 class="text-sm font-medium text-foreground mb-2">Currency</h4>
                <select
                  :value="effectiveCurrency"
                  class="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Select currency"
                  @change="currencyStore.setCurrency($event.target.value)"
                >
                  <option v-for="c in currencies" :key="c.code" :value="c.code">
                    {{ c.symbol }} {{ c.code.toUpperCase() }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Right: Order summary (Hostinger-style) -->
          <div class="rounded-xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24 lg:self-start">
            <h3 class="text-lg font-bold text-foreground mb-6">Order summary</h3>

            <div v-if="orderSummaryLoading" class="flex items-center justify-center py-8">
              <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
            </div>

            <template v-else>
              <ul class="space-y-4">
                <li
                  v-for="item in orderSummary?.line_items ?? []"
                  :key="item.name"
                  class="flex flex-col gap-0.5 text-sm"
                >
                  <div class="flex justify-between items-start gap-2">
                    <span class="font-medium text-foreground">
                      {{ item.name }}{{ item.detail ? ` — ${item.detail}` : '' }}
                    </span>
                    <span class="tabular-nums text-foreground shrink-0">{{ item.price_formatted }}</span>
                  </div>
                  <div v-if="orderSummary?.has_discount && item.original_cents > item.price_cents" class="flex justify-end">
                    <span class="text-xs text-muted-foreground line-through tabular-nums">{{ item.original_formatted }}</span>
                  </div>
                </li>
              </ul>

              <div class="mt-5 pt-5 border-t border-border space-y-1">
                <div v-if="orderSummary?.has_discount" class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Original total</span>
                  <span class="line-through tabular-nums text-muted-foreground">{{ orderSummary?.subtotal_original_formatted }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Subtotal</span>
                  <span class="tabular-nums text-foreground">{{ orderSummary?.subtotal_formatted ?? '—' }}</span>
                </div>
                <div v-if="orderSummary?.vat_cents > 0" class="flex justify-between text-sm">
                  <span class="text-muted-foreground">VAT ({{ vatPercent }}%)</span>
                  <span class="tabular-nums text-foreground">{{ orderSummary?.vat_formatted ?? '—' }}</span>
                </div>
                <div class="flex justify-between items-baseline">
                  <span class="font-semibold text-foreground">Total</span>
                  <span class="text-xl font-bold tabular-nums text-foreground">{{ orderSummary?.total_formatted ?? orderSummary?.subtotal_formatted ?? '—' }}</span>
                </div>
              </div>

              <p class="mt-5 text-xs text-muted-foreground">
                Taxes (VAT) included as shown.
              </p>

              <div v-if="effectiveCurrency !== 'usd' && orderSummary?.base_subtotal_formatted" class="mt-5 p-3 rounded-lg bg-muted/50 dark:bg-muted/30 text-xs">
                <p class="font-medium text-foreground mb-1.5">Currency conversion</p>
                <p v-if="orderSummary.one_usd_equals" class="text-muted-foreground mb-2">1 USD = {{ orderSummary.one_usd_equals }}</p>
                <dl class="space-y-1 text-muted-foreground">
                  <div class="flex justify-between gap-2">
                    <dt>From (USD)</dt>
                    <dd class="tabular-nums font-medium text-foreground">{{ orderSummary.base_subtotal_formatted }}</dd>
                  </div>
                  <div v-if="orderSummary.base_subtotal_original_formatted" class="flex justify-between gap-2">
                    <dt>Original (USD)</dt>
                    <dd class="tabular-nums line-through">{{ orderSummary.base_subtotal_original_formatted }}</dd>
                  </div>
                  <div class="flex justify-between gap-2">
                    <dt>To ({{ (effectiveCurrency || 'usd').toUpperCase() }})</dt>
                    <dd class="tabular-nums font-medium text-foreground">{{ orderSummary.total_formatted ?? orderSummary.subtotal_formatted }}</dd>
                  </div>
                </dl>
              </div>

              <Button
                class="w-full mt-6 rounded-lg py-3 text-base font-semibold"
                :disabled="!selectedProvider || checkoutLoading"
                @click="proceedToPay"
              >
                <Loader2 v-if="checkoutLoading" class="h-4 w-4 mr-2 animate-spin" />
                Continue
              </Button>

              <p class="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Check class="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                30-day money-back guarantee
              </p>
            </template>
          </div>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import { Check, ChevronLeft, CreditCard, Loader2 } from '@/shared/utils/lucideAnimated'
import PaymentProviderLogo from '@/shared/components/PaymentProviderLogo.vue'
import { PLAN_COMPARISON_ROWS, getComparisonValue } from '@/domains/memora/constants/planComparison'
import { usePricingApi, useSubscriptionApi } from '@/domains/memora/api/pricing'
import { useCurrencyStore } from '@/shared/stores/currency'
import { formatMoney } from '@/shared/utils/formatMoney'
import { convertUsdCentsToFormatted } from '@/shared/utils/convertCurrency'
import { toast } from '@/shared/utils/toast'

const router = useRouter()
const route = useRoute()
const currencyStore = useCurrencyStore()
const { getTiers, getBuildYourOwnConfig, getCurrencyRates } = usePricingApi()
const { getCheckoutOptions, getOrderSummary, getPreview, createCheckout } = useSubscriptionApi()

const tiersData = ref([])
const byoConfig = ref(null)

const tier = computed(() => route.query.tier || null)
const billingCycle = computed(() => route.query.cycle || 'annual')
const byoAddons = computed(() => {
  const raw = route.query.byo_addons
  if (!raw) return null
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    return null
  }
})

const planName = computed(() => {
  const t = tier.value
  if (t === 'byo') return 'Build Your Own'
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : ''
})

const billingCycleLabel = computed(() => (billingCycle.value === 'annual' ? '12-month' : 'Monthly'))

const selectedTierData = computed(() =>
  tiersData.value.find(t => t.id === tier.value)
)

const summaryFeatures = computed(() => {
  const t = tier.value
  if (t === 'byo' || !t) return []
  const tierData = selectedTierData.value
  if (tierData?.features?.length) return tierData.features
  return PLAN_COMPARISON_ROWS
    .filter(r => {
      const v = getComparisonValue(r, t)
      return v === 'check' || (typeof v === 'string' && v !== '—')
    })
    .map(r => {
      const v = getComparisonValue(r, t)
      return v === 'check' ? r.label : `${r.label}: ${v}`
    })
})

const byoSummaryItems = computed(() => {
  const addons = byoAddons.value
  if (!addons || !byoConfig.value) return []
  const items = []
  const checkboxes = byoConfig.value.checkbox_addons ?? []
  const storages = byoConfig.value.storage_addons ?? []
  for (const slug of Object.keys(addons)) {
    const qty = addons[slug]
    const cb = checkboxes.find(a => a.slug === slug)
    if (cb) {
      items.push({ slug, label: cb.label, detail: qty > 1 ? `×${qty}` : null })
      continue
    }
    const st = storages.find(a => a.slug === slug)
    if (st) items.push({ slug, label: st.label, detail: formatStorage(st.storage_bytes) + (qty > 1 ? ` ×${qty}` : '') })
  }
  return items
})

const byoBasePlanText = computed(() => {
  const b = byoConfig.value?.base
  const proj = b?.project_limit ?? 1
  const sel = b?.base_selection_limit ?? 1
  const proof = b?.base_proofing_limit ?? 1
  const coll = b?.base_collection_limit ?? 1
  const raw = b?.base_raw_file_limit ?? 1
  const rev = b?.base_max_revisions ?? 0
  const storage = formatStorage(b?.storage_bytes ?? 5e9)
  const parts = [
    `${proj} project${proj !== 1 ? 's' : ''}`,
    `${sel} selection phase${sel !== 1 ? 's' : ''}`,
    `${proof} proofing phase${proof !== 1 ? 's' : ''}`,
    `${coll} collection phase${coll !== 1 ? 's' : ''}`,
    `${raw} raw file phase${raw !== 1 ? 's' : ''}`,
  ]
  if (rev > 0) parts.push(`${rev} revision${rev !== 1 ? 's' : ''} per proofing`)
  parts.push(`${storage} storage`)
  return 'Base plan — ' + parts.join(', ')
})

function formatStorage(bytes) {
  if (!bytes) return '0'
  const gb = bytes / (1024 * 1024 * 1024)
  return `${gb} GB`
}

const orderSummary = ref(null)
const orderSummaryLoading = ref(false)

const savePercent = computed(() => {
  if (!orderSummary.value?.has_discount) return 0
  const orig = orderSummary.value.subtotal_original_cents
  const curr = orderSummary.value.subtotal_cents
  if (orig <= 0) return 0
  return (1 - curr / orig) * 100
})

const vatPercent = computed(() => {
  const rate = orderSummary.value?.vat_rate
  return rate != null ? rate * 100 : 0
})

const loading = ref(true)
const providers = ref([])
const selectedProvider = ref(null)
const currencies = computed(() => {
  const p = providers.value.find(x => x.id === selectedProvider.value)
  return p?.currencies ?? []
})
const effectiveCurrency = computed(() => {
  const list = currencies.value
  const codes = list.map(c => (c.code || '').toLowerCase())
  if (codes.includes(currencyStore.currency)) return currencyStore.currency
  return list[0]?.code ?? 'usd'
})

const convertedAmount = ref('')
const baseAmountFormatted = ref('')
const oneUsdEquals = ref('')
const checkoutLoading = ref(false)

function goBack() {
  router.push({ name: 'memora-pricing' })
}

function selectProvider(provider) {
  selectedProvider.value = provider.id
  const codes = (provider.currencies ?? []).map(c => (c.code || '').toLowerCase())
  if (!codes.includes(currencyStore.currency)) {
    currencyStore.setCurrency(provider.currencies?.[0]?.code ?? 'usd')
  }
}

async function fetchOrderSummary() {
  if (!tier.value || tier.value === 'starter') return
  orderSummaryLoading.value = true
  try {
    orderSummary.value = await getOrderSummary(tier.value, billingCycle.value, effectiveCurrency.value, byoAddons.value)
  } catch {
    orderSummary.value = null
  } finally {
    orderSummaryLoading.value = false
  }
}

async function fetchPreview() {
  if (!tier.value || tier.value === 'starter') return
  try {
    const data = await getPreview(tier.value, billingCycle.value, byoAddons.value)
    const cur = effectiveCurrency.value
    baseAmountFormatted.value = data?.base_amount_cents != null ? formatMoney(data.base_amount_cents, 'usd') : (data?.base_amount_formatted ?? '')
    if (cur === 'usd') {
      convertedAmount.value = data?.amount_formatted ?? ''
      oneUsdEquals.value = ''
    } else {
      const rates = await getCurrencyRates()
      convertedAmount.value = data?.amount_cents != null ? convertUsdCentsToFormatted(data.amount_cents, cur, rates) : '—'
      oneUsdEquals.value = convertUsdCentsToFormatted(100, cur, rates)
    }
  } catch {
    convertedAmount.value = '—'
    oneUsdEquals.value = ''
  }
}

async function proceedToPay() {
  if (!selectedProvider.value || !effectiveCurrency.value || checkoutLoading.value) return
  checkoutLoading.value = true
  try {
    const result = await createCheckout(
      tier.value,
      billingCycle.value,
      selectedProvider.value,
      effectiveCurrency.value,
      byoAddons.value
    )
    if (result?.checkout_url) {
      window.location.href = result.checkout_url
    } else {
      toast.error('Failed to start checkout')
    }
  } catch (e) {
    toast.apiError(e, 'Failed to start checkout')
  } finally {
    checkoutLoading.value = false
  }
}

watch([effectiveCurrency, tier, billingCycle, byoAddons], () => {
  fetchOrderSummary()
  fetchPreview()
}, { immediate: false })
watch(selectedProvider, () => fetchOrderSummary(), { immediate: false })

onMounted(async () => {
  loading.value = true
  try {
    const [checkoutData, tiersRes, byoRes] = await Promise.all([
      getCheckoutOptions(),
      getTiers().catch(() => []),
      tier.value === 'byo' ? getBuildYourOwnConfig().catch(() => null) : Promise.resolve(null),
    ])
    tiersData.value = Array.isArray(tiersRes) ? tiersRes : (tiersRes?.data ?? [])
    if (tier.value === 'byo' && byoRes) byoConfig.value = byoRes
    const list = checkoutData?.providers ?? []
    providers.value = list
    if (list.length > 0) {
      const preferred = list.find((p) =>
        (p.currencies ?? []).some((c) => (c.code || '').toLowerCase() === currencyStore.currency)
      )
      selectProvider(preferred ?? list[0])
    }
    await Promise.all([fetchOrderSummary(), fetchPreview()])
  } catch {
    toast.error('Failed to load payment options')
  } finally {
    loading.value = false
  }
})
</script>
