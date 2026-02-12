<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-10">
      <header class="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 :class="['text-3xl font-bold tracking-tight', theme.textPrimary]">Health</h1>
          <p :class="['mt-1.5 text-sm', theme.textSecondary]">Operational health checks and runtime metrics.</p>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink
            :to="{ name: 'admin-system' }"
            class="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors"
          >
            System details
          </RouterLink>
          <label class="flex items-center gap-2 text-sm cursor-pointer select-none" :class="theme.textSecondary">
            <input
              v-model="autoRefresh"
              type="checkbox"
              class="rounded border-input text-primary focus:ring-primary/30"
              aria-label="Auto-refresh every 60s"
            />
            Auto-refresh (60s)
          </label>
          <Button v-if="data" variant="outline" size="sm" :disabled="refreshing" class="shadow-sm" @click="runCheck">
            {{ refreshing ? 'Checking…' : 'Refresh now' }}
          </Button>
        </div>
      </header>

      <div v-if="loading && !data" class="flex items-center gap-4 rounded-2xl bg-card/80 border border-border p-8">
        <span class="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
        <span :class="['text-sm font-medium', theme.textPrimary]">Loading…</span>
      </div>

      <div v-else-if="error && !data" class="rounded-2xl border-l-4 border-destructive bg-destructive/10 border border-destructive/20 p-6 shadow-sm">
        <p :class="['text-sm font-medium', theme.textPrimary]">{{ error }}</p>
      </div>

      <div v-else class="space-y-10">
        <section v-if="history.length > 0">
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">History</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Recent health check snapshots. Click one to view that run.</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(h, i) in history"
              :key="i"
              type="button"
              :class="[
                'rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                h.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30',
              ]"
              :title="formatDate(h.timestamp)"
              @click="data = h.snapshot"
            >
              {{ formatDate(h.timestamp) }} — {{ h.status }}
            </button>
          </div>
        </section>

        <section v-if="data">
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Overall status</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Whether the application and its dependencies are currently operational.</p>
          <div
            :class="[
              'rounded-2xl border-l-4 p-6 shadow-lg transition-shadow',
              data?.status === 'healthy'
                ? 'bg-gradient-to-br from-emerald-500/10 to-green-600/5 border-emerald-500 dark:from-emerald-500/15 dark:to-green-600/10'
                : 'bg-gradient-to-br from-amber-500/10 to-orange-600/5 border-amber-500 dark:from-amber-500/15 dark:to-orange-600/10',
            ]"
          >
            <div class="flex flex-wrap items-center gap-6">
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'inline-flex size-5 rounded-full ring-4 ring-white/50 dark:ring-black/20',
                    data?.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500',
                  ]"
                  aria-hidden
                />
                <span :class="['text-xl font-bold capitalize', theme.textPrimary]">{{ data?.status ?? 'unknown' }}</span>
              </div>
              <span v-if="data?.version" :class="['text-sm font-mono px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5', theme.textSecondary]">v{{ data.version }}</span>
              <span v-if="data?.timestamp" :class="['text-sm', theme.textSecondary]">Last check: {{ formatDate(data.timestamp) }}</span>
              <span v-if="data?.status !== 'healthy' && data?.last_failed_at" class="text-sm font-medium text-amber-600 dark:text-amber-400">Last failed: {{ formatDate(data.last_failed_at) }}</span>
            </div>
          </div>
        </section>

        <section v-if="data?.scheduler_stale" class="rounded-2xl border-l-4 border-amber-500 bg-amber-500/10 border border-amber-500/20 p-4 shadow-sm">
          <p :class="['text-sm font-medium text-amber-800 dark:text-amber-200']">
            Scheduler may not be running (last run: {{ data.scheduler_last_run ? formatDate(data.scheduler_last_run) : 'unknown' }}).
            <RouterLink :to="{ name: 'admin-system' }" class="text-primary font-semibold hover:underline ml-1">View System</RouterLink>
          </p>
        </section>

        <section v-if="data?.statistics?.failed_jobs_count != null && data.statistics.failed_jobs_count > 0" class="rounded-2xl border-l-4 border-amber-500 bg-amber-500/10 border border-amber-500/20 p-4 shadow-sm">
          <p :class="['text-sm font-medium text-amber-800 dark:text-amber-200']">
            {{ data.statistics.failed_jobs_count }} failed job(s) in queue.
            <RouterLink :to="{ name: 'admin-system' }" class="text-primary font-semibold hover:underline ml-1">View queue details in System</RouterLink>
          </p>
        </section>

        <section v-if="data">
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Checks</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Status of app, database, cache, queue, storage, and disk space. Each must pass for overall health to be healthy.</p>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="(check, key) in data?.checks"
              :key="key"
              :class="[
                'rounded-2xl border-l-4 bg-card p-5 shadow-md hover:shadow-lg transition-all duration-200',
                check.status === 'ok' ? 'border-l-emerald-500 border border-border' : 'border-l-destructive border border-destructive/20',
              ]"
            >
              <div class="flex items-center justify-between gap-2">
                <span :class="['font-semibold capitalize', theme.textPrimary]">{{ String(key).replace(/_/g, ' ') }}</span>
                <span
                  :class="[
                    'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider',
                    check.status === 'ok' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-destructive/20 text-destructive',
                  ]"
                >
                  {{ check.status }}
                </span>
              </div>
              <p v-if="check.message" :class="['mt-2 text-sm', theme.textSecondary]">{{ check.message }}</p>
              <p v-if="check.response_ms != null" class="mt-1 text-xs font-mono font-semibold tabular-nums text-primary">{{ check.response_ms }} ms</p>
            </div>
          </div>
        </section>

        <section v-if="data">
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">Statistics</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Runtime metrics from this health check: memory use, dependency response times, queue size, and failed jobs.</p>
          <div class="rounded-2xl border border-border bg-card p-6 shadow-lg space-y-6">
            <dl class="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              <div v-if="data?.statistics?.memory_usage_mb != null" class="rounded-xl bg-muted/40 dark:bg-white/5 p-4">
                <dt :class="['text-xs font-semibold uppercase tracking-wider', theme.textSecondary]">Memory usage</dt>
                <dd class="mt-1 text-xl font-bold font-mono tabular-nums text-primary">{{ data.statistics.memory_usage_mb }} MB</dd>
              </div>
              <div v-if="data?.statistics?.memory_peak_mb != null" class="rounded-xl bg-muted/40 dark:bg-white/5 p-4">
                <dt :class="['text-xs font-semibold uppercase tracking-wider', theme.textSecondary]">Memory peak</dt>
                <dd :class="['mt-1 text-xl font-bold font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.memory_peak_mb }} MB</dd>
              </div>
              <div v-if="data?.statistics?.database_connection_ms != null" class="rounded-xl bg-muted/40 dark:bg-white/5 p-4">
                <dt :class="['text-xs font-semibold uppercase tracking-wider', theme.textSecondary]">DB response</dt>
                <dd :class="['mt-1 text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400', theme.textPrimary]">{{ data.statistics.database_connection_ms }} ms</dd>
              </div>
              <div v-if="data?.statistics?.cache_response_ms != null" class="rounded-xl bg-muted/40 dark:bg-white/5 p-4">
                <dt :class="['text-xs font-semibold uppercase tracking-wider', theme.textSecondary]">Cache response</dt>
                <dd :class="['mt-1 text-lg font-bold font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.cache_response_ms }} ms</dd>
              </div>
              <div v-if="data?.statistics?.queue_size != null" class="rounded-xl bg-muted/40 dark:bg-white/5 p-4">
                <dt :class="['text-xs font-semibold uppercase tracking-wider', theme.textSecondary]">Queue size</dt>
                <dd :class="['mt-1 text-lg font-bold font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.queue_size }}</dd>
              </div>
              <div v-if="data?.statistics?.failed_jobs_count != null" class="rounded-xl bg-muted/40 dark:bg-white/5 p-4">
                <dt :class="['text-xs font-semibold uppercase tracking-wider', theme.textSecondary]">Failed jobs</dt>
                <dd :class="['mt-1 text-lg font-bold font-mono tabular-nums', data.statistics.failed_jobs_count > 0 ? 'text-amber-600 dark:text-amber-400' : '', theme.textPrimary]">{{ data.statistics.failed_jobs_count }}</dd>
              </div>
              <div v-if="data?.statistics?.health_check_ms != null" class="rounded-xl bg-muted/40 dark:bg-white/5 p-4">
                <dt :class="['text-xs font-semibold uppercase tracking-wider', theme.textSecondary]">Health check</dt>
                <dd :class="['mt-1 text-lg font-bold font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.health_check_ms }} ms</dd>
              </div>
            </dl>
            <div v-if="dbResponseHistory.length > 0" class="pt-6 border-t border-border">
              <p :class="['text-xs font-semibold uppercase tracking-wider mb-3', theme.textSecondary]">DB response (last {{ dbResponseHistory.length }} checks)</p>
              <div class="flex items-end gap-1 h-12 rounded-lg overflow-hidden">
                <div
                  v-for="(ms, i) in dbResponseHistory"
                  :key="i"
                  class="min-w-0 flex-1 rounded-t bg-gradient-to-t from-primary/80 to-primary/40 transition-all duration-300 hover:from-primary hover:to-primary/70"
                  :style="{ height: dbResponseBarHeight(ms) + '%' }"
                  :title="ms + ' ms'"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useAdminApi } from '@/admin/api/admin'
