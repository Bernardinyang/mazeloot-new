<template>
  <AppIcon :custom-type="customType" class="size-4" />
</template>

<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  customType: {
    type: String,
    required: true,
  },
})
</script>
