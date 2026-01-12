<template>
  <IconBase :class="$attrs.class" :color="color" :size="size" :viewBox="viewBox" v-bind="$attrs">
    <path
      :stroke-width="strokeWidth"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconBase>
</template>

<script setup>
import IconBase from './IconBase.vue'

const props = defineProps({
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
  viewBox: {
    type: String,
    default: '0 0 24 24',
  },
})
</script>
