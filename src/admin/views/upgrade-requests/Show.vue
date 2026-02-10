<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <Button variant="ghost" size="icon" class="shrink-0" aria-label="Back to list" @click="$router.push({ name: 'admin-upgrade-requests' })">
            <ChevronLeft class="h-5 w-5" />
          </Button>
          <div>
            <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Upgrade Request</h1>
            <p :class="['text-sm mt-0.5', theme.textSecondary]">View and generate checkout link</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="rounded-xl border border-border bg-card p-4 sm:p-8">
        <div class="flex items-center gap-3">
          <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
          <span :class="['text-sm', theme.textSecondary]">Loading…</span>
        </div>
      </div>

      <template v-else-if="request">
        <Card class="rounded-xl border border-l-4 border-l-emerald-500 dark:border-l-emerald-500 border-border bg-card shadow-sm overflow-hidden">
          <div class="p-4 sm:p-6">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div class="flex items-center gap-3">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <TrendingUp class="h-5 w-5" />
                </div>
                <div>
                  <h2 :class="['text-lg font-semibold', theme.textPrimary]">Request details</h2>
                  <p :class="['text-sm', theme.textSecondary]">
                    {{ formatTier(request.current_tier || 'starter') }} → {{ formatTier(request.target_tier) }}
                  </p>
                </div>
              </div>
              <span
                :class="[
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shrink-0',
                  request.status === 'pending'
                    ? 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                    : request.status === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground',
                ]"
              >
                <span v-if="request.status === 'pending'" class="h-1.5 w-1.5 rounded-full bg-current animate-pulse" aria-hidden />
                {{ request.status }}
              </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="rounded-lg bg-muted/30 dark:bg-muted/10 p-4">
                <Label :class="['text-xs font-medium uppercase tracking-wide', theme.textSecondary]">User</Label>
                <p :class="['text-sm font-medium mt-1.5', theme.textPrimary]">
                  {{ request.user.first_name }} {{ request.user.last_name }}
                </p>
                <p :class="['text-xs mt-0.5', theme.textSecondary]">{{ request.user.email }}</p>
                <Button
                  variant="outline"
                  size="sm"
                  class="mt-3 gap-1.5"
                  @click="$router.push({ name: 'admin-user-show', params: { uuid: request.user.uuid } })"
                >
                  <User class="h-4 w-4" />
                  View user
                </Button>
              </div>
              <div class="rounded-lg bg-muted/30 dark:bg-muted/10 p-4 space-y-3">
                <div>
                  <Label :class="['text-xs font-medium uppercase tracking-wide', theme.textSecondary]">Requested at</Label>
                  <p :class="['text-sm mt-1', theme.textPrimary]">{{ formatDate(request.requested_at) }}</p>
                </div>
                <div v-if="request.completed_at">
                  <Label :class="['text-xs font-medium uppercase tracking-wide', theme.textSecondary]">Completed at</Label>
                  <p :class="['text-sm mt-1', theme.textPrimary]">{{ formatDate(request.completed_at) }}</p>
                </div>
              </div>
            </div>
            <div v-if="request.notes" class="mt-4 rounded-lg bg-muted/30 dark:bg-muted/10 p-4">
              <Label :class="['text-xs font-medium uppercase tracking-wide', theme.textSecondary]">Notes</Label>
              <p :class="['text-sm mt-1.5 whitespace-pre-wrap', theme.textPrimary]">{{ request.notes }}</p>
            </div>
            <div v-if="request.subscription" class="mt-4 pt-4 border-t border-border">
              <Label :class="['text-xs font-medium uppercase tracking-wide', theme.textSecondary]">Current subscription</Label>
              <p :class="['text-sm mt-1.5', theme.textPrimary]">
                {{ formatTier(request.subscription.tier) }} · {{ request.subscription.billing_cycle }}
                <span v-if="request.subscription.current_period_end"> · Renews {{ formatDate(request.subscription.current_period_end) }}</span>
              </p>
            </div>
          </div>
        </Card>

        <div v-if="request.status === 'pending'" class="flex flex-wrap gap-3">
          <Button class="gap-2" @click="openCheckoutDialog">
            <CreditCard class="h-4 w-4" />
            Generate checkout link
          </Button>
          <Button variant="outline" class="gap-2" :disabled="cancelling" @click="cancelRequest">
            <XCircle v-if="!cancelling" class="h-4 w-4" />
            <Loader2 v-else class="h-4 w-4 animate-spin" />
            Cancel request
          </Button>
        </div>
      </template>

      <div v-else class="rounded-2xl border border-dashed border-border bg-muted/30 dark:bg-muted/10 px-8 py-16 text-center">
        <p :class="['text-sm', theme.textSecondary]">Request not found</p>
        <Button variant="outline" class="mt-4 gap-2" @click="$router.push({ name: 'admin-upgrade-requests' })">
          <ChevronLeft class="h-4 w-4" />
          Back to list
        </Button>
      </div>
    </div>

    <Dialog :open="showCheckoutDialog" @update:open="showCheckoutDialog = $event">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate checkout link</DialogTitle>
          <DialogDescription>
            Create a checkout session for {{ request?.target_tier }}. User will complete payment and then be moved to the new plan.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4 space-y-4">
          <div>
            <Label for="billing">Billing cycle</Label>
            <select id="billing" v-model="checkoutForm.billing_cycle" :class="['mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm', theme.textPrimary]">
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div>
            <Label for="currency">Currency</Label>
            <select id="currency" v-model="checkoutForm.currency" :class="['mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm', theme.textPrimary]">
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
              <option value="ngn">NGN</option>
              <option value="zar">ZAR</option>
              <option value="kes">KES</option>
              <option value="ghs">GHS</option>
              <option value="jpy">JPY</option>
              <option value="cad">CAD</option>
              <option value="aud">AUD</option>
            </select>
          </div>
          <div>
            <Label for="provider">Payment provider</Label>
            <select id="provider" v-model="checkoutForm.payment_provider" :class="['mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm', theme.textPrimary]">
              <option value="stripe">Stripe</option>
              <option value="paystack">Paystack</option>
              <option value="flutterwave">Flutterwave</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <input id="send-checkout" v-model="checkoutForm.send_to_user" type="checkbox" class="rounded" />
            <Label for="send-checkout">Send checkout link to user</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showCheckoutDialog = false">Cancel</Button>
          <Button :disabled="generating" @click="generateCheckout">Generate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog :open="!!generatedCheckoutUrl" @update:open="(v) => { if (!v) generatedCheckoutUrl = null }">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>Checkout link generated</DialogTitle>
          <DialogDescription>
            The link has been sent to the user and will appear in their dashboard. You can also copy it below to share manually.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4 flex gap-2">
          <Input :model-value="generatedCheckoutUrl" readonly class="font-mono text-sm flex-1" />
          <Button variant="outline" size="sm" @click="copyCheckoutUrl">Copy</Button>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog :open="showCancelConfirm" @update:open="showCancelConfirm = $event">
      <DialogContent class="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cancel upgrade request</DialogTitle>
          <DialogDescription>
            This request will be cancelled. The user will need to submit a new request if they still want to upgrade.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="showCancelConfirm = false">Keep request</Button>
          <Button variant="destructive" class="gap-2" :disabled="cancelling" @click="confirmCancelRequest">
            <Loader2 v-if="cancelling" class="h-4 w-4 animate-spin" />
            Cancel request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'
