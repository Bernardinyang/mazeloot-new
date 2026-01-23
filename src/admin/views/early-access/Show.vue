<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Early Access Details</h1>
    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="earlyAccess" class="bg-white rounded-lg shadow p-6">
      <dl class="grid grid-cols-2 gap-4">
        <dt class="font-semibold">User:</dt>
        <dd>{{ earlyAccess.user.email }}</dd>
        <dt class="font-semibold">Discount:</dt>
        <dd>{{ earlyAccess.discount_percentage }}%</dd>
        <dt class="font-semibold">Features:</dt>
        <dd>{{ (earlyAccess.feature_flags || []).join(', ') || 'None' }}</dd>
        <dt class="font-semibold">Release Version:</dt>
        <dd>{{ earlyAccess.release_version || 'N/A' }}</dd>
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
const earlyAccess = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    earlyAccess.value = await adminApi.getEarlyAccess(route.params.uuid)
  } catch (error) {
    console.error('Failed to load early access:', error)
  } finally {
    loading.value = false
  }
})
</script>
