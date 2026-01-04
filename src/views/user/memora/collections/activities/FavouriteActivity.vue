<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading favourite activity...</p>
          </div>
        </div>

        <div v-else class="p-6 md:p-8 transition-all duration-300">
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
              Track all favourite activity for this collection. See which photos users have marked .
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
          <div :class="[theme.borderSecondary, theme.bgCard]" class="rounded-2xl border-2 overflow-hidden">
            <DataTable
              :items="filteredActivities"
              :columns="tableColumns"
              :loading="isLoading"
              :empty-message="'No favourite activity found'"
              :empty-icon="Heart"
            >
              <template #cell-timestamp="{ item }">
                <div class="px-6 py-4 whitespace-nowrap">
                  <div :class="theme.textPrimary" class="text-sm font-medium">
                    {{ formatDate(item.timestamp) }}
                  </div>
                  <div :class="theme.textSecondary" class="text-xs">
                    {{ formatTime(item.timestamp) }}
                  </div>
                </div>
              </template>
              <template #cell-userEmail="{ item }">
                <div class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center"
                    >
                      <span class="text-xs font-semibold text-pink-600 dark:text-pink-400">
                        {{ item.userEmail?.charAt(0).toUpperCase() || '?' }}
                      </span>
                    </div>
                    <div :class="theme.textPrimary" class="text-sm font-medium">
                      {{ item.userEmail || 'No email' }}
                    </div>
                  </div>
                </div>
              </template>
              <template #cell-photo="{ item }">
                <div class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <button
                      v-if="item.mediaId"
                      class="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition-opacity cursor-pointer"
                      @click.stop="openMedia(item)"
                    >
                      <img
                        v-if="item.photoThumbnail"
                        :alt="item.photoName"
                        :src="item.photoThumbnail"
                        class="w-full h-full object-cover"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center"
                      >
                        <ImageIcon v-if="!item.isVideo" :class="theme.textTertiary" class="h-5 w-5" />
                        <Play v-else :class="theme.textTertiary" class="h-5 w-5" />
                      </div>
                      <div
                        v-if="item.isVideo && item.photoThumbnail"
                        class="absolute inset-0 flex items-center justify-center bg-black/20"
                      >
                        <Play class="h-4 w-4 text-white" />
                      </div>
                    </button>
                    <div
                      v-else
                      class="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
                    >
                      <img
                        v-if="item.photoThumbnail"
                        :alt="item.photoName"
                        :src="item.photoThumbnail"
                        class="w-full h-full object-cover"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center"
                      >
                        <ImageIcon v-if="!item.isVideo" :class="theme.textTertiary" class="h-5 w-5" />
                        <Play v-else :class="theme.textTertiary" class="h-5 w-5" />
                      </div>
                      <div
                        v-if="item.isVideo && item.photoThumbnail"
                        class="absolute inset-0 flex items-center justify-center bg-black/20"
                      >
                        <Play class="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div :class="theme.textPrimary" class="text-sm font-medium">
                      {{ item.photoName || 'Unknown media' }}
                    </div>
                  </div>
                </div>
              </template>
              <template #empty>
                <div class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <Heart :class="theme.textTertiary" class="h-12 w-12 opacity-30" />
                    <p :class="theme.textPrimary" class="text-sm font-medium">
                      No favourite activity found
                    </p>
                    <p :class="theme.textSecondary" class="text-xs">
                      Favourites will appear here once users start favouriting photos
                    </p>
                  </div>
                </div>
              </template>
            </DataTable>
          </div>
        </div>
      </div>

      <!-- Media Lightbox -->
      <MediaLightbox
        v-model="showMediaViewer"
        :items="mediaItemsForViewer"
        :initial-index="currentMediaIndex"
        :collection-id="collection?.id || collection?.uuid"
        @close="closeMediaViewer"
      />
    </template>
  </CollectionLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Download, Heart, ImageIcon, Link, Loader2, Lock, Mail, Play } from 'lucide-vue-next'
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
import MediaLightbox from '@/components/organisms/MediaLightbox.vue'
import DataTable from '@/components/organisms/DataTable.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

// Collection data
const collection = ref(null)
const isLoading = ref(false)
// UI State
const { isSidebarCollapsed } = useSidebarCollapse()

// Activity data
const activities = ref([])
const searchQuery = ref('')
const dateFilter = ref('all')

// Media viewer
const showMediaViewer = ref(false)
const mediaItemsForViewer = ref([])
const currentMediaIndex = ref(0)

// Table columns
const tableColumns = [
  { key: 'timestamp', label: 'Date & Time', slot: 'timestamp' },
  { key: 'userEmail', label: 'User', slot: 'userEmail' },
  { key: 'photo', label: 'Photo', slot: 'photo' },
]

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
  const photoCounts = new Map()
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
    { name: 'photo6.jpg', thumbnail: 'https://via.placeholder.com/150' },
    { name: 'photo7.jpg', thumbnail: 'https://via.placeholder.com/150' },
    { name: 'photo8.jpg', thumbnail: 'https://via.placeholder.com/150' },
  ]

  const actions = ['favourite', 'unfavourite']

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
      id: `activity-${i + 1}`,
      timestamp: timestamp.toISOString(),
      userName: user.name,
      userEmail: user.email,
      photoName: photo.name,
      photoThumbnail: photo.thumbnail,
      action: action,
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
    
    const { useCollectionsApi } = await import('@/api/collections')
    const { getFavouriteActivities } = useCollectionsApi()
    activities.value = await getFavouriteActivities(collectionId)
  } catch (error) {
    console.error('Failed to load favourite activities:', error)
    activities.value = []
  } finally {
    isLoading.value = false
  }
})

// Navigation
const goBack = () => {
  router.push({ name: 'collectionPhotos', params: { uuid: collection.value?.id } })
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
const exportData = () => {}

// Open media in lightbox
const openMedia = async activity => {
  if (!activity.mediaId || !collection.value) return

  try {
    const { useCollectionsApi } = await import('@/api/collections')
    const { getMedia } = useCollectionsApi()
    
    // Fetch the single media item
    const mediaItem = await getMedia(activity.mediaId)
    if (!mediaItem) return
    
    // Just show the single media item
    mediaItemsForViewer.value = [mediaItem]
    currentMediaIndex.value = 0
    showMediaViewer.value = true
  } catch (error) {
    console.error('Failed to open media:', error)
  }
}

const closeMediaViewer = () => {
  showMediaViewer.value = false
  mediaItemsForViewer.value = []
  currentMediaIndex.value = 0
}
</script>
