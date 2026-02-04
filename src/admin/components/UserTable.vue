<template>
  <DataTable
    :columns="columns"
    :items="users"
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
      <slot name="actions" :user="item" />
    </template>
  </DataTable>
</template>

<script setup>
import { Badge } from '@/shared/components/shadcn/badge'
import DataTable from '@/shared/components/organisms/DataTable.vue'

const columns = [
  { key: 'email', label: 'Email', sortable: true },
  { key: 'name', label: 'Name', dataSelector: (u) => `${u.first_name || ''} ${u.last_name || ''}`.trim() || '—', sortable: true },
  { key: 'role', label: 'Role', slot: 'role', sortable: true },
  { key: 'actions', label: 'Actions', slot: 'actions' },
]

defineProps({
  users: { type: Array, required: true },
})
</script>
