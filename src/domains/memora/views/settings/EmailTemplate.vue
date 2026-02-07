<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Email Template </template>
    <template #header>
      <Button variant="ghost" size="sm" class="rounded-lg gap-1" @click="goBack">
        <ChevronLeft class="h-4 w-4" />
        Back
      </Button>
    </template>

    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">
          Email Template
        </h1>
        <p class="text-sm mb-4" :class="theme.textSecondary">
          Customize email templates for your client communications.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Content -->
      <div class="space-y-6">
        <!-- Coming Soon Section -->
        <div class="flex flex-col items-center justify-center py-20">
          <div class="text-center space-y-6">
            <!-- Coming Soon SVG Illustration -->
            <div class="w-48 h-48 mx-auto flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <!-- Background Circle with Themed Fill -->
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke-width="2"
                  class="stroke-gray-300 dark:stroke-gray-600 fill-gray-100 dark:fill-gray-900"
                />
                <!-- Clock Icon -->
                <circle
                  cx="100"
                  cy="80"
                  r="35"
                  stroke-width="3"
                  class="stroke-accent"
                  fill="none"
                />
                <!-- Clock Hands -->
                <line
                  x1="100"
                  y1="80"
                  x2="100"
                  y2="60"
                  stroke-width="3"
                  stroke-linecap="round"
                  class="stroke-accent"
                />
                <line
                  x1="100"
                  y1="80"
                  x2="115"
                  y2="80"
                  stroke-width="2"
                  stroke-linecap="round"
                  class="stroke-accent"
                />
                <!-- Envelope Icon -->
                <rect
                  x="70"
                  y="130"
                  width="60"
                  height="40"
                  rx="4"
                  stroke-width="2"
                  class="stroke-accent"
                  fill="none"
                />
                <path
                  d="M70 130 L100 150 L130 130"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="stroke-accent"
                  fill="none"
                />
              </svg>
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl font-semibold" :class="theme.textPrimary">Coming Soon</h2>
              <p class="text-sm max-w-md mx-auto" :class="theme.textSecondary">
                Email template customization is currently under development. Check back soon for
                updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Separator } from '@/shared/components/shadcn/separator'
import { Button } from '@/shared/components/shadcn/button'
import { ChevronLeft } from '@/shared/utils/lucideAnimated'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const router = useRouter()
function goBack() {
  router.back()
}
const theme = useThemeClasses()
</script>
