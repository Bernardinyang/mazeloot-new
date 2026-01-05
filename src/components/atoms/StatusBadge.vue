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
    classes: 'bg-success/10 text-success border-success/20',
  },
  ACTIVE: {
    variant: 'success',
    classes: 'bg-success/10 text-success border-success/20',
  },
  DRAFT: {
    variant: 'warning',
    classes: 'bg-warning/10 text-warning border-warning/20',
  },
  ARCHIVED: {
    variant: 'default',
    classes: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30',
  },
  COMPLETED: {
    variant: 'success',
    classes: 'bg-success/10 text-success border-success/20',
  },

  // Collection statuses (title case)
  Published: {
    variant: 'success',
    classes: 'bg-success/10 text-success border-success/20',
  },
  Active: {
    variant: 'success',
    classes: 'bg-success/10 text-success border-success/20',
  },
  Draft: {
    variant: 'warning',
    classes: 'bg-warning/10 text-warning border-warning/20',
  },
  Archived: {
    variant: 'default',
    classes: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30',
  },
  Completed: {
    variant: 'success',
    classes: 'bg-success/10 text-success border-success/20',
  },

  // Collection statuses (lowercase)
  published: {
    variant: 'success',
    classes: 'bg-success/10 text-success border-success/20',
  },
  active: {
    variant: 'success',
    classes: 'bg-success/10 text-success border-success/20',
  },
  draft: {
    variant: 'warning',
    classes: 'bg-warning/10 text-warning border-warning/20',
  },
  archived: {
    variant: 'default',
    classes: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30',
  },
  completed: {
    variant: 'success',
    classes: 'bg-success/10 text-success border-success/20',
  },

  // Other statuses
  Preview: {
    variant: 'warning',
    classes: 'bg-warning/10 text-warning border-warning/20',
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
    classes: 'bg-success/10 text-success border-success/20',
  },
  Scheduled: {
    variant: 'info',
    classes: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30',
  },
  'In stock': {
    variant: 'success',
    classes: 'bg-success/10 text-success border-success/20',
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
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30',
    error: 'bg-destructive/10 text-destructive border-destructive/20',
    default: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30',
  }

  return `text-xs font-medium px-2 py-0.5 rounded-full ${variantClasses[props.variant || 'default']}`
})
</script>
