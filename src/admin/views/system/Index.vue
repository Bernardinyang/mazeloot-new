<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">System details</h1>
          <p :class="['mt-1 text-sm', theme.textSecondary]">Server, environment, and runtime configuration.</p>
        </div>
        <div v-if="data" class="flex items-center gap-2">
          <a
            v-if="data.telescope_enabled"
            :href="telescopeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-accent hover:underline"
          >
            Open Telescope
          </a>
          <Button variant="outline" size="sm" :disabled="clearingCache" @click="confirmClearCache">
            {{ clearingCache ? 'Clearing…' : 'Clear cache' }}
          </Button>
        </div>
      </header>

      <div v-if="loading" class="flex items-center gap-3">
        <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
        <span :class="['text-sm', theme.textSecondary]">Loading…</span>
      </div>

      <div v-else-if="error" :class="['rounded-xl border border-destructive/50 bg-destructive/10 p-4 sm:p-6 text-sm', theme.textPrimary]">
        {{ error }}
      </div>

      <div v-else class="space-y-8">
        <p v-if="data?.env_hint" :class="['text-sm font-medium rounded-lg border border-border bg-muted/50 px-4 py-2', theme.textPrimary]">
          {{ data.env_hint }}
        </p>
        <section v-for="(section, sectionKey) in sections" :key="sectionKey" class="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm">
          <h2 :class="['text-lg font-medium mb-4 capitalize', theme.textPrimary]">{{ String(sectionKey).replace(/_/g, ' ') }}</h2>

          <div v-if="sectionKey === 'disk' && data?.disk?.used_percent != null" class="mb-4">
            <div class="flex justify-between text-xs mb-1" :class="theme.textSecondary">
              <span>Used {{ data.disk.used_percent }}%</span>
              <span>{{ data.disk.free_gb }} GB free of {{ data.disk.total_gb }} GB</span>
            </div>
            <div class="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                :class="data.disk.used_percent > 90 ? 'bg-destructive' : data.disk.used_percent > 75 ? 'bg-amber-500' : 'bg-primary'"
                :style="{ width: Math.min(100, data.disk.used_percent) + '%' }"
              />
            </div>
          </div>

          <div v-if="sectionKey === 'load' && data?.load" class="mb-4 grid grid-cols-3 gap-4">
            <div>
              <p :class="['text-xs font-medium uppercase tracking-wider mb-1', theme.textSecondary]">1 min</p>
              <div class="h-2 w-full rounded bg-muted overflow-hidden">
                <div class="h-full rounded bg-primary" :style="{ width: loadBarWidth(data.load['1min']) + '%' }" />
              </div>
              <p :class="['text-xs font-mono mt-0.5', theme.textPrimary]">{{ data.load['1min'] }}</p>
            </div>
            <div>
              <p :class="['text-xs font-medium uppercase tracking-wider mb-1', theme.textSecondary]">5 min</p>
              <div class="h-2 w-full rounded bg-muted overflow-hidden">
                <div class="h-full rounded bg-primary" :style="{ width: loadBarWidth(data.load['5min']) + '%' }" />
              </div>
              <p :class="['text-xs font-mono mt-0.5', theme.textPrimary]">{{ data.load['5min'] }}</p>
            </div>
            <div>
              <p :class="['text-xs font-medium uppercase tracking-wider mb-1', theme.textSecondary]">15 min</p>
              <div class="h-2 w-full rounded bg-muted overflow-hidden">
                <div class="h-full rounded bg-primary" :style="{ width: loadBarWidth(data.load['15min']) + '%' }" />
              </div>
              <p :class="['text-xs font-mono mt-0.5', theme.textPrimary]">{{ data.load['15min'] }}</p>
            </div>
          </div>

          <div v-if="sectionKey === 'config'" class="flex flex-wrap gap-2 mb-4">
            <span
              :class="['rounded-full px-3 py-1 text-xs font-medium', section.config_cached ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-muted', theme.textPrimary]"
            >
              Config {{ section.config_cached ? 'cached' : 'not cached' }}
            </span>
            <span
              :class="['rounded-full px-3 py-1 text-xs font-medium', section.routes_cached ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-muted', theme.textPrimary]"
            >
              Routes {{ section.routes_cached ? 'cached' : 'not cached' }}
            </span>
          </div>

          <dl v-if="sectionKey !== 'quick_links' && sectionKey !== 'feature_flags'" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="(value, key) in sectionRows(sectionKey, section)"
              :key="key"
              class="min-w-0"
            >
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">{{ String(key).replace(/_/g, ' ') }}</dt>
              <dd :class="['mt-1 text-sm font-mono break-all', theme.textPrimary]">{{ formatValue(value) }}</dd>
            </div>
          </dl>

          <div v-if="sectionKey === 'quick_links' && Array.isArray(section) && section.length" class="mt-2 flex flex-wrap gap-2">
            <a
              v-for="(link, i) in section"
              :key="i"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-accent hover:underline"
            >
              {{ link.label }}
            </a>
          </div>
          <div v-else-if="sectionKey === 'feature_flags' && Array.isArray(section) && section.length" class="mt-2 flex flex-wrap gap-1.5">
            <span
              v-for="flag in section"
              :key="flag"
              :class="['rounded px-2 py-0.5 text-xs font-mono', theme.bgMuted, theme.textPrimary]"
            >
              {{ flag }}
            </span>
          </div>
          <div v-if="sectionKey === 'php' && (data?.php?.extensions || []).length" class="mt-4 pt-4 border-t border-border">
            <dt :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Extensions ({{ data.php.extensions.length }})</dt>
            <div class="flex flex-wrap gap-1.5 max-h-48 overflow-auto">
              <span
                v-for="ext in data.php.extensions"
                :key="ext"
                :class="['rounded px-2 py-0.5 text-xs font-mono', theme.bgMuted, theme.textPrimary]"
              >
                {{ ext }}
              </span>
            </div>
          </div>
        </section>

        <section v-if="logIssuesLoaded || logIssuesError" class="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm">
          <h2 :class="['text-lg font-medium mb-4', theme.textPrimary]">Recent log issues</h2>
          <div v-if="logIssuesError" :class="['rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm', theme.textPrimary]">
            {{ logIssuesError }}
          </div>
          <div v-else class="space-y-4">
            <div v-if="(logIssues.errors?.length || 0) + (logIssues.alerts?.length || 0) > 0" class="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
              <p class="text-xs font-medium uppercase tracking-wider mb-2 text-destructive">Errors & alerts</p>
              <ul class="space-y-2 max-h-48 overflow-auto">
                <li
                  v-for="(entry, i) in [...(logIssues.errors || []), ...(logIssues.alerts || [])]"
                  :key="'err-' + i"
                  class="text-sm font-mono break-words"
                  :class="theme.textPrimary"
                >
                  <span :class="['text-xs', theme.textSecondary]">{{ entry.date }}</span>
                  <span class="ml-2 text-destructive">{{ entry.level }}</span>
                  {{ entry.message }}
                </li>
              </ul>
            </div>
            <div v-if="(logIssues.warnings || []).length > 0" class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p class="text-xs font-medium uppercase tracking-wider mb-2 text-amber-700 dark:text-amber-400">Warnings</p>
              <ul class="space-y-2 max-h-48 overflow-auto">
                <li
                  v-for="(entry, i) in logIssues.warnings"
                  :key="'warn-' + i"
                  class="text-sm font-mono break-words"
                  :class="theme.textPrimary"
                >
                  <span :class="['text-xs', theme.textSecondary]">{{ entry.date }}</span>
                  <span class="ml-2 text-amber-700 dark:text-amber-400">{{ entry.level }}</span>
                  {{ entry.message }}
                </li>
              </ul>
            </div>
            <p v-if="!logIssues.errors?.length && !logIssues.alerts?.length && !logIssues.warnings?.length" :class="['text-sm', theme.textSecondary]">No recent errors, alerts, or warnings.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useAdminApi } from '@/admin/api/admin'
