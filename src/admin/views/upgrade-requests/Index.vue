<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <header class="space-y-1">
        <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Upgrade Requests</h1>
        <p :class="['text-sm', theme.textSecondary]">Memora subscription upgrade requests. Generate checkout links for users.</p>
      </header>

      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
          <input
            v-model="search"
            type="search"
            placeholder="Search by name or email…"
            :class="['w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', theme.textPrimary]"
            aria-label="Search upgrade requests"
          />
        </div>
        <select
          v-model="statusFilter"
          :class="['rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', theme.textPrimary]"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div v-if="loading" class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
          <span :class="['text-sm', theme.textSecondary]">Loading…</span>
        </div>
        <div v-for="i in 5" :key="i" class="rounded-xl border border-border bg-card p-4 sm:p-6 animate-pulse">
          <div :class="['h-5 w-48 rounded', theme.bgSkeleton]" />
          <div :class="['h-4 w-64 rounded mt-2', theme.bgSkeleton]" />
        </div>
      </div>

      <div
        v-else-if="error"
        :class="['rounded-xl border border-destructive/30 bg-destructive/5 dark:bg-destructive/10 px-6 py-8 flex items-start gap-4']"
      >
        <AlertCircle class="h-6 w-6 shrink-0 text-destructive" />
        <div>
          <p :class="['font-medium', theme.textPrimary]">Failed to load requests</p>
          <p :class="['text-sm mt-0.5', theme.textSecondary]">{{ error }}</p>
          <Button variant="outline" size="sm" class="mt-4" @click="load()">Try again</Button>
        </div>
      </div>

      <div
        v-else-if="requests.length === 0"
        :class="['rounded-2xl border border-dashed border-border bg-muted/30 dark:bg-muted/10 px-8 py-16 text-center']"
      >
        <div :class="['mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted dark:bg-muted/50 text-muted-foreground mb-4']">
          <TrendingUp class="h-7 w-7" />
        </div>
        <h2 :class="['text-lg font-semibold', theme.textPrimary]">No upgrade requests</h2>
        <p :class="['text-sm mt-1 max-w-sm mx-auto', theme.textSecondary]">
          When users request an upgrade from Plans &amp; Pricing, requests will appear here.
        </p>
      </div>

      <ul v-else class="space-y-4" role="list">
        <li
          v-for="req in requests"
          :key="req.uuid"
          class="group relative rounded-xl border border-l-4 border-l-emerald-500 dark:border-l-emerald-500 border-border bg-card shadow-sm overflow-hidden transition-shadow hover:shadow-md"
        >
          <div class="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <TrendingUp class="h-5 w-5" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 :class="['text-lg font-semibold', theme.textPrimary]">
                  {{ req.user.first_name }} {{ req.user.last_name }}
                </h3>
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                    req.status === 'pending'
                      ? 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      : req.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground',
                  ]"
                >
                  <span v-if="req.status === 'pending'" class="h-1.5 w-1.5 rounded-full bg-current animate-pulse" aria-hidden />
                  {{ req.status }}
                </span>
              </div>
              <p :class="['text-sm mt-1', theme.textSecondary]">{{ req.user.email }}</p>
              <p :class="['text-xs mt-2 flex items-center gap-1', theme.textSecondary]">
                <span>{{ formatTier(req.current_tier || 'starter') }} → {{ formatTier(req.target_tier) }}</span>
                <span>·</span>
                <span>{{ formatDate(req.requested_at || req.created_at) }}</span>
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              class="shrink-0"
              @click="$router.push({ name: 'admin-upgrade-request-show', params: { uuid: req.uuid } })"
            >
              View &amp; act
            </Button>
          </div>
        </li>
      </ul>

      <div v-if="meta && meta.last_page > 1" class="flex flex-wrap items-center justify-between gap-4">
        <p :class="['text-sm', theme.textSecondary]">
          Page {{ meta.current_page }} of {{ meta.last_page }} ({{ meta.total }} total)
        </p>
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="meta.current_page <= 1"
            @click="goToPage(meta.current_page - 1)"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="meta.current_page >= meta.last_page"
            @click="goToPage(meta.current_page + 1)"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'
import { AlertCircle, Search, TrendingUp } from '@/shared/utils/lucideAnimated'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const adminApi = useAdminApi()
const requests = ref([])
const meta = ref(null)
const loading = ref(true)
const error = ref(null)
const search = ref('')
const statusFilter = ref('pending')

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—')
const formatTier = (tier) => (tier ? tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase() : '')

const load = async (opts = {}) => {
  loading.value = true
  error.value = null
  try {
    const params = { per_page: 20, ...opts }
    if (statusFilter.value !== 'all') params.status = statusFilter.value
    if (search.value.trim()) params.search = search.value.trim()
    const res = await adminApi.getUpgradeRequests(params)
    requests.value = Array.isArray(res) ? res : (res?.data ?? [])
    meta.value = res?.meta ?? null
  } catch (e) {
    error.value = e?.message ?? 'Failed to load upgrade requests'
    toast.error('Failed to load upgrade requests')
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  if (!meta.value || page < 1 || page > meta.value.last_page) return
  load({ page })
}

watch([statusFilter, search], () => load(), { immediate: true })
</script>
