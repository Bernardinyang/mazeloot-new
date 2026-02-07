<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <header>
        <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Downgrade Requests</h1>
        <p :class="['mt-1 text-sm', theme.textSecondary]">Memora subscription downgrade requests. Generate confirmation links or checkout for users.</p>
      </header>

      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <input
            v-model="search"
            type="search"
            placeholder="Search by name or email…"
            :class="['w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', theme.textPrimary]"
            aria-label="Search downgrade requests"
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
        <div v-for="i in 5" :key="i" :class="['rounded-xl border border-border bg-card p-6 animate-pulse']">
          <div :class="['h-5 w-48 rounded', theme.bgSkeleton]" />
          <div :class="['h-4 w-64 rounded mt-2', theme.bgSkeleton]" />
        </div>
      </div>

      <div v-else-if="requests.length === 0" :class="['text-center py-12 text-sm rounded-xl border border-border bg-card', theme.textSecondary]">
        No downgrade requests found
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="req in requests"
          :key="req.uuid"
          :class="['rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all']"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 :class="['text-lg font-semibold', theme.textPrimary]">
                  {{ req.user.first_name }} {{ req.user.last_name }}
                </h3>
                <Badge :variant="req.status === 'pending' ? 'secondary' : 'default'">{{ req.status }}</Badge>
              </div>
              <p :class="['text-sm mt-1', theme.textSecondary]">{{ req.user.email }}</p>
              <p :class="['text-xs mt-2', theme.textSecondary]">
                {{ req.current_tier }} → {{ req.target_tier }} · {{ formatDate(req.requested_at || req.created_at) }}
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              class="shrink-0"
              @click="$router.push({ name: 'admin-downgrade-request-show', params: { uuid: req.uuid } })"
            >
              View &amp; act
            </Button>
          </div>
        </div>
      </div>

      <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between">
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
import { Badge } from '@/shared/components/shadcn/badge'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const adminApi = useAdminApi()
const requests = ref([])
const meta = ref(null)
const loading = ref(true)
const search = ref('')
const statusFilter = ref('pending')

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—')

const load = async (opts = {}) => {
  loading.value = true
  try {
    const params = { per_page: 20, ...opts }
    if (statusFilter.value !== 'all') params.status = statusFilter.value
    if (search.value.trim()) params.search = search.value.trim()
    const res = await adminApi.getDowngradeRequests(params)
    requests.value = Array.isArray(res) ? res : (res?.data ?? [])
    meta.value = res?.meta ?? null
  } catch (e) {
    toast.error('Failed to load downgrade requests')
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
