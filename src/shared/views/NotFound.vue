<template>
  <div class="min-h-screen bg-gradient-to-br dark:from-[#0f0f23] dark:via-indigo-950/50 dark:to-[#0f0f23] light:from-gray-50 light:via-white light:to-gray-100 dark:text-gray-100 light:text-gray-900">
    <PublicNav />
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/15 blur-[100px]" aria-hidden="true" />
      <div class="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[80px]" aria-hidden="true" />
      
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 dark:text-indigo-300 light:text-indigo-600 text-sm font-medium mb-8 backdrop-blur-sm">
            <span>Page Not Found</span>
          </div>
          <h1 class="text-7xl sm:text-8xl md:text-9xl font-bold mb-6 dark:bg-gradient-to-r dark:from-white dark:via-indigo-200 dark:to-violet-200 light:bg-gradient-to-r light:from-gray-900 light:via-indigo-600 light:to-violet-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 dark:text-white light:text-gray-900">
            Oops! This page got lost
          </h2>
          <p class="text-lg sm:text-xl dark:text-gray-300 light:text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>
      </div>
    </section>

    <!-- Navigation Section -->
    <section class="relative pb-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <RouterLink
              :to="{ name: 'home' }"
              class="group relative p-6 sm:p-8 rounded-xl dark:bg-white/5 light:bg-white dark:backdrop-blur-sm light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Home class="h-6 w-6 text-indigo-300" />
              </div>
              <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-2">Go Home</h3>
              <p class="text-sm dark:text-gray-400 light:text-gray-600 leading-relaxed">Return to the homepage and start fresh</p>
              <span class="absolute top-6 right-6 dark:text-gray-400 light:text-gray-500 group-hover:text-indigo-400 transition-colors" aria-hidden="true">&rarr;</span>
            </RouterLink>

            <RouterLink
              :to="{ name: 'faq' }"
              class="group relative p-6 sm:p-8 rounded-xl dark:bg-white/5 light:bg-white dark:backdrop-blur-sm light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <HelpCircle class="h-6 w-6 text-indigo-300" />
              </div>
              <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-2">FAQ</h3>
              <p class="text-sm dark:text-gray-400 light:text-gray-600 leading-relaxed">Find answers to commonly asked questions</p>
              <span class="absolute top-6 right-6 dark:text-gray-400 light:text-gray-500 group-hover:text-indigo-400 transition-colors" aria-hidden="true">&rarr;</span>
            </RouterLink>

            <RouterLink
              :to="{ name: 'memora' }"
              class="group relative p-6 sm:p-8 rounded-xl dark:bg-white/5 light:bg-white dark:backdrop-blur-sm light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles class="h-6 w-6 text-indigo-300" />
              </div>
              <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-2">Learn About Memora</h3>
              <p class="text-sm dark:text-gray-400 light:text-gray-600 leading-relaxed">See how we help creatives deliver better</p>
              <span class="absolute top-6 right-6 dark:text-gray-400 light:text-gray-500 group-hover:text-indigo-400 transition-colors" aria-hidden="true">&rarr;</span>
            </RouterLink>

            <RouterLink
              :to="{ name: 'contact' }"
              class="group relative p-6 sm:p-8 rounded-xl dark:bg-white/5 light:bg-white dark:backdrop-blur-sm light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
            >
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail class="h-6 w-6 text-indigo-300" />
              </div>
              <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-2">Get Support</h3>
              <p class="text-sm dark:text-gray-400 light:text-gray-600 leading-relaxed">Contact us if you need help finding something</p>
              <span class="absolute top-6 right-6 dark:text-gray-400 light:text-gray-500 group-hover:text-indigo-400 transition-colors" aria-hidden="true">&rarr;</span>
            </RouterLink>
          </div>

          <div class="mt-10 text-center">
            <RouterLink
              :to="{ name: 'home' }"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-500/40 hover:-translate-y-0.5 border-0 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white"
            >
              <Home class="h-5 w-5" />
              Back to Home
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t dark:border-white/10 light:border-gray-200 dark:bg-[#0f0f23]/50 light:bg-gray-50/80 dark:backdrop-blur-sm light:backdrop-blur-sm py-12 mt-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm dark:text-gray-400 light:text-gray-600">
        © {{ new Date().getFullYear() }} Mazeloot Inc. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { RouterLink } from 'vue-router'
import { Home, HelpCircle, Sparkles, Mail } from '@/shared/utils/lucideAnimated'
</script>
