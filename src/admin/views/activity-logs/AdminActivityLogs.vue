<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <header>
        <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Admin Activity Logs</h1>
        <p :class="['mt-1 text-sm', theme.textSecondary]">Audit admin actions, routes, and IPs.</p>
      </header>

      <div :class="['rounded-xl border border-border bg-card overflow-hidden shadow-sm']">
        <div class="p-4 sm:p-6 border-b border-border">
          <div class="flex flex-wrap gap-3 items-end">
            <div class="flex-1 min-w-[200px] space-y-2">
              <Label for="admin-logs-search" class="sr-only">Search</Label>
              <Input
                id="admin-logs-search"
                v-model="filters.search"
                type="text"
                placeholder="Search by description…"
                class="h-9"
                @input="debouncedSearch"
              />
            </div>
            <div class="space-y-2">
              <Label for="admin-logs-start" class="sr-only">From date</Label>
              <Input
                id="admin-logs-start"
                v-model="filters.start_date"
                type="date"
                class="h-9 w-[140px]"
                @change="loadLogs"
              />
            </div>
            <div class="space-y-2">
              <Label for="admin-logs-end" class="sr-only">To date</Label>
              <Input
                id="admin-logs-end"
                v-model="filters.end_date"
                type="date"
                class="h-9 w-[140px]"
                @change="loadLogs"
              />
            </div>
            <Select v-model="filters.action" @update:model-value="loadLogs">
              <SelectTrigger class="h-9 w-[140px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Actions</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="logged_in">Logged In</SelectItem>
              </SelectContent>
            </Select>
            <Select v-model="filters.role" @update:model-value="loadLogs">
              <SelectTrigger class="h-9 w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          :columns="columns"
          :items="logs"
          :loading="loading"
          :getId="(log) => log.uuid"
          :async-pagination="true"
          empty-message="No activity logs found"
        >
          <template #cell-admin="{ item }">
            <div v-if="item.user">
              <div :class="['text-sm font-medium', theme.textPrimary]">{{ item.user.name || item.user.email }}</div>
              <div :class="['text-sm', theme.textSecondary]">{{ item.user.email }}</div>
            </div>
            <span v-else :class="['text-sm', theme.textSecondary]">System</span>
          </template>
          <template #cell-role="{ item }">
            <Badge :variant="item.user?.role === 'super_admin' ? 'default' : 'secondary'">
              {{ item.user?.role === 'super_admin' ? 'Super Admin' : 'Admin' }}
            </Badge>
          </template>
          <template #cell-action="{ value }">
            <Badge variant="outline">{{ value }}</Badge>
          </template>
          <template #cell-description="{ value, item }">
            <span :class="['text-sm max-w-[200px] truncate block', theme.textPrimary]" :title="item.description">{{ value }}</span>
          </template>
          <template #cell-route="{ item }">
            <span class="whitespace-nowrap text-sm font-mono text-muted-foreground">{{ item.method }} {{ item.route }}</span>
          </template>
          <template #cell-ip_address="{ value }">
            <span class="whitespace-nowrap text-sm font-mono text-muted-foreground">{{ value }}</span>
          </template>
          <template #cell-created_at="{ value }">
            <span class="whitespace-nowrap text-sm text-muted-foreground tabular-nums">{{ formatDate(value) }}</span>
          </template>
        </DataTable>

        <div v-if="pagination" class="px-4 sm:px-6 py-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <p :class="['text-sm', theme.textSecondary]">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
          </p>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="!pagination.prev_page_url"
              @click="loadPage(pagination.current_page - 1)"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="!pagination.next_page_url"
              @click="loadPage(pagination.current_page + 1)"
            >
              Next
            </Button>
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
import { debounce } from '@/shared/utils/debounce'
import { Input } from '@/shared/components/shadcn/input'
import Label from '@/shared/components/shadcn/Label.vue'
import { Button } from '@/shared/components/shadcn/button'
import { Badge } from '@/shared/components/shadcn/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/shadcn/select'
import DataTable from '@/shared/components/organisms/DataTable.vue'

const theme = useThemeClasses()

const columns = [
  { key: 'admin', label: 'Admin', slot: 'admin' },
  { key: 'role', label: 'Role', slot: 'role' },
  { key: 'action', label: 'Action', slot: 'action' },
  { key: 'description', label: 'Description', slot: 'description' },
  { key: 'route', label: 'Route', slot: 'route' },
  { key: 'ip_address', label: 'IP' },
  { key: 'created_at', label: 'Date', slot: 'created_at' },
]
const adminApi = useAdminApi()
const logs = ref([])
const loading = ref(true)
const pagination = ref(null)

const filters = ref({
  search: '',
  action: '__all__',
  role: '__all__',
  start_date: '',
  end_date: '',
  per_page: 50,
})

const formatDate = (dateString) => new Date(dateString).toLocaleString()

const loadLogs = async (page = 1) => {
  loading.value = true
  try {
    const params = { ...filters.value, page }
    if (!params.search) delete params.search
    if (!params.action || params.action === '__all__') delete params.action
    if (!params.role || params.role === '__all__') delete params.role
    if (!params.start_date) delete params.start_date
    if (!params.end_date) delete params.end_date
    const response = await adminApi.getAdminActivityLogs(params)
    logs.value = response.data || []
    pagination.value = response.meta || null
  } catch (error) {
    console.error('Failed to load activity logs:', error)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(loadLogs, 300)
const loadPage = (page) => loadLogs(page)

onMounted(() => loadLogs())
</script>
