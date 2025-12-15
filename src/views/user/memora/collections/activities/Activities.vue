<template>
  <CollectionLayout
    v-model:active-tab="activeTab"
    v-model:collection-status="collectionStatus"
    v-model:is-sidebar-collapsed="isSidebarCollapsed"
    :collection="collection"
    :editing-name="''"
    :event-date="eventDate"
    :is-editing-name="false"
    :is-loading="isLoading"
    :is-saving-name="false"
    :is-saving-status="false"
    :presets="presets"
    :selected-preset-id="selectedPresetId"
    :selected-preset-name="selectedPresetName"
    :selected-watermark="selectedWatermark"
    :selected-watermark-name="selectedWatermarkName"
    :watermarks="watermarks"
    @go-back="goBack"
    @handle-status-change="handleStatusChange"
    @handle-date-change="handleDateChange"
    @handle-preset-change="handlePresetChange"
    @handle-watermark-change="handleWatermarkChange"
  >
    <template #sidebar>
      <!-- ACTIVITIES Section - Expanded -->
      <div v-if="activeTab === 'activities' && !isSidebarCollapsed" class="space-y-5">
        <h2 :class="theme.textSecondary" class="text-xs font-bold uppercase tracking-wider mb-4">
          ACTIVITIES
        </h2>
        <div class="space-y-1">
          <router-link
            v-if="collection?.id"
            :class="[
              $route.name === 'collectionActivitiesDownload'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
            :to="{ name: 'collectionActivitiesDownload', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
          >
            <Download :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
            <span :class="theme.textPrimary" class="text-sm font-medium">Download Activity</span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :class="[
              $route.name === 'collectionActivitiesFavourite'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
            :to="{ name: 'collectionActivitiesFavourite', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
          >
            <Heart :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
            <span :class="theme.textPrimary" class="text-sm font-medium">Favourite Activity</span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :class="[
              $route.name === 'collectionActivitiesEmailRegistration'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
            :to="{ name: 'collectionActivitiesEmailRegistration', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
          >
            <Mail :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
            <span :class="theme.textPrimary" class="text-sm font-medium">Email Registration</span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :class="[
              $route.name === 'collectionActivitiesQuickShare'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
            :to="{ name: 'collectionActivitiesQuickShare', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
          >
            <Link :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
            <span :class="theme.textPrimary" class="text-sm font-medium">Quick Share Links</span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :class="[
              $route.name === 'collectionActivitiesPrivatePhotos'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
            :to="{ name: 'collectionActivitiesPrivatePhotos', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
          >
            <Lock :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
            <span :class="theme.textPrimary" class="text-sm font-medium">Private Photos</span>
          </router-link>
        </div>
      </div>

      <!-- ACTIVITIES Section - Collapsed -->
      <div
        v-if="activeTab === 'activities' && isSidebarCollapsed"
        class="flex flex-col items-center gap-2 pt-4"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                v-if="collection?.id"
                :class="[
                  $route.name === 'collectionActivitiesDownload'
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                ]"
                :to="{ name: 'collectionActivitiesDownload', params: { uuid: collection.id } }"
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
                v-if="collection?.id"
                :class="[
                  $route.name === 'collectionActivitiesFavourite'
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                ]"
                :to="{ name: 'collectionActivitiesFavourite', params: { uuid: collection.id } }"
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
                v-if="collection?.id"
                :class="[
                  $route.name === 'collectionActivitiesEmailRegistration'
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                ]"
                :to="{
                  name: 'collectionActivitiesEmailRegistration',
                  params: { uuid: collection.id },
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
                v-if="collection?.id"
                :class="[
                  $route.name === 'collectionActivitiesQuickShare'
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                ]"
                :to="{ name: 'collectionActivitiesQuickShare', params: { uuid: collection.id } }"
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
                v-if="collection?.id"
                :class="[
                  $route.name === 'collectionActivitiesPrivatePhotos'
                    ? 'bg-teal-500 text-white'
                    : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                ]"
                :to="{ name: 'collectionActivitiesPrivatePhotos', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200"
              >
                <Lock class="h-5 w-5" />
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Private Photos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </template>

    <template #content>
      <div
        :class="isSidebarCollapsed ? 'ml-0' : ''"
        class="flex-1 overflow-y-auto custom-scrollbar"
      >
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading activities...</p>
          </div>
        </div>

        <div
          v-else
          :class="isSidebarCollapsed ? 'max-w-full' : ''"
          class="max-w-[50%] p-6 md:p-8 transition-all duration-300"
        >
          <!-- Page Header -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-2">
              <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold">
                Collection Activities
              </h1>
            </div>
            <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
              View and manage all activities related to this collection including downloads,
              favourites, email registrations, share links, and private photo access.
            </p>
          </div>

          <!-- Activities Overview Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30 cursor-pointer"
              @click="
                router.push({
                  name: 'collectionActivitiesDownload',
                  params: { uuid: collection?.id },
                })
              "
            >
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
                >
                  <Download class="h-5 w-5" />
                </div>
                <div>
                  <h3 :class="theme.textPrimary" class="text-sm font-semibold">Downloads</h3>
                  <p :class="theme.textSecondary" class="text-xs">View download activity</p>
                </div>
              </div>
              <p :class="theme.textPrimary" class="text-2xl font-bold">{{ downloadCount }}</p>
            </div>

            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30 cursor-pointer"
              @click="
                router.push({
                  name: 'collectionActivitiesFavourite',
                  params: { uuid: collection?.id },
                })
              "
            >
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                >
                  <Heart class="h-5 w-5" />
                </div>
                <div>
                  <h3 :class="theme.textPrimary" class="text-sm font-semibold">Favourites</h3>
                  <p :class="theme.textSecondary" class="text-xs">View favourite activity</p>
                </div>
              </div>
              <p :class="theme.textPrimary" class="text-2xl font-bold">{{ favouriteCount }}</p>
            </div>

            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30 cursor-pointer"
              @click="
                router.push({
                  name: 'collectionActivitiesEmailRegistration',
                  params: { uuid: collection?.id },
                })
              "
            >
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                >
                  <Mail class="h-5 w-5" />
                </div>
                <div>
                  <h3 :class="theme.textPrimary" class="text-sm font-semibold">
                    Email Registrations
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs">View registered emails</p>
                </div>
              </div>
              <p :class="theme.textPrimary" class="text-2xl font-bold">{{ emailCount }}</p>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h2 :class="theme.textPrimary" class="text-lg font-bold">Quick Access</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <router-link
                v-if="collection?.id"
                :class="[theme.borderSecondary, theme.bgCard]"
                :to="{ name: 'collectionActivitiesQuickShare', params: { uuid: collection.id } }"
                class="p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30 hover:shadow-lg"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Link class="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <h3 :class="theme.textPrimary" class="text-base font-semibold">
                    Quick Share Links
                  </h3>
                </div>
                <p :class="theme.textSecondary" class="text-sm">
                  Manage and view quick share link activity
                </p>
              </router-link>

              <router-link
                v-if="collection?.id"
                :class="[theme.borderSecondary, theme.bgCard]"
                :to="{ name: 'collectionActivitiesPrivatePhotos', params: { uuid: collection.id } }"
                class="p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30 hover:shadow-lg"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Lock class="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <h3 :class="theme.textPrimary" class="text-base font-semibold">Private Photos</h3>
                </div>
                <p :class="theme.textSecondary" class="text-sm">
                  View private photo access and activity
                </p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CollectionLayout>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Download, Heart, Link, Loader2, Lock, Mail } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import CollectionLayout from '@/components/organisms/CollectionLayout.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { usePresetStore } from '@/stores/preset'
