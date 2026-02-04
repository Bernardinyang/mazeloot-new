<template>
  <DashboardLayout>
    <template #breadcrumb>Build Your Own</template>
    <template #header>
      <div class="flex items-center justify-end w-full"></div>
    </template>

    <div class="w-full max-w-5xl mx-auto min-w-0 pb-8 px-4 sm:px-6 lg:px-8">
      <!-- Hero -->
      <header class="rounded-2xl border border-border/60 bg-gradient-to-br from-muted/30 via-muted/10 to-transparent dark:from-muted/20 dark:via-muted/5 px-6 py-8 sm:px-8 sm:py-10 mb-8">
        <span class="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          Flexible pricing
        </span>
        <h1 class="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Build Your Own Plan
        </h1>
        <p class="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
          Pick only what you need. Perfect for every creative.
        </p>
        <div v-if="!loading && !error" class="mt-6 flex flex-wrap items-center gap-4 sm:gap-6">
          <div class="flex items-center gap-3">
            <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Billing</span>
            <div
              class="inline-flex rounded-full border border-border bg-muted/50 dark:bg-muted/70 p-1 shadow-sm"
              role="group"
              aria-label="Billing cycle"
            >
              <button
                type="button"
                :class="[
                  'rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 min-w-[88px]',
                  !isAnnual ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50 dark:bg-background dark:text-foreground dark:ring-border' : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground',
                ]"
                @click="isAnnual = false"
              >
                Monthly
              </button>
              <button
                type="button"
                :class="[
                  'rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 min-w-[88px]',
                  isAnnual ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50 dark:bg-background dark:text-foreground dark:ring-border' : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground',
                ]"
                @click="isAnnual = true"
              >
                Annual
                <span class="rounded bg-emerald-500/20 dark:bg-emerald-500/25 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">Save {{ heroAnnualSavePercent }}%</span>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Currency</span>
            <select
              :value="currencyStore.currency"
              aria-label="Currency"
              class="rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm min-w-[140px] transition-colors"
              @change="currencyStore.setCurrency($event.target.value)"
            >
              <option v-for="c in SUPPORTED_CURRENCIES" :key="c.code" :value="c.code">
                {{ c.label }}
              </option>
            </select>
          </div>
        </div>
      </header>

      <!-- Skeleton loader -->
      <template v-if="loading">
        <div
          class="grid lg:grid-cols-2 gap-6 xl:gap-8 byo-skeleton-grid"
          aria-busy="true"
          aria-label="Loading pricing options"
        >
          <article class="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-2">
                <Skeleton class="h-6 w-24" />
                <Skeleton class="h-4 w-56" />
              </div>
              <Skeleton class="h-9 w-20 shrink-0" />
            </div>
            <ul class="mt-6 space-y-3">
              <li v-for="i in 9" :key="i" class="flex items-center gap-3">
                <Skeleton class="h-5 w-5 shrink-0 rounded-full" />
                <Skeleton class="h-4 flex-1 max-w-[180px]" />
              </li>
            </ul>
          </article>
          <article class="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <Skeleton class="h-6 w-20" />
            <Skeleton class="mt-1 h-4 w-40" />
            <div class="mt-5 space-y-2">
              <Skeleton v-for="i in 6" :key="i" class="h-12 w-full rounded-xl" />
            </div>
            <div class="mt-4 pt-4 border-t border-border space-y-2">
              <Skeleton class="h-4 w-24 mb-3" />
              <Skeleton v-for="i in 3" :key="'s' + i" class="h-12 w-full rounded-xl" />
            </div>
          </article>
        </div>
        <div class="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div class="space-y-2">
              <Skeleton class="h-3 w-16" />
              <Skeleton class="h-10 w-32" />
            </div>
            <Skeleton class="h-12 w-full sm:w-[200px] rounded-xl" />
          </div>
        </div>
      </template>

      <div v-else-if="error" class="rounded-2xl border border-destructive/30 bg-destructive/5 dark:bg-destructive/10 px-6 py-12 text-center byo-fade-in">
        <p class="text-destructive font-medium">{{ error }}</p>
      </div>

      <div v-else>
      <Transition name="byo-content" mode="out-in">
        <div v-if="!loading && !error" key="content" class="space-y-8">
          <div class="grid lg:grid-cols-2 gap-6 xl:gap-8 lg:items-start">
            <div class="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <article class="byo-card rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-accent/20 focus-within:ring-2 focus-within:ring-accent/30 focus-within:ring-offset-2 overflow-hidden shrink-0">
            <div class="bg-muted/40 dark:bg-muted/20 px-6 sm:px-8 pt-6 pb-4 border-b border-border/60">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <span class="inline-block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80 mb-1.5">Included in every plan</span>
                  <h2 class="text-lg sm:text-xl font-semibold text-foreground">Base Plan</h2>
                </div>
                <div class="flex flex-col items-end shrink-0">
                  <div v-if="basePlanSaveBadge" class="mb-1.5">
                    <span class="inline-flex items-center rounded-md bg-emerald-500/15 dark:bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      Save {{ basePlanSaveBadge.percent }}%
                    </span>
                  </div>
                  <div class="flex flex-wrap items-baseline justify-end gap-2">
                    <span v-if="basePlanSaveBadge" class="text-lg sm:text-xl text-muted-foreground line-through tabular-nums">{{ basePlanOriginalPriceDisplay }}</span>
                    <span class="text-2xl sm:text-3xl font-bold tabular-nums text-foreground leading-none">{{ basePriceDisplay }}</span>
                  </div>
                  <span class="text-xs text-muted-foreground mt-0.5">/ month</span>
                </div>
              </div>
            </div>
            <div class="p-6 sm:p-8">
              <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">What&apos;s included</p>
              <ul class="space-y-2.5 text-sm text-foreground/90">
                <li class="flex items-center gap-3 py-0.5">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
                    <Check class="h-3 w-3" />
                  </span>
                  <span>Platform access (Memora)</span>
                </li>
                <li class="flex items-center gap-3 py-0.5">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
                    <Check class="h-3 w-3" />
                  </span>
                  <span>{{ config?.base?.project_limit ?? 1 }} project{{ (config?.base?.project_limit ?? 1) !== 1 ? 's' : '' }}</span>
                </li>
                <li class="flex items-center gap-3 py-0.5">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
                    <Check class="h-3 w-3" />
                  </span>
                  <span>{{ config?.base?.base_selection_limit ?? 1 }} selection phase{{ (config?.base?.base_selection_limit ?? 1) !== 1 ? 's' : '' }}</span>
                </li>
                <li class="flex items-center gap-3 py-0.5">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
                    <Check class="h-3 w-3" />
                  </span>
                  <span>{{ config?.base?.base_proofing_limit ?? 1 }} proofing phase{{ (config?.base?.base_proofing_limit ?? 1) !== 1 ? 's' : '' }}</span>
                </li>
                <li class="flex items-center gap-3 py-0.5">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
                    <Check class="h-3 w-3" />
                  </span>
                  <span>{{ config?.base?.base_collection_limit ?? 1 }} collection phase{{ (config?.base?.base_collection_limit ?? 1) !== 1 ? 's' : '' }}</span>
                </li>
                <li class="flex items-center gap-3 py-0.5">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
                    <Check class="h-3 w-3" />
                  </span>
                  <span>{{ config?.base?.base_raw_file_limit ?? 1 }} raw file phase{{ (config?.base?.base_raw_file_limit ?? 1) !== 1 ? 's' : '' }}</span>
                </li>
                <li v-if="(config?.base?.base_max_revisions ?? 0) > 0" class="flex items-center gap-3 py-0.5">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
                    <Check class="h-3 w-3" />
                  </span>
                  <span>{{ config?.base?.base_max_revisions }} revision{{ config?.base?.base_max_revisions !== 1 ? 's' : '' }} per proofing</span>
                </li>
                <li class="flex items-center gap-3 py-0.5">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
                    <Check class="h-3 w-3" />
                  </span>
                  <span>{{ formatStorage(config?.base?.storage_bytes ?? 5 * 1024 * 1024 * 1024) }} storage</span>
                </li>
                <li class="flex items-center gap-3 py-0.5">
                  <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden="true">
                    <Check class="h-3 w-3" />
                  </span>
                  <span>Mazeloot branding</span>
                </li>
              </ul>
            </div>
          </article>

          <div class="byo-cta rounded-2xl border-2 border-accent/30 dark:border-accent/40 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 dark:from-accent/15 dark:via-accent/10 dark:to-accent/15 p-6 sm:p-8 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl shrink-0">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Your total</p>
                <p class="flex flex-wrap items-baseline gap-2">
                  <span v-if="hasDiscount" class="text-lg text-muted-foreground line-through tabular-nums">{{ subtotalOriginalDisplay }}</span>
                  <span class="text-3xl sm:text-4xl font-bold tabular-nums text-foreground">
                    <span :class="{ 'byo-price-loading': convertedLoading }">{{ monthlyTotalDisplay }}</span><span class="text-lg font-normal text-muted-foreground">/mo</span>
                  </span>
                </p>
                <p v-if="isAnnual" class="mt-1.5 text-sm text-muted-foreground">
                  {{ annualTotalDisplay }} per year, billed annually
                </p>
              </div>
              <Button
                size="lg"
                class="w-full sm:w-auto min-w-[200px] rounded-xl text-base font-semibold py-6 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:opacity-60"
                :disabled="loading || !config?.base || (isAnnual ? subtotalCents < baseAnnualCents : subtotalCents < baseMonthlyCents)"
                @click="handleGetStarted"
              >
                Get Started
              </Button>
            </div>
          </div>
              <p class="text-center pt-1">
                <RouterLink
                  :to="{ name: 'memora-pricing' }"
                  class="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline dark:hover:text-accent/90 rounded px-2 py-1"
                >
                  View fixed plans
                  <ChevronRight class="h-4 w-4" />
                </RouterLink>
              </p>
            </div>

          <article class="byo-card byo-card-2 rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-accent/20 focus-within:ring-2 focus-within:ring-accent/30 focus-within:ring-offset-2 overflow-hidden lg:min-h-0">
            <div class="bg-muted/40 dark:bg-muted/20 px-6 sm:px-8 pt-6 pb-4 border-b border-border/60">
              <span class="inline-block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80 mb-1.5">Optional</span>
              <h2 class="text-lg sm:text-xl font-semibold text-foreground">Add-ons</h2>
              <p class="mt-1 text-sm text-muted-foreground">Select what you need</p>
            </div>
            <div class="p-6 sm:p-8 space-y-5">
              <div class="space-y-2">
                <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Features &amp; limits</p>
                <template v-for="addon in checkboxAddons">
                  <div
                    v-if="isLimitAddon(addon)"
                    :key="`limit-${addon.slug}`"
                    class="rounded-xl border transition-all duration-200 overflow-hidden"
                    :class="(selectedAddons[addon.slug] || 0) > 0 ? 'border-accent/50 bg-accent/5 dark:bg-accent/10 shadow-sm' : 'border-border/60 hover:bg-muted/30 dark:hover:bg-muted/15'"
                  >
                    <label class="flex cursor-pointer items-start sm:items-center gap-3 p-4 sm:gap-4">
                      <input
                        type="checkbox"
                        :checked="(selectedAddons[addon.slug] || 0) > 0"
                        aria-label="Enable {{ addon.label }}"
                        class="mt-0.5 sm:mt-0 h-4 w-4 rounded border-input text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-background shrink-0"
                        @change="selectedAddons[addon.slug] = $event.target.checked ? 1 : 0"
                      />
                      <div class="min-w-0 flex-1">
                        <p class="font-medium text-foreground text-sm leading-snug">{{ addon.label }}</p>
                        <p class="mt-0.5 text-xs text-muted-foreground tabular-nums">{{ addonPrice(addon) }}</p>
                      </div>
                    </label>
                    <Transition name="byo-qty">
                      <div
                        v-show="(selectedAddons[addon.slug] || 0) > 0"
                        class="byo-qty-row flex items-center gap-3 border-t border-border/50 bg-muted/30 dark:bg-muted/20 px-4 py-3"
                      >
                        <span class="text-xs font-medium text-muted-foreground">Quantity</span>
                        <input
                          :value="selectedAddons[addon.slug]"
                          type="number"
                          min="1"
                          max="999"
                          class="h-9 w-24 rounded-lg border border-input bg-background px-3 text-center font-variant-numeric tabular-nums text-sm font-medium focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-background"
                          aria-label="Quantity for {{ addon.label }}"
                          @input="clampAddonQty(addon.slug, $event.target.value)"
                        />
                      </div>
                    </Transition>
                  </div>
                  <label
                    v-else
                    :key="`check-${addon.slug}`"
                    class="flex cursor-pointer items-start sm:items-center gap-3 p-4 sm:gap-4 rounded-xl border transition-all duration-200 border-border/60 hover:bg-muted/30 dark:hover:bg-muted/15 has-[:checked]:border-accent/50 has-[:checked]:bg-accent/5 dark:has-[:checked]:bg-accent/10 has-[:checked]:shadow-sm"
                  >
                    <input
                      v-model="selectedAddons[addon.slug]"
                      type="checkbox"
                      class="mt-0.5 sm:mt-0 h-4 w-4 rounded border-input text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-background shrink-0"
                    />
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-foreground text-sm leading-snug">{{ addon.label }}</p>
                      <p class="mt-0.5 text-xs text-muted-foreground tabular-nums">{{ addonPrice(addon) }}</p>
                    </div>
                  </label>
                </template>
              </div>
              <div v-if="storageAddons.length" class="pt-4 border-t border-border/60 space-y-2">
                <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Storage</p>
                <div class="space-y-2">
                  <label
                    class="flex cursor-pointer items-start sm:items-center gap-3 p-4 sm:gap-4 rounded-xl border transition-all duration-200 border-border/60 hover:bg-muted/30 dark:hover:bg-muted/15 has-[:checked]:border-accent/50 has-[:checked]:bg-accent/5 dark:has-[:checked]:bg-accent/10 has-[:checked]:shadow-sm"
                  >
                    <input v-model="selectedAddons.storage" type="radio" :value="null" class="mt-0.5 sm:mt-0 h-4 w-4 border-input text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-background shrink-0" aria-label="Base storage" />
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-foreground text-sm leading-snug">Base ({{ formatStorage(config?.base?.storage_bytes ?? 5 * 1024 * 1024 * 1024) }})</p>
                      <p class="mt-0.5 text-xs text-muted-foreground">Included</p>
                    </div>
                  </label>
                  <label
                    v-for="opt in storageAddons"
                    :key="opt.slug"
                    class="flex cursor-pointer items-start sm:items-center gap-3 p-4 sm:gap-4 rounded-xl border transition-all duration-200 border-border/60 hover:bg-muted/30 dark:hover:bg-muted/15 has-[:checked]:border-accent/50 has-[:checked]:bg-accent/5 dark:has-[:checked]:bg-accent/10 has-[:checked]:shadow-sm"
                  >
                    <input v-model="selectedAddons.storage" type="radio" :value="opt.slug" class="mt-0.5 sm:mt-0 h-4 w-4 border-input text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-background shrink-0" :aria-label="opt.label" />
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-foreground text-sm leading-snug">{{ opt.label }}</p>
                      <p class="mt-0.5 text-xs text-muted-foreground tabular-nums">{{ storageAddonPrice(opt) }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </article>
          </div>
        </div>
      </Transition>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import Skeleton from '@/shared/components/shadcn/skeleton/Skeleton.vue'
import { Check, ChevronRight } from '@/shared/utils/lucideAnimated'
import { usePricingApi, useSubscriptionApi } from '@/domains/memora/api/pricing'
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '@/shared/stores/currency'
import { formatMoney } from '@/shared/utils/formatMoney'
import { convertUsdCentsToFormatted, convertUsdCentsToTargetSmallest } from '@/shared/utils/convertCurrency'
import { getAnnualSavePct } from '@/shared/utils/pricing'

const router = useRouter()
const currencyStore = useCurrencyStore()
const { getBuildYourOwnConfig, getCurrencyRates } = usePricingApi()

const isAnnual = ref(true)
const config = ref(null)
const loading = ref(true)
const error = ref(null)
const currencyRates = ref({})
const convertedLoading = ref(false)

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

function clampAddonQty(slug, val) {
  const n = Math.max(1, Math.min(999, parseInt(val, 10) || 1))
  selectedAddons[slug] = n
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

async function fetchRates() {
  const cur = currencyStore.currency
  if (cur === 'usd') {
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

const baseMonthlyCents = computed(() => config.value?.base?.price_monthly_cents ?? 500)
const baseAnnualCents = computed(() => config.value?.base?.price_annual_cents ?? 5000)

/**
 * Mirrors backend getOrderSummary/calculateAmount for BYO.
 * One source of truth so dashboard totals match Plan Summary and checkout.
 */
const byoOrderSummary = computed(() => {
  const base = config.value?.base
  if (!base) {
    return { subtotalCents: 0, subtotalOriginalCents: 0, hasDiscount: false }
  }
  const annual = isAnnual.value
  const baseMonthly = base.price_monthly_cents ?? 500
  const baseAnnual = base.price_annual_cents ?? 5000
  const basePrice = annual ? baseAnnual : baseMonthly
  const baseOriginal = annual ? baseMonthly * 12 : baseMonthly
  let subtotalCents = basePrice
  let subtotalOriginalCents = baseOriginal

  for (const addon of checkboxAddons.value) {
    const qty = isLimitAddon(addon)
      ? Math.max(0, parseInt(selectedAddons[addon.slug], 10) || 0)
      : (selectedAddons[addon.slug] ? 1 : 0)
    if (qty <= 0) continue
    const addonMonthly = addon.price_monthly_cents ?? 0
    const addonAnnual = addon.price_annual_cents ?? 0
    subtotalCents += annual ? addonAnnual * qty : addonMonthly * qty
    subtotalOriginalCents += annual ? addonMonthly * 12 * qty : addonMonthly * qty
  }
  const storageSlug = selectedAddons.storage
  if (storageSlug) {
    const opt = storageAddons.value.find((a) => a.slug === storageSlug)
    if (opt) {
      const addonMonthly = opt.price_monthly_cents ?? 0
      const addonAnnual = opt.price_annual_cents ?? 0
      subtotalCents += annual ? addonAnnual : addonMonthly
      subtotalOriginalCents += annual ? addonMonthly * 12 : addonMonthly
    }
  }

  const hasDiscount = annual && subtotalCents < subtotalOriginalCents
  return { subtotalCents, subtotalOriginalCents, hasDiscount }
})

const subtotalCents = computed(() => byoOrderSummary.value.subtotalCents)
const subtotalOriginalCents = computed(() => byoOrderSummary.value.subtotalOriginalCents)
const hasDiscount = computed(() => byoOrderSummary.value.hasDiscount)

const monthlyEquivalentCents = computed(() =>
  isAnnual.value ? Math.round(subtotalCents.value / 12) : subtotalCents.value
)

const basePlanSaveBadge = computed(() => {
  if (!isAnnual.value || !config.value?.base) return null
  const monthly = config.value.base.price_monthly_cents ?? 0
  const annualPerMonth = (config.value.base.price_annual_cents ?? 0) / 12
  if (monthly <= 0 || annualPerMonth >= monthly) return null
  const percent = (1 - annualPerMonth / monthly) * 100
  if (percent <= 0) return null
  return { percent }
})

const heroAnnualSavePercent = computed(() => basePlanSaveBadge.value?.percent ?? getAnnualSavePct(config.value?.base?.annual_discount_months))

const basePlanOriginalPriceDisplay = computed(() => {
  if (!isAnnual.value || !config.value?.base) return ''
  const usdCents = config.value.base.price_monthly_cents ?? 0
  if (currencyStore.currency === 'usd') return formatMoney(usdCents, 'usd')
  return convertUsdCentsToFormatted(usdCents, currencyStore.currency, currencyRates.value)
})

const basePriceDisplay = computed(() => {
  if (!config.value?.base) return formatMoney(500, 'usd')
  const cur = currencyStore.currency
  const baseMonthly = config.value.base.price_monthly_cents ?? 0
  const baseAnnual = config.value.base.price_annual_cents ?? 0
  if (cur === 'usd') {
    const usdCents = isAnnual.value ? Math.round(baseAnnual / 12) : baseMonthly
    return formatMoney(usdCents, 'usd')
  }
  if (convertedLoading.value) return '…'
  if (isAnnual.value) {
    const baseAnnualInTarget = convertUsdCentsToTargetSmallest(baseAnnual, cur, currencyRates.value)
    const baseAnnualMain = cur === 'jpy' ? baseAnnualInTarget : baseAnnualInTarget / 100
    const baseMonthlyMain = baseAnnualMain / 12
    return formatMoney(baseMonthlyMain, cur, { inCents: false })
  }
  return convertUsdCentsToFormatted(baseMonthly, cur, currencyRates.value)
})

const monthlyTotalDisplay = computed(() => {
  const cur = currencyStore.currency
  if (cur === 'usd') return formatMoney(monthlyEquivalentCents.value, 'usd')
  if (convertedLoading.value) return '…'
  if (isAnnual.value) {
    const annualInTarget = convertUsdCentsToTargetSmallest(subtotalCents.value, cur, currencyRates.value)
    const annualMain = cur === 'jpy' ? annualInTarget : annualInTarget / 100
    const monthlyMain = annualMain / 12
    return formatMoney(monthlyMain, cur, { inCents: false })
  }
  return convertUsdCentsToFormatted(subtotalCents.value, cur, currencyRates.value)
})

const annualTotalDisplay = computed(() => {
  if (!isAnnual.value) return ''
  const cur = currencyStore.currency
  const cents = subtotalCents.value
  if (cur === 'usd') return formatMoney(cents, 'usd')
  if (convertedLoading.value) return '…'
  const annualInTarget = convertUsdCentsToTargetSmallest(cents, cur, currencyRates.value)
  if (cur === 'jpy') return formatMoney(annualInTarget, 'jpy', { inCents: false })
  return formatMoney(annualInTarget, cur)
})

const subtotalOriginalDisplay = computed(() => {
  if (!hasDiscount.value) return ''
  const cur = currencyStore.currency
  const cents = subtotalOriginalCents.value
  if (cur === 'usd') return formatMoney(cents, 'usd')
  if (convertedLoading.value) return '…'
  return convertUsdCentsToFormatted(cents, cur, currencyRates.value)
})

function formatStorage(bytes) {
  if (!bytes) return '0'
  const gb = bytes / (1024 * 1024 * 1024)
  return `${gb} GB`
}

function addonPrice(addon) {
  if (!addon) return ''
  const usdCents = isAnnual.value
    ? Math.round((addon.price_annual_cents ?? 0) / 12)
    : (addon.price_monthly_cents ?? 0)
  return convertUsdCentsToFormatted(usdCents, currencyStore.currency, currencyRates.value) + '/mo'
}

function storageAddonPrice(opt) {
  if (!opt) return ''
  const usdCents = isAnnual.value
    ? Math.round((opt.price_annual_cents ?? 0) / 12)
    : (opt.price_monthly_cents ?? 0)
  return convertUsdCentsToFormatted(usdCents, currencyStore.currency, currencyRates.value) + '/mo'
}

watch(
  () => [currencyStore.currency, config.value],
  () => fetchRates(),
  { immediate: false }
)

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
      if (isLimitAddon(addon)) {
        selectedAddons[addon.slug] = addon.is_default ? 1 : 0
      } else {
        selectedAddons[addon.slug] = addon.is_default ?? false
      }
    }
    const defaultStorage = storageAddons.value.find((a) => a.is_default)
    selectedAddons.storage = defaultStorage?.slug ?? null
    if (currencyStore.currency !== 'usd') await fetchRates()
  } catch (e) {
    error.value = e?.message ?? 'Failed to load pricing'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Content enter */
.byo-content-enter-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.byo-content-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.byo-card {
  animation: byo-card-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}
.byo-card-2 {
  animation-delay: 0.06s;
}
.byo-cta {
  animation: byo-card-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.12s backwards;
}
@keyframes byo-card-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Quantity row expand */
.byo-qty-enter-active,
.byo-qty-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: top;
}
.byo-qty-enter-from,
.byo-qty-leave-to {
  opacity: 0;
  transform: translateY(-6px) scaleY(0.95);
}

.byo-price-loading {
  opacity: 0.7;
  animation: byo-pulse 1.2s ease-in-out infinite;
}
@keyframes byo-pulse {
  50% { opacity: 1; }
}

.byo-fade-in {
  animation: byo-card-in 0.3s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .byo-content-enter-active,
  .byo-qty-enter-active,
  .byo-qty-leave-active {
    transition-duration: 0.01ms;
  }
  .byo-card,
  .byo-card-2,
  .byo-cta {
    animation-duration: 0.01ms;
  }
  .byo-price-loading {
    animation: none;
  }
}
</style>
