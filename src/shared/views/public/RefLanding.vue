<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <p class="text-sm text-gray-500 dark:text-gray-400">Redirecting…</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setReferralCode } from '@/shared/utils/referralCookie'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const code = route.params.code
  if (code) {
    setReferralCode(code)
  }
  router.replace({ name: 'register', query: route.query })
})
</script>