import type { Collection } from '@/api/collections'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const presetStore = usePresetStore()

// Collection data
const collection = ref<Collection | null>(null)
const isLoading = ref(false)
const collectionStatus = ref<'draft' | 'published'>('draft')
const eventDate = ref<Date | null>(null)
const selectedPresetId = ref<string>('none')
const selectedPresetName = computed(() => {
  if (selectedPresetId.value === 'none') return null
  const preset = presets.value.find((p: any) => p.id === selectedPresetId.value)
  return preset?.name || null
})
const selectedWatermark = ref('none')
const selectedWatermarkName = computed(() => {
  if (selectedWatermark.value === 'none') return null
  const watermark = watermarks.value.find((w: any) => w.id === selectedWatermark.value)
  return watermark?.name || null
})
const presets = computed(() => presetStore.presets)
const watermarks = computed(() => galleryStore.watermarks || [])

// UI State
const activeTab = ref<'photos' | 'design' | 'settings' | 'activities'>('activities')
const { isSidebarCollapsed } = useSidebarCollapse()

// Activity counts (placeholder - would come from API)
const downloadCount = ref(0)
const favouriteCount = ref(0)
const emailCount = ref(0)

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid as string
  if (!collectionId) return

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    collectionStatus.value = collectionData.status === 'active' ? 'published' : 'draft'
    eventDate.value = collectionData.eventDate ? new Date(collectionData.eventDate) : null
    selectedPresetId.value = (collectionData as any).presetId || 'none'
    selectedWatermark.value = (collectionData as any).watermarkId || 'none'
    // TODO: Fetch activity counts from API
    // downloadCount.value = await fetchDownloadCount(collectionId)
    // favouriteCount.value = await fetchFavouriteCount(collectionId)
    // emailCount.value = await fetchEmailCount(collectionId)
  } catch (error: any) {
    console.error('Failed to load collection:', error)
  } finally {
    isLoading.value = false
  }
})

// Navigation
const goBack = () => {
  router.push({ name: 'manageCollections' })
}

// Handle status change
const handleStatusChange = async (newStatus: string) => {
  if (!collection.value || !newStatus) return
  // Status change logic
}

// Handle date change
const handleDateChange = async (newDate: Date | null) => {
  if (!collection.value) return
  // Date change logic
}

// Handle preset change
const handlePresetChange = async (presetId: string) => {
  if (!collection.value) return
  selectedPresetId.value = presetId
}

// Handle watermark change
const handleWatermarkChange = async (watermarkId: string) => {
  if (!collection.value) return
  selectedWatermark.value = watermarkId
}
</script>
