<template>
  <div
    :class="
      cn(
        'rounded-2xl border bg-card text-card-foreground shadow-sm',
        ($attrs.class as string) || ''
      )
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/shared/lib/utils'
</script>
