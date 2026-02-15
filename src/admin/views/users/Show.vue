<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0 bg-gradient-to-b from-background to-muted/20']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
      <!-- Header with gradient strip -->
      <header
        :class="[
          'relative overflow-hidden rounded-2xl sm:rounded-3xl',
          'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
          'dark:from-violet-700 dark:via-purple-700 dark:to-fuchsia-700',
          'shadow-xl',
        ]"
      >
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),transparent_50%)]" />
        <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6">
          <div class="flex items-center gap-4">
            <RouterLink
              :to="{ name: 'admin-users' }"
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
              aria-label="Back to users"
            >
              <ChevronLeft class="h-5 w-5" />
            </RouterLink>
            <div v-if="user" class="flex items-center gap-4">
              <div
                class="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white/25 backdrop-blur-sm text-2xl font-bold text-white shadow-lg ring-2 ring-white/30"
              >
                {{ userInitial }}
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {{ user.first_name }} {{ user.last_name }}
                </h1>
                <p class="text-sm text-white/90 mt-0.5">{{ user.email }}</p>
                <span
                  v-if="user.push_subscriptions?.length"
                  class="mt-1.5 inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  <Smartphone class="h-3 w-3" />
                  {{ user.push_subscriptions.length }} device{{ user.push_subscriptions.length !== 1 ? 's' : '' }}
                </span>
              </div>
            </div>
            <div v-else-if="!loading" class="text-white/90">User not found</div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            class="shrink-0 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
            @click="$router.push({ name: 'admin-users' })"
          >
            Back to list
          </Button>
        </div>
      </header>

      <!-- Loading skeleton -->
      <div v-if="loading" class="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div class="flex flex-col items-center gap-4 py-8">
          <span class="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
          <p :class="['text-sm', theme.textSecondary]">Loading user…</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div v-for="i in 6" :key="i" class="h-16 rounded-xl animate-pulse bg-muted/60" :style="{ animationDelay: `${i * 60}ms` }" />
        </div>
      </div>

      <template v-else-if="user">
        <!-- Profile card -->
        <section
          id="profile"
          :class="[
            'rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm',
            'bg-gradient-to-br from-card to-card/95',
          ]"
        >
          <h2 :class="['text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2', theme.textSecondary]">
            <User class="h-4 w-4" />
            Profile
          </h2>
          <dl class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div class="flex items-start gap-3 rounded-xl bg-muted/40 dark:bg-white/5 p-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-600 dark:text-violet-400">
                <Mail class="h-5 w-5" />
              </div>
              <div class="min-w-0">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]">Email</dt>
                <dd :class="['text-sm font-semibold mt-0.5 truncate', theme.textPrimary]">{{ user.email }}</dd>
              </div>
            </div>
            <div class="flex items-start gap-3 rounded-xl bg-muted/40 dark:bg-white/5 p-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <User class="h-5 w-5" />
              </div>
              <div class="min-w-0">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]">Name</dt>
                <dd :class="['text-sm font-semibold mt-0.5', theme.textPrimary]">{{ user.first_name }} {{ user.last_name }}</dd>
              </div>
            </div>
            <div class="flex items-start gap-3 rounded-xl bg-muted/40 dark:bg-white/5 p-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Shield class="h-5 w-5" />
              </div>
              <div class="min-w-0">
                <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]">Role</dt>
                <dd class="mt-0.5">
                  <Badge
                    :class="[
                      user.role === 'super_admin' && 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
                      user.role === 'admin' && 'bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30',
                      user.role !== 'admin' && user.role !== 'super_admin' && 'bg-muted text-muted-foreground',
                    ]"
                    variant="outline"
                  >
                    {{ user.role }}
                  </Badge>
                </dd>
              </div>
            </div>
          </dl>
        </section>

        <!-- Push subscriptions -->
        <section
          id="push-subscriptions"
          :class="[
            'rounded-2xl border overflow-hidden shadow-sm',
            'border-emerald-200/60 dark:border-emerald-500/20',
            'bg-gradient-to-br from-emerald-500/5 via-card to-card',
            'dark:from-emerald-500/10 dark:via-card dark:to-card',
          ]"
        >
          <div class="px-5 sm:px-6 py-4 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent dark:from-emerald-500/20 dark:via-teal-500/15 border-b border-emerald-200/40 dark:border-emerald-500/20">
            <h2 class="text-sm font-semibold flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <Smartphone class="h-4 w-4" />
              Device push subscriptions
            </h2>
            <p class="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
              {{ user.push_subscriptions?.length ? `${user.push_subscriptions.length} device(s) — resend from a notification below if needed.` : 'Web push devices registered for this user.' }}
            </p>
          </div>
          <div class="p-5 sm:p-6">
            <p v-if="!user.push_subscriptions?.length" :class="['text-sm py-2', theme.textSecondary]">No devices registered for web push.</p>
            <div v-else class="flex flex-wrap gap-2">
              <span
                v-for="sub in user.push_subscriptions"
                :key="sub.id"
                :title="sub.endpoint_hint"
                :class="[
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-mono max-w-full min-w-0',
                  'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 border border-emerald-500/20',
                ]"
              >
                <span class="size-2 rounded-full bg-emerald-500 shrink-0" />
                <span class="truncate">{{ sub.endpoint_hint }}</span>
              </span>
            </div>
          </div>
        </section>

        <!-- Recent notifications -->
        <section
          id="recent-notifications"
          :class="[
            'rounded-2xl border overflow-hidden shadow-sm',
            'border-violet-200/60 dark:border-violet-500/20',
            'bg-gradient-to-br from-violet-500/5 via-card to-card',
            'dark:from-violet-500/10 dark:via-card dark:to-card',
          ]"
        >
          <div class="px-5 sm:px-6 py-4 bg-gradient-to-r from-violet-500/15 via-purple-500/10 to-transparent dark:from-violet-500/20 dark:via-purple-500/15 border-b border-violet-200/40 dark:border-violet-500/20">
            <h2 class="text-sm font-semibold flex items-center gap-2 text-violet-800 dark:text-violet-200">
              <Bell class="h-4 w-4" />
              Recent notifications
            </h2>
            <p class="text-xs text-violet-700/80 dark:text-violet-300/80 mt-0.5">Resend web push to the user’s devices (superadmin only).</p>
          </div>
          <div class="p-5 sm:p-6">
            <div v-if="notificationsLoading" class="flex items-center justify-center gap-2 py-12">
              <Loader2 class="h-6 w-6 animate-spin text-violet-500" />
              <span :class="['text-sm', theme.textSecondary]">Loading…</span>
            </div>
            <p v-else-if="!notifications.length" :class="['text-sm py-6 text-center', theme.textSecondary]">
              Notifications will appear here when the user receives in-app alerts.
            </p>
            <ul v-else class="space-y-3">
              <li
                v-for="n in notifications"
                :key="n.id"
                :class="[
                  'flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl p-4 transition-colors',
                  'bg-violet-500/5 dark:bg-white/5 border border-violet-200/40 dark:border-violet-500/20',
                  'hover:bg-violet-500/10 dark:hover:bg-white/10',
                ]"
              >
                <div class="min-w-0 flex-1">
                  <p :class="['text-sm font-semibold truncate', theme.textPrimary]">{{ n.title }}</p>
                  <p :class="['text-xs truncate mt-0.5', theme.textSecondary]">{{ n.message }}</p>
                  <p :class="['text-xs mt-1.5 tabular-nums', theme.textTertiary]">{{ formatDate(n.createdAt) }}</p>
                </div>
                <Button
                  v-if="isSuperAdmin"
                  size="sm"
                  :class="[
                    'shrink-0 gap-1.5',
                    'bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white',
                  ]"
                  :disabled="resendingId === n.id"
                  :aria-busy="resendingId === n.id"
                  aria-label="Resend push notification"
                  @click="resendPush(n.id)"
                >
                  <Loader2 v-if="resendingId === n.id" class="h-4 w-4 animate-spin" />
                  <Send v-else class="h-4 w-4" />
                  {{ resendingId === n.id ? 'Sending…' : 'Resend push' }}
                </Button>
              </li>
            </ul>
          </div>
        </section>
      </template>

      <div v-else class="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center shadow-sm">
        <p :class="['text-sm', theme.textSecondary]">User not found.</p>
        <Button variant="outline" class="mt-4" @click="$router.push({ name: 'admin-users' })">
          Back to users
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import { ChevronLeft, User, Mail, Shield, Smartphone, Bell, Send, Loader2 } from 'lucide-vue-next'
import { useAdminApi } from '@/admin/api/admin'
import { useUserStore } from '@/shared/stores/user'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'
import { Badge } from '@/shared/components/shadcn/badge'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const route = useRoute()
const adminApi = useAdminApi()
const userStore = useUserStore()
const user = ref(null)
const loading = ref(true)
const notifications = ref([])
const notificationsLoading = ref(false)
const resendingId = ref(null)

