<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0 bg-gradient-to-b from-background to-muted/20']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-10">
      <header class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm px-6 py-5 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div>
          <h1 :class="['text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent', theme.textPrimary]">System details</h1>
          <p :class="['mt-1.5 text-sm', theme.textSecondary]">Server, environment, extensions, binaries, and configuration.</p>
        </div>
        <div v-if="data" class="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" :disabled="refreshing" class="shadow-sm border-primary/30 hover:bg-primary/10" @click="refresh">
            {{ refreshing ? 'Refreshing…' : 'Refresh' }}
          </Button>
          <a
            v-if="data.telescope_enabled"
            :href="telescopeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            Open Telescope
          </a>
          <Button variant="outline" size="sm" :disabled="clearingCache" class="shadow-sm" @click="showClearCacheModal = true">
            {{ clearingCache ? 'Clearing…' : 'Clear cache' }}
          </Button>
          <Button variant="outline" size="sm" :disabled="clearingAllCache" class="shadow-sm" @click="showClearAllCacheModal = true">
            {{ clearingAllCache ? 'Running…' : 'Clear all cache & optimize' }}
          </Button>
          <Button variant="outline" size="sm" :disabled="!data || exportLoading" class="shadow-sm border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10" @click="exportReport">
            {{ exportLoading ? 'Exporting…' : 'Download report' }}
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
        <!-- Overview & health -->
        <div class="rounded-2xl overflow-hidden border border-violet-200/50 dark:border-violet-500/20 bg-card shadow-lg shadow-violet-500/5 dark:shadow-black/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-violet-500/10">
          <div class="px-6 py-4 bg-gradient-to-r from-violet-500/20 via-indigo-500/15 to-transparent border-b border-violet-200/50 dark:border-violet-500/20">
            <h2 class="text-lg font-semibold text-violet-700 dark:text-violet-300">Overview & health</h2>
            <p class="text-sm text-muted-foreground mt-0.5">Status, alerts and queue</p>
          </div>
          <div class="p-6 space-y-4">
            <p v-if="data?.scheduler_stale_seconds != null && data.scheduler_stale_seconds > 900" class="rounded-xl border-l-4 border-amber-500 bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm font-medium text-amber-800 dark:text-amber-200">
              Scheduler may not be running (last run {{ data.scheduler_last_run ? formatSchedulerAgo(data.scheduler_last_run) : 'unknown' }}).
            </p>
            <p v-if="data?.worker_heartbeat_at != null" :class="['rounded-xl border-l-4 px-4 py-3 text-sm font-medium', theme.textPrimary, workerHeartbeatStale ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-200' : 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20']">
              Queue workers: last heartbeat {{ formatSchedulerAgo(data.worker_heartbeat_at) }}.
            </p>
            <p v-else-if="data && data.queue?.driver !== 'sync'" class="rounded-xl border-l-4 border-amber-500 bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm font-medium text-amber-800 dark:text-amber-200">
              No queue worker heartbeat. Ensure <code class="font-mono text-xs rounded bg-black/10 dark:bg-white/10 px-1 py-0.5">php artisan queue:work</code> is running and scheduler runs every minute.
            </p>
            <p v-if="data?.env_hint" :class="['text-sm font-medium rounded-xl border border-border bg-muted/50 dark:bg-white/5 px-4 py-3', theme.textPrimary]">
              {{ data.env_hint }}
            </p>
            <section v-if="data?.system_health" class="rounded-xl border-l-4 border-violet-500/50 border border-border bg-muted/30 p-5 transition-colors duration-200">
              <h3 :class="['text-base font-semibold mb-3', theme.textPrimary]">System health</h3>
              <div class="flex flex-wrap items-center gap-4">
                <span
                  :class="['rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm', data.system_health.scheduled_task_status === 'ok' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20' : data.system_health.scheduled_task_status === 'failed' ? 'bg-destructive/20 text-destructive ring-1 ring-destructive/20' : 'bg-muted text-muted-foreground']"
                >
                  Scheduled task {{ data.system_health.scheduled_task_status }}
                </span>
                <span
                  :class="['rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm', data.system_health.queue_status === 'ok' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20' : data.system_health.queue_status === 'failed' ? 'bg-destructive/20 text-destructive ring-1 ring-destructive/20' : 'bg-muted text-muted-foreground']"
                >
                  Queue {{ data.system_health.queue_status }}
                </span>
                <Button
                  v-if="data.queue?.driver !== 'sync'"
                  variant="outline"
                  size="sm"
                  :disabled="restartQueueLoading"
                  class="shadow-sm"
                  @click="runRestartQueue"
                >
                  {{ restartQueueLoading ? 'Restarting…' : 'Restart queue' }}
                </Button>
              </div>
            </section>
          </div>
        </div>

        <!-- Webhooks -->
        <div class="rounded-2xl overflow-hidden border border-amber-200/50 dark:border-amber-500/20 bg-card shadow-lg shadow-amber-500/5 dark:shadow-black/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-amber-500/10">
          <div class="px-6 py-4 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border-b border-amber-200/50 dark:border-amber-500/20">
            <h2 class="text-lg font-semibold text-amber-700 dark:text-amber-300">Webhooks</h2>
            <p class="text-sm text-muted-foreground mt-0.5">Payment provider webhook events and status</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <select
                v-model="webhookProviderFilter"
                :class="['rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm', theme.textPrimary]"
                aria-label="Filter by provider"
                @change="fetchWebhooks"
              >
                <option value="">All providers</option>
                <option value="stripe">Stripe</option>
                <option value="paystack">Paystack</option>
                <option value="paypal">PayPal</option>
                <option value="flutterwave">Flutterwave</option>
              </select>
              <select
                v-model="webhookStatusFilter"
                :class="['rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm', theme.textPrimary]"
                aria-label="Filter by status"
                @change="fetchWebhooks"
              >
                <option value="">All statuses</option>
                <option value="processed">Processed</option>
                <option value="failed">Failed</option>
                <option value="received">Received</option>
              </select>
              <Button variant="outline" size="sm" :disabled="webhooksLoading" @click="fetchWebhooks">
                {{ webhooksLoading ? 'Loading…' : 'Refresh' }}
              </Button>
            </div>
            <div class="overflow-x-auto rounded-xl border border-border">
              <table class="w-full text-sm" aria-label="Webhook events">
                <thead>
                  <tr :class="['border-b border-border', theme.textSecondary]">
                    <th class="text-left py-3 px-3 font-medium">Time</th>
                    <th class="text-left py-3 px-3 font-medium">Provider</th>
                    <th class="text-left py-3 px-3 font-medium">Event</th>
                    <th class="text-left py-3 px-3 font-medium">Status</th>
                    <th class="text-left py-3 px-3 font-medium">Response</th>
                    <th class="text-left py-3 px-3 font-medium max-w-[200px]">Error</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="webhooksLoading && !webhooks.length" class="border-b border-border">
                    <td colspan="6" class="py-8 text-center text-muted-foreground">Loading…</td>
                  </tr>
                  <tr v-else-if="!webhooks.length" class="border-b border-border">
                    <td colspan="6" class="py-8 text-center text-muted-foreground">No webhook events yet.</td>
                  </tr>
                  <tr
                    v-for="w in webhooks"
                    :key="w.id"
                    class="border-b border-border last:border-b-0"
                  >
                    <td :class="['py-2.5 px-3 font-mono text-xs whitespace-nowrap', theme.textSecondary]">{{ formatWebhookDate(w.created_at) }}</td>
                    <td :class="['py-2.5 px-3 capitalize', theme.textPrimary]">{{ w.provider }}</td>
                    <td :class="['py-2.5 px-3 font-mono text-xs truncate max-w-[180px]', theme.textPrimary]" :title="w.event_type || w.event_id || ''">{{ w.event_type || '—' }}</td>
                    <td class="py-2.5 px-3">
                      <span
                        :class="[
                          'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                          w.status === 'processed' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : w.status === 'failed' ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground',
                        ]"
                      >
                        {{ w.status }}
                      </span>
                    </td>
                    <td :class="['py-2.5 px-3 font-mono text-xs', theme.textPrimary]">{{ w.response_code ?? '—' }}</td>
                    <td :class="['py-2.5 px-3 text-xs truncate max-w-[200px]', w.error_message ? 'text-destructive' : theme.textSecondary]" :title="w.error_message || ''">{{ w.error_message || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-if="webhooksMeta" class="text-xs text-muted-foreground">
              Page {{ webhooksMeta.current_page }} of {{ webhooksMeta.last_page }} ({{ webhooksMeta.total }} total)
            </p>
          </div>
        </div>

        <!-- Client & deploy -->
        <div class="rounded-2xl overflow-hidden border border-sky-200/50 dark:border-sky-500/20 bg-card shadow-lg shadow-sky-500/5 dark:shadow-black/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-sky-500/10">
          <div class="px-6 py-4 bg-gradient-to-r from-sky-500/20 via-cyan-500/15 to-transparent border-b border-sky-200/50 dark:border-sky-500/20">
            <h2 class="text-lg font-semibold text-sky-700 dark:text-sky-300">Client & deploy</h2>
            <p class="text-sm text-muted-foreground mt-0.5">Browser, git, dependencies, storage and maintenance</p>
          </div>
          <div class="p-6 space-y-6">
        <section v-if="clientInfo" class="rounded-xl border-l-4 border-sky-500/50 border border-border bg-muted/30 p-5 transition-colors duration-200">
          <h3 :class="['text-base font-semibold mb-1', theme.textPrimary]">Client information</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">Browser, screen, and connection.</p>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Browser</p>
              <dl class="space-y-1.5 text-sm">
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Name</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.browser?.name ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Platform</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.browser?.platform ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Language</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.browser?.language ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Online</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.browser?.online ? 'YES' : 'NO' }}</dd>
                </div>
              </dl>
            </div>
            <div>
              <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Screen</p>
              <dl class="space-y-1.5 text-sm">
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Resolution</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.screen?.resolution ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Available</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.screen?.available ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Color depth</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.screen?.colorDepth ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Pixel depth</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.screen?.pixelDepth ?? '—' }}</dd>
                </div>
              </dl>
            </div>
            <div>
              <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Network</p>
              <dl class="space-y-1.5 text-sm">
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Connection type</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.network?.connectionType ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Downlink</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.network?.downlink ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">RTT</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.network?.rtt ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Save data</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.network?.saveData ? 'ENABLED' : 'DISABLED' }}</dd>
                </div>
              </dl>
            </div>
            <div>
              <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Performance</p>
              <dl class="space-y-1.5 text-sm">
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Used heap</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.performance?.usedHeap ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Total heap</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.performance?.totalHeap ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-2">
                  <dt :class="theme.textSecondary">Heap limit</dt>
                  <dd :class="['font-mono', theme.textPrimary]">{{ clientInfo.performance?.heapLimit ?? '—' }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section v-if="data?.git_info && (data.git_info.branch || data.git_info.commit)" class="rounded-xl border-l-4 border-sky-500/50 border border-border bg-muted/30 p-5 transition-colors duration-200">
          <h3 :class="['text-base font-semibold mb-1', theme.textPrimary]">Git / Deploy</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">Branch, commit, and working tree status.</p>
          <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Branch</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.git_info.branch ?? '—' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Commit</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.git_info.short_commit ?? data.git_info.commit ?? '—' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Dirty</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.git_info.dirty ? 'Yes' : 'No' }}</dd>
            </div>
            <div v-if="data.git_info.last_commit_date">
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Last commit</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.git_info.last_commit_date }}</dd>
            </div>
          </dl>
        </section>

        <section v-if="data?.dependency_audit" class="rounded-xl border-l-4 border-sky-500/50 border border-border bg-muted/30 p-5 transition-colors duration-200">
          <h3 :class="['text-base font-semibold mb-1', theme.textPrimary]">Dependency security</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">Known vulnerabilities from composer audit and npm audit.</p>
          <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Composer</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">
                <span :class="(data.dependency_audit.composer_vulnerabilities ?? 0) > 0 ? 'text-destructive font-semibold' : ''">
                  {{ data.dependency_audit.composer_vulnerabilities ?? '—' }} vulnerability(ies)
                </span>
              </dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">NPM</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">
                <span :class="(data.dependency_audit.npm_vulnerabilities ?? 0) > 0 ? 'text-destructive font-semibold' : ''">
                  {{ data.dependency_audit.npm_vulnerabilities ?? '—' }} vulnerability(ies)
                </span>
              </dd>
            </div>
          </dl>
          <p v-if="data.dependency_audit.error" :class="['text-xs mt-2', theme.textSecondary]">{{ data.dependency_audit.error }}</p>
        </section>

        <section v-if="data?.storage_breakdown && Object.keys(data.storage_breakdown).length" class="rounded-xl border-l-4 border-sky-500/50 border border-border bg-muted/30 p-5 transition-colors duration-200">
          <h3 :class="['text-base font-semibold mb-1', theme.textPrimary]">Storage breakdown</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">Size of storage paths (app, logs, framework).</p>
          <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="(item, key) in data.storage_breakdown" :key="key" class="flex flex-col">
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">{{ String(key).replace('_', ' ') }}</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ item.formatted }}</dd>
              <dd :class="['text-[10px] font-mono truncate mt-0.5', theme.textSecondary]" :title="item.path">{{ item.path }}</dd>
            </div>
          </dl>
        </section>

        <section v-if="data?.scheduled_commands?.length" class="rounded-xl border-l-4 border-sky-500/50 border border-border bg-muted/30 p-5 transition-colors duration-200">
          <h3 :class="['text-base font-semibold mb-1', theme.textPrimary]">Scheduled commands</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">Laravel scheduler entries and next run.</p>
          <div class="overflow-auto rounded-lg border border-border">
            <table class="w-full text-sm">
              <thead :class="['text-left text-xs uppercase', theme.textSecondary, theme.bgMuted]">
                <tr>
                  <th class="px-3 py-2 font-medium">Expression</th>
                  <th class="px-3 py-2 font-medium">Command</th>
                  <th class="px-3 py-2 font-medium">Next due</th>
                </tr>
              </thead>
              <tbody :class="theme.textPrimary">
                <tr v-for="(cmd, i) in data.scheduled_commands" :key="i" class="border-t border-border hover:bg-muted/40 transition-colors duration-150">
                  <td class="px-3 py-2 font-mono text-xs">{{ cmd.expression }}</td>
                  <td class="px-3 py-2 font-mono text-xs">{{ cmd.command }}</td>
                  <td class="px-3 py-2 text-xs font-medium tabular-nums text-sky-600 dark:text-sky-400" :class="theme.textSecondary">{{ formatCountdown(nextDueTargets[i]) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-if="data?.last_backup || data?.active_sessions_count != null" class="rounded-xl border-l-4 border-sky-500/50 border border-border bg-muted/30 p-5 transition-colors duration-200">
          <h3 :class="['text-base font-semibold mb-1', theme.textPrimary]">Maintenance</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">Last backup and active sessions.</p>
          <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div v-if="data.last_backup">
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Last backup</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.last_backup.last_run }}</dd>
            </div>
            <div v-if="data.active_sessions_count != null">
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Active sessions</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.active_sessions_count }}</dd>
            </div>
          </dl>
        </section>

          </div>
        </div>

        <!-- Performance -->
        <div class="rounded-2xl overflow-hidden border border-amber-200/50 dark:border-amber-500/20 bg-card shadow-lg shadow-amber-500/5 dark:shadow-black/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-amber-500/10">
          <div class="px-6 py-4 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border-b border-amber-200/50 dark:border-amber-500/20">
            <h2 class="text-lg font-semibold text-amber-700 dark:text-amber-300">Performance</h2>
            <p class="text-sm text-muted-foreground mt-0.5">Slow requests and recommendations</p>
          </div>
          <div class="p-6">
        <section v-if="data?.performance" class="rounded-xl border-l-4 border-amber-500/50 border border-border bg-muted/30 p-5 transition-colors duration-200">
          <h3 :class="['text-base font-semibold mb-1', theme.textPrimary]">Performance</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">
            Slow requests (over {{ data.performance.threshold_ms }} ms) and recommendations to fix them. Set <span class="font-mono text-xs">SLOW_REQUEST_THRESHOLD_MS</span> in .env to change the threshold.
          </p>

          <div v-if="(data.performance.recommendations || []).length" class="mb-6">
            <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Recommendations</p>
            <ul class="space-y-3">
              <li
                v-for="(rec, i) in data.performance.recommendations"
                :key="i"
                :class="['rounded-xl border p-4', rec.severity === 'critical' ? 'border-destructive bg-destructive/10' : rec.severity === 'high' ? 'border-amber-500 bg-amber-500/10' : 'border-border bg-muted/30']"
              >
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <span :class="['font-mono text-xs font-semibold', theme.textPrimary]">{{ rec.route }}</span>
                  <span
                    :class="['rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase', rec.severity === 'critical' ? 'bg-destructive/20 text-destructive' : rec.severity === 'high' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-muted text-muted-foreground']"
                  >
                    {{ rec.severity }}
                  </span>
                </div>
                <p :class="['text-sm mb-2', theme.textPrimary]">{{ rec.message }}</p>
                <p :class="['text-xs', theme.textSecondary]"><strong>Fix:</strong> {{ rec.fix }}</p>
              </li>
            </ul>
          </div>

          <div v-if="(data.performance.slow_requests || []).length" class="mb-6">
            <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Recent slow requests (last 50)</p>
            <div class="overflow-auto max-h-64 rounded-lg border border-border">
              <table class="w-full text-sm">
                <thead :class="['text-left text-xs uppercase', theme.textSecondary, theme.bgMuted]">
                  <tr>
                    <th class="px-3 py-2 font-medium">Route</th>
                    <th class="px-3 py-2 font-medium">Method</th>
                    <th class="px-3 py-2 font-medium text-right">Duration (ms)</th>
                    <th class="px-3 py-2 font-medium text-right">Memory (MB)</th>
                    <th class="px-3 py-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody :class="theme.textPrimary">
                  <tr v-for="(req, i) in data.performance.slow_requests" :key="i" class="border-t border-border hover:bg-muted/40 transition-colors duration-150">
                    <td class="px-3 py-2 font-mono text-xs max-w-[200px] truncate tabular-nums" :title="req.route">{{ req.route }}</td>
                    <td class="px-3 py-2 text-xs">{{ req.method }}</td>
                    <td class="px-3 py-2 text-xs text-right font-mono font-semibold tabular-nums text-amber-600 dark:text-amber-400">{{ req.duration_ms }}</td>
                    <td class="px-3 py-2 text-xs text-right tabular-nums">{{ req.memory_mb }}</td>
                    <td class="px-3 py-2 text-xs whitespace-nowrap tabular-nums" :class="theme.textSecondary">{{ req.time }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="data.performance.aggregated_by_route && Object.keys(data.performance.aggregated_by_route).length">
            <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Aggregated by route</p>
            <div class="overflow-auto max-h-64 rounded-lg border border-border">
              <table class="w-full text-sm">
                <thead :class="['text-left text-xs uppercase', theme.textSecondary, theme.bgMuted]">
                  <tr>
                    <th class="px-3 py-2 font-medium">Route</th>
                    <th class="px-3 py-2 font-medium text-right">Count</th>
                    <th class="px-3 py-2 font-medium text-right">Avg (ms)</th>
                    <th class="px-3 py-2 font-medium text-right">Max (ms)</th>
                  </tr>
                </thead>
                <tbody :class="theme.textPrimary">
                  <tr v-for="(stats, route) in data.performance.aggregated_by_route" :key="route" class="border-t border-border hover:bg-muted/40 transition-colors duration-150">
                    <td class="px-3 py-2 font-mono text-xs max-w-[200px] truncate" :title="route">{{ route }}</td>
                    <td class="px-3 py-2 text-xs text-right tabular-nums">{{ stats.count }}</td>
                    <td class="px-3 py-2 text-xs text-right font-mono tabular-nums text-amber-600 dark:text-amber-400">{{ stats.avg_ms }}</td>
                    <td class="px-3 py-2 text-xs text-right font-mono tabular-nums font-semibold">{{ stats.max_ms }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p v-if="!(data.performance.slow_requests?.length) && !(data.performance.recommendations?.length)" :class="['text-sm', theme.textSecondary]">
            No slow requests recorded yet. Requests over {{ data.performance.threshold_ms }} ms will appear here.
          </p>
        </section>
          </div>
        </div>

        <!-- Security -->
        <div class="rounded-2xl overflow-hidden border border-rose-200/50 dark:border-rose-500/20 bg-card shadow-lg shadow-rose-500/5 dark:shadow-black/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-rose-500/10">
          <div class="px-6 py-4 bg-gradient-to-r from-rose-500/20 via-pink-500/15 to-transparent border-b border-rose-200/50 dark:border-rose-500/20">
            <h2 class="text-lg font-semibold text-rose-700 dark:text-rose-300">Security</h2>
            <p class="text-sm text-muted-foreground mt-0.5">Auth, rate limiting, CORS and headers</p>
          </div>
          <div class="p-6">
        <section v-if="data?.security" class="rounded-xl border-l-4 border-rose-500/50 border border-border bg-muted/30 p-5 transition-colors duration-200">
          <h3 :class="['text-base font-semibold mb-4', theme.textPrimary]">Security</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">Auth, rate limiting, CORS, and headers.</p>

          <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Auth guard</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.security.auth?.default_guard ?? '—' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Sanctum</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.security.auth?.sanctum_enabled ? 'Enabled' : 'Disabled' }}</dd>
            </div>
            <div v-if="data.security.auth?.sanctum_guard?.length">
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Sanctum guard</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.security.auth.sanctum_guard.join(', ') }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Rate limiting</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.security.rate_limiting?.enabled ? 'Enabled' : 'Disabled' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Default limit</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.security.rate_limiting?.default_per_minute ?? '—' }} requests per minute</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Supports credentials</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.security.cors?.supports_credentials ? 'Yes' : 'No' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">CSP</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.security.csp_enabled ? 'Enabled' : 'Disabled' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">HSTS</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.security.hsts_enabled ? 'Enabled' : 'Disabled' }}</dd>
            </div>
          </dl>

          <div v-if="(data.security.cors?.allowed_origins?.length || 0) > 0" class="pt-4 border-t border-border">
            <dt :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Allowed origins</dt>
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="(origin, i) in data.security.cors.allowed_origins"
                :key="i"
                :class="['rounded-lg px-2.5 py-1 text-xs font-mono', theme.bgMuted, theme.textPrimary]"
              >
                {{ origin }}
              </li>
            </ul>
          </div>
          <div v-if="(data.security.cors?.paths?.length || 0) > 0" class="pt-3">
            <dt :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">CORS paths</dt>
            <p :class="['text-sm font-mono', theme.textPrimary]">{{ data.security.cors.paths.join(', ') }}</p>
          </div>
        </section>
          </div>
        </div>

        <!-- Application, server & config -->
        <div class="rounded-2xl overflow-hidden border border-emerald-200/50 dark:border-emerald-500/20 bg-card shadow-lg shadow-emerald-500/5 dark:shadow-black/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
          <div class="px-6 py-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent border-b border-emerald-200/50 dark:border-emerald-500/20">
            <h2 class="text-lg font-semibold text-emerald-700 dark:text-emerald-300">Application, server & config</h2>
            <p class="text-sm text-muted-foreground mt-0.5">PHP, server, disk, load, config and binaries</p>
          </div>
          <div class="p-6 space-y-6">
        <section v-for="(section, sectionKey) in sections" :key="sectionKey" class="rounded-xl border-l-4 border-emerald-500/50 border border-border bg-muted/30 p-5 transition-colors duration-200">
          <h3 :class="['text-base font-semibold mb-1 capitalize', theme.textPrimary]">{{ String(sectionKey).replace(/_/g, ' ') }}</h3>
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
          <div v-if="sectionKey === 'database_metrics' && (data?.database_metrics?.largest_tables?.length || 0) > 0" class="mt-4 pt-4 border-t border-border">
            <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Largest tables</p>
            <div class="overflow-auto rounded-lg border border-border">
              <table class="w-full text-sm">
                <thead :class="['text-left text-xs uppercase', theme.textSecondary, theme.bgMuted]">
                  <tr>
                    <th class="px-3 py-2 font-medium">Table</th>
                    <th class="px-3 py-2 font-medium text-right">Size (MB)</th>
                  </tr>
                </thead>
                <tbody :class="theme.textPrimary">
                  <tr v-for="t in data.database_metrics.largest_tables" :key="t.name" class="border-t border-border">
                    <td class="px-3 py-2 font-mono text-xs">{{ t.name }}</td>
                    <td class="px-3 py-2 text-xs text-right font-mono">{{ t.size_mb }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

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

        <section v-if="(data?.composer_dependencies || []).length" class="rounded-xl border border-border bg-muted/30 p-5">
          <h3 :class="['text-base font-semibold mb-4', theme.textPrimary]">Dependencies (Composer)</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">Installed and required versions for Composer packages.</p>
          <div class="overflow-auto max-h-80 rounded-lg border border-border">
            <table class="w-full text-sm">
              <thead :class="['text-left text-xs uppercase', theme.textSecondary, theme.bgMuted]">
                <tr>
                  <th class="px-3 py-2 font-medium">Package</th>
                  <th class="px-3 py-2 font-medium">Installed</th>
                  <th class="px-3 py-2 font-medium">Required</th>
                </tr>
              </thead>
              <tbody :class="theme.textPrimary">
                <tr v-for="pkg in data.composer_dependencies" :key="pkg.name" class="border-t border-border">
                  <td class="px-3 py-2 font-mono text-xs">{{ pkg.name }}</td>
                  <td class="px-3 py-2 text-xs">{{ pkg.installed_version }}</td>
                  <td class="px-3 py-2 text-xs">{{ pkg.required_version }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
          </div>
        </div>

        <!-- Configuration & connectivity -->
        <div class="rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-500/20 bg-card shadow-lg shadow-slate-500/5 dark:shadow-black/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-500/10">
          <div class="px-6 py-4 bg-gradient-to-r from-slate-500/20 via-zinc-500/15 to-transparent border-b border-slate-200/50 dark:border-slate-500/20">
            <h2 class="text-lg font-semibold text-slate-700 dark:text-slate-300">Configuration & connectivity</h2>
            <p class="text-sm text-muted-foreground mt-0.5">Env vars, binaries, services, SSL, mail, routes and logs</p>
          </div>
          <div class="p-6 space-y-6">
        <section v-if="data?.env_vars && Object.keys(data.env_vars).length" class="rounded-xl border-l-4 border-slate-500/50 border border-border bg-muted/30 p-5 transition-colors duration-200">
          <h3 :class="['text-base font-semibold mb-4', theme.textPrimary]">Env vars</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">Environment variables (sensitive values masked).</p>
          <div class="overflow-auto max-h-80 rounded-lg border border-border">
            <dl class="divide-y divide-border px-3 py-2">
              <div v-for="(val, key) in data.env_vars" :key="key" class="flex gap-4 py-2 text-sm">
                <dt :class="['font-mono text-xs shrink-0 w-48', theme.textSecondary]">{{ key }}</dt>
                <dd :class="['font-mono text-xs break-all min-w-0', theme.textPrimary]">{{ val }}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section v-if="systemBinaries.length" class="rounded-xl border border-border bg-muted/30 p-5">
          <h3 :class="['text-base font-semibold tracking-tight mb-1', theme.textPrimary]">
            System binaries
            <span :class="['ml-2 text-xs font-normal rounded-full px-2.5 py-0.5 bg-muted/60', theme.textSecondary]">
              {{ systemBinariesInstalled }} / {{ systemBinaries.length }} installed
            </span>
          </h3>
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

        <section v-if="serviceConnectivity.length" class="rounded-xl border border-border bg-muted/30 p-5">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h3 :class="['text-base font-semibold tracking-tight', theme.textPrimary]">
              Service connectivity
              <span :class="['ml-2 text-xs font-semibold rounded-full px-2.5 py-0.5', serviceConnectivityOk === serviceConnectivity.length ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300']">
                {{ serviceConnectivityOk }} / {{ serviceConnectivity.length }} connected
              </span>
            </h3>
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

        <section v-if="data?.ssl" class="rounded-xl border border-border bg-muted/30 p-5">
          <h3 :class="['text-base font-semibold mb-1', theme.textPrimary]">SSL / HTTPS</h3>
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

        <section v-if="data?.mail_statistics" class="rounded-xl border border-border bg-muted/30 p-5">
          <h3 :class="['text-base font-semibold mb-1', theme.textPrimary]">Mail statistics</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">Mail driver and delivery logs.</p>
          <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Mail driver</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.mail_statistics.mail_driver ?? '—' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Mail host</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.mail_statistics.mail_host ?? 'N/A' }}</dd>
            </div>
          </dl>
        </section>

        <section v-if="data?.route_statistics" class="rounded-xl border border-border bg-muted/30 p-5">
          <h3 :class="['text-base font-semibold mb-1', theme.textPrimary]">Route statistics</h3>
          <p :class="['text-sm mb-4', theme.textSecondary]">API and web routes by method.</p>
          <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Total routes</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.route_statistics.total_routes ?? 0 }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">API routes</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.route_statistics.api_routes ?? 0 }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Web routes</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.route_statistics.web_routes ?? 0 }}</dd>
            </div>
          </dl>
          <div class="pt-4 border-t border-border">
            <p :class="['text-xs font-medium uppercase tracking-wider mb-3', theme.textSecondary]">By method</p>
            <dl class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <div v-for="(count, method) in data.route_statistics.by_method" :key="method" class="flex justify-between items-baseline gap-2">
                <dt :class="['text-xs font-medium', theme.textSecondary]">{{ method }}</dt>
                <dd :class="['text-sm font-mono', theme.textPrimary]">{{ count }}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section v-if="data?.logging || logIssuesLoaded || logIssuesError" class="rounded-xl border border-border bg-muted/30 p-5">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h3 :class="['text-base font-semibold tracking-tight', theme.textPrimary]">Log files</h3>
            <Button variant="outline" size="sm" :disabled="clearingLog" class="shadow-sm" @click="showClearLogModal = true">
              {{ clearingLog ? 'Clearing…' : 'Clear log' }}
            </Button>
          </div>
          <p :class="['text-sm mb-4', theme.textSecondary]">Log file location and recent activity.</p>

          <dl v-if="data?.logging" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Log file</dt>
              <dd :class="['mt-1 text-sm font-mono break-all', theme.textPrimary]">{{ data.logging.path ?? '—' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">File exists</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.logging.exists ? 'YES' : 'NO' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">File size</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.logging.size_formatted ?? '—' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Last modified</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.logging.modified_formatted ?? '—' }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Errors</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.logging.errors_count ?? 0 }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Warnings</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.logging.warnings_count ?? 0 }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Info</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.logging.info_count ?? 0 }}</dd>
            </div>
            <div>
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Total analyzed</dt>
              <dd :class="['mt-1 text-sm font-mono', theme.textPrimary]">{{ data.logging.total_analyzed != null ? data.logging.total_analyzed.toLocaleString() : '—' }}</dd>
            </div>
          </dl>

          <div v-if="logIssuesError" :class="['rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm', theme.textPrimary]">
            {{ logIssuesError }}
          </div>
          <div v-else-if="logIssuesLoaded" class="space-y-4 pt-4 border-t border-border">
            <p :class="['text-xs font-medium uppercase tracking-wider mb-2', theme.textSecondary]">Recent activity</p>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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
