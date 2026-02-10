<template>
  <div class="min-h-screen bg-gradient-to-br dark:from-[#0f0f23] dark:via-primary-950/50 dark:to-[#0f0f23] light:from-gray-50 light:via-white light:to-gray-100 dark:text-gray-100 light:text-gray-900">
    <PublicNav />
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-primary-500/15 blur-[100px]" aria-hidden="true" />
      <div class="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-accent-500/10 blur-[80px]" aria-hidden="true" />
      
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-600/50 dark:text-cyan-300 light:text-cyan-600 text-sm font-medium mb-6 dark:backdrop-blur-sm light:backdrop-blur-sm">
            <HelpCircle class="h-4 w-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 dark:bg-gradient-to-r dark:from-white dark:via-indigo-200 dark:to-violet-200 light:bg-gradient-to-r light:from-gray-900 light:via-indigo-600 light:to-violet-600 bg-clip-text text-transparent">
            Got questions? We've got answers
          </h1>
          <p class="text-lg sm:text-xl dark:text-gray-300 light:text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Memora and how it works
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="relative pb-20">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="space-y-3">
            <div
              v-for="(faq, index) in faqItems"
              :key="index"
              class="group relative rounded-xl dark:bg-white/5 light:bg-white dark:backdrop-blur-sm light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 dark:hover:border-cyan-500/30 light:hover:border-cyan-500/50 dark:hover:bg-white/10 light:hover:bg-gray-50 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <button
                type="button"
                class="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left"
                :aria-expanded="openFaq === index"
                :aria-controls="`faq-answer-${index}`"
                :id="`faq-question-${index}`"
                @click="openFaq = openFaq === index ? null : index"
              >
                <span class="text-base sm:text-lg font-semibold dark:text-white light:text-gray-900 pr-8">{{ faq.question }}</span>
                <div class="flex-shrink-0 w-7 h-7 rounded-lg dark:bg-cyan-500/20 light:bg-cyan-500/10 dark:border-cyan-500/30 light:border-cyan-600/50 flex items-center justify-center transition-transform duration-300" :class="openFaq === index ? 'rotate-180' : ''">
                  <ChevronDown class="h-4 w-4 dark:text-cyan-300 light:text-cyan-600" />
                </div>
              </button>
              <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div
                  v-if="openFaq === index"
                  :id="`faq-answer-${index}`"
                  role="region"
                  :aria-labelledby="`faq-question-${index}`"
                  class="px-4 sm:px-5 pb-4 sm:pb-5"
                >
                  <div class="pt-3 border-t dark:border-white/10 light:border-gray-200">
                    <p class="text-sm sm:text-base leading-relaxed dark:text-gray-300 light:text-gray-600">{{ faq.answer }}</p>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- CTA Section -->
          <div class="mt-16 text-center">
            <div class="relative rounded-2xl dark:bg-white/5 light:bg-white dark:backdrop-blur-xl light:backdrop-blur-sm dark:border-white/10 light:border-gray-200 p-4 sm:p-8 md:p-10 dark:shadow-2xl light:shadow-xl light:ring-1 light:ring-gray-200/50">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/5 via-transparent to-rose-500/5" />
              <div class="relative">
                <h2 class="text-2xl sm:text-3xl font-bold dark:text-white light:text-gray-900 mb-3">Still have questions?</h2>
                <p class="dark:text-gray-300 light:text-gray-600 mb-6">Can't find what you're looking for? Get in touch and we'll help you out.</p>
                <RouterLink
                  :to="{ name: 'contact' }"
                  class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-400 hover:to-accent-400 hover:shadow-primary-500/40 hover:-translate-y-0.5 border-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white"
                >
                  <Mail class="h-5 w-5" />
                  Contact Us
                </RouterLink>
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
import { ref, computed, onMounted } from 'vue'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { RouterLink } from 'vue-router'
import { HelpCircle, ChevronDown, Mail } from '@/shared/utils/lucideAnimated'
import { Transition } from 'vue'
import { useSeoMeta } from '@/shared/composables/useSeoMeta'
import { trackPageView } from '@/shared/composables/useAnalytics'

const BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}`
  : 'https://mazeloot.com'

const openFaq = ref(null)

const faqItems = [
  {
    question: 'How does the four-phase workflow work?',
    answer: 'Selection (clients pick favorites), Proofing (feedback and revisions), Collection (final delivery), and Raw files (store and deliver originals with optional PIN). One link per project—no client account required.',
  },
  {
    question: 'Do my clients need to create an account?',
    answer: 'No. You share a link; clients view, comment, and download from their browser. No sign-up or app required.',
  },
  {
    question: 'I\'m tired of juggling WeTransfer, email threads, and spreadsheets. How does Memora help?',
    answer: 'Memora replaces all those tools with one workflow. Upload once, share one link. Clients pick favorites, leave feedback, and download—all in one place. No more email tag or lost files.',
  },
  {
    question: 'Can I protect my galleries with passwords or watermarks?',
    answer: 'Yes. You can set gallery passwords, apply watermarks, and control download access. Available on Standard and higher plans.',
  },
  {
    question: 'How do I handle client feedback without losing track of emails?',
    answer: 'All comments and revision requests live in the proofing phase, attached to specific images. You get one clear list of what needs editing—no digging through inboxes or chat threads.',
  },
  {
    question: 'Can I brand my galleries with my logo and colors?',
    answer: 'Yes. Professional plans include full branding customization. Your logo, colors, and style appear on every client page, so you look polished from first share to final delivery.',
  },
  {
    question: 'What happens to my RAW files? Can clients access them?',
    answer: 'RAW files are stored separately in the Raw files phase. You control what\'s shared and when. Clients only see what you\'ve explicitly shared, with optional PIN protection for extra security.',
  },
  {
    question: 'How do I deliver final images to clients?',
    answer: 'Create a Collection—your delivery gallery. Share one link; clients view, download high-resolution files, or order prints. No separate delivery service needed.',
  },
  {
    question: 'What if a client wants revisions? How does that work?',
    answer: 'Clients request revisions in the proofing phase. You upload new versions, and they can approve or request more changes. Full history is kept so nothing gets lost.',
  },
  {
    question: 'Can I limit how many photos clients can select?',
    answer: 'Yes. Set selection limits per gallery (e.g., "pick up to 50"). This helps manage expectations and keeps your workflow organized.',
  },
  {
    question: 'What file formats do you support?',
    answer: 'We support JPEG, PNG, and all major RAW formats (Canon, Nikon, Sony, Fujifilm, etc.). You can upload both processed and RAW files, linking them together for easy reference.',
  },
  {
    question: 'How much storage do I get?',
    answer: 'Storage limits vary by plan. Starter includes enough for most creatives; Professional offers more storage and higher limits. See the pricing page for specific amounts.',
  },
  {
    question: 'Can I use this for multiple clients at once?',
    answer: 'Yes. Each project gets its own link and workflow. Manage multiple shoots simultaneously—everything stays organized and separate.',
  },
  {
    question: 'What if my client isn\'t tech-savvy? Will they be able to use this?',
    answer: 'Absolutely. Clients just click a link and view photos in their browser. No app, no account, no learning curve. It works on phones, tablets, and computers.',
  },
  {
    question: 'How do I know when clients have viewed or downloaded photos?',
    answer: 'You get notifications when clients view galleries, make selections, leave comments, or download files. Stay in sync without constantly checking.',
  },
  {
    question: 'Can I customize the gallery layout and design?',
    answer: 'Yes. Choose from different layouts, customize colors and branding, and control how photos are displayed. Make it match your style.',
  },
  {
    question: 'What happens if I need to update or replace a photo after sharing?',
    answer: 'You can update photos anytime. Upload new versions, and clients see the latest files. Previous versions are kept in history for reference.',
  },
  {
    question: 'Is there a limit on how many projects I can have?',
    answer: 'Project limits vary by plan. Starter includes enough for most creatives; Professional offers higher limits. See pricing for details.',
  },
  {
    question: 'Can I download all my files if I want to switch platforms?',
    answer: 'Yes. You can export and download all your files at any time. Your data belongs to you.',
  },
  {
    question: 'What plans do you offer?',
    answer: 'We offer Starter and Professional plans. Each includes galleries, proofing, and delivery; Professional adds branding, Studio Manager, and more. See the pricing page for details.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use industry-standard encryption and security practices. Your files and client data are stored securely. We never share your work without permission.',
  },
]

// SEO Meta Tags
const faqQuestions = computed(() => faqItems.map(item => ({
  '@type': 'Question',
  name: item.question,
  acceptedAnswer: {
    '@type': 'Answer',
    text: item.answer,
  },
})))

useSeoMeta({
  title: 'FAQ - Frequently Asked Questions | Mazeloot',
  description: 'Everything you need to know about Memora and how it works. Answers to common questions about galleries, proofing, workflows, and more.',
  image: `${BASE_URL}/og-image.png`,
  url: `${BASE_URL}/faq`,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqQuestions.value,
  },
})

// Track page view
onMounted(() => {
  trackPageView('/faq', 'FAQ')
})
</script>