const isSuperAdmin = userStore.isSuperAdmin

const userInitial = computed(() => {
  const u = user.value
  if (!u) return '?'
  if (u.first_name?.charAt(0) || u.last_name?.charAt(0)) {
    return ((u.first_name?.charAt(0) || '') + (u.last_name?.charAt(0) || '')).toUpperCase().slice(0, 2)
  }
  return (u.email?.charAt(0) || '?').toUpperCase()
})

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

async function loadNotifications() {
  if (!user.value?.uuid) return
  notificationsLoading.value = true
  try {
    const res = await adminApi.getUserNotifications(user.value.uuid, { limit: 20 })
    notifications.value = Array.isArray(res) ? res : (res?.data ?? [])
  } catch (e) {
    console.error('Failed to load notifications', e)
    notifications.value = []
  } finally {
    notificationsLoading.value = false
  }
}

async function resendPush(notificationId) {
  resendingId.value = notificationId
  try {
    await adminApi.resendNotificationPush(notificationId)
    toast.success('Push re-dispatched')
    await loadNotifications()
  } catch (e) {
    toast.error(e?.message ?? 'Failed to resend push')
  } finally {
    resendingId.value = null
  }
}

onMounted(async () => {
  try {
    const response = await adminApi.getUser(route.params.uuid)
    user.value = response?.data ?? response
  } catch (error) {
    console.error('Failed to load user:', error)
  } finally {
    loading.value = false
  }
})

watch(user, (u) => {
  if (u?.uuid) loadNotifications()
}, { immediate: true })
</script>
