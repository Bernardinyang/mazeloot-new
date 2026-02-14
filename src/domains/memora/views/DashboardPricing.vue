<template>
  <DashboardLayout>
    <template #breadcrumb>Plans &amp; Pricing</template>
    <template #header>
      <div class="flex items-center justify-end w-full" />
    </template>

    <div class="min-w-0 w-full space-y-10 max-w-7xl mx-auto pb-4 px-4 sm:px-6">
      <!-- Page Header -->
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Plans &amp; Pricing
        </h1>
        <p class="text-muted-foreground text-sm sm:text-base max-w-xl">
          {{ currentSubscription ? 'Manage your subscription or upgrade to unlock more features' : 'Choose the plan that works best for your photography business' }}
        </p>
        <RouterLink
          v-if="hasPendingUpgradeOrDowngradeRequest"
          :to="{ name: 'memora-plan-requests' }"
          class="text-sm font-medium text-foreground underline hover:no-underline"
        >
          View your plan change requests
        </RouterLink>
      </div>

      <!-- Current Plan Banner -->
      <div
        v-if="currentTier !== 'starter'"
        class="rounded-2xl p-4 sm:p-6 border border-amber-500/20 dark:border-amber-500/30 bg-gradient-to-br from-amber-500/8 via-amber-500/4 to-transparent dark:from-amber-500/15 dark:via-amber-500/8 dark:to-transparent shadow-sm"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-4 min-w-0 flex-1">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Crown class="h-6 w-6" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Current Plan</p>
              <p class="text-lg font-semibold text-foreground">{{ currentTierLabel }}</p>
              <p v-if="currentSubscription" class="text-sm text-muted-foreground mt-0.5">
                {{ currentSubscription.billing_cycle === 'annual' ? 'Annual' : 'Monthly' }} billing
                <span v-if="currentSubscription.current_period_end">
                  · Renews {{ formatDate(currentSubscription.current_period_end) }}
                </span>
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 shrink-0">
            <Button variant="outline" size="sm" class="rounded-lg" @click="goToUsage">
              <BarChart3 class="h-4 w-4 mr-2" />
              View Usage
            </Button>
            <Button
              v-if="currentSubscription"
              variant="outline"
              size="sm"
              class="rounded-lg"
              :disabled="portalLoading"
              @click="openBillingPortal"
            >
              <Settings class="h-4 w-4 mr-2" />
              {{ portalLoading ? 'Loading…' : 'Manage Billing' }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Billing cycle + Currency -->
      <div v-if="!loading && !error" class="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        <div class="flex flex-col items-center gap-2">
          <p class="text-sm text-muted-foreground">Billing cycle</p>
          <div
            class="inline-flex rounded-full border border-border bg-muted/50 dark:bg-muted/70 p-1 shadow-inner"
            role="group"
            aria-label="Billing cycle"
          >
            <button
              type="button"
              :class="[
                'rounded-full px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-200',
                !isAnnual
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="isAnnual = false"
            >
              Monthly
            </button>
            <button
              type="button"
              :class="[
                'rounded-full px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-1.5',
                isAnnual
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="isAnnual = true"
            >
              Annual
              <span class="rounded bg-emerald-500/15 dark:bg-emerald-500/25 px-1.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">Save {{ annualSavePct }}%</span>
            </button>
          </div>
        </div>
        <div class="flex flex-col items-center gap-2">
          <p class="text-sm text-muted-foreground">Prices in</p>
          <select
            :value="currencyStore.currency"
            aria-label="Currency"
            class="rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm min-w-0 max-w-full"
            @change="currencyStore.setCurrency($event.target.value)"
          >
            <option v-for="c in SUPPORTED_CURRENCIES" :key="c.code" :value="c.code">
              {{ c.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="rounded-2xl border border-border bg-card overflow-hidden shadow-sm p-4 sm:p-8 space-y-6 animate-pulse">
        <div class="h-8 w-48 rounded bg-muted" />
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="h-24 rounded-lg bg-muted" />
          <div class="h-24 rounded-lg bg-muted" />
        </div>
        <div class="h-12 w-32 rounded-lg bg-muted" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-xl border border-destructive/30 dark:border-destructive/50 bg-destructive/5 dark:bg-destructive/10 px-6 py-8 text-center text-destructive">
        {{ error }}
      </div>

      <template v-else>
        <!-- Upgrade Redirect Alert -->
        <div
          v-if="upgradeFeature"
          class="rounded-xl border border-amber-500/30 dark:border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/15 px-6 py-4 flex items-start gap-3"
          role="alert"
          aria-live="polite"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400">
            <Info class="h-5 w-5" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-medium text-foreground">Upgrade required</p>
            <p class="text-sm text-muted-foreground mt-0.5">
              {{ upgradeAlertMessage }}
            </p>
          </div>
        </div>

        <!-- Pending upgrade/downgrade request alert -->
        <div
          v-if="hasPendingUpgradeOrDowngradeRequest"
          class="rounded-xl border border-amber-500/30 dark:border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/15 px-6 py-4 flex items-start gap-3"
          role="alert"
          aria-live="polite"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400">
            <Info class="h-5 w-5" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-medium text-foreground">Request in progress</p>
            <p class="text-sm text-muted-foreground mt-0.5">
              You have a pending upgrade or downgrade request. Plan changes are disabled until it is completed.
            </p>
            <RouterLink
              :to="{ name: 'memora-plan-requests' }"
              class="text-sm font-medium text-foreground underline hover:no-underline mt-2 inline-block"
            >
              View your requests
            </RouterLink>
          </div>
        </div>

        <!-- Pricing Cards: Row 1 = 2 cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <article
            v-for="tier in tiersFirstRow"
            :key="tier.id"
            :class="[
              'relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200',
              'hover:shadow-md hover:border-accent/30 dark:hover:border-accent/50',
              tier.popular && 'border-accent dark:border-accent shadow-md ring-1 ring-accent/20',
              currentTier === tier.id && 'border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10',
              upgradeTargetTier === tier.id && currentTier !== tier.id && 'ring-2 ring-amber-500/50 dark:ring-amber-500/40 border-amber-500/40 dark:border-amber-500/30 shadow-lg',
            ]"
          >
            <div
              v-if="tier.popular"
              class="bg-accent py-2.5 text-center text-xs font-bold uppercase tracking-wider text-accent-foreground"
            >
              Most Popular
            </div>
            <div class="flex flex-col p-4 sm:p-6">
              <h2 class="text-xl font-bold text-foreground">{{ tier.name }}</h2>
              <p class="mt-1.5 text-sm text-muted-foreground leading-relaxed">{{ tier.description }}</p>
              <div class="mt-4 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    v-if="isAnnual && hasDiscount(tier)"
                    class="text-sm text-muted-foreground line-through tabular-nums"
                  >
                    Was {{ wasPrice(tier) }}
                  </span>
                  <span
                    v-if="isAnnual && hasDiscount(tier)"
                    class="inline-block rounded-md bg-amber-200/90 dark:bg-amber-400/30 px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-200 shadow-sm -rotate-1"
                  >
                    {{ discountPercent(tier) }}% OFF
                  </span>
                </div>
                <div class="flex flex-wrap items-baseline gap-1.5">
                  <span class="text-3xl font-bold tabular-nums text-foreground">{{ displayPrice(tier) }}</span>
                  <span class="text-base text-muted-foreground">/ month</span>
                </div>
                <p
                  v-if="isAnnual && (tier.price_annual_cents > 0)"
                  class="text-xs text-muted-foreground"
                >
                  For a 1-year term. Pay {{ termToday(tier) }} today, then {{ termRenewal(tier) }} on renewal.
                </p>
              </div>
              <div class="mt-4 flex flex-wrap items-center gap-2">
                <span
                  v-if="currentTier === tier.id"
                  class="rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  Current
                </span>
                <span
                  v-else-if="upgradeTargetTier === tier.id"
                  class="rounded-full bg-amber-500/20 dark:bg-amber-500/30 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300"
                >
                  Recommended
                </span>
              </div>
              <Button
                :class="[
                  'mt-6 w-full rounded-lg py-2.5 text-sm font-semibold uppercase tracking-wide',
                  getButtonLabel(tier) === 'Get started' && '!bg-foreground !text-background hover:!bg-foreground/90 dark:!bg-foreground dark:!text-background dark:hover:!bg-foreground/90',
                ]"
                :variant="getButtonVariant(tier)"
                :disabled="portalLoading || currentTier === tier.id || hasPendingUpgradeOrDowngradeRequest"
                @click="handleSelectPlan(tier)"
              >
                <template v-if="portalLoading && tier.id === 'starter'">
                  <Loader2 class="h-4 w-4 mr-2 animate-spin" />
                  Loading…
                </template>
                <template v-else>
                  {{ getButtonLabel(tier) }}
                </template>
              </Button>
              <ul class="mt-6 flex-1 space-y-2.5">
                <li
                  v-for="feature in tier.features"
                  :key="feature"
                  class="flex min-w-0 items-start gap-3 text-sm text-foreground/90"
                >
                  <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 dark:bg-accent/20 text-accent">
                    <Check class="h-3 w-3" />
                  </span>
                  <span class="min-w-0 flex-1">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </article>
        </div>

        <!-- Row 2: 2 cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <article
              v-for="tier in tiersSecondRow"
              :key="tier.id"
              :class="[
                'relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200',
                'hover:shadow-md hover:border-accent/30 dark:hover:border-accent/50',
                tier.popular && 'border-accent dark:border-accent shadow-md ring-1 ring-accent/20',
                currentTier === tier.id && 'border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10',
                upgradeTargetTier === tier.id && currentTier !== tier.id && 'ring-2 ring-amber-500/50 dark:ring-amber-500/40 border-amber-500/40 dark:border-amber-500/30 shadow-lg',
              ]"
            >
              <div
                v-if="tier.popular"
                class="bg-accent py-2.5 text-center text-xs font-bold uppercase tracking-wider text-accent-foreground"
              >
                Most Popular
              </div>
              <div class="flex flex-col p-4 sm:p-6">
                <h2 class="text-xl font-bold text-foreground">{{ tier.name }}</h2>
                <p class="mt-1.5 text-sm text-muted-foreground leading-relaxed">{{ tier.description }}</p>
                <div class="mt-4 space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      v-if="isAnnual && hasDiscount(tier)"
                      class="text-sm text-muted-foreground line-through tabular-nums"
                    >
                      Was {{ wasPrice(tier) }}
                    </span>
                    <span
                      v-if="isAnnual && hasDiscount(tier)"
                      class="inline-block rounded-md bg-amber-200/90 dark:bg-amber-400/30 px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-200 shadow-sm -rotate-1"
                    >
                      {{ discountPercent(tier) }}% OFF
                    </span>
                  </div>
                  <div class="flex flex-wrap items-baseline gap-1.5">
                    <span class="text-3xl font-bold tabular-nums text-foreground">{{ displayPrice(tier) }}</span>
                  <span class="text-base text-muted-foreground">/ month</span>
                </div>
                <p
                  v-if="isAnnual && (tier.price_annual_cents > 0)"
                  class="text-xs text-muted-foreground"
                >
                    For a 1-year term. Pay {{ termToday(tier) }} today, then {{ termRenewal(tier) }} on renewal.
                  </p>
                </div>
                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    v-if="currentTier === tier.id"
                    class="rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    Current
                  </span>
                  <span
                    v-else-if="upgradeTargetTier === tier.id"
                    class="rounded-full bg-amber-500/20 dark:bg-amber-500/30 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300"
                  >
                    Recommended
                  </span>
                </div>
                <Button
                  :class="[
                    'mt-6 w-full rounded-lg py-2.5 text-sm font-semibold uppercase tracking-wide',
                    getButtonLabel(tier) === 'Get started' && '!bg-foreground !text-background hover:!bg-foreground/90 dark:!bg-foreground dark:!text-background dark:hover:!bg-foreground/90',
                  ]"
                  :variant="getButtonVariant(tier)"
                  :disabled="portalLoading || currentTier === tier.id || hasPendingUpgradeOrDowngradeRequest"
                  @click="handleSelectPlan(tier)"
                >
                  <template v-if="false">
                    <Loader2 class="h-4 w-4 mr-2 animate-spin" />
                    Loading…
                  </template>
                  <template v-else>
                    {{ getButtonLabel(tier) }}
                  </template>
                </Button>
                <ul class="mt-6 flex-1 space-y-2.5">
                  <li
                    v-for="feature in tier.features"
                    :key="feature"
                    class="flex min-w-0 items-start gap-3 text-sm text-foreground/90"
                  >
                    <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 dark:bg-accent/20 text-accent">
                      <Check class="h-3 w-3" />
                    </span>
                    <span class="min-w-0 flex-1">{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </article>
        </div>

        <!-- BYO card -->
        <div v-if="showByoInPricing" class="flex justify-center">
          <RouterLink
            :to="{ name: 'memora-build-your-own' }"
            :class="[
              'relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-dashed bg-card shadow-sm transition-all duration-200 w-full max-w-md',
              'border-accent/40 dark:border-accent/50 bg-accent/5 dark:bg-accent/10',
              'hover:shadow-md hover:border-accent/60 dark:hover:border-accent/70 hover:bg-accent/10 dark:hover:bg-accent/15',
              currentTier === 'byo' && 'border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 border-solid',
            ]"
          >
            <div class="flex flex-col p-4 sm:p-6">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <h2 class="text-xl font-bold text-foreground">Build Your Own</h2>
                <span
                  v-if="currentTier === 'byo'"
                  class="rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  Current
                </span>
              </div>
              <p class="mt-1.5 text-sm text-muted-foreground leading-relaxed">Pick only what you need. Flexible pricing.</p>
              <p class="mt-4 text-3xl font-bold tabular-nums text-foreground">Custom</p>
              <span class="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-semibold uppercase tracking-wide shadow-sm hover:bg-accent/10 hover:text-accent-foreground">
                Build your plan
                <ChevronRight class="h-4 w-4 shrink-0" />
              </span>
              <ul class="mt-6 flex-1 space-y-2.5">
                <li class="flex min-w-0 items-start gap-3 text-sm text-foreground/90">
                  <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 dark:bg-accent/20 text-accent">
                    <Check class="h-3 w-3" />
                  </span>
                  <span class="min-w-0 flex-1">Customizable solutions</span>
                </li>
                <li class="flex min-w-0 items-start gap-3 text-sm text-foreground/90">
                  <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 dark:bg-accent/20 text-accent">
                    <Check class="h-3 w-3" />
                  </span>
                  <span class="min-w-0 flex-1">Dedicated support</span>
                </li>
                <li class="flex min-w-0 items-start gap-3 text-sm text-foreground/90">
                  <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 dark:bg-accent/20 text-accent">
                    <Check class="h-3 w-3" />
                  </span>
                  <span class="min-w-0 flex-1">Flexible pricing</span>
                </li>
              </ul>
            </div>
          </RouterLink>
        </div>
      </template>

      <!-- Plan Comparison Table -->
      <section v-if="!loading && !error" class="min-w-0 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <h2 class="py-4 px-4 sm:px-6 text-lg font-semibold text-foreground border-b border-border">Plan comparison</h2>
        <div class="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 overscroll-x-contain">
          <table class="w-full min-w-[640px] text-left text-sm" role="grid" aria-label="Plan comparison">
            <thead>
              <tr class="border-b border-border bg-muted/50 dark:bg-muted/80">
                <th scope="col" class="py-4 pl-4 sm:pl-6 pr-4 font-semibold text-foreground w-40 sm:w-48">Feature</th>
                <th scope="col" v-for="tier in tiers" :key="tier.id" class="py-4 px-4 font-semibold text-foreground text-center">{{ tier.name }}</th>
                <th v-if="showByoInPricing" scope="col" class="py-4 px-4 font-semibold text-foreground text-center">Build Your Own</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in comparisonTableRows"
                :key="idx"
                :class="[
                  'border-b border-border transition-colors',
                  item.type === 'category'
                    ? 'bg-muted/30 dark:bg-muted/50'
                    : 'hover:bg-muted/20 dark:hover:bg-muted/30',
                ]"
              >
                <template v-if="item.type === 'category'">
                  <td :colspan="showByoInPricing ? 6 : 5" class="py-2 pl-4 sm:pl-6 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {{ item.category }}
                  </td>
                </template>
                <template v-else>
                  <td class="py-3 pl-4 sm:pl-6 pr-4 font-medium text-foreground">{{ item.row.label }}</td>
                  <td
                    v-for="tier in tiers"
                    :key="tier.id"
                    :class="['py-3 px-4 text-center', tier.popular && 'bg-accent/5 dark:bg-accent/10']"
                  >
                    <span v-if="getComparisonValue(item.row, tier.id) === 'check'" class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 dark:bg-accent/20 text-accent" aria-hidden="true">
                      <Check class="h-3.5 w-3.5" />
                    </span>
                    <span v-else-if="getComparisonValue(item.row, tier.id) === 'dash'" class="text-muted-foreground" aria-hidden="true">—</span>
                    <span v-else class="text-foreground/90">{{ getComparisonValue(item.row, tier.id) }}</span>
                  </td>
                  <td v-if="showByoInPricing" class="py-3 px-4 text-center bg-accent/5 dark:bg-accent/10">
                    <span v-if="getComparisonValue(item.row, 'byo') === 'check'" class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 dark:bg-accent/20 text-accent" aria-hidden="true">
                      <Check class="h-3.5 w-3.5" />
                    </span>
                    <span v-else-if="getComparisonValue(item.row, 'byo') === 'dash'" class="text-muted-foreground" aria-hidden="true">—</span>
                    <span v-else class="text-foreground/90">{{ getComparisonValue(item.row, 'byo') }}</span>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- All Plans Include -->
      <section class="rounded-2xl border bg-muted/30 dark:bg-muted/50 px-4 sm:px-6 py-6 sm:py-8">
        <h2 class="text-center text-lg font-semibold text-foreground mb-6">All plans include</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          <div class="flex items-start gap-4">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 dark:bg-accent/20 text-accent">
              <Shield class="h-5 w-5" />
            </span>
            <div>
              <p class="font-medium text-foreground">SSL Security</p>
              <p class="text-sm text-muted-foreground mt-0.5">Secure data encryption</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 dark:bg-accent/20 text-accent">
              <Sparkles class="h-5 w-5" />
            </span>
            <div>
              <p class="font-medium text-foreground">Regular Updates</p>
              <p class="text-sm text-muted-foreground mt-0.5">New features and improvements</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 dark:bg-accent/20 text-accent">
              <Link class="h-5 w-5" />
            </span>
            <div>
              <p class="font-medium text-foreground">No Client Account Required</p>
              <p class="text-sm text-muted-foreground mt-0.5">Clients access via link</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Request downgrade confirmation modal -->
      <CenterModal
        v-model="showDowngradeModal"
        :title="`Request downgrade to ${tierDisplayName('starter')}`"
        content-class="sm:max-w-[425px]"
      >
        <p class="text-sm text-muted-foreground">
          Support will send you a link to confirm; your plan will then switch to {{ tierDisplayName('starter') }}. Your current subscription will be cancelled.
        </p>
        <template #footer>
          <div class="flex flex-wrap justify-end gap-2">
            <Button variant="outline" :disabled="downgradeRequestLoading" @click="showDowngradeModal = false">
              Cancel
            </Button>
            <Button :disabled="downgradeRequestLoading" @click="submitDowngradeRequest">
              <Loader2 v-if="downgradeRequestLoading" class="h-4 w-4 mr-2 animate-spin" />
              Request downgrade
            </Button>
          </div>
        </template>
      </CenterModal>

      <!-- Request upgrade confirmation modal -->
      <CenterModal
        v-model="showUpgradeModal"
        :title="upgradeTargetTierForRequest ? `Request upgrade to ${upgradeTargetTierForRequest.name || upgradeTargetTierForRequest.id}` : 'Request upgrade'"
        content-class="sm:max-w-[425px]"
      >
        <p class="text-sm text-muted-foreground">
          Support will send you a checkout link to complete the upgrade. You will be charged according to the selected plan.
        </p>
        <template #footer>
          <div class="flex flex-wrap justify-end gap-2">
            <Button variant="outline" :disabled="upgradeRequestLoading" @click="closeUpgradeModal">
              Cancel
            </Button>
            <Button :disabled="upgradeRequestLoading" @click="submitUpgradeRequest">
              <Loader2 v-if="upgradeRequestLoading" class="h-4 w-4 mr-2 animate-spin" />
              Request upgrade
            </Button>
          </div>
        </template>
      </CenterModal>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import { BarChart3, Check, ChevronRight, Crown, Info, Link, Loader2, Settings, Shield, Sparkles } from '@/shared/utils/lucideAnimated'
