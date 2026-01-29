<template>
  <DashboardLayout>
    <template #breadcrumb> Overview </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-8">
      <!-- Page Header -->
      <div class="space-y-2">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="min-w-0 flex-1">
            <h1
              class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              Dashboard
            </h1>
            <p class="text-muted-foreground mt-2 text-sm sm:text-base md:text-lg">
              Welcome back! Here's an overview of your Memora system.
            </p>
          </div>
          <Button
            :disabled="isRefreshing"
            class="shrink-0 w-full sm:w-auto"
            size="sm"
            variant="outline"
            @click="refreshAll"
          >
            <RefreshCw :class="['h-4 w-4 mr-2', isRefreshing && 'animate-spin']" />
            Refresh
          </Button>
        </div>
      </div>

      <!-- Stats Cards -->
      <TransitionGroup
        v-if="!isLoadingStats"
        class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        name="fade-up"
        tag="div"
      >
        <StatCard
          key="collections"
          :description="`${stats.publishedCollections} published`"
          :icon="FolderOpen"
          :to="{ path: '/memora/collections' }"
          :value="stats.collections"
          color="blue"
          title="Collections"
        />
        <StatCard
          key="projects"
          :description="`${stats.activeProjects} active`"
          :icon="FolderKanban"
          :to="{ path: '/memora/projects' }"
          :value="stats.projects"
          color="purple"
          title="Projects"
        />
        <StatCard
          key="selections"
          :description="`${stats.completedSelections} completed`"
          :icon="CheckSquare"
          :to="{ path: '/memora/selections' }"
          :value="stats.selections"
          color="green"
          title="Selections"
        />
        <StatCard
          key="proofing"
          :description="`${stats.activeProofing} active`"
          :icon="Eye"
          :to="{ path: '/memora/proofing' }"
          :value="stats.proofing"
          color="orange"
          title="Proofing"
        />
        <StatCard
          key="media"
          :description="`${stats.featuredMedia} featured`"
          :icon="Images"
          :value="stats.totalMedia.toLocaleString()"
          color="indigo"
          title="Total Media"
        />
        <StatCard
          key="presets"
          :description="`${stats.activePresets} active`"
          :icon="Palette"
          :to="{ path: '/memora/settings/preset' }"
          :value="stats.presets"
          color="purple"
          title="Presets"
        />
        <StatCard
          key="watermarks"
          :description="`${stats.activeWatermarks} active`"
          :icon="ImageIcon"
          :to="{ path: '/memora/settings/watermark' }"
          :value="stats.watermarks"
          color="blue"
          title="Watermarks"
        />
        <StatCard
          key="rawFiles"
          :description="`${stats.activeRawFiles} active`"
          :icon="FileText"
          :to="{ path: '/memora/raw-files' }"
          :value="stats.rawFiles"
          color="teal"
          title="Raw Files"
        />
        <StatCard
          key="storage"
          :description="`${stats.storagePercentage}% used`"
          :icon="HardDrive"
          :loading="isLoadingStorage"
          :value="stats.storage"
          color="green"
          title="Storage"
        />
      </TransitionGroup>

      <!-- Stats Cards Skeleton -->
      <div
        v-if="isLoadingStats"
        class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card v-for="i in 9" :key="i" class="h-36 border-border/50 overflow-hidden">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-3">
            <Skeleton class="h-4 w-24 rounded-md" />
            <Skeleton class="h-10 w-10 rounded-xl" />
          </CardHeader>
          <CardContent class="space-y-2">
            <Skeleton class="h-8 w-20 rounded-md" />
            <Skeleton class="h-3 w-36 rounded-md" />
          </CardContent>
        </Card>
      </div>

      <!-- Charts -->
      <div class="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <!-- Activity Chart -->
        <Card
          :class="{ 'hover:shadow-lg transition-shadow duration-300': !isLoadingActivityChart }"
          class="overflow-hidden border-border/50"
        >
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <Skeleton v-if="isLoadingActivityChart" class="h-6 w-40 mb-2" />
                <template v-else>
                  <CardTitle class="text-lg font-semibold">Recent Activity</CardTitle>
                  <CardDescription class="mt-1"
                    >Content created over the last 7 days</CardDescription
                  >
                </template>
              </div>
              <Skeleton v-if="isLoadingActivityChart" class="h-5 w-5 rounded" />
              <TrendingUp v-else class="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent class="pt-0">
            <div v-if="isLoadingActivityChart" class="h-64 flex items-center justify-center">
              <div class="w-full space-y-4">
                <Skeleton class="h-48 w-full rounded" />
                <div class="flex justify-center gap-4">
                  <Skeleton v-for="i in 4" :key="i" class="h-4 w-16" />
                </div>
              </div>
            </div>
            <ActivityChart v-else :data="activityData" />
          </CardContent>
        </Card>

        <!-- Distribution Chart -->
        <Card
          :class="{ 'hover:shadow-lg transition-shadow duration-300': !isLoadingDistributionChart }"
          class="overflow-hidden border-border/50"
        >
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <Skeleton v-if="isLoadingDistributionChart" class="h-6 w-40 mb-2" />
                <template v-else>
                  <CardTitle class="text-lg font-semibold">Content Distribution</CardTitle>
                  <CardDescription class="mt-1">Breakdown by content type</CardDescription>
                </template>
              </div>
              <Skeleton v-if="isLoadingDistributionChart" class="h-5 w-5 rounded" />
              <PieChart v-else class="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent class="pt-0">
            <div v-if="isLoadingDistributionChart" class="h-64 flex items-center justify-center">
              <Skeleton class="h-48 w-48 rounded-full" />
            </div>
            <DistributionChart v-else :data="distributionData" />
          </CardContent>
        </Card>
      </div>

      <!-- Recent Activity & Quick Actions -->
      <div class="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-7">
        <!-- Recent Activity Card -->
        <Card
          :class="{ 'hover:shadow-lg transition-shadow duration-300': !isLoadingRecentActivity }"
          class="col-span-1 lg:col-span-4 border-border/50"
        >
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <Skeleton v-if="isLoadingRecentActivity" class="h-6 w-40 mb-2" />
                <template v-else>
                  <CardTitle class="text-lg font-semibold">Recent Activity</CardTitle>
                  <CardDescription class="mt-1">Latest updates and interactions</CardDescription>
                </template>
              </div>
              <Skeleton v-if="isLoadingRecentActivity" class="h-5 w-5 rounded" />
              <Clock v-else class="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent class="pt-0">
            <!-- Loading State -->
            <div v-if="isLoadingRecentActivity" class="space-y-3">
              <div v-for="i in 5" :key="i" class="flex items-center gap-4 p-3 rounded-lg">
                <Skeleton class="h-11 w-11 rounded-xl shrink-0" />
                <div class="flex-1 space-y-2 min-w-0">
                  <Skeleton class="h-4 w-32" />
                  <Skeleton class="h-3 w-48" />
                </div>
                <Skeleton class="h-3 w-16 shrink-0" />
              </div>
            </div>
            <!-- Empty State -->
            <div
              v-else-if="!isLoadingRecentActivity && recentActivity.length === 0"
              class="text-center py-12 text-muted-foreground space-y-2"
            >
              <div
                class="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-2"
              >
                <Activity class="h-6 w-6" />
              </div>
              <p class="font-medium">No recent activity</p>
              <p class="text-sm">Activity will appear here as you create content</p>
            </div>
            <!-- Activity List -->
            <div v-else-if="!isLoadingRecentActivity" class="space-y-3">
              <TransitionGroup name="fade-up" tag="div">
                <div
                  v-for="(activity, index) in recentActivity"
                  :key="activity.id"
                  :style="{ 'animation-delay': `${index * 50}ms` }"
                  class="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                  @click="getActivityRoute(activity) && navigateTo(getActivityRoute(activity))"
                >
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 dark:bg-accent/40 group-hover:bg-accent/20 dark:group-hover:bg-accent/50 transition-colors duration-200 shrink-0"
                  >
                    <component :is="getActivityIcon(activity.type)" class="h-5 w-5 text-accent dark:text-white" />
                  </div>
                  <div class="flex-1 min-w-0 space-y-0.5">
                    <p class="text-sm font-medium leading-none text-foreground">
                      {{ activity.title }}
                    </p>
                    <p class="text-sm text-muted-foreground truncate">{{ activity.description }}</p>
                  </div>
                  <div class="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    {{ activity.time }}
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </CardContent>
        </Card>

        <!-- Quick Actions Card -->
        <Card
          class="col-span-1 lg:col-span-3 border-border/50 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/20 dark:via-transparent dark:to-primary/20"></div>
          <CardHeader class="relative pb-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-accent/20 dark:bg-accent/50 flex items-center justify-center shrink-0 ring-2 ring-accent/20 dark:ring-accent/50">
                  <Zap class="h-5 w-5 text-accent dark:text-white brightness-110" />
                </div>
                <div>
                  <CardTitle class="text-lg font-bold">Quick Actions</CardTitle>
                  <CardDescription class="mt-0 text-xs">Common tasks and shortcuts</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent class="relative pt-0 flex-1 flex flex-col gap-2 px-5 pb-5">
            <button
              v-for="(action, index) in quickActions"
              :key="action.label"
              :style="{ 'animation-delay': `${index * 30}ms` }"
              class="group relative w-full flex-1 min-h-[44px] flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 dark:bg-muted/20 dark:hover:bg-muted/40 hover:border-l-4 border-l-accent dark:border-l-accent dark:brightness-125 transition-all duration-200 text-left cursor-pointer"
              @click="navigateTo(action.route)"
            >
              <div class="h-8 w-8 rounded-md bg-accent/15 dark:bg-accent/40 group-hover:bg-accent/25 dark:group-hover:bg-accent/50 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:rotate-3">
                <component
                  :is="action.icon"
                  class="h-4 w-4 text-accent dark:text-white dark:brightness-110 transition-transform duration-200"
                />
              </div>
              <span class="font-medium text-sm text-foreground/90 group-hover:text-foreground transition-colors duration-200 flex-1">
                {{ action.label }}
              </span>
              <div class="h-5 w-5 rounded-full bg-accent/20 dark:bg-accent/40 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ArrowRight class="h-2.5 w-2.5 text-accent dark:text-white dark:brightness-110" />
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onActivated, onMounted, ref } from 'vue'
import {
  Activity,
  ArrowRight,
  CheckSquare,
  Clock,
  Eye,
  FileText,
  FolderKanban,
  FolderOpen,
  HardDrive,
  Image as ImageIcon,
  Images,
  Palette,
  PieChart,
  Plus,
  RefreshCw,
  TrendingUp,
  Zap,
} from '@/shared/utils/lucideAnimated'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import { Button } from '@/shared/components/shadcn/button'
import StatCard from '@/shared/components/molecules/StatCard.vue'
import { useNavigation } from '@/shared/composables/useNavigation'
import { apiClient } from '@/shared/api/client'
import { formatDistanceToNow } from 'date-fns'
import ActivityChart from '@/shared/components/molecules/ActivityChart.vue'
import DistributionChart from '@/shared/components/molecules/DistributionChart.vue'
import { Skeleton } from '@/shared/components/shadcn/skeleton'
import { useAuthApi } from '@/shared/api/auth'

