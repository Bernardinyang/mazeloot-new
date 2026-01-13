<template>
  <IconBase :class="$attrs.class" :color="color" :size="size" :viewBox="viewBox" v-bind="$attrs">
    <path
      :stroke-width="strokeWidth"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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
