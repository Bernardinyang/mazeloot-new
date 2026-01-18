<template>
  <DropdownMenu v-model:open="isOpen">
    <DropdownMenuTrigger as-child>
      <Button
        :class="[
          theme.textPrimary,
          theme.bgButtonHover,
          theme.transition,
          'relative h-9 w-9 rounded-lg',
          'hover:scale-105 active:scale-95',
        ]"
        size="icon"
        variant="ghost"
      >
        <Bell class="h-5 w-5 transition-transform duration-200" :class="{ 'animate-ring': unreadCount > 0 }" />
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-0"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-0"
        >
          <span
            v-if="unreadCount > 0"
            :class="[
              'absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 text-[11px] font-semibold text-white',
              'bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700',
              'rounded-full flex items-center justify-center shadow-lg',
              'ring-2 ring-background dark:ring-gray-900',
              'animate-pulse-slow',
            ]"
          >
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </Transition>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      :class="[
        'w-[420px] max-h-[640px] p-0 rounded-xl shadow-2xl',
        'border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl',
        'animate-in fade-in-0 zoom-in-95 duration-200',
      ]"
      align="end"
      :side-offset="8"
    >
      <!-- Header -->
      <div
        class="sticky top-0 z-20 px-4 pt-4 pb-3 border-b border-gray-200/60 dark:border-gray-700/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
      >
        <div class="flex items-center justify-between mb-1">
          <h3 class="text-base font-semibold tracking-tight" :class="theme.textPrimary">
            Notifications
          </h3>
          <Button
            v-if="hasUnreadNotifications"
            variant="ghost"
            size="sm"
            :class="[
              'h-7 px-2.5 text-xs font-medium',
              'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
              'hover:bg-blue-50 dark:hover:bg-blue-950/30',
              'rounded-md transition-all duration-200',
            ]"
            @click.stop="handleMarkAllAsRead"
          >
            Mark all read
          </Button>
        </div>
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <p
            v-if="unreadCount > 0"
            class="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1"
          >
            {{ unreadCount }} unread {{ unreadCount === 1 ? 'notification' : 'notifications' }}
          </p>
        </Transition>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[560px] overscroll-contain">
        <!-- Loading State -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
        >
          <div v-if="isLoading" class="p-8">
            <div class="space-y-3">
              <div v-for="i in 3" :key="i" class="flex gap-3 animate-pulse">
                <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="filteredNotifications.length === 0"
            class="flex flex-col items-center justify-center p-12 text-center"
          >
            <div
              :class="[
                'h-16 w-16 rounded-full flex items-center justify-center mb-4',
                'bg-gray-100 dark:bg-gray-800/50',
                'transition-all duration-300',
              ]"
            >
              <Bell class="h-8 w-8 opacity-40" :class="theme.textTertiary" />
            </div>
            <h4 class="text-sm font-semibold mb-1.5" :class="theme.textPrimary">
              All caught up!
            </h4>
            <p class="text-xs leading-relaxed max-w-[200px]" :class="theme.textSecondary">
              You don't have any notifications right now. We'll notify you when something important happens.
            </p>
          </div>

          <!-- Notifications List -->
          <div v-else class="divide-y divide-gray-100 dark:divide-gray-800/50">
            <TransitionGroup
              name="notification"
              tag="div"
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-x-4"
              enter-to-class="opacity-100 translate-x-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-x-0"
              leave-to-class="opacity-0 -translate-x-4"
            >
              <template v-for="(group, groupIndex) in groupedNotifications" :key="`group-${groupIndex}`">
                <!-- Group Header -->
                <div
                  v-if="group.label"
                  :class="[
                    'sticky top-0 z-10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider',
                    'bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm',
                    'border-b border-gray-200/60 dark:border-gray-700/60',
                    theme.textTertiary,
                  ]"
                >
                  {{ group.label }}
                </div>

                <!-- Notification Items -->
                <div
                  v-for="notification in group.notifications"
                  :key="notification.id"
                  :class="[
                    'group relative px-4 py-3.5 cursor-pointer transition-all duration-200',
                    'hover:bg-gray-50 dark:hover:bg-gray-800/30',
                    'border-l-3',
                    notification.readAt
                      ? 'border-transparent bg-white dark:bg-gray-900/50'
                      : 'border-blue-500 dark:border-blue-400 bg-blue-50/30 dark:bg-blue-950/10',
                  ]"
                  @click="handleNotificationClick(notification)"
                >
                  <div class="flex items-start gap-3.5">
                    <!-- Icon Badge -->
                    <div
                      :class="[
                        'relative h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                        'transition-all duration-200 group-hover:scale-110',
                        getNotificationIconColor(notification.type),
                        'shadow-sm group-hover:shadow-md',
                      ]"
                    >
                      <component
                        :is="getNotificationIcon(notification.type)"
                        class="h-5 w-5 transition-transform duration-200 group-hover:rotate-3"
                      />
                      <Transition
                        enter-active-class="transition-all duration-200 ease-out"
                        enter-from-class="opacity-0 scale-0"
                        enter-to-class="opacity-100 scale-100"
                        leave-active-class="transition-all duration-150 ease-in"
                        leave-from-class="opacity-100 scale-100"
                        leave-to-class="opacity-0 scale-0"
                      >
                        <span
                          v-if="!notification.readAt"
                          class="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500 dark:bg-blue-400 ring-2 ring-white dark:ring-gray-900 animate-pulse"
                        />
                      </Transition>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0 pt-0.5">
                      <div class="flex items-start justify-between gap-2 mb-1.5">
                        <h4
                          :class="[
                            'text-sm font-semibold leading-snug pr-1',
                            notification.readAt ? theme.textPrimary : 'text-gray-900 dark:text-gray-50',
                          ]"
                        >
                          {{ notification.title }}
                        </h4>
                        <button
                          v-if="!notification.readAt"
                          :class="[
                            'h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0 mt-1.5',
                            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                            'hover:scale-125 active:scale-100',
                          ]"
                          @click.stop="handleMarkAsRead(notification.id)"
                          aria-label="Mark as read"
                        />
                      </div>

                      <p
                        :class="[
                          'text-sm leading-relaxed mb-2.5 line-clamp-2',
                          notification.readAt
                            ? theme.textSecondary
                            : 'text-gray-700 dark:text-gray-300',
                        ]"
                      >
                        {{ notification.message }}
                      </p>

                      <!-- Meta Info -->
                      <div class="flex items-center gap-2 flex-wrap">
                        <div class="flex items-center gap-1.5">
                          <span class="text-[11px] font-medium" :class="theme.textTertiary">
                            {{ formatRelativeTime(notification.createdAt) }}
                          </span>
                        </div>
                        <span class="text-[10px] opacity-40" :class="theme.textTertiary">•</span>
                        <span
                          :class="[
                            'text-[11px] px-2 py-0.5 rounded-full font-medium',
                            notification.product === 'memora' &&
                              'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
                            notification.product === 'profolio' &&
                              'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
                            notification.product === 'general' &&
                              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                          ]"
                        >
                          {{ notification.product }}
                        </span>
                      </div>
                    </div>

                    <!-- Delete Button (Hover) -->
                    <button
                      :class="[
                        'absolute top-3 right-3 h-7 w-7 rounded-md flex items-center justify-center',
                        'opacity-0 group-hover:opacity-100 transition-all duration-200',
                        'text-gray-400 hover:text-red-500 dark:hover:text-red-400',
                        'hover:bg-red-50 dark:hover:bg-red-950/20',
                        'active:scale-95',
                      ]"
                      @click.stop="handleDelete(notification.id)"
                      aria-label="Delete notification"
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </template>
            </TransitionGroup>
          </div>
        </Transition>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Image,
  Folder,
  Settings,
  Link as LinkIcon,
  Sparkles,
  Download,
  Star,
  X,
  Trash2,
} from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu/index'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useNotificationsStore } from '@/shared/stores/notifications'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: String,
    default: null,
    validator: value => !value || ['memora', 'profolio', 'general'].includes(value),
  },
  maxHeight: {
    type: String,
    default: '600px',
  },
})

