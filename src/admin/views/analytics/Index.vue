<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Analytics</h1>
    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-600">Activity logs will be displayed here.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminApi } from '@/admin/api/admin'

const adminApi = useAdminApi()
const loading = ref(true)

onMounted(async () => {
  try {
    // Load activity logs
  } catch (error) {
    console.error('Failed to load analytics:', error)
  } finally {
    loading.value = false
  }
})
</script>
