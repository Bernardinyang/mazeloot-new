<template>
  <div>
    <Sheet :open="isOpen" @update:open="isOpen = $event">
      <SheetTrigger as-child>
        <Button
          :class="[
            theme.textPrimary,
            theme.bgButtonHover,
            'light:hover:text-gray-900 dark:hover:text-gray-100',
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
      </SheetTrigger>
      <SheetContent
        side="right"
        :class="[
          'w-full sm:w-[480px] p-0 rounded-l-xl shadow-2xl',
          'border-0 bg-white dark:bg-gray-900',
          'overflow-hidden flex flex-col',
        ]"
      >
        <!-- Header -->
        <div class="sticky top-0 z-20 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <!-- Title and Actions Row -->
          <div class="px-4 sm:px-6 pt-4 sm:pt-5 pb-3">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110">
                  <Bell class="h-4 w-4 sm:h-5 sm:w-5 text-white transition-transform duration-300" :class="{ 'animate-pulse-subtle': unreadCount > 0 }" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-base sm:text-lg font-bold tracking-tight" :class="theme.textPrimary">
                    Notification Center
                  </h3>
                  <p v-if="unreadCount > 0" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ unreadCount }} unread
                  </p>
                </div>
              </div>

              <div class="flex flex-col items-end gap-2 shrink-0 self-start sm:self-auto">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  class="h-7 w-7 rounded-md"
                  aria-label="Close notification panel"
                  @click="isOpen = false"
                >
                  <X class="h-4 w-4" />
                </Button>
                <button
                  v-if="hasUnreadNotifications"
                  class="px-3 py-1.5 text-xs font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-lg transition-all duration-200 shrink-0 hover:scale-105 active:scale-95"
                  @click.stop="handleMarkAllAsRead"
                >
                  Mark all as read
                </button>
              </div>
            </div>

            <!-- Priority Filters -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
              <button
                v-for="priority in priorityFilters"
                :key="priority"
                :class="[
                  'px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap shrink-0',
                  'border border-transparent',
                  selectedPriority === priority
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-sm scale-105'
                    : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 hover:scale-105 active:scale-95',
                ]"
                @click="selectedPriority = priority"
              >
                {{ priority }}
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-hidden flex flex-col min-h-0">
          <Transition :name="'slide-panel-' + transitionDirection" mode="out-in">
            <!-- Detail view -->
            <div
              v-if="viewMode === 'detail' && selectedNotification"
              key="detail"
              class="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              <div class="shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
                <button
                  type="button"
                  class="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Back to notifications"
                  @click="transitionDirection = 'back'; viewMode = 'list'; selectedNotification = null"
                >
                  <ArrowLeft class="h-4 w-4 shrink-0" />
                  Back
                </button>
              </div>
              <div class="flex-1 overflow-y-auto overscroll-contain p-4 sm:px-6 pb-6">
                <div class="flex items-start gap-3 mb-4">
                  <div
                    :class="[
                      'relative h-12 w-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center',
                      !getNotificationCoverPhoto(selectedNotification) && getNotificationIconBg(selectedNotification),
                    ]"
                  >
                    <template v-if="getNotificationCoverPhoto(selectedNotification)">
                      <img
                        v-if="isImage(getNotificationCoverPhoto(selectedNotification))"
                        :src="getNotificationCoverPhoto(selectedNotification)"
                        :alt="selectedNotification.title"
                        class="h-full w-full object-cover"
                      />
                      <video
                        v-else-if="isVideo(getNotificationCoverPhoto(selectedNotification))"
                        :src="getNotificationCoverPhoto(selectedNotification)"
                        class="h-full w-full object-cover"
                        muted
                      />
                    </template>
                    <component
                      v-else
                      :is="getNotificationIcon(selectedNotification)"
                      :class="['h-6 w-6', getNotificationIconColor(selectedNotification)]"
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">
                      {{ selectedNotification.title }}
                    </h2>
                    <div class="flex flex-wrap items-center gap-2 text-xs" :class="theme.textSecondary">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded font-semibold uppercase tracking-wide',
                          getPriorityBadgeClass(selectedNotification),
                        ]"
                      >
                        {{ getPriority(selectedNotification) }}
                      </span>
                      <span>{{ formatRelativeTime(selectedNotification.createdAt) }}</span>
                      <span v-if="selectedNotification.readAt" class="flex items-center gap-1">
                        <Eye class="h-3.5 w-3.5" />
                        Viewed
                      </span>
                      <span v-else class="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-medium">
                        <Sparkles class="h-3.5 w-3.5" />
                        New
                      </span>
                    </div>
                  </div>
                </div>
                <p
                  class="text-sm leading-relaxed mb-4"
                  :class="theme.textSecondary"
                >
                  {{ selectedNotification.description || selectedNotification.message || 'No description.' }}
                </p>
                <template v-if="notificationDetailText">
                  <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Full details
                  </h3>
                  <div
                    class="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4 min-h-[120px] max-h-[40vh] overflow-y-auto overscroll-contain"
                  >
                    <p
                      class="text-[15px] leading-[1.65] text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words"
                    >
                      {{ notificationDetailText }}
                    </p>
                  </div>
                </template>
                <div
                  v-if="selectedNotification.actionUrl || selectedNotification.action_url"
                  class="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800"
                >
                  <Button
                    variant="default"
                    class="w-full rounded-lg font-medium"
                    @click="handleActionClick(selectedNotification)"
                  >
                    {{ getActionLabel(selectedNotification) }}
                  </Button>
                </div>
              </div>
            </div>

            <!-- List view -->
            <div v-else key="list" class="flex-1 overflow-y-auto overscroll-contain">
          <!-- Loading State -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <div v-if="isLoading">
              <div
                v-for="i in 5"
                :key="i"
                class="border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4"
                :style="{ animationDelay: `${i * 100}ms` }"
              >
                <div class="flex items-start gap-3 animate-pulse">
                  <!-- Icon Skeleton -->
                  <div class="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0 mt-0.5 animate-shimmer" />
                  
                  <!-- Content Skeleton -->
                  <div class="flex-1 min-w-0">
                    <!-- Title and Badge Row -->
                    <div class="flex items-start justify-between gap-3 mb-1.5">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-shimmer" />
                      <div class="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded shrink-0 animate-shimmer" />
                    </div>
                    
                    <!-- Description Skeleton -->
                    <div class="space-y-1.5 mb-3">
                      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-shimmer" />
                      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-shimmer" />
                    </div>
                    
                    <!-- Meta Info Row Skeleton -->
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-3">
                        <div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                        <div class="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                      </div>
                      <div class="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded shrink-0 animate-shimmer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="filteredByPriority.length === 0"
              class="flex flex-col items-center justify-center p-8 sm:p-12 text-center"
            >
              <div
                :class="[
                  'h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center mb-4',
                  'bg-gray-100 dark:bg-gray-800/50',
                  'transition-all duration-300 animate-pulse-subtle',
                ]"
              >
                <Bell class="h-7 w-7 sm:h-8 sm:w-8 opacity-40 transition-transform duration-300 hover:scale-110" :class="theme.textTertiary" />
              </div>
              <h4 class="text-sm font-semibold mb-1.5" :class="theme.textPrimary">
                All caught up!
              </h4>
              <p class="text-xs leading-relaxed max-w-[200px] px-4" :class="theme.textSecondary">
                You don't have any notifications right now.
              </p>
            </div>

            <!-- Notifications List -->
            <div v-else>
              <TransitionGroup
                name="notification"
                tag="div"
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 translate-x-4 scale-95"
                enter-to-class="opacity-100 translate-x-0 scale-100"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-x-0 scale-100"
                leave-to-class="opacity-0 -translate-x-4 scale-95"
              >
                <div
                  v-for="notification in filteredByPriority"
                  :key="notification.id || notification.uuid"
                  :class="[
                    'group relative border-b border-gray-200 dark:border-gray-800',
                    'px-4 sm:px-6 py-3 sm:py-4 cursor-pointer transition-all duration-200',
                    'hover:bg-gray-50/50 dark:hover:bg-gray-800/30 hover:shadow-sm',
                    'active:scale-[0.98]',
                    (selectedNotification?.id || selectedNotification?.uuid) === (notification.id || notification.uuid) && 'bg-gray-50 dark:bg-gray-800/50',
                  ]"
                  @click="selectNotification(notification)"
                >
                  <div class="flex items-start gap-3">
                    <!-- Cover Photo or Icon -->
                    <div
                      :class="[
                        'relative h-10 w-10 rounded-lg overflow-hidden shrink-0 mt-0.5 transition-all duration-300',
                        'group-hover:scale-110 group-hover:shadow-md',
                        getNotificationCoverPhoto(notification) ? '' : 'flex items-center justify-center',
                        !getNotificationCoverPhoto(notification) && getNotificationIconBg(notification),
                      ]"
                    >
                      <template v-if="getNotificationCoverPhoto(notification)">
                        <img
                          v-if="isImage(getNotificationCoverPhoto(notification))"
                          :src="getNotificationCoverPhoto(notification)"
                          :alt="notification.title"
                          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <video
                          v-else-if="isVideo(getNotificationCoverPhoto(notification))"
                          :src="getNotificationCoverPhoto(notification)"
                          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          muted
                        />
                      </template>
                      <component
                        v-else
                        :is="getNotificationIcon(notification)"
                        :class="['h-5 w-5 transition-transform duration-300 group-hover:scale-110', getNotificationIconColor(notification)]"
                      />
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <!-- Title and Priority Badge -->
                      <div class="flex items-start justify-between gap-3 mb-1.5">
                        <h4
                          :class="[
                            'text-sm font-semibold leading-snug pr-2',
                            theme.textPrimary,
                          ]"
                        >
                          {{ notification.title }}
                        </h4>
                        <span
                          :class="[
                            'text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide shrink-0',
                            'transition-all duration-200 group-hover:scale-105',
                            getPriorityBadgeClass(notification),
                          ]"
                        >
                          {{ getPriority(notification) }}
                        </span>
                      </div>

                      <!-- Description -->
                      <p
                        :class="[
                          'text-sm leading-relaxed mb-3 text-gray-600 dark:text-gray-400',
                        ]"
                      >
                        {{ notification.description || notification.message }}
                      </p>

                      <!-- Meta Info Row -->
                      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <span class="text-xs text-gray-500 dark:text-gray-500">
                            {{ formatRelativeTime(notification.createdAt) }}
                          </span>
                          
                          <!-- Action Links -->
                          <template v-if="notification.actionUrl || notification.action_url">
                            <button 
                              class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 relative group/link hover:scale-105 active:scale-95" 
                              @click.stop="handleActionClick(notification)"
                            >
                              <span class="relative">
                                {{ getActionLabel(notification) }}
                                <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover/link:w-full"></span>
                              </span>
                            </button>
                          </template>
                        </div>
                        
                        <!-- Status Indicator -->
                        <div class="flex items-center gap-1.5 shrink-0">
                          <span
                            v-if="notification.readAt"
                            class="text-xs flex items-center gap-1.5 text-gray-500 dark:text-gray-500"
                          >
                            <Eye class="h-3.5 w-3.5" />
                            Viewed
                          </span>
                          <span
                            v-else
                            class="text-xs flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium animate-pulse-subtle"
                          >
                            <Sparkles class="h-3.5 w-3.5 animate-sparkle" />
                            New
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </Transition>
            </div>
          </Transition>
        </div>
      </SheetContent>
    </Sheet>
  </div>
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
  Images,
  Folder,
  Settings,
  Link as LinkIcon,
  Sparkles,
  Download,
  Star,
  X,
  Trash2,
  Eye,
  MessageSquare,
  Upload,
  Share2,
  Mail,
  CheckSquare,
  Copy,
  ArrowLeft,
} from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/shadcn/sheet'
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
const selectedPriority = ref('All')
const selectedNotification = ref(null)
const viewMode = ref('list')
const transitionDirection = ref('forward')

