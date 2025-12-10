<template>
  <AppIcon :custom-type="customType" class="size-4" />
</template>

<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import type { MazelootProduct } from '@/constants/products'

defineProps<{
  customType: MazelootProduct['customType']
}>()
</script>
