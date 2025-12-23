<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading download activity...</p>
          </div>
        </div>

        <div v-else class="p-6 md:p-8 transition-all duration-300">
          <!-- Page Header -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold">
                  Download Activity
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
              Track all download activity for this collection. See who downloaded what and when.
            </p>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Total Downloads</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ totalDownloads }}</p>
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
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">This Week</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ thisWeekDownloads }}</p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">This Month</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ thisMonthDownloads }}</p>
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
                      Type
                    </th>
                    <th
                      :class="theme.textSecondary"
                      class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      IP Address
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
                          class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center"
                        >
                          <span class="text-xs font-semibold text-teal-600 dark:text-teal-400">
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
                          activity.downloadType === 'full'
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        "
                        class="px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ activity.downloadType === 'full' ? 'Full Size' : 'Thumbnail' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div :class="theme.textSecondary" class="text-sm font-mono">
                        {{ activity.ipAddress || 'N/A' }}
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredActivities.length === 0">
                    <td class="px-6 py-12 text-center" colspan="5">
                      <div class="flex flex-col items-center gap-3">
                        <Download :class="theme.textTertiary" class="h-12 w-12 opacity-30" />
                        <p :class="theme.textPrimary" class="text-sm font-medium">
                          No download activity found
                        </p>
                        <p :class="theme.textSecondary" class="text-xs">
                          Downloads will appear here once users start downloading photos
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

// Computed stats
const totalDownloads = computed(() => activities.value.length)
const uniqueUsers = computed(() => {
  const emails = new Set(activities.value.map(a => a.userEmail).filter(Boolean))
  return emails.size
})
const thisWeekDownloads = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return activities.value.filter(a => new Date(a.timestamp) >= weekAgo).length
})
const thisMonthDownloads = computed(() => {
  const monthAgo = new Date()
  monthAgo.setMonth(monthAgo.getMonth() - 1)
  return activities.value.filter(a => new Date(a.timestamp) >= monthAgo).length
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
    { name: 'Edward Norton', email: 'edward@example.com' },
    { name: 'Fiona Apple', email: 'fiona@example.com' },
    { name: 'Anonymous User', email: 'anonymous@example.com' }, // Anonymous user
    { name: 'George Lucas', email: 'george@example.com' },
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
    { name: 'photo9.jpg', thumbnail: 'https://via.placeholder.com/150' },
    { name: 'photo10.jpg', thumbnail: 'https://via.placeholder.com/150' },
    { name: 'photo11.jpg', thumbnail: 'https://via.placeholder.com/150' },
    { name: 'photo12.jpg', thumbnail: 'https://via.placeholder.com/150' },
  ]

  const ipAddresses = [
    '192.168.1.45',
    '10.0.0.23',
    '172.16.0.12',
    '203.0.113.42',
    '198.51.100.89',
    '192.0.2.156',
    '203.0.113.78',
    '198.51.100.34',
    '192.0.2.91',
    '203.0.113.123',
  ]

  const downloadTypes = ['original', 'web']

  // Generate activities for the past 30 days
  for (let i = 0; i < 45; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const hoursAgo = Math.floor(Math.random() * 24)
    const minutesAgo = Math.floor(Math.random() * 60)

    const timestamp = new Date(now)
    timestamp.setDate(timestamp.getDate() - daysAgo)
    timestamp.setHours(timestamp.getHours() - hoursAgo)
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo)

    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)]
    const photo = demoPhotos[Math.floor(Math.random() * demoPhotos.length)]
    const ipAddress = ipAddresses[Math.floor(Math.random() * ipAddresses.length)]
    const downloadType = downloadTypes[Math.floor(Math.random() * downloadTypes.length)]

    demoActivities.push({
      id: `activity-${i + 1}`,
      timestamp: timestamp.toISOString(),
      userName: user.name,
      userEmail: user.email,
      photoName: photo.name,
      photoThumbnail: photo.thumbnail,
      downloadType: downloadType,
      ipAddress: ipAddress,
    })
  }

  // Sort by timestamp (newest first)
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
    // activities.value = await fetchDownloadActivities(collectionId)
    // For now, use demo data
    activities.value = generateDemoData()
  } catch (error) {
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
</script>
