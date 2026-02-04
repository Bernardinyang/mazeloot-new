<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
      <header>
        <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Products</h1>
        <p :class="['mt-1 text-sm', theme.textSecondary]">
          View and manage product definitions (e.g. Memora).
        </p>
      </header>

      <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <DataTable
          :columns="columns"
          :items="products"
          :loading="loading"
          :getId="(p) => p.uuid"
          :loading-rows="5"
          searchable
          search-placeholder="Search products…"
          empty-message="No products found."
        >
          <template #cell-status="{ value }">
            <Badge :variant="value ? 'default' : 'secondary'">
              {{ value ? 'Active' : 'Inactive' }}
            </Badge>
          </template>
          <template #cell-actions="{ item }">
            <RouterLink :to="{ name: 'admin-product-show', params: { slug: item.slug } }">
              <Button variant="link" size="sm">View</Button>
            </RouterLink>
          </template>
        </DataTable>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import Button from '@/shared/components/shadcn/button/Button.vue'
import { Badge } from '@/shared/components/shadcn/badge'
import { RouterLink } from 'vue-router'
import DataTable from '@/shared/components/organisms/DataTable.vue'

const theme = useThemeClasses()
const adminApi = useAdminApi()
const products = ref([])
const loading = ref(true)

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'description', label: 'Description', valueClass: 'line-clamp-2', sortable: true },
  { key: 'status', label: 'Status', slot: 'status', dataSelector: (p) => p.is_active, sortable: true },
  { key: 'actions', label: 'Actions', slot: 'actions' },
]

onMounted(async () => {
  try {
    products.value = await adminApi.getProducts()
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
})
</script>
