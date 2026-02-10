<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">Downgrade Request</h1>
          <p :class="['text-sm mt-1', theme.textSecondary]">View and generate confirmation link or checkout</p>
        </div>
        <Button variant="outline" class="shrink-0" @click="$router.push({ name: 'admin-downgrade-requests' })">
          Back to list
        </Button>
      </div>

      <div v-if="loading" :class="['rounded-xl border border-border bg-card p-4 sm:p-6']">
        <div class="flex items-center gap-3">
          <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
          <span :class="['text-sm', theme.textSecondary]">Loading…</span>
        </div>
      </div>

      <template v-else-if="request">
        <Card class="p-4 sm:p-6 rounded-xl border border-border bg-card shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 :class="['text-xl font-semibold', theme.textPrimary]">Request</h2>
            <Badge :variant="request.status === 'pending' ? 'secondary' : 'default'">{{ request.status }}</Badge>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label :class="['text-xs uppercase', theme.textSecondary]">User</Label>
              <p :class="['text-sm font-medium mt-1', theme.textPrimary]">
                {{ request.user.first_name }} {{ request.user.last_name }}
              </p>
              <p :class="['text-xs', theme.textSecondary]">{{ request.user.email }}</p>
              <Button
                variant="outline"
                size="sm"
                class="mt-2 gap-1.5"
                @click="$router.push({ name: 'admin-user-show', params: { uuid: request.user.uuid } })"
              >
                <User class="h-4 w-4" />
                View user
              </Button>
            </div>
            <div>
              <Label :class="['text-xs uppercase', theme.textSecondary]">Tiers</Label>
              <p :class="['text-sm font-medium mt-1', theme.textPrimary]">{{ request.current_tier }} → {{ request.target_tier }}</p>
            </div>
            <div>
              <Label :class="['text-xs uppercase', theme.textSecondary]">Requested at</Label>
              <p :class="['text-sm mt-1', theme.textPrimary]">{{ formatDate(request.requested_at) }}</p>
            </div>
            <div v-if="request.completed_at">
              <Label :class="['text-xs uppercase', theme.textSecondary]">Completed at</Label>
              <p :class="['text-sm mt-1', theme.textPrimary]">{{ formatDate(request.completed_at) }}</p>
            </div>
            <div v-if="request.notes" class="md:col-span-2">
              <Label :class="['text-xs uppercase', theme.textSecondary]">Notes</Label>
              <p :class="['text-sm mt-1 whitespace-pre-wrap', theme.textPrimary]">{{ request.notes }}</p>
            </div>
          </div>
          <div v-if="request.subscription" class="mt-4 pt-4 border-t border-border">
            <Label :class="['text-xs uppercase', theme.textSecondary]">Current subscription</Label>
            <p :class="['text-sm mt-1', theme.textPrimary]">
              {{ request.subscription.tier }} · {{ request.subscription.billing_cycle }}
              <span v-if="request.subscription.current_period_end"> · Renews {{ formatDate(request.subscription.current_period_end) }}</span>
            </p>
          </div>
        </Card>

        <div v-if="request.status === 'pending'" class="flex flex-wrap gap-3">
          <template v-if="request.target_tier === 'starter'">
            <Button @click="openLinkDialog">Generate confirmation link</Button>
          </template>
          <template v-else>
            <Button @click="openCheckoutDialog">Generate checkout link</Button>
          </template>
          <Button variant="outline" class="gap-2" :disabled="cancelling" @click="cancelRequest">
            <XCircle v-if="!cancelling" class="h-4 w-4" />
            <Loader2 v-else class="h-4 w-4 animate-spin" />
            Cancel request
          </Button>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <p :class="['text-sm', theme.textSecondary]">Request not found</p>
        <Button variant="outline" class="mt-4" @click="$router.push({ name: 'admin-downgrade-requests' })">
          Back to list
        </Button>
      </div>
    </div>

    <!-- Generate confirmation link (Starter) -->
    <Dialog :open="showLinkDialog" @update:open="showLinkDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate confirmation link</DialogTitle>
          <DialogDescription>
            Link lets the user confirm downgrade to Starter. Optionally send it via in-app notification.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4 space-y-4">
          <div class="flex items-center gap-2">
            <input id="send-link" v-model="sendToUser" type="checkbox" class="rounded" />
            <Label for="send-link">Send link to user (in-app notification)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showLinkDialog = false">Cancel</Button>
          <Button :disabled="generating" @click="generateLink">Generate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Result: link to copy -->
    <Dialog :open="!!generatedLink" @update:open="(v) => { if (!v) generatedLink = null }">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation link</DialogTitle>
          <DialogDescription>Share this link with the user. It expires in 7 days.</DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <div class="flex gap-2">
            <Input :model-value="generatedLink" readonly class="font-mono text-sm" />
            <Button variant="outline" size="sm" @click="copyLink">Copy</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Generate checkout (paid tier) -->
    <Dialog :open="showCheckoutDialog" @update:open="showCheckoutDialog = $event">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate checkout link</DialogTitle>
          <DialogDescription>
            Create a checkout session for the target paid tier. User will complete payment and then be moved to the new plan.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4 space-y-4">
          <div>
            <Label for="target">Target tier</Label>
            <select id="target" v-model="checkoutForm.target_tier" :class="['mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm', theme.textPrimary]">
              <option value="pro">Pro</option>
              <option value="studio">Studio</option>
              <option value="business">Business</option>
            </select>
          </div>
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
          <DialogTitle>Cancel downgrade request</DialogTitle>
          <DialogDescription>
            This request will be cancelled. The user will need to submit a new request if they still want to downgrade.
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
import { Input } from '@/shared/components/shadcn/input'
import Label from '@/shared/components/shadcn/Label.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import Badge from '@/shared/components/shadcn/badge/Badge.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import { toast } from '@/shared/utils/toast'
import { Loader2, User, XCircle } from '@/shared/utils/lucideAnimated'

