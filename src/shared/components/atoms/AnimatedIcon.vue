<script setup>
import { h } from 'vue'

const props = defineProps({
  icon: {
    type: Object,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 24,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  strokeWidth: {
    type: [Number, String],
    default: 2,
  },
})

defineOptions({
  name: 'AnimatedIcon',
})
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
    class="lucide-animated"
  />
</template>

<style scoped>
.lucide-animated {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.lucide-animated:hover {
  transform: scale(1.1);
}

.lucide-animated:active {
  transform: scale(0.95);
}
</style>
