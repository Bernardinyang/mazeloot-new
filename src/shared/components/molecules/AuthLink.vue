<template>
  <div class="mt-6 text-center text-sm">
    <template class="flex items-center justify-center gap-2">
      <span v-if="prefix" class="text-muted-foreground">{{ prefix }} </span>
      <RouterLink :to="routeLocation" class="text-accent dark:text-accent-300 hover:underline">
        {{ text }}
      </RouterLink>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: undefined,
  },
})

// Convert string to route object if needed
const routeLocation = computed(() => {
  if (typeof props.to === 'string') {
    // If it starts with /, it's a path, otherwise treat as route name
    return props.to.startsWith('/') ? { path: props.to } : { name: props.to }
  }
  return props.to
})
</script>
