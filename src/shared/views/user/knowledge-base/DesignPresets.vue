<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 via-pink-500 to-rose-600 p-8 md:p-12 shadow-2xl border-2 border-pink-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <Settings class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Design Presets</h1>
              <p class="text-pink-100 mt-2 text-lg">Create reusable design presets to save time on collection styling</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Action Banner -->
      <ActionBanner
        title="Ready to create a preset?"
        description="Save time with reusable design templates"
        button-text="Go to Presets"
        :icon="Settings"
        color="pink"
        @action="navigateTo({ name: 'presetSettings' })"
      />

      <!-- Overview Section -->
      <Card class="p-6 border-2 border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/30 dark:to-rose-950/30">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-foreground">What are Design Presets?</h2>
          <p class="text-foreground/80 leading-relaxed text-lg">
            Design presets are saved collections of design settings that you can apply instantly to new collections. They capture everything from typography and colors to grid layouts and cover settings. Presets eliminate repetitive design work and ensure consistency across your portfolio.
          </p>
          <div class="grid md:grid-cols-3 gap-4 mt-6">
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800">
              <div class="text-lg font-semibold text-pink-700 dark:text-pink-300 mb-2">Time Saver</div>
              <div class="text-sm text-foreground/70">Apply complete designs in seconds instead of minutes</div>
            </div>
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800">
              <div class="text-lg font-semibold text-pink-700 dark:text-pink-300 mb-2">Consistency</div>
              <div class="text-sm text-foreground/70">Maintain brand identity across all collections</div>
            </div>
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-pink-200 dark:border-pink-800">
              <div class="text-lg font-semibold text-pink-700 dark:text-pink-300 mb-2">Flexibility</div>
              <div class="text-sm text-foreground/70">Create multiple presets for different styles</div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Content Sections -->
      <div class="grid gap-6">
        <Card 
          v-for="(card, index) in contentCards" 
          :key="index"
          class="group p-6 space-y-4 border-2 hover:border-pink-300 dark:hover:border-pink-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <h2 class="text-xl font-bold text-foreground">{{ card.title }}</h2>
          <p class="text-foreground/70 leading-relaxed">{{ card.description }}</p>
          <div v-if="card.steps" class="space-y-3 mt-4">
            <div v-for="(step, stepIndex) in card.steps" :key="stepIndex" class="flex items-start gap-3 p-3 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-colors group/step">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold shadow-md group-hover/step:scale-110 transition-transform shrink-0">
                {{ stepIndex + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-foreground">{{ step.title }}</h3>
                <p class="text-sm text-foreground/70 mt-1">{{ step.detail }}</p>
              </div>
            </div>
          </div>
          <div v-if="card.diagram" class="mt-4 p-4 rounded-lg bg-muted/50 border border-pink-200 dark:border-pink-800">
            <div class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <ArrowRight class="h-4 w-4" />
              {{ card.diagram.title }}
            </div>
            <div class="space-y-2">
              <div v-for="(item, idx) in card.diagram.items" :key="idx" class="flex items-center gap-2 text-sm">
                <div class="w-2 h-2 rounded-full bg-pink-500"></div>
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
import { ref, computed } from 'vue'
import KnowledgeBaseLayout from '@/shared/layouts/KnowledgeBaseLayout.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import ActionBanner from '@/shared/components/molecules/ActionBanner.vue'
import { Settings, ChevronRight, ArrowRight, Lightbulb } from '@/shared/utils/lucideAnimated'
import { useNavigation } from '@/shared/composables/useNavigation'

const { navigateTo } = useNavigation()

const contentCards = computed(() => [
  {
    title: 'Creating a Preset',
    description: 'Start by designing a collection exactly how you want it. Once you\'re happy with the design, save it as a preset for future use.',
    steps: [
      {
        title: 'Design Your Collection',
        detail: 'Create a collection and configure all design settings: typography (fonts, sizes, weights), color scheme (background, text, accents), grid layout (masonry, grid, list), spacing, and cover photo settings.',
      },
      {
        title: 'Test and Refine',
        detail: 'Preview your design with actual photos to ensure everything looks perfect. Make adjustments until you\'re completely satisfied with the result.',
      },
      {
        title: 'Save as Preset',
        detail: 'Click "Save as Preset" in the Design tab. Give it a descriptive name like "Minimalist Portfolio" or "Bold & Colorful". Add an optional description to remember when to use it.',
      },
      {
        title: 'Create Multiple Presets',
        detail: 'Repeat the process to create presets for different styles or client types. You can have as many presets as you need, each with unique design characteristics.',
      },
    ],
    diagram: {
      title: 'Preset Creation Process',
      items: [
        'Design Collection',
        'Configure All Settings',
        'Preview & Refine',
        'Save as Preset',
        'Ready to Use',
      ],
    },
    tips: 'Create presets for your most common styles first. Start with 2-3 presets covering your primary aesthetic, then expand as needed.',
  },
  {
    title: 'Using Presets',
    description: 'Applying a preset to a new collection is instant. All design settings are copied automatically, saving you significant time while maintaining consistency.',
    steps: [
      {
        title: 'Create New Collection',
        detail: 'Navigate to Collections and click "Create Collection". Fill in the basic information (name, description) as usual.',
      },
      {
        title: 'Select Your Preset',
        detail: 'In the creation dialog, find the "Preset" dropdown. Select the preset that matches the style you want for this collection.',
      },
      {
        title: 'Settings Applied Automatically',
        detail: 'All design settings from the preset are instantly applied: typography, colors, grid layout, spacing, and cover settings. Your collection is ready to use.',
      },
      {
        title: 'Customize if Needed',
        detail: 'You can still modify any design element after applying a preset. Changes only affect the current collection, not the preset itself.',
      },
      {
        title: 'Add Your Photos',
        detail: 'Upload or add photos to your collection. The preset design will showcase them beautifully with your chosen style.',
      },
    ],
    tips: 'Keep presets updated. If you refine your design style, update the preset so future collections automatically use the improved design.',
  },
  {
    title: 'Managing Presets',
    description: 'Organize and maintain your presets to keep your workflow efficient. Update, duplicate, or delete presets as your style evolves.',
    steps: [
      {
        title: 'View All Presets',
        detail: 'Go to Settings > Design Presets to see all your saved presets. Each preset shows a preview and description.',
      },
      {
        title: 'Edit Existing Presets',
        detail: 'Open a preset to modify its settings. Changes affect future collections but don\'t alter collections already using the preset.',
      },
      {
        title: 'Duplicate Presets',
        detail: 'Create variations by duplicating an existing preset. Modify the duplicate to create a new style without losing the original.',
      },
      {
        title: 'Delete Unused Presets',
        detail: 'Remove presets you no longer use to keep your list clean and manageable. Deleted presets don\'t affect existing collections.',
      },
    ],
    tips: 'Name presets clearly and include the use case in the description. This helps you choose the right preset quickly when creating collections.',
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