const emit = defineEmits(['notification-click', 'mark-all-read'])

const theme = useThemeClasses()
const router = useRouter()
const notificationsStore = useNotificationsStore()

const isOpen = ref(false)
const isLoading = computed(() => notificationsStore.isLoading)

const filteredNotifications = computed(() => {
  const allNotifications = props.product
    ? notificationsStore.memoraNotifications
    : notificationsStore.allNotifications
  return allNotifications || []
})

const unreadCount = computed(() => {
  if (props.product) {
    return props.product === 'memora' ? notificationsStore.unreadMemoraCount : 0
  }
  return notificationsStore.unreadTotalCount
})

const hasUnreadNotifications = computed(() => {
  return filteredNotifications.value.some(n => !n.readAt)
})

const formatRelativeTime = dateString => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

const getNotificationIcon = type => {
  const iconMap = {
    // Watermarks
    watermark_created: Sparkles,
    watermark_updated: Sparkles,
    watermark_deleted: XCircle,
    // Presets
    preset_created: Folder,
    preset_updated: Folder,
    preset_deleted: XCircle,
    // Settings
    settings_branding_updated: Settings,
    settings_preference_updated: Settings,
    settings_email_updated: Settings,
    settings_updated: Settings,
    // Social Links
    social_link_created: LinkIcon,
    social_link_updated: LinkIcon,
    social_link_deleted: XCircle,
    social_links_reordered: LinkIcon,
    // Collections
    collection_created: Folder,
    collection_published: CheckCircle,
    collection_updated: Folder,
    collection_deleted: XCircle,
    // Media
    media_uploaded: Image,
    media_bulk_uploaded: Image,
    // Selections
    selection_created: CheckCircle,
    selection_completed: CheckCircle,
    selection_deleted: XCircle,
    // Proofing
    proofing_approved: CheckCircle,
    proofing_rejected: XCircle,
    // Downloads
    download_ready: Download,
    // General
    default: Info,
  }
  return iconMap[type] || iconMap.default
}

