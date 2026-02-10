<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Email Notifications </template>
    <template #header>
      <Button variant="ghost" size="sm" class="rounded-lg gap-1" @click="goBack">
        <ChevronLeft class="h-4 w-4" />
        Back
      </Button>
    </template>

    <div class="space-y-8 max-w-3xl">
      <!-- Page Header -->
      <div>
        <h1 :class="theme.textPrimary" class="text-4xl font-bold tracking-tight mb-2">
          Notifications
        </h1>
        <p :class="theme.textSecondary" class="text-sm mb-6">
          Choose how you want to receive notifications. You can enable one or more channels; when multiple are on, each notification is sent to all selected channels.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Delivery channels -->
      <div :class="[theme.bgCard, theme.borderCard]" class="rounded-xl border p-4 sm:p-6 space-y-5">
        <div class="space-y-1">
          <div class="flex items-center gap-2.5">
            <div class="p-1.5 rounded-lg" :class="theme.bgButtonHover">
              <Bell class="h-4 w-4" :class="theme.textPrimary" />
            </div>
            <h2 :class="theme.textPrimary" class="text-lg font-semibold">Delivery channels</h2>
          </div>
          <p :class="theme.textSecondary" class="text-sm ml-8">
            Where should we send your notifications?
          </p>
        </div>
        
        <div class="space-y-3">
          <!-- Email Channel -->
          <label
            class="group flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm"
            :class="[
              channels.notify_email 
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50' 
                : theme.borderSecondary + ' hover:border-gray-300 dark:hover:border-gray-700',
              channelsSaving ? 'opacity-60 pointer-events-none' : ''
            ]"
          >
            <div class="relative flex-shrink-0 mt-0.5">
              <input
                v-model="channels.notify_email"
                type="checkbox"
                class="sr-only peer"
                @change="saveChannels"
              />
              <div class="w-5 h-5 rounded border-2 transition-all duration-200 peer-checked:bg-blue-600 peer-checked:border-blue-600 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <Check v-if="channels.notify_email" class="h-3 w-3 text-white" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2.5 mb-1">
                <div class="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30">
                  <Mail class="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span :class="theme.textPrimary" class="text-sm font-medium">Email</span>
                <span v-if="channels.notify_email" class="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  Active
                </span>
              </div>
              <span :class="theme.textSecondary" class="text-xs leading-relaxed block">All notifications also sent to your account email</span>
            </div>
          </label>

          <!-- In-app Channel -->
          <label
            class="group flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm"
            :class="[
              channels.notify_in_app 
                ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50' 
                : theme.borderSecondary + ' hover:border-gray-300 dark:hover:border-gray-700',
              channelsSaving ? 'opacity-60 pointer-events-none' : ''
            ]"
          >
            <div class="relative flex-shrink-0 mt-0.5">
              <input
                v-model="channels.notify_in_app"
                type="checkbox"
                class="sr-only peer"
                @change="saveChannels"
              />
              <div class="w-5 h-5 rounded border-2 transition-all duration-200 peer-checked:bg-purple-600 peer-checked:border-purple-600 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <Check v-if="channels.notify_in_app" class="h-3 w-3 text-white" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2.5 mb-1">
                <div class="p-1.5 rounded bg-purple-100 dark:bg-purple-900/30">
                  <Bell class="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                </div>
                <span :class="theme.textPrimary" class="text-sm font-medium">In-app</span>
                <span v-if="channels.notify_in_app" class="px-1.5 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  Active
                </span>
              </div>
              <span :class="theme.textSecondary" class="text-xs leading-relaxed block">Show in notification center (bell icon)</span>
            </div>
          </label>

          <!-- WhatsApp Channel -->
          <div class="space-y-3">
            <label
              class="group flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm"
              :class="[
                channels.notify_whatsapp 
                  ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50' 
                  : theme.borderSecondary + ' hover:border-gray-300 dark:hover:border-gray-700',
                channelsSaving ? 'opacity-60 pointer-events-none' : ''
              ]"
            >
              <div class="relative flex-shrink-0 mt-0.5">
                <input
                  v-model="channels.notify_whatsapp"
                  type="checkbox"
                  class="sr-only peer"
                  @change="onWhatsAppToggle"
                />
                <div class="w-5 h-5 rounded border-2 transition-all duration-200 peer-checked:bg-green-600 peer-checked:border-green-600 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <Check v-if="channels.notify_whatsapp" class="h-3 w-3 text-white" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2.5 mb-1">
                  <div class="p-1.5 rounded bg-green-100 dark:bg-green-900/30">
                    <MessageSquare class="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span :class="theme.textPrimary" class="text-sm font-medium">WhatsApp</span>
                  <span v-if="channels.notify_whatsapp" class="px-1.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    Active
                  </span>
                </div>
                <span :class="theme.textSecondary" class="text-xs leading-relaxed block">Send to your WhatsApp number</span>
              </div>
            </label>
            
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-if="channels.notify_whatsapp" class="ml-9 p-3 rounded-lg" :class="[theme.bgCard, theme.borderSecondary, 'border']">
                <label for="whatsapp-number" :class="theme.textSecondary" class="text-xs font-medium block mb-2">
                  WhatsApp number (with country code, e.g. +32 123 456 789)
                </label>
                <Input
                  id="whatsapp-number"
                  v-model="channels.whatsapp_number"
                  type="tel"
                  placeholder="+32 123 456 789"
                  autocomplete="tel"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput, 'max-w-xs']"
                  @blur="saveChannels"
                />
                <p v-if="whatsappError" class="text-xs text-red-500 dark:text-red-400 mt-2">{{ whatsappError }}</p>
              </div>
            </Transition>
          </div>
        </div>
        
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="channelsSaving" class="flex items-center gap-2 text-sm">
            <Loader2 class="h-4 w-4 animate-spin" :class="theme.textTertiary" />
            <span :class="theme.textSecondary">Saving…</span>
          </div>
        </Transition>
      </div>

      <!-- Per-event email toggles (legacy) -->
      <div>
        <h2 :class="theme.textPrimary" class="text-lg font-semibold mb-2">Email notification events</h2>
        <p :class="theme.textSecondary" class="text-sm mb-4">
          When Email is enabled above, choose which events trigger an email. All are on by default.
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
import { useRouter } from 'vue-router'
import { Check, Loader2, ChevronLeft, Mail, Bell, MessageSquare } from '@/shared/utils/lucideAnimated'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Separator } from '@/shared/components/shadcn/separator'
import { Button } from '@/shared/components/shadcn/button'
import Input from '@/shared/components/shadcn/input/Input.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useEmailNotificationsApi } from '@/domains/memora/api/emailNotifications'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'
import { toast } from '@/shared/utils/toast'

