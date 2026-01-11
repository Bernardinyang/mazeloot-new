<template>
  <!-- ACTIVITIES Section - Expanded -->
  <div v-if="!props.isSidebarCollapsed" class="space-y-5">
    <h2 :class="theme.textSecondary" class="text-xs font-bold uppercase tracking-wider mb-4">
      ACTIVITIES
    </h2>
    <!-- Skeleton Loader -->
    <div v-if="props.isLoading" class="space-y-1">
      <div
        v-for="i in 5"
        :key="i"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg"
      >
        <Skeleton class="h-4 w-4 rounded" />
        <Skeleton class="h-4 w-32 rounded-md" />
      </div>
    </div>
    <div v-else class="space-y-1">
      <router-link
        v-if="props.collectionId"
        :class="[
          route.name === 'collectionActivitiesDownload'
            ? 'bg-accent/10 dark:bg-accent/20 border-l-4 border-accent'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-accent/40',
        ]"
        :to="{ name: 'collectionActivitiesDownload', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
      >
        <Download :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
        <span :class="theme.textPrimary" class="text-sm font-medium">Download Activity</span>
      </router-link>
      <router-link
        v-if="props.collectionId"
        :class="[
          route.name === 'collectionActivitiesFavourite'
            ? 'bg-accent/10 dark:bg-accent/20 border-l-4 border-accent'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-accent/40',
        ]"
        :to="{ name: 'collectionActivitiesFavourite', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
      >
        <Heart :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
        <span :class="theme.textPrimary" class="text-sm font-medium">Favourite Activity</span>
      </router-link>
      <router-link
        v-if="props.collectionId"
        :class="[
          route.name === 'collectionActivitiesEmailRegistration'
            ? 'bg-accent/10 dark:bg-accent/20 border-l-4 border-accent'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-accent/40',
        ]"
        :to="{
          name: 'collectionActivitiesEmailRegistration',
          params: { uuid: props.collectionId },
        }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
      >
        <Mail :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
        <span :class="theme.textPrimary" class="text-sm font-medium">Email Registration</span>
      </router-link>
      <router-link
        v-if="props.collectionId"
        :class="[
          route.name === 'collectionActivitiesQuickShare'
            ? 'bg-accent/10 dark:bg-accent/20 border-l-4 border-accent'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-accent/40',
        ]"
        :to="{ name: 'collectionActivitiesQuickShare', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
      >
        <Link :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
        <span :class="theme.textPrimary" class="text-sm font-medium">Quick Share Links</span>
      </router-link>
      <router-link
        v-if="props.collectionId"
        :class="[
          route.name === 'collectionActivitiesPrivateMedia'
            ? 'bg-accent/10 dark:bg-accent/20 border-l-4 border-accent'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-accent/40',
        ]"
        :to="{ name: 'collectionActivitiesPrivateMedia', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
      >
        <Lock :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
        <span :class="theme.textPrimary" class="text-sm font-medium">Private Media</span>
      </router-link>
    </div>
  </div>

  <!-- ACTIVITIES Section - Collapsed -->
  <div v-else class="flex flex-col items-center gap-2 pt-4">
    <!-- Skeleton Loader -->
    <div v-if="props.isLoading" class="flex flex-col items-center gap-2">
      <Skeleton
        v-for="i in 5"
        :key="i"
        class="h-10 w-10 rounded-lg"
      />
    </div>
    <TooltipProvider v-else>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            v-if="props.collectionId"
            :class="[route.name === 'collectionActivitiesDownload' ? 'bg-accent text-accent-foreground' : '']"
            :to="{ name: 'collectionActivitiesDownload', params: { uuid: props.collectionId } }"
            class="p-3 rounded-lg transition-all duration-200"
          >
            <Download class="h-5 w-5" />
          </router-link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Download Activity</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            v-if="props.collectionId"
            :class="[
              route.name === 'collectionActivitiesFavourite' ? 'bg-accent text-accent-foreground' : '',
            ]"
            :to="{ name: 'collectionActivitiesFavourite', params: { uuid: props.collectionId } }"
            class="p-3 rounded-lg transition-all duration-200"
          >
            <Heart class="h-5 w-5" />
          </router-link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Favourite Activity</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            v-if="props.collectionId"
            :class="[
              route.name === 'collectionActivitiesEmailRegistration'
                ? 'bg-accent text-accent-foreground'
                : '',
            ]"
            :to="{
              name: 'collectionActivitiesEmailRegistration',
              params: { uuid: props.collectionId },
            }"
            class="p-3 rounded-lg transition-all duration-200"
          >
            <Mail class="h-5 w-5" />
          </router-link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Email Registration</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            v-if="props.collectionId"
            :class="[
              route.name === 'collectionActivitiesQuickShare' ? 'bg-accent text-accent-foreground' : '',
            ]"
            :to="{ name: 'collectionActivitiesQuickShare', params: { uuid: props.collectionId } }"
            class="p-3 rounded-lg transition-all duration-200"
          >
            <Link class="h-5 w-5" />
          </router-link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Quick Share Links</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            v-if="props.collectionId"
            :class="[
              route.name === 'collectionActivitiesPrivateMedia' ? 'bg-accent text-accent-foreground' : '',
            ]"
            :to="{
              name: 'collectionActivitiesPrivateMedia',
              params: { uuid: props.collectionId },
            }"
            class="p-3 rounded-lg transition-all duration-200"
          >
            <Lock class="h-5 w-5" />
          </router-link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Private Media</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Download, Heart, Link, Lock, Mail } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { Skeleton } from '@/components/shadcn/skeleton'

const props = defineProps({
  collectionId: { type: String, default: '' },
  isSidebarCollapsed: { type: Boolean, required: true },
  isLoading: { type: Boolean, default: false },
})

const theme = useThemeClasses()
const route = useRoute()
</script>
