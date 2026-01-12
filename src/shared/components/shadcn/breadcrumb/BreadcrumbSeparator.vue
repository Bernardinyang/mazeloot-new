<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { ChevronRightIcon } from '@radix-icons/vue'
import { cn } from '@/shared/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  separator?: 'chevron-right' | 'chevron-left' | 'slash' | 'dot' | 'custom'
  customSeparator?: any
}>()
</script>

<template>
  <li role="presentation" aria-hidden="true" :class="cn('[&>svg]:size-3.5', props.class)">
    <slot>
      <ChevronRightIcon />
    </slot>
  </li>
</template>
