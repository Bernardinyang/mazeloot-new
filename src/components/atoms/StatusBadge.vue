<template>
  <span :class="badgeClasses">
    {{ capitalize(status) }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { capitalize } from '@/lib/utils'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'success', 'warning', 'info', 'error'].includes(value),
  },
})

const statusConfig = {
  // Collection statuses (uppercase)
  PUBLISHED: {
    variant: 'success',
    classes: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
  },
  ACTIVE: {
    variant: 'success',
    classes: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
  },
  DRAFT: {
    variant: 'warning',
    classes: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30',
  },
  ARCHIVED: {
    variant: 'default',
    classes: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30',
  },

  // Collection statuses (title case)
  Published: {
    variant: 'success',
    classes: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
  },
  Active: {
    variant: 'success',
    classes: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
  },
  Draft: {
    variant: 'warning',
    classes: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30',
  },
  Archived: {
    variant: 'default',
    classes: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30',
  },

  // Collection statuses (lowercase)
  published: {
    variant: 'success',
    classes: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
  },
  active: {
    variant: 'success',
    classes: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
  },
  draft: {
    variant: 'warning',
    classes: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30',
  },
  archived: {
    variant: 'default',
    classes: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30',
  },

  // Other statuses
  Preview: {
    variant: 'warning',
    classes: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30',
  },
  Processing: {
    variant: 'info',
    classes: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30',
  },
  Shipped: {
    variant: 'info',
    classes: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30',
  },
  Delivered: {
    variant: 'success',
    classes: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
  },
  Scheduled: {
    variant: 'info',
    classes: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30',
  },
  'In stock': {
    variant: 'success',
    classes: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
  },
  New: {
    variant: 'info',
    classes: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30',
  },
  Promo: {
    variant: 'info',
    classes: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30',
  },
}

const badgeClasses = computed(() => {
  // Try exact match first
  let config = statusConfig[props.status]

  // If no exact match, try case-insensitive
  if (!config) {
    const statusUpper = props.status.toUpperCase()
    config = statusConfig[statusUpper]
  }

  if (config) {
    return `text-xs font-medium px-2 py-0.5 rounded-full ${config.classes}`
  }

  // Fallback based on variant prop
  const variantClasses = {
    success: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30',
    info: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30',
    error: 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30',
    default: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30',
  }

  return `text-xs font-medium px-2 py-0.5 rounded-full ${variantClasses[props.variant || 'default']}`
})
</script>
