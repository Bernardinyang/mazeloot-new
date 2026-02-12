<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
      <header class="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 :class="['text-3xl font-bold tracking-tight', theme.textPrimary]">System details</h1>
          <p :class="['mt-1.5 text-sm', theme.textSecondary]">Server, environment, extensions, binaries, and configuration.</p>
        </div>
        <div v-if="data" class="flex items-center gap-2">
          <Button variant="outline" size="sm" :disabled="refreshing" class="shadow-sm" @click="refresh">
            {{ refreshing ? 'Refreshing…' : 'Refresh' }}
          </Button>
          <a
            v-if="data.telescope_enabled"
            :href="telescopeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm font-medium text-primary hover:underline"
          >
            Open Telescope
          </a>
          <Button variant="outline" size="sm" :disabled="clearingCache" class="shadow-sm" @click="showClearCacheModal = true">
            {{ clearingCache ? 'Clearing…' : 'Clear cache' }}
          </Button>
          <Button variant="outline" size="sm" :disabled="clearingAllCache" class="shadow-sm" @click="showClearAllCacheModal = true">
            {{ clearingAllCache ? 'Running…' : 'Clear all cache & optimize' }}
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

      <div v-else class="space-y-8">
        <p v-if="data?.scheduler_stale_seconds != null && data.scheduler_stale_seconds > 900" class="rounded-2xl border-l-4 border-amber-500 bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm font-medium text-amber-800 dark:text-amber-200">
          Scheduler may not be running (last run {{ data.scheduler_last_run ? formatSchedulerAgo(data.scheduler_last_run) : 'unknown' }}).
        </p>
        <p v-if="data?.worker_heartbeat_at != null" :class="['rounded-2xl border-l-4 px-4 py-3 text-sm font-medium', theme.textPrimary, workerHeartbeatStale ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-200' : 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20']">
          Queue workers: last heartbeat {{ formatSchedulerAgo(data.worker_heartbeat_at) }}.
        </p>
        <p v-else-if="data && data.queue?.driver !== 'sync'" class="rounded-2xl border-l-4 border-amber-500 bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm font-medium text-amber-800 dark:text-amber-200">
          No queue worker heartbeat. Ensure <code class="font-mono text-xs rounded bg-black/10 dark:bg-white/10 px-1 py-0.5">php artisan queue:work</code> is running and scheduler runs every minute.
        </p>
        <p v-if="data?.env_hint" :class="['text-sm font-medium rounded-2xl border border-border bg-muted/50 dark:bg-white/5 px-4 py-3', theme.textPrimary]">
          {{ data.env_hint }}
        </p>
        <section v-for="(section, sectionKey) in sections" :key="sectionKey" class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <h2 :class="['text-lg font-semibold tracking-tight mb-1 capitalize', theme.textPrimary]">{{ String(sectionKey).replace(/_/g, ' ') }}</h2>
          <p v-if="sectionDescriptions[sectionKey]" :class="['text-sm mb-4', theme.textSecondary]">{{ sectionDescriptions[sectionKey] }}</p>

          <div v-if="sectionKey === 'disk' && data?.disk?.used_percent != null" class="mb-4">
            <div class="flex justify-between text-xs font-medium mb-2" :class="theme.textSecondary">
              <span>Used {{ data.disk.used_percent }}%</span>
              <span>{{ data.disk.free_gb }} GB free of {{ data.disk.total_gb }} GB</span>
            </div>
            <div class="h-4 w-full rounded-full bg-muted overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="data.disk.used_percent > 90 ? 'bg-gradient-to-r from-destructive to-red-600' : data.disk.used_percent > 75 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-primary to-primary/80'"
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
              :class="['rounded-full px-4 py-1.5 text-xs font-semibold', section.config_cached ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-muted text-muted-foreground']"
            >
              Config {{ section.config_cached ? 'cached' : 'not cached' }}
            </span>
            <span
              :class="['rounded-full px-4 py-1.5 text-xs font-semibold', section.routes_cached ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-muted text-muted-foreground']"
            >
              Routes {{ section.routes_cached ? 'cached' : 'not cached' }}
            </span>
          </div>

          <template v-if="sectionKey === 'php_security'">
            <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
              <div
                v-for="(value, key) in sectionRows(sectionKey, section)"
                :key="key"
                class="min-w-0"
              >
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">{{ String(key).replace(/_/g, ' ') }}</dt>
                <dd :class="['mt-1 text-sm font-mono break-all', theme.textPrimary]">{{ formatValue(value) }}</dd>
              </div>
            </dl>
            <div v-if="section.disable_functions_sample?.length" class="pt-4 border-t border-border">
              <dt :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Disabled functions (sample)</dt>
              <div class="flex flex-wrap gap-1.5 max-h-32 overflow-auto">
                <span
                  v-for="fn in section.disable_functions_sample"
                  :key="fn"
                  :class="['rounded px-2 py-0.5 text-xs font-mono', theme.bgMuted, theme.textPrimary]"
                >
                  {{ fn }}
                </span>
              </div>
            </div>
          </template>
          <dl v-else-if="sectionKey !== 'quick_links' && sectionKey !== 'feature_flags' && sectionKey !== 'failed_logins'" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <div v-else-if="sectionKey === 'feature_flags' && Array.isArray(section) && section.length" class="mt-2 space-y-2">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="flag in section"
                :key="flag"
                :class="['rounded px-2 py-0.5 text-xs font-mono', theme.bgMuted, theme.textPrimary]"
              >
                {{ flag }}
              </span>
            </div>
            <div v-if="data?.feature_flag_usage && Object.keys(data.feature_flag_usage).length" class="pt-2 border-t border-border text-xs">
              <p :class="['font-medium mb-1', theme.textSecondary]">Usage (users with flag)</p>
              <div class="flex flex-wrap gap-x-4 gap-y-1">
                <span v-for="(count, flag) in data.feature_flag_usage" :key="flag" :class="theme.textPrimary">
                  {{ flag }}: {{ count }}
                </span>
              </div>
            </div>
          </div>
          <div v-else-if="sectionKey === 'failed_logins' && Array.isArray(section) && section.length" class="mt-2">
            <p :class="['text-xs font-medium mb-2', theme.textSecondary]">Last {{ section.length }} failed login attempts</p>
            <ul class="space-y-1 text-sm font-mono">
              <li v-for="(entry, i) in section" :key="i" :class="theme.textPrimary">
                {{ entry.attempted_at }} — {{ entry.identifier }} ({{ entry.ip || '—' }})
              </li>
            </ul>
          </div>
          <div v-else-if="sectionKey === 'queue' && data?.queue" class="mt-4 pt-4 border-t border-border space-y-4">
            <div v-if="(data.queue.recent_processed_jobs || []).length" class="space-y-2">
              <p :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Recently processed (last 50)</p>
              <ul class="max-h-40 overflow-auto rounded-lg border border-border p-2 space-y-1 text-xs font-mono" :class="theme.textPrimary">
                <li v-for="(entry, i) in data.queue.recent_processed_jobs" :key="i">
                  <span :class="theme.textSecondary">{{ entry.processed_at }}</span>
                  <span class="ml-2">{{ entry.name }}</span>
                </li>
              </ul>
            </div>
            <div v-if="(data.queue.failed_jobs || []).length" class="space-y-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Failed jobs ({{ data.queue.failed_jobs.length }})</p>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    :disabled="queueActionLoading"
                    class="rounded-lg px-2.5 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                    @click="retryAllFailed"
                  >
                    {{ queueActionLoading ? '…' : 'Retry all' }}
                  </button>
                  <button
                    type="button"
                    :disabled="queueActionLoading"
                    class="rounded-lg px-2.5 py-1.5 text-xs font-medium border border-destructive text-destructive hover:bg-destructive/10 disabled:opacity-60"
                    @click="flushFailed"
                  >
                    {{ queueActionLoading ? '…' : 'Flush all' }}
                  </button>
                </div>
              </div>
              <div class="rounded-lg border border-border overflow-hidden">
                <table class="w-full text-sm">
                  <thead :class="['text-left text-xs uppercase', theme.textSecondary, theme.bgMuted]">
                    <tr>
                      <th class="px-3 py-2 font-medium">Job</th>
                      <th class="px-3 py-2 font-medium">Queue</th>
                      <th class="px-3 py-2 font-medium">Failed at</th>
                      <th class="px-3 py-2 font-medium w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody :class="theme.textPrimary">
                    <tr v-for="job in data.queue.failed_jobs" :key="job.uuid" class="border-t border-border">
                      <td class="px-3 py-2 font-mono text-xs">{{ job.display_name }}</td>
                      <td class="px-3 py-2 text-xs">{{ job.queue }}</td>
                      <td class="px-3 py-2 text-xs" :class="theme.textSecondary">{{ job.failed_at }}</td>
                      <td class="px-3 py-2">
                        <button
                          type="button"
                          :disabled="queueActionLoading"
                          class="mr-2 text-xs text-primary hover:underline disabled:opacity-60"
                          @click="retryOneFailed(job.uuid)"
                        >
                          Retry
                        </button>
                        <button
                          type="button"
                          :disabled="queueActionLoading"
                          class="text-xs text-destructive hover:underline disabled:opacity-60"
                          @click="forgetFailed(job.uuid)"
                        >
                          Forget
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <details v-if="data.queue.failed_jobs.some(j => j.exception)" class="mt-2">
                <summary :class="['text-xs cursor-pointer', theme.textSecondary]">Show exception snippets</summary>
                <pre
                  v-for="job in data.queue.failed_jobs.filter(j => j.exception)"
                  :key="job.uuid"
                  class="mt-1 p-2 rounded bg-muted/80 text-[10px] overflow-auto max-h-24"
                  :class="theme.textPrimary"
                >{{ job.exception }}</pre>
              </details>
            </div>
            <p v-else-if="data.queue.driver !== 'sync'" :class="['text-xs', theme.textSecondary]">No failed jobs.</p>
          </div>
          <div v-if="sectionKey === 'php'" class="mt-4 pt-4 border-t border-border space-y-5">
            <div v-if="requiredExtensions.length">
              <dt :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">
                Required & recommended extensions
                <span class="ml-1 text-[10px] font-normal normal-case">
                  ({{ requiredExtensionsInstalled }} / {{ requiredExtensions.length }} installed)
                </span>
              </dt>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="ext in requiredExtensions"
                  :key="ext.name"
                  :title="ext.purpose + (ext.required ? ' (required)' : ' (recommended)')"
                  :class="[
                    'rounded-lg px-2.5 py-1 text-xs font-mono font-medium inline-flex items-center gap-1.5',
                    ext.installed
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : ext.required
                        ? 'bg-destructive/20 text-destructive'
                        : 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
                  ]"
                >
                  <span class="size-2 rounded-full shrink-0" :class="ext.installed ? 'bg-emerald-500' : ext.required ? 'bg-destructive' : 'bg-amber-500'" />
                  {{ ext.name }}
                </span>
              </div>
              <div class="mt-3 flex items-center gap-6 text-[10px] font-medium" :class="theme.textSecondary">
                <span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-emerald-500" /> Installed</span>
                <span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-destructive" /> Required missing</span>
                <span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-amber-500" /> Recommended missing</span>
              </div>
            </div>
            <div v-if="(data?.php?.extensions || []).length">
              <dt :class="['text-xs font-semibold uppercase tracking-wider mb-2', theme.textSecondary]">All loaded extensions ({{ data.php.extensions.length }})</dt>
              <div class="flex flex-wrap gap-2 max-h-48 overflow-auto">
                <span
                  v-for="ext in data.php.extensions"
                  :key="ext"
                  :class="['rounded-lg px-2.5 py-1 text-xs font-mono font-medium', theme.bgMuted, theme.textPrimary]"
                >
                  {{ ext }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section v-if="systemBinaries.length" class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">
            System binaries
            <span :class="['ml-2 text-xs font-normal rounded-full px-2.5 py-0.5 bg-muted/60', theme.textSecondary]">
              {{ systemBinariesInstalled }} / {{ systemBinaries.length }} installed
            </span>
          </h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Command-line tools detected on the server (e.g. PHP, ffmpeg, Redis). Green = installed, red = required but missing.</p>
          <div class="space-y-2">
            <div
              v-for="bin in systemBinaries"
              :key="bin.name"
              :class="[
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors',
                bin.installed ? 'bg-emerald-500/15 dark:bg-emerald-500/20' : bin.required ? 'bg-destructive/15 dark:bg-destructive/20' : 'bg-muted/50 dark:bg-white/5',
              ]"
            >
              <span
                class="size-2 shrink-0 rounded-full"
                :class="bin.installed ? 'bg-green-500' : bin.required ? 'bg-destructive' : 'bg-amber-500'"
              />
              <span :class="['font-mono font-medium min-w-[100px]', theme.textPrimary]">{{ bin.name }}</span>
              <span :class="['text-xs', theme.textSecondary]">{{ bin.purpose }}</span>
              <span v-if="bin.installed && bin.version" :class="['ml-auto text-xs font-mono shrink-0', theme.textSecondary]">{{ bin.version }}</span>
              <span v-else-if="!bin.installed" :class="['ml-auto text-xs shrink-0', bin.required ? 'text-destructive' : 'text-amber-600 dark:text-amber-400']">
                Not installed
              </span>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-4 text-[10px]" :class="theme.textSecondary">
            <span class="inline-flex items-center gap-1"><span class="size-1.5 rounded-full bg-green-500" /> Installed</span>
            <span class="inline-flex items-center gap-1"><span class="size-1.5 rounded-full bg-destructive" /> Required missing</span>
            <span class="inline-flex items-center gap-1"><span class="size-1.5 rounded-full bg-amber-500" /> Recommended missing</span>
          </div>
        </section>

        <section v-if="serviceConnectivity.length" class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h2 :class="['text-lg font-semibold tracking-tight', theme.textPrimary]">
              Service connectivity
              <span :class="['ml-2 text-xs font-semibold rounded-full px-2.5 py-0.5', serviceConnectivityOk === serviceConnectivity.length ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300']">
                {{ serviceConnectivityOk }} / {{ serviceConnectivity.length }} connected
              </span>
            </h2>
            <button
              type="button"
              :disabled="connectivityRetrying"
              :class="['inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors', connectivityRetrying ? 'opacity-60 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90']"
              @click="retryConnectivity"
            >
              <span v-if="connectivityRetrying" class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
              {{ connectivityRetrying ? 'Checking…' : 'Retry' }}
            </button>
          </div>
          <p :class="['text-sm mb-4', theme.textSecondary]">Live reachability and latency of Redis, database, storage, payment gateways, and other external services.</p>
          <div class="space-y-2">
            <div
              v-for="svc in serviceConnectivity"
              :key="svc.name"
              :class="[
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors',
                svc.status === 'ok' ? 'bg-emerald-500/15 dark:bg-emerald-500/20' : svc.critical ? 'bg-destructive/15 dark:bg-destructive/20' : 'bg-amber-500/15 dark:bg-amber-500/20',
              ]"
            >
              <span
                class="size-2 shrink-0 rounded-full"
                :class="svc.status === 'ok' ? 'bg-green-500' : svc.critical ? 'bg-destructive' : 'bg-amber-500'"
              />
              <span :class="['font-medium min-w-[140px]', theme.textPrimary]">{{ svc.name }}</span>
              <span v-if="svc.status === 'ok' && svc.ms != null" :class="['text-xs font-mono', theme.textSecondary]">{{ svc.ms }}ms</span>
              <span v-if="svc.status === 'error'" :class="['text-xs truncate max-w-xs', svc.critical ? 'text-destructive' : 'text-amber-600 dark:text-amber-400']">
                {{ svc.error || 'Connection failed' }}
              </span>
              <span v-if="svc.critical" :class="['ml-auto text-[10px] uppercase tracking-wider font-medium', theme.textSecondary]">Critical</span>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-4 text-[10px]" :class="theme.textSecondary">
            <span class="inline-flex items-center gap-1"><span class="size-1.5 rounded-full bg-green-500" /> Connected</span>
            <span class="inline-flex items-center gap-1"><span class="size-1.5 rounded-full bg-destructive" /> Critical failure</span>
            <span class="inline-flex items-center gap-1"><span class="size-1.5 rounded-full bg-amber-500" /> Non-critical failure</span>
          </div>
        </section>

        <section v-if="data?.ssl" class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <h2 :class="['text-lg font-semibold tracking-tight mb-1', theme.textPrimary]">SSL / HTTPS</h2>
          <p :class="['text-sm mb-4', theme.textSecondary]">Whether the app URL uses HTTPS and the current request is secure; TLS certificate validity when applicable.</p>
          <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">APP_URL is HTTPS</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.ssl.app_url_https ? 'Yes' : 'No' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Current request secure</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.ssl.current_request_secure ? 'Yes' : 'No' }}</dd>
            </div>
            <div v-if="data.ssl.cert_valid_from">
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Certificate valid from</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.ssl.cert_valid_from }}</dd>
            </div>
            <div v-if="data.ssl.cert_valid_until">
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Certificate valid until</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary, certExpiryWarning ? 'text-amber-600 dark:text-amber-400' : '']">
                {{ data.ssl.cert_valid_until }}
                <span v-if="certExpiryWarning" class="block text-xs">(expires soon)</span>
              </dd>
            </div>
          </dl>
        </section>

        <section v-if="logIssuesLoaded || logIssuesError" class="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h2 :class="['text-lg font-semibold tracking-tight', theme.textPrimary]">Recent log issues</h2>
            <Button variant="outline" size="sm" :disabled="clearingLog" class="shadow-sm" @click="showClearLogModal = true">
              {{ clearingLog ? 'Clearing…' : 'Clear log' }}
            </Button>
          </div>
          <p :class="['text-sm mb-4', theme.textSecondary]">Latest errors, warnings, and alerts parsed from the application log for quick triage.</p>
          <p v-if="data?.logging?.path" :class="['text-xs mb-2', theme.textSecondary]">Log file: <span class="font-mono">{{ data.logging.path }}</span></p>
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

    <Dialog :open="showClearLogModal" @update:open="showClearLogModal = $event">
      <DialogContent :hide-close="clearingLog">
        <DialogHeader>
          <DialogTitle>Clear log</DialogTitle>
          <DialogDescription>Clear the application log file? This cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" :disabled="clearingLog" @click="showClearLogModal = false">Cancel</Button>
          <Button variant="destructive" :disabled="clearingLog" @click="runClearLog">
            {{ clearingLog ? 'Clearing…' : 'Clear log' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog :open="showClearCacheModal" @update:open="showClearCacheModal = $event">
      <DialogContent :hide-close="clearingCache">
        <DialogHeader>
          <DialogTitle>Clear cache</DialogTitle>
          <DialogDescription>Clear the application cache? The next requests may be slightly slower until caches warm up again.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" :disabled="clearingCache" @click="showClearCacheModal = false">Cancel</Button>
          <Button :disabled="clearingCache" @click="runClearCache">
            {{ clearingCache ? 'Clearing…' : 'Clear cache' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog :open="showClearAllCacheModal" @update:open="showClearAllCacheModal = $event">
      <DialogContent :hide-close="clearingAllCache">
        <DialogHeader>
          <DialogTitle>Clear all cache & optimize</DialogTitle>
          <DialogDescription>Clear all caches (config, route, view, application cache) and run optimize. Recommended after deployment.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" :disabled="clearingAllCache" @click="showClearAllCacheModal = false">Cancel</Button>
          <Button :disabled="clearingAllCache" @click="runClearAllCacheAndOptimize">
            {{ clearingAllCache ? 'Running…' : 'Clear all & optimize' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useAdminApi } from '@/admin/api/admin'
import { Button } from '@/shared/components/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import { API_CONFIG } from '@/shared/api/config'

const theme = useThemeClasses()
const { getSystem, getSystemConnectivity, getQueueFailed, retryFailedJob, retryAllFailedJobs, forgetFailedJob, flushFailedJobs, clearCache, clearAllCacheAndOptimize, clearLog, getLogsRecent } = useAdminApi()

const data = ref(null)
const loading = ref(true)
const error = ref(null)
const clearingCache = ref(false)
const clearingLog = ref(false)
const clearingAllCache = ref(false)
const showClearLogModal = ref(false)
const showClearCacheModal = ref(false)
const showClearAllCacheModal = ref(false)
const refreshing = ref(false)
const connectivityRetrying = ref(false)
const queueActionLoading = ref(false)
const logIssues = ref({ errors: [], warnings: [], alerts: [] })
const logIssuesLoaded = ref(false)
const logIssuesError = ref(null)

const requiredExtensions = computed(() => {
  const exts = data.value?.php?.required_extensions || []
  return [...exts].sort((a, b) => {
    if (a.installed !== b.installed) return a.installed ? 1 : -1
    if (a.required !== b.required) return a.required ? -1 : 1
    return a.name.localeCompare(b.name)
  })
})

const requiredExtensionsInstalled = computed(() =>
  requiredExtensions.value.filter(e => e.installed).length
)

const systemBinaries = computed(() => {
  const bins = data.value?.system_binaries || []
  return [...bins].sort((a, b) => {
    if (a.installed !== b.installed) return a.installed ? 1 : -1
    if (a.required !== b.required) return a.required ? -1 : 1
    return a.name.localeCompare(b.name)
  })
})

const systemBinariesInstalled = computed(() =>
  systemBinaries.value.filter(b => b.installed).length
)

const serviceConnectivity = computed(() => {
  const svcs = data.value?.service_connectivity || []
  return [...svcs].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'error' ? -1 : 1
    if (a.critical !== b.critical) return a.critical ? -1 : 1
    return a.name.localeCompare(b.name)
  })
})

const serviceConnectivityOk = computed(() =>
  serviceConnectivity.value.filter(s => s.status === 'ok').length
)

const workerHeartbeatStale = computed(() => {
  const at = data.value?.worker_heartbeat_at
  if (!at) return false
  try {
    const d = new Date(at)
    return (Date.now() - d) / 1000 > 150
  } catch {
    return false
  }
})

const certExpiryWarning = computed(() => {
  const until = data.value?.ssl?.cert_valid_until
  if (!until) return false
  try {
    const expiry = new Date(until)
    const days = (expiry - Date.now()) / (1000 * 60 * 60 * 24)
    return days > 0 && days < 30
  } catch {
    return false
  }
})

const telescopeUrl = computed(() => {
  try {
    const base = API_CONFIG.API_BASE_URL || ''
    const url = base.replace(/\/api\/?$/, '')
    return `${url}/telescope`
  } catch {
    return '/telescope'
  }
})

async function runClearCache() {
  clearingCache.value = true
  try {
    await clearCache()
    showClearCacheModal.value = false
  } catch (e) {
    window.alert(e?.message ?? 'Failed to clear cache')
  } finally {
    clearingCache.value = false
  }
}

async function runClearLog() {
  clearingLog.value = true
  try {
    await clearLog()
    data.value = await getSystem()
    await loadLogIssues()
    showClearLogModal.value = false
  } catch (e) {
    window.alert(e?.message ?? 'Failed to clear log')
  } finally {
    clearingLog.value = false
  }
}

async function runClearAllCacheAndOptimize() {
  clearingAllCache.value = true
  try {
    await clearAllCacheAndOptimize()
    data.value = await getSystem()
    showClearAllCacheModal.value = false
  } catch (e) {
    window.alert(e?.message ?? 'Failed to clear all cache and optimize')
  } finally {
    clearingAllCache.value = false
  }
}

const sectionDescriptions = {
  application: 'App name, environment, debug mode, URL, timezone, locale, and Laravel version.',
  php: 'PHP version, OS, limits, and extensions (required/recommended vs installed, plus full list).',
  database: 'Default database driver and connection details.',
  cache: 'Cache driver and whether it is responding.',
  queue: 'Queue driver, current size, and failed jobs count.',
  session: 'Session driver and lifetime.',
  filesystem: 'Default disk and available storage disks.',
  opcache: 'PHP OPcache status, memory usage, and hit rate.',
  server: 'Hostname, IP, uptime, system memory, CPU cores, and request origin.',
  php_security: 'PHP security settings: disabled functions and allow_url_fopen.',
  disk: 'Disk space for the storage path (total, free, used %).',
  load: 'System load averages (1, 5, 15 minutes).',
  config: 'Whether config and routes are cached (recommended in production).',
  env: 'Key environment drivers (cache, queue, session, DB).',
  logging: 'Log channel, file path, size, and last modified.',
  tools: 'App version and Telescope availability.',
  scheduler: 'Last time the Laravel scheduler ran.',
  quick_links: 'Shortcuts to external admin tools.',
  feature_flags: 'Enabled feature flags and how many users have each.',
  feature_flag_usage: 'Usage counts per feature flag.',
  failed_logins: 'Recent failed login attempts (identifier, IP, time).',
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
  if (d.server) {
    const s = { ...d.server }
    if (s.memory_total_mb != null) s.memory_total_mb = `${s.memory_total_mb} MB`
    if (s.memory_available_mb != null) s.memory_available_mb = `${s.memory_available_mb} MB`
    if (s.memory_used_mb != null) s.memory_used_mb = `${s.memory_used_mb} MB`
    if (s.uptime_seconds != null && s.uptime_human) delete s.uptime_seconds
    out.server = s
  }
  if (d.php_security) out.php_security = d.php_security
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
  if (d.feature_flag_usage && typeof d.feature_flag_usage === 'object') out.feature_flag_usage = d.feature_flag_usage
  if (Array.isArray(d.failed_logins) && d.failed_logins.length > 0) out.failed_logins = d.failed_logins
  return out
})

function sectionRows(sectionKey, section) {
  if (sectionKey === 'php') {
    const { extensions, required_extensions, ...rest } = section
    return rest
  }
  if (sectionKey === 'queue' && section && typeof section === 'object') {
    const { failed_jobs, recent_processed_jobs, ...rest } = section
    return rest
  }
  if (sectionKey === 'php_security' && section.disable_functions_sample) {
    const { disable_functions_sample, ...rest } = section
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

function formatSchedulerAgo(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    const s = Math.round((Date.now() - d) / 1000)
    if (s < 60) return s + 's ago'
    if (s < 3600) return Math.floor(s / 60) + 'm ago'
    return Math.floor(s / 3600) + 'h ago'
  } catch {
    return iso
  }
}

async function refresh() {
  refreshing.value = true
  try {
    data.value = await getSystem()
    logIssuesLoaded.value = false
    await loadLogIssues()
  } catch (e) {
    error.value = e?.message ?? 'Failed to refresh'
  } finally {
    refreshing.value = false
  }
}

async function retryConnectivity() {
  connectivityRetrying.value = true
  try {
    const res = await getSystemConnectivity()
    if (data.value && res?.service_connectivity) {
      data.value = { ...data.value, service_connectivity: res.service_connectivity }
    }
  } catch (e) {
    error.value = e?.message ?? 'Failed to retry connectivity'
  } finally {
    connectivityRetrying.value = false
  }
}

async function retryOneFailed(uuid) {
  queueActionLoading.value = true
  try {
    await retryFailedJob(uuid)
    await refreshQueueData()
  } catch (e) {
    error.value = e?.message ?? 'Retry failed'
  } finally {
    queueActionLoading.value = false
  }
}

async function retryAllFailed() {
  queueActionLoading.value = true
  try {
    await retryAllFailedJobs()
    await refreshQueueData()
  } catch (e) {
    error.value = e?.message ?? 'Retry all failed'
  } finally {
    queueActionLoading.value = false
  }
}

async function forgetFailed(uuid) {
  queueActionLoading.value = true
  try {
    await forgetFailedJob(uuid)
    await refreshQueueData()
  } catch (e) {
    error.value = e?.message ?? 'Forget failed'
  } finally {
    queueActionLoading.value = false
  }
}

async function flushFailed() {
  if (!window.confirm('Remove all failed jobs? This cannot be undone.')) return
  queueActionLoading.value = true
  try {
    await flushFailedJobs()
    await refreshQueueData()
  } catch (e) {
    error.value = e?.message ?? 'Flush failed'
  } finally {
    queueActionLoading.value = false
  }
}

async function refreshQueueData() {
  try {
    const res = await getSystem()
    if (data.value && res) data.value = res
  } catch {
    // keep current data
  }
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
