<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Email Notifications </template>

    <div class="space-y-8 w-1/2">
      <!-- Page Header -->
      <div>
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">
          Email Notifications
        </h1>
        <p class="text-sm mb-6" :class="theme.textSecondary">
          Choose which email notifications you want to receive.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <Loader2 class="h-8 w-8 animate-spin" :class="theme.textTertiary" />
      </div>

      <!-- Content -->
      <div v-else>
        <div v-if="notifications.length === 0" class="rounded-xl border p-12 text-center" :class="[theme.bgCard, theme.borderCard]">
          <p class="text-sm" :class="theme.textSecondary">
            No notification types available. Contact support to enable notifications.
          </p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="notification in notifications"
            :key="notification.type"
            class="rounded-xl border p-6 transition-all hover:shadow-md"
            :class="[theme.bgCard, theme.borderCard]"
          >
            <div class="flex items-center justify-between gap-6">
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold mb-1.5" :class="theme.textPrimary">
                  {{ formatNotificationName(notification.type) }}
                </h3>
                <p class="text-sm leading-relaxed" :class="theme.textSecondary">
                  {{ getNotificationDescription(notification.type) }}
                </p>
              </div>
              <div class="flex items-center gap-3 flex-shrink-0">
                <label
                  class="relative inline-flex items-center group"
                  :class="isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
                >
                  <input
                    type="checkbox"
                    :checked="notification.enabled"
                    :disabled="isSaving"
                    @change="handleToggle(notification.type, $event.target.checked)"
                    class="sr-only peer"
                  />
                  <div
                    class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
                  ></div>
                  <span
                    class="ml-3 text-sm font-medium min-w-[40px]"
                    :class="notification.enabled ? theme.textPrimary : theme.textSecondary"
                  >
                    {{ notification.enabled ? 'On' : 'Off' }}
                  </span>
                </label>
                <Loader2
                  v-if="isSaving"
                  class="h-4 w-4 animate-spin text-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div :class="theme.borderSecondary" class="mt-8 pt-6 border-t">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 text-sm">
              <Check class="h-4 w-4 text-teal-500" />
              <span :class="theme.textSecondary">All changes saved automatically</span>
            </div>
            <Button
              disabled
              class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check class="mr-2 h-4 w-4" />
              Saved
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader2, Check } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Separator } from '@/components/shadcn/separator'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useEmailNotificationsApi } from '@/api/emailNotifications'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()
const { fetchEmailNotifications, updateEmailNotifications, getNotificationTypes } =
  useEmailNotificationsApi()

const notifications = ref([])
const isLoading = ref(false)
const isSaving = ref(false)

const formatNotificationName = type => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const getNotificationDescription = type => {
  const descriptions = {
    // Collection Phase
    collection_published: 'Receive an email when a collection is published',
    collection_shared: 'Receive an email when a collection is shared',
    collection_download: 'Receive an email when clients download from collections',
    collection_email_registration: 'Receive an email when clients register their email to access collections',
    collection_favorite: 'Receive an email when clients favorite photos in collections',
    collection_view: 'Receive an email when collections are viewed',
    // Selection Phase
    selection_published: 'Receive an email when a selection is published',
    selection_completed: 'Receive an email when a selection is completed',
    selection_access: 'Receive an email when clients access selections',
    selection_limit_reached: 'Receive an email when selection limit is reached',
    // Proofing Phase
    proofing_published: 'Receive an email when proofing is published',
    proofing_completed: 'Receive an email when proofing is completed',
    proofing_comment: 'Receive an email when comments are added to proofing',
    proofing_revision_uploaded: 'Receive an email when new revisions are uploaded',
    proofing_approval_requested: 'Receive an email when approval requests are submitted',
    proofing_approval_approved: 'Receive an email when approval requests are approved',
    proofing_approval_rejected: 'Receive an email when approval requests are rejected',
    proofing_closure_requested: 'Receive an email when closure requests are submitted',
    proofing_closure_approved: 'Receive an email when closure requests are approved',
    proofing_closure_rejected: 'Receive an email when closure requests are rejected',
    // Project
    project_created: 'Receive an email when a new project is created',
    project_updated: 'Receive an email when a project is updated',
    // Media & Feedback
    media_feedback: 'Receive an email when clients provide feedback on media',
    media_uploaded: 'Receive an email when media is uploaded',
    // General
    weekly_summary: 'Receive a weekly summary of your activity',
    monthly_summary: 'Receive a monthly summary of your activity',
    // Legacy/Deprecated (for backward compatibility)
    client_feedback: 'Receive an email when clients provide feedback',
    approval_request: 'Receive an email when approval requests are submitted',
  }
  return descriptions[type] || 'Email notification preference'
}

onMounted(async () => {
  isLoading.value = true
  try {
    const [notificationsData, types] = await Promise.all([
      fetchEmailNotifications(),
      getNotificationTypes().catch(() => []),
    ])

    const notificationsMap = notificationsData.data || notificationsData || {}
    const availableTypes = types.data || types || []

    // Merge available types with user preferences
    notifications.value = availableTypes.map(type => ({
      type,
      enabled: notificationsMap[type] ?? false,
    }))

    // If no types from admin, use the notifications map keys
    if (notifications.value.length === 0) {
      notifications.value = Object.entries(notificationsMap).map(([type, enabled]) => ({
        type,
        enabled,
      }))
    }
  } catch (error) {
    toast.error('Failed to load notifications', {
      description: error.message || 'Please try again',
    })
  } finally {
    isLoading.value = false
  }
})

const handleToggle = async (type, enabled) => {
  isSaving.value = true
  try {
    const currentNotifications = notifications.value.reduce((acc, n) => {
      acc[n.type] = n.enabled
      return acc
    }, {})

    currentNotifications[type] = enabled

    const updated = await updateEmailNotifications(currentNotifications)
    const updatedMap = updated.data || updated || {}

    // Update local state
    notifications.value = notifications.value.map(n => ({
      ...n,
      enabled: updatedMap[n.type] ?? n.enabled,
    }))

    toast.success('Notification preference updated')
  } catch (error) {
    toast.error('Failed to update notification', {
      description: error.message || 'Please try again',
    })
    // Revert toggle
    const notification = notifications.value.find(n => n.type === type)
    if (notification) {
      notification.enabled = !enabled
    }
  } finally {
    isSaving.value = false
  }
}
</script>