const theme = useThemeClasses()
const route = useRoute()
const adminApi = useAdminApi()
const request = ref(null)
const loading = ref(true)
const showLinkDialog = ref(false)
const showCheckoutDialog = ref(false)
const generating = ref(false)
const cancelling = ref(false)
const showCancelConfirm = ref(false)
const sendToUser = ref(true)
const generatedLink = ref(null)
const generatedCheckoutUrl = ref(null)
const checkoutForm = ref({
  target_tier: 'pro',
  billing_cycle: 'monthly',
  currency: 'usd',
  payment_provider: 'stripe',
  send_to_user: true,
})

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : '—')

const load = async () => {
  loading.value = true
  try {
    const res = await adminApi.getDowngradeRequest(route.params.uuid)
    request.value = res.data || res
  } catch (e) {
    toast.error('Failed to load request')
  } finally {
    loading.value = false
  }
}

const openLinkDialog = () => {
  sendToUser.value = true
  showLinkDialog.value = true
}

const generateLink = async () => {
  if (!request.value) return
  generating.value = true
  try {
    const res = await adminApi.generateDowngradeInvoice(request.value.uuid, {
      target_tier: 'starter',
      send_to_user: sendToUser.value,
    })
    const data = res.data || res
    generatedLink.value = data.link || null
    showLinkDialog.value = false
    if (generatedLink.value) toast.success('Link generated')
    await load()
  } catch (e) {
    toast.apiError(e, 'Failed to generate link')
  } finally {
    generating.value = false
  }
}

const copyLink = () => {
  if (!generatedLink.value) return
  navigator.clipboard.writeText(generatedLink.value).then(() => toast.success('Copied'))
}

const openCheckoutDialog = () => {
  checkoutForm.value = {
    target_tier: request.value?.target_tier || 'pro',
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
    const res = await adminApi.generateDowngradeInvoice(request.value.uuid, {
      target_tier: checkoutForm.value.target_tier,
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
    await adminApi.cancelDowngradeRequest(request.value.uuid)
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
