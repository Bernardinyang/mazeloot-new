<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Email Notifications </template>

    <div class="space-y-8 max-w-3xl">
      <!-- Page Header -->
      <div>
        <h1 :class="theme.textPrimary" class="text-4xl font-bold tracking-tight mb-2">
          Email Notifications
        </h1>
        <p :class="theme.textSecondary" class="text-sm mb-6">
          Choose which events trigger email notifications. All events are on by default.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <Loader2 :class="theme.textTertiary" class="h-8 w-8 animate-spin" />
      </div>

      <!-- Content -->
      <div v-else>
        <div
          v-if="events.length === 0"
          :class="[theme.bgCard, theme.borderCard]"
          class="rounded-xl border p-12 text-center"
        >
          <p :class="theme.textSecondary" class="text-sm">
            No notification events available.
          </p>
        </div>

        <div v-else class="space-y-8">
          <div v-for="group in groupedEvents" :key="group.group" class="space-y-3">
            <h2 :class="theme.textPrimary" class="text-lg font-semibold border-b pb-2">
              {{ group.groupLabel }}
            </h2>
            <div class="space-y-3">
              <div
                v-for="event in group.events"
                :key="event.type"
                :class="[theme.bgCard, theme.borderCard]"
                class="rounded-xl border p-5 transition-all hover:shadow-md"
              >
                <div class="flex items-center justify-between gap-6">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <h3 :class="theme.textPrimary" class="text-base font-semibold">
                        {{ event.label }}
                      </h3>
                      <span
                        v-if="event.critical"
                        class="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      >
                        Critical
                      </span>
                    </div>
                    <p :class="theme.textSecondary" class="text-sm leading-relaxed mt-1">
                      {{ event.description }}
                    </p>
                  </div>
                  <div class="flex items-center gap-3 flex-shrink-0">
                    <label
                      :class="isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
                      class="relative inline-flex items-center group"
                    >
                      <input
                        :checked="event.enabled"
                        :disabled="isSaving"
                        class="sr-only peer"
                        type="checkbox"
                        @change="handleToggle(event.type, $event.target.checked)"
                      />
                      <div
                        class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:shadow-md peer-checked:bg-accent bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
                      />
                      <span
                        :class="event.enabled ? theme.textPrimary : theme.textSecondary"
                        class="ml-3 text-sm font-medium min-w-[40px]"
                      >
                        {{ event.enabled ? 'On' : 'Off' }}
                      </span>
                    </label>
                    <Loader2 v-if="isSaving" class="h-4 w-4 animate-spin text-violet-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div :class="theme.borderSecondary" class="mt-8 pt-6 border-t">
          <div class="flex items-center gap-2 text-sm">
            <Check class="h-4 w-4 text-violet-500 shrink-0" />
            <span :class="theme.textSecondary">Changes saved automatically</span>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Check, Loader2 } from '@/shared/utils/lucideAnimated'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Separator } from '@/shared/components/shadcn/separator'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useEmailNotificationsApi } from '@/domains/memora/api/emailNotifications'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const { fetchEvents, updateEmailNotifications } = useEmailNotificationsApi()
const { hasFeature } = useMemoraFeatures()

const events = ref([])
const isLoading = ref(false)
const isSaving = ref(false)

const groupVisible = (group) => {
  if (group === 'collection') return hasFeature('collection')
  if (group === 'selection') return hasFeature('selection')
  if (group === 'proofing') return hasFeature('proofing')
  if (group === 'project') return hasFeature('selection') || hasFeature('collection')
  return true
}

const groupedEvents = computed(() => {
  const groups = {}
  for (const event of events.value) {
    const key = event.group
    if (!groups[key]) {
      groups[key] = { group: key, groupLabel: event.groupLabel || event.group, events: [] }
    }
    groups[key].events.push(event)
  }
  const order = ['collection', 'selection', 'proofing', 'project', 'media', 'payment', 'general']
  return order.filter(g => groups[g] && groupVisible(g)).map(g => groups[g])
})

onMounted(async () => {
  isLoading.value = true
  try {
    const res = await fetchEvents()
    events.value = res.data || res || []
  } catch (error) {
    toast.apiError(error, 'Failed to load notifications. Please try again.')
  } finally {
    isLoading.value = false
  }
})

const handleToggle = async (type, enabled) => {
  isSaving.value = true
  try {
    const current = events.value.reduce((acc, e) => {
      acc[e.type] = e.enabled
      return acc
    }, {})
    current[type] = enabled

    const updated = await updateEmailNotifications(current)
    const updatedMap = updated.data || updated || {}

    events.value = events.value.map(e => ({
      ...e,
      enabled: updatedMap[e.type] ?? e.enabled,
    }))

    toast.success('Preference updated')
  } catch (error) {
    toast.apiError(error, 'Failed to update. Please try again.')
    const event = events.value.find(e => e.type === type)
    if (event) event.enabled = !enabled
  } finally {
    isSaving.value = false
  }
}
</script>
