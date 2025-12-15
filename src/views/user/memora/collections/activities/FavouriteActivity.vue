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
    </template>

    <template #content>
      <div
        :class="isSidebarCollapsed ? 'ml-0' : ''"
        class="flex-1 overflow-y-auto custom-scrollbar"
      >
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading favourite activity...</p>
          </div>
        </div>

        <div
          v-else
          :class="isSidebarCollapsed ? 'max-w-full' : ''"
          class="max-w-7xl p-6 md:p-8 transition-all duration-300"
        >
          <!-- Page Header -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold">
                  Favourite Activity
                </h1>
              </div>
              <div class="flex items-center gap-3">
                <Button
                  :class="[theme.borderSecondary, theme.textPrimary]"
                  class="gap-2"
                  size="sm"
                  variant="outline"
                  @click="exportData"
                >
                  <Download class="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
              Track all favourite activity for this collection. See which photos users have marked
              as favourites.
            </p>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Total Favourites</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ totalFavourites }}</p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Unique Users</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ uniqueUsers }}</p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Most Favourited</p>
              <p :class="theme.textPrimary" class="text-lg font-bold">
                {{ mostFavouritedPhoto?.name || 'N/A' }}
              </p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">This Week</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ thisWeekFavourites }}</p>
            </div>
          </div>

          <!-- Filters -->
          <div
            :class="[theme.borderSecondary, theme.bgCard]"
            class="p-4 rounded-2xl border-2 mb-6 flex flex-wrap items-center gap-4"
          >
            <Input
              v-model="searchQuery"
              :class="[theme.bgInput, theme.borderInput, theme.textInput]"
              class="flex-1 min-w-[200px]"
              placeholder="Search by email, name, or photo..."
            />
            <Select v-model="dateFilter">
              <SelectTrigger :class="[theme.bgInput, theme.borderInput]" class="w-[180px]">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent :class="[theme.bgCard, theme.borderCard]">
                <SelectItem :class="[theme.textPrimary, theme.bgButtonHover]" value="all">
                  All time
                </SelectItem>
                <SelectItem :class="[theme.textPrimary, theme.bgButtonHover]" value="today">
                  Today
                </SelectItem>
                <SelectItem :class="[theme.textPrimary, theme.bgButtonHover]" value="week">
                  This week
                </SelectItem>
                <SelectItem :class="[theme.textPrimary, theme.bgButtonHover]" value="month">
                  This month
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Activity Table -->
          <div
            :class="[theme.borderSecondary, theme.bgCard]"
            class="rounded-2xl border-2 overflow-hidden"
          >
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr :class="theme.borderSecondary" class="border-b">
                    <th
                      :class="theme.textSecondary"
                      class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Date & Time
                    </th>
                    <th
                      :class="theme.textSecondary"
                      class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      :class="theme.textSecondary"
                      class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Photo
                    </th>
                    <th
                      :class="theme.textSecondary"
                      class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody :class="theme.borderSecondary" class="divide-y">
                  <tr
                    v-for="activity in filteredActivities"
                    :key="activity.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div :class="theme.textPrimary" class="text-sm font-medium">
                        {{ formatDate(activity.timestamp) }}
                      </div>
                      <div :class="theme.textSecondary" class="text-xs">
                        {{ formatTime(activity.timestamp) }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center"
                        >
                          <span class="text-xs font-semibold text-pink-600 dark:text-pink-400">
                            {{ activity.userEmail?.charAt(0).toUpperCase() || '?' }}
                          </span>
                        </div>
                        <div>
                          <div :class="theme.textPrimary" class="text-sm font-medium">
                            {{ activity.userName || 'Anonymous' }}
                          </div>
                          <div :class="theme.textSecondary" class="text-xs">
                            {{ activity.userEmail || 'No email' }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <img
                          v-if="activity.photoThumbnail"
                          :alt="activity.photoName"
                          :src="activity.photoThumbnail"
                          class="w-12 h-12 rounded-lg object-cover"
                        />
                        <div
                          v-else
                          class="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                        >
                          <ImageIcon :class="theme.textTertiary" class="h-5 w-5" />
                        </div>
                        <div :class="theme.textPrimary" class="text-sm font-medium">
                          {{ activity.photoName || 'Unknown photo' }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <Heart
                          :class="
                            activity.action === 'favourite'
                              ? 'text-pink-600 dark:text-pink-400 fill-current'
                              : theme.textSecondary
                          "
                          class="h-4 w-4"
                        />
                        <span :class="theme.textPrimary" class="text-sm font-medium">
                          {{ activity.action === 'favourite' ? 'Favourited' : 'Unfavourited' }}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredActivities.length === 0">
                    <td class="px-6 py-12 text-center" colspan="4">
                      <div class="flex flex-col items-center gap-3">
                        <Heart :class="theme.textTertiary" class="h-12 w-12 opacity-30" />
                        <p :class="theme.textPrimary" class="text-sm font-medium">
                          No favourite activity found
                        </p>
                        <p :class="theme.textSecondary" class="text-xs">
                          Favourites will appear here once users start favouriting photos
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
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
import { Download, Heart, ImageIcon, Link, Loader2, Lock, Mail } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import CollectionLayout from '@/components/organisms/CollectionLayout.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { usePresetStore } from '@/stores/preset'
import type { Collection } from '@/api/collections'

interface FavouriteActivity {
  id: string
  timestamp: string
  userName: string | null
  userEmail: string | null
  photoName: string
  photoThumbnail: string | null
  action: 'favourite' | 'unfavourite'
}

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

// Activity data
const activities = ref<FavouriteActivity[]>([])
const searchQuery = ref('')
const dateFilter = ref('all')

// Computed stats
const totalFavourites = computed(
  () => activities.value.filter(a => a.action === 'favourite').length
)
const uniqueUsers = computed(() => {
  const emails = new Set(activities.value.map(a => a.userEmail).filter(Boolean))
  return emails.size
})
const thisWeekFavourites = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return activities.value.filter(a => a.action === 'favourite' && new Date(a.timestamp) >= weekAgo)
    .length
})
const mostFavouritedPhoto = computed(() => {
  const photoCounts = new Map<string, { name: string; count: number }>()
  activities.value
    .filter(a => a.action === 'favourite')
    .forEach(a => {
      const current = photoCounts.get(a.photoName) || { name: a.photoName, count: 0 }
      photoCounts.set(a.photoName, { ...current, count: current.count + 1 })
    })
  const sorted = Array.from(photoCounts.values()).sort((a, b) => b.count - a.count)
  return sorted[0] || null
})

// Filtered activities
const filteredActivities = computed(() => {
  let filtered = [...activities.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      a =>
        a.userEmail?.toLowerCase().includes(query) ||
        a.userName?.toLowerCase().includes(query) ||
        a.photoName?.toLowerCase().includes(query)
    )
  }

  // Date filter
  if (dateFilter.value !== 'all') {
    const now = new Date()
    let cutoff = new Date()
    if (dateFilter.value === 'today') {
      cutoff.setHours(0, 0, 0, 0)
    } else if (dateFilter.value === 'week') {
      cutoff.setDate(cutoff.getDate() - 7)
    } else if (dateFilter.value === 'month') {
      cutoff.setMonth(cutoff.getMonth() - 1)
    }
    filtered = filtered.filter(a => new Date(a.timestamp) >= cutoff)
  }

  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

// Generate demo data
const generateDemoData = (): FavouriteActivity[] => {
  const now = new Date()
  const demoActivities: FavouriteActivity[] = []

  const demoUsers = [
    { name: 'Sarah Johnson', email: 'sarah.johnson@example.com' },
    { name: 'Michael Chen', email: 'michael.chen@example.com' },
    { name: 'Emily Rodriguez', email: 'emily.rodriguez@example.com' },
    { name: 'David Thompson', email: 'david.thompson@example.com' },
    { name: 'Jessica Martinez', email: 'jessica.martinez@example.com' },
    { name: 'Robert Wilson', email: 'robert.wilson@example.com' },
    { name: null, email: 'guest@example.com' }, // Anonymous user
  ]

  const demoPhotos = [
    { name: 'IMG_001.jpg', thumbnail: 'https://picsum.photos/seed/photo1/200/200' },
    { name: 'IMG_002.jpg', thumbnail: 'https://picsum.photos/seed/photo2/200/200' },
    { name: 'IMG_003.jpg', thumbnail: 'https://picsum.photos/seed/photo3/200/200' },
    { name: 'IMG_004.jpg', thumbnail: 'https://picsum.photos/seed/photo4/200/200' },
    { name: 'IMG_005.jpg', thumbnail: 'https://picsum.photos/seed/photo5/200/200' },
    { name: 'IMG_006.jpg', thumbnail: 'https://picsum.photos/seed/photo6/200/200' },
    { name: 'IMG_007.jpg', thumbnail: 'https://picsum.photos/seed/photo7/200/200' },
    { name: 'IMG_008.jpg', thumbnail: 'https://picsum.photos/seed/photo8/200/200' },
  ]

  const actions: ('favourite' | 'unfavourite')[] = ['favourite', 'unfavourite']

  // Generate activities for the past 30 days
  for (let i = 0; i < 35; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const hoursAgo = Math.floor(Math.random() * 24)
    const minutesAgo = Math.floor(Math.random() * 60)

    const timestamp = new Date(now)
    timestamp.setDate(timestamp.getDate() - daysAgo)
    timestamp.setHours(timestamp.getHours() - hoursAgo)
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo)

    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)]
    const photo = demoPhotos[Math.floor(Math.random() * demoPhotos.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]

    demoActivities.push({
      id: `favourite-${i + 1}`,
      timestamp: timestamp.toISOString(),
      userName: user.name,
      userEmail: user.email,
      photoName: photo.name,
      photoThumbnail: photo.thumbnail,
      action,
    })
  }

  return demoActivities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

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
    // TODO: Fetch favourite activities from API
    // activities.value = await fetchFavouriteActivities(collectionId)
    // For now, use demo data
    activities.value = generateDemoData()
  } catch (error: any) {
    console.error('Failed to load collection:', error)
    // Still load demo data even if collection fetch fails
    activities.value = generateDemoData()
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
}

// Handle date change
const handleDateChange = async (newDate: Date | null) => {
  if (!collection.value) return
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

// Format helpers
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Export data
const exportData = () => {
  // TODO: Implement export functionality
  console.log('Exporting favourite activity data...')
}
</script>
