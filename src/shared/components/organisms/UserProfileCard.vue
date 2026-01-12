<template>
  <Card
    :class="[
      'group relative overflow-hidden',
      'bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10',
      'dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20',
      'light:from-blue-50/50 light:via-purple-50/50 light:to-pink-50/50',
      'backdrop-blur-md',
      'border border-blue-500/20 dark:border-blue-500/30 light:border-blue-200/50',
      theme.shadowCard,
      'hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/20',
      'lg:col-span-1',
      theme.transition,
      'hover:scale-[1.02]',
      'animate-in fade-in slide-in-from-left-4',
    ]"
  >
    <!-- Decorative gradient orbs -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
    <div class="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-2xl -ml-12 -mb-12"></div>
    
    <div v-if="loading" class="p-6 relative z-10">
      <div class="animate-pulse space-y-4">
        <div class="flex justify-center">
          <div :class="['h-24 w-24 rounded-full', theme.bgSkeleton]"></div>
        </div>
        <div class="space-y-2">
          <div :class="['h-6 w-32 rounded mx-auto', theme.bgSkeleton]"></div>
          <div :class="['h-4 w-48 rounded mx-auto', theme.bgSkeleton]"></div>
        </div>
        <div :class="['h-10 w-full rounded-lg', theme.bgSkeleton]"></div>
        <div class="grid grid-cols-2 gap-2 mt-4">
          <div :class="['h-16 rounded-lg', theme.bgSkeleton]"></div>
          <div :class="['h-16 rounded-lg', theme.bgSkeleton]"></div>
        </div>
      </div>
    </div>
    <template v-else>
      <CardContent class="p-6 relative z-10">
        <div class="flex flex-col items-center gap-5">
          <!-- Profile Avatar with enhanced design -->
          <div class="relative">
            <!-- Outer glow ring -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 blur-xl animate-pulse"></div>
            <!-- Avatar container -->
            <div
              :class="[
                'relative w-28 h-28 rounded-full overflow-hidden',
                'ring-4 ring-white/20 dark:ring-white/10',
                'shadow-2xl',
                'border-2 border-white/30 dark:border-white/20',
                'group-hover:scale-110 transition-transform duration-300',
              ]"
            >
              <img 
                v-if="avatar" 
                :src="avatar" 
                :alt="name" 
                class="w-full h-full object-cover"
              />
              <div
                v-else
                :class="[
                  'w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500',
                  'dark:from-blue-600 dark:via-purple-600 dark:to-pink-600',
                  'light:from-blue-400 light:via-purple-400 light:to-pink-400',
                  'flex items-center justify-center',
                ]"
              >
                <span :class="['text-4xl font-bold text-white']">
                  {{ name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <!-- Status indicator -->
              <div class="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg"></div>
            </div>
          </div>

          <!-- Text Content -->
          <div class="flex flex-col items-center gap-1.5 text-center">
            <h2 :class="['text-2xl font-bold leading-tight', theme.textPrimary]">{{ name }}</h2>
            <p :class="['text-sm font-medium leading-tight', theme.textSecondary]">
              {{ email }}
            </p>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-2 gap-3 w-full mt-2">
            <div
              :class="[
                'rounded-xl p-3 text-center',
                'bg-white/10 dark:bg-white/5 light:bg-white/60',
                'backdrop-blur-sm',
                'border border-white/20 dark:border-white/10 light:border-gray-200/50',
              ]"
            >
              <p :class="['text-lg font-bold', theme.textPrimary]">Free</p>
              <p :class="['text-xs', theme.textSecondary]">Plan</p>
            </div>
            <div
              :class="[
                'rounded-xl p-3 text-center',
                'bg-white/10 dark:bg-white/5 light:bg-white/60',
                'backdrop-blur-sm',
                'border border-white/20 dark:border-white/10 light:border-gray-200/50',
              ]"
            >
              <p :class="['text-lg font-bold', theme.textPrimary]">Active</p>
              <p :class="['text-xs', theme.textSecondary]">Status</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-2 w-full mt-2">
            <Button
              @click="$emit('view-profile')"
              variant="outline"
              size="sm"
              :class="[
                'w-full',
                'bg-white/10 dark:bg-white/5 light:bg-white/60',
                'border-white/20 dark:border-white/10 light:border-gray-200/50',
                'hover:bg-white/20 dark:hover:bg-white/10 light:hover:bg-white/80',
                theme.textPrimary,
                'transition-all duration-300 hover:scale-105 active:scale-95',
              ]"
            >
              <UserIcon class="mr-2 h-4 w-4" />
              View Profile
            </Button>
            <Button
              @click="$emit('logout')"
              variant="outline"
              size="sm"
              :class="[
                'w-full',
                'bg-gradient-to-r from-red-500/20 to-red-600/20',
                'dark:from-red-500/20 dark:to-red-600/20',
                'light:from-red-50 light:to-red-100/50',
                'border-red-500/40 dark:border-red-500/40 light:border-red-300',
                'text-red-500 dark:text-red-400 light:text-red-700',
                'hover:from-red-500/30 hover:to-red-600/30',
                'dark:hover:from-red-500/30 dark:hover:to-red-600/30',
                'light:hover:from-red-100 light:hover:to-red-200',
                'transition-all duration-300 hover:scale-105 active:scale-95 group',
              ]"
            >
              <LogOut
                class="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </template>
  </Card>
</template>

<script setup>
import { LogOut, UserIcon } from 'lucide-vue-next'
import Card from '@/shared/components/shadcn/Card.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

defineProps({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: undefined,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['viewProfile', 'logout'])
</script>
