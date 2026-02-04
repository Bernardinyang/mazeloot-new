<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/components/shadcn/input'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Input
    data-sidebar="input"
    :class="
      cn(
        'h-8 w-full bg-background shadow-none ',
        props.class
      )
    "
  >
    <slot />
  </Input>
</template>
