<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-cyan-500 to-blue-600 p-8 md:p-12 shadow-2xl border-2 border-cyan-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <Globe class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Homepage Setup</h1>
              <p class="text-cyan-100 mt-2 text-lg">Configure your public Memora homepage to showcase your portfolio</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Action Banner -->
      <ActionBanner
        title="Ready to customize your homepage?"
        description="Create a stunning public portfolio"
        button-text="Go to Homepage"
        :icon="Globe"
        color="cyan"
        @action="navigateTo({ name: 'homepageConfig' })"
      />

      <!-- Overview Section -->
      <Card class="p-6 border-2 border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/30 dark:to-blue-950/30">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-foreground">Your Public Portfolio</h2>
          <p class="text-foreground/80 leading-relaxed text-lg">
            Your Memora homepage is your public-facing portfolio that showcases your work to potential clients. It's the first impression visitors get of your photography, so make it count. Customize every aspect to reflect your brand and highlight your best collections.
          </p>
          <div class="grid md:grid-cols-2 gap-4 mt-6">
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-cyan-200 dark:border-cyan-800">
              <div class="text-lg font-semibold text-cyan-700 dark:text-cyan-300 mb-2">Key Features</div>
              <ul class="space-y-1 text-sm text-foreground/70">
                <li>• Custom branding & logo</li>
                <li>• Featured collections showcase</li>
                <li>• About section</li>
                <li>• Social media links</li>
                <li>• Contact information</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-cyan-200 dark:border-cyan-800">
              <div class="text-lg font-semibold text-cyan-700 dark:text-cyan-300 mb-2">Best Practices</div>
              <ul class="space-y-1 text-sm text-foreground/70">
                <li>• Keep it updated regularly</li>
                <li>• Showcase your best work</li>
                <li>• Tell your story</li>
                <li>• Make it easy to contact you</li>
                <li>• Match your brand identity</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <!-- Content Sections -->
      <div class="grid gap-6">
        <Card 
          v-for="(card, index) in contentCards" 
          :key="index"
          class="group p-6 space-y-4 border-2 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <h2 class="text-xl font-bold text-foreground">{{ card.title }}</h2>
          <p class="text-foreground/70 leading-relaxed">{{ card.description }}</p>
          <div v-if="card.steps" class="space-y-3 mt-4">
            <div v-for="(step, stepIndex) in card.steps" :key="stepIndex" class="flex items-start gap-3 p-3 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition-colors group/step">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-bold shadow-md group-hover/step:scale-110 transition-transform shrink-0">
                {{ stepIndex + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-foreground">{{ step.title }}</h3>
                <p class="text-sm text-foreground/70 mt-1">{{ step.detail }}</p>
              </div>
            </div>
          </div>
          <div v-if="card.tips" class="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
            <div class="flex items-start gap-2 mb-2">
              <Lightbulb class="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <span class="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Pro Tip</span>
            </div>
            <p class="text-sm text-yellow-800 dark:text-yellow-200">{{ card.tips }}</p>
          </div>
        </Card>
      </div>
    </div>
  </KnowledgeBaseLayout>
</template>

<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import KnowledgeBaseLayout from '@/shared/layouts/KnowledgeBaseLayout.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import ActionBanner from '@/shared/components/molecules/ActionBanner.vue'
import { Globe, ChevronRight, Lightbulb } from '@/shared/utils/lucideAnimated'
import { useNavigation } from '@/shared/composables/useNavigation'

const { navigateTo } = useNavigation()

const contentCards = computed(() => [
  {
    title: 'Configuration Steps',
    description: 'Follow these steps to create a professional homepage that showcases your work effectively.',
    steps: [
      {
        title: 'Customize Branding',
        detail: 'Upload your logo (PNG with transparency works best), choose your brand colors, and select fonts that match your identity. Consistent branding builds recognition and trust.',
      },
      {
        title: 'Write Your About Section',
        detail: 'Tell your story in 2-3 paragraphs. Include your background, style, and what makes your work unique. Add a professional headshot if desired. Keep it authentic and engaging.',
      },
      {
        title: 'Select Featured Collections',
        detail: 'Choose 6-12 of your best collections to showcase. Select diverse work that represents your range and style. You can organize them by category or let them display in order.',
      },
      {
        title: 'Configure Social Links',
        detail: 'Add links to your Instagram, Facebook, Twitter, website, and other social profiles. This helps visitors connect with you across platforms and builds your online presence.',
      },
      {
        title: 'Add Contact Information',
        detail: 'Include your email address or contact form. Make it easy for potential clients to reach out. Consider adding your location if you serve specific areas.',
      },
      {
        title: 'Preview & Publish',
        detail: 'Use the preview feature to see how your homepage looks to visitors. Test on mobile devices. When satisfied, click "Publish" to make it live.',
      },
    ],
    tips: 'Update your homepage regularly with new collections. A fresh homepage shows you\'re active and helps with SEO. Aim to update featured collections every 1-2 months.',
  },
  {
    title: 'Featured Collections Strategy',
    description: 'Your featured collections are the first thing visitors see. Choose wisely to make a strong first impression.',
    steps: [
      {
        title: 'Showcase Your Best Work',
        detail: 'Select collections that represent your strongest photography. Quality over quantity - 6-8 excellent collections beat 20 mediocre ones.',
      },
      {
        title: 'Demonstrate Range',
        detail: 'If you shoot multiple genres, include examples from each. This shows your versatility and helps attract diverse clients.',
      },
      {
        title: 'Keep It Current',
        detail: 'Regularly rotate featured collections to include recent work. This shows you\'re active and keeps your homepage fresh.',
      },
      {
        title: 'Organize by Category',
        detail: 'Group collections by type (weddings, portraits, commercial) if you shoot multiple genres. This helps visitors find what they\'re looking for.',
      },
    ],
    tips: 'Create a "Portfolio" collection specifically for your homepage that includes your absolute best work across all projects. This gives visitors a quick overview of your capabilities.',
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
