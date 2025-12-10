<template>
  <Card
    :class="[
      theme.bgCard,
      'backdrop-blur-md',
      theme.borderCard,
      theme.shadowCard,
      'lg:col-span-1',
      theme.transition,
      theme.hoverScale,
      'animate-in fade-in slide-in-from-left-4',
    ]"
  >
    <div v-if="loading" class="p-6">
      <div class="animate-pulse space-y-4">
        <div :class="['h-20 w-20 rounded-full', theme.bgSkeleton]"></div>
        <div :class="['h-6 w-32 rounded', theme.bgSkeleton]"></div>
        <div :class="['h-4 w-48 rounded', theme.bgSkeleton]"></div>
      </div>
    </div>
    <template v-else>
      <CardContent class="pt-8">
        <div class="flex flex-col gap-4">
          <!-- Profile Avatar -->
          <div class="relative w-40 h-40">
            <div
              :class="[
                'w-40 h-40 rounded-full overflow-hidden shadow-2xl relative z-10 border-2',
                theme.borderCard,
              ]"
            >
              <img v-if="avatar" :src="avatar" :alt="name" class="w-full h-full object-cover" />
              <div
                v-else
                :class="[
                  'w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 light:from-gray-200 light:via-gray-300 light:to-gray-100 flex items-center justify-center',
                ]"
              >
                <span :class="['text-4xl font-bold', theme.textPrimary]">
                  {{ name.charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
          </div>

          <!-- Text Content -->
          <div class="flex flex-col gap-0.5">
            <h2 :class="['text-3xl font-bold leading-tight', theme.textPrimary]">{{ name }}</h2>
            <p :class="['text-base mt-1 font-normal leading-tight', theme.textSecondary]">
              {{ email }}
            </p>
          </div>

          <!-- Logout Button -->
          <Button
            @click="$emit('logout')"
            variant="outline"
            size="lg"
            class="mt-4 w-full bg-red-500/10 dark:bg-red-500/10 light:bg-red-50 border-red-500/30 dark:border-red-500/30 light:border-red-300 text-red-500 dark:text-red-400 light:text-red-700 hover:bg-red-500/20 dark:hover:bg-red-500/20 light:hover:bg-red-100 transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <LogOut
              class="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
            <span>Sign Out</span>
          </Button>
        </div>
      </CardContent>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import Card from '@/components/shadcn/Card.vue'
import CardContent from '@/components/shadcn/CardContent.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

defineProps<{
  name: string
  email: string
  avatar?: string
  loading?: boolean
}>()

defineEmits<{
  viewProfile: []
  logout: []
}>()
</script>