const { getSystem, getSystemConnectivity, getSystemWebhooks, getQueueFailed, retryFailedJob, retryAllFailedJobs, forgetFailedJob, flushFailedJobs, restartQueue, clearCache, clearAllCacheAndOptimize, clearLog, getLogsRecent } = useAdminApi()

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
const restartQueueLoading = ref(false)
const logIssues = ref({ errors: [], warnings: [], alerts: [] })
const logIssuesLoaded = ref(false)
const logIssuesError = ref(null)
const clientInfo = ref(null)
const exportLoading = ref(false)
const countdownTick = ref(0)
const nextDueTargets = ref([])
const webhooks = ref([])
const webhooksLoading = ref(false)
const webhooksMeta = ref(null)
const webhookProviderFilter = ref('')
const webhookStatusFilter = ref('')

watch(
  () => data.value?.scheduled_commands,
  (cmds) => {
    if (!cmds?.length) {
      nextDueTargets.value = []
      return
    }
    nextDueTargets.value = cmds.map((cmd) => {
      const ms = parseNextDueToMs(cmd.next_due)
      return ms != null ? Date.now() + ms : null
    })
  },
  { immediate: true }
)

function parseNextDueToMs(str) {
  if (!str || typeof str !== 'string') return null
  const m = str.match(/^(\d+)\s*(second|minute|hour)s?\s+from\s+now$/i)
  if (!m) return null
  const value = parseInt(m[1], 10)
  const unit = (m[2] || '').toLowerCase()
  if (unit === 'second') return value * 1000
  if (unit === 'minute') return value * 60 * 1000
  if (unit === 'hour') return value * 3600 * 1000
  return null
}