const { navigateTo } = useNavigation()
const authApi = useAuthApi()

const isLoadingStats = ref(true)
const isLoadingActivityChart = ref(true)
const isLoadingDistributionChart = ref(true)
const isLoadingRecentActivity = ref(true)
const isLoadingStorage = ref(true)
const isRefreshing = ref(false)
const stats = ref({
  collections: 0,
  publishedCollections: 0,
  projects: 0,
  activeProjects: 0,
  selections: 0,
  completedSelections: 0,
  proofing: 0,
  activeProofing: 0,
  totalMedia: 0,
  featuredMedia: 0,
  presets: 0,
  activePresets: 0,
  watermarks: 0,
  activeWatermarks: 0,
  rawFiles: 0,
  activeRawFiles: 0,
  storage: '0 GB',
  storagePercentage: 0,
})

const activityData = ref([])
const distributionData = ref([])
const recentActivity = ref([])

const quickActions = [
  { route: { name: 'rawFiles' }, label: 'View Raw Files', icon: FileText },
  { route: { name: 'manageCollections' }, label: 'View Collections', icon: FolderOpen },
  { route: { name: 'projects' }, label: 'View Projects', icon: FolderKanban },
  { route: { name: 'selections' }, label: 'View Selections', icon: CheckSquare },
  { route: { name: 'proofing' }, label: 'View Proofing', icon: Eye },
  { route: { name: 'rawFiles' }, label: 'Create Raw File', icon: Plus },
]