import { PLAN_COMPARISON_ROWS, getComparisonValue } from '@/domains/memora/constants/planComparison'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'
import { usePricingApi, useSubscriptionApi } from '@/domains/memora/api/pricing'
import { useUserStore } from '@/shared/stores/user'
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '@/shared/stores/currency'
import { formatMoney } from '@/shared/utils/formatMoney'
import { convertUsdCentsToFormatted } from '@/shared/utils/convertCurrency'
import { getAnnualSavePct } from '@/shared/utils/pricing'
import { useFormatDate } from '@/shared/composables/useFormatDate'
import { toast } from '@/shared/utils/toast'
import { clearPostAuthRedirect } from '@/shared/utils/localStorage'
import CenterModal from '@/shared/components/molecules/CenterModal.vue'

const showByoInPricing = false

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()

const annualSavePct = getAnnualSavePct()
const upgradeFeature = computed(() => route.query.upgrade || null)

const upgradeTargetTier = computed(() => {
  const upgrade = route.query.upgrade
  if (upgrade === 'proofing') return 'pro'
  if (upgrade === 'raw_files') return 'studio'
  return null
})

const { recommendedTierDisplayName, featureLabel, tierDisplayName } = useMemoraFeatures()
const upgradeAlertMessage = computed(() => {
  const feature = upgradeFeature.value
  if (!feature) return ''
  const label = featureLabel(feature)
  const tierName = recommendedTierDisplayName(feature)
  return `You were redirected here because your current plan doesn't include ${label}. Upgrade to ${tierName} to unlock this feature.`
})