function formatCountdown(targetAt) {
  if (targetAt == null) return '—'
  countdownTick.value
  const rem = Math.max(0, Math.floor((targetAt - Date.now()) / 1000))
  if (rem <= 0) return 'Due'
  if (rem < 60) return `${rem}s`
  if (rem < 3600) return `${Math.floor(rem / 60)}m ${rem % 60}s`
  return `${Math.floor(rem / 3600)}h ${Math.floor((rem % 3600) / 60)}m`
}

function getClientInfo() {
  if (typeof navigator === 'undefined' || typeof screen === 'undefined') return null
  const ua = navigator.userAgent
  let name = navigator.appName || 'Unknown'
  if (ua.includes('Chrome') && !ua.includes('Edg')) name = 'Chrome'
  else if (ua.includes('Edg')) name = 'Edge'
  else if (ua.includes('Firefox')) name = 'Firefox'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) name = 'Safari'
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const mem = performance.memory
  const formatMb = (n) => (n != null ? (n / 1024 / 1024).toFixed(2) + ' MB' : null)
  const formatGb = (n) => (n != null ? (n / 1024 / 1024 / 1024).toFixed(2) + ' GB' : null)
  return {
    browser: {
      name,
      platform: navigator.platform || '—',
      language: navigator.language || navigator.userLanguage || '—',
      online: navigator.onLine,
    },
    screen: {
      resolution: `${screen.width} × ${screen.height}`,
      available: `${screen.availWidth} × ${screen.availHeight}`,
      colorDepth: screen.colorDepth != null ? `${screen.colorDepth} bits` : '—',
      pixelDepth: screen.pixelDepth != null ? `${screen.pixelDepth} bits` : '—',
    },
    network: conn
      ? {
          connectionType: conn.effectiveType || conn.type || '—',
          downlink: conn.downlink != null ? `${conn.downlink} Mbps` : '—',
          rtt: conn.rtt != null ? `${conn.rtt} ms` : '—',
          saveData: conn.saveData === true,
        }
      : { connectionType: 'N/A', downlink: 'N/A', rtt: 'N/A', saveData: false },
    performance: mem ? {
      usedHeap: formatMb(mem.usedJSHeapSize),
      totalHeap: formatMb(mem.totalJSHeapSize),
      heapLimit: formatGb(mem.jsHeapSizeLimit),
    } : { usedHeap: '—', totalHeap: '—', heapLimit: '—' },
  }
}

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
  countdownTick.value
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
  countdownTick.value
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
  database_metrics: 'Version, tables count, size, current/max connections, usage %, and largest tables (MySQL, PostgreSQL, SQLite).',
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
  tools: 'App version and Telescope availability.',
  scheduler: 'Last time the Laravel scheduler ran.',
  quick_links: 'Shortcuts to external admin tools.',
  feature_flags: 'Enabled feature flags and how many users have each.',
  feature_flag_usage: 'Usage counts per feature flag.',
  failed_logins: 'Recent failed login attempts (identifier, IP, time).',
  tooling: 'Tinker, Horizon, Scheduler, and counts for commands, routes, middleware, views, jobs, etc.',
  node_npm: 'Node.js and NPM versions when available on the server.',
}

