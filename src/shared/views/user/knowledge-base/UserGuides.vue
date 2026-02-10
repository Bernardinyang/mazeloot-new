<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 p-4 sm:p-8 md:p-12 shadow-2xl border-2 border-green-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <BookOpen class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">User Guides</h1>
              <p class="text-green-100 mt-2 text-lg">Step-by-step guides to help you master every Memora feature</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Guides Grid -->
      <div class="grid gap-6">
        <Card 
          v-for="(guide, index) in guides" 
          :key="guide.id" 
          class="group p-4 sm:p-6 space-y-4 border-2 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <div class="flex items-start gap-4">
            <div :class="['flex items-center justify-center w-14 h-14 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0', guide.iconBg]">
              <component :is="guide.icon" class="h-7 w-7 text-white" />
            </div>
            <div class="flex-1 space-y-2">
              <h3 class="font-semibold text-lg text-foreground">{{ guide.title }}</h3>
              <p class="text-sm text-foreground/70">{{ guide.description }}</p>
              <div class="flex flex-wrap gap-2 mt-3">
                <Badge v-for="tag in guide.tags" :key="tag" variant="secondary" class="hover:scale-105 transition-transform">{{ tag }}</Badge>
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
import { Badge } from '@/shared/components/shadcn/badge'
import { BookOpen, ChevronRight, FolderOpen, FolderKanban, CheckSquare, Eye, Settings, Image as ImageIcon, Globe, FileImage } from '@/shared/utils/lucideAnimated'

const guides = ref([
  {
    id: 1,
    title: 'Creating Your First Collection',
    description: 'Learn how to create, upload photos, and customize your first photo collection in Memora.',
    icon: FolderOpen,
    iconBg: 'bg-blue-500',
    tags: ['Collections', 'Getting Started'],
  },
  {
    id: 2,
    title: 'Setting Up Projects',
    description: 'Organize your work into projects and manage client workflows effectively.',
    icon: FolderKanban,
    iconBg: 'bg-purple-500',
    tags: ['Projects', 'Workflow'],
  },
  {
    id: 3,
    title: 'Creating Selections',
    description: 'Curate your best photos into selections for client review and delivery.',
    icon: CheckSquare,
    iconBg: 'bg-yellow-500',
    tags: ['Selections', 'Client Delivery'],
  },
  {
    id: 4,
    title: 'Client Proofing Setup',
    description: 'Set up proofing sessions, manage client feedback, and handle revisions.',
    icon: Eye,
    iconBg: 'bg-teal-500',
    tags: ['Proofing', 'Client Feedback'],
  },
  {
    id: 5,
    title: 'Design Presets',
    description: 'Create reusable design presets to save time on collection styling.',
    icon: Settings,
    iconBg: 'bg-pink-500',
    tags: ['Presets', 'Design'],
  },
  {
    id: 6,
    title: 'Watermark Setup',
    description: 'Protect your photos with custom watermarks before sharing with clients.',
    icon: ImageIcon,
    iconBg: 'bg-orange-500',
    tags: ['Watermarks', 'Protection'],
  },
  {
    id: 7,
    title: 'Homepage Configuration',
    description: 'Configure your public Memora homepage to showcase your portfolio.',
    icon: Globe,
    iconBg: 'bg-cyan-500',
    tags: ['Homepage', 'Portfolio'],
  },
  {
    id: 8,
    title: 'Raw Files Management',
    description: 'Organize and manage your RAW files alongside processed photos.',
    icon: FileImage,
    iconBg: 'bg-emerald-500',
    tags: ['Raw Files', 'Organization'],
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
