<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 p-8 md:p-12 shadow-2xl border-2 border-yellow-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <CheckSquare class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Selections Guide</h1>
              <p class="text-yellow-100 mt-2 text-lg">Create curated selections of your best photos for client review and delivery</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Action Banner -->
      <ActionBanner
        title="Ready to create a selection?"
        description="Curate your best photos and share them with clients"
        button-text="Go to Selections"
        :icon="CheckSquare"
        color="yellow"
        @action="navigateTo({ name: 'selections' })"
      />

      <!-- Overview Section -->
      <Card class="p-6 border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/30 dark:to-orange-950/30">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-foreground">What are Selections?</h2>
          <p class="text-foreground/80 leading-relaxed text-lg">
            Selections are curated groups of photos that you organize for client review. Unlike collections which are final galleries, selections are working sets used during the editing and approval process. They help you present your best work to clients in an organized, manageable format.
          </p>
          <div class="grid md:grid-cols-2 gap-4 mt-6">
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-yellow-200 dark:border-yellow-800">
              <div class="text-lg font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Use Cases</div>
              <ul class="space-y-1 text-sm text-foreground/70">
                <li>• Initial client review after a shoot</li>
                <li>• Organizing photos by category</li>
                <li>• Creating themed groups</li>
                <li>• Pre-proofing curation</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-yellow-200 dark:border-yellow-800">
              <div class="text-lg font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Benefits</div>
              <ul class="space-y-1 text-sm text-foreground/70">
                <li>• Streamlined client review process</li>
                <li>• Better organization of large shoots</li>
                <li>• Easy feedback collection</li>
                <li>• Track client preferences</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <!-- Content Sections -->
      <div class="grid gap-6">
        <Card 
          v-for="(section, index) in sections" 
          :key="section.id" 
          class="group p-6 space-y-4 border-2 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <div class="flex items-center gap-3 mb-2">
            <component v-if="section.icon" :is="section.icon" :class="['h-6 w-6', section.iconColor]" />
            <h2 class="text-xl font-bold text-foreground">{{ section.title }}</h2>
          </div>
          <p class="text-foreground/70 leading-relaxed">{{ section.description }}</p>
          <div v-if="section.steps" class="space-y-3 mt-4">
            <div v-for="(step, stepIndex) in section.steps" :key="stepIndex" class="flex items-start gap-3 p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-colors group/step">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-bold shadow-md group-hover/step:scale-110 transition-transform shrink-0">
                {{ stepIndex + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-foreground">{{ step.title }}</h3>
                <p class="text-sm text-foreground/70 mt-1">{{ step.detail }}</p>
              </div>
            </div>
          </div>
          <div v-if="section.diagram" class="mt-4 p-4 rounded-lg bg-muted/50 border border-yellow-200 dark:border-yellow-800">
            <div class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <ArrowRight class="h-4 w-4" />
              {{ section.diagram.title }}
            </div>
            <div class="space-y-2">
              <div v-for="(item, idx) in section.diagram.items" :key="idx" class="flex items-center gap-2 text-sm">
                <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span class="text-foreground/70">{{ item }}</span>
              </div>
            </div>
          </div>
          <div v-if="section.tips" class="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
            <div class="flex items-start gap-2 mb-2">
              <Lightbulb class="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              <span class="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Pro Tip</span>
            </div>
            <p class="text-sm text-yellow-800 dark:text-yellow-200">{{ section.tips }}</p>
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
import ActionBanner from '@/shared/components/molecules/ActionBanner.vue'
import { CheckSquare, ChevronRight, Upload, Share2, Lightbulb, ArrowRight, FolderOpen } from '@/shared/utils/lucideAnimated'
import { useNavigation } from '@/shared/composables/useNavigation'

const { navigateTo } = useNavigation()

const sections = ref([
  {
    id: 1,
    title: 'Creating Selections',
    icon: Upload,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    description: 'Selections start with choosing the right photos. You can create selections from existing photos in your library or upload new ones specifically for a selection.',
    steps: [
      {
        title: 'Navigate to Selections',
        detail: 'Go to the Selections section from your main navigation. Click "Create Selection" to start a new selection.',
      },
      {
        title: 'Choose Your Photos',
        detail: 'Browse your media library or upload new photos. You can select photos from multiple sources including existing collections, projects, or your full library.',
      },
      {
        title: 'Organize and Categorize',
        detail: 'Give your selection a descriptive name and optional description. Consider organizing by theme (e.g., "Portraits", "Details", "Candid Moments") or by purpose.',
      },
      {
        title: 'Add Metadata',
        detail: 'Optionally add tags, descriptions, or other metadata to help organize and search your selections later.',
      },
      {
        title: 'Save Your Selection',
        detail: 'Click "Create" to save your selection. You can add or remove photos later as needed.',
      },
    ],
    diagram: {
      title: 'Selection Creation Flow',
      items: [
        'Choose Photos',
        'Organize & Name',
        'Add Metadata',
        'Save Selection',
        'Share with Client',
      ],
    },
    tips: 'Create selections immediately after a shoot while your memory is fresh. This helps you identify the strongest images quickly and speeds up your workflow.',
  },
  {
    id: 2,
    title: 'Organizing Selections',
    icon: FolderOpen,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    description: 'Effective organization makes it easier to manage multiple selections and helps clients navigate your work. Use consistent naming conventions and logical grouping.',
    steps: [
      {
        title: 'Use Consistent Naming',
        detail: 'Follow a naming pattern like "Client Name - Event Type - Category" (e.g., "Smith Wedding - Ceremony - Portraits"). This makes selections easy to find.',
      },
      {
        title: 'Group by Project',
        detail: 'Associate selections with projects to keep related work together. This helps track progress and maintain context.',
      },
      {
        title: 'Create Categories',
        detail: 'Use categories or tags to group selections by type, client, or purpose. This enables quick filtering and organization.',
      },
      {
        title: 'Limit Selection Size',
        detail: 'Keep selections focused. Aim for 20-50 photos per selection to avoid overwhelming clients and maintain clarity.',
      },
    ],
    tips: 'Create a master selection template with your preferred organization structure. This ensures consistency across all your projects.',
  },
  {
    id: 3,
    title: 'Sharing Selections',
    icon: Share2,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    description: 'Sharing selections allows clients to review your work and provide feedback. Memora provides multiple sharing options to suit different workflows.',
    steps: [
      {
        title: 'Generate Share Link',
        detail: 'Open your selection and click "Share". Generate a unique, secure link that clients can access without creating an account.',
      },
      {
        title: 'Configure Access Settings',
        detail: 'Set privacy options: Public (anyone with link), Password Protected (requires password), or Private (invited users only).',
      },
      {
        title: 'Set Expiration (Optional)',
        detail: 'Configure link expiration dates to automatically revoke access after a set period. Useful for time-sensitive projects.',
      },
      {
        title: 'Send to Clients',
        detail: 'Copy the link or send it directly via email. Clients receive a clean, professional interface to view and interact with your photos.',
      },
      {
        title: 'Track Engagement',
        detail: 'Monitor which photos clients view, favorite, or comment on. This helps you understand client preferences and priorities.',
      },
    ],
    diagram: {
      title: 'Sharing Options',
      items: [
        'Public Link',
        'Password Protected',
        'Email Invitation',
        'QR Code',
        'Embed Widget',
      ],
    },
    tips: 'For client work, always use password protection. Include the password in a separate email or message for added security.',
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
