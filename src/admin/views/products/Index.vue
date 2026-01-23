<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Products</h1>
    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="product in products" :key="product.uuid" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
        <p class="text-gray-600 mb-4">{{ product.description }}</p>
        <router-link :to="`/admin/products/${product.slug}`" class="text-blue-600 hover:underline">View Details</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminApi } from '@/admin/api/admin'

const adminApi = useAdminApi()
const products = ref([])
const loading = ref(true)

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
