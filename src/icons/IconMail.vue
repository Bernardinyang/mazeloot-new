<template>
  <IconBase :size="size" :color="color" :viewBox="viewBox" :class="$attrs.class" v-bind="$attrs">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </IconBase>
</template>

<script setup lang="ts">
import IconBase from './IconBase.vue'

withDefaults(
  defineProps<{
    size?: number | string
    color?: string
    strokeWidth?: number | string
    viewBox?: string
  }>(),
  {
    size: 24,
    strokeWidth: 2,
    viewBox: '0 0 24 24',
  }
)
</script>
