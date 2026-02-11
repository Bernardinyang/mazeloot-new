<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 min-w-0">
      <header>
        <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Sensitive actions</h1>
        <p :class="['mt-1 text-sm', theme.textSecondary]">Audit role changes, suspend/activate, early access.</p>
      </header>

      <div class="flex flex-wrap gap-3 items-end mb-4">
        <Button variant="outline" size="sm" @click="setPreset(7)">Last 7 days</Button>
        <Button variant="outline" size="sm" @click="setPreset(30)">Last 30 days</Button>
        <input
          v-model="filters.start_date"
          type="date"
          :class="['rounded-lg border border-input bg-background px-3 py-2 text-sm', theme.textPrimary]"
          aria-label="From date"
          @change="loadLogs"
        />
        <input
          v-model="filters.end_date"
          type="date"
          :class="['rounded-lg border border-input bg-background px-3 py-2 text-sm', theme.textPrimary]"
          aria-label="To date"
          @change="loadLogs"
        />
        <Button variant="outline" size="sm" @click="loadLogs">Apply</Button>
      </div>

      <div v-if="loading" class="flex items-center gap-3">
        <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
        <span :class="['text-sm', theme.textSecondary]">Loading…</span>
      </div>

      <div v-else class="rounded-xl border border-border bg-card overflow-hidden">
        <table class="w-full text-sm">
          <thead :class="[theme.bgMuted]">
            <tr>
              <th class="text-left px-4 py-3 font-medium">Admin</th>
              <th class="text-left px-4 py-3 font-medium">Action</th>
              <th class="text-left px-4 py-3 font-medium">Description</th>
              <th class="text-left px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in logs"
              :key="log.uuid"
              :class="['border-t border-border', theme.borderPrimary]"
            >
              <td class="px-4 py-2">
                <router-link
                  v-if="log.user"
                  :to="{ name: 'admin-user-show', params: { uuid: log.user.uuid } }"
                  class="text-accent hover:underline"
                >
                  {{ log.user.email }}
                </router-link>
                <span v-else :class="theme.textSecondary">—</span>
              </td>
              <td class="px-4 py-2 font-mono">{{ log.action }}</td>
              <td class="px-4 py-2 max-w-xs truncate" :class="theme.textSecondary">{{ log.description }}</td>
              <td class="px-4 py-2 whitespace-nowrap tabular-nums" :class="theme.textSecondary">{{ formatDate(log.created_at) }}</td>
            </tr>
            <tr v-if="!logs.length">
              <td colspan="4" class="px-4 py-8 text-center" :class="theme.textSecondary">No sensitive actions found</td>
            </tr>
          </tbody>
        </table>
        <div v-if="pagination?.total > 0" class="px-4 py-3 border-t border-border flex justify-between items-center">
          <span :class="['text-xs', theme.textSecondary]">Total {{ pagination.total }}</span>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" :disabled="pagination.current_page <= 1" @click="loadPage(pagination.current_page - 1)">Previous</Button>
            <Button variant="outline" size="sm" :disabled="pagination.current_page >= pagination.last_page" @click="loadPage(pagination.current_page + 1)">Next</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'

const theme = useThemeClasses()
const { getSensitiveActivityLogs } = useAdminApi()

const logs = ref([])
const loading = ref(true)
const pagination = ref(null)
const filters = ref({ start_date: '', end_date: '', per_page: 50 })

function formatDate(d) {
  return d ? new Date(d).toLocaleString() : '—'
}

function setPreset(days) {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  filters.value.end_date = end.toISOString().slice(0, 10)
  filters.value.start_date = start.toISOString().slice(0, 10)
  loadLogs()
}

async function loadLogs(page = 1) {
  loading.value = true
  try {
    const params = { page, per_page: filters.value.per_page }
    if (filters.value.start_date) params.start_date = filters.value.start_date
    if (filters.value.end_date) params.end_date = filters.value.end_date
    const res = await getSensitiveActivityLogs(params)
    logs.value = res.data || []
    pagination.value = res.meta || null
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function loadPage(p) {
  loadLogs(p)
}

onMounted(loadLogs)
</script>
