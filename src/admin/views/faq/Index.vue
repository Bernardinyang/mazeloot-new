<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">FAQ</h1>
          <p :class="['mt-1 text-sm', theme.textSecondary]">Manage frequently asked questions shown on the public FAQ page and account.</p>
        </div>
        <Button @click="$router.push({ name: 'admin-faq-create' })">
          New FAQ
        </Button>
      </header>

      <div v-if="loading" class="space-y-4">
        <div class="flex items-center gap-3">
          <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
          <span :class="['text-sm', theme.textSecondary]">Loading…</span>
        </div>
        <div v-for="i in 5" :key="i" :class="['rounded-xl border border-border bg-card p-4 sm:p-6 animate-pulse']">
          <div :class="['h-5 w-48 rounded', theme.bgSkeleton]" />
          <div :class="['h-4 w-64 rounded mt-2', theme.bgSkeleton]" />
        </div>
      </div>

      <div v-else-if="faqs.length === 0" :class="['text-center py-12 text-sm rounded-xl border border-border bg-card', theme.textSecondary]">
        No FAQs yet. Create one to show on the public FAQ page.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(faq, idx) in faqs"
          :key="faq.uuid"
          :class="['rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm hover:shadow-md transition-all']"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span :class="['text-xs font-medium tabular-nums', theme.textTertiary]">{{ idx + 1 }}</span>
                <Badge v-if="!faq.is_published" variant="secondary">Draft</Badge>
                <h3 :class="['text-lg font-semibold', theme.textPrimary]">{{ faq.question }}</h3>
              </div>
              <p :class="['text-sm mt-1 line-clamp-2', theme.textSecondary]">{{ faq.answer }}</p>
            </div>
            <div class="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" @click="$router.push({ name: 'admin-faq-edit', params: { uuid: faq.uuid } })">
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                :disabled="deleting === faq.uuid"
                @click="confirmDelete(faq)"
              >
                {{ deleting === faq.uuid ? '…' : 'Delete' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Dialog :open="!!faqToDelete" @update:open="(v) => !v && (faqToDelete = null)">
      <DialogContent :class="theme.bgDropdown">
        <DialogTitle :class="theme.textPrimary">Delete FAQ</DialogTitle>
        <DialogDescription :class="theme.textSecondary">
          Are you sure you want to delete this FAQ? This cannot be undone.
        </DialogDescription>
        <div class="flex justify-end gap-2 pt-4">
          <Button variant="outline" @click="faqToDelete = null">Cancel</Button>
          <Button variant="destructive" :disabled="deleting" @click="doDelete">Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'
import { Badge } from '@/shared/components/shadcn/badge'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/components/shadcn/dialog'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const adminApi = useAdminApi()
const faqs = ref([])
const loading = ref(true)
const deleting = ref(null)
const faqToDelete = ref(null)

async function fetchFaqs() {
  loading.value = true
  try {
    const res = await adminApi.getFaqs()
    faqs.value = res?.data ?? []
  } catch (e) {
    toast.error(e?.message ?? 'Failed to load FAQs')
    faqs.value = []
  } finally {
    loading.value = false
  }
}

function confirmDelete(faq) {
  faqToDelete.value = faq
}

async function doDelete() {
  if (!faqToDelete.value) return
  deleting.value = faqToDelete.value.uuid
  try {
    await adminApi.deleteFaq(faqToDelete.value.uuid)
    toast.success('FAQ deleted')
    faqToDelete.value = null
    await fetchFaqs()
  } catch (e) {
    toast.error(e?.message ?? 'Failed to delete')
  } finally {
    deleting.value = null
  }
}

onMounted(() => {
  fetchFaqs()
})
</script>
