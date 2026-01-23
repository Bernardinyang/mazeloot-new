<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 p-8 md:p-12 shadow-2xl border-2 border-blue-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <Code class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Documentation</h1>
              <p class="text-blue-100 mt-2 text-lg">Comprehensive documentation covering all Memora features and capabilities</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Content Sections -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card 
          v-for="(section, index) in sections" 
          :key="section.id" 
          class="group p-6 space-y-4 border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <div class="flex items-center gap-3">
            <div :class="['flex items-center justify-center w-12 h-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300', section.iconBg]">
              <component :is="section.icon" class="h-6 w-6 text-white" />
            </div>
            <h3 class="font-semibold text-lg text-foreground">{{ section.title }}</h3>
          </div>
          <p class="text-sm text-foreground/70 leading-relaxed">{{ section.description }}</p>
          <div class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:gap-3 transition-all">
            <span>Learn more</span>
            <ChevronRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Card>
      </div>

      <!-- Quick Links -->
      <Card class="p-6 border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
        <h2 class="text-xl font-bold mb-4 text-foreground">Quick Links</h2>
        <div class="grid gap-3 md:grid-cols-2">
          <router-link
            v-for="link in quickLinks"
            :key="link.name"
            :to="link.route"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
          >
            <component :is="link.icon" class="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <span class="font-medium text-foreground">{{ link.title }}</span>
            <ChevronRight class="h-4 w-4 ml-auto text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>
      </Card>
    </div>
  </KnowledgeBaseLayout>
</template>

<script setup>
import { ref } from 'vue'
import KnowledgeBaseLayout from '@/shared/layouts/KnowledgeBaseLayout.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import { Code, ChevronRight, BookOpen, Video, FolderOpen, FolderKanban, CheckSquare, Eye, Settings, Image as ImageIcon, Globe, FileImage, HelpCircle, Lightbulb, Palette } from '@/shared/utils/lucideAnimated'

const sections = ref([
  {
    id: 1,
    title: 'Getting Started',
    description: 'Learn the basics of Memora and how to set up your account.',
    icon: BookOpen,
    iconBg: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Collections',
    description: 'Create, design, and share beautiful photo collections with your clients.',
    icon: FolderOpen,
    iconBg: 'bg-indigo-500',
  },
  {
    id: 3,
    title: 'Projects',
    description: 'Organize your work into projects and manage client workflows.',
    icon: FolderKanban,
    iconBg: 'bg-purple-500',
  },
  {
    id: 4,
    title: 'Selections',
    description: 'Curate selections of your best photos for client review.',
    icon: CheckSquare,
    iconBg: 'bg-yellow-500',
  },
  {
    id: 5,
    title: 'Proofing',
    description: 'Set up client proofing sessions and manage feedback.',
    icon: Eye,
    iconBg: 'bg-teal-500',
  },
  {
    id: 6,
    title: 'Settings',
    description: 'Customize your Memora experience with presets, watermarks, and branding.',
    icon: Settings,
    iconBg: 'bg-pink-500',
  },
])

const quickLinks = ref([
  { title: 'User Guides', route: { name: 'knowledgeBaseUserGuides' }, icon: BookOpen },
  { title: 'Video Tutorials', route: { name: 'knowledgeBaseVideoTutorials' }, icon: Video },
  { title: 'Collections Guide', route: { name: 'knowledgeBaseCollectionsGuide' }, icon: FolderOpen },
  { title: 'Projects & Workflow', route: { name: 'knowledgeBaseProjectsWorkflow' }, icon: FolderKanban },
  { title: 'FAQs', route: { name: 'knowledgeBaseFAQs' }, icon: HelpCircle },
  { title: 'Best Practices', route: { name: 'knowledgeBaseBestPractices' }, icon: Lightbulb },
])
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceSubtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
