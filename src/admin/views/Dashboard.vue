<template>
  <div :class="['min-h-full w-full', theme.bgPage, theme.transitionColors, 'relative z-0']">
    <!-- Main Content -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
      <!-- Admin Profile Cover Card -->
      <div
        :class="[
          'relative overflow-hidden rounded-3xl',
          'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700',
          'dark:from-purple-700 dark:via-blue-700 dark:to-indigo-800',
          'shadow-2xl',
          'group',
        ]"
      >
        <!-- Background Effects -->
        <div class="absolute inset-0 opacity-20">
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"
          ></div>
          <div
            class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -ml-40 -mb-40"
          ></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 p-6 sm:p-8">
          <div v-if="loading" class="animate-pulse">
            <div class="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              <div :class="['h-32 w-32 rounded-full', theme.bgSkeleton]"></div>
              <div class="flex-1 space-y-3 text-center sm:text-left">
                <div :class="['h-8 w-48 rounded mx-auto sm:mx-0', theme.bgSkeleton]"></div>
                <div :class="['h-5 w-64 rounded mx-auto sm:mx-0', theme.bgSkeleton]"></div>
                <div class="flex gap-3 justify-center sm:justify-start mt-4">
                  <div :class="['h-10 w-24 rounded', theme.bgSkeleton]"></div>
                  <div :class="['h-10 w-24 rounded', theme.bgSkeleton]"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <!-- Avatar -->
            <div class="relative shrink-0">
              <div
                class="absolute inset-0 rounded-full bg-white/30 dark:bg-white/20 blur-xl scale-110"
              ></div>
              <div
                :class="[
                  'relative w-32 h-32 rounded-full overflow-hidden',
                  'ring-4 ring-white/40 dark:ring-white/20',
                  'shadow-2xl',
                  'border-4 border-white/50 dark:border-white/30',
                  'group-hover:scale-105 transition-transform duration-300',
                ]"
              >
                <div
                  :class="[
                    'w-full h-full bg-gradient-to-br from-white/90 to-white/70',
                    'dark:from-gray-800 dark:to-gray-900',
                    'flex items-center justify-center',
                  ]"
                >
                  <Shield
                    class="h-16 w-16 text-white dark:text-purple-300"
                  />
                </div>
                <div
                  class="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-gray-900 shadow-lg"
                ></div>
              </div>
            </div>

            <!-- Admin Info -->
            <div class="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h2 :class="['text-3xl sm:text-4xl font-bold text-white drop-shadow-lg']">
                  {{ adminData.name }}
                </h2>
                <p :class="['text-base sm:text-lg text-white/90 mt-1']">
                  {{ adminData.email }}
                </p>
                <div class="flex items-center gap-2 justify-center sm:justify-start mt-2">
                  <Badge
                    :class="[
                      'bg-white/20 dark:bg-white/10',
                      'backdrop-blur-sm',
                      'border border-white/30 dark:border-white/20',
                      'text-white',
                    ]"
                  >
                    <Shield class="h-3 w-3 mr-1" />
                    {{ adminData.roleLabel }}
                  </Badge>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap items-center gap-3 justify-center sm:justify-start mt-4">
                <Button
                  :class="[
                    'bg-white/20 dark:bg-white/10',
                    'backdrop-blur-sm',
                    'border border-white/30 dark:border-white/20',
                    'text-white hover:bg-white/30 dark:hover:bg-white/20',
                    'transition-all duration-300 hover:scale-105 active:scale-95',
                  ]"
                  size="sm"
                  @click="navigateTo({ name: 'admin-users' })"
                >
                  <Users class="h-4 w-4" />
                  Manage Users
                </Button>
                <Button
                  :class="[
                    'bg-white/20 dark:bg-white/10',
                    'backdrop-blur-sm',
                    'border border-white/30 dark:border-white/20',
                    'text-white hover:bg-white/30 dark:hover:bg-white/20',
                    'transition-all duration-300 hover:scale-105 active:scale-95',
                  ]"
                  size="sm"
                  @click="navigateTo({ name: 'admin-analytics' })"
                >
                  <BarChart3 class="h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="!loading && stats" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Total Users -->
        <div
          :class="[
            'group relative overflow-hidden rounded-2xl p-5',
            'bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent',
            'dark:from-blue-500/20 dark:via-blue-500/10',
            'light:from-blue-50 light:to-blue-100/50',
            'border border-blue-500/30 dark:border-blue-500/30 light:border-blue-200',
            'backdrop-blur-sm',
            'hover:scale-[1.02] transition-all duration-300',
            'hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/20',
            'cursor-pointer',
          ]"
          @click="navigateTo({ name: 'admin-users' })"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-2">
              <p :class="['text-sm font-medium', theme.textSecondary]">Total Users</p>
              <p :class="['text-2xl font-bold', theme.textPrimary]">
                {{ formatNumber(stats.total_users) }}
              </p>
              <p :class="['text-xs', theme.textSecondary]">
                {{ stats.active_users }} active
              </p>
            </div>
            <div class="p-2 rounded-xl bg-blue-500/20 dark:bg-blue-500/20 light:bg-blue-100">
              <Users class="h-5 w-5 text-blue-400 dark:text-blue-400 light:text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Products -->
        <div
          :class="[
            'group relative overflow-hidden rounded-2xl p-5',
            'bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent',
            'dark:from-green-500/20 dark:via-green-500/10',
            'light:from-green-50 light:to-green-100/50',
            'border border-green-500/30 dark:border-green-500/30 light:border-green-200',
            'backdrop-blur-sm',
            'hover:scale-[1.02] transition-all duration-300',
            'hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-green-500/20',
            'cursor-pointer',
          ]"
          @click="navigateTo({ name: 'admin-products' })"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-2">
              <p :class="['text-sm font-medium', theme.textSecondary]">Products</p>
              <p :class="['text-2xl font-bold', theme.textPrimary]">
                {{ formatNumber(stats.active_products) }}
              </p>
              <p :class="['text-xs', theme.textSecondary]">
                {{ stats.total_products }} total
              </p>
            </div>
            <div class="p-2 rounded-xl bg-green-500/20 dark:bg-green-500/20 light:bg-green-100">
              <Package class="h-5 w-5 text-green-400 dark:text-green-400 light:text-green-600" />
            </div>
          </div>
        </div>

        <!-- Early Access -->
        <div
          :class="[
            'group relative overflow-hidden rounded-2xl p-5',
            'bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent',
            'dark:from-yellow-500/20 dark:via-yellow-500/10',
            'light:from-yellow-50 light:to-yellow-100/50',
            'border border-yellow-500/30 dark:border-yellow-500/30 light:border-yellow-200',
            'backdrop-blur-sm',
            'hover:scale-[1.02] transition-all duration-300',
            'hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-yellow-500/20',
            'cursor-pointer',
          ]"
          @click="navigateTo({ name: 'admin-early-access' })"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-2">
              <p :class="['text-sm font-medium', theme.textSecondary]">Early Access</p>
              <p :class="['text-2xl font-bold', theme.textPrimary]">
                {{ formatNumber(stats.early_access_users) }}
              </p>
              <p :class="['text-xs', theme.textSecondary]">active users</p>
            </div>
            <div class="p-2 rounded-xl bg-yellow-500/20 dark:bg-yellow-500/20 light:bg-yellow-100">
              <Star class="h-5 w-5 text-yellow-400 dark:text-yellow-400 light:text-yellow-600" />
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div
          :class="[
            'group relative overflow-hidden rounded-2xl p-5',
            'bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent',
            'dark:from-purple-500/20 dark:via-purple-500/10',
            'light:from-purple-50 light:to-purple-100/50',
            'border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200',
            'backdrop-blur-sm',
            'hover:scale-[1.02] transition-all duration-300',
            'hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-purple-500/20',
            'cursor-pointer',
          ]"
          @click="navigateTo({ name: 'admin-analytics' })"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-2">
              <p :class="['text-sm font-medium', theme.textSecondary]">Activity (7d)</p>
              <p :class="['text-2xl font-bold', theme.textPrimary]">
                {{ formatNumber(stats.recent_activity) }}
              </p>
              <p :class="['text-xs', theme.textSecondary]">events</p>
            </div>
            <div class="p-2 rounded-xl bg-purple-500/20 dark:bg-purple-500/20 light:bg-purple-100">
              <Activity class="h-5 w-5 text-purple-400 dark:text-purple-400 light:text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links Section -->
      <div v-if="!loading" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 :class="['text-xl font-semibold', theme.textPrimary]">Quick Actions</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Users"
            description="Manage all users, roles, and permissions"
            icon="Users"
            :icon-color="'text-blue-400'"
            @click="navigateTo({ name: 'admin-users' })"
          />
          <DashboardCard
            title="Products"
            description="Configure products and features"
            icon="Package"
            :icon-color="'text-green-400'"
            @click="navigateTo({ name: 'admin-products' })"
          />
          <DashboardCard
            title="Early Access"
            description="Grant and manage early access"
            icon="Star"
            :icon-color="'text-yellow-400'"
            @click="navigateTo({ name: 'admin-early-access' })"
          />
          <DashboardCard
            title="Analytics"
            description="View activity logs and insights"
            icon="BarChart3"
            :icon-color="'text-purple-400'"
            @click="navigateTo({ name: 'admin-analytics' })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/shared/stores/user'
import { useAdminStore } from '@/admin/stores/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'
import { Badge } from '@/shared/components/shadcn/badge'
import DashboardCard from '@/shared/components/organisms/DashboardCard.vue'
import {
  Users,
  Package,
  Star,
  BarChart3,
  Shield,
  Activity,
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const adminStore = useAdminStore()
const theme = useThemeClasses()

const stats = ref(null)
const loading = ref(true)

const adminData = computed(() => {
  if (userStore.user) {
    return {
      name: userStore.user.name || 'Admin',
      email: userStore.user.email || '',
      role: userStore.user.role || 'admin',
      roleLabel: userStore.isSuperAdmin ? 'Super Admin' : 'Admin',
    }
  }
  return {
    name: 'Admin',
    email: '',
    role: 'admin',
    roleLabel: 'Admin',
  }
})

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const navigateTo = (route) => {
  router.push(route)
}

onMounted(async () => {
  try {
    stats.value = await adminStore.fetchDashboardStats()
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
