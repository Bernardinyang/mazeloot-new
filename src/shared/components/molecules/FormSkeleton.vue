<template>
  <div class="space-y-6 animate-pulse">
    <div v-for="i in rows" :key="i" class="space-y-2">
      <Skeleton class="h-4 w-24 rounded" />
      <Skeleton class="h-10 w-full rounded" />
    </div>
    <div class="flex gap-2 pt-4">
      <Skeleton class="h-10 w-24 rounded" />
      <Skeleton class="h-10 w-20 rounded" />
    </div>
  </div>
</template>

<script setup>
import Skeleton from '@/shared/components/molecules/Skeleton.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

defineProps({
  rows: { type: Number, default: 6 },
})

const theme = useThemeClasses()
</script>
