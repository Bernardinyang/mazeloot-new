<template>
  <header class="sticky top-0 z-50 border-b dark:border-white/10 light:border-gray-200 bg-gradient-to-br dark:from-[#0f0f23]/95 dark:via-indigo-950/95 dark:to-[#0f0f23]/95 light:from-white/95 light:via-gray-50/95 light:to-white/95 backdrop-blur-xl shadow-lg dark:shadow-black/5 light:shadow-gray-200/50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-4">
        <RouterLink
          to="/"
          class="flex shrink-0 items-center gap-2 rounded-lg py-2 -my-2 px-2 outline-none transition-all duration-200 dark:hover:bg-white/5 light:hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white"
          @click="handleHomeClick"
        >
          <MazelootLogo size="sm" />
        </RouterLink>

        <nav class="hidden md:flex md:items-center md:gap-1" aria-label="Main">
          <RouterLink
            v-for="link in pageLinks"
            :key="'page-' + link.path"
            :to="link.path"
            class="relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white"
            :class="isActive(link.path)
              ? 'dark:text-white dark:bg-white/10 light:text-gray-900 light:bg-gray-100'
              : 'dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5 light:text-gray-600 light:hover:text-gray-900 light:hover:bg-gray-50'"
            @click="link.path === '/' ? handleHomeClick($event) : null"
          >
            <span class="relative z-10">{{ link.label }}</span>
            <span
              v-if="isActive(link.path)"
              class="absolute inset-0 rounded-lg bg-gradient-to-r dark:from-indigo-500/20 dark:to-violet-500/20 light:from-indigo-500/10 light:to-violet-500/10"
            />
          </RouterLink>
          <a
            v-for="link in scrollLinks"
            :key="'scroll-' + link.id"
            href="#"
            class="rounded-lg px-4 py-2 text-sm font-medium dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5 light:text-gray-600 light:hover:text-gray-900 light:hover:bg-gray-50 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white"
            @click.prevent="goToSection(link.id)"
          >
            {{ link.label }}
          </a>
        </nav>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-lg dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white light:text-gray-600 light:hover:bg-gray-100 light:hover:text-gray-900 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white"
            aria-label="Toggle theme"
            @click="themeStore.toggleTheme()"
          >
            <Sun v-if="themeStore.effectiveTheme === 'dark'" class="size-5" />
            <Moon v-else class="size-5" />
          </button>
          <Button
            variant="ghost"
            size="sm"
            class="hidden sm:inline-flex dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5 light:text-gray-600 light:hover:text-gray-900 light:hover:bg-gray-100 border-0"
            @click="router.push({ name: 'login' })"
          >
            Log in
          </Button>
          <Button
            size="sm"
            class="hidden md:inline-flex rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-500/40 hover:-translate-y-0.5 border-0 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white"
            @click="router.push({ name: 'register' })"
          >
            Get started
          </Button>
          <button
            type="button"
            class="flex size-10 items-center justify-center rounded-lg dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white light:text-gray-600 light:hover:bg-gray-100 light:hover:text-gray-900 transition-all duration-200 md:hidden outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white"
            aria-label="Open menu"
            :aria-expanded="mobileOpen"
            @click="mobileOpen = true"
          >
            <Menu class="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="mobileOpen"
        class="fixed inset-0 z-40 dark:bg-black/80 light:bg-black/50 backdrop-blur-sm md:hidden"
        aria-hidden="true"
        @click="mobileOpen = false"
      />
    </Transition>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div
        v-show="mobileOpen"
        class="fixed left-0 right-0 top-0 z-50 mx-4 mt-4 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl dark:border-white/30 light:border-gray-300 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-[#0f0f23] light:bg-white backdrop-blur-xl shadow-2xl md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div class="flex items-center justify-between dark:border-white/30 light:border-gray-300 border-b px-4 py-4">
          <span class="text-sm font-semibold dark:text-white light:text-gray-900">Menu</span>
          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-lg dark:text-gray-200 dark:hover:bg-white/15 dark:hover:text-white light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Close menu"
            @click="mobileOpen = false"
          >
            <X class="size-5" aria-hidden="true" />
          </button>
        </div>
        <nav class="flex flex-col p-2" aria-label="Mobile">
          <RouterLink
            v-for="link in pageLinks"
            :key="'m-page-' + link.path"
            :to="link.path"
            class="relative rounded-lg px-4 py-3 text-base font-medium transition-all duration-200"
            :class="isActive(link.path)
              ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 dark:text-white light:text-gray-900'
              : 'dark:text-gray-100 dark:hover:text-white dark:hover:bg-white/15 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-gray-100'"
            @click="(e) => { mobileOpen = false; if (link.path === '/') handleHomeClick(e) }"
          >
            {{ link.label }}
          </RouterLink>
          <a
            v-for="link in scrollLinks"
            :key="'m-scroll-' + link.id"
            href="#"
            class="rounded-lg px-4 py-3 text-base font-medium dark:text-gray-100 dark:hover:text-white dark:hover:bg-white/15 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-gray-100 transition-all duration-200"
            @click.prevent="goToSection(link.id); mobileOpen = false"
          >
            {{ link.label }}
          </a>
          <div class="my-2 dark:border-white/30 light:border-gray-300 border-t pt-2 space-y-2">
            <button
              type="button"
              class="w-full rounded-lg px-4 py-3 text-left text-base font-medium dark:text-gray-100 dark:hover:text-white dark:hover:bg-white/15 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-gray-100 transition-all duration-200"
              @click="router.push({ name: 'login' }); mobileOpen = false"
            >
              Log in
            </button>
            <button
              type="button"
              class="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-500/40 border-0"
              @click="router.push({ name: 'register' }); mobileOpen = false"
            >
              Get started
            </button>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Button } from '@/shared/components/shadcn/button'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import { Menu, X, Sun, Moon } from '@/shared/utils/lucideAnimated'
import { useThemeStore } from '@/shared/stores/theme'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const mobileOpen = ref(false)

const pageLinks = [
  { type: 'page', path: '/', label: 'Home' },
  { type: 'page', path: '/faq', label: 'FAQ' },
  { type: 'page', path: '/contact', label: 'Contact Us' },
]
const scrollLinks = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'testimonials', label: 'Testimonials' },
]

watch(() => route.path, () => { mobileOpen.value = false })

function onEscape(e) {
  if (e.key === 'Escape') mobileOpen.value = false
}
watch(mobileOpen, (open) => {
  if (open) document.addEventListener('keydown', onEscape)
  else document.removeEventListener('keydown', onEscape)
})
onUnmounted(() => document.removeEventListener('keydown', onEscape))

function handleHomeClick(e) {
  if (route.path === '/') {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function goToSection(id) {
  if (route.path === '/') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    router.push({ path: '/', hash: '#' + id })
  }
}

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
