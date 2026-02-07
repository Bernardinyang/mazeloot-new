<template>
  <div class="min-h-screen bg-gradient-to-br dark:from-[#0f0f23] dark:via-primary-950/50 dark:to-[#0f0f23] light:from-gray-50 light:via-white light:to-gray-100 dark:text-gray-100 light:text-gray-900">
    <PublicNav />
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-indigo-500/15 blur-[100px] -z-10" aria-hidden="true" />
      <div class="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[80px] -z-10" aria-hidden="true" />
      
      <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-600/50 dark:text-indigo-300 light:text-indigo-600 text-sm font-medium mb-6 dark:backdrop-blur-sm light:backdrop-blur-sm">
            <Shield class="h-4 w-4" />
            <span>Privacy Policy</span>
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 dark:bg-gradient-to-r dark:from-white dark:via-indigo-200 dark:to-violet-200 light:bg-gradient-to-r light:from-gray-900 light:via-indigo-600 light:to-violet-600 bg-clip-text text-transparent">
            Your privacy matters
          </h1>
          <p class="text-lg sm:text-xl dark:text-gray-300 light:text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            We're committed to protecting your data and being transparent about how we use it.
          </p>
          <p class="text-sm dark:text-gray-400 light:text-gray-500">
            Last updated: {{ lastUpdated }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="relative pb-20">
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-12">
            
            <!-- Table of Contents -->
            <aside class="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto order-2 lg:order-1 z-20">
              <div class="rounded-xl sm:rounded-2xl dark:bg-white/5 light:bg-white dark:backdrop-blur-xl light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 p-4 sm:p-6 dark:shadow-2xl light:shadow-xl light:ring-1 light:ring-gray-200/50">
                <button
                  type="button"
                  class="w-full lg:hidden flex items-center justify-between text-sm font-semibold uppercase tracking-wider dark:text-gray-300 light:text-gray-700 mb-4 pb-3 border-b dark:border-white/10 light:border-gray-200"
                  @click="tocOpen = !tocOpen"
                >
                  <span>Table of Contents</span>
                  <ChevronDown class="h-4 w-4 transition-transform" :class="tocOpen ? 'rotate-180' : ''" />
                </button>
                <h3 class="hidden lg:block text-sm font-semibold uppercase tracking-wider dark:text-gray-400 light:text-gray-500 mb-4">Table of Contents</h3>
                <nav class="space-y-1.5 sm:space-y-2" :class="tocOpen || !isMobile ? 'block' : 'hidden lg:block'">
                  <a
                    v-for="(item, index) in toc"
                    :key="index"
                    :href="`#${item.id}`"
                    :class="[
                      'block text-xs sm:text-sm transition-all duration-300 py-1.5 px-2 sm:px-3 rounded-lg relative',
                      activeSection === item.id
                        ? 'dark:text-indigo-300 light:text-indigo-600 dark:bg-indigo-500/20 light:bg-indigo-500/10 border dark:border-indigo-500/40 light:border-indigo-600/60 font-semibold shadow-md dark:shadow-indigo-500/20'
                        : 'dark:text-gray-300 light:text-gray-600 hover:dark:text-indigo-300 hover:light:text-indigo-600 hover:dark:bg-white/5 hover:light:bg-gray-50 border border-transparent'
                    ]"
                    @click.prevent="scrollToSection(item.id)"
                  >
                    {{ item.title }}
                  </a>
                </nav>
              </div>
            </aside>

            <!-- Main Content -->
            <div class="space-y-6 sm:space-y-8 order-1 lg:order-2 relative z-10">
              <div
                v-for="(section, index) in sections"
                :key="index"
                :id="section.id"
                class="scroll-mt-20 sm:scroll-mt-24 relative"
              >
                <div class="relative rounded-xl sm:rounded-2xl dark:bg-white/5 light:bg-white dark:backdrop-blur-xl light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 p-5 sm:p-8 lg:p-10 dark:shadow-2xl light:shadow-xl light:ring-1 light:ring-gray-200/50 transition-all duration-300 hover:dark:shadow-primary-500/10 hover:light:shadow-gray-300/50">
                  <div class="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl dark:bg-indigo-500/20 light:bg-indigo-500/10 dark:border-indigo-500/30 light:border-indigo-600/50 border flex items-center justify-center">
                      <component :is="section.icon" class="h-5 w-5 sm:h-6 sm:w-6 dark:text-indigo-300 light:text-indigo-600" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold dark:text-white light:text-gray-900 mb-1 sm:mb-2">{{ section.title }}</h2>
                      <div v-if="section.subtitle" class="text-xs sm:text-sm dark:text-gray-400 light:text-gray-500">{{ section.subtitle }}</div>
                    </div>
                  </div>
                  
                  <div class="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert light:prose-slate max-w-none mt-4 sm:mt-6">
                    <div v-html="section.content"></div>
                  </div>
                </div>
              </div>

              <!-- Contact CTA -->
              <div class="rounded-xl sm:rounded-2xl dark:bg-gradient-to-br dark:from-indigo-500/10 dark:to-violet-500/10 light:from-indigo-50 light:to-violet-50 dark:border-indigo-500/20 light:border-indigo-200 p-6 sm:p-8 lg:p-10 border">
                <div class="text-center">
                  <h3 class="text-xl sm:text-2xl font-bold dark:text-white light:text-gray-900 mb-2 sm:mb-3">Questions about privacy?</h3>
                  <p class="text-sm sm:text-base dark:text-gray-300 light:text-gray-600 mb-4 sm:mb-6">We're here to help. Reach out if you have any concerns or questions.</p>
                  <RouterLink
                    :to="{ name: 'contact' }"
                    class="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-500/40 hover:-translate-y-0.5 border-0 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white"
                  >
                    <Mail class="h-4 w-4 sm:h-5 sm:w-5" />
                    Contact Us
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t dark:border-white/10 light:border-gray-200 dark:bg-[#0f0f23]/50 light:bg-gray-50/80 dark:backdrop-blur-sm light:backdrop-blur-sm py-12 mt-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p class="dark:text-gray-400 light:text-gray-600">© {{ new Date().getFullYear() }} Mazeloot Inc. All rights reserved.</p>
          <nav class="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Legal">
            <RouterLink :to="{ name: 'privacy' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900">Privacy Policy</RouterLink>
            <span class="dark:text-gray-600 light:text-gray-400" aria-hidden="true">•</span>
            <RouterLink :to="{ name: 'terms' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900">Terms of Service</RouterLink>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Shield, Mail, User, Database, Eye, Share2, Lock, LockKeyhole, Globe, FileText, MessageSquare, ChevronDown } from '@/shared/utils/lucideAnimated'
