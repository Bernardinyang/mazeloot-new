<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
      <header class="space-y-3">
        <nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <RouterLink :to="{ name: 'admin-pricing' }" :class="['hover:underline', theme.textSecondary]">
            Memora Pricing
          </RouterLink>
          <span :class="theme.textTertiary" aria-hidden>/</span>
          <span :class="theme.textPrimary">Add tier</span>
        </nav>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 :class="['text-2xl sm:text-3xl font-semibold tracking-tight', theme.textPrimary]">
            Add fixed tier
          </h1>
          <Button variant="outline" size="sm" class="shrink-0 w-fit" @click="router.push({ name: 'admin-pricing' })">
            Back to list
          </Button>
        </div>
      </header>

      <section class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div class="border-b border-border bg-muted/30 dark:bg-muted/10 px-5 py-4">
          <h2 :class="['text-base font-semibold', theme.textPrimary]">New tier</h2>
          <p class="text-xs text-muted-foreground mt-1">Slug is used in the API and cannot be changed later. Use lowercase letters, numbers, hyphens, and underscores.</p>
        </div>
        <form class="p-5 sm:p-6 space-y-4" @submit.prevent="submit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="tier-slug">Slug (required)</Label>
              <Input
                id="tier-slug"
                v-model="form.slug"
                class="w-full font-mono"
                placeholder="e.g. pro, starter"
                :disabled="saving"
              />
              <p v-if="slugError" class="text-xs text-destructive">{{ slugError }}</p>
            </div>
            <div class="space-y-2">
              <Label for="tier-name">Name (optional)</Label>
              <Input
                id="tier-name"
                v-model="form.name"
                class="w-full"
                placeholder="e.g. Pro"
                :disabled="saving"
              />
              <p class="text-xs text-muted-foreground">Display name. Defaults to slug if empty.</p>
            </div>
          </div>
          <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button type="button" variant="outline" class="w-full sm:w-auto" @click="router.push({ name: 'admin-pricing' })">
              Cancel
            </Button>
            <Button type="submit" :disabled="saving || !slugTrim">
              <span v-if="saving" class="inline-flex items-center gap-2">
                <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                Creating…
              </span>
              <span v-else>Create tier</span>
            </Button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import Button from '@/shared/components/shadcn/button/Button.vue'
import { Input } from '@/shared/components/shadcn/input'
import Label from '@/shared/components/shadcn/Label.vue'

const theme = useThemeClasses()
const router = useRouter()
const adminApi = useAdminApi()

const form = ref({ slug: '', name: '' })
const saving = ref(false)
const slugError = ref('')

const slugTrim = computed(() => (form.value.slug || '').trim())

const slugValid = computed(() => /^[a-z0-9_-]+$/.test(slugTrim.value))

async function submit() {
  const slug = slugTrim.value
  if (!slug) {
    slugError.value = 'Slug is required.'
    return
  }
  if (!slugValid.value) {
    slugError.value = 'Use only lowercase letters, numbers, hyphens, and underscores.'
    return
  }
  slugError.value = ''
  saving.value = true
  try {
    await adminApi.createPricingTier({
      slug,
      name: (form.value.name || '').trim() || undefined,
    })
    router.push({ name: 'admin-pricing-tier-edit', params: { slug } })
  } catch (e) {
    const msg = e?.response?.data?.message || e?.message || 'Failed to create tier.'
    slugError.value = typeof msg === 'string' ? msg : (msg?.errors?.slug?.[0] || 'Slug may already exist.')
  } finally {
    saving.value = false
  }
}
</script>
