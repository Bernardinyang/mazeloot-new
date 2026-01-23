<template>
  <div class="relative overflow-hidden rounded-xl bg-gradient-to-r p-6 border-2 shadow-lg" :class="bannerClasses">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h3 class="text-lg font-bold" :class="titleClasses">{{ title }}</h3>
        <p class="text-sm" :class="descriptionClasses">{{ description }}</p>
      </div>
      <Button 
        @click="$emit('action')" 
        variant="primary" 
        size="lg" 
        class="group shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <component :is="icon" class="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
        {{ buttonText }}
        <ChevronRight class="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Button } from '@/shared/components/shadcn/button'
import { ChevronRight } from '@/shared/utils/lucideAnimated'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  buttonText: { type: String, required: true },
  icon: { type: Object, required: true },
  color: { type: String, default: 'indigo' },
})

const emit = defineEmits(['action'])

const colorMap = {
  indigo: {
    banner: 'from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-200/50 dark:border-indigo-800/50',
    title: 'text-indigo-900 dark:text-indigo-100',
    description: 'text-indigo-700 dark:text-indigo-300',
  },
  purple: {
    banner: 'from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200/50 dark:border-purple-800/50',
    title: 'text-purple-900 dark:text-purple-100',
    description: 'text-purple-700 dark:text-purple-300',
  },
  yellow: {
    banner: 'from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50 border-yellow-200/50 dark:border-yellow-800/50',
    title: 'text-yellow-900 dark:text-yellow-100',
    description: 'text-yellow-700 dark:text-yellow-300',
  },
  teal: {
    banner: 'from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 border-teal-200/50 dark:border-teal-800/50',
    title: 'text-teal-900 dark:text-teal-100',
    description: 'text-teal-700 dark:text-teal-300',
  },
  pink: {
    banner: 'from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 border-pink-200/50 dark:border-pink-800/50',
    title: 'text-pink-900 dark:text-pink-100',
    description: 'text-pink-700 dark:text-pink-300',
  },
  orange: {
    banner: 'from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border-orange-200/50 dark:border-orange-800/50',
    title: 'text-orange-900 dark:text-orange-100',
    description: 'text-orange-700 dark:text-orange-300',
  },
  cyan: {
    banner: 'from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 border-cyan-200/50 dark:border-cyan-800/50',
    title: 'text-cyan-900 dark:text-cyan-100',
    description: 'text-cyan-700 dark:text-cyan-300',
  },
  emerald: {
    banner: 'from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border-emerald-200/50 dark:border-emerald-800/50',
    title: 'text-emerald-900 dark:text-emerald-100',
    description: 'text-emerald-700 dark:text-emerald-300',
  },
  rose: {
    banner: 'from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50 border-rose-200/50 dark:border-rose-800/50',
    title: 'text-rose-900 dark:text-rose-100',
    description: 'text-rose-700 dark:text-rose-300',
  },
}

const bannerClasses = computed(() => colorMap[props.color]?.banner || colorMap.indigo.banner)
const titleClasses = computed(() => colorMap[props.color]?.title || colorMap.indigo.title)
const descriptionClasses = computed(() => colorMap[props.color]?.description || colorMap.indigo.description)
</script>