import { RouterLink } from 'vue-router'
import { useSeoMeta } from '@/shared/composables/useSeoMeta'
import { trackPageView } from '@/shared/composables/useAnalytics'

const BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}`
  : 'https://mazeloot.com'

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const tocOpen = ref(false)
const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 1024
}

const activeSection = ref('')

function scrollToSection(id) {
  isScrolling = true
  activeSection.value = id
  
  const element = document.getElementById(id)
  if (element) {
    const yOffset = -100
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
    
    // Reset scrolling flag after animation completes
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
    scrollTimeout = setTimeout(() => {
      isScrolling = false
      updateActiveSectionFromScroll()
    }, 800)
  } else {
    isScrolling = false
  }
}

let observer = null
let isScrolling = false
let scrollTimeout = null

function updateActiveSectionFromScroll() {
  const scrollY = window.scrollY
  const viewportHeight = window.innerHeight
  const offset = 200

  let currentSection = toc[0]?.id || ''

  // Check each section to find which one is currently in view
  for (let i = toc.length - 1; i >= 0; i--) {
    const item = toc[i]
    const element = document.getElementById(item.id)
    if (!element) continue

    const rect = element.getBoundingClientRect()
    const elementTop = rect.top + scrollY
    const elementBottom = elementTop + rect.height

    // Check if section is in the viewport with offset
    if (scrollY + offset >= elementTop && scrollY + offset < elementBottom) {
      currentSection = item.id
      break
    }
  }

  // Handle edge case: if scrolled to top, select first section
  if (scrollY < 100) {
    currentSection = toc[0]?.id || ''
  }

  // Handle edge case: if scrolled to bottom, select last section
  const documentHeight = document.documentElement.scrollHeight
  if (scrollY + viewportHeight >= documentHeight - 100) {
    currentSection = toc[toc.length - 1]?.id || ''
  }

  if (activeSection.value !== currentSection && currentSection) {
    activeSection.value = currentSection
  }
}

function setupIntersectionObserver() {
  if (observer) {
    observer.disconnect()
  }

  const options = {
    root: null,
    rootMargin: '-180px 0px -60% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
  }

  observer = new IntersectionObserver((entries) => {
    if (isScrolling) return

    // Find the entry with the highest intersection ratio that's intersecting
    let maxRatio = 0
    let maxEntry = null

    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
        maxRatio = entry.intersectionRatio
        maxEntry = entry
      }
    })

    if (maxEntry && activeSection.value !== maxEntry.target.id) {
      activeSection.value = maxEntry.target.id
    }
  }, options)

  // Observe all sections
  toc.forEach(item => {
    const element = document.getElementById(item.id)
    if (element) {
      observer.observe(element)
    }
  })
}

function handleScroll() {
  if (!isScrolling) {
    updateActiveSectionFromScroll()
  }
}

// SEO Meta Tags
useSeoMeta({
  title: 'Privacy Policy - Your Privacy Matters | Mazeloot',
  description: 'We\'re committed to protecting your data and being transparent about how we use it. Read our privacy policy to learn more.',
  image: `${BASE_URL}/og-image.png`,
  url: `${BASE_URL}/privacy`,
})

onMounted(() => {
  trackPageView('/privacy', 'Privacy Policy')
  
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Wait for DOM to be ready
  nextTick(() => {
    // Set initial active section based on scroll position
    updateActiveSectionFromScroll()
    
    if (!activeSection.value && toc.length > 0) {
      activeSection.value = toc[0].id
    }
    
    // Setup intersection observer
    setupIntersectionObserver()
    
    // Add scroll listener as fallback
    window.addEventListener('scroll', handleScroll, { passive: true })
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', handleScroll)
  if (observer) {
    observer.disconnect()
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})

const toc = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'information-collected', title: 'Information We Collect' },
  { id: 'how-we-use', title: 'How We Use Information' },
  { id: 'how-we-share', title: 'How We Share Information' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'your-rights', title: 'Your Rights' },
  { id: 'children-privacy', title: "Children's Privacy" },
  { id: 'international-transfers', title: 'International Transfers' },
  { id: 'changes', title: 'Changes to Policy' },
  { id: 'contact', title: 'Contact Us' },
]

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: FileText,
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-4">
        Mazeloot Inc. ("we," "our," or "us") operates the Mazeloot platform, a media management and collaboration service designed for creative professionals. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service, including our website, applications, and related services (collectively, the "Service").
      </p>
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">
        By using Mazeloot, you agree to the collection and use of information in accordance with this policy. We are committed to protecting your privacy and ensuring transparency about our data practices.
      </p>
    `
  },
  {
    id: 'information-collected',
    title: 'Information We Collect',
    icon: Database,
    content: `
      <div class="space-y-6">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 sm:p-7 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account Information
          </h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-3">When you create an account, we collect:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
            <li>Name, email address, and password</li>
            <li>Business or studio name (optional)</li>
            <li>Phone number (optional)</li>
            <li>Payment and billing information (processed securely through third-party payment processors)</li>
            <li>Profile information and preferences</li>
          </ul>
        </div>

        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Content You Upload
          </h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-3">As part of our Service, you may upload, store, and share:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700 mb-4">
            <li>Photographs, videos, and other media files</li>
            <li>Project information, client details, and workflow data</li>
            <li>Comments, feedback, and communication content</li>
            <li>Custom branding elements (logos, watermarks, presets)</li>
          </ul>
          <div class="dark:bg-indigo-500/10 light:bg-indigo-50 border dark:border-indigo-500/20 light:border-indigo-200 rounded-lg p-4">
            <p class="text-sm dark:text-indigo-300 light:text-indigo-700">
              <strong class="dark:text-white light:text-gray-900">Important:</strong> You retain all ownership rights to your content. We do not claim ownership of your media files or intellectual property.
            </p>
          </div>
        </div>

        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Client and Guest Information
          </h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-3">When you invite clients or guests to view galleries, we may collect:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
            <li>Email addresses for gallery access</li>
            <li>Client selections, comments, and feedback</li>
            <li>Download activity and preferences</li>
            <li>IP addresses and device information for security purposes</li>
          </ul>
        </div>

        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Usage and Technical Information
          </h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-3">We automatically collect certain information when you use our Service:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
            <li>Device information (type, operating system, browser)</li>
            <li>IP address and approximate location</li>
            <li>Usage patterns, feature interactions, and performance data</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Error logs and diagnostic information</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    icon: Eye,
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Provide and improve our Service</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Deliver galleries, proofing workflows, collections, and related features</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Process transactions</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Handle subscriptions, payments, and billing</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Communicate with you</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Send service updates, support responses, and important notices</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Ensure security</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Detect and prevent fraud, abuse, and unauthorized access</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Analytics and optimization</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Understand usage patterns to improve features and performance</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Legal compliance</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Meet legal obligations and enforce our Terms of Service</p>
        </div>
      </div>
    `
  },
  {
    id: 'how-we-share',
    title: 'How We Share Your Information',
    icon: Share2,
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-6">
        We do not sell your personal information. We may share information only in the following circumstances:
      </p>
      <div class="space-y-4 sm:space-y-5">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">With Your Consent</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">When you explicitly authorize sharing, such as when you share a gallery link with clients or enable third-party integrations.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Service Providers</h3>
          <p class="dark:text-gray-300 light:text-gray-700 mb-4 leading-relaxed">We work with trusted third-party service providers who assist in:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
            <li>Cloud storage and hosting (AWS, Cloudflare R2, Cloudinary)</li>
            <li>Payment processing (Stripe, PayPal, Paystack, Flutterwave)</li>
            <li>Email delivery and notifications</li>
            <li>Analytics and monitoring services</li>
          </ul>
          <p class="dark:text-gray-300 light:text-gray-700 mt-4">These providers are contractually obligated to protect your information and use it only for specified purposes.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Legal Requirements</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">We may disclose information if required by law, court order, or government request, or to protect our rights, property, or safety, or that of our users.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Business Transfers</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to the same privacy protections.</p>
        </div>
      </div>
    `
  },
  {
    id: 'data-security',
    title: 'Data Security',
    icon: Lock,
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-6">We implement industry-standard security measures to protect your information:</p>
      <div class="grid sm:grid-cols-2 gap-4 mb-6">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Encryption</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">TLS/SSL in transit and encryption at rest</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Access Controls</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Secure authentication and limited access</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Security Audits</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Regular assessments and vulnerability testing</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Backups</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Secure cloud infrastructure with redundancy</p>
        </div>
      </div>
      <div class="dark:bg-amber-500/10 light:bg-amber-50 border dark:border-amber-500/20 light:border-amber-200 rounded-lg p-4">
        <p class="text-sm dark:text-amber-300 light:text-amber-700">
          <strong class="dark:text-white light:text-gray-900">Note:</strong> No method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
        </p>
      </div>
    `
  },
  {
    id: 'your-rights',
    title: 'Your Rights and Choices',
    icon: LockKeyhole,
    content: `
      <div class="space-y-6">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 sm:p-7 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Access and Correction</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">You can access, update, or correct your account information at any time through your account settings.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Data Portability</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">You can download your content and data at any time. We provide tools to export your projects, galleries, and media files.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Deletion</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">You can delete your account and content at any time. Deleted data is permanently removed from our systems within 30 days, except where we are required to retain it for legal purposes.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Marketing Communications</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">You can opt out of marketing emails by clicking the unsubscribe link in any email or adjusting your notification preferences in your account settings.</p>
        </div>
        <div class="dark:bg-indigo-500/10 light:bg-indigo-50 rounded-xl p-6 border dark:border-indigo-500/20 light:border-indigo-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">GDPR and CCPA Rights</h3>
          <p class="dark:text-gray-300 light:text-gray-700 mb-4 leading-relaxed">If you are located in the European Economic Area (EEA) or California, you have additional rights:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to opt out of sale of personal information (we do not sell personal information)</li>
          </ul>
          <p class="dark:text-gray-300 light:text-gray-700 mt-4">
            To exercise these rights, please contact us at <a href="mailto:privacy@mazeloot.com" class="text-indigo-400 hover:text-indigo-300 underline">privacy@mazeloot.com</a>.
          </p>
        </div>
      </div>
    `
  },
  {
    id: 'children-privacy',
    title: "Children's Privacy",
    icon: Shield,
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">
        Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.
      </p>
    `
  },
  {
    id: 'international-transfers',
    title: 'International Data Transfers',
    icon: Globe,
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">
        Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
      </p>
    `
  },
  {
    id: 'changes',
    title: 'Changes to This Privacy Policy',
    icon: FileText,
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-4">
        We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
      </p>
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">
        Your continued use of the Service after changes become effective constitutes acceptance of the updated Privacy Policy.
      </p>
    `
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: Mail,
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-6">
        If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
      </p>
      <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
        <p class="dark:text-white light:text-gray-900 font-semibold mb-2">Mazeloot Inc.</p>
        <p class="dark:text-gray-300 light:text-gray-700 mb-1">Email: <a href="mailto:privacy@mazeloot.com" class="text-indigo-400 hover:text-indigo-300 underline">privacy@mazeloot.com</a></p>
        <p class="dark:text-gray-300 light:text-gray-700">Website: <RouterLink :to="{ name: 'contact' }" class="text-indigo-400 hover:text-indigo-300 underline">Contact Us</RouterLink></p>
      </div>
    `
  }
]
</script>
