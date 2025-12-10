<template>
  <div class="mt-6 text-center text-sm">
    <span v-if="prefix" class="text-muted-foreground">{{ prefix }} </span>
    <RouterLink :to="routeLocation" class="text-primary hover:underline font-medium">
      {{ text }}
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  to: string | { name: string; params?: any; query?: any }
  text: string
  prefix?: string
}>()

// Convert string to route object if needed
const routeLocation = computed<RouteLocationRaw>(() => {
  if (typeof props.to === 'string') {
    // If it starts with /, it's a path, otherwise treat as route name
    return props.to.startsWith('/') ? { path: props.to } : { name: props.to }
  }
  return props.to
})
</script>

