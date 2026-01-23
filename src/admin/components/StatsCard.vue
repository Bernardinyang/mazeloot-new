<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
    <p class="text-3xl font-bold">{{ value }}</p>
    <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  subtitle: {
    type: String,
    default: null,
  },
})
</script>
