<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <header>
        <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Users</h1>
        <p :class="['mt-1 text-sm', theme.textSecondary]">Manage users, roles, and permissions.</p>
      </header>

      <div
        :class="[
          'rounded-xl border overflow-hidden',
          'border-border bg-card',
          'shadow-sm dark:shadow-none',
        ]"
      >
        <DataTable
            :columns="columns"
            :items="users"
            :loading="loading"
            :getId="(u) => u.uuid"
            searchable
            search-placeholder="Search users…"
            empty-message="No users found"
          >
            <template #cell-role="{ value }">
              <Badge :variant="value === 'admin' || value === 'super_admin' ? 'default' : 'secondary'">
                {{ value }}
              </Badge>
            </template>
            <template #cell-actions="{ item }">
              <RouterLink :to="`/admin/users/${item.uuid}`">
                <Button variant="link" size="sm">View</Button>
              </RouterLink>
            </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'
import { Badge } from '@/shared/components/shadcn/badge'
import { RouterLink } from 'vue-router'
import DataTable from '@/shared/components/organisms/DataTable.vue'

const theme = useThemeClasses()
const adminApi = useAdminApi()
const users = ref([])
const loading = ref(true)

const columns = [
  { key: 'email', label: 'Email', sortable: true },
  { key: 'name', label: 'Name', dataSelector: (u) => `${u.first_name || ''} ${u.last_name || ''}`.trim() || '—', sortable: true },
  { key: 'role', label: 'Role', slot: 'role', sortable: true },
  { key: 'actions', label: 'Actions', slot: 'actions' },
]

onMounted(async () => {
  try {
    const response = await adminApi.getUsers()
    users.value = response.data || []
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
})
</script>
