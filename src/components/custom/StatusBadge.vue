<template>
  <span :class="badgeClasses">
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error'
}>()

const statusConfig: Record<string, { variant: string; classes: string }> = {
  // Collection statuses
  Published: { variant: 'success', classes: 'bg-green-500/20 text-green-300 dark:text-green-300 light:text-green-700' },
  Preview: { variant: 'warning', classes: 'bg-yellow-500/20 text-yellow-300 dark:text-yellow-300 light:text-yellow-700' },
  
  // Order statuses
  Processing: { variant: 'info', classes: 'text-blue-400 dark:text-blue-400 light:text-blue-600' },
  Shipped: { variant: 'info', classes: 'text-purple-400 dark:text-purple-400 light:text-purple-600' },
  Delivered: { variant: 'success', classes: 'text-green-400 dark:text-green-400 light:text-green-600' },
  
  // Post statuses
  Scheduled: { variant: 'info', classes: 'bg-blue-500/20 text-blue-300 dark:text-blue-300 light:text-blue-700' },
  Draft: { variant: 'warning', classes: 'bg-yellow-500/20 text-yellow-300 dark:text-yellow-300 light:text-yellow-700' },
  
  // Product statuses
  Active: { variant: 'success', classes: 'bg-green-500/20 text-green-300 dark:text-green-300 light:text-green-700' },
  
  // Wishlist statuses
  'In stock': { variant: 'success', classes: 'bg-green-500/20 text-green-300 dark:text-green-300 light:text-green-700' },
  New: { variant: 'info', classes: 'bg-blue-500/20 text-blue-300 dark:text-blue-300 light:text-blue-700' },
  Promo: { variant: 'info', classes: 'bg-purple-500/20 text-purple-300 dark:text-purple-300 light:text-purple-700' },
}

const badgeClasses = computed(() => {
  const config = statusConfig[props.status]
  if (config) {
    return `text-xs px-2 py-0.5 rounded ${config.classes}`
  }
  
  // Fallback based on variant prop
  const variantClasses = {
    success: 'bg-green-500/20 text-green-300 dark:text-green-300 light:text-green-700',
    warning: 'bg-yellow-500/20 text-yellow-300 dark:text-yellow-300 light:text-yellow-700',
    info: 'bg-blue-500/20 text-blue-300 dark:text-blue-300 light:text-blue-700',
    error: 'bg-red-500/20 text-red-300 dark:text-red-300 light:text-red-700',
    default: 'bg-gray-500/20 text-gray-300 dark:text-gray-300 light:text-gray-700',
  }
  
  return `text-xs px-2 py-0.5 rounded ${variantClasses[props.variant || 'default']}`
})
</script>

