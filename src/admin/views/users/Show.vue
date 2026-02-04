<template>
  <div :class="['min-h-full w-full', theme.transitionColors, 'relative z-0']">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <RouterLink
            :to="{ name: 'admin-users' }"
            :class="['text-sm mb-2 inline-block', theme.textLink]"
          >
            ← Users
          </RouterLink>
          <h1 :class="['text-2xl font-semibold tracking-tight', theme.textPrimary]">User details</h1>
          <p v-if="user" :class="['mt-1 text-sm', theme.textSecondary]">{{ user.email }}</p>
        </div>
        <Button variant="outline" size="sm" class="shrink-0" @click="$router.push({ name: 'admin-users' })">
          Back to list
        </Button>
      </header>

      <div v-if="loading" :class="['rounded-xl border border-border bg-card overflow-hidden p-6', theme.bgCard]">
        <div class="flex flex-col items-center gap-4 mb-6">
          <span class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
          <p :class="['text-sm', theme.textSecondary]">Loading user…</p>
        </div>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="i in 6" :key="i" class="space-y-2">
            <div :class="['h-4 w-24 rounded animate-pulse', theme.bgSkeleton]" />
            <div :class="['h-5 w-full max-w-[200px] rounded animate-pulse', theme.bgSkeleton]" :style="{ animationDelay: `${i * 50}ms` }" />
          </div>
        </dl>
      </div>

      <div v-else-if="user" :class="['rounded-xl border border-border bg-card p-6 shadow-sm']">
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Email</dt>
            <dd :class="['text-sm font-medium', theme.textPrimary]">{{ user.email }}</dd>
          </div>
          <div class="space-y-1">
            <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Name</dt>
            <dd :class="['text-sm font-medium', theme.textPrimary]">{{ user.first_name }} {{ user.last_name }}</dd>
          </div>
          <div class="space-y-1">
            <dt :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">Role</dt>
            <dd>
              <Badge :variant="user.role === 'admin' || user.role === 'super_admin' ? 'default' : 'secondary'">
                {{ user.role }}
              </Badge>
            </dd>
          </div>
        </dl>
      </div>

      <div v-else :class="['rounded-xl border border-border bg-card p-8 text-center']">
        <p :class="['text-sm', theme.textSecondary]">User not found.</p>
        <Button variant="outline" class="mt-4" @click="$router.push({ name: 'admin-users' })">
          Back to users
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminApi } from '@/admin/api/admin'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { Button } from '@/shared/components/shadcn/button'
import { Badge } from '@/shared/components/shadcn/badge'
import { RouterLink } from 'vue-router'

const theme = useThemeClasses()
const route = useRoute()
const adminApi = useAdminApi()
const user = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await adminApi.getUser(route.params.uuid)
    user.value = response
  } catch (error) {
    console.error('Failed to load user:', error)
  } finally {
    loading.value = false
  }
})
</script>
