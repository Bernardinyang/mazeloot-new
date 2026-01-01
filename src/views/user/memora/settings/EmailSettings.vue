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
              <Check class="h-4 w-4 text-teal-500" />
              <span :class="theme.textSecondary">All changes saved</span>
            </div>
            <Button
              :disabled="!hasChanges || isSaving || isLoading"
              class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleSave"
            >
              <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
              <span v-if="isSaving">Saving...</span>
              <span v-else>Save Changes</span>
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

const isLoading = ref(false)
const isSaving = ref(false)

// Original values for change tracking
const originalFromName = ref('')
const originalFromAddress = ref('')
const originalReplyTo = ref('')

// Computed to check if there are changes
const hasChanges = computed(() => {
  return (
    fromName.value !== originalFromName.value ||
    fromAddress.value !== originalFromAddress.value ||
    replyTo.value !== originalReplyTo.value
  )
})

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await fetchSettings()
    const settings = response.data || response

    fromName.value = settings.email?.fromName || ''
    fromAddress.value = settings.email?.fromAddress || ''
    replyTo.value = settings.email?.replyTo || ''

    // Store original values
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

