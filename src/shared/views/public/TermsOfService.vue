<template>
  <div class="min-h-screen bg-gradient-to-br dark:from-[#0f0f23] dark:via-primary-950/50 dark:to-[#0f0f23] light:from-gray-50 light:via-white light:to-gray-100 dark:text-gray-100 light:text-gray-900">
    <PublicNav />
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-emerald-500/15 blur-[100px] -z-10" aria-hidden="true" />
      <div class="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[80px] -z-10" aria-hidden="true" />
      
      <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-600/50 dark:text-emerald-300 light:text-emerald-600 text-sm font-medium mb-6 dark:backdrop-blur-sm light:backdrop-blur-sm">
            <FileText class="h-4 w-4" />
            <span>Terms of Service</span>
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 dark:bg-gradient-to-r dark:from-white dark:via-emerald-200 dark:to-teal-200 light:bg-gradient-to-r light:from-gray-900 light:via-emerald-600 light:to-teal-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p class="text-lg sm:text-xl dark:text-gray-300 light:text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our service.
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
                        ? 'dark:text-emerald-300 light:text-emerald-600 dark:bg-emerald-500/20 light:bg-emerald-500/10 border dark:border-emerald-500/40 light:border-emerald-600/60 font-semibold shadow-md dark:shadow-emerald-500/20'
                        : 'dark:text-gray-300 light:text-gray-600 hover:dark:text-emerald-300 hover:light:text-emerald-600 hover:dark:bg-white/5 hover:light:bg-gray-50 border border-transparent'
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
                <div class="relative rounded-xl sm:rounded-2xl dark:bg-white/5 light:bg-white dark:backdrop-blur-xl light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 p-5 sm:p-8 lg:p-10 dark:shadow-2xl light:shadow-xl light:ring-1 light:ring-gray-200/50 transition-all duration-300 hover:dark:shadow-emerald-500/10 hover:light:shadow-gray-300/50">
                  <div class="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl dark:bg-emerald-500/20 light:bg-emerald-500/10 dark:border-emerald-500/30 light:border-emerald-600/50 border flex items-center justify-center">
                      <span class="text-base sm:text-lg font-bold dark:text-emerald-300 light:text-emerald-600">{{ index + 1 }}</span>
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
              <div class="rounded-xl sm:rounded-2xl dark:bg-gradient-to-br dark:from-emerald-500/10 dark:to-teal-500/10 light:from-emerald-50 light:to-teal-50 dark:border-emerald-500/20 light:border-emerald-200 p-6 sm:p-8 lg:p-10 border">
                <div class="text-center">
                  <h3 class="text-xl sm:text-2xl font-bold dark:text-white light:text-gray-900 mb-2 sm:mb-3">Questions about our terms?</h3>
                  <p class="text-sm sm:text-base dark:text-gray-300 light:text-gray-600 mb-4 sm:mb-6">We're here to help clarify anything. Reach out if you have questions.</p>
                  <RouterLink
                    :to="{ name: 'contact' }"
                    class="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-400 hover:to-teal-400 hover:shadow-emerald-500/40 hover:-translate-y-0.5 border-0 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white"
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
import { FileText, Mail, User, Shield, CreditCard, XCircle, ChevronDown } from '@/shared/utils/lucideAnimated'
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
  title: 'Terms of Service - Legal Terms | Mazeloot',
  description: 'Please read these terms carefully before using our service. Learn about our terms, conditions, and user agreements.',
  image: `${BASE_URL}/og-image.png`,
  url: `${BASE_URL}/terms`,
})

