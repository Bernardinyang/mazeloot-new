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
            <p :class="theme.textSecondary" class="text-sm">Loading email registrations...</p>
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
                  Email Registrations
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
              View all email addresses that have registered to access this collection.
            </p>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Total Emails</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ totalEmails }}</p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">This Week</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">
                {{ thisWeekRegistrations }}
              </p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">This Month</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">
                {{ thisMonthRegistrations }}
              </p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Verified</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ verifiedCount }}</p>
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
              placeholder="Search by email or name..."
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
            <Select v-model="verificationFilter">
              <SelectTrigger :class="[theme.bgInput, theme.borderInput]" class="w-[180px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent :class="[theme.bgCard, theme.borderCard]">
                <SelectItem :class="[theme.textPrimary, theme.bgButtonHover]" value="all">
                  All
                </SelectItem>
                <SelectItem :class="[theme.textPrimary, theme.bgButtonHover]" value="verified">
                  Verified
                </SelectItem>
                <SelectItem :class="[theme.textPrimary, theme.bgButtonHover]" value="unverified">
                  Unverified
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Email List -->
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
                      Email Address
                    </th>
                    <th
                      :class="theme.textSecondary"
                      class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      :class="theme.textSecondary"
                      class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Registered
                    </th>
                    <th
                      :class="theme.textSecondary"
                      class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      :class="theme.textSecondary"
                      class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      Last Access
                    </th>
                  </tr>
                </thead>
                <tbody :class="theme.borderSecondary" class="divide-y">
                  <tr
                    v-for="registration in filteredRegistrations"
                    :key="registration.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                        >
                          <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {{ registration.email.charAt(0).toUpperCase() }}
                          </span>
                        </div>
                        <div :class="theme.textPrimary" class="text-sm font-medium">
                          {{ registration.email }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div :class="theme.textPrimary" class="text-sm font-medium">
                        {{ registration.name || 'N/A' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div :class="theme.textPrimary" class="text-sm font-medium">
                        {{ formatDate(registration.registeredAt) }}
                      </div>
                      <div :class="theme.textSecondary" class="text-xs">
                        {{ formatTime(registration.registeredAt) }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        :class="
                          registration.verified
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        "
                        class="px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {{ registration.verified ? 'Verified' : 'Unverified' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div :class="theme.textSecondary" class="text-sm">
                        {{
                          registration.lastAccessAt
                            ? formatDate(registration.lastAccessAt)
                            : 'Never'
                        }}
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredRegistrations.length === 0">
                    <td class="px-6 py-12 text-center" colspan="5">
                      <div class="flex flex-col items-center gap-3">
                        <Mail :class="theme.textTertiary" class="h-12 w-12 opacity-30" />
                        <p :class="theme.textPrimary" class="text-sm font-medium">
                          No email registrations found
                        </p>
                        <p :class="theme.textSecondary" class="text-xs">
                          Email registrations will appear here once users register
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
import { Download, Heart, Link, Loader2, Lock, Mail } from 'lucide-vue-next'
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

interface EmailRegistration {
  id: string
  email: string
  name: string | null
  registeredAt: string
  verified: boolean
  lastAccessAt: string | null
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

// Registration data
const registrations = ref<EmailRegistration[]>([])
const searchQuery = ref('')
const dateFilter = ref('all')
const verificationFilter = ref('all')

// Computed stats
const totalEmails = computed(() => registrations.value.length)
const verifiedCount = computed(() => registrations.value.filter(r => r.verified).length)
const thisWeekRegistrations = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return registrations.value.filter(r => new Date(r.registeredAt) >= weekAgo).length
})
const thisMonthRegistrations = computed(() => {
  const monthAgo = new Date()
  monthAgo.setMonth(monthAgo.getMonth() - 1)
  return registrations.value.filter(r => new Date(r.registeredAt) >= monthAgo).length
})

// Filtered registrations
const filteredRegistrations = computed(() => {
  let filtered = [...registrations.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      r => r.email.toLowerCase().includes(query) || r.name?.toLowerCase().includes(query)
    )
  }

  // Verification filter
  if (verificationFilter.value !== 'all') {
    filtered = filtered.filter(r => r.verified === (verificationFilter.value === 'verified'))
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
    filtered = filtered.filter(r => new Date(r.registeredAt) >= cutoff)
  }

  return filtered.sort(
    (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
  )
})

// Generate demo data
const generateDemoData = (): EmailRegistration[] => {
  const now = new Date()
  const demoRegistrations: EmailRegistration[] = []

  const demoUsers = [
    { name: 'Sarah Johnson', email: 'sarah.johnson@example.com' },
    { name: 'Michael Chen', email: 'michael.chen@example.com' },
    { name: 'Emily Rodriguez', email: 'emily.rodriguez@example.com' },
    { name: 'David Thompson', email: 'david.thompson@example.com' },
    { name: 'Jessica Martinez', email: 'jessica.martinez@example.com' },
    { name: 'Robert Wilson', email: 'robert.wilson@example.com' },
    { name: 'Amanda Brown', email: 'amanda.brown@example.com' },
    { name: 'James Taylor', email: 'james.taylor@example.com' },
    { name: 'Lisa Anderson', email: 'lisa.anderson@example.com' },
    { name: 'Christopher Lee', email: 'christopher.lee@example.com' },
    { name: 'Maria Garcia', email: 'maria.garcia@example.com' },
    { name: 'Daniel White', email: 'daniel.white@example.com' },
    { name: 'Jennifer Davis', email: 'jennifer.davis@example.com' },
    { name: 'Matthew Harris', email: 'matthew.harris@example.com' },
    { name: 'Ashley Clark', email: 'ashley.clark@example.com' },
  ]

  // Generate registrations for the past 60 days
  for (let i = 0; i < demoUsers.length; i++) {
    const user = demoUsers[i]
    const daysAgo = Math.floor(Math.random() * 60)
    const hoursAgo = Math.floor(Math.random() * 24)
    const minutesAgo = Math.floor(Math.random() * 60)

    const registeredAt = new Date(now)
    registeredAt.setDate(registeredAt.getDate() - daysAgo)
    registeredAt.setHours(registeredAt.getHours() - hoursAgo)
    registeredAt.setMinutes(registeredAt.getMinutes() - minutesAgo)

    // Some users have accessed recently, some haven't
    const hasAccessed = Math.random() > 0.3
    const lastAccessAt = hasAccessed
      ? (() => {
          const accessDate = new Date(registeredAt)
          const daysSinceReg = Math.floor(Math.random() * daysAgo)
          accessDate.setDate(accessDate.getDate() + daysSinceReg)
          return accessDate.toISOString()
        })()
      : null

    const verified = Math.random() > 0.2 // 80% verified

    demoRegistrations.push({
      id: `registration-${i + 1}`,
      email: user.email,
      name: user.name,
      registeredAt: registeredAt.toISOString(),
      verified,
      lastAccessAt,
    })
  }

  return demoRegistrations.sort(
    (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
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
    // TODO: Fetch email registrations from API
    // registrations.value = await fetchEmailRegistrations(collectionId)
    // For now, use demo data
    registrations.value = generateDemoData()
  } catch (error: any) {
    console.error('Failed to load collection:', error)
    // Still load demo data even if collection fetch fails
    registrations.value = generateDemoData()
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
  console.log('Exporting email registration data...')
}
</script>
