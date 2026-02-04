<template>
  <Select v-model="selected" @update:model-value="handleChange">
    <SelectTrigger :class="['w-full min-w-[180px]', theme.bgCard, 'border-border']">
      <SelectValue placeholder="All Products" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="__all__">All Products</SelectItem>
      <SelectItem v-for="product in products" :key="product.uuid" :value="product.slug">
        {{ product.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAdminApi } from '@/admin/api/admin'
import { useAdminStore } from '@/admin/stores/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/shadcn/select'

const theme = useThemeClasses()
const adminApi = useAdminApi()
const adminStore = useAdminStore()
const products = ref([])
const selected = ref(adminStore.selectedProduct == null ? '__all__' : adminStore.selectedProduct)

const emit = defineEmits(['change'])

const loadProducts = async () => {
  try {
    products.value = await adminApi.getProducts()
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

const handleChange = () => {
  const val = selected.value === '__all__' ? null : selected.value
  adminStore.setSelectedProduct(val)
  emit('change', val)
}

watch(() => adminStore.selectedProduct, (newVal) => {
  selected.value = newVal == null ? '__all__' : newVal
})

loadProducts()
</script>
