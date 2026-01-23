<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section with Animation -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-8 md:p-12 shadow-2xl border-2 border-indigo-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6">
          <div class="flex items-center gap-4" style="animation: fadeIn 0.6s ease-out;">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <FolderOpen class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Collections Guide</h1>
              <p class="text-indigo-100 mt-2 text-lg">Learn how to create, design, and share photo collections with clients</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Action Banner -->
      <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-6 border-2 border-indigo-200/50 dark:border-indigo-800/50 shadow-lg">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-100">Ready to get started?</h3>
            <p class="text-sm text-indigo-700 dark:text-indigo-300">Create your first collection and start organizing your photos</p>
          </div>
          <Button @click="navigateTo({ name: 'manageCollections' })" variant="primary" size="lg" class="group shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <FolderOpen class="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
            Go to Collections
            <ChevronRight class="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      <!-- Overview Section -->
      <Card class="p-6 border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-foreground">What are Collections?</h2>
          <p class="text-foreground/80 leading-relaxed text-lg">
            Collections are curated galleries of your photos that you can share with clients. Think of them as digital portfolios where you showcase your work in a beautifully designed, customizable format. Each collection can have its own unique design, privacy settings, and sharing options.
          </p>
          <div class="grid md:grid-cols-3 gap-4 mt-6">
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-indigo-200 dark:border-indigo-800">
              <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">1</div>
              <div class="text-sm font-semibold text-foreground mb-1">Upload & Organize</div>
              <div class="text-xs text-foreground/70">Add photos and organize them into collections</div>
            </div>
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-indigo-200 dark:border-indigo-800">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">2</div>
              <div class="text-sm font-semibold text-foreground mb-1">Design & Customize</div>
              <div class="text-xs text-foreground/70">Apply your brand and customize the layout</div>
            </div>
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-indigo-200 dark:border-indigo-800">
              <div class="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">3</div>
              <div class="text-sm font-semibold text-foreground mb-1">Share & Deliver</div>
              <div class="text-xs text-foreground/70">Share with clients via secure links</div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Content Sections with Animations -->
      <div class="grid gap-6">
        <Card 
          v-for="(section, index) in sections" 
          :key="section.id" 
          class="group p-6 space-y-4 border-2 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <div class="flex items-center gap-4">
            <div :class="['flex items-center justify-center w-12 h-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300', section.iconBg]">
              <component :is="section.icon" class="h-6 w-6 text-white" />
            </div>
            <h2 class="text-xl font-bold text-foreground">{{ section.title }}</h2>
          </div>
          <p v-if="section.intro" class="text-foreground/70 leading-relaxed pl-16">{{ section.intro }}</p>
          <div class="space-y-3 pl-16">
            <div 
              v-for="(step, stepIndex) in section.steps" 
              :key="stepIndex" 
              class="flex items-start gap-3 group/step hover:bg-muted/50 p-3 rounded-lg transition-colors"
            >
              <div class="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold shadow-md group-hover/step:scale-110 transition-transform shrink-0">
                {{ stepIndex + 1 }}
              </div>
              <div class="flex-1">
                <p class="text-foreground/80 leading-relaxed pt-0.5">{{ step.text }}</p>
                <p v-if="step.detail" class="text-sm text-foreground/60 mt-1 ml-0">{{ step.detail }}</p>
              </div>
            </div>
          </div>
          <div v-if="section.diagram" class="mt-4 pl-16">
            <div class="p-4 rounded-lg bg-muted/50 border border-indigo-200 dark:border-indigo-800">
              <div class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <component :is="section.diagram.icon" class="h-4 w-4" />
                {{ section.diagram.title }}
              </div>
              <div class="space-y-2">
                <div v-for="(item, idx) in section.diagram.items" :key="idx" class="flex items-center gap-2 text-sm">
                  <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span class="text-foreground/70">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="section.tips" class="mt-4 pl-16">
            <div class="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <div class="flex items-start gap-2 mb-2">
                <Lightbulb class="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                <span class="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Pro Tip</span>
              </div>
              <p class="text-sm text-yellow-800 dark:text-yellow-200">{{ section.tips }}</p>
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
import { Button } from '@/shared/components/shadcn/button'
import { FolderOpen, ChevronRight, Upload, Palette, Globe, Settings, Lightbulb, ArrowRight } from '@/shared/utils/lucideAnimated'
import { useNavigation } from '@/shared/composables/useNavigation'

const { navigateTo } = useNavigation()

