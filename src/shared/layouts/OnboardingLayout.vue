<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <RouterLink to="/" class="flex items-center text-gray-900 dark:text-gray-100 hover:opacity-70 transition-opacity">
            <MazelootLogo :show-text="true" size="sm" />
          </RouterLink>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div class="max-w-4xl mx-auto">
          <slot />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-8 mt-auto">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div>© MazeLoot {{ new Date().getFullYear() }}</div>
          <div class="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <Mail class="w-4 h-4 shrink-0" />
            <a
              href="mailto:help@mazeloot.com"
              class="hover:text-gray-900 dark:hover:text-white transition-colors break-all sm:break-normal"
            >
              help@mazeloot.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { Mail } from 'lucide-vue-next'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
</script>
