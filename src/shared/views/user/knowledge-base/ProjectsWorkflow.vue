<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 p-8 md:p-12 shadow-2xl border-2 border-purple-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <FolderKanban class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Projects & Workflow</h1>
              <p class="text-purple-100 mt-2 text-lg">Master project management and organize your work with client projects</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Action Banner -->
      <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 p-6 border-2 border-purple-200/50 dark:border-purple-800/50 shadow-lg">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <h3 class="text-lg font-bold text-purple-900 dark:text-purple-100">Ready to create a project?</h3>
            <p class="text-sm text-purple-700 dark:text-purple-300">Organize your work and manage client workflows</p>
          </div>
          <Button @click="navigateTo({ name: 'projects' })" variant="primary" size="lg" class="group shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <FolderKanban class="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
            Go to Projects
            <ChevronRight class="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      <!-- Overview Section -->
      <Card class="p-6 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-foreground">Understanding Projects & Workflow</h2>
          <p class="text-foreground/80 leading-relaxed text-lg">
            Projects in Memora help you organize your entire client workflow from start to finish. Each project contains multiple phases: Selections for curation, Proofing for client approval, and Collections for final delivery. This structured approach ensures nothing falls through the cracks and keeps your work organized.
          </p>
          
          <!-- Workflow Diagram -->
          <div class="mt-6 p-6 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-purple-200 dark:border-purple-800">
            <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ArrowRight class="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Complete Workflow Process
            </h3>
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="flex-1 text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-300 dark:border-yellow-700">
                <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">1. Selections</div>
                <div class="text-sm text-foreground/70">Curate photos</div>
                <div class="text-xs text-foreground/60 mt-1">Client reviews</div>
              </div>
              <ArrowRight class="h-6 w-6 text-purple-500 dark:text-purple-400 hidden md:block" />
              <div class="flex-1 text-center p-4 rounded-lg bg-teal-50 dark:bg-teal-950/30 border-2 border-teal-300 dark:border-teal-700">
                <div class="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">2. Proofing</div>
                <div class="text-sm text-foreground/70">Get approval</div>
                <div class="text-xs text-foreground/60 mt-1">Track revisions</div>
              </div>
              <ArrowRight class="h-6 w-6 text-purple-500 dark:text-purple-400 hidden md:block" />
              <div class="flex-1 text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-300 dark:border-blue-700">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">3. Collections</div>
                <div class="text-sm text-foreground/70">Deliver final</div>
                <div class="text-xs text-foreground/60 mt-1">Share & download</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Workflow Phases -->
      <div class="grid gap-6">
        <Card 
          v-for="(phase, index) in workflowPhases" 
          :key="phase.id" 
          class="group p-6 space-y-4 border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <div class="flex items-center gap-4">
            <div :class="['flex items-center justify-center w-14 h-14 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300', phase.iconBg]">
              <component :is="phase.icon" class="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-foreground">{{ phase.title }}</h2>
              <p class="text-sm text-muted-foreground">{{ phase.description }}</p>
            </div>
          </div>
          <p v-if="phase.intro" class="text-foreground/70 leading-relaxed pl-18">{{ phase.intro }}</p>
          <div class="space-y-3 pl-18">
            <div v-for="(item, itemIndex) in phase.items" :key="itemIndex" class="flex items-start gap-3 group/item hover:bg-muted/50 p-2 rounded-lg transition-colors">
              <div class="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold shadow-md group-hover/item:scale-110 transition-transform shrink-0">
                {{ itemIndex + 1 }}
              </div>
              <div class="flex-1">
                <p class="text-sm text-foreground/80 leading-relaxed">{{ item.text }}</p>
                <p v-if="item.detail" class="text-xs text-foreground/60 mt-1">{{ item.detail }}</p>
              </div>
            </div>
          </div>
          <div v-if="phase.tips" class="mt-4 pl-18">
            <div class="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <div class="flex items-start gap-2 mb-2">
                <Lightbulb class="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                <span class="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Pro Tip</span>
              </div>
              <p class="text-sm text-yellow-800 dark:text-yellow-200">{{ phase.tips }}</p>
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
import { FolderKanban, ChevronRight, CheckSquare, Eye, FolderOpen, ArrowRight, Lightbulb } from '@/shared/utils/lucideAnimated'
import { useNavigation } from '@/shared/composables/useNavigation'