const router = useRouter()
function goBack() {
  router.back()
}
const theme = useThemeClasses()
const { fetchEvents, updateEmailNotifications, fetchChannels, updateChannels } = useEmailNotificationsApi()
const { hasFeature } = useMemoraFeatures()

const events = ref([])
const isLoading = ref(true)
const isSaving = ref(false)

const channels = ref({
  notify_email: true,
  notify_in_app: true,
  notify_whatsapp: false,
  whatsapp_number: null,
})
const channelsSaving = ref(false)
const whatsappError = ref('')

function validateWhatsAppNumber() {
  if (!channels.value.notify_whatsapp) {
    whatsappError.value = ''
    return true
  }
  const n = (channels.value.whatsapp_number || '').replace(/[\s\-\(\)]/g, '')
  if (n.length < 10) {
    whatsappError.value = 'Enter a valid number with country code (e.g. +32 123 456 789)'
    return false
  }
  whatsappError.value = ''
  return true
}

async function saveChannels() {
  if (!validateWhatsAppNumber()) return
  channelsSaving.value = true
  try {
    const payload = {
      notify_email: channels.value.notify_email,
      notify_in_app: channels.value.notify_in_app,
      notify_whatsapp: channels.value.notify_whatsapp,
      whatsapp_number: channels.value.notify_whatsapp ? (channels.value.whatsapp_number || null) : null,
    }
    const updated = await updateChannels(payload)
    if (updated?.data) Object.assign(channels.value, updated.data)
    else if (updated) Object.assign(channels.value, updated)
    toast.success('Delivery preferences saved')
  } catch (error) {
    toast.apiError(error, 'Failed to save. Please try again.')
  } finally {
    channelsSaving.value = false
  }
}

function onWhatsAppToggle() {
  if (!channels.value.notify_whatsapp) {
    channels.value.whatsapp_number = null
    whatsappError.value = ''
  }
  saveChannels()
}

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
    const [eventsRes, channelsRes] = await Promise.all([
      fetchEvents(),
      fetchChannels().catch(() => null),
    ])
    events.value = eventsRes?.data || eventsRes || []
    if (channelsRes?.data) Object.assign(channels.value, channelsRes.data)
    else if (channelsRes) Object.assign(channels.value, channelsRes)
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
