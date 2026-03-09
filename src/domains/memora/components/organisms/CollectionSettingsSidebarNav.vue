<template>
  <!-- SETTINGS Section - Expanded -->
  <div v-if="!props.isSidebarCollapsed" class="space-y-5">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-4 text-primary-foreground/80">
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
            ? 'bg-white/20 border-l-4 border-accent text-primary-foreground'
            : 'text-primary-foreground/90 hover:bg-white/10 hover:border-l-4 hover:border-white/30',
        ]"
        :to="{ name: 'collectionSettingsGeneral', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group border-l-4 border-transparent"
      >
        <Settings class="h-4 w-4 flex-shrink-0 opacity-90" />
        <span class="text-sm font-medium">General</span>
      </router-link>
      <router-link
        v-if="props.collectionId"
        :class="[
          route.name === 'collectionSettingsPrivacy'
            ? 'bg-white/20 border-l-4 border-accent text-primary-foreground'
            : 'text-primary-foreground/90 hover:bg-white/10 hover:border-l-4 hover:border-white/30',
        ]"
        :to="{ name: 'collectionSettingsPrivacy', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group border-l-4 border-transparent"
      >
        <Lock class="h-4 w-4 flex-shrink-0 opacity-90" />
        <span class="text-sm font-medium">Privacy</span>
      </router-link>
      <router-link
        v-if="props.collectionId"
        :class="[
          route.name?.toString().startsWith('collectionSettingsDownload')
            ? 'bg-white/20 border-l-4 border-accent text-primary-foreground'
            : 'text-primary-foreground/90 hover:bg-white/10 hover:border-l-4 hover:border-white/30',
        ]"
        :to="{ name: 'collectionSettingsDownload', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group justify-between border-l-4 border-transparent"
      >
        <div class="flex items-center gap-3">
          <Download class="h-4 w-4 flex-shrink-0 opacity-90" />
          <span class="text-sm font-medium">Download</span>
        </div>
        <span
          :class="
            props.downloadEnabled
              ? 'bg-green-400/30 text-green-100'
              : 'bg-white/20 text-primary-foreground/80'
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
            ? 'bg-white/20 border-l-4 border-accent text-primary-foreground'
            : 'text-primary-foreground/90 hover:bg-white/10 hover:border-l-4 hover:border-white/30',
        ]"
        :to="{ name: 'collectionSettingsFavorite', params: { uuid: props.collectionId } }"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group justify-between border-l-4 border-transparent"
      >
        <div class="flex items-center gap-3">
          <Heart class="h-4 w-4 flex-shrink-0 opacity-90" />
          <span class="text-sm font-medium">Favorite</span>
        </div>
        <span
          :class="
            props.favoriteEnabled
              ? 'bg-green-400/30 text-green-100'
              : 'bg-white/20 text-primary-foreground/80'
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
            :class="[route.name === 'collectionSettingsGeneral' ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/90 hover:bg-white/20']"
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
            :class="[route.name === 'collectionSettingsPrivacy' ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/90 hover:bg-white/20']"
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
                ? 'bg-accent text-accent-foreground'
                : 'text-primary-foreground/90 hover:bg-white/20',
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
            :class="[route.name === 'collectionSettingsFavorite' ? 'bg-accent text-accent-foreground' : 'text-primary-foreground/90 hover:bg-white/20']"
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
import { Download, Heart, Lock, Settings } from '@/shared/utils/lucideAnimated'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/shadcn/tooltip'
import { Skeleton } from '@/shared/components/shadcn/skeleton'

const props = defineProps({
  collectionId: { type: String, default: '' },
  isSidebarCollapsed: { type: Boolean, required: true },
  downloadEnabled: { type: Boolean, default: false },
  favoriteEnabled: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
})

const route = useRoute()
</script>