import Label from '@/shared/components/shadcn/Label.vue'
import { Input } from '@/shared/components/shadcn/input'
import Card from '@/shared/components/shadcn/Card.vue'
import { ChevronLeft, CreditCard, Loader2, TrendingUp, User, XCircle } from '@/shared/utils/lucideAnimated'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const route = useRoute()
const adminApi = useAdminApi()
const request = ref(null)
const loading = ref(true)
const showCheckoutDialog = ref(false)
const generatedCheckoutUrl = ref(null)
const generating = ref(false)
const cancelling = ref(false)
const showCancelConfirm = ref(false)
const checkoutForm = ref({
  billing_cycle: 'monthly',
  currency: 'usd',
  payment_provider: 'stripe',
  send_to_user: true,
})

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—')
const formatTier = (tier) => (tier ? tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase() : '')

const load = async () => {
  loading.value = true
  try {
    const res = await adminApi.getUpgradeRequest(route.params.uuid)
    request.value = res.data || res
  } catch (e) {
    toast.error('Failed to load request')
  } finally {
    loading.value = false
  }
}

const openCheckoutDialog = () => {
  checkoutForm.value = {
    billing_cycle: 'monthly',
    currency: 'usd',
    payment_provider: 'stripe',
    send_to_user: true,
  }
  showCheckoutDialog.value = true
}

const generateCheckout = async () => {
  if (!request.value) return
  generating.value = true
  try {
    const res = await adminApi.generateUpgradeInvoice(request.value.uuid, {
      billing_cycle: checkoutForm.value.billing_cycle,
      currency: checkoutForm.value.currency,
      payment_provider: checkoutForm.value.payment_provider,
      send_to_user: checkoutForm.value.send_to_user,
    })
    const data = res.data || res
    const url = data.checkout_url || data.link
    showCheckoutDialog.value = false
    if (url) {
      generatedCheckoutUrl.value = url
      toast.success(checkoutForm.value.send_to_user ? 'Link generated and sent to user. They will see it in their dashboard.' : 'Link generated. Copy and share with the user.')
    }
    await load()
  } catch (e) {
    toast.apiError(e, 'Failed to generate checkout')
  } finally {
    generating.value = false
  }
}

const copyCheckoutUrl = () => {
  if (!generatedCheckoutUrl.value) return
  navigator.clipboard.writeText(generatedCheckoutUrl.value).then(() => toast.success('Copied'))
}

function cancelRequest() {
  if (request.value) showCancelConfirm.value = true
}

async function confirmCancelRequest() {
  if (!request.value) return
  cancelling.value = true
  try {
    await adminApi.cancelUpgradeRequest(request.value.uuid)
    showCancelConfirm.value = false
    toast.success('Request cancelled')
    await load()
  } catch (e) {
    toast.apiError(e, 'Failed to cancel request')
  } finally {
    cancelling.value = false
  }
}

onMounted(load)
</script>
