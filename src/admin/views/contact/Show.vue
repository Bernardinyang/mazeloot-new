<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Contact submission</h1>
          <p :class="['text-sm mt-1', theme.textSecondary]">Details of the contact form submission</p>
        </div>
        <Button variant="outline" class="shrink-0" @click="$router.push({ name: 'admin-contact' })">
          Back to list
        </Button>
      </div>

      <div v-if="loading" :class="['rounded-xl border border-border bg-card p-4 sm:p-6']">
        <div class="flex items-center gap-3">
          <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
          <span :class="['text-sm', theme.textSecondary]">Loading…</span>
        </div>
      </div>

      <template v-else-if="submission">
        <Card class="p-4 sm:p-6 rounded-xl border border-border bg-card shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label :class="['text-xs uppercase', theme.textSecondary]">Name</Label>
              <p :class="['text-sm font-medium mt-1', theme.textPrimary]">{{ submission.first_name }} {{ submission.last_name }}</p>
            </div>
            <div>
              <Label :class="['text-xs uppercase', theme.textSecondary]">Email</Label>
              <p :class="['text-sm mt-1', theme.textPrimary]">
                <a :href="`mailto:${submission.email}`" class="text-accent hover:underline">{{ submission.email }}</a>
              </p>
            </div>
            <div v-if="submission.company">
              <Label :class="['text-xs uppercase', theme.textSecondary]">Company</Label>
              <p :class="['text-sm mt-1', theme.textPrimary]">{{ submission.company }}</p>
            </div>
            <div v-if="submission.country">
              <Label :class="['text-xs uppercase', theme.textSecondary]">Country</Label>
              <p :class="['text-sm mt-1', theme.textPrimary]">{{ submission.country }}</p>
            </div>
            <div v-if="submission.phone">
              <Label :class="['text-xs uppercase', theme.textSecondary]">Phone</Label>
              <p :class="['text-sm mt-1', theme.textPrimary]">
                <a :href="`tel:${submission.phone}`" class="text-accent hover:underline">{{ submission.phone }}</a>
              </p>
            </div>
            <div>
              <Label :class="['text-xs uppercase', theme.textSecondary]">Submitted at</Label>
              <p :class="['text-sm mt-1', theme.textPrimary]">{{ formatDate(submission.created_at) }}</p>
            </div>
            <div v-if="submission.message" class="md:col-span-2">
              <Label :class="['text-xs uppercase', theme.textSecondary]">Message</Label>
              <p :class="['text-sm mt-1 whitespace-pre-wrap', theme.textPrimary]">{{ submission.message }}</p>
            </div>
          </div>
        </Card>
      </template>

      <div v-else class="text-center py-12">
        <p :class="['text-sm', theme.textSecondary]">Submission not found</p>
        <Button variant="outline" class="mt-4" @click="$router.push({ name: 'admin-contact' })">
          Back to list
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'
import { Card } from '@/shared/components/shadcn/card'
import Label from '@/shared/components/shadcn/Label.vue'
import { toast } from '@/shared/utils/toast'

const route = useRoute()
const theme = useThemeClasses()
const adminApi = useAdminApi()
const submission = ref(null)
const loading = ref(true)

const formatDate = (d) => {
  if (!d) return '—'
  const dt = new Date(d)
  return dt.toLocaleDateString(undefined, { dateStyle: 'medium' }) + ' ' + dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

const load = async () => {
  const uuid = route.params.uuid
  if (!uuid) return
  loading.value = true
  try {
    const res = await adminApi.getContactSubmission(uuid)
    submission.value = res?.data ?? res
  } catch (e) {
    toast.error('Failed to load submission')
    submission.value = null
  } finally {
    loading.value = false
  }
}

watch(() => route.params.uuid, load, { immediate: true })
</script>
