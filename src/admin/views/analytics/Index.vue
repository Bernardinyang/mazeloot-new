<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-10">
      <header class="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 :class="['text-3xl font-bold tracking-tight', theme.textPrimary]">Analytics</h1>
          <p :class="['mt-1.5 text-sm', theme.textSecondary]">Usage and business metrics.</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <select
            v-model="days"
            :class="['rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium shadow-sm', theme.textPrimary]"
            aria-label="Time range"
            @change="onPresetChange"
          >
            <option :value="7">Last 7 days</option>
            <option :value="30">Last 30 days</option>
            <option :value="90">Last 90 days</option>
            <option value="custom">Custom range</option>
          </select>
          <template v-if="days === 'custom'">
            <input
              v-model="dateFrom"
              type="date"
              :class="['rounded-xl border border-input bg-background px-3 py-2.5 text-sm', theme.textPrimary]"
              aria-label="From date"
            />
            <input
              v-model="dateTo"
              type="date"
              :class="['rounded-xl border border-input bg-background px-3 py-2.5 text-sm', theme.textPrimary]"
              aria-label="To date"
            />
          </template>
          <label class="flex items-center gap-2 text-sm cursor-pointer select-none font-medium" :class="theme.textSecondary">
            <input v-model="compare" type="checkbox" class="rounded border-input text-primary focus:ring-primary/30" @change="fetchData" />
            Compare to previous
          </label>
          <Button variant="outline" size="sm" :disabled="!data" class="shadow-sm" @click="exportCsv">
            <Download class="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" :disabled="!data" class="shadow-sm" @click="exportJson">
            JSON
          </Button>
        </div>
      </header>

      <div v-if="loading" class="flex items-center gap-4 rounded-2xl bg-card/80 border border-border p-8">
        <span class="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
        <span :class="['text-sm font-medium', theme.textPrimary]">Loading…</span>
      </div>

      <div v-else-if="error" class="rounded-2xl border-l-4 border-destructive bg-destructive/10 border border-destructive/20 p-6 shadow-sm">
        <p :class="['text-sm font-medium', theme.textPrimary]">{{ error }}</p>
      </div>

      <div v-else class="space-y-10">
        <section v-if="data?.comparison" class="rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-muted/20 dark:from-white/5 dark:to-transparent p-5 shadow-md">
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Comparison (previous period)</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Summary metrics for the same-length period before the selected range (when "Compare to previous" is on).</p>
          <div class="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 text-sm">
            <div
              v-for="(val, key) in (data.comparison.summary || {})"
              :key="key"
              v-show="(key === 'subscription' && val && typeof val === 'object') || (key !== 'subscription' && val != null && typeof val !== 'object')"
              :class="(key === 'subscription' && val && typeof val === 'object') ? 'col-span-full flex flex-wrap gap-4' : 'flex justify-between gap-2'"
            >
              <template v-if="key === 'subscription' && val && typeof val === 'object'">
                <span :class="theme.textSecondary">Active subscriptions</span>
                <span class="font-semibold tabular-nums" :class="theme.textPrimary">{{ formatNumber(val.active_subscriptions) }}</span>
                <span :class="theme.textSecondary">MRR</span>
                <span class="font-semibold tabular-nums" :class="theme.textPrimary">{{ val.mrr_formatted ?? '—' }}</span>
              </template>
              <template v-else-if="val != null && typeof val !== 'object'">
                <span :class="['capitalize', theme.textSecondary]">{{ String(key).replace(/_/g, ' ') }}</span>
                <span class="font-semibold tabular-nums" :class="theme.textPrimary">{{ formatNumber(val) }}</span>
              </template>
            </div>
          </div>
        </section>
        <section>
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Summary</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Key counts for the selected period. Click a card to go to the related admin list.</p>
          <div class="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            <router-link
              v-for="(val, key) in summaryRows"
              :key="key"
              :to="summaryLink(key)"
              class="rounded-2xl border border-border bg-card p-5 shadow-md hover:shadow-xl hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <p :class="['text-xs font-semibold uppercase tracking-wider', theme.textSecondary]">{{ key }}</p>
              <p class="mt-2 text-2xl font-bold tabular-nums text-primary">{{ formatNumber(val) }}</p>
            </router-link>
          </div>
        </section>

        <section v-if="revenueOverTimeSeries.length" class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Revenue over time (last 12 months)</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Active subscriptions and monthly recurring revenue (MRR) by month.</p>
          <div class="h-64 min-w-0">
            <ApexChart
              type="area"
              height="256"
              :options="revenueOverTimeChartOptions"
              :series="revenueOverTimeSeries"
            />
          </div>
        </section>

        <section class="grid gap-8 lg:grid-cols-2">
          <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Registrations by day</h2>
            <p :class="['text-sm mb-4', theme.textSecondary]">New user sign-ups per day in the selected range.</p>
            <div class="h-64 min-w-0">
              <ApexChart
                v-if="registrationsChartSeries.length"
                type="area"
                height="256"
                :options="registrationsChartOptions"
                :series="registrationsChartSeries"
              />
              <p v-else :class="['text-sm', theme.textSecondary]">No data</p>
            </div>
          </div>
          <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Activity events by day</h2>
            <p :class="['text-sm mb-4', theme.textSecondary]">Logged activity events (e.g. logins, actions) per day in the selected range.</p>
            <div class="h-64 min-w-0">
              <ApexChart
                v-if="activityChartSeries.length"
                type="area"
                height="256"
                :options="activityChartOptions"
                :series="activityChartSeries"
              />
              <p v-else :class="['text-sm', theme.textSecondary]">No data</p>
            </div>
          </div>
        </section>

        <section>
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Users by role</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Number of users in each role (e.g. admin, user) for the selected period.</p>
          <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div class="h-48 min-w-0">
              <ApexChart
                v-if="roleChartSeries.length"
                type="bar"
                height="192"
                :options="roleChartOptions"
                :series="roleChartSeries"
              />
              <p v-else :class="['text-sm', theme.textSecondary]">No data</p>
            </div>
          </div>
        </section>

        <section class="grid gap-8 lg:grid-cols-3">
          <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 class="flex items-center justify-between mb-1">
              <span :class="['text-lg font-semibold tracking-tight', theme.textPrimary]">Contact by day</span>
              <router-link :to="{ name: 'admin-contact' }" class="text-sm text-accent hover:underline">View all</router-link>
            </h2>
            <p :class="['text-sm mb-4', theme.textSecondary]">Contact form submissions per day.</p>
            <div class="h-48 min-w-0">
              <ApexChart
                v-if="contactChartSeries.length"
                type="area"
                height="192"
                :options="contactChartOptions"
                :series="contactChartSeries"
              />
              <p v-else :class="['text-sm', theme.textSecondary]">No data</p>
            </div>
          </div>
          <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 class="flex items-center justify-between mb-1">
              <span :class="['text-lg font-semibold tracking-tight', theme.textPrimary]">Waitlist by day</span>
              <router-link :to="{ name: 'admin-waitlist' }" class="text-sm text-accent hover:underline">View all</router-link>
            </h2>
            <p :class="['text-sm mb-4', theme.textSecondary]">Waitlist sign-ups per day.</p>
            <div class="h-48 min-w-0">
              <ApexChart
                v-if="waitlistChartSeries.length"
                type="area"
                height="192"
                :options="waitlistChartOptions"
                :series="waitlistChartSeries"
              />
              <p v-else :class="['text-sm', theme.textSecondary]">No data</p>
            </div>
          </div>
          <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 class="flex items-center justify-between mb-1">
              <span :class="['text-lg font-semibold tracking-tight', theme.textPrimary]">Newsletter by day</span>
              <router-link :to="{ name: 'admin-newsletter' }" class="text-sm text-accent hover:underline">View all</router-link>
            </h2>
            <p :class="['text-sm mb-4', theme.textSecondary]">Newsletter subscriptions per day.</p>
            <div class="h-48 min-w-0">
              <ApexChart
                v-if="newsletterChartSeries.length"
                type="area"
                height="192"
                :options="newsletterChartOptions"
                :series="newsletterChartSeries"
              />
              <p v-else :class="['text-sm', theme.textSecondary]">No data</p>
            </div>
          </div>
        </section>

        <section v-if="(data?.activity?.top_users || []).length">
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Top users by activity ({{ days }}d)</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Users with the most logged activity events in the selected period.</p>
          <div class="rounded-2xl border border-border bg-card overflow-hidden shadow-md">
            <table class="w-full text-sm">
              <thead :class="[theme.bgMuted]">
                <tr>
                  <th class="text-left px-4 py-3 font-medium">User</th>
                  <th class="text-right px-4 py-3 font-medium tabular-nums">Activity count</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in data.activity.top_users"
                  :key="row.user_uuid"
                  :class="['border-t border-border', theme.borderPrimary]"
                >
                  <td class="px-4 py-2">
                    <router-link
                      v-if="row.user"
                      :to="{ name: 'admin-user-show', params: { uuid: row.user.uuid } }"
                      class="text-accent hover:underline font-medium"
                    >
                      {{ row.user.email }}
                    </router-link>
                    <span v-else class="font-mono" :class="theme.textSecondary">{{ row.user_uuid }}</span>
                  </td>
                  <td class="px-4 py-2 text-right tabular-nums">{{ formatNumber(row.activity_count) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="grid gap-8 lg:grid-cols-2">
          <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 class="flex items-center justify-between mb-1">
              <span :class="['text-lg font-semibold tracking-tight', theme.textPrimary]">Users</span>
              <router-link :to="{ name: 'admin-users' }" class="text-sm font-medium text-primary hover:underline">View all</router-link>
            </h2>
            <p :class="['text-sm mb-4', theme.textSecondary]">Total users, early-access count, recent registrations, and breakdown by role.</p>
            <dl class="space-y-2 mt-4">
              <div class="flex justify-between">
                <dt :class="['text-sm', theme.textSecondary]">Total</dt>
                <dd :class="['text-sm font-semibold tabular-nums', theme.textPrimary]">{{ formatNumber(data?.users?.total) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt :class="['text-sm', theme.textSecondary]">With early access</dt>
                <dd :class="['text-sm font-semibold tabular-nums', theme.textPrimary]">{{ formatNumber(data?.users?.with_early_access) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt :class="['text-sm', theme.textSecondary]">Registrations (30d)</dt>
                <dd :class="['text-sm font-semibold tabular-nums', theme.textPrimary]">{{ formatNumber(data?.users?.recent_registrations_30d) }}</dd>
              </div>
              <template v-if="data?.users?.by_role && Object.keys(data.users.by_role).length">
                <div v-for="(count, role) in data.users.by_role" :key="role" class="flex justify-between">
                  <dt :class="['text-sm', theme.textSecondary]">Role: {{ role }}</dt>
                  <dd :class="['text-sm font-mono tabular-nums', theme.textPrimary]">{{ count }}</dd>
                </div>
              </template>
            </dl>
          </div>
          <div class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <h2 class="flex items-center justify-between mb-1">
              <span :class="['text-lg font-semibold tracking-tight', theme.textPrimary]">Early access</span>
              <router-link :to="{ name: 'admin-early-access' }" class="text-sm font-medium text-primary hover:underline">View all</router-link>
            </h2>
            <p :class="['text-sm mb-4', theme.textSecondary]">Early-access programme counts and status summary.</p>
            <dl class="space-y-2 mt-4">
              <div v-for="(val, key) in (data?.early_access || {})" :key="key" class="flex justify-between">
                <dt :class="['text-sm capitalize', theme.textSecondary]">{{ String(key).replace(/_/g, ' ') }}</dt>
                <dd :class="['text-sm font-semibold tabular-nums', theme.textPrimary]">{{ formatNumber(val) }}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section>
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Activity by action</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Count of activity events grouped by action type (e.g. login, view) in the selected range.</p>
          <div class="rounded-2xl border border-border bg-card overflow-hidden shadow-md">
            <table class="w-full text-sm">
              <thead :class="[theme.bgMuted]">
                <tr>
                  <th class="text-left px-4 py-3 font-medium">Action</th>
                  <th class="text-right px-4 py-3 font-medium tabular-nums">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(count, action) in (data?.activity?.by_action || {})"
                  :key="action"
                  :class="['border-t border-border', theme.borderPrimary]"
                >
                  <td class="px-4 py-2 font-mono">{{ action }}</td>
                  <td class="px-4 py-2 text-right tabular-nums">{{ formatNumber(count) }}</td>
                </tr>
                <tr v-if="!Object.keys(data?.activity?.by_action || {}).length">
                  <td colspan="2" class="px-4 py-6 text-center" :class="theme.textSecondary">No activity in range</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-if="(data?.products || []).length">
          <h2 class="flex items-center justify-between mb-1">
            <span :class="['text-lg font-semibold tracking-tight', theme.textPrimary]">Products</span>
            <router-link :to="{ name: 'admin-products' }" class="text-sm font-medium text-primary hover:underline">View all</router-link>
          </h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Per-product user counts and onboarding status (completed vs pending).</p>
          <div class="rounded-2xl border border-border bg-card overflow-hidden shadow-md">
            <table class="w-full text-sm">
              <thead :class="[theme.bgMuted]">
                <tr>
                  <th class="text-left px-4 py-3 font-medium">Product</th>
                  <th class="text-right px-4 py-3 font-medium tabular-nums">Users</th>
                  <th class="text-right px-4 py-3 font-medium tabular-nums">Onboarded</th>
                  <th class="text-right px-4 py-3 font-medium tabular-nums">Pending</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in data.products"
                  :key="p.product?.slug"
                  :class="['border-t border-border', theme.borderPrimary]"
                >
                  <td class="px-4 py-2 font-medium">
                    <router-link
                      v-if="p.product?.slug"
                      :to="{ name: 'admin-product-show', params: { slug: p.product.slug } }"
                      class="text-accent hover:underline"
                    >
                      {{ p.product?.name ?? p.product?.slug }}
                    </router-link>
                    <template v-else>{{ p.product?.name ?? p.product?.slug }}</template>
                  </td>
                  <td class="px-4 py-2 text-right tabular-nums">{{ formatNumber(p.user_count) }}</td>
                  <td class="px-4 py-2 text-right tabular-nums">{{ formatNumber(p.onboarding_completed) }}</td>
                  <td class="px-4 py-2 text-right tabular-nums">{{ formatNumber(p.onboarding_pending) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Recent activity</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Latest activity log entries (action, user, time). Use for quick audit and support.</p>
          <div class="rounded-2xl border border-border bg-card divide-y divide-border max-h-96 overflow-auto shadow-md">
            <div
              v-for="item in (data?.activity?.recent || []).slice(0, 50)"
              :key="item.id"
              class="px-4 py-3 text-sm"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono" :class="theme.textPrimary">{{ item.action }}</span>
                <template v-if="item.user">
                  <span :class="theme.textSecondary">·</span>
                  <router-link
                    :to="{ name: 'admin-user-show', params: { uuid: item.user.uuid } }"
                    class="text-accent hover:underline"
                  >
                    {{ item.user.email }}
                  </router-link>
                </template>
                <span :class="['text-xs', theme.textSecondary]">{{ formatDate(item.created_at) }}</span>
              </div>
              <p v-if="item.description" :class="['mt-1 text-xs truncate', theme.textSecondary]">{{ item.description }}</p>
            </div>
            <div v-if="!(data?.activity?.recent || []).length" class="px-4 py-8 text-center" :class="theme.textSecondary">
              No recent activity
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useThemeStore } from '@/shared/stores/theme'
import { useAdminApi } from '@/admin/api/admin'
import { Button } from '@/shared/components/shadcn/button'
import ApexChart from 'vue3-apexcharts'
import { Download } from 'lucide-vue-next'

const theme = useThemeClasses()
const themeStore = useThemeStore()
const { getAnalyticsOverview } = useAdminApi()

const data = ref(null)
const loading = ref(true)
const error = ref(null)
const days = ref(30)
const dateFrom = ref('')
const dateTo = ref('')
const compare = ref(false)

const isDark = computed(() => themeStore.effectiveTheme === 'dark')
const chartTextColor = computed(() => (isDark.value ? '#94a3b8' : '#64748b'))
const chartGridColor = computed(() => (isDark.value ? '#334155' : '#e2e8f0'))

const summaryRows = computed(() => {
  const s = data.value?.summary
  if (!s) return {}
  const rows = {
    'Total users': s.users,
    'Active users': s.active_users,
    'Products': s.products,
    'Active products': s.active_products,
    'Early access': s.early_access,
    'Activity (7d)': s.activity_7d,
    'Contact': s.contact_submissions,
    'Waitlist': s.waitlist_entries,
    'Newsletter': s.newsletter_subscribers,
  }
  if (s.subscription) {
    rows['Active subscriptions'] = s.subscription.active_subscriptions
    rows['MRR'] = s.subscription.mrr_formatted
  }
  return rows
})

function summaryLink(key) {
  const map = {
    'Total users': { name: 'admin-users' },
    'Active users': { name: 'admin-users' },
    'Products': { name: 'admin-products' },
    'Active products': { name: 'admin-products' },
    'Early access': { name: 'admin-early-access' },
    'Activity (7d)': { name: 'admin-activity-logs-users' },
    'Contact': { name: 'admin-contact' },
    'Waitlist': { name: 'admin-waitlist' },
    'Newsletter': { name: 'admin-newsletter' },
    'Active subscriptions': { name: 'admin-dashboard' },
    'MRR': { name: 'admin-dashboard' },
  }
  return map[key] || { name: 'admin-dashboard' }
}

const registrationsChartSeries = computed(() => {
  const byDay = data.value?.users?.registrations_by_day
  if (!byDay || typeof byDay !== 'object') return []
  const dates = Object.keys(byDay).sort()
  return [{ name: 'Registrations', data: dates.map(d => byDay[d] ?? 0) }]
})

const chartAnimations = { enabled: true, easing: 'easeinout', speed: 600 }

const registrationsChartOptions = computed(() => ({
  chart: { type: 'area', height: 256, toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent', animations: chartAnimations },
  stroke: { curve: 'monotoneCubic', width: 2 },
  fill: { type: 'gradient', opacity: 0.4 },
  colors: ['#8b5cf6'],
  xaxis: {
    categories: Object.keys(data.value?.users?.registrations_by_day || {}).sort(),
    labels: { style: { colors: chartTextColor.value } },
  },
  yaxis: { labels: { style: { colors: chartTextColor.value } } },
  grid: { borderColor: chartGridColor.value, strokeDashArray: 4, xaxis: { lines: { show: false } } },
  tooltip: { theme: isDark.value ? 'dark' : 'light' },
}))

const activityChartSeries = computed(() => {
  const byDay = data.value?.activity?.events_by_day
  if (!byDay || typeof byDay !== 'object') return []
  const dates = Object.keys(byDay).sort()
  return [{ name: 'Events', data: dates.map(d => byDay[d] ?? 0) }]
})

const activityChartOptions = computed(() => ({
  chart: { type: 'area', height: 256, toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent', animations: chartAnimations },
  stroke: { curve: 'monotoneCubic', width: 2 },
  fill: { type: 'gradient', opacity: 0.4 },
  colors: ['#06b6d4'],
  xaxis: {
    categories: Object.keys(data.value?.activity?.events_by_day || {}).sort(),
    labels: { style: { colors: chartTextColor.value } },
  },
  yaxis: { labels: { style: { colors: chartTextColor.value } } },
  grid: { borderColor: chartGridColor.value, strokeDashArray: 4, xaxis: { lines: { show: false } } },
  tooltip: { theme: isDark.value ? 'dark' : 'light' },
}))

const roleChartSeries = computed(() => {
  const byRole = data.value?.users?.by_role
  if (!byRole || typeof byRole !== 'object') return []
  const roles = Object.keys(byRole)
  return [{ name: 'Users', data: roles.map(r => byRole[r]) }]
})

const roleChartOptions = computed(() => ({
  chart: { type: 'bar', height: 192, toolbar: { show: false }, background: 'transparent', animations: chartAnimations },
  plotOptions: { bar: { horizontal: false, columnWidth: '60%', borderRadius: 4 } },
  colors: ['#10b981'],
  xaxis: {
    categories: Object.keys(data.value?.users?.by_role || {}),
    labels: { style: { colors: chartTextColor.value } },
  },
  yaxis: { labels: { style: { colors: chartTextColor.value } } },
  grid: { borderColor: chartGridColor.value, strokeDashArray: 4, xaxis: { lines: { show: false } } },
  tooltip: { theme: isDark.value ? 'dark' : 'light' },
}))

function makeByDayChart(byDay, color) {
  if (!byDay || typeof byDay !== 'object') return { series: [], categories: [] }
  const dates = Object.keys(byDay).sort()
  return {
    series: [{ name: 'Count', data: dates.map(d => byDay[d] ?? 0) }],
    categories: dates,
  }
}

const contactChartSeries = computed(() => makeByDayChart(data.value?.contact?.by_day, '#f59e0b').series)
const contactChartOptions = computed(() => {
  const { categories } = makeByDayChart(data.value?.contact?.by_day)
  return {
    chart: { type: 'area', height: 192, toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent', animations: chartAnimations },
    stroke: { curve: 'monotoneCubic', width: 2 },
    fill: { type: 'gradient', opacity: 0.4 },
    colors: ['#f59e0b'],
    xaxis: { categories, labels: { style: { colors: chartTextColor.value } } },
    yaxis: { labels: { style: { colors: chartTextColor.value } } },
    grid: { borderColor: chartGridColor.value, strokeDashArray: 4, xaxis: { lines: { show: false } } },
    tooltip: { theme: isDark.value ? 'dark' : 'light' },
  }
})

const waitlistChartSeries = computed(() => makeByDayChart(data.value?.waitlist?.by_day, '#ec4899').series)
const waitlistChartOptions = computed(() => {
  const { categories } = makeByDayChart(data.value?.waitlist?.by_day)
  return {
    chart: { type: 'area', height: 192, toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent', animations: chartAnimations },
    stroke: { curve: 'monotoneCubic', width: 2 },
    fill: { type: 'gradient', opacity: 0.4 },
    colors: ['#ec4899'],
    xaxis: { categories, labels: { style: { colors: chartTextColor.value } } },
    yaxis: { labels: { style: { colors: chartTextColor.value } } },
    grid: { borderColor: chartGridColor.value, strokeDashArray: 4, xaxis: { lines: { show: false } } },
    tooltip: { theme: isDark.value ? 'dark' : 'light' },
  }
})

const newsletterChartSeries = computed(() => makeByDayChart(data.value?.newsletter?.by_day, '#22c55e').series)
const newsletterChartOptions = computed(() => {
  const { categories } = makeByDayChart(data.value?.newsletter?.by_day)
  return {
    chart: { type: 'area', height: 192, toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent', animations: chartAnimations },
    stroke: { curve: 'monotoneCubic', width: 2 },
    fill: { type: 'gradient', opacity: 0.4 },
    colors: ['#22c55e'],
    xaxis: { categories, labels: { style: { colors: chartTextColor.value } } },
    yaxis: { labels: { style: { colors: chartTextColor.value } } },
    grid: { borderColor: chartGridColor.value, strokeDashArray: 4, xaxis: { lines: { show: false } } },
    tooltip: { theme: isDark.value ? 'dark' : 'light' },
  }
})

const revenueOverTimeSeries = computed(() => {
  const rows = data.value?.revenue_over_time
  if (!Array.isArray(rows) || !rows.length) return []
  const categories = rows.map(r => r.month)
  return [
    { name: 'Active subscriptions', data: rows.map(r => r.active_subscriptions) },
    { name: 'MRR ($)', data: rows.map(r => r.mrr_cents / 100) },
  ]
})
const revenueOverTimeChartOptions = computed(() => ({
  chart: { type: 'area', height: 256, toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent', animations: chartAnimations },
  stroke: { curve: 'monotoneCubic', width: 2 },
  fill: { type: 'gradient', opacity: 0.4 },
  colors: ['#10b981', '#8b5cf6'],
  xaxis: {
    categories: (data.value?.revenue_over_time || []).map(r => r.month),
    labels: { style: { colors: chartTextColor.value } },
  },
  yaxis: { labels: { style: { colors: chartTextColor.value } } },
  grid: { borderColor: chartGridColor.value, strokeDashArray: 4, xaxis: { lines: { show: false } } },
  tooltip: { theme: isDark.value ? 'dark' : 'light' },
}))

function formatNumber(n) {
  if (n == null) return '—'
  return Number(n).toLocaleString()
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function exportCsv() {
  if (!data.value) return
  const rows = []
  rows.push(['Analytics export', `Generated ${new Date().toISOString()}`, `Range: ${days.value} days`])
  rows.push([])
  const s = data.value.summary
  if (s) {
    rows.push(['Summary', ''])
    Object.entries(s).forEach(([k, v]) => rows.push([k, v]))
    rows.push([])
  }
  const byDay = data.value.users?.registrations_by_day
  if (byDay) {
    rows.push(['Registrations by day', ''])
    Object.entries(byDay).forEach(([d, c]) => rows.push([d, c]))
    rows.push([])
  }
  const eventsByDay = data.value.activity?.events_by_day
  if (eventsByDay) {
    rows.push(['Activity events by day', ''])
    Object.entries(eventsByDay).forEach(([d, c]) => rows.push([d, c]))
    rows.push([])
  }
  const byAction = data.value.activity?.by_action
  if (byAction) {
    rows.push(['Activity by action', 'Count'])
    Object.entries(byAction).forEach(([a, c]) => rows.push([a, c]))
    rows.push([])
  }
  const contactByDay = data.value.contact?.by_day
  if (contactByDay) {
    rows.push(['Contact by day', ''])
    Object.entries(contactByDay).forEach(([d, c]) => rows.push([d, c]))
    rows.push([])
  }
  const waitlistByDay = data.value.waitlist?.by_day
  if (waitlistByDay) {
    rows.push(['Waitlist by day', ''])
    Object.entries(waitlistByDay).forEach(([d, c]) => rows.push([d, c]))
    rows.push([])
  }
  const newsletterByDay = data.value.newsletter?.by_day
  if (newsletterByDay) {
    rows.push(['Newsletter by day', ''])
    Object.entries(newsletterByDay).forEach(([d, c]) => rows.push([d, c]))
    rows.push([])
  }
  const topUsers = data.value.activity?.top_users
  if (topUsers?.length) {
    rows.push(['Top users by activity', 'User', 'Count'])
    topUsers.forEach(u => rows.push([u.user?.email ?? u.user_uuid, u.activity_count]))
  }
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics-${days.value}d-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function onPresetChange() {
  if (days.value !== 'custom') fetchData()
}

async function fetchData() {
  loading.value = true
  error.value = null
  try {
  const params = {}
  if (days.value === 'custom' && dateFrom.value && dateTo.value) {
    params.from = dateFrom.value
    params.to = dateTo.value
  } else if (days.value !== 'custom') {
    params.days = Number(days.value)
  } else {
    params.days = 30
  }
  if (compare.value) params.compare = 1
  data.value = await getAnalyticsOverview(params)
  } catch (e) {
    error.value = e?.message ?? 'Failed to load analytics'
  } finally {
    loading.value = false
  }
}

function exportJson() {
  if (!data.value) return
  const blob = new Blob([JSON.stringify(data.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  const t = new Date()
  dateTo.value = t.toISOString().slice(0, 10)
  dateFrom.value = new Date(t.getTime() - 29 * 86400000).toISOString().slice(0, 10)
  fetchData()
})
</script>
