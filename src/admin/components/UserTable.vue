<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="user in users" :key="user.uuid">
          <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.first_name }} {{ user.last_name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.role }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <slot name="actions" :user="user" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  users: {
    type: Array,
    required: true,
  },
})
</script>
