<template>
  <!-- SETTINGS Section - Expanded -->
  <div v-if="!props.isSidebarCollapsed" class="space-y-5">
    <h2 :class="theme.textSecondary" class="text-xs font-bold uppercase tracking-wider mb-4">
      SETTINGS
    </h2>
    <!-- Skeleton Loader -->
    <div v-if="props.isLoading" class="space-y-1">
      <div
        v-for="i in 4"
        :key="i"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg"
      >
        <Skeleton class="h-4 w-4 rounded" />
        <Skeleton class="h-4 w-20 rounded-md" />
        <Skeleton v-if="i > 2" class="h-5 w-10 rounded-full ml-auto" />
      </div>
    </div>
    <div v-else class="space-y-1">
      <router-link
        v-if="props.collectionId"
        :class="[
          route.name === 'collectionSettingsGeneral'
            ? 'bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-violet-500/40',
        ]"
        :to="{ name: 'collectionSettingsGeneral', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
      >
        <Settings :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
        <span :class="theme.textPrimary" class="text-sm font-medium">General</span>
      </router-link>
      <router-link
        v-if="props.collectionId"
        :class="[
          route.name === 'collectionSettingsPrivacy'
            ? 'bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-violet-500/40',
        ]"
        :to="{ name: 'collectionSettingsPrivacy', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
      >
        <Lock :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
        <span :class="theme.textPrimary" class="text-sm font-medium">Privacy</span>
      </router-link>
      <router-link
        v-if="props.collectionId"
        :class="[
          route.name?.toString().startsWith('collectionSettingsDownload')
            ? 'bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-violet-500/40',
        ]"
        :to="{ name: 'collectionSettingsDownload', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group justify-between"
      >
        <div class="flex items-center gap-3">
          <Download :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
          <span :class="theme.textPrimary" class="text-sm font-medium">Download</span>
        </div>
        <span
          :class="
            props.downloadEnabled
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
          "
          class="px-2 py-0.5 rounded-full text-xs font-semibold"
        >
          {{ props.downloadEnabled ? 'ON' : 'OFF' }}
        </span>
      </router-link>
      <router-link
        v-if="props.collectionId"
        :class="[
          route.name === 'collectionSettingsFavorite'
            ? 'bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-violet-500/40',
        ]"
        :to="{ name: 'collectionSettingsFavorite', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group justify-between"
      >
        <div class="flex items-center gap-3">
          <Heart :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
          <span :class="theme.textPrimary" class="text-sm font-medium">Favorite</span>
        </div>
        <span
          :class="
            props.favoriteEnabled
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
          "
          class="px-2 py-0.5 rounded-full text-xs font-semibold"
        >
          {{ props.favoriteEnabled ? 'ON' : 'OFF' }}
        </span>
      </router-link>
    </div>
  </div>

  <!-- SETTINGS Section - Collapsed -->
  <div v-else class="flex flex-col items-center gap-2 pt-4">
    <!-- Skeleton Loader -->
    <div v-if="props.isLoading" class="flex flex-col items-center gap-2">
      <Skeleton
        v-for="i in 4"
        :key="i"
        class="h-10 w-10 rounded-lg"
      />
    </div>
    <TooltipProvider v-else>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            v-if="props.collectionId"
            :class="[route.name === 'collectionSettingsGeneral' ? 'bg-violet-500 text-white' : '']"
            :to="{ name: 'collectionSettingsGeneral', params: { uuid: props.collectionId } }"
            class="p-3 rounded-lg transition-all duration-200"
          >
            <Settings class="h-5 w-5" />
          </router-link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>General</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            v-if="props.collectionId"
            :class="[route.name === 'collectionSettingsPrivacy' ? 'bg-violet-500 text-white' : '']"
            :to="{ name: 'collectionSettingsPrivacy', params: { uuid: props.collectionId } }"
            class="p-3 rounded-lg transition-all duration-200"
          >
            <Lock class="h-5 w-5" />
          </router-link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Privacy</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            v-if="props.collectionId"
            :class="[
              route.name?.toString().startsWith('collectionSettingsDownload')
                ? 'bg-violet-500 text-white'
                : '',
            ]"
            :to="{ name: 'collectionSettingsDownload', params: { uuid: props.collectionId } }"
            class="p-3 rounded-lg transition-all duration-200 relative"
          >
            <Download class="h-5 w-5" />
            <span
              v-if="props.downloadEnabled"
              class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
            ></span>
          </router-link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Download</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger as-child>
          <router-link
            v-if="props.collectionId"
            :class="[route.name === 'collectionSettingsFavorite' ? 'bg-violet-500 text-white' : '']"
            :to="{ name: 'collectionSettingsFavorite', params: { uuid: props.collectionId } }"
            class="p-3 rounded-lg transition-all duration-200 relative"
          >
            <Heart class="h-5 w-5" />
            <span
              v-if="props.favoriteEnabled"
              class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
            ></span>
          </router-link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Favorite</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Download, Heart, Lock, Settings } from 'lucide-vue-next'
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
  downloadEnabled: { type: Boolean, default: false },
  favoriteEnabled: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
})

const theme = useThemeClasses()
const route = useRoute()
</script>