const { navigateTo } = useNavigation()

const workflowPhases = ref([
  {
    id: 1,
    title: 'Selections Phase',
    description: 'Curate your best photos',
    icon: CheckSquare,
    iconBg: 'bg-yellow-500',
    intro: 'The Selections phase is where you curate your best work from a shoot or project. Create multiple selections to organize photos by category, theme, or purpose.',
    items: [
      {
        text: 'Create selections from your photos',
        detail: 'Start by uploading photos to your project or selecting existing photos from your media library. Create a new selection and add photos that fit a specific theme or category.',
      },
      {
        text: 'Organize by category or theme',
        detail: 'Create multiple selections for different purposes: "Portraits", "Details", "Candid Moments", etc. This helps clients navigate and understand your work better.',
      },
      {
        text: 'Share with clients for review',
        detail: 'Generate shareable links for each selection. Clients can view selections without creating an account, making the review process seamless.',
      },
      {
        text: 'Collect client feedback',
        detail: 'Clients can mark photos as favorites, leave comments, or request specific edits. All feedback is tracked and visible in your dashboard.',
      },
    ],
    tips: 'Create selections immediately after a shoot while the work is fresh in your mind. This helps you identify the strongest images and speeds up the curation process.',
  },
  {
    id: 2,
    title: 'Proofing Phase',
    description: 'Get client approval',
    icon: Eye,
    iconBg: 'bg-teal-500',
    intro: 'The Proofing phase ensures clients approve final images before delivery. This is crucial for managing expectations and avoiding revisions after final delivery.',
    items: [
      {
        text: 'Set up proofing sessions',
        detail: 'Create a proofing session from approved selections. Configure deadlines, revision limits, and approval requirements. Clients receive notifications when proofing is ready.',
      },
      {
        text: 'Manage revision requests',
        detail: 'Clients can request specific changes or mark images for revision. Track all requests in one place and update the status as you complete them.',
      },
      {
        text: 'Track approval status',
        detail: 'Monitor which images are approved, pending, or need revision. Use filters to see only approved images or items requiring attention.',
      },
      {
        text: 'Handle client feedback',
        detail: 'Respond to comments directly in the proofing interface. Mark feedback as resolved when addressed, keeping communication organized.',
      },
    ],
    tips: 'Set clear deadlines for proofing sessions to keep projects moving. Use revision limits to prevent scope creep and manage client expectations effectively.',
  },
  {
    id: 3,
    title: 'Collections Phase',
    description: 'Deliver final work',
    icon: FolderOpen,
    iconBg: 'bg-blue-500',
    intro: 'The Collections phase is where you deliver the final, approved work to clients. Create beautifully designed galleries that showcase your work professionally.',
    items: [
      {
        text: 'Create final collections',
        detail: 'Build collections from approved proofing images. Apply your brand design, customize layouts, and create a professional presentation that reflects your style.',
      },
      {
        text: 'Apply watermarks if needed',
        detail: 'Add watermarks to protect your work before final payment. Configure watermark opacity, position, and style to match your brand.',
      },
      {
        text: 'Configure download settings',
        detail: 'Set download permissions, file sizes, and formats. Control whether clients can download individual images or require full collection downloads.',
      },
      {
        text: 'Share with clients',
        detail: 'Generate secure share links or send email invitations. Clients can view and download final images according to your configured settings.',
      },
    ],
    tips: 'Create collections with consistent design across projects to build brand recognition. Use presets to speed up the design process while maintaining quality.',
  },
])
</script>