const sections = ref([
  {
    id: 1,
    title: 'Creating a Collection',
    icon: Upload,
    iconBg: 'bg-blue-500',
    intro: 'Collections are the foundation of your Memora gallery. They allow you to organize photos into shareable galleries with custom designs.',
    steps: [
      {
        text: 'Navigate to Collections from the main menu',
        detail: 'Click on "Collections" in the sidebar navigation. You\'ll see all your existing collections and a "Create Collection" button at the top.',
      },
      {
        text: 'Click "Create Collection" button',
        detail: 'This opens a dialog where you can configure your new collection. You can also use keyboard shortcut Ctrl/Cmd + K and search for "Create Collection".',
      },
      {
        text: 'Enter a name and optional description',
        detail: 'Choose a descriptive name that helps you identify the collection later. Add a description to provide context for clients or yourself.',
      },
      {
        text: 'Upload photos or add them later',
        detail: 'You can upload photos immediately during creation, or create an empty collection and add photos later. Supported formats: JPEG, PNG, and RAW files.',
      },
      {
        text: 'Click "Create" to finish',
        detail: 'Your collection is created and ready to customize. You\'ll be taken to the collection detail page where you can start designing.',
      },
    ],
    diagram: {
      icon: ArrowRight,
      title: 'Collection Creation Flow',
      items: [
        'Click Create Collection',
        'Enter Details',
        'Upload Photos (Optional)',
        'Collection Created',
        'Customize Design',
      ],
    },
    tips: 'Create collections with descriptive names that include the client name or event date. This makes it easier to find collections later, especially as your gallery grows.',
  },
  {
    id: 2,
    title: 'Designing Your Collection',
    icon: Palette,
    iconBg: 'bg-purple-500',
    intro: 'The design settings let you create a unique look for each collection. You can customize every visual aspect to match your brand or the client\'s preferences.',
    steps: [
      {
        text: 'Select your collection from the list',
        detail: 'Click on any collection in your collections list to open it. You\'ll see tabs for Photos, Design, Settings, and Activities.',
      },
      {
        text: 'Go to Design settings',
        detail: 'Click the "Design" tab in the collection detail view. Here you\'ll find all design customization options organized into sections.',
      },
      {
        text: 'Choose cover photo and focal point',
        detail: 'Select a cover photo that represents the collection well. Use the focal point tool to ensure important parts of the image aren\'t cropped on different screen sizes.',
      },
      {
        text: 'Customize typography, colors, and grid layout',
        detail: 'Set fonts, font sizes, and colors that match your brand. Choose grid layouts (masonry, grid, or list) that best showcase your photos. Adjust spacing and padding.',
      },
      {
        text: 'Preview your changes in real-time',
        detail: 'Use the preview button to see how your collection looks to clients. Changes are saved automatically as you make them.',
      },
    ],
    diagram: {
      icon: Palette,
      title: 'Design Customization Areas',
      items: [
        'Cover Photo & Focal Point',
        'Typography (Fonts & Sizes)',
        'Color Scheme',
        'Grid Layout & Spacing',
        'Collection Header',
      ],
    },
    tips: 'Use consistent design elements across collections to build brand recognition. Consider creating a preset with your preferred settings to speed up future collections.',
  },
  {
    id: 3,
    title: 'Sharing Collections',
    icon: Globe,
    iconBg: 'bg-green-500',
    intro: 'Sharing collections allows clients to view and download photos. You have full control over who can access your collections and what they can do.',
    steps: [
      {
        text: 'Open your collection',
        detail: 'Navigate to the collection you want to share. Make sure it\'s in the state you want clients to see before sharing.',
      },
      {
        text: 'Go to Settings > Privacy',
        detail: 'Click on the "Settings" tab, then select "Privacy" from the submenu. Here you\'ll configure who can access the collection.',
      },
      {
        text: 'Configure access settings (public, password-protected, or private)',
        detail: 'Choose Public for open access, Password Protected for secure sharing with a password, or Private for only invited users. Each option has different use cases.',
      },
      {
        text: 'Copy the share link',
        detail: 'Once privacy is configured, click "Copy Link" to get a shareable URL. You can also generate a QR code for easy mobile sharing.',
      },
      {
        text: 'Share with clients via email or link',
        detail: 'Send the link via email, messaging apps, or include it in your client communication. Clients can access the collection without creating an account.',
      },
    ],
    diagram: {
      icon: Globe,
      title: 'Sharing Options',
      items: [
        'Public Link (Anyone)',
        'Password Protected',
        'Email Invitation',
        'QR Code',
        'Embed on Website',
      ],
    },
    tips: 'For client work, use password protection to prevent unauthorized access. You can change privacy settings at any time, even after sharing.',
  },
  {
    id: 4,
    title: 'Using Presets',
    icon: Settings,
    iconBg: 'bg-pink-500',
    intro: 'Presets save your design preferences so you can apply them instantly to new collections. This ensures consistency and saves significant time.',
    steps: [
      {
        text: 'Create a design preset with your preferred settings',
        detail: 'After designing a collection, click "Save as Preset" in the Design tab. Give it a descriptive name like "Wedding Portfolio" or "Corporate Brand".',
      },
      {
        text: 'When creating a new collection, select your preset',
        detail: 'In the create collection dialog, you\'ll see a "Preset" dropdown. Select your saved preset to apply all design settings automatically.',
      },
      {
        text: 'All design settings will be applied automatically',
        detail: 'Typography, colors, grid layout, cover settings, and more are instantly applied. Your collection is ready to use with minimal customization needed.',
      },
      {
        text: 'Customize further if needed',
        detail: 'You can still modify any design element after applying a preset. Changes only affect the current collection, not the preset itself.',
      },
      {
        text: 'Save time on future collections',
        detail: 'Presets eliminate repetitive design work. Create presets for different client types or project styles to streamline your workflow.',
      },
    ],
    diagram: {
      icon: Settings,
      title: 'Preset Workflow',
      items: [
        'Design Collection',
        'Save as Preset',
        'Create New Collection',
        'Select Preset',
        'Instant Design Applied',
      ],
    },
    tips: 'Create multiple presets for different styles (e.g., "Minimalist", "Bold & Colorful", "Dark Theme"). This gives you flexibility while maintaining consistency within each style.',
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