const getActivityIcon = type => {
  const icons = {
    collection: FolderOpen,
    project: FolderKanban,
    selection: CheckSquare,
    proofing: Eye,
    rawFile: FileText,
  }
  return icons[type] || FolderOpen
}

const getActivityRoute = activity => {
  const prefix = `${activity.type}-`
  const id = activity.id?.startsWith(prefix) ? activity.id.slice(prefix.length) : activity.id
  if (!id) return null
  const routes = {
    collection: { name: 'collectionPhotos', params: { uuid: id } },
    project: { name: 'projectDashboard', params: { id } },
    selection: { name: 'selectionDetail', params: { id } },
    proofing: { name: 'proofingDetail', params: { id } },
    rawFile: { name: 'rawFileDetail', params: { id } },
  }
  return routes[activity.type] || null
}

const formatBytes = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const fetchDashboard = async () => {
  try {
    // Start loading for all dashboard sections
    isLoadingStats.value = true
    isLoadingActivityChart.value = true
    isLoadingRecentActivity.value = true
    isLoadingDistributionChart.value = true

    // Single API call to get all dashboard data
    const response = await apiClient.get('/v1/memora/dashboard')
    const dashboardData = response?.data

    if (dashboardData) {
      // Update stats
      if (dashboardData.stats) {
        stats.value.collections = dashboardData.stats.collections || 0
        stats.value.publishedCollections = dashboardData.stats.publishedCollections || 0
        stats.value.projects = dashboardData.stats.projects || 0
        stats.value.activeProjects = dashboardData.stats.activeProjects || 0
        stats.value.selections = dashboardData.stats.selections || 0
        stats.value.completedSelections = dashboardData.stats.completedSelections || 0
        stats.value.proofing = dashboardData.stats.proofing || 0
        stats.value.activeProofing = dashboardData.stats.activeProofing || 0
        stats.value.totalMedia = dashboardData.stats.totalMedia || 0
        stats.value.featuredMedia = dashboardData.stats.featuredMedia || 0
        stats.value.presets = dashboardData.stats.presets || 0
        stats.value.activePresets = dashboardData.stats.activePresets || 0
        stats.value.watermarks = dashboardData.stats.watermarks || 0
        stats.value.activeWatermarks = dashboardData.stats.activeWatermarks || 0
        stats.value.rawFiles = dashboardData.stats.rawFiles || 0
        stats.value.activeRawFiles = dashboardData.stats.activeRawFiles || 0
      }

      // Update activity chart data
      if (dashboardData.activity && Array.isArray(dashboardData.activity)) {
        activityData.value = dashboardData.activity.map(d => ({
          date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          collections: d.collections || 0,
          projects: d.projects || 0,
          selections: d.selections || 0,
          proofing: d.proofing || 0,
          rawFiles: d.rawFiles || 0,
        }))
      }

      // Update recent activity
      if (dashboardData.recentActivity && Array.isArray(dashboardData.recentActivity)) {
        recentActivity.value = dashboardData.recentActivity.map(a => ({
          ...a,
          time: a.date ? formatDistanceToNow(new Date(a.date), { addSuffix: true }) : 'Recently',
        }))
      }

      // Update distribution data (chart depends on stats)
      distributionData.value = [
        { label: 'Collections', value: stats.value.collections, color: '#3b82f6' }, // Blue
        { label: 'Projects', value: stats.value.projects, color: '#a855f7' }, // Purple
        { label: 'Selections', value: stats.value.selections, color: '#10b981' }, // Green
        { label: 'Proofing', value: stats.value.proofing, color: '#f59e0b' }, // Orange
        { label: 'Raw Files', value: stats.value.rawFiles, color: '#06b6d4' }, // Cyan
      ]
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    // Stop loading for all sections
    isLoadingStats.value = false
    isLoadingActivityChart.value = false
    isLoadingRecentActivity.value = false
    isLoadingDistributionChart.value = false
  }
}

const fetchStorage = async () => {
  try {
    isLoadingStorage.value = true
    const response = await authApi.getStorage()
    const storageData = response?.data || response
    const totalUsed = storageData.total_used_bytes || 0
    const totalStorage = 5 * 1024 * 1024 * 1024 // 5 GB
    const percentage = Math.round((totalUsed / totalStorage) * 100)

    stats.value.storage = formatBytes(totalUsed)
    stats.value.storagePercentage = percentage
  } catch (error) {
    console.error('Failed to fetch storage:', error)
  } finally {
    isLoadingStorage.value = false
  }
}

const refreshAll = async () => {
  isRefreshing.value = true
  try {
    await Promise.all([fetchDashboard(), fetchStorage()])
  } finally {
    isRefreshing.value = false
  }
}

onMounted(() => {
  fetchDashboard()
  fetchStorage()
})

// Refresh storage when page is activated (user navigates back)
onActivated(() => {
  fetchStorage()
})
</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-up-move {
  transition: transform 0.3s ease;
}
</style>