const priorityFilters = ['All', 'High', 'Medium', 'Low']

const notificationDetailText = computed(() => {
  const n = selectedNotification.value
  if (!n) return ''
  const detail = n.detail ?? n.metadata?.detail ?? ''
  return typeof detail === 'string' ? detail.trim() : ''
})

const getNotificationCoverPhoto = (notification) => {
  const metadata = notification.metadata || {}
  return metadata.coverPhoto || metadata.cover_photo || metadata.image || metadata.video || null
}

const isImage = (url) => {
  if (!url) return false
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  return imageExtensions.some(ext => url.toLowerCase().includes(ext)) || url.includes('image')
}

const isVideo = (url) => {
  if (!url) return false
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
  return videoExtensions.some(ext => url.toLowerCase().includes(ext)) || url.includes('video')
}

const filteredNotifications = computed(() => {
  const allNotifications = props.product
    ? notificationsStore.memoraNotifications
    : notificationsStore.allNotifications
  return allNotifications || []
})

const filteredByPriority = computed(() => {
  if (selectedPriority.value === 'All') {
    return filteredNotifications.value
  }
  return filteredNotifications.value.filter(n => getPriority(n) === selectedPriority.value.toUpperCase())
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

const getPriority = (notification) => {
  // Backend determines priority, frontend just displays it
  return notification.priority || notification.metadata?.priority || 'LOW'
}

const getNotificationIcon = (notification) => {
  const type = notification.type || ''
  const priority = getPriority(notification)
  
  // HIGH priority: Errors, warnings, rejections
  if (priority === 'HIGH') {
    // Rejections and failures get XCircle
    if (
      type?.includes('rejected') ||
      type?.includes('failed') ||
      type?.includes('deleted')
    ) {
      return XCircle
    }
    // Warnings and requests get AlertCircle
    return AlertCircle
  }
  
  // Specific icon mappings for Mazeloot types by phase/action
  const iconMap = {
    // Raw Files
    raw_file_created: Folder,
    raw_file_updated: Folder,
    raw_file_completed: CheckCircle,
    raw_file_republished: CheckCircle,
    raw_file_deleted: XCircle,
    
    // Collections Phase
    collection_created: Folder,
    collection_published: CheckCircle,
    collection_shared: Share2,
    collection_download: Download,
    collection_email_registration: Mail,
    collection_favorite: Star,
    collection_view: Eye,
    collection_updated: Folder,
    collection_deleted: XCircle,
    
    // Selections Phase
    selection_created: CheckSquare,
    selection_duplicated: Copy,
    selection_published: CheckCircle,
    selection_completed: CheckCircle,
    selection_access: Eye,
    selection_limit_reached: AlertCircle,
    selection_deleted: XCircle,
    
    // Proofing Phase
    proofing_published: CheckCircle,
    proofing_completed: CheckCircle,
    proofing_comment: MessageSquare,
    proofing_revision_uploaded: Upload,
    proofing_approval_requested: AlertCircle,
    proofing_approval_approved: CheckCircle,
    proofing_approval_rejected: XCircle,
    proofing_closure_requested: AlertCircle,
    proofing_closure_approved: CheckCircle,
    proofing_closure_rejected: XCircle,
    
    // Media Actions
    media_uploaded: Upload,
    media_bulk_uploaded: Upload,
    media_feedback: MessageSquare,
    
    // Projects
    project_created: Folder,
    project_updated: Folder,
    
    // Watermarks & Presets
    watermark_created: Sparkles,
    watermark_updated: Sparkles,
    watermark_deleted: XCircle,
    preset_created: Folder,
    preset_updated: Folder,
    preset_deleted: XCircle,
    
    // Settings
    settings_branding_updated: Settings,
    settings_preference_updated: Settings,
    settings_email_updated: Mail,
    settings_updated: Settings,
    
    // Social Links
    social_link_created: LinkIcon,
    social_link_updated: LinkIcon,
    social_link_deleted: XCircle,
    social_links_reordered: LinkIcon,
    
    // Downloads
    download_ready: Download,
    
    // Summaries
    weekly_summary: Info,
    monthly_summary: Info,
    
    default: Info,
  }
  
  // Check icon map first
  if (iconMap[type]) {
    return iconMap[type]
  }
  
  // Fallback: Success states get CheckCircle
  if (
    type?.includes('completed') ||
    type?.includes('approved') ||
    type?.includes('published') ||
    type?.includes('ready')
  ) {
    return CheckCircle
  }
  
  return iconMap.default
}

const getNotificationIconBg = (notification) => {
  const priority = getPriority(notification)
  if (priority === 'HIGH') {
    return 'bg-red-50 dark:bg-red-950/20'
  }
  if (priority === 'MEDIUM') {
    return 'bg-orange-50 dark:bg-orange-950/20'
  }
  return 'bg-green-50 dark:bg-green-950/20'
}

const getNotificationIconColor = (notification) => {
  const priority = getPriority(notification)
  if (priority === 'HIGH') {
    return 'text-red-600 dark:text-red-400'
  }
  if (priority === 'MEDIUM') {
    return 'text-orange-600 dark:text-orange-400'
  }
  return 'text-green-600 dark:text-green-400'
}

const getPriorityBadgeClass = (notification) => {
  const priority = getPriority(notification)
  if (priority === 'HIGH') {
    return 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300'
  }
  if (priority === 'MEDIUM') {
    return 'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300'
  }
  return 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300'
}

const getActionLabel = (notification) => {
  const type = notification.type || ''
  const metadata = notification.metadata || {}
  
  // Check metadata for custom action label
  if (metadata.actionLabel) {
    return metadata.actionLabel
  }
  
  // Derive from type
  if (type?.includes('collection')) {
    if (type?.includes('shared')) return 'View Collection'
    if (type?.includes('download')) return 'View Collection'
    return 'View Collection'
  }
  
  if (type?.includes('selection')) {
    return 'View Selection'
  }
  
  if (type?.includes('proofing')) {
    if (type?.includes('approval')) {
      if (type?.includes('requested')) return 'Review Approval'
      return 'View Approval'
    }
    if (type?.includes('closure')) {
      if (type?.includes('requested')) return 'Review Closure'
      return 'View Closure'
    }
    if (type?.includes('comment')) return 'View Comments'
    if (type?.includes('revision')) return 'View Revision'
    return 'View Proofing'
  }
  
  if (type?.includes('media')) {
    return 'View Media'
  }
  
  if (type?.includes('project')) {
    return 'View Project'
  }
  
  return 'View Details'
}

const selectNotification = (notification) => {
  transitionDirection.value = 'forward'
  selectedNotification.value = notification
  viewMode.value = 'detail'
  if (!notification.readAt) {
    handleMarkAsRead(notification)
  }
  emit('notification-click', notification)
}

const handleActionClick = async (notification) => {
  const actionUrl = notification.actionUrl || notification.action_url
  if (actionUrl) {
    router.push(actionUrl)
    isOpen.value = false
  }
}

const handleMarkAsRead = async notification => {
  try {
    const notificationId = notification.id || notification.uuid
    await notificationsStore.markAsRead(notificationId)
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

// Watch for sheet open/close to refresh notifications
watch(isOpen, async newValue => {
  if (newValue && !isLoading.value) {
    await notificationsStore.fetchNotifications(props.product)
    await notificationsStore.fetchUnreadCounts()
  } else {
    selectedNotification.value = null
    viewMode.value = 'list'
    transitionDirection.value = 'forward'
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

@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  25% {
    opacity: 0.8;
    transform: scale(1.1) rotate(-5deg);
  }
  75% {
    opacity: 0.8;
    transform: scale(1.1) rotate(5deg);
  }
}

.animate-sparkle {
  animation: sparkle 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgb(229 231 235 / 0.4) 0%,
    rgb(229 231 235 / 0.8) 50%,
    rgb(229 231 235 / 0.4) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

.dark .animate-shimmer {
  background: linear-gradient(
    90deg,
    rgb(55 65 81 / 0.4) 0%,
    rgb(55 65 81 / 0.8) 50%,
    rgb(55 65 81 / 0.4) 100%
  );
  background-size: 1000px 100%;
}

.border-l-3 {
  border-left-width: 3px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.slide-panel-forward-enter-active,
.slide-panel-forward-leave-active,
.slide-panel-back-enter-active,
.slide-panel-back-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.slide-panel-forward-enter-from {
  transform: translateX(100%);
}
.slide-panel-forward-leave-to {
  transform: translateX(-100%);
}
.slide-panel-back-enter-from {
  transform: translateX(-100%);
}
.slide-panel-back-leave-to {
  transform: translateX(100%);
}
</style>
