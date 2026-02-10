<template>
  <DashboardLayout>
    <template #breadcrumb>Confirm downgrade</template>
    <template #header>
      <Button variant="ghost" size="sm" class="rounded-lg gap-1" @click="goBack">
        <ChevronLeft class="h-4 w-4" />
        Back
      </Button>
    </template>

    <div class="max-w-lg mx-auto py-12 px-4 sm:px-6">
      <div v-if="loading" class="flex flex-col items-center gap-3 py-12">
        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        <p class="text-sm text-muted-foreground">Loading…</p>
      </div>

      <div v-else-if="error" class="rounded-xl border border-destructive/30 bg-destructive/5 dark:bg-destructive/10 px-6 py-8 text-center">
        <p class="text-destructive font-medium">{{ error }}</p>
        <p class="text-sm text-muted-foreground mt-1">This link may have expired or already been used.</p>
        <Button class="mt-4" variant="outline" @click="router.push({ name: 'memora-pricing' })">
          Go to Plans &amp; Pricing
        </Button>
      </div>

      <div v-else class="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-6">
        <h1 class="text-xl font-bold text-foreground">Switch to {{ starterPlanLabel }}</h1>
        <p class="text-muted-foreground text-sm">
          Your current plan ({{ info?.current_plan ?? 'paid' }}) will be cancelled. You will be on the free {{ starterPlanLabel }} plan.
        </p>
        <p v-if="info?.expires_at" class="text-xs text-muted-foreground">
          Link valid until {{ formatExpiry(info.expires_at) }}
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <Button variant="outline" :disabled="confirming" @click="router.push({ name: 'memora-pricing' })">
            Cancel
          </Button>
          <Button :disabled="confirming" @click="confirmDowngrade">
            <Loader2 v-if="confirming" class="h-4 w-4 mr-2 animate-spin" />
            Confirm downgrade
          </Button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Button } from '@/shared/components/shadcn/button'
import { ChevronLeft, Loader2 } from '@/shared/utils/lucideAnimated'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'
import { useSubscriptionApi } from '@/domains/memora/api/pricing'
import { toast } from '@/shared/utils/toast'

const { tierDisplayName } = useMemoraFeatures()
const starterPlanLabel = tierDisplayName('starter')

const route = useRoute()
const router = useRouter()
function goBack() {
  router.back()
}
const { getDowngradeByToken, confirmDowngrade: confirmDowngradeApi } = useSubscriptionApi()

const loading = ref(true)
const error = ref(null)
const info = ref(null)
const confirming = ref(false)

const token = computed(() => route.query.token ?? '')

function formatExpiry(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' })
  } catch {
    return ''
  }
}

async function loadInfo() {
  if (!token.value) {
    error.value = 'Invalid link'
    loading.value = false
    return
  }
  try {
    const data = await getDowngradeByToken(token.value)
    info.value = data
    error.value = null
  } catch (e) {
    error.value = e?.response?.data?.error ?? e?.message ?? 'Invalid or expired link'
  } finally {
    loading.value = false
  }
}

async function confirmDowngrade() {
  if (!token.value || confirming.value) return
  confirming.value = true
  try {
    await confirmDowngradeApi(token.value)
    toast.success(`You have been downgraded to ${starterPlanLabel}.`)
    router.replace({ name: 'memora-pricing' })
  } catch (e) {
    toast.apiError(e, 'Failed to confirm downgrade')
  } finally {
    confirming.value = false
  }
}

onMounted(() => loadInfo())
</script>