import { Button } from '@/shared/components/shadcn/button'
import { API_CONFIG } from '@/shared/api/config'

const theme = useThemeClasses()
const { getSystem, clearCache, getLogsRecent } = useAdminApi()

const data = ref(null)
const loading = ref(true)
const error = ref(null)
const clearingCache = ref(false)
const logIssues = ref({ errors: [], warnings: [], alerts: [] })
const logIssuesLoaded = ref(false)
const logIssuesError = ref(null)

const telescopeUrl = computed(() => {
  try {
    const base = API_CONFIG.API_BASE_URL || ''
    const url = base.replace(/\/api\/?$/, '')
    return `${url}/telescope`
  } catch {
    return '/telescope'
  }
})

async function confirmClearCache() {
  if (!window.confirm('Clear application cache? This may temporarily slow the next requests.')) return
  clearingCache.value = true
  try {
    await clearCache()
    window.alert('Cache cleared.')
  } catch (e) {
    window.alert(e?.message ?? 'Failed to clear cache')
  } finally {
    clearingCache.value = false
  }
}

const sections = computed(() => {
  if (!data.value) return {}
  const d = data.value
  const out = {}
  if (d.application) out.application = d.application
  if (d.php) out.php = d.php
  if (d.database) out.database = d.database
  if (d.cache) out.cache = d.cache
  if (d.queue) out.queue = d.queue
  if (d.session) out.session = d.session
  if (d.filesystem) {
    out.filesystem = {
      ...d.filesystem,
      disks: Array.isArray(d.filesystem.disks) ? d.filesystem.disks.join(', ') : d.filesystem.disks,
    }
  }
  if (d.opcache) out.opcache = d.opcache
  if (d.server) out.server = d.server
  if (d.disk) {
    const disk = { ...d.disk }
    if (disk.total_gb != null) disk.total_gb = `${disk.total_gb} GB`
    if (disk.free_gb != null) disk.free_gb = `${disk.free_gb} GB`
    if (disk.used_percent != null) disk.used_percent = `${disk.used_percent}%`
    out.disk = disk
  }
  if (d.load && typeof d.load === 'object') out.load = d.load
  if (d.config) out.config = d.config
  if (d.env) out.env = d.env
  if (d.logging) {
    const log = d.logging
    out.logging = {
      channel: log.channel,
      path: log.path,
      exists: log.exists,
      size_bytes: log.size_bytes,
      size_mb: log.size_bytes != null ? (log.size_bytes / 1024 / 1024).toFixed(2) + ' MB' : null,
      modified_at: log.modified_at,
    }
  }
  if (d.app_version != null || d.telescope_enabled != null) {
    out.tools = {}
    if (d.app_version != null) out.tools.app_version = d.app_version
    if (d.telescope_enabled != null) out.tools.telescope_enabled = d.telescope_enabled
  }
  if (d.scheduler_last_run) out.scheduler = { last_run: d.scheduler_last_run }
  if (Array.isArray(d.quick_links) && d.quick_links.length) out.quick_links = d.quick_links
  if (Array.isArray(d.feature_flags) && d.feature_flags.length) out.feature_flags = d.feature_flags
  return out
})

function sectionRows(sectionKey, section) {
  if (sectionKey === 'php' && section.extensions) {
    const { extensions, ...rest } = section
    return rest
  }
  if (sectionKey === 'config') return section
  return section
}

function loadBarWidth(load) {
  if (load == null) return 0
  const n = Number(load)
  if (n <= 0) return 0
  return Math.min(100, Math.round(n * 25))
}

function formatValue(v) {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (Array.isArray(v)) return v.join(', ')
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

async function loadLogIssues() {
  logIssuesError.value = null
  try {
    logIssues.value = await getLogsRecent()
  } catch (e) {
    logIssuesError.value = e?.message ?? 'Failed to load logs'
  } finally {
    logIssuesLoaded.value = true
  }
}

onMounted(async () => {
  try {
    data.value = await getSystem()
  } catch (e) {
    error.value = e?.message ?? 'Failed to load system info'
  } finally {
    loading.value = false
  }
  loadLogIssues()
})
</script>
