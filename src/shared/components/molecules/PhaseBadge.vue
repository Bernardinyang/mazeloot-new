<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border',
      phaseClasses,
    ]"
  >
    <component :is="icon" class="h-3 w-3" />
    <span>{{ label || capitalize(phase) }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { Folder, Image as ImageIcon, CheckSquare } from '@/shared/utils/lucideAnimated'
import { capitalize } from '@/shared/lib/utils'

const props = defineProps({
  phase: {
    type: String,
    required: true,
    validator: value => ['collection', 'selection', 'proofing'].includes(value),
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

const phaseConfig = {
  collection: {
    classes: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    icon: Folder,
    label: 'Collection',
  },
  selection: {
    classes: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    icon: ImageIcon,
    label: 'Selection',
  },
  proofing: {
    classes: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    icon: CheckSquare,
    label: 'Proofing',
  },
}

const phaseInfo = computed(() => {
  return phaseConfig[props.phase] || phaseConfig.selection
})

const phaseClasses = computed(() => {
  const base = phaseInfo.value.classes
  if (props.variant === 'subtle') {
    return base.replace(/\/10/g, '/5').replace(/\/20/g, '/10')
  }
  if (props.variant === 'outline') {
    return base.replace(/bg-[^/]+\/[^ ]+ /g, '').replace(/text-[^ ]+ /g, 'text-current ')
  }
  return base
})

const icon = computed(() => phaseInfo.value.icon)
</script>
