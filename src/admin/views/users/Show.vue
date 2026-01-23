<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">User Details</h1>
    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="user" class="bg-white rounded-lg shadow p-6">
      <dl class="grid grid-cols-2 gap-4">
        <dt class="font-semibold">Email:</dt>
        <dd>{{ user.email }}</dd>
        <dt class="font-semibold">Name:</dt>
        <dd>{{ user.first_name }} {{ user.last_name }}</dd>
        <dt class="font-semibold">Role:</dt>
        <dd>{{ user.role }}</dd>
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
const user = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await adminApi.getUser(route.params.uuid)
    user.value = response
  } catch (error) {
    console.error('Failed to load user:', error)
  } finally {
    loading.value = false
  }
})
</script>
