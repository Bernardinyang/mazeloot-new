<template>
  <div class="space-y-10">
    <div>
      <p class="text-xs font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-1">Account</p>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-violet-800 to-fuchsia-800 dark:from-white dark:via-violet-200 dark:to-fuchsia-200 bg-clip-text text-transparent">
        Refer a Friend
      </h1>
      <p class="text-sm mt-2 text-gray-600 dark:text-gray-400 max-w-lg">
        Invite friends and earn referral credits.
      </p>
    </div>

    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/80 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gradient-to-r from-fuchsia-500/5 to-transparent dark:from-fuchsia-500/10">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white shadow-md">
          <Gift class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Invite Friends & Get $20</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Give $20 off, get $20 credit per referral</p>
        </div>
      </div>
      <div class="p-6">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Give your friends $20 off their first bill on Mazeloot, and get a $20 referral credit for each person that subscribes.
        </p>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/80 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gradient-to-r from-violet-500/5 to-transparent dark:from-violet-500/10">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md">
          <Link2 class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Your Referral Link</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Share this link with friends</p>
        </div>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex gap-2">
          <input
            :value="loading ? 'Loading…' : referralLink"
            readonly
            class="flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus-ring-2 focus:ring-violet-500"
            aria-label="Referral link"
          />
          <Button size="default" class="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 border-0" :disabled="loading" @click="copyLink">
            {{ copied ? 'Copied' : 'Copy Link' }}
          </Button>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/80 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gradient-to-r from-emerald-500/5 to-transparent dark:from-emerald-500/10">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
          <Mail class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Share With Friends</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Send an invite by email</p>
        </div>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex gap-2 flex-wrap">
          <input
            v-model="inviteEmail"
            type="email"
            placeholder="e.g. friend@mail.com"
            class="flex-1 min-w-[200px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Friend email address"
            @keydown.enter="sendInvite"
          />
          <Button size="default" class="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 border-0" :disabled="sending || !inviteEmail.trim()" @click="sendInvite">
            {{ sending ? 'Sending…' : 'Send Invite' }}
          </Button>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/80 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gradient-to-r from-amber-500/5 to-transparent dark:from-amber-500/10">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
          <BarChart3 class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Analytics</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Your referral stats</p>
        </div>
      </div>
      <div class="p-6 space-y-6">
        <div class="grid gap-6 sm:grid-cols-4">
          <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700/50">
            <p class="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400">
              Friends registered
              <button type="button" class="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500" aria-label="Info">
                <Info class="h-3.5 w-3.5" />
              </button>
            </p>
            <p class="text-2xl font-bold tabular-nums text-gray-900 dark:text-white mt-1">{{ stats.totalRegistered }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700/50">
            <p class="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400">
              Total conversions
              <button type="button" class="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500" aria-label="Info">
                <Info class="h-3.5 w-3.5" />
              </button>
            </p>
            <p class="text-2xl font-bold tabular-nums text-gray-900 dark:text-white mt-1">{{ stats.totalConversions }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700/50">
            <p class="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400">
              Total earned
              <button type="button" class="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500" aria-label="Info">
                <Info class="h-3.5 w-3.5" />
              </button>
            </p>
            <p class="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">{{ formatCurrency(stats.totalEarned) }}</p>
          </div>
          <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700/50">
            <p class="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400">
              Credit balance
              <button type="button" class="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500" aria-label="Info">
                <Info class="h-3.5 w-3.5" />
              </button>
            </p>
            <p class="text-2xl font-bold tabular-nums text-violet-600 dark:text-violet-400 mt-1">{{ formatCurrency(stats.creditBalance) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/80 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gradient-to-r from-indigo-500/5 to-transparent dark:from-indigo-500/10">
        <div class="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md flex h-10 w-10 items-center justify-center">
          <Users class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">All referrals</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">People you invited or who used your link</p>
        </div>
      </div>
      <div class="p-6 overflow-x-auto">
        <table class="w-full text-sm" aria-label="Referral list">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Email</th>
              <th class="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
              <th class="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Invited</th>
              <th class="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Converted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="referralsLoading" class="border-b border-gray-100 dark:border-gray-800">
              <td colspan="4" class="py-8 text-center text-gray-500 dark:text-gray-400">Loading…</td>
            </tr>
            <tr v-else-if="!referrals.length" class="border-b border-gray-100 dark:border-gray-800">
              <td colspan="4" class="py-8 text-center text-gray-500 dark:text-gray-400">No referrals yet. Share your link or send an invite.</td>
            </tr>
            <tr
              v-for="(r, i) in referrals"
              :key="`${r.email}-${i}`"
              class="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <td class="py-3 px-2 text-gray-900 dark:text-white">{{ r.email }}</td>
              <td class="py-3 px-2">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="{
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300': r.status === 'pending',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300': r.status === 'registered',
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300': r.status === 'converted',
                  }"
                >
                  {{ r.status === 'pending' ? 'Pending' : r.status === 'registered' ? 'Registered' : 'Converted' }}
                </span>
              </td>
              <td class="py-3 px-2 text-gray-600 dark:text-gray-400 tabular-nums">{{ formatDate(r.sent_at) }}</td>
              <td class="py-3 px-2 text-gray-600 dark:text-gray-400 tabular-nums">{{ r.converted_at ? formatDate(r.converted_at) : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900/80 shadow-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gradient-to-r from-slate-500/5 to-transparent dark:from-slate-500/10">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 text-white shadow-md">
          <HelpCircle class="h-5 w-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">FAQ</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Common questions</p>
        </div>
      </div>
      <Collapsible v-for="(faq, i) in faqs" :key="i" class="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
        <CollapsibleTrigger
          class="group flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          {{ faq.question }}
          <ChevronRight class="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p class="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400">{{ faq.answer }}</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { BarChart3, ChevronRight, Gift, HelpCircle, Info, Link2, Mail, Users } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/shadcn/collapsible'
import { useReferralApi } from '@/shared/api/referral'
import { toast } from '@/shared/utils/toast'
import { getPublicFaqs } from '@/shared/api/faq'

const { getReferral, getReferrals, sendInvite: sendInviteApi } = useReferralApi()
const faqs = ref([])
const referrals = ref([])
const referralsLoading = ref(true)

const referralLink = computed(() => {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  return linkFromApi.value || `${base}/ref/${referralCode.value}`
})
const linkFromApi = ref('')
const referralCode = ref('')
const copied = ref(false)
const inviteEmail = ref('')
const sending = ref(false)
const loading = ref(true)

const stats = ref({
  totalRegistered: 0,
  totalConversions: 0,
  totalEarned: 0,
  creditBalance: 0,
})

function formatCurrency(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' })
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    copied.value = true
    toast.success('Link copied to clipboard')
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    toast.error('Could not copy link')
  }
}

async function sendInvite() {
  const email = inviteEmail.value.trim()
  if (!email || sending.value) return
  sending.value = true
  try {
    await sendInviteApi(email)
    inviteEmail.value = ''
    toast.success('Invite sent')
  } catch (e) {
    toast.error(e?.message ?? 'Failed to send invite')
  } finally {
    sending.value = false
  }
}

onMounted(async () => {
  faqs.value = await getPublicFaqs()
  try {
    const data = await getReferral()
    if (data?.referral_code) referralCode.value = data.referral_code
    if (data?.referral_link) linkFromApi.value = data.referral_link
    if (data != null) {
      stats.value = {
        totalRegistered: data.total_registered ?? 0,
        totalConversions: data.total_conversions ?? 0,
        totalEarned: data.total_earned_cents ?? 0,
        creditBalance: data.credit_balance_cents ?? 0,
      }
    }
  } catch {
    // keep defaults
  } finally {
    loading.value = false
  }
  referralsLoading.value = true
  try {
    referrals.value = await getReferrals()
  } catch {
    referrals.value = []
  } finally {
    referralsLoading.value = false
  }
})
</script>
