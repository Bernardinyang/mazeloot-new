<template>
  <IconBase :class="$attrs.class" :color="color" :size="size" :viewBox="viewBox" v-bind="$attrs">
    <path
      :stroke-width="strokeWidth"
      d="M9 5l7 7-7 7"
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
