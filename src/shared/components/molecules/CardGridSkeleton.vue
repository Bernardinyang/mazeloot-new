<template>
  <div
    :class="[
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6',
      gridClass,
    ]"
  >
    <div
      v-for="i in count"
      :key="i"
      :class="[
        'rounded-xl border overflow-hidden',
        theme.bgCard,
        theme.borderCard,
      ]"
    >
      <Skeleton :class="['aspect-[4/3] rounded-none']" />
      <div class="p-4 space-y-3">
        <Skeleton class="h-5 w-3/4 rounded" />
        <div class="flex items-center gap-2">
          <Skeleton class="h-3 w-20 rounded" />
          <Skeleton class="h-1 w-1 rounded-full" />
          <Skeleton class="h-3 w-24 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from '@/shared/components/molecules/Skeleton.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

defineProps({
  count: { type: Number, default: 8 },
  gridClass: { type: String, default: '' },
})

const theme = useThemeClasses()
</script>
