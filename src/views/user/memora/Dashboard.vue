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
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p class="text-muted-foreground mt-2 text-sm sm:text-base md:text-lg">
              Welcome back! Here's an overview of your Memora system.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            class="shrink-0 w-full sm:w-auto"
            @click="refreshAll"
            :disabled="isRefreshing"
          >
            <RefreshCw :class="['h-4 w-4 mr-2', isRefreshing && 'animate-spin']" />
            Refresh
          </Button>
        </div>
      </div>

      <!-- Stats Cards -->
      <TransitionGroup
        v-if="!isLoadingStats"
        tag="div"
        class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        name="fade-up"
      >
        <StatCard
          key="collections"
          title="Collections"
          :value="stats.collections"
          :description="`${stats.publishedCollections} published`"
          :icon="FolderOpen"
          color="blue"
        />
        <StatCard
          key="projects"
          title="Projects"
          :value="stats.projects"
          :description="`${stats.activeProjects} active`"
          :icon="FolderKanban"
          color="purple"
        />
        <StatCard
          key="selections"
          title="Selections"
          :value="stats.selections"
          :description="`${stats.completedSelections} completed`"
          :icon="CheckSquare"
          color="green"
        />
        <StatCard
          key="proofing"
          title="Proofing"
          :value="stats.proofing"
          :description="`${stats.activeProofing} active`"
          :icon="Eye"
          color="orange"
        />
        <StatCard
          key="media"
          title="Total Media"
          :value="stats.totalMedia.toLocaleString()"
          :description="`${stats.featuredMedia} featured`"
          :icon="Images"
          color="indigo"
        />
        <StatCard
          key="presets"
          title="Presets"
          :value="stats.presets"
          :description="`${stats.activePresets} active`"
          :icon="Palette"
          color="purple"
        />
        <StatCard
          key="watermarks"
          title="Watermarks"
          :value="stats.watermarks"
          :description="`${stats.activeWatermarks} active`"
          :icon="ImageIcon"
          color="blue"
        />
        <StatCard
          key="storage"
          title="Storage"
          :value="stats.storage"
          :description="`${stats.storagePercentage}% used`"
          :icon="HardDrive"
          color="green"
          :loading="isLoadingStorage"
        />
      </TransitionGroup>

      <!-- Stats Cards Skeleton -->
      <div v-if="isLoadingStats" class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          v-for="i in 8"
          :key="i"
          class="h-36 border-border/50 overflow-hidden"
        >
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
          class="overflow-hidden border-border/50"
          :class="{ 'hover:shadow-lg transition-shadow duration-300': !isLoadingActivityChart }"
        >
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <Skeleton v-if="isLoadingActivityChart" class="h-6 w-40 mb-2" />
                <template v-else>
                  <CardTitle class="text-lg font-semibold">Recent Activity</CardTitle>
                  <CardDescription class="mt-1">Content created over the last 7 days</CardDescription>
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
          class="overflow-hidden border-border/50"
          :class="{ 'hover:shadow-lg transition-shadow duration-300': !isLoadingDistributionChart }"
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
          class="col-span-1 lg:col-span-4 border-border/50"
          :class="{ 'hover:shadow-lg transition-shadow duration-300': !isLoadingRecentActivity }"
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
              <div
                v-for="i in 5"
                :key="i"
                class="flex items-center gap-4 p-3 rounded-lg"
              >
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
              <div class="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-2">
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
                  class="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                  :style="{ 'animation-delay': `${index * 50}ms` }"
                >
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200 shrink-0"
                  >
                    <component
                      :is="getActivityIcon(activity.type)"
                      class="h-5 w-5 text-primary"
                    />
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
          class="col-span-1 lg:col-span-3 border-border/50 hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <CardTitle class="text-lg font-semibold">Quick Actions</CardTitle>
                <CardDescription class="mt-1">Common tasks and shortcuts</CardDescription>
              </div>
              <Zap class="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent class="pt-0 space-y-2">
            <Button
              v-for="(action, index) in quickActions"
              :key="action.label"
              class="w-full justify-start group hover:scale-[1.02] transition-transform duration-200 text-sm sm:text-base"
              variant="outline"
              size="sm"
              @click="navigateTo(action.route)"
              :style="{ 'animation-delay': `${index * 30}ms` }"
            >
              <component
                :is="action.icon"
                class="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200 shrink-0"
              />
              <span class="font-medium truncate">{{ action.label }}</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, onActivated, computed } from 'vue'
import {
  Images,
  FolderOpen,
  FolderKanban,
  CheckSquare,
  Eye,
  Palette,
  Image as ImageIcon,
  HardDrive,
  Upload,
  FolderPlus,
  Plus,
  RefreshCw,
  TrendingUp,
  PieChart,
  Clock,
  Activity,
  Zap,
} from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import Card from '@/components/shadcn/Card.vue'
import CardContent from '@/components/shadcn/CardContent.vue'
import CardDescription from '@/components/shadcn/CardDescription.vue'
import CardHeader from '@/components/shadcn/CardHeader.vue'
import CardTitle from '@/components/shadcn/CardTitle.vue'
import { Button } from '@/components/shadcn/button'
import StatCard from '@/components/molecules/StatCard.vue'
import { useNavigation } from '@/composables/useNavigation'
import { apiClient } from '@/api/client'
import { formatDistanceToNow } from 'date-fns'
import ActivityChart from '@/components/molecules/ActivityChart.vue'
import DistributionChart from '@/components/molecules/DistributionChart.vue'
import { Skeleton } from '@/components/shadcn/skeleton'
import { useAuthApi } from '@/api/auth'

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
  storage: '0 GB',
  storagePercentage: 0,
})

const activityData = ref([])
const distributionData = ref([])
const recentActivity = ref([])

const quickActions = [
  { route: { name: 'manageCollections' }, label: 'View Collections', icon: FolderOpen },
  { route: { name: 'projects' }, label: 'View Projects', icon: FolderKanban },
  { route: { name: 'selections' }, label: 'View Selections', icon: CheckSquare },
  { route: { name: 'proofing' }, label: 'View Proofing', icon: Eye },
  { route: { name: 'manageCollections' }, label: 'Create Collection', icon: Plus },
]

const getActivityIcon = type => {
  const icons = {
    collection: FolderOpen,
    project: FolderKanban,
    selection: CheckSquare,
    proofing: Eye,
  }
  return icons[type] || FolderOpen
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
    const dashboardData = response?.data?.data || response?.data

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
      }

      // Update activity chart data
      if (dashboardData.activity && Array.isArray(dashboardData.activity)) {
        activityData.value = dashboardData.activity.map(d => ({
          date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          collections: d.collections || 0,
          projects: d.projects || 0,
          selections: d.selections || 0,
          proofing: d.proofing || 0,
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
        { label: 'Collections', value: stats.value.collections, color: '#3b82f6' },
        { label: 'Projects', value: stats.value.projects, color: '#8b5cf6' },
        { label: 'Selections', value: stats.value.selections, color: '#10b981' },
        { label: 'Proofing', value: stats.value.proofing, color: '#f59e0b' },
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
