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
    classes: 'bg-success/10 text-success border border-success/20 font-semibold',
  },
  ACTIVE: {
    variant: 'info',
    classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold',
  },
  DRAFT: {
    variant: 'warning',
    classes: 'bg-warning/10 text-warning border border-warning/20 font-semibold',
  },
  ARCHIVED: {
    variant: 'default',
    classes: 'bg-gray-500/30 text-gray-700 dark:text-gray-300 border border-gray-500/50 font-semibold',
  },
  COMPLETED: {
    variant: 'success',
    classes: 'bg-success/30 text-success border border-success/50 font-semibold',
  },

  // Collection statuses (title case)
  Published: {
    variant: 'success',
    classes: 'bg-success/10 text-success border border-success/20 font-semibold',
  },
  Active: {
    variant: 'info',
    classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold',
  },
  Draft: {
    variant: 'warning',
    classes: 'bg-warning/10 text-warning border border-warning/20 font-semibold',
  },
  Archived: {
    variant: 'default',
    classes: 'bg-gray-500/30 text-gray-700 dark:text-gray-300 border border-gray-500/50 font-semibold',
  },
  Completed: {
    variant: 'success',
    classes: 'bg-success/30 text-success border border-success/50 font-semibold',
  },

  // Collection statuses (lowercase)
  published: {
    variant: 'success',
    classes: 'bg-success/10 text-success border border-success/20 font-semibold',
  },
  active: {
    variant: 'info',
    classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold',
  },
  draft: {
    variant: 'warning',
    classes: 'bg-warning/30 text-warning border border-warning/50 font-semibold',
  },
  archived: {
    variant: 'default',
    classes: 'bg-gray-500/30 text-gray-700 dark:text-gray-300 border border-gray-500/50 font-semibold',
  },
  completed: {
    variant: 'success',
    classes: 'bg-success/30 text-success border border-success/50 font-semibold',
  },

  // Other statuses
  Preview: {
    variant: 'warning',
    classes: 'bg-warning/30 text-warning border border-warning/50 font-semibold',
  },
  Processing: {
    variant: 'info',
    classes: 'bg-blue-500/30 text-blue-700 dark:text-blue-300 border border-blue-500/50 font-semibold',
  },
  Shipped: {
    variant: 'info',
    classes: 'bg-purple-500/30 text-purple-700 dark:text-purple-300 border border-purple-500/50 font-semibold',
  },
  Delivered: {
    variant: 'success',
    classes: 'bg-success/30 text-success border border-success/50 font-semibold',
  },
  Scheduled: {
    variant: 'info',
    classes: 'bg-blue-500/30 text-blue-700 dark:text-blue-300 border border-blue-500/50 font-semibold',
  },
  'In stock': {
    variant: 'success',
    classes: 'bg-success/30 text-success border border-success/50 font-semibold',
  },
  New: {
    variant: 'info',
    classes: 'bg-blue-500/30 text-blue-700 dark:text-blue-300 border border-blue-500/50 font-semibold',
  },
  Promo: {
    variant: 'info',
    classes: 'bg-purple-500/30 text-purple-700 dark:text-purple-300 border border-purple-500/50 font-semibold',
  },
  done: {
    variant: 'success',
    classes: 'bg-success/10 text-success border border-success/20 font-semibold',
  },
  'Done': {
    variant: 'success',
    classes: 'bg-success/10 text-success border border-success/20 font-semibold',
  },
  'To do': {
    variant: 'default',
    classes: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20 font-semibold',
  },
  'todo': {
    variant: 'default',
    classes: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20 font-semibold',
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
    return `text-xs px-2 py-0.5 rounded-full ${config.classes}`
  }

  // Fallback based on variant prop
  const variantClasses = {
    success: 'bg-success/10 text-success border border-success/20 font-semibold',
    warning: 'bg-warning/10 text-warning border-warning/20 font-semibold',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold',
    error: 'bg-destructive/10 text-destructive border-destructive/20 font-semibold',
    default: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20 font-semibold',
  }

  return `text-xs font-semibold px-2 py-0.5 rounded-full ${variantClasses[props.variant || 'default']}`
})
</script>
