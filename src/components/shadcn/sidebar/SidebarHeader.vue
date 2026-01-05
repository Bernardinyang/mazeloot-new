<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: String,
})
</script>

<template>
  <div :class="cn('flex flex-col gap-2', props.class)" data-sidebar="header">
    <slot />
  </div>
</template>
