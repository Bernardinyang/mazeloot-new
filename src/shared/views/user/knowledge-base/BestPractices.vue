<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 p-8 md:p-12 shadow-2xl border-2 border-amber-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <Lightbulb class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Best Practices</h1>
              <p class="text-amber-100 mt-2 text-lg">Learn professional tips and tricks for managing your Memora gallery</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Overview -->
      <Card class="p-6 border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/30 dark:to-yellow-950/30">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-foreground">Professional Workflow Tips</h2>
          <p class="text-foreground/80 leading-relaxed text-lg">
            These best practices have been developed from real-world use by professional photographers. Following these guidelines will help you work more efficiently, maintain consistency, and deliver exceptional client experiences.
          </p>
        </div>
      </Card>

      <!-- Practices Grid -->
      <div class="grid gap-6">
        <Card 
          v-for="(practice, index) in practices" 
          :key="practice.id" 
          class="group p-6 space-y-4 border-2 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <div class="flex items-start gap-4">
            <div :class="['flex items-center justify-center w-14 h-14 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0', practice.iconBg]">
              <component :is="practice.icon" class="h-7 w-7 text-white" />
            </div>
            <div class="flex-1 space-y-2">
              <h2 class="text-xl font-bold text-foreground">{{ practice.title }}</h2>
              <p class="text-foreground/70 leading-relaxed">{{ practice.description }}</p>
              <ul v-if="practice.tips" class="space-y-2.5 mt-3">
                <li v-for="tip in practice.tips" :key="tip" class="flex items-start gap-2.5 text-sm text-foreground/80 hover:text-foreground transition-colors p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/20 group/tip">
                  <span class="text-amber-600 dark:text-amber-400 mt-1 font-bold group-hover/tip:scale-125 transition-transform">•</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
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
import { Lightbulb, ChevronRight, FolderOpen, Settings, Image as ImageIcon, Globe } from '@/shared/utils/lucideAnimated'

const practices = ref([
  {
    id: 1,
    title: 'Organize with Projects',
    icon: FolderOpen,
    iconBg: 'bg-blue-500',
    description: 'Use projects to organize your work by client or event. This structured approach keeps everything organized, makes workflows efficient, and helps you find specific work quickly.',
    tips: [
      'Create a project for each client or event immediately after booking',
      'Use consistent naming: "Client Name - Event Type - Date" (e.g., "Smith Wedding - 2024-06-15")',
      'Add detailed descriptions including location, special requests, and important notes',
      'Star important or active projects for quick access from your dashboard',
      'Archive completed projects to keep your active list manageable',
      'Link all related collections, selections, and proofing sessions to the project',
    ],
  },
  {
    id: 2,
    title: 'Use Design Presets',
    icon: Settings,
    iconBg: 'bg-purple-500',
    description: 'Create presets for your most common design styles to save time and maintain consistency. Presets eliminate repetitive design work and ensure your brand identity is consistent.',
    tips: [
      'Create 2-3 presets for your primary styles (e.g., "Minimalist", "Bold & Colorful", "Dark Theme")',
      'Update presets as your style evolves rather than creating new ones',
      'Apply presets and then customize individual elements for specific clients',
      'Keep preset names descriptive and clear (avoid generic names like "Preset 1")',
      'Test presets with different types of photos to ensure they work well',
      'Create client-specific presets for recurring clients with established preferences',
    ],
  },
  {
    id: 3,
    title: 'Protect Your Work',
    icon: ImageIcon,
    iconBg: 'bg-orange-500',
    description: 'Always use watermarks when sharing work-in-progress collections with clients. Watermarks protect your intellectual property while allowing clients to preview your work.',
    tips: [
      'Create watermarks with your logo or business name for brand recognition',
      'Use opacity between 30-50% - visible enough to protect, subtle enough not to distract',
      'Position watermarks strategically (center or corners) to protect key areas',
      'Use different watermarks for different purposes (client preview vs. public portfolio)',
      'Remove watermarks only after final payment is confirmed',
      'Consider creating a "Final Delivery" watermark with lower opacity for paid work',
    ],
  },
  {
    id: 4,
    title: 'Maintain Your Homepage',
    icon: Globe,
    iconBg: 'bg-cyan-500',
    description: 'Keep your public homepage updated with your latest and best work to attract new clients. A fresh homepage shows you\'re active and helps with search visibility.',
    tips: [
      'Update featured collections every 1-2 months with your newest best work',
      'Keep your about section current - update it as your style or services evolve',
      'Add new work as you complete projects to keep content fresh',
      'Ensure all links (social media, website) are accurate and working',
      'Rotate featured collections seasonally or by project type',
      'Include a call-to-action encouraging visitors to contact you',
    ],
  },
  {
    id: 5,
    title: 'Efficient Client Workflow',
    icon: FolderOpen,
    iconBg: 'bg-teal-500',
    description: 'Establish a consistent workflow from shoot to delivery. This reduces errors, saves time, and ensures nothing falls through the cracks.',
    tips: [
      'Upload and organize photos immediately after a shoot while details are fresh',
      'Create selections within 24-48 hours of the shoot for quick client review',
      'Set clear deadlines for proofing sessions to keep projects moving',
      'Use proofing for formal approval, selections for casual review',
      'Deliver final collections promptly after approval - set expectations upfront',
      'Archive completed projects but keep them accessible for future reference',
    ],
  },
  {
    id: 6,
    title: 'Client Communication',
    icon: Globe,
    iconBg: 'bg-indigo-500',
    description: 'Effective communication builds trust and prevents misunderstandings. Use Memora\'s features to keep clients informed and engaged.',
    tips: [
      'Send collection links with clear instructions on what to expect',
      'Use password protection and explain why it protects both you and the client',
      'Respond to client feedback promptly - within 24 hours when possible',
      'Set expectations upfront about revision limits and timelines',
      'Use proofing sessions for structured feedback, selections for casual sharing',
      'Follow up after delivery to ensure client satisfaction',
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