const comparisonRows = PLAN_COMPARISON_ROWS

const comparisonTableRows = computed(() => {
  const flat = []
  for (let i = 0; i < comparisonRows.length; i++) {
    const row = comparisonRows[i]
    if (i === 0 || comparisonRows[i - 1].category !== row.category) {
      flat.push({ type: 'category', category: row.category })
    }
    flat.push({ type: 'row', row })
  }
  return flat
})

const { getTiers, getCurrencyRates } = usePricingApi()
const { getPreview, createPortalSession, cancelSubscription, getStatus, requestDowngrade, requestUpgrade } = useSubscriptionApi()

const isAnnual = ref(true)
const tiers = ref([])
const loading = ref(true)
const error = ref(null)
const portalLoading = ref(false)
const showDowngradeModal = ref(false)
const downgradeRequestLoading = ref(false)
const showUpgradeModal = ref(false)
const upgradeRequestLoading = ref(false)
const upgradeTargetTierForRequest = ref(null)
const currentSubscription = ref(null)
const canSelfServiceUpgrade = ref(false)
const hasPendingUpgradeOrDowngradeRequest = ref(false)
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

const tiersFirstRow = computed(() => tiers.value.slice(0, 2))
const tiersSecondRow = computed(() => tiers.value.slice(2, 4))

