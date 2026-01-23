<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600 p-8 md:p-12 shadow-2xl border-2 border-rose-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <Palette class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Branding & Customization</h1>
              <p class="text-rose-100 mt-2 text-lg">Personalize your Memora gallery with custom branding and design settings</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Action Banner -->
      <ActionBanner
        title="Ready to customize your brand?"
        description="Make Memora truly yours with custom branding"
        button-text="Go to Branding"
        :icon="Palette"
        color="rose"
        @action="navigateTo({ name: 'brandingSettings' })"
      />

      <!-- Overview Section -->
      <Card class="p-6 border-2 border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/30 dark:to-pink-950/30">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-foreground">Why Branding Matters</h2>
          <p class="text-foreground/80 leading-relaxed text-lg">
            Consistent branding across your Memora gallery builds recognition, professionalism, and trust. When clients see your logo, colors, and style consistently applied, it reinforces your brand identity and makes your work more memorable. Custom branding appears on your homepage, collections, and all client-facing pages.
          </p>
          <div class="grid md:grid-cols-3 gap-4 mt-6">
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-rose-200 dark:border-rose-800">
              <div class="text-lg font-semibold text-rose-700 dark:text-rose-300 mb-2">Recognition</div>
              <div class="text-sm text-foreground/70">Clients remember your brand</div>
            </div>
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-rose-200 dark:border-rose-800">
              <div class="text-lg font-semibold text-rose-700 dark:text-rose-300 mb-2">Professionalism</div>
              <div class="text-sm text-foreground/70">Consistent, polished appearance</div>
            </div>
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-rose-200 dark:border-rose-800">
              <div class="text-lg font-semibold text-rose-700 dark:text-rose-300 mb-2">Trust</div>
              <div class="text-sm text-foreground/70">Builds client confidence</div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Content Sections -->
      <div class="grid gap-6">
        <Card 
          v-for="(card, index) in contentCards" 
          :key="index"
          class="group p-6 space-y-4 border-2 hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <h2 class="text-xl font-bold text-foreground">{{ card.title }}</h2>
          <p class="text-foreground/70 leading-relaxed">{{ card.description }}</p>
          <div v-if="card.options" class="grid gap-4 md:grid-cols-2 mt-4">
            <div v-for="option in card.options" :key="option.title" class="p-4 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors group/option border border-transparent hover:border-rose-200 dark:hover:border-rose-800">
              <h3 class="font-semibold text-foreground mb-2">{{ option.title }}</h3>
              <p class="text-sm text-foreground/70 mb-2">{{ option.description }}</p>
              <ul v-if="option.details" class="space-y-1 text-xs text-foreground/60">
                <li v-for="detail in option.details" :key="detail">• {{ detail }}</li>
              </ul>
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
import { Palette, ChevronRight, Lightbulb } from '@/shared/utils/lucideAnimated'
import { useNavigation } from '@/shared/composables/useNavigation'

const { navigateTo } = useNavigation()

const contentCards = computed(() => [
  {
    title: 'Branding Options',
    description: 'Customize every aspect of your brand identity to create a cohesive, professional appearance across all your Memora pages.',
    options: [
      {
        title: 'Logo & Branding',
        description: 'Upload your logo (PNG with transparency recommended) and set brand colors that appear across your Memora gallery.',
        details: [
          'Upload logo in PNG format',
          'Set logo size and position',
          'Choose brand primary color',
          'Select secondary accent colors',
        ],
      },
      {
        title: 'Color Scheme',
        description: 'Choose primary and secondary colors that match your brand identity. These colors appear in buttons, links, and accent elements.',
        details: [
          'Primary brand color',
          'Secondary accent colors',
          'Text and background colors',
          'Hover and active states',
        ],
      },
      {
        title: 'Typography',
        description: 'Select fonts that reflect your style and brand personality. Choose from web-safe fonts or upload custom fonts.',
        details: [
          'Heading font selection',
          'Body text font',
          'Font sizes and weights',
          'Line height and spacing',
        ],
      },
      {
        title: 'Social Links',
        description: 'Add links to your social media profiles and website. These appear on your homepage and can be included in collections.',
        details: [
          'Instagram, Facebook, Twitter',
          'Personal website',
          'Portfolio links',
          'Contact information',
        ],
      },
    ],
    tips: 'Keep your branding consistent with your website and other marketing materials. Use the same logo, colors, and fonts across all platforms for maximum brand recognition.',
  },
  {
    title: 'Design Consistency',
    description: 'Combine branding settings with design presets to create a cohesive look that reflects your style across all collections.',
    options: [
      {
        title: 'Brand + Presets',
        description: 'Your branding settings work together with design presets. Brand colors and fonts are applied automatically when you use presets.',
        details: [
          'Brand colors override preset colors',
          'Logo appears on all collections',
          'Consistent typography',
          'Unified visual identity',
        ],
      },
      {
        title: 'Customization Flexibility',
        description: 'While branding provides consistency, you can still customize individual collections for specific clients or projects.',
        details: [
          'Override colors per collection',
          'Adjust fonts if needed',
          'Maintain brand elements',
          'Flexible customization',
        ],
      },
    ],
    tips: 'Create a master brand preset that includes both your branding settings and preferred design elements. This ensures every new collection starts with your complete brand identity.',
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
