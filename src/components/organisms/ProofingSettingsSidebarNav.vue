<template>
  <!-- SETTINGS Section - Expanded -->
  <div v-if="!props.isSidebarCollapsed" class="space-y-5">
    <h2 :class="theme.textSecondary" class="text-xs font-bold uppercase tracking-wider mb-4">
      SETTINGS
    </h2>
    <div class="space-y-1">
      <router-link
        v-if="props.proofingId"
        :class="[
          route.query?.tab === 'settings' && route.query?.section === 'general'
            ? 'bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-violet-500/40',
        ]"
        :to="{
          name: 'proofingDetail',
          params: { id: props.proofingId },
          query: { tab: 'settings', section: 'general' },
        }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
      >
        <Settings :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
        <span :class="theme.textPrimary" class="text-sm font-medium">General</span>
      </router-link>
    </div>
  </div>

  <!-- SETTINGS Section - Collapsed -->
  <div v-else class="flex flex-col items-center gap-2 pt-4">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            v-if="props.proofingId"
            :class="[
              route.query?.tab === 'settings' && route.query?.section === 'general'
                ? 'bg-violet-500 text-white'
                : '',
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
import { Settings } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useThemeClasses } from '@/composables/useThemeClasses'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip/index'

const theme = useThemeClasses()
const route = useRoute()

const props = defineProps({
  proofingId: { type: String, default: '' },
  isSidebarCollapsed: { type: Boolean, required: true },
})
</script>
