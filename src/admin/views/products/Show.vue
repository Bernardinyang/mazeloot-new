<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <RouterLink
            :to="{ name: 'admin-products' }"
            :class="['text-sm mb-2 inline-block', theme.textLink]"
          >
            ← Products
          </RouterLink>
          <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">
            {{ product?.name ?? 'Product details' }}
          </h1>
          <p v-if="product" :class="['mt-1 text-sm', theme.textSecondary]">{{ product.slug }}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <Button
            v-if="product?.slug === 'memora'"
            variant="default"
            size="sm"
            @click="$router.push({ name: 'admin-pricing' })"
          >
            Manage pricing
          </Button>
          <Button variant="outline" size="sm" @click="$router.push({ name: 'admin-products' })">
            Back to list
          </Button>
        </div>
      </header>

      <div v-if="loading" :class="['rounded-xl border border-border bg-card overflow-hidden', theme.bgCard]">
        <div class="border-b border-border px-6 py-4">
          <div :class="['h-4 w-32 rounded animate-pulse', theme.bgSkeleton]" />
          <div :class="['h-3 w-48 mt-2 rounded animate-pulse', theme.bgSkeleton]" style="animation-delay: 50ms" />
        </div>
        <div class="grid gap-4 p-6 sm:grid-cols-2">
          <div v-for="i in 5" :key="i" class="space-y-2">
            <div :class="['h-3 w-20 rounded animate-pulse', theme.bgSkeleton]" :style="{ animationDelay: `${i * 40}ms` }" />
            <div :class="['h-5 w-full max-w-[180px] rounded animate-pulse', theme.bgSkeleton]" :style="{ animationDelay: `${i * 40 + 20}ms` }" />
          </div>
        </div>
      </div>

      <template v-else-if="product">
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="border-b border-border px-6 py-4">
            <h2 :class="['text-sm font-medium', theme.textPrimary]">Overview</h2>
            <p :class="['text-xs', theme.textSecondary]">Product identity and status.</p>
          </div>
          <dl class="grid gap-4 p-6 sm:grid-cols-2">
            <div class="space-y-1">
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Name</dt>
              <dd :class="['text-sm font-medium', theme.textPrimary]">{{ product.name }}</dd>
            </div>
            <div class="space-y-1">
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Slug</dt>
              <dd :class="['text-sm font-mono', theme.textPrimary]">{{ product.slug }}</dd>
            </div>
            <div class="space-y-1 sm:col-span-2">
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Description</dt>
              <dd :class="['text-sm', theme.textPrimary]">{{ product.description || '—' }}</dd>
            </div>
            <div class="space-y-1">
              <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Status</dt>
              <dd>
                <Badge :variant="product.is_active ? 'default' : 'secondary'">
                  {{ product.is_active ? 'Active' : 'Inactive' }}
                </Badge>
              </dd>
            </div>
          </dl>
        </div>
      </template>

      <div v-else :class="['rounded-xl border border-border bg-card p-8 text-center']">
        <p :class="['text-sm', theme.textSecondary]">Product not found.</p>
        <Button variant="outline" class="mt-4" @click="$router.push({ name: 'admin-products' })">
          Back to products
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { RouterLink } from 'vue-router'
import { Button } from '@/shared/components/shadcn/button'
import { Badge } from '@/shared/components/shadcn/badge'

const theme = useThemeClasses()
const route = useRoute()
const adminApi = useAdminApi()
const product = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    product.value = await adminApi.getProduct(route.params.slug)
  } catch (error) {
    console.error('Failed to load product:', error)
  } finally {
    loading.value = false
  }
})
</script>