const currentTier = computed(() => userStore.user?.memora_tier ?? 'starter')
const currentTierLabel = computed(() => tierDisplayName(currentTier.value))

function displayPrice(tier) {
  const cur = currencyStore.currency
  if (cur === 'usd') {
    const cents = isAnnual.value ? Math.round((tier.price_annual_cents ?? 0) / 12) : (tier.price_monthly_cents ?? 0)
    return formatMoney(cents, 'usd')
  }
  const c = convertedPrices.value[tier.id]
  if (!c) return convertedLoading.value ? '…' : convertUsdCentsToFormatted(0, cur, currencyRates.value)
  const usdCents = isAnnual.value ? Math.round(c.annualCents / 12) : c.monthlyCents
  return convertUsdCentsToFormatted(usdCents, cur, currencyRates.value)
}

function wasPrice(tier) {
  if (currencyStore.currency === 'usd') return formatMoney(tier.price_monthly_cents ?? 0, 'usd')
  const c = convertedPrices.value[tier.id]
  if (!c) return convertedLoading.value ? '…' : convertUsdCentsToFormatted(0, currencyStore.currency, currencyRates.value)
  return convertUsdCentsToFormatted(c.monthlyCents, currencyStore.currency, currencyRates.value)
}

function hasDiscount(tier) {
  if (tier.price_monthly_cents <= 0 || tier.price_annual_cents <= 0) return false
  const monthly = tier.price_monthly_cents / 100
  const annualPerMonth = tier.price_annual_cents / 100 / 12
  return annualPerMonth < monthly
}

