<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-pink-600 p-4 sm:p-8 md:p-12 shadow-2xl border-2 border-red-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <Video class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Video Tutorials</h1>
              <p class="text-red-100 mt-2 text-lg">Watch step-by-step video guides to master Memora features</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Tutorials Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card 
          v-for="(tutorial, index) in tutorials" 
          :key="tutorial.id" 
          class="group border-2 hover:border-red-400 dark:hover:border-red-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden bg-card"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <!-- Video Container -->
          <div class="aspect-video relative overflow-hidden bg-black rounded-t-lg group-hover:shadow-lg transition-shadow duration-300">
            <iframe
              v-if="tutorial.youtubeId"
              :src="`https://www.youtube.com/embed/${tutorial.youtubeId}?rel=0&modestbranding=1&showinfo=0`"
              :title="tutorial.title"
              class="absolute inset-0 w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <!-- Fallback for videos without ID -->
            <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/20 via-red-800/20 to-pink-900/20">
              <div class="relative">
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-white/30">
                  <Video class="h-12 w-12 text-white" />
                </div>
                <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div class="h-full bg-white/60 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <!-- Duration Badge -->
            <div v-if="tutorial.duration" class="absolute bottom-3 right-3 z-10">
              <Badge class="bg-black/80 text-white shadow-xl backdrop-blur-md border border-white/20 font-semibold px-2.5 py-1">
                <Clock class="h-3 w-3 mr-1 inline" />
                {{ tutorial.duration }}
              </Badge>
            </div>
            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none"></div>
          </div>
          
          <!-- Content -->
          <div class="p-5 space-y-3 bg-card">
            <div class="space-y-2">
              <h3 class="font-bold text-lg text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300 line-clamp-2">
                {{ tutorial.title }}
              </h3>
              <p class="text-sm text-foreground/70 leading-relaxed line-clamp-2">
                {{ tutorial.description }}
              </p>
            </div>
            
            <!-- Topics -->
            <div v-if="tutorial.topics" class="flex flex-wrap gap-1.5 pt-2 border-t border-border">
              <Badge 
                v-for="topic in tutorial.topics" 
                :key="topic" 
                variant="outline" 
                class="text-xs px-2 py-0.5 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                {{ topic }}
              </Badge>
            </div>
            
            <!-- Watch Button -->
            <Button
              variant="outline"
              size="sm"
              class="w-full mt-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-700 group/btn"
            >
              <Play class="h-4 w-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
              Watch Tutorial
              <ChevronRight class="h-4 w-4 ml-auto group-hover/btn:translate-x-1 transition-transform" />
            </Button>
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
import { Video, ChevronRight, Play, Clock } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'

const tutorials = ref([
  {
    id: 1,
    title: 'Getting Started with Memora',
    description: 'Introduction to Memora and basic setup. Learn how to navigate the platform, create your account, and understand the core features.',
    duration: '5:30',
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    topics: ['Getting Started', 'Setup', 'Navigation'],
  },
  {
    id: 2,
    title: 'Creating Collections',
    description: 'Learn how to create and customize photo collections. Master uploading photos, organizing content, and designing beautiful galleries.',
    duration: '8:15',
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    topics: ['Collections', 'Upload', 'Design'],
  },
  {
    id: 3,
    title: 'Project Management',
    description: 'Organize your work with projects and workflows. Understand how to structure client work, manage selections, proofing, and final delivery.',
    duration: '10:45',
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    topics: ['Projects', 'Workflow', 'Organization'],
  },
  {
    id: 4,
    title: 'Client Proofing',
    description: 'Set up proofing sessions and manage feedback. Learn how to create proofing workflows, track approvals, and handle revisions.',
    duration: '7:20',
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    topics: ['Proofing', 'Feedback', 'Approval'],
  },
  {
    id: 5,
    title: 'Design Presets',
    description: 'Create and use design presets to save time. Master preset creation, application, and customization for consistent branding.',
    duration: '6:10',
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    topics: ['Presets', 'Design', 'Branding'],
  },
  {
    id: 6,
    title: 'Watermark Protection',
    description: 'Protect your photos with custom watermarks. Learn how to create watermarks, configure settings, and apply them to collections.',
    duration: '4:50',
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    topics: ['Watermarks', 'Protection', 'Security'],
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