const sections = computed(() => {
  if (!data.value) return {}
  const d = data.value
  const out = {}
  if (d.application) out.application = d.application
  if (d.php) out.php = d.php
  if (d.database) out.database = d.database
  if (d.database_metrics && typeof d.database_metrics === 'object') {
    const m = { ...d.database_metrics }
    if (m.size_mb != null) m.size_mb = `${m.size_mb} MB`
    if (m.usage_percent != null) m.usage_percent = `${m.usage_percent}%`
    out.database_metrics = m
  }
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
  if (d.tooling && typeof d.tooling === 'object') {
    out.tooling = {}
    Object.entries(d.tooling).forEach(([k, v]) => {
      out.tooling[k] = typeof v === 'boolean' ? (v ? 'Enabled' : 'Disabled') : v
    })
  }
  if (d.node_npm && typeof d.node_npm === 'object') out.node_npm = d.node_npm
  return out
})

function sectionRows(sectionKey, section) {
  if (sectionKey === 'php') {
    const { extensions, required_extensions, ...rest } = section
    return rest
  }
  if (sectionKey === 'database_metrics' && section && typeof section === 'object') {
    const { size_bytes, largest_tables, ...rest } = section
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
  countdownTick.value
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

async function runRestartQueue() {
  restartQueueLoading.value = true
  try {
    await restartQueue()
    await refreshQueueData()
  } catch (e) {
    error.value = e?.message ?? 'Restart queue failed'
  } finally {
    restartQueueLoading.value = false
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

function exportReport() {
  if (!data.value) return
  exportLoading.value = true
  try {
    const payload = { ...data.value, client_info: clientInfo.value, exported_at: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `system-report-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  } finally {
    exportLoading.value = false
  }
}

let countdownInterval = null
onMounted(async () => {
  clientInfo.value = getClientInfo()
  countdownInterval = setInterval(() => {
    countdownTick.value++
  }, 1000)
  try {
    data.value = await getSystem()
  } catch (e) {
    error.value = e?.message ?? 'Failed to load system info'
  } finally {
    loading.value = false
  }
  loadLogIssues()
  fetchWebhooks()
})
onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

async function fetchWebhooks() {
  webhooksLoading.value = true
  try {
    const params = { per_page: 30 }
    if (webhookProviderFilter.value) params.provider = webhookProviderFilter.value
    if (webhookStatusFilter.value) params.status = webhookStatusFilter.value
    const res = await getSystemWebhooks(params)
    webhooks.value = res?.webhooks ?? []
    webhooksMeta.value = res?.meta ?? null
  } catch (_) {
    webhooks.value = []
    webhooksMeta.value = null
  } finally {
    webhooksLoading.value = false
  }
}

function formatWebhookDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' })
  } catch {
    return iso
  }
}
</script>
