<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-2xl">
      <header class="mb-6">
        <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">
          {{ isEdit ? 'Edit FAQ' : 'New FAQ' }}
        </h1>
        <p :class="['mt-1 text-sm', theme.textSecondary]">
          {{ isEdit ? 'Update question and answer.' : 'Add a question and answer for the public FAQ page.' }}
        </p>
      </header>

      <form class="space-y-6 rounded-xl border border-border bg-card p-6" @submit.prevent="submit">
        <div class="space-y-2">
          <label for="question" :class="['text-sm font-medium', theme.textPrimary]">Question</label>
          <textarea
            id="question"
            v-model="form.question"
            rows="2"
            required
            :class="['w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', theme.textPrimary]"
            placeholder="e.g. How does the four-phase workflow work?"
          />
        </div>
        <div class="space-y-2">
          <label for="answer" :class="['text-sm font-medium', theme.textPrimary]">Answer</label>
          <textarea
            id="answer"
            v-model="form.answer"
            rows="5"
            required
            :class="['w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', theme.textPrimary]"
            placeholder="Full answer text…"
          />
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.is_published" type="checkbox" class="rounded border-input" />
            <span :class="['text-sm', theme.textPrimary]">Published (show on public FAQ)</span>
          </label>
          <div class="flex items-center gap-2">
            <label :class="['text-sm', theme.textSecondary]">Sort order</label>
            <input
              v-model.number="form.sort_order"
              type="number"
              min="0"
              :class="['w-20 rounded-lg border border-input bg-background px-2 py-1.5 text-sm', theme.textPrimary]"
            />
          </div>
        </div>
        <div class="flex gap-2 pt-2">
          <Button type="submit" :disabled="saving">
            {{ saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Create FAQ') }}
          </Button>
          <Button type="button" variant="outline" @click="$router.push({ name: 'admin-faq' })">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'
import { toast } from '@/shared/utils/toast'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const adminApi = useAdminApi()

const uuid = computed(() => route.params.uuid)
const isEdit = computed(() => !!uuid.value)

const form = reactive({
  question: '',
  answer: '',
  sort_order: 0,
  is_published: true,
})
const saving = ref(false)

async function loadFaq() {
  if (!uuid.value) return
  try {
    const res = await adminApi.getFaq(uuid.value)
    const d = res?.data ?? res
    if (d) {
      form.question = d.question ?? ''
      form.answer = d.answer ?? ''
      form.sort_order = d.sort_order ?? 0
      form.is_published = d.is_published ?? true
    }
  } catch (e) {
    toast.error(e?.message ?? 'Failed to load FAQ')
    router.push({ name: 'admin-faq' })
  }
}

async function submit() {
  saving.value = true
  try {
    if (isEdit.value) {
      await adminApi.updateFaq(uuid.value, form)
      toast.success('FAQ updated')
    } else {
      await adminApi.createFaq(form)
      toast.success('FAQ created')
    }
    router.push({ name: 'admin-faq' })
  } catch (e) {
    toast.error(e?.message ?? 'Failed to save')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (isEdit.value) loadFaq()
})
</script>
