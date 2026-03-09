<template>
  <!-- SETTINGS Section - Expanded -->
  <div v-if="!props.isSidebarCollapsed" class="space-y-5">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-4 text-primary-foreground/80">
      SETTINGS
    </h2>
    <!-- Skeleton Loader -->
    <div v-if="props.isLoading" class="space-y-1">
      <div class="flex items-center gap-3 px-4 py-2.5 rounded-lg">
        <Skeleton class="h-4 w-4 rounded" />
        <Skeleton class="h-4 w-20 rounded-md" />
      </div>
    </div>
    <div v-else class="space-y-1">
      <router-link
        v-if="props.proofingId"
        :class="[
          route.query?.tab === 'settings' && route.query?.section === 'general'
            ? 'bg-white/20 border-l-4 border-accent text-primary-foreground'
            : 'text-primary-foreground/90 hover:bg-white/10 hover:border-l-4 hover:border-white/30',
        ]"
        :to="{
          name: 'proofingDetail',
          params: { id: props.proofingId },
          query: { tab: 'settings', section: 'general' },
        }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group border-l-4 border-transparent"
      >
        <Settings class="h-4 w-4 flex-shrink-0 opacity-90" />
        <span class="text-sm font-medium">General</span>
      </router-link>
    </div>
  </div>

  <!-- SETTINGS Section - Collapsed -->
  <div v-else class="flex flex-col items-center gap-2 pt-4">
    <!-- Skeleton Loader -->
    <div v-if="props.isLoading" class="flex flex-col items-center gap-2">
      <Skeleton class="h-10 w-10 rounded-lg" />
    </div>
    <TooltipProvider v-else>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            v-if="props.proofingId"
            :class="[
              route.query?.tab === 'settings' && route.query?.section === 'general'
                ? 'bg-accent text-accent-foreground'
                : 'text-primary-foreground/90 hover:bg-white/20',
            ]"
            :to="{
              name: 'proofingDetail',
              params: { id: props.proofingId },
              query: { tab: 'settings', section: 'general' },
            }"
            class="p-3 rounded-lg transition-all duration-200"
          >
            <Settings class="h-5 w-5" />
          </router-link>
        </TooltipTrigger>
        <TooltipContent>
          <p>General Settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<script setup>
import { Settings } from '@/shared/utils/lucideAnimated'
import { useRoute } from 'vue-router'
import { Skeleton } from '@/shared/components/shadcn/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/shadcn/tooltip/index'

const route = useRoute()

const props = defineProps({
  proofingId: { type: String, default: '' },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
})
</script>
