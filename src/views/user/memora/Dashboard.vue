<template>
  <DashboardLayout>
    <template #breadcrumb> Overview </template>
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
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-center gap-4"
              >
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

<script setup>
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
import StatCard from '@/components/molecules/StatCard.vue'
import { useNavigation } from '@/composables/useNavigation'

const { navigateTo } = useNavigation()

const stats = ref({
  totalPhotos: 0,
  newPhotosThisMonth: 0,
  activeClients: 0,
  newClientsThisMonth: 0,
  totalAlbums: 0,
  activeAlbums: 0,
  storageUsed: '0 GB',
  storagePercentage: 0,
})

const recentActivity = ref([
  {
    id: '1',
    title: 'New photos uploaded',
    description: 'Client uploaded 25 new photos',
    time: '2 hours ago',
    icon: Upload,
  },
  {
    id: '2',
    title: 'New collection created',
    description: 'Wedding Collection created',
    time: '5 hours ago',
    icon: FolderPlus,
  },
  {
    id: '3',
    title: 'New client added',
    description: 'John Doe added to system',
    time: '1 day ago',
    icon: UserPlus,
  },
  {
    id: '4',
    title: 'Photos captured',
    description: 'Event photos captured',
    time: '2 days ago',
    icon: Camera,
  },
])

const quickActions = [
  { route: { name: 'manageCollections' }, label: 'View Collections', icon: Folder },
  { route: { name: 'collectionPhotos' }, label: 'Upload Media', icon: Upload },
  { route: { name: 'manageCollections' }, label: 'Create Collection', icon: FolderPlus },
  { route: { name: 'manageCollections' }, label: 'Add Client', icon: UserPlus },
]
</script>
