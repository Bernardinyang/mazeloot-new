<script setup>
import { computed } from 'vue'
import Card from '@/shared/components/shadcn/Card.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'

import { Skeleton } from '@/shared/components/shadcn/skeleton'
import { useNavigation } from '@/shared/composables/useNavigation'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: Object,
    required: true,
  },
  trend: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: 'primary',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  to: {
    type: Object,
    default: null,
  },
})

const { navigateTo } = useNavigation()

const iconColorClasses = computed(() => {
  const colors = {
    primary: 'text-primary bg-primary/10',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
    green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30',
    teal: 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30',
  }
  return colors[props.color] || colors.primary
})
</script>

<template>
  <div
    :class="[to && 'cursor-pointer']"
    :role="to ? 'button' : undefined"
    :tabindex="to ? 0 : undefined"
    @click="to && navigateTo(to)"
    @keydown.enter="to && navigateTo(to)"
    @keydown.space.prevent="to && navigateTo(to)"
  >
    <Card
      class="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-border"
    >
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    />
    <CardHeader v-if="!loading" class="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
      <CardTitle class="text-sm font-medium text-foreground/80">{{ title }}</CardTitle>
      <div
        :class="[
          'h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110',
          iconColorClasses,
        ]"
      >
        <component :is="icon" class="h-5 w-5" />
      </div>
    </CardHeader>
    <CardHeader v-else class="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
      <Skeleton class="h-4 w-24 rounded-md" />
      <Skeleton class="h-10 w-10 rounded-xl" />
    </CardHeader>
    <CardContent class="relative z-10">
      <div v-if="!loading" class="flex items-baseline gap-2 mb-1">
        <div class="text-3xl font-bold tracking-tight text-foreground">{{ value }}</div>
        <span
          v-if="trend"
          class="text-xs font-medium px-1.5 py-0.5 rounded-full"
          :class="
            trend.startsWith('+')
              ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
              : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
          "
        >
          {{ trend }}
        </span>
      </div>
      <div v-else class="space-y-2">
        <Skeleton class="h-8 w-20 rounded-md" />
        <Skeleton class="h-3 w-36 rounded-md" />
      </div>
      <p v-if="!loading" class="text-xs text-muted-foreground mt-1">{{ description }}</p>
    </CardContent>
  </Card>
  </div>
</template>
