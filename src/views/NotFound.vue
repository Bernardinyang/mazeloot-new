<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center space-y-4">
      <h1 class="text-6xl font-bold">404</h1>
      <h2 class="text-2xl font-semibold">Page Not Found</h2>
      <p class="text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Button @click="goHome">
        Go Home
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/shadcn/button'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'home' })
}
</script>

