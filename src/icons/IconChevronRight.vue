<template>
  <IconBase :size="size" :color="color" :viewBox="viewBox" :class="$attrs.class" v-bind="$attrs">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      d="M9 5l7 7-7 7"
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
