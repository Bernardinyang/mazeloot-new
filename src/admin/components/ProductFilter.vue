<template>
  <select v-model="selected" @change="handleChange" class="block w-full rounded-md border-gray-300 shadow-sm">
    <option value="">All Products</option>
    <option v-for="product in products" :key="product.uuid" :value="product.slug">{{ product.name }}</option>
  </select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAdminApi } from '@/admin/api/admin'
import { useAdminStore } from '@/admin/stores/admin'

const adminApi = useAdminApi()
const adminStore = useAdminStore()
const products = ref([])
const selected = ref(null)

const loadProducts = async () => {
  try {
    products.value = await adminApi.getProducts()
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

const handleChange = () => {
  adminStore.setSelectedProduct(selected.value)
  emit('change', selected.value)
}

const emit = defineEmits(['change'])

watch(() => adminStore.selectedProduct, (newVal) => {
  selected.value = newVal
})

loadProducts()
</script>
