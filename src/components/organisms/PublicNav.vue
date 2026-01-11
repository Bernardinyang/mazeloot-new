<template>
  <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
    <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <RouterLink to="/" class="flex items-center gap-2">
          <span class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Mazeloot
          </span>
        </RouterLink>
        
        <div class="hidden md:flex items-center gap-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            :class="{ 'text-gray-900 dark:text-gray-100 font-semibold': isActive(link.path) }"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <div class="flex items-center gap-4">
          <Button variant="ghost" size="sm" @click="router.push({ name: 'login' })">
            Log In
          </Button>
          <Button size="sm" @click="router.push({ name: 'register' })">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/shadcn/button'

const route = useRoute()
const router = useRouter()

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/contact', label: 'Contact Us' },
  { path: '/waitlist', label: 'Waitlist' },
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>
