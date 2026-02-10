<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-4 sm:p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading email registrations...</p>
          </div>
        </div>

        <div v-else class="p-4 sm:p-6 md:p-8 transition-all duration-300">
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
              class="p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Total Emails</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ totalEmails }}</p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">This Week</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">
                {{ thisWeekRegistrations }}
              </p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">This Month</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">
                {{ thisMonthRegistrations }}
              </p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300"
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
          <div :class="[theme.borderSecondary, theme.bgCard]" class="rounded-2xl border-2 overflow-hidden">
            <DataTable
              :items="filteredRegistrations"
              :columns="tableColumns"
              :loading="isLoading"
              searchable
              search-placeholder="Search by email…"
              :empty-message="'No email registrations found'"
              :empty-icon="Mail"
            >
              <template #cell-email="{ item }">
                <div class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                    >
                      <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {{ item.email.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div :class="theme.textPrimary" class="text-sm font-medium">
                      {{ item.email }}
                    </div>
                  </div>
                </div>
              </template>
              <template #cell-registeredAt="{ item }">
                <div class="px-6 py-4 whitespace-nowrap">
                  <div :class="theme.textPrimary" class="text-sm font-medium">
                    {{ formatDate(item.registeredAt) }}
                  </div>
                  <div :class="theme.textSecondary" class="text-xs">
                    {{ formatTime(item.registeredAt) }}
                  </div>
                </div>
              </template>
              <template #cell-lastAccessAt="{ item }">
                <div class="px-6 py-4 whitespace-nowrap">
                  <div v-if="item.lastAccessAt">
                    <div :class="theme.textPrimary" class="text-sm font-medium">
                      {{ formatDate(item.lastAccessAt) }}
                    </div>
                    <div :class="theme.textSecondary" class="text-xs">
                      {{ formatTime(item.lastAccessAt) }}
                    </div>
                  </div>
                  <div v-else :class="theme.textSecondary" class="text-sm">
                    Never
                  </div>
                </div>
              </template>
              <template #empty>
                <div class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <Mail :class="theme.textTertiary" class="h-12 w-12 opacity-30" />
                    <p :class="theme.textPrimary" class="text-sm font-medium">
                      No email registrations found
                    </p>
                    <p :class="theme.textSecondary" class="text-xs">
                      Email registrations will appear here once users register
                    </p>
                  </div>
                </div>
              </template>
            </DataTable>
          </div>
        </div>
      </div>
    </template>
  </CollectionLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Download, Heart, Link, Loader2, Lock, Mail } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'
import CollectionLayout from '@/domains/memora/layouts/CollectionLayout.vue'
import DataTable from '@/shared/components/organisms/DataTable.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useSidebarCollapse } from '@/shared/composables/useSidebarCollapse'
import { useGalleryStore } from '@/shared/stores/gallery'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

// Collection data
const collection = ref(null)
const isLoading = ref(true)
// UI State
const { isSidebarCollapsed } = useSidebarCollapse()

// Registration data
const registrations = ref([])
const searchQuery = ref('')
const dateFilter = ref('all')
const verificationFilter = ref('all')

// Table columns
const tableColumns = [
  { key: 'email', label: 'Email Address', slot: 'email', sortable: true },
  { key: 'registeredAt', label: 'Registered', slot: 'registeredAt', sortable: true, format: 'date', dataSelector: (r) => r.registeredAt },
  { key: 'lastAccessAt', label: 'Last Access', slot: 'lastAccessAt', sortable: true, format: 'date', dataSelector: (r) => r.lastAccessAt },
]

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
const generateDemoData = () => {
  const now = new Date()
  const demoRegistrations = []

  const demoUsers = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Bob Johnson', email: 'bob@example.com' },
    { name: 'Alice Williams', email: 'alice@example.com' },
    { name: 'Charlie Brown', email: 'charlie@example.com' },
    { name: 'Diana Prince', email: 'diana@example.com' },
    { name: 'Edward Norton', email: 'edward@example.com' },
    { name: 'Fiona Apple', email: 'fiona@example.com' },
    { name: 'George Lucas', email: 'george@example.com' },
    { name: 'Helen Mirren', email: 'helen@example.com' },
    { name: 'Ian McKellen', email: 'ian@example.com' },
    { name: 'Julia Roberts', email: 'julia@example.com' },
    { name: 'Kevin Spacey', email: 'kevin@example.com' },
    { name: 'Liam Neeson', email: 'liam@example.com' },
    { name: 'Meryl Streep', email: 'meryl@example.com' },
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
      verified: verified,
      lastAccessAt: lastAccessAt,
    })
  }

  return demoRegistrations.sort(
    (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
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
    
    const { useCollectionsApi } = await import('@/domains/memora/api/collections')
    const { getEmailRegistrations } = useCollectionsApi()
    registrations.value = await getEmailRegistrations(collectionId)
  } catch (error) {
    console.error('Failed to load email registrations:', error)
    registrations.value = []
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
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Export data
const exportData = () => {}
</script>