onMounted(() => {
  trackPageView('/terms', 'Terms of Service')
  
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
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'description', title: 'Description of Service' },
  { id: 'account', title: 'Account Registration' },
  { id: 'content', title: 'Content Ownership' },
  { id: 'acceptable-use', title: 'Acceptable Use' },
  { id: 'subscriptions', title: 'Subscriptions & Payments' },
  { id: 'availability', title: 'Service Availability' },
  { id: 'intellectual-property', title: 'Intellectual Property' },
  { id: 'privacy', title: 'Privacy & Data' },
  { id: 'indemnification', title: 'Indemnification' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'termination', title: 'Termination' },
  { id: 'disputes', title: 'Dispute Resolution' },
  { id: 'changes', title: 'Changes to Terms' },
  { id: 'miscellaneous', title: 'Miscellaneous' },
  { id: 'contact', title: 'Contact' },
]

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-4">
        By accessing or using Mazeloot ("the Service"), operated by Mazeloot Inc. ("we," "our," or "us"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access or use the Service.
      </p>
      <div class="dark:bg-emerald-500/10 light:bg-emerald-50 border dark:border-emerald-500/20 light:border-emerald-200 rounded-lg p-4">
        <p class="text-sm dark:text-emerald-300 light:text-emerald-700">
          <strong class="dark:text-white light:text-gray-900">Important:</strong> These Terms apply to all users of the Service, including creatives, photographers, clients, guests, and visitors. By creating an account, uploading content, or accessing galleries, you acknowledge that you have read, understood, and agree to be bound by these Terms.
        </p>
      </div>
    `
  },
  {
    id: 'description',
    title: 'Description of Service',
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-6">
        Mazeloot is a media management and collaboration platform that enables creative professionals to:
      </p>
      <div class="grid sm:grid-cols-2 gap-4 mb-6">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Create and manage projects</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Organize galleries, collections, and workflows</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Upload and share media</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Photos, videos, and digital content</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Client collaboration</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Selection, proofing, and approval workflows</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Brand protection</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Watermarks and customizable branding</p>
        </div>
      </div>
      <div class="dark:bg-amber-500/10 light:bg-amber-50 border dark:border-amber-500/20 light:border-amber-200 rounded-lg p-4">
        <p class="text-sm dark:text-amber-300 light:text-amber-700">
          <strong class="dark:text-white light:text-gray-900">Note:</strong> We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice.
        </p>
      </div>
    `
  },
  {
    id: 'account',
    title: 'Account Registration and Security',
    content: `
      <div class="space-y-6">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 sm:p-7 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account Creation
          </h3>
          <p class="dark:text-gray-300 light:text-gray-700 mb-4 leading-relaxed">To use certain features of the Service, you must create an account. You agree to:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Account Eligibility</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">You must be at least 18 years old to create an account. By creating an account, you represent and warrant that you are of legal age and have the authority to enter into these Terms.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Account Termination</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or any other reason we deem necessary to protect the Service and its users.</p>
        </div>
      </div>
    `
  },
  {
    id: 'content',
    title: 'Content Ownership and Rights',
    content: `
      <div class="space-y-6">
        <div class="dark:bg-emerald-500/10 light:bg-emerald-50 rounded-xl p-6 border dark:border-emerald-500/20 light:border-emerald-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Your Content</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">
            <strong class="dark:text-white light:text-gray-900">You retain all ownership rights</strong> to the content you upload to Mazeloot, including photographs, videos, media files, and any other materials ("Your Content"). We do not claim ownership of Your Content.
          </p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">License to Use Your Content</h3>
          <p class="dark:text-gray-300 light:text-gray-700 mb-4 leading-relaxed">By uploading Your Content, you grant us a limited, non-exclusive, worldwide, royalty-free license to:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
            <li>Store, host, and display Your Content on the Service</li>
            <li>Process and format Your Content for delivery to your clients</li>
            <li>Apply watermarks and branding as you configure</li>
            <li>Provide technical support and maintenance</li>
            <li>Create backups and ensure data redundancy</li>
          </ul>
          <p class="dark:text-gray-300 light:text-gray-700 mt-4">This license terminates when you delete Your Content or your account, except for content that may remain in backups for a reasonable period.</p>
        </div>
        <div class="dark:bg-red-500/10 light:bg-red-50 rounded-xl p-6 border dark:border-red-500/20 light:border-red-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Prohibited Content</h3>
          <p class="dark:text-gray-300 light:text-gray-700 mb-4 leading-relaxed">You agree not to upload, share, or transmit content that:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
            <li>Violates any law, regulation, or third-party rights</li>
            <li>Is defamatory, harassing, abusive, or harmful</li>
            <li>Contains malware, viruses, or malicious code</li>
            <li>Infringes copyright, trademark, or other intellectual property rights</li>
            <li>Is pornographic, obscene, or contains explicit content without proper consent</li>
            <li>Violates privacy rights or contains personal information without consent</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-6">
        You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
      </p>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <svg class="h-5 w-5 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Use for illegal or unauthorized purposes</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <svg class="h-5 w-5 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Violate applicable laws or regulations</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <svg class="h-5 w-5 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Infringe upon the rights of others</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <svg class="h-5 w-5 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Interfere with or disrupt the Service</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <svg class="h-5 w-5 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Attempt unauthorized access</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <svg class="h-5 w-5 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Use automated systems without permission</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <svg class="h-5 w-5 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Share account credentials</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <svg class="h-5 w-5 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Reverse engineer or decompile</p>
        </div>
      </div>
    `
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions and Payments',
    content: `
      <div class="space-y-6">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 sm:p-7 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Subscription Plans
          </h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">Mazeloot offers various subscription plans with different features and usage limits. Subscription fees are billed in advance on a monthly or annual basis, as selected during signup.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Payment Terms</h3>
          <p class="dark:text-gray-300 light:text-gray-700 mb-4 leading-relaxed">By subscribing, you agree to:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
            <li>Pay all fees associated with your subscription</li>
            <li>Provide accurate billing and payment information</li>
            <li>Authorize us to charge your payment method</li>
            <li>Pay in the currency specified at the time of purchase</li>
          </ul>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Price Changes</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">We reserve the right to modify subscription prices at any time. Price changes will not affect your current billing period but will apply to subsequent renewals. We will notify you of price changes in advance.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Refunds and Cancellation</h3>
          <p class="dark:text-gray-300 light:text-gray-700 mb-4 leading-relaxed">Subscription fees are generally non-refundable. However, we may provide refunds at our discretion for exceptional circumstances or as required by law. Refund requests must be submitted within 14 days of the charge.</p>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of your current billing period.</p>
        </div>
      </div>
    `
  },
  {
    id: 'availability',
    title: 'Service Availability and Modifications',
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-4">
        We strive to maintain high availability of the Service but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, technical issues, or circumstances beyond our control.
      </p>
      <div class="dark:bg-amber-500/10 light:bg-amber-50 border dark:border-amber-500/20 light:border-amber-200 rounded-lg p-4">
        <p class="text-sm dark:text-amber-300 light:text-amber-700">
          <strong class="dark:text-white light:text-gray-900">Note:</strong> We reserve the right to modify, suspend, or discontinue any feature or aspect of the Service at any time, with or without notice. We are not liable for any loss or inconvenience resulting from such modifications or interruptions.
        </p>
      </div>
    `
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: `
      <div class="space-y-6">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 sm:p-7 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Mazeloot's Intellectual Property</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">The Service, including its design, features, functionality, software, and content (excluding Your Content), is owned by Mazeloot Inc. and protected by copyright, trademark, and other intellectual property laws.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Limited License</h3>
          <p class="dark:text-gray-300 light:text-gray-700 mb-4 leading-relaxed">We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for its intended purpose, subject to these Terms. This license does not include the right to:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
            <li>Resell or sublicense the Service</li>
            <li>Copy, modify, or create derivative works</li>
            <li>Reverse engineer or extract source code</li>
            <li>Remove or alter copyright notices</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: 'privacy',
    title: 'Privacy and Data Protection',
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-4">
        Your use of the Service is also governed by our Privacy Policy, which explains how we collect, use, and protect your information. By using the Service, you consent to the collection and use of information as described in the Privacy Policy.
      </p>
      <div class="dark:bg-indigo-500/10 light:bg-indigo-50 border dark:border-indigo-500/20 light:border-indigo-200 rounded-lg p-4">
        <p class="text-sm dark:text-indigo-300 light:text-indigo-700">
          <strong class="dark:text-white light:text-gray-900">Important:</strong> You are responsible for ensuring that you have obtained all necessary consents and permissions from clients and subjects before uploading content that contains personal information or images of individuals.
        </p>
      </div>
    `
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-4">
        You agree to indemnify, defend, and hold harmless Mazeloot Inc., its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or relating to:
      </p>
      <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
        <li>Your use of the Service</li>
        <li>Your Content and any claims related to Your Content</li>
        <li>Your violation of these Terms</li>
        <li>Your violation of any third-party rights</li>
        <li>Any disputes between you and your clients</li>
      </ul>
    `
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: `
      <div class="dark:bg-red-500/10 light:bg-red-50 border dark:border-red-500/20 light:border-red-200 rounded-xl p-6 mb-6">
        <p class="dark:text-red-300 light:text-red-700 font-semibold mb-4">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
        <ul class="list-disc pl-6 space-y-2 dark:text-red-300 light:text-red-700">
          <li>The Service is provided "as is" and "as available" without warranties of any kind</li>
          <li>We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose</li>
          <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages</li>
          <li>Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim</li>
          <li>We are not responsible for loss of data, content, or business opportunities</li>
        </ul>
      </div>
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">
        Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so some of the above may not apply to you.
      </p>
    `
  },
  {
    id: 'termination',
    title: 'Termination',
    content: `
      <div class="space-y-6">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 sm:p-7 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Termination by You</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">You may terminate your account at any time by deleting your account through your account settings or contacting us.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Termination by Us</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">We may suspend or terminate your account immediately, without prior notice, if you violate these Terms, engage in fraudulent activity, or for any other reason we deem necessary.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Effect of Termination</h3>
          <p class="dark:text-gray-300 light:text-gray-700 mb-4 leading-relaxed">Upon termination:</p>
          <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700">
            <li>Your right to access and use the Service will immediately cease</li>
            <li>Your Content may be deleted in accordance with our data retention policies</li>
            <li>You remain responsible for any fees incurred prior to termination</li>
            <li>Provisions that by their nature should survive termination will remain in effect</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: 'disputes',
    title: 'Dispute Resolution',
    content: `
      <div class="space-y-6">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 sm:p-7 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Governing Law</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
          <h3 class="text-lg font-semibold dark:text-white light:text-gray-900 mb-4">Dispute Resolution Process</h3>
          <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed">If you have a dispute with us, you agree to first contact us to attempt to resolve the dispute informally. If we cannot resolve the dispute within 60 days, you agree to resolve disputes through binding arbitration, except where prohibited by law.</p>
        </div>
      </div>
    `
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-4">
        We reserve the right to modify these Terms at any time. We will notify you of material changes by:
      </p>
      <ul class="list-disc pl-6 space-y-2 dark:text-gray-300 light:text-gray-700 mb-4">
        <li>Posting the updated Terms on this page</li>
        <li>Updating the "Last updated" date</li>
        <li>Sending an email notification for significant changes</li>
      </ul>
      <div class="dark:bg-amber-500/10 light:bg-amber-50 border dark:border-amber-500/20 light:border-amber-200 rounded-lg p-4">
        <p class="text-sm dark:text-amber-300 light:text-amber-700">
          <strong class="dark:text-white light:text-gray-900">Note:</strong> Your continued use of the Service after changes become effective constitutes acceptance of the updated Terms. If you do not agree to the changes, you must stop using the Service and terminate your account.
        </p>
      </div>
    `
  },
  {
    id: 'miscellaneous',
    title: 'Miscellaneous',
    content: `
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Entire Agreement</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">These Terms, together with our Privacy Policy, constitute the entire agreement between you and Mazeloot.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Severability</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">If any provision is found unenforceable, the remaining provisions will remain in full effect.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Assignment</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">You may not assign these Terms without our prior written consent.</p>
        </div>
        <div class="dark:bg-white/5 light:bg-gray-50 rounded-lg p-4 border dark:border-white/10 light:border-gray-200">
          <h4 class="font-semibold dark:text-white light:text-gray-900 mb-2">Waiver</h4>
          <p class="text-sm dark:text-gray-300 light:text-gray-700">Our failure to enforce any provision does not constitute a waiver.</p>
        </div>
      </div>
    `
  },
  {
    id: 'contact',
    title: 'Contact Information',
    content: `
      <p class="dark:text-gray-300 light:text-gray-700 leading-relaxed mb-6">
        If you have questions about these Terms, please contact us:
      </p>
      <div class="dark:bg-white/5 light:bg-gray-50 rounded-xl p-6 border dark:border-white/10 light:border-gray-200">
        <p class="dark:text-white light:text-gray-900 font-semibold mb-2">Mazeloot Inc.</p>
        <p class="dark:text-gray-300 light:text-gray-700 mb-1">Email: <a href="mailto:legal@mazeloot.com" class="text-emerald-400 hover:text-emerald-300 underline">legal@mazeloot.com</a></p>
        <p class="dark:text-gray-300 light:text-gray-700">Website: <RouterLink :to="{ name: 'contact' }" class="text-emerald-400 hover:text-emerald-300 underline">Contact Us</RouterLink></p>
      </div>
    `
  }
]
</script>
