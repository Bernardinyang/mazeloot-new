<template>
  <p v-if="message" :class="cn('text-sm font-medium text-destructive mt-1', $attrs.class)">
    {{ message }}
  </p>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  message?: string
}>()
</script>
