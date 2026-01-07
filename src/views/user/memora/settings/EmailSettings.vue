<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Email Settings </template>

    <div class="space-y-8 w-1/2">
      <!-- Page Header -->
      <div>
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">
          Email Settings
        </h1>
        <p class="text-sm mb-6" :class="theme.textSecondary">
          Configure your email sender information for client communications.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <Loader2 class="h-8 w-8 animate-spin" :class="theme.textTertiary" />
      </div>

      <!-- Content -->
      <div v-else>
        <div class="rounded-xl border p-6 space-y-5" :class="[theme.bgCard, theme.borderCard]">
          <div>
            <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Sender Information</h2>
            <p class="text-sm" :class="theme.textSecondary">
              Configure how your emails appear to recipients
            </p>
          </div>

          <div class="space-y-5">
            <!-- From Name -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">From Name</label>
              <Input
                v-model="fromName"
                type="text"
                placeholder="Your Name or Company"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                The name that will appear as the sender of your emails.
                <span v-if="isUsingBrandingName" class="block mt-1 text-violet-500">
                  Currently using brand name from Branding settings.
                </span>
              </p>
            </div>

            <!-- From Address -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">From Address</label>
              <Input
                v-model="fromAddress"
                type="email"
                placeholder="noreply@yourdomain.com"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  'font-mono text-sm',
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                The email address that will appear as the sender of your emails.
                <span v-if="isUsingBrandingEmail" class="block mt-1 text-violet-500">
                  Currently using support email from Branding settings.
                </span>
              </p>
            </div>

            <!-- Reply To -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Reply To</label>
              <Input
                v-model="replyTo"
                type="email"
                placeholder="support@yourdomain.com"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  'font-mono text-sm',
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                The email address where replies to your emails will be sent.
              </p>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div :class="theme.borderSecondary" class="mt-8 pt-6 border-t">
          <div class="flex items-center justify-between gap-3">
            <div v-if="hasChanges" class="flex items-center gap-2 text-sm">
              <div class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span :class="theme.textSecondary">You have unsaved changes</span>
            </div>
            <div v-else class="flex items-center gap-2 text-sm">
              <Check class="h-4 w-4 text-violet-500" />
              <span :class="theme.textSecondary">All changes saved</span>
            </div>
            <Button
              :disabled="!hasChanges || isSaving || isLoading"
              class="bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              :loading="isSaving"
              loading-label="Saving..."
              @click="handleSave"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Loader2, Check } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import Input from '@/components/shadcn/input/Input.vue'
import { Separator } from '@/components/shadcn/separator'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSettingsApi } from '@/api/settings'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()
const { fetchSettings, updateEmailSettings } = useSettingsApi()

const fromName = ref('')
const fromAddress = ref('')
const replyTo = ref('')
const brandingName = ref('')
const brandingSupportEmail = ref('')

const isLoading = ref(false)
const isSaving = ref(false)

// Original values for change tracking
const originalFromName = ref('')
const originalFromAddress = ref('')
const originalReplyTo = ref('')
const originalEmailFromName = ref(null)
const originalEmailFromAddress = ref(null)

// Computed to check if there are changes
const hasChanges = computed(() => {
  return (
    fromName.value !== originalFromName.value ||
    fromAddress.value !== originalFromAddress.value ||
    replyTo.value !== originalReplyTo.value
  )
})

// Check if using branding defaults
const isUsingBrandingName = computed(() => {
  return !originalEmailFromName.value && brandingName.value && fromName.value === brandingName.value
})

const isUsingBrandingEmail = computed(() => {
  return !originalEmailFromAddress.value && brandingSupportEmail.value && fromAddress.value === brandingSupportEmail.value
})

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await fetchSettings()
    const settings = response.data || response

    brandingName.value = settings.branding?.name || ''
    brandingSupportEmail.value = settings.branding?.supportEmail || ''

    // Get email values (API returns branding defaults when email values are null)
    const emailFromName = settings.email?.fromName || ''
    const emailFromAddress = settings.email?.fromAddress || ''

    // Check if email values match branding values (indicating defaults are being used)
    // We can't know for sure if email_from_name was null, but if values match branding,
    // it's likely using defaults
    originalEmailFromName.value = emailFromName === brandingName.value && brandingName.value ? null : emailFromName
    originalEmailFromAddress.value = emailFromAddress === brandingSupportEmail.value && brandingSupportEmail.value ? null : emailFromAddress

    fromName.value = emailFromName
    fromAddress.value = emailFromAddress
    replyTo.value = settings.email?.replyTo || ''

    // Store original values for change tracking
    originalFromName.value = fromName.value
    originalFromAddress.value = fromAddress.value
    originalReplyTo.value = replyTo.value
  } catch (error) {
    toast.error('Failed to load settings', {
      description: error.message || 'Please try again',
    })
  } finally {
    isLoading.value = false
  }
})

// Manual save function
const handleSave = async () => {
  if (!hasChanges.value) return

  isSaving.value = true
  try {
    await updateEmailSettings({
      fromName: fromName.value,
      fromAddress: fromAddress.value,
      replyTo: replyTo.value,
    })

    // Update original values after successful save
    originalFromName.value = fromName.value
    originalFromAddress.value = fromAddress.value
    originalReplyTo.value = replyTo.value

    toast.success('Settings saved successfully')
  } catch (error) {
    toast.error('Failed to save settings', {
      description: error.message || 'Please try again',
    })
  } finally {
    isSaving.value = false
  }
}
</script>

