<template>
  <DashboardLayout>
    <template #breadcrumb>
      Overview
    </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p class="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your photo gallery.
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Photos"
          :value="stats.totalPhotos"
          :description="`+${stats.newPhotosThisMonth} from last month`"
          :icon="Images"
        />
        <StatCard
          title="Active Clients"
          :value="stats.activeClients"
          :description="`${stats.newClientsThisMonth} new this month`"
          :icon="Users"
        />
        <StatCard
          title="Albums"
          :value="stats.totalAlbums"
          :description="`${stats.activeAlbums} active`"
          :icon="Folder"
        />
        <StatCard
          title="Storage Used"
          :value="stats.storageUsed"
          :description="`${stats.storagePercentage}% of total`"
          :icon="HardDrive"
        />
      </div>

      <!-- Recent Activity & Quick Actions -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card class="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest uploads and client interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <component :is="activity.icon" class="h-5 w-5 text-primary" />
                </div>
                <div class="flex-1 space-y-1">
                  <p class="text-sm font-medium leading-none">{{ activity.title }}</p>
                  <p class="text-sm text-muted-foreground">{{ activity.description }}</p>
                </div>
                <div class="text-sm text-muted-foreground">{{ activity.time }}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <Button
              v-for="action in quickActions"
              :key="action.label"
              class="w-full justify-start"
              variant="outline"
              @click="navigateTo(action.route)"
            >
              <component :is="action.icon" class="mr-2 h-4 w-4" />
              {{ action.label }}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Images,
  Users,
  Folder,
  HardDrive,
  Upload,
  Camera,
  UserPlus,
  FolderPlus,
} from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import Card from '@/components/shadcn/Card.vue'
import CardContent from '@/components/shadcn/CardContent.vue'
import CardDescription from '@/components/shadcn/CardDescription.vue'
import CardHeader from '@/components/shadcn/CardHeader.vue'
import CardTitle from '@/components/shadcn/CardTitle.vue'
import { Button } from '@/components/shadcn/button'
import StatCard from '@/components/custom/StatCard.vue'
import { useNavigation } from '@/composables/useNavigation'

const { navigateTo } = useNavigation()

const stats = ref({
  totalPhotos: 1247,
  newPhotosThisMonth: 89,
  activeClients: 24,
  newClientsThisMonth: 3,
  totalAlbums: 156,
  activeAlbums: 42,
  storageUsed: '12.4 GB',
  storagePercentage: 62,
})

const recentActivity = ref([
  {
    id: 1,
    title: 'New photos uploaded',
    description: 'Sarah uploaded 15 photos to "Summer Collection"',
    time: '2 hours ago',
    icon: Camera,
  },
  {
    id: 2,
    title: 'New client added',
    description: 'John Smith was added to the system',
    time: '5 hours ago',
    icon: UserPlus,
  },
  {
    id: 3,
    title: 'Album created',
    description: 'New album "Wedding Photos 2025" created',
    time: '1 day ago',
    icon: FolderPlus,
  },
  {
    id: 4,
    title: 'Photos shared',
    description: '45 photos shared with client "ABC Photography"',
    time: '2 days ago',
    icon: Images,
  },
])

const quickActions = [
  { route: { name: 'memora-upload' }, label: 'Upload Photos', icon: Upload },
  { route: { name: 'memora-gallery' }, label: 'View Gallery', icon: Images },
  { route: { name: 'memora-clients' }, label: 'Manage Clients', icon: Users },
  { route: { name: 'memora-collections' }, label: 'Create Album', icon: Folder },
]
</script>

