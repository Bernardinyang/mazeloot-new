<template>
  <!-- DESIGN Section - Expanded -->
  <div v-if="!props.isSidebarCollapsed" class="space-y-5">
    <!-- Cover Sub-Navigation -->
    <div class="space-y-1">
      <router-link
        :class="[
          route.name === 'collectionCover'
            ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-l-4 border-teal-500'
            : '',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
        ]"
        :to="{ name: 'collectionCover', params: { uuid: props.collectionId || route.params.uuid } }"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left"
      >
        <ImageIcon class="h-4 w-4 shrink-0" />
        <span class="text-sm font-medium">Cover</span>
      </router-link>
      <router-link
        :class="[
          route.name === 'collectionTypography'
            ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-l-4 border-teal-500'
            : '',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
        ]"
        :to="{
          name: 'collectionTypography',
          params: { uuid: props.collectionId || route.params.uuid },
        }"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left"
      >
        <span class="text-lg font-bold">T</span>
        <span class="text-sm font-medium">Typography</span>
      </router-link>
      <router-link
        :class="[
          route.name === 'collectionColor'
            ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-l-4 border-teal-500'
            : '',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
        ]"
        :to="{ name: 'collectionColor', params: { uuid: props.collectionId || route.params.uuid } }"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left"
      >
        <div :class="theme.borderSecondary" class="w-4 h-4 rounded border"></div>
        <span class="text-sm font-medium">Color</span>
      </router-link>
      <router-link
        :class="[
          route.name === 'collectionGrid'
            ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border-l-4 border-teal-500'
            : '',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
        ]"
        :to="{ name: 'collectionGrid', params: { uuid: props.collectionId || route.params.uuid } }"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left"
      >
        <Grid3x3 class="h-4 w-4 shrink-0" />
        <span class="text-sm font-medium">Grid</span>
      </router-link>
    </div>
  </div>

  <!-- DESIGN Section - Collapsed (Icon Only) -->
  <div v-else class="flex flex-col items-center gap-2 pt-4">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            :class="[
              route.name === 'collectionCover'
                ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400'
                : '',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
            :to="{
              name: 'collectionCover',
              params: { uuid: props.collectionId || route.params.uuid },
            }"
            class="p-2.5 rounded-lg transition-all duration-200"
          >
            <ImageIcon class="h-5 w-5" />
          </router-link>
        </TooltipTrigger>
        <TooltipContent :class="[theme.bgCard, theme.borderCard]" side="right">
          <p :class="theme.textPrimary" class="text-sm font-semibold">Cover</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            :class="[
              route.name === 'collectionTypography'
                ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400'
                : '',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
            :to="{
              name: 'collectionTypography',
              params: { uuid: props.collectionId || route.params.uuid },
            }"
            class="p-2.5 rounded-lg transition-all duration-200"
          >
            <span class="text-lg font-bold">T</span>
          </router-link>
        </TooltipTrigger>
        <TooltipContent :class="[theme.bgCard, theme.borderCard]" side="right">
          <p :class="theme.textPrimary" class="text-sm font-semibold">Typography</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            :class="[
              route.name === 'collectionColor'
                ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400'
                : '',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
            :to="{
              name: 'collectionColor',
              params: { uuid: props.collectionId || route.params.uuid },
            }"
            class="p-2.5 rounded-lg transition-all duration-200"
          >
            <div :class="theme.borderSecondary" class="w-5 h-5 rounded border"></div>
          </router-link>
        </TooltipTrigger>
        <TooltipContent :class="[theme.bgCard, theme.borderCard]" side="right">
          <p :class="theme.textPrimary" class="text-sm font-semibold">Color</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            :class="[
              route.name === 'collectionGrid'
                ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400'
                : '',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
            :to="{
              name: 'collectionGrid',
              params: { uuid: props.collectionId || route.params.uuid },
            }"
            class="p-2.5 rounded-lg transition-all duration-200"
          >
            <Grid3x3 class="h-5 w-5" />
          </router-link>
        </TooltipTrigger>
        <TooltipContent :class="[theme.bgCard, theme.borderCard]" side="right">
          <p :class="theme.textPrimary" class="text-sm font-semibold">Grid</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Grid3x3, ImageIcon } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  collectionId: { type: String, default: '' },
  isSidebarCollapsed: { type: Boolean, required: true },
})

const theme = useThemeClasses()
const route = useRoute()
</script>
