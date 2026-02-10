<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600 p-4 sm:p-8 md:p-12 shadow-2xl border-2 border-violet-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <HelpCircle class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Frequently Asked Questions</h1>
              <p class="text-violet-100 mt-2 text-lg">Everything you should know about Memora</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Overview -->
      <Card class="p-4 sm:p-6 border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-950/30">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-foreground">Common Questions</h2>
          <p class="text-foreground/80 leading-relaxed text-lg">
            Find answers to the most frequently asked questions about Memora. If you don't find what you're looking for, check our detailed guides or contact support.
          </p>
        </div>
      </Card>

      <!-- FAQs List -->
      <div class="space-y-4">
        <Card 
          v-for="(faq, index) in faqs" 
          :key="faq.id" 
          class="group p-4 sm:p-6 border-2 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300 hover:shadow-lg"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 50}ms both` }"
        >
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-foreground flex items-start gap-2">
              <span class="text-violet-600 dark:text-violet-400 mt-1 font-bold">Q:</span>
              <span>{{ faq.question }}</span>
            </h3>
            <div class="pl-6 space-y-2">
              <p class="text-foreground/70 leading-relaxed flex items-start gap-2">
                <span class="text-violet-600 dark:text-violet-400 mt-1 font-bold">A:</span>
                <span>{{ faq.answer }}</span>
              </p>
              <div v-if="faq.details" class="pl-6 mt-2 space-y-1">
                <p v-for="detail in faq.details" :key="detail" class="text-sm text-foreground/60">• {{ detail }}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </KnowledgeBaseLayout>
</template>

<script setup>
import { ref } from 'vue'
import KnowledgeBaseLayout from '@/shared/layouts/KnowledgeBaseLayout.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import { HelpCircle, ChevronRight } from '@/shared/utils/lucideAnimated'

const faqs = ref([
  {
    id: 1,
    question: 'How do I create my first collection?',
    answer: 'Navigate to Collections from the main menu, click "Create Collection", enter a name and optional description, then upload your photos. After creation, you can customize the design, set privacy settings, configure sharing options, and organize photos.',
    details: [
      'Collections can be created empty and photos added later',
      'You can upload multiple photos at once',
      'Design settings can be customized anytime',
      'Use presets to speed up creation',
    ],
  },
  {
    id: 2,
    question: 'Can I share collections with clients who don\'t have accounts?',
    answer: 'Yes! Collections can be shared via public links, password-protected links, or email invitations. Clients can view, favorite, comment, and download photos without needing a Memora account. All sharing is secure and you control access.',
    details: [
      'Public links work for anyone with the URL',
      'Password protection adds security',
      'Email invitations track who accessed',
      'You can revoke access anytime',
    ],
  },
  {
    id: 3,
    question: 'What file formats does Memora support?',
    answer: 'Memora supports JPEG, PNG, and all major RAW formats including Canon (.CR2, .CR3), Nikon (.NEF), Sony (.ARW), Fujifilm (.RAF), and more. You can upload and organize both processed JPEGs and RAW files, linking them together for easy reference.',
    details: [
      'JPEG and PNG for processed photos',
      'All major camera RAW formats',
      'RAW files can be linked to processed versions',
      'Files are stored securely in the cloud',
    ],
  },
  {
    id: 4,
    question: 'How do watermarks work?',
    answer: 'Create custom watermarks (image or text) with configurable opacity, position, and size. Apply watermarks to collections when sharing - they\'re automatically added to all photos in shared collections, protecting your work while allowing client preview.',
    details: [
      'Create multiple watermarks for different purposes',
      'Configure opacity, position, and size',
      'Apply per-collection or use defaults',
      'Remove watermarks after final payment',
    ],
  },
  {
    id: 5,
    question: 'What\'s the difference between selections and proofing?',
    answer: 'Selections are curated sets of photos you share with clients for initial review. Proofing is a structured workflow with deadlines, revision limits, and approval tracking. Use selections for casual review, proofing for formal approval processes.',
    details: [
      'Selections: Quick sharing and review',
      'Proofing: Structured approval workflow',
      'Proofing tracks revisions and deadlines',
      'Both can be used together in projects',
    ],
  },
  {
    id: 6,
    question: 'Can I customize my public homepage?',
    answer: 'Yes! Customize your Memora homepage with your branding, logo, colors, featured collections, about section, and social links. Create a professional portfolio that showcases your work and attracts new clients.',
    details: [
      'Upload logo and set brand colors',
      'Write an engaging about section',
      'Feature your best collections',
      'Add social media and contact links',
    ],
  },
  {
    id: 7,
    question: 'How do design presets save time?',
    answer: 'Design presets save all your collection design settings (typography, colors, grid layout, spacing). When creating a new collection, select a preset to instantly apply all settings. You can still customize individual elements if needed.',
    details: [
      'Create presets for different styles',
      'Apply instantly to new collections',
      'Maintain consistency across work',
      'Update presets as your style evolves',
    ],
  },
  {
    id: 8,
    question: 'What\'s the best way to organize my work?',
    answer: 'Use projects to organize work by client or event. Within projects, create selections for curation, use proofing for approval, and deliver final work via collections. This structured approach keeps everything organized and makes workflows efficient.',
    details: [
      'Projects group related work',
      'Selections for curation',
      'Proofing for approval',
      'Collections for final delivery',
    ],
  },
])
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
