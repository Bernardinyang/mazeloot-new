<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
      statusClasses,
    ]"
  >
    <component v-if="icon" :is="icon" class="h-3 w-3" />
    <span>{{ label || capitalize(status) }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle2, XCircle, Clock, AlertCircle, Circle } from 'lucide-vue-next'
import { capitalize } from '@/lib/utils'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'subtle', 'outline'].includes(value),
  },
})

const statusConfig = {
  completed: {
    classes: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
    icon: CheckCircle2,
  },
  active: {
    classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    icon: CheckCircle2,
  },
  published: {
    classes: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
    icon: CheckCircle2,
  },
  draft: {
    classes: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20',
    icon: Clock,
  },
  archived: {
    classes: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20',
    icon: AlertCircle,
  },
  pending: {
    classes: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20',
    icon: Clock,
  },
  failed: {
    classes: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    icon: XCircle,
  },
  cancelled: {
    classes: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20',
    icon: XCircle,
  },
}

const statusInfo = computed(() => {
  const normalizedStatus = props.status.toLowerCase()
  return (
    statusConfig[normalizedStatus] || {
      classes: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20',
      icon: Circle,
    }
  )
})

const statusClasses = computed(() => {
  const base = statusInfo.value.classes
  if (props.variant === 'subtle') {
    return base.replace(/\/10/g, '/5').replace(/\/20/g, '/10')
  }
  if (props.variant === 'outline') {
    return base.replace(/bg-[^/]+\/[^ ]+ /g, '').replace(/text-[^ ]+ /g, 'text-current ')
  }
  return base
})

const icon = computed(() => statusInfo.value.icon)
</script>
