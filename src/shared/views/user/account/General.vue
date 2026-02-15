<template>
  <div class="space-y-10">
    <div>
      <p class="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-1">Account</p>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-violet-800 to-fuchsia-800 dark:from-white dark:via-violet-200 dark:to-fuchsia-200 bg-clip-text text-transparent">
        Profile
      </h1>
      <p class="text-sm mt-2 text-gray-600 dark:text-gray-400 max-w-lg">
        Manage your identity and security settings.
      </p>
    </div>

    <!-- Profile card -->
    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/80 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gradient-to-r from-violet-500/5 to-transparent dark:from-violet-500/10">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md">
          <User class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Personal info</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Your name and profile photo</p>
        </div>
      </div>
      <div class="p-6 space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div class="relative shrink-0">
            <div class="h-24 w-24 rounded-2xl overflow-hidden ring-4 ring-violet-500/20 dark:ring-violet-400/20 shadow-lg">
              <AvatarDisplay
                :avatar="profilePhotoPreview || user?.avatar"
                :name="displayName"
                size="lg"
                class="h-24 w-24"
              />
            </div>
            <label
              class="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg hover:shadow-violet-500/30 transition-all duration-200 hover:scale-105"
              aria-label="Change profile photo"
            >
              <Camera class="h-4 w-4" />
              <input type="file" accept="image/*" class="sr-only" :disabled="isUploadingPhoto" @change="onPhotoChange" />
            </label>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Profile photo</p>
            <p class="text-xs mt-0.5 text-gray-500 dark:text-gray-400">
              {{ isUploadingPhoto ? 'Uploading…' : 'JPG, PNG or GIF. Max 5MB.' }}
            </p>
          </div>
        </div>

        <Separator class="bg-gray-100 dark:bg-gray-800" />

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label for="first_name" class="text-sm font-medium text-gray-700 dark:text-gray-300">First name</label>
            <Input
              id="first_name"
              v-model="firstName"
              type="text"
              placeholder="First name"
              :disabled="isSaving"
              class="rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-violet-500 focus-visible:border-violet-500 dark:focus-visible:ring-violet-400"
            />
          </div>
          <div class="space-y-2">
            <label for="last_name" class="text-sm font-medium text-gray-700 dark:text-gray-300">Last name</label>
            <Input
              id="last_name"
              v-model="lastName"
              type="text"
              placeholder="Last name"
              :disabled="isSaving"
              class="rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-violet-500 focus-visible:border-violet-500 dark:focus-visible:ring-violet-400"
            />
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label for="middle_name" class="text-sm font-medium text-gray-500 dark:text-gray-400">Middle name (optional)</label>
            <Input
              id="middle_name"
              v-model="middleName"
              type="text"
              placeholder="Middle name"
              :disabled="isSaving"
              class="rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-violet-500"
            />
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ user?.email ?? '—' }}</p>
            <p class="text-xs mt-0.5 text-gray-500 dark:text-gray-400">Email cannot be changed here. Contact support if needed.</p>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <Button
            :disabled="!hasChanges || isSaving"
            class="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 border-0 px-6"
            @click="submitProfile"
          >
            <Loader2 v-if="isSaving" class="h-4 w-4 animate-spin mr-2" />
            {{ isSaving ? 'Saving…' : 'Save changes' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Password card -->
    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/80 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gradient-to-r from-emerald-500/5 to-transparent dark:from-emerald-500/10">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
          <KeyRound class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Change password</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Update your password. You will stay signed in.</p>
        </div>
      </div>
      <div class="p-6 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2 max-w-xl">
          <div class="space-y-2 sm:col-span-2">
            <label for="current_password" class="text-sm font-medium text-gray-700 dark:text-gray-300">Current password</label>
            <Input
              id="current_password"
              v-model="currentPassword"
              type="password"
              autocomplete="current-password"
              :disabled="isChangingPassword"
              class="rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
            />
          </div>
          <div class="space-y-2">
            <label for="new_password" class="text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
            <Input
              id="new_password"
              v-model="newPassword"
              type="password"
              autocomplete="new-password"
              :disabled="isChangingPassword"
              class="rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
            />
          </div>
          <div class="space-y-2">
            <label for="new_password_confirm" class="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm new password</label>
            <Input
              id="new_password_confirm"
              v-model="newPasswordConfirm"
              type="password"
              autocomplete="new-password"
              :disabled="isChangingPassword"
              class="rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
            />
          </div>
        </div>
        <Button
          :disabled="!currentPassword || !newPassword || newPassword !== newPasswordConfirm || isChangingPassword"
          variant="outline"
          class="rounded-xl border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500"
          @click="submitPassword"
        >
          <Loader2 v-if="isChangingPassword" class="h-4 w-4 animate-spin mr-2" />
          {{ isChangingPassword ? 'Updating…' : 'Change password' }}
        </Button>
      </div>
    </div>

    <!-- Device notifications -->
    <div
      v-if="notificationPermission.supported"
      class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/80 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gradient-to-r from-violet-500/5 to-transparent dark:from-violet-500/10">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md">
          <Bell class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Device notifications</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Get notified when you're not in the app</p>
        </div>
      </div>
      <div class="p-6 space-y-3">
        <p v-if="notificationPermission.permission === 'default'" class="text-sm text-gray-600 dark:text-gray-400">
          Allow notifications in your browser to receive alerts on this device.
        </p>
        <p v-else-if="notificationPermission.permission === 'granted'" class="text-sm text-green-600 dark:text-green-400">
          Notifications are enabled for this device.
        </p>
        <p v-else class="text-sm text-gray-600 dark:text-gray-400">
          Notifications are blocked. Enable them in your browser settings to get alerts.
        </p>
        <Button
          v-if="notificationPermission.permission === 'default'"
          type="button"
          variant="outline"
          class="rounded-xl border-violet-500/50 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 hover:border-violet-500"
          :disabled="notificationPermissionRequesting"
          @click="requestNotificationPermission"
        >
          <Loader2 v-if="notificationPermissionRequesting" class="h-4 w-4 animate-spin mr-2" />
          {{ notificationPermissionRequesting ? 'Requesting…' : 'Allow notifications' }}
        </Button>
      </div>
    </div>

    <!-- Danger zone -->
    <div class="rounded-2xl border border-red-200/80 dark:border-red-900/50 bg-white dark:bg-gray-900/80 shadow-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-red-100 dark:border-red-900/30 flex items-center gap-3 bg-gradient-to-r from-red-500/5 to-transparent dark:from-red-500/10">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md">
          <Trash2 class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-red-700 dark:text-red-400">Delete account</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Permanent and irreversible</p>
        </div>
      </div>
      <div class="p-6 space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Once you delete your account, all your data will be permanently removed. This cannot be undone.
        </p>
        <div v-if="showDeleteConfirm" class="space-y-3 max-w-md rounded-xl p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30">
          <template v-if="userHasPassword">
            <label for="delete_password" class="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm your password to delete</label>
            <Input
              id="delete_password"
              v-model="deletePassword"
              type="password"
              autocomplete="current-password"
              :disabled="isDeleting"
              placeholder="Your password"
              class="rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-red-500"
            />
          </template>
          <template v-else>
            <template v-if="!deletionCodeSent">
              <p class="text-sm text-gray-600 dark:text-gray-400">You signed up with social login. We’ll send a confirmation code to your email.</p>
              <Button
                variant="outline"
                :disabled="isSendingCode || isDeleting || resendCooldownRemaining > 0"
                class="rounded-xl border-red-300 dark:border-red-800 text-red-600 dark:text-red-400"
                @click="requestDeletionCode"
              >
                <Loader2 v-if="isSendingCode" class="h-4 w-4 animate-spin mr-2" />
                {{ resendCooldownRemaining > 0 ? `Try again in ${resendCooldownRemaining}s` : isSendingCode ? 'Sending…' : 'Send code to my email' }}
              </Button>
            </template>
            <template v-else>
              <label for="delete_code" class="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmation code</label>
              <Input
                id="delete_code"
                v-model="deleteCode"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                :disabled="isDeleting"
                placeholder="000000"
                class="rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-red-500 font-mono tracking-widest"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">Enter the 6-digit code sent to {{ user?.email ?? 'your email' }}. Code expires in 15 minutes.</p>
              <Button
                type="button"
                variant="link"
                size="sm"
                class="h-auto p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs"
                :disabled="isSendingCode || isDeleting || resendCooldownRemaining > 0"
                @click="requestDeletionCode"
              >
                <Loader2 v-if="isSendingCode" class="h-3 w-3 animate-spin mr-1 inline" />
                {{ resendCooldownRemaining > 0 ? `Resend code in ${resendCooldownRemaining}s` : isSendingCode ? 'Sending…' : 'Resend code' }}
              </Button>
            </template>
          </template>
          <div class="flex gap-2">
            <Button
              variant="destructive"
              :disabled="isDeleting || !deleteConfirmValid"
              class="rounded-xl shadow-lg"
              @click="confirmDeleteAccount"
            >
              <Loader2 v-if="isDeleting" class="h-4 w-4 animate-spin mr-2" />
              {{ isDeleting ? 'Deleting…' : 'Delete my account' }}
            </Button>
            <Button variant="ghost" :disabled="isDeleting" class="rounded-xl" @click="cancelDelete">Cancel</Button>
          </div>
        </div>
        <Button
          v-else
          variant="outline"
          class="rounded-xl text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-400"
          @click="showDeleteConfirm = true"
        >
          Delete my account
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/shared/stores/user'
import { useAuthApi } from '@/shared/api/auth'
import { useLogout } from '@/shared/composables/useLogout'
import { toast } from '@/shared/utils/toast'
import AvatarDisplay from '@/shared/components/atoms/AvatarDisplay.vue'
import { Input } from '@/shared/components/shadcn/input'
import { Button } from '@/shared/components/shadcn/button'
import { Separator } from '@/shared/components/shadcn/separator'
import { Bell, Camera, KeyRound, Loader2, Trash2, User } from 'lucide-vue-next'
import { useNotificationPermission } from '@/shared/composables/useNotificationPermission'
import { usePushSubscription } from '@/shared/composables/usePushSubscription'
import { apiClient } from '@/shared/api/client'

const router = useRouter()
const userStore = useUserStore()
const authApi = useAuthApi()
const { logout } = useLogout()
const notificationPermission = useNotificationPermission()
const { subscribe: subscribeToPush } = usePushSubscription()
const notificationPermissionRequesting = ref(false)

async function requestNotificationPermission() {
  notificationPermissionRequesting.value = true
  try {
    const result = await notificationPermission.requestPermission()
    if (result === 'granted') {
      await subscribeToPush()
      toast.success('Device notifications enabled')
    }
  } catch (err) {
    console.error('Push subscription failed:', err)
    toast.error(err?.message || 'Could not enable device notifications')
  } finally {
    notificationPermissionRequesting.value = false
  }
}

const user = computed(() => userStore.user)
const firstName = ref('')
const lastName = ref('')
const middleName = ref('')
const profilePhoto = ref(null)
const profilePhotoPreview = ref(null)
const isSaving = ref(false)
const isUploadingPhoto = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')
const isChangingPassword = ref(false)
const showDeleteConfirm = ref(false)
const deletePassword = ref('')
const deleteCode = ref('')
const deletionCodeSent = ref(false)
const isSendingCode = ref(false)
const isDeleting = ref(false)
const RESEND_COOLDOWN_SECONDS = 60
const resendCooldownRemaining = ref(0)
let resendCooldownTimer = null

const userHasPassword = computed(() => user.value?.has_password === true)
const deleteConfirmValid = computed(() => {
  if (userHasPassword.value) return !!deletePassword.value?.trim()
  return deletionCodeSent.value && deleteCode.value?.trim()?.length === 6
})

const displayName = computed(() => {
  const first = firstName.value || user.value?.first_name
  const last = lastName.value || user.value?.last_name
  if (first && last) return `${first} ${last}`.trim()
  return user.value?.name ?? '—'
})

const hasChanges = computed(() => {
  return (
    (firstName.value || '') !== (user.value?.first_name || '') ||
    (lastName.value || '') !== (user.value?.last_name || '') ||
    (middleName.value || '') !== (user.value?.middle_name || '') ||
    profilePhoto.value !== null
  )
})

function syncFromUser() {
  firstName.value = user.value?.first_name ?? ''
  lastName.value = user.value?.last_name ?? ''
  middleName.value = user.value?.middle_name ?? ''
  profilePhoto.value = null
  profilePhotoPreview.value = null
}

async function onPhotoChange(e) {
  const file = e.target?.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File too large', { description: 'Max 5MB.' })
    return
  }
  isUploadingPhoto.value = true
  try {
    const reader = new FileReader()
    reader.onload = ev => { profilePhotoPreview.value = ev.target?.result }
    reader.readAsDataURL(file)

    const res = await apiClient.upload('/v1/images/upload', file, { purpose: 'profile_photo' })
    const url = res?.data?.url ?? res?.url ?? res?.data?.variants?.original
    if (url) {
      profilePhoto.value = url
      toast.success('Photo uploaded. Click "Save changes" to apply.')
    } else {
      throw new Error('Upload response missing URL')
    }
  } catch (err) {
    profilePhotoPreview.value = null
    profilePhoto.value = null
    toast.error('Upload failed', { description: err?.message ?? 'Please try again.' })
  } finally {
    isUploadingPhoto.value = false
    e.target.value = ''
  }
}

async function submitProfile() {
  if (!hasChanges.value || isSaving.value) return
  isSaving.value = true
  try {
    const payload = {}
    if (firstName.value !== (user.value?.first_name ?? '')) payload.first_name = firstName.value.trim()
    if (lastName.value !== (user.value?.last_name ?? '')) payload.last_name = lastName.value.trim()
    if (middleName.value !== (user.value?.middle_name ?? '')) payload.middle_name = middleName.value.trim() || null
    if (profilePhoto.value) payload.profile_photo = profilePhoto.value

    const data = await authApi.updateProfile(payload)
    const u = data?.user
    if (u) {
      userStore.updateUser({
        first_name: u.first_name,
        last_name: u.last_name,
        middle_name: u.middle_name,
        name: [u.first_name, u.last_name].filter(Boolean).join(' ').trim(),
        avatar: u.profile_photo || null,
      })
    }
    syncFromUser()
    toast.success('Profile updated')
  } catch (err) {
    toast.error('Could not save profile', { description: err?.message ?? 'Please try again.' })
  } finally {
    isSaving.value = false
  }
}

async function submitPassword() {
  if (!currentPassword.value || !newPassword.value || newPassword.value !== newPasswordConfirm.value || isChangingPassword.value) return
  isChangingPassword.value = true
  try {
    await authApi.changePassword(currentPassword.value, newPassword.value, newPasswordConfirm.value)
    currentPassword.value = ''
    newPassword.value = ''
    newPasswordConfirm.value = ''
    toast.success('Password updated')
  } catch (err) {
    toast.error('Could not change password', { description: err?.message ?? 'Please try again.' })
  } finally {
    isChangingPassword.value = false
  }
}

function cancelDelete() {
  showDeleteConfirm.value = false
  deletePassword.value = ''
  deleteCode.value = ''
  deletionCodeSent.value = false
  resendCooldownRemaining.value = 0
  if (resendCooldownTimer) {
    clearInterval(resendCooldownTimer)
    resendCooldownTimer = null
  }
}

function startResendCooldown(seconds) {
  const secs = Math.max(1, Math.floor(Number(seconds)) || RESEND_COOLDOWN_SECONDS)
  resendCooldownRemaining.value = secs
  if (resendCooldownTimer) clearInterval(resendCooldownTimer)
  resendCooldownTimer = setInterval(() => {
    resendCooldownRemaining.value = Math.max(0, resendCooldownRemaining.value - 1)
    if (resendCooldownRemaining.value <= 0 && resendCooldownTimer) {
      clearInterval(resendCooldownTimer)
      resendCooldownTimer = null
    }
  }, 1000)
}

async function requestDeletionCode() {
  if (isSendingCode.value || isDeleting.value || resendCooldownRemaining.value > 0) return
  isSendingCode.value = true
  try {
    await authApi.sendDeletionCode()
    deletionCodeSent.value = true
    startResendCooldown(RESEND_COOLDOWN_SECONDS)
    toast.success('Code sent', { description: 'Check your email and enter the code.' })
  } catch (err) {
    toast.error(err?.message ?? 'Could not send code')
    if (err?.status === 429 && (err?.response?.data?.retry_after_seconds != null)) {
      startResendCooldown(err.response.data.retry_after_seconds)
    }
  } finally {
    isSendingCode.value = false
  }
}

async function confirmDeleteAccount() {
  const payload = userHasPassword.value
    ? { password: deletePassword.value?.trim() }
    : { code: deleteCode.value?.trim() }
  if (userHasPassword.value && !payload.password) {
    toast.error('Password required', { description: 'Enter your password to delete your account.' })
    return
  }
  if (!userHasPassword.value && (!payload.code || payload.code.length !== 6)) {
    toast.error('Code required', { description: 'Enter the 6-digit code from your email.' })
    return
  }
  isDeleting.value = true
  try {
    await authApi.deleteAccount(payload)
    await logout()
    toast.success('Account deleted')
    router.push({ name: 'login' })
  } catch (err) {
    const backendMsg = err?.errors?.password?.[0] || err?.errors?.code?.[0] || err?.message
    toast.error(backendMsg || 'Could not delete account')
    // Keep panel and code state so user can correct code or request a new one
  } finally {
    isDeleting.value = false
  }
}

onMounted(async () => {
  syncFromUser()
  try {
    const data = await authApi.getUser()
    if (data?.user) {
      userStore.updateUser({
        ...data.user,
        name: [data.user.first_name, data.user.last_name].filter(Boolean).join(' ').trim() || data.user.email,
      })
    }
  } catch {
    // keep existing user from store
  }
})

onUnmounted(() => {
  if (resendCooldownTimer) {
    clearInterval(resendCooldownTimer)
    resendCooldownTimer = null
  }
})
</script>
