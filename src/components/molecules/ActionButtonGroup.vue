<template>
  <div :class="['flex gap-2', layout === 'vertical' ? 'flex-col' : 'flex-row', containerClass]">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  layout: {
    type: String,
    default: 'vertical',
    validator: value => ['vertical', 'horizontal'].includes(value),
  },
  containerClass: {
    type: String,
    default: '',
  },
})
</script>
