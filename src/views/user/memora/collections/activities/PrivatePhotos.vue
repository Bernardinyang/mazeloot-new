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
              route.name === 'collectionActivitiesDownload'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
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
              route.name === 'collectionActivitiesFavourite'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
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
              route.name === 'collectionActivitiesEmailRegistration'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
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
              route.name === 'collectionActivitiesQuickShare'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
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
              route.name === 'collectionActivitiesPrivatePhotos'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
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
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading private photos activity...</p>
          </div>
        </div>

        <div v-else class="p-6 md:p-8 transition-all duration-300">
          <!-- Page Header -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold">
                  Private Photos Activity
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
              Track access to private photos in this collection. See who has viewed private photos
              and when.
            </p>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Private Photos</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ totalPrivatePhotos }}</p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Total Views</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ totalViews }}</p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Unique Viewers</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ uniqueViewers }}</p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">This Week</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ thisWeekViews }}</p>
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
                      Access Type
                    </th>
                    <th
                      :class="theme.textSecondary"
                      class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Duration
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
                          class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"
                        >
                          <span class="text-xs font-semibold text-purple-600 dark:text-purple-400">
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
                      <span
                        :class="
                          activity.accessType === 'granted'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        "
                        class="px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ activity.accessType === 'granted' ? 'Granted' : 'Denied' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div :class="theme.textSecondary" class="text-sm">
                        {{ activity.duration ? `${activity.duration}s` : 'N/A' }}
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredActivities.length === 0">
                    <td class="px-6 py-12 text-center" colspan="5">
                      <div class="flex flex-col items-center gap-3">
                        <Lock :class="theme.textTertiary" class="h-12 w-12 opacity-30" />
                        <p :class="theme.textPrimary" class="text-sm font-medium">
                          No private photo activity found
                        </p>
                        <p :class="theme.textSecondary" class="text-xs">
                          Private photo access will appear here once users access private photos
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

<script setup>
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
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { usePresetStore } from '@/stores/preset'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const presetStore = usePresetStore()

// Collection data
const collection = ref(null)
const isLoading = ref(false)
const collectionStatus = ref('draft')
const eventDate = ref(null)
const selectedPresetId = ref('none')
const selectedPresetName = computed(() => {
  if (selectedPresetId.value === 'none') return null
  const preset = presets.value.find(p => p.id === selectedPresetId.value)
  return preset?.name || null
})
const selectedWatermark = ref('none')
const selectedWatermarkName = computed(() => {
  if (selectedWatermark.value === 'none') return null
  const watermark = watermarks.value.find(w => w.id === selectedWatermark.value)
  return watermark?.name || null
})
const presets = computed(() => presetStore.presets)
const watermarks = computed(() => galleryStore.watermarks || [])

// UI State
const activeTab = ref('activities')
const { isSidebarCollapsed } = useSidebarCollapse()

// Activity data
const activities = ref([])
const searchQuery = ref('')
const dateFilter = ref('all')

// Computed stats
const totalPrivatePhotos = computed(() => {
  const uniquePhotos = new Set(activities.value.map(a => a.photoName))
  return uniquePhotos.size
})
const totalViews = computed(() => activities.value.length)
const uniqueViewers = computed(() => {
  const emails = new Set(activities.value.map(a => a.userEmail).filter(Boolean))
  return emails.size
})
const thisWeekViews = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return activities.value.filter(a => new Date(a.timestamp) >= weekAgo).length
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
const generateDemoData = () => {
  const now = new Date()
  const demoActivities = []

  const demoUsers = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Bob Johnson', email: 'bob@example.com' },
    { name: 'Alice Williams', email: 'alice@example.com' },
    { name: 'Charlie Brown', email: 'charlie@example.com' },
    { name: 'Diana Prince', email: 'diana@example.com' },
    { name: 'Anonymous User', email: 'anonymous@example.com' }, // Anonymous user
  ]

  const demoPhotos = [
    { name: 'photo1.jpg', thumbnail: 'https://via.placeholder.com/150' },
    { name: 'photo2.jpg', thumbnail: 'https://via.placeholder.com/150' },
    { name: 'photo3.jpg', thumbnail: 'https://via.placeholder.com/150' },
    { name: 'photo4.jpg', thumbnail: 'https://via.placeholder.com/150' },
    { name: 'photo5.jpg', thumbnail: 'https://via.placeholder.com/150' },
  ]

  const accessTypes = ['granted', 'denied']

  // Generate activities for the past 30 days
  for (let i = 0; i < 28; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const hoursAgo = Math.floor(Math.random() * 24)
    const minutesAgo = Math.floor(Math.random() * 60)

    const timestamp = new Date(now)
    timestamp.setDate(timestamp.getDate() - daysAgo)
    timestamp.setHours(timestamp.getHours() - hoursAgo)
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo)

    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)]
    const photo = demoPhotos[Math.floor(Math.random() * demoPhotos.length)]
    const accessType = accessTypes[Math.floor(Math.random() * accessTypes.length)]

    // Duration only for granted access
    const duration = accessType === 'granted' ? Math.floor(Math.random() * 120) + 5 : null

    demoActivities.push({
      id: `activity-${i + 1}`,
      timestamp: timestamp.toISOString(),
      userName: user.name,
      userEmail: user.email,
      photoName: photo.name,
      photoThumbnail: photo.thumbnail,
      accessType: accessType,
      duration: duration,
    })
  }

  return demoActivities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    collectionStatus.value = collectionData.status === 'active' ? 'published' : 'draft'
    eventDate.value = collectionData.eventDate ? new Date(collectionData.eventDate) : null
    selectedPresetId.value = collectionData.presetId || 'none'
    selectedWatermark.value = collectionData.watermarkId || 'none'
    // TODO
    // activities.value = await fetchPrivatePhotoActivities(collectionId)
    // For now, use demo data
    activities.value = generateDemoData()
  } catch (error) {
    console.error('Failed to load collection:', error)
    // Still load demo data even if collection fetch fails
    activities.value = generateDemoData()
  } finally {
    isLoading.value = false
  }
})

// Navigation
const goBack = () => {
  router.push({ name: 'collectionPhotos', params: { uuid: collection.value?.id } })
}

// Handle status change
const handleStatusChange = async newStatus => {
  if (!collection.value || !newStatus) return
}

// Handle date change
const handleDateChange = async newDate => {
  if (!collection.value) return
}

// Handle preset change
const handlePresetChange = async presetId => {
  if (!collection.value) return
  selectedPresetId.value = presetId
}

// Handle watermark change
const handleWatermarkChange = async watermarkId => {
  if (!collection.value) return
  selectedWatermark.value = watermarkId
}

// Format helpers
const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatTime = dateString => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Export data
const exportData = () => {
  // TODO
  console.log('Exporting private photo activity data...')
}
</script>