function discountPercent(tier) {
  if (!hasDiscount(tier)) return 0
  const monthly = tier.price_monthly_cents / 100
  const annualPerMonth = tier.price_annual_cents / 100 / 12
  return Math.round((1 - annualPerMonth / monthly) * 100)
}

function termToday(tier) {
  if (currencyStore.currency === 'usd') {
    return formatMoney(tier.price_annual_cents, 'usd')
  }
  const c = convertedPrices.value[tier.id]
  return c ? convertUsdCentsToFormatted(c.annualCents, currencyStore.currency, currencyRates.value) : (convertedLoading.value ? '…' : '—')
}

function termRenewal(tier) {
  return termToday(tier)
}

function getButtonVariant(tier) {
  if (currentTier.value === tier.id) return 'secondary'
  if (tier.popular) return 'default'
  return 'outline'
}

function getButtonLabel(tier) {
  if (currentTier.value === tier.id) return 'Current Plan'
  if (tier.id === 'starter' && currentSubscription.value) return 'Request downgrade'
  if (tier.id === 'starter') return 'Downgrade'
  const tierOrder = ['starter', 'pro', 'studio', 'business']
  const currentIndex = tierOrder.indexOf(currentTier.value)
  const targetIndex = tierOrder.indexOf(tier.id)
  if (targetIndex > currentIndex) {
    return canSelfServiceUpgrade.value ? (tier.popular ? 'Buy Now' : 'Get started') : 'Request upgrade'
  }
  if (targetIndex < currentIndex) return 'Change Plan'
  const isBuyNow = tier.id === 'starter' || tier.popular
  return isBuyNow ? 'Buy Now' : 'Get started'
}

