<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Health</h1>
          <p :class="['mt-1 text-sm', theme.textSecondary]">Detailed app and server health checks and statistics.</p>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink
            :to="{ name: 'admin-system' }"
            class="text-sm text-accent hover:underline"
          >
            System details
          </RouterLink>
          <label class="flex items-center gap-2 text-sm" :class="theme.textSecondary">
            <input
              v-model="autoRefresh"
              type="checkbox"
              class="rounded border-input"
              aria-label="Auto-refresh every 60s"
            />
            Auto-refresh (60s)
          </label>
          <Button v-if="data" variant="outline" size="sm" :disabled="refreshing" @click="runCheck">
            {{ refreshing ? 'Checking…' : 'Refresh now' }}
          </Button>
        </div>
      </header>

      <div v-if="loading && !data" class="flex items-center gap-3">
        <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
        <span :class="['text-sm', theme.textSecondary]">Loading…</span>
      </div>

      <div v-else-if="error && !data" :class="['rounded-xl border border-destructive/50 bg-destructive/10 p-4 sm:p-6 text-sm', theme.textPrimary]">
        {{ error }}
      </div>

      <div v-else class="space-y-8">
        <section v-if="history.length > 0">
          <h2 :class="['text-lg font-medium mb-4', theme.textPrimary]">History</h2>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(h, i) in history"
              :key="i"
              type="button"
              :class="[
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                h.status === 'healthy' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
              ]"
              :title="formatDate(h.timestamp)"
              @click="data = h.snapshot"
            >
              {{ formatDate(h.timestamp) }} — {{ h.status }}
            </button>
          </div>
        </section>

        <section v-if="data">
          <h2 :class="['text-lg font-medium mb-4', theme.textPrimary]">Overall status</h2>
          <div
            :class="[
              'rounded-xl border bg-card p-4 sm:p-6 shadow-sm',
              data?.status === 'healthy' ? 'border-green-500/30' : 'border-amber-500/30',
            ]"
          >
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'inline-block size-4 rounded-full',
                    data?.status === 'healthy' ? 'bg-green-500' : 'bg-amber-500',
                  ]"
                  aria-hidden
                />
                <span :class="['font-semibold capitalize', theme.textPrimary]">{{ data?.status ?? 'unknown' }}</span>
              </div>
              <span v-if="data?.version" :class="['text-sm font-mono', theme.textSecondary]">Version: {{ data.version }}</span>
              <span v-if="data?.timestamp" :class="['text-sm', theme.textSecondary]">Last check: {{ formatDate(data.timestamp) }}</span>
              <span v-if="data?.status !== 'healthy' && data?.last_failed_at" :class="['text-sm text-amber-600 dark:text-amber-400']">Last failed: {{ formatDate(data.last_failed_at) }}</span>
            </div>
          </div>
        </section>

        <section v-if="data?.scheduler_stale" class="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4">
          <p :class="['text-sm font-medium text-amber-700 dark:text-amber-400']">
            Scheduler may not be running (last run: {{ data.scheduler_last_run ? formatDate(data.scheduler_last_run) : 'unknown' }}).
            <RouterLink :to="{ name: 'admin-system' }" class="text-accent hover:underline">View System</RouterLink>
          </p>
        </section>

        <section v-if="data?.statistics?.failed_jobs_count != null && data.statistics.failed_jobs_count > 0" class="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4">
          <p :class="['text-sm font-medium text-amber-700 dark:text-amber-400']">
            {{ data.statistics.failed_jobs_count }} failed job(s) in queue.
            <RouterLink :to="{ name: 'admin-system' }" class="text-accent hover:underline">View queue details in System</RouterLink>
          </p>
        </section>

        <section v-if="data">
          <h2 :class="['text-lg font-medium mb-4', theme.textPrimary]">Checks</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="(check, key) in data?.checks"
              :key="key"
              :class="[
                'rounded-xl border bg-card p-5 shadow-sm',
                check.status === 'ok' ? 'border-border' : 'border-destructive/30',
              ]"
            >
              <div class="flex items-center justify-between gap-2">
                <span :class="['font-medium capitalize', theme.textPrimary]">{{ String(key).replace(/_/g, ' ') }}</span>
                <span
                  :class="[
                    'shrink-0 text-sm font-medium',
                    check.status === 'ok' ? 'text-green-600 dark:text-green-400' : 'text-destructive',
                  ]"
                >
                  {{ check.status }}
                </span>
              </div>
              <p v-if="check.message" :class="['mt-2 text-sm', theme.textSecondary]">{{ check.message }}</p>
              <p v-if="check.response_ms != null" :class="['mt-1 text-xs font-mono', theme.textSecondary]">{{ check.response_ms }} ms</p>
            </div>
          </div>
        </section>

        <section v-if="data">
          <h2 :class="['text-lg font-medium mb-4', theme.textPrimary]">Statistics</h2>
          <div class="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-6">
            <dl class="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              <div v-if="data?.statistics?.memory_usage_mb != null">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Memory usage</dt>
                <dd :class="['mt-1 text-lg font-semibold font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.memory_usage_mb }} MB</dd>
              </div>
              <div v-if="data?.statistics?.memory_peak_mb != null">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Memory peak</dt>
                <dd :class="['mt-1 text-lg font-semibold font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.memory_peak_mb }} MB</dd>
              </div>
              <div v-if="data?.statistics?.php_memory_limit">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">PHP memory limit</dt>
                <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.statistics.php_memory_limit }}</dd>
              </div>
              <div v-if="data?.statistics?.php_max_execution_time != null">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Max execution time</dt>
                <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.statistics.php_max_execution_time }}s</dd>
              </div>
              <div v-if="data?.statistics?.database_connection_ms != null">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">DB response</dt>
                <dd :class="['mt-1 text-sm font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.database_connection_ms }} ms</dd>
              </div>
              <div v-if="data?.statistics?.cache_response_ms != null">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Cache response</dt>
                <dd :class="['mt-1 text-sm font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.cache_response_ms }} ms</dd>
              </div>
              <div v-if="data?.statistics?.queue_size != null">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Queue size</dt>
                <dd :class="['mt-1 text-sm font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.queue_size }}</dd>
              </div>
              <div v-if="data?.statistics?.failed_jobs_count != null">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Failed jobs</dt>
                <dd :class="['mt-1 text-sm font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.failed_jobs_count }}</dd>
              </div>
              <div v-if="data?.statistics?.php_extensions_count != null">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">PHP extensions</dt>
                <dd :class="['mt-1 text-sm font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.php_extensions_count }}</dd>
              </div>
              <div v-if="data?.statistics?.health_check_ms != null">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Health check</dt>
                <dd :class="['mt-1 text-sm font-mono tabular-nums', theme.textPrimary]">{{ data.statistics.health_check_ms }} ms</dd>
              </div>
            </dl>
            <div v-if="(data?.statistics?.php_extensions_loaded || []).length" class="pt-4 border-t border-border">
              <dt :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Key extensions loaded</dt>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="ext in data.statistics.php_extensions_loaded"
                  :key="ext"
                  :class="['rounded-md px-2 py-1 text-xs font-mono', theme.bgMuted, theme.textPrimary]"
                >
                  {{ ext }}
                </span>
              </div>
            </div>
            <div v-if="dbResponseHistory.length > 0" class="pt-4 border-t border-border">
              <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">DB response (last {{ dbResponseHistory.length }} checks)</p>
              <div class="flex items-end gap-0.5 h-10">
                <div
                  v-for="(ms, i) in dbResponseHistory"
                  :key="i"
                  class="min-w-0 flex-1 rounded-t bg-primary/60"
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