const getNotificationIconColor = type => {
  if (type?.includes('deleted') || type?.includes('rejected')) {
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/40'
  }
  if (type?.includes('completed') || type?.includes('approved') || type?.includes('published') || type?.includes('ready')) {
    return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950/40'
  }
  if (type?.includes('created') || type?.includes('uploaded')) {
    return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/40'
  }
  if (type?.includes('updated')) {
    return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40'
  }
  return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/40'
}

const groupedNotifications = computed(() => {
  const groups = []
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const todayNotifications = []
  const yesterdayNotifications = []
  const weekNotifications = []
  const olderNotifications = []

  filteredNotifications.value.forEach(notification => {
    const date = new Date(notification.createdAt)
    if (date >= today) {
      todayNotifications.push(notification)
    } else if (date >= yesterday) {
      yesterdayNotifications.push(notification)
    } else if (date >= weekAgo) {
      weekNotifications.push(notification)
    } else {
      olderNotifications.push(notification)
    }
  })

  if (todayNotifications.length > 0) {
    groups.push({ label: 'Today', notifications: todayNotifications })
  }
  if (yesterdayNotifications.length > 0) {
    groups.push({ label: 'Yesterday', notifications: yesterdayNotifications })
  }
  if (weekNotifications.length > 0) {
    groups.push({ label: 'This Week', notifications: weekNotifications })
  }
  if (olderNotifications.length > 0) {
    groups.push({ label: 'Older', notifications: olderNotifications })
  }

  return groups
})

const handleNotificationClick = async notification => {
  if (!notification.readAt) {
    await handleMarkAsRead(notification.id)
  }

  emit('notification-click', notification)

  if (notification.actionUrl) {
    router.push(notification.actionUrl)
  }

  isOpen.value = false
}

const handleMarkAsRead = async id => {
  try {
    await notificationsStore.markAsRead(id)
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

const handleMarkAllAsRead = async () => {
  try {
    await notificationsStore.markAllAsRead(props.product)
    emit('mark-all-read')
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}

const handleDelete = async id => {
  try {
    await notificationsStore.deleteNotification(id)
  } catch (error) {
    console.error('Failed to delete notification:', error)
  }
}

// Watch for dropdown open/close to refresh notifications
watch(isOpen, async newValue => {
  if (newValue && !isLoading.value) {
    await notificationsStore.fetchNotifications(props.product)
    await notificationsStore.fetchUnreadCounts()
  }
})

onMounted(async () => {
  try {
    if (!notificationsStore.isInitialized) {
      await notificationsStore.initialize()
    } else {
      await notificationsStore.fetchNotifications(props.product)
      await notificationsStore.fetchUnreadCounts()
    }
  } catch (error) {
    console.error('Failed to load notifications in NotificationDropdown:', error)
  }
})
</script>

<style scoped>
@keyframes ring {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

.animate-ring {
  animation: ring 0.5s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.border-l-3 {
  border-left-width: 3px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
