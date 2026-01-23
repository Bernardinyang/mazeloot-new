<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 p-8 md:p-12 shadow-2xl border-2 border-orange-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <ImageIcon class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Watermark Protection</h1>
              <p class="text-orange-100 mt-2 text-lg">Protect your photos with custom watermarks before sharing</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Action Banner -->
      <ActionBanner
        title="Ready to protect your work?"
        description="Create watermarks to safeguard your photos"
        button-text="Go to Watermarks"
        :icon="ImageIcon"
        color="orange"
        @action="navigateTo({ name: 'watermarkSettings' })"
      />

      <!-- Overview Section -->
      <Card class="p-6 border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/30 dark:to-amber-950/30">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-foreground">Why Use Watermarks?</h2>
          <p class="text-foreground/80 leading-relaxed text-lg">
            Watermarks protect your intellectual property by adding your branding or copyright information to photos before sharing. They prevent unauthorized use while allowing clients to preview your work. Watermarks are especially important for client galleries before final payment or for public portfolios.
          </p>
          <div class="grid md:grid-cols-2 gap-4 mt-6">
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-200 dark:border-orange-800">
              <div class="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-2">Protection</div>
              <ul class="space-y-1 text-sm text-foreground/70">
                <li>• Prevent unauthorized downloads</li>
                <li>• Deter image theft</li>
                <li>• Maintain copyright control</li>
                <li>• Professional presentation</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-200 dark:border-orange-800">
              <div class="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-2">Best Practices</div>
              <ul class="space-y-1 text-sm text-foreground/70">
                <li>• Use before final payment</li>
                <li>• Balance visibility & aesthetics</li>
                <li>• Position strategically</li>
                <li>• Match your brand style</li>
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
          class="group p-6 space-y-4 border-2 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <h2 class="text-xl font-bold text-foreground">{{ card.title }}</h2>
          <p class="text-foreground/70 leading-relaxed">{{ card.description }}</p>
          <div v-if="card.steps" class="space-y-3 mt-4">
            <div v-for="(step, stepIndex) in card.steps" :key="stepIndex" class="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors group/step">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold shadow-md group-hover/step:scale-110 transition-transform shrink-0">
                {{ stepIndex + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-foreground">{{ step.title }}</h3>
                <p class="text-sm text-foreground/70 mt-1">{{ step.detail }}</p>
              </div>
            </div>
          </div>
          <div v-if="card.diagram" class="mt-4 p-4 rounded-lg bg-muted/50 border border-orange-200 dark:border-orange-800">
            <div class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <ArrowRight class="h-4 w-4" />
              {{ card.diagram.title }}
            </div>
            <div class="space-y-2">
              <div v-for="(item, idx) in card.diagram.items" :key="idx" class="flex items-center gap-2 text-sm">
                <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                <span class="text-foreground/70">{{ item }}</span>
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
import { Image as ImageIcon, ChevronRight, ArrowRight, Lightbulb } from '@/shared/utils/lucideAnimated'
import { useNavigation } from '@/shared/composables/useNavigation'

const { navigateTo } = useNavigation()

const contentCards = computed(() => [
  {
    title: 'Creating Watermarks',
    description: 'Create professional watermarks that protect your work without detracting from the photos. You can use images, text, or a combination of both.',
    steps: [
      {
        title: 'Choose Watermark Type',
        detail: 'Decide between an image watermark (logo or graphic) or text watermark (your name, website, or copyright). Image watermarks work best as PNG files with transparency.',
      },
      {
        title: 'Upload or Create',
        detail: 'For image watermarks, upload your logo or graphic. For text watermarks, enter your text and choose fonts, sizes, and colors that match your brand.',
      },
      {
        title: 'Configure Display Settings',
        detail: 'Set opacity (typically 30-50% for visibility without distraction), position (center, corners, or custom), size (percentage of image), and rotation if needed.',
      },
      {
        title: 'Preview and Adjust',
        detail: 'Preview your watermark on sample photos to ensure it\'s visible but not intrusive. Adjust settings until you achieve the perfect balance.',
      },
      {
        title: 'Save Your Watermark',
        detail: 'Give your watermark a descriptive name like "Logo - Center" or "Text - Bottom Right". You can create multiple watermarks for different purposes.',
      },
    ],
    diagram: {
      title: 'Watermark Configuration Options',
      items: [
        'Type (Image/Text)',
        'Opacity (30-50%)',
        'Position (9 positions)',
        'Size (10-30%)',
        'Rotation (optional)',
      ],
    },
    tips: 'Use lower opacity (30-40%) for client previews to maintain photo quality. Use higher opacity (50-70%) for public portfolios where protection is more critical.',
  },
  {
    title: 'Applying Watermarks',
    description: 'Apply watermarks to collections when sharing with clients. Watermarks are added automatically to all photos in the collection, protecting your work while allowing preview.',
    steps: [
      {
        title: 'Select Collection',
        detail: 'Open the collection you want to share. Navigate to the Sharing or Settings section where watermark options are available.',
      },
      {
        title: 'Choose Watermark',
        detail: 'Select which watermark to apply from your saved watermarks. You can use different watermarks for different collections based on the context.',
      },
      {
        title: 'Configure Per-Collection Settings',
        detail: 'Override default watermark settings for this specific collection if needed. Adjust opacity, position, or size without modifying the watermark itself.',
      },
      {
        title: 'Apply and Share',
        detail: 'Watermarks are automatically applied to all photos when the collection is shared. Clients see watermarked versions, protecting your work.',
      },
      {
        title: 'Remove After Payment',
        detail: 'After final payment, you can remove watermarks or share an unwatermarked version. Simply update the collection settings and regenerate the share link.',
      },
    ],
    tips: 'Always use watermarks for client galleries before final payment. Remove watermarks only after payment is confirmed and you\'re ready to deliver final images.',
  },
  {
    title: 'Watermark Best Practices',
    description: 'Effective watermarks balance protection with aesthetics. Follow these guidelines to create watermarks that protect your work without compromising the viewing experience.',
    steps: [
      {
        title: 'Position Strategically',
        detail: 'Place watermarks where they\'re visible but don\'t cover important parts of the image. Corners work well, but center placement provides better protection.',
      },
      {
        title: 'Match Your Brand',
        detail: 'Use fonts, colors, and styles that match your brand identity. Consistent branding reinforces your professional image.',
      },
      {
        title: 'Keep It Simple',
        detail: 'Simple watermarks are more effective than complex ones. A logo or clean text is better than busy graphics that distract from the photos.',
      },
      {
        title: 'Test Visibility',
        detail: 'Test watermarks on different types of photos (light, dark, busy, simple) to ensure they\'re visible in all scenarios.',
      },
      {
        title: 'Update Regularly',
        detail: 'Keep watermarks current with your branding. Update them if your logo or brand identity changes.',
      },
    ],
    tips: 'Create multiple watermarks for different scenarios: one for client previews (subtle), one for public portfolios (more visible), and one for social media (optimized size).',
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