async function handleSelectPlan(tier) {
  if (currentTier.value === tier.id) return

  if (tier.id === 'starter' && currentSubscription.value) {
    showDowngradeModal.value = true
    return
  }

  const tierOrder = ['starter', 'pro', 'studio', 'business']
  const currentIndex = tierOrder.indexOf(currentTier.value)
  const targetIndex = tierOrder.indexOf(tier.id)
  if (targetIndex > currentIndex && ['pro', 'studio', 'business'].includes(tier.id)) {
    if (canSelfServiceUpgrade.value) {
      const billingCycle = isAnnual.value ? 'annual' : 'monthly'
      router.push({
        name: 'memora-plan-summary',
        query: { tier: tier.id, cycle: billingCycle },
      })
      return
    }
    upgradeTargetTierForRequest.value = tier
    showUpgradeModal.value = true
    return
  }

  const billingCycle = isAnnual.value ? 'annual' : 'monthly'
  router.push({
    name: 'memora-plan-summary',
    query: { tier: tier.id, cycle: billingCycle },
  })
}

async function submitDowngradeRequest() {
  downgradeRequestLoading.value = true
  try {
    await requestDowngrade()
    toast.success('Downgrade requested. Support will send you a link to confirm.')
    showDowngradeModal.value = false
  } catch (e) {
    toast.apiError(e, 'Failed to request downgrade')
  } finally {
    downgradeRequestLoading.value = false
  }
}

