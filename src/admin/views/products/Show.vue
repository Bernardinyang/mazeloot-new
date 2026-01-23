<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Product Details</h1>
    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="product" class="bg-white rounded-lg shadow p-6">
      <dl class="grid grid-cols-2 gap-4">
        <dt class="font-semibold">Name:</dt>
        <dd>{{ product.name }}</dd>
        <dt class="font-semibold">Slug:</dt>
        <dd>{{ product.slug }}</dd>
        <dt class="font-semibold">Description:</dt>
        <dd>{{ product.description }}</dd>
        <dt class="font-semibold">Active:</dt>
        <dd>{{ product.is_active ? 'Yes' : 'No' }}</dd>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'

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
