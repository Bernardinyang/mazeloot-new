<template>
  <DashboardCard
    :title="title"
    :description="description"
    :loading="loading"
    :col-span="colSpan"
    :animation-class="animationClass"
  >
    <template #loading>
      <slot name="loading">
        <div class="animate-pulse space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center gap-3">
            <div :class="['h-10 w-10 rounded-lg', theme.bgSkeleton]"></div>
            <div class="flex-1 space-y-2">
              <div :class="['h-4 w-32 rounded', theme.bgSkeleton]"></div>
              <div :class="['h-3 w-24 rounded', theme.bgSkeleton]"></div>
            </div>
          </div>
        </div>
      </slot>
    </template>
    
    <!-- Body content via default slot -->
    <slot />
    
    <template v-if="showFooter" #footer>
      <Button 
        variant="ghost" 
        size="sm" 
        :class="['w-full', theme.textSecondary, theme.bgButtonHover]"
        @click="$emit('footer-click')"
      >
        {{ footerLabel }}
      </Button>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/custom/DashboardCard.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

const props = withDefaults(defineProps<{
  title: string
  description: string
  loading?: boolean
  colSpan?: string
  animationClass?: string
  showFooter?: boolean
  footerLabel?: string
}>(), {
  loading: false,
  colSpan: 'lg:col-span-1',
  animationClass: 'animate-in fade-in slide-in-from-bottom-4',
  showFooter: false,
  footerLabel: 'View All',
})

defineEmits<{
  'footer-click': []
}>()
</script>
