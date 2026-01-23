<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">User Activity Logs</h1>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <div class="flex gap-4 flex-wrap">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by description..."
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
            @input="debouncedSearch"
          />
          <input
            v-model="filters.start_date"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
            @change="loadLogs"
          />
          <input
            v-model="filters.end_date"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
            @change="loadLogs"
          />
          <select
            v-model="filters.action"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm"
            @change="loadLogs"
          >
            <option value="">All Actions</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="viewed">Viewed</option>
            <option value="logged_in">Logged In</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">Loading...</div>
      <div v-else-if="logs.length === 0" class="text-center py-8 text-gray-500">
        No activity logs found
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in logs" :key="log.uuid">
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="log.user">
                  <div class="text-sm font-medium text-gray-900">{{ log.user.name || log.user.email }}</div>
                  <div class="text-sm text-gray-500">{{ log.user.email }}</div>
                </div>
                <span v-else class="text-sm text-gray-400">System</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ log.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="font-mono">{{ log.method }} {{ log.route }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.ip_address }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(log.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pagination" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
        </div>
        <div class="flex gap-2">
          <button
            :disabled="!pagination.prev_page_url"
            class="px-4 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            @click="loadPage(pagination.current_page - 1)"
          >
            Previous
          </button>
          <button
            :disabled="!pagination.next_page_url"
            class="px-4 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            @click="loadPage(pagination.current_page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminApi } from '@/admin/api/admin'
import { debounce } from '@/shared/utils/debounce'

const adminApi = useAdminApi()
const logs = ref([])
const loading = ref(true)
const pagination = ref(null)

const filters = ref({
  search: '',
  action: '',
  start_date: '',
  end_date: '',
  per_page: 50,
})

const debouncedSearch = debounce(loadLogs, 300)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const loadLogs = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      ...filters.value,
      page,
    }
    if (!params.search) delete params.search
    if (!params.action) delete params.action
    if (!params.start_date) delete params.start_date
    if (!params.end_date) delete params.end_date

    const response = await adminApi.getUserActivityLogs(params)
    logs.value = response.data || []
    pagination.value = response.meta || null
  } catch (error) {
    console.error('Failed to load activity logs:', error)
  } finally {
    loading.value = false
  }
}

const loadPage = (page) => {
  loadLogs(page)
}

onMounted(() => {
  loadLogs()
})
</script>
