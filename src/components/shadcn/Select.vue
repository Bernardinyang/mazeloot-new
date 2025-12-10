<template>
  <div class="relative">
    <select
      :class="cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer',
        $attrs.class
      )"
      v-bind="$attrs"
    >
      <slot />
    </select>
    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <IconChevronDown class="h-4 w-4 text-muted-foreground" :size="16" color="muted-foreground" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import IconChevronDown from '@/icons/IconChevronDown.vue'
</script>