import { Button } from '@/shared/components/shadcn/button'

const theme = useThemeClasses()
const { getHealth } = useAdminApi()

const data = ref(null)
const loading = ref(true)
const error = ref(null)
const refreshing = ref(false)
const autoRefresh = ref(false)
const history = ref([])
const HISTORY_MAX = 10
let refreshTimer = null

const dbResponseHistory = computed(() => {
  return history.value
    .map(h => h.snapshot?.statistics?.database_connection_ms)
    .filter(ms => ms != null)
    .slice(0, 20)
})

function dbResponseBarHeight(ms) {
  const arr = dbResponseHistory.value
  if (!arr.length) return 0
  const max = Math.max(...arr, 1)
  return Math.min(100, Math.round((ms / max) * 100))
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function pushHistory(snapshot) {
  if (!snapshot?.timestamp) return
  history.value = [
    { status: snapshot.status, timestamp: snapshot.timestamp, snapshot: { ...snapshot } },
    ...history.value.slice(0, HISTORY_MAX - 1),
  ]
}

async function runCheck() {
  refreshing.value = true
  error.value = null
  try {
    const result = await getHealth()
    data.value = result
    pushHistory(result)
  } catch (e) {
    error.value = e?.message ?? 'Failed to load health'
  } finally {
    refreshing.value = false
  }
}

onMounted(async () => {
  await runCheck()
  loading.value = false
})

watch(autoRefresh, (on) => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
  if (on) {
    refreshTimer = setInterval(() => {
      if (!data.value) return
      getHealth()
        .then((result) => {
          data.value = result
          pushHistory(result)
        })
        .catch(() => {})
    }, 60000)
  }
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})
</script>