function closeUpgradeModal() {
  showUpgradeModal.value = false
  upgradeTargetTierForRequest.value = null
}

async function submitUpgradeRequest() {
  const tier = upgradeTargetTierForRequest.value
  if (!tier || !['pro', 'studio', 'business'].includes(tier.id)) return
  upgradeRequestLoading.value = true
  try {
    await requestUpgrade(tier.id)
    toast.success('Upgrade requested. Support will send you a checkout link to complete the change.')
    closeUpgradeModal()
  } catch (e) {
    toast.apiError(e, 'Failed to request upgrade')
  } finally {
    upgradeRequestLoading.value = false
  }
}

async function openBillingPortal() {
  try {
    portalLoading.value = true
    const result = await createPortalSession()
    if (result.portal_url) {
      window.location.href = result.portal_url
    }
  } catch (e) {
    toast.error('Failed to open billing portal')
  } finally {
    portalLoading.value = false
  }
}

function goToUsage() {
  router.push({ name: 'memora-usage' })
}

const { formatDate } = useFormatDate()

onMounted(async () => {
  clearPostAuthRedirect()
  try {
    const [tiersData, statusData] = await Promise.all([
      getTiers(),
      getStatus().catch(() => null),
    ])
    tiers.value = tiersData
    if (statusData?.subscription) {
      currentSubscription.value = statusData.subscription
    }
    canSelfServiceUpgrade.value = statusData?.can_self_service_upgrade === true
    hasPendingUpgradeOrDowngradeRequest.value = statusData?.has_pending_upgrade_or_downgrade_request === true
    if (currencyStore.currency !== 'usd') await fetchConvertedPrices()
  } catch (e) {
    error.value = e?.message ?? 'Failed to load pricing'
  } finally {
    loading.value = false
  }
})
</script>
