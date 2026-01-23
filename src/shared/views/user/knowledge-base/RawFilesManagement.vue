<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-600 p-8 md:p-12 shadow-2xl border-2 border-emerald-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <FileImage class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Raw Files Management</h1>
              <p class="text-emerald-100 mt-2 text-lg">Organize and manage your RAW files alongside your processed photos</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Action Banner -->
      <ActionBanner
        title="Ready to organize your RAW files?"
        description="Manage your original files alongside processed photos"
        button-text="Go to Raw Files"
        :icon="FileImage"
        color="emerald"
        @action="navigateTo({ name: 'rawFiles' })"
      />

      <!-- Overview Section -->
      <Card class="p-6 border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/30 dark:to-green-950/30">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-foreground">What are RAW Files?</h2>
          <p class="text-foreground/80 leading-relaxed text-lg">
            RAW files are unprocessed image files directly from your camera sensor. They contain all the original data captured, giving you maximum flexibility for editing. Memora allows you to store and organize RAW files alongside your processed JPEGs, creating a complete archive of your work.
          </p>
          <div class="grid md:grid-cols-2 gap-4 mt-6">
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-emerald-200 dark:border-emerald-800">
              <div class="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Benefits</div>
              <ul class="space-y-1 text-sm text-foreground/70">
                <li>• Complete photo archive</li>
                <li>• Maximum editing flexibility</li>
                <li>• Link to processed versions</li>
                <li>• Easy retrieval for re-edits</li>
              </ul>
            </div>
            <div class="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-emerald-200 dark:border-emerald-800">
              <div class="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Supported Formats</div>
              <ul class="space-y-1 text-sm text-foreground/70">
                <li>• Canon (.CR2, .CR3)</li>
                <li>• Nikon (.NEF)</li>
                <li>• Sony (.ARW)</li>
                <li>• Fujifilm (.RAF)</li>
                <li>• And more...</li>
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
          class="group p-6 space-y-4 border-2 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <h2 class="text-xl font-bold text-foreground">{{ card.title }}</h2>
          <p class="text-foreground/70 leading-relaxed">{{ card.description }}</p>
          <div v-if="card.steps" class="space-y-3 mt-4">
            <div v-for="(step, stepIndex) in card.steps" :key="stepIndex" class="flex items-start gap-3 p-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors group/step">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white font-bold shadow-md group-hover/step:scale-110 transition-transform shrink-0">
                {{ stepIndex + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-foreground">{{ step.title }}</h3>
                <p class="text-sm text-foreground/70 mt-1">{{ step.detail }}</p>
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
import { FileImage, ChevronRight, Lightbulb } from '@/shared/utils/lucideAnimated'
import { useNavigation } from '@/shared/composables/useNavigation'

const { navigateTo } = useNavigation()

const contentCards = computed(() => [
  {
    title: 'Uploading and Organizing RAW Files',
    description: 'Upload RAW files alongside your processed photos to create a complete archive. Organize them by project or collection for easy access.',
    steps: [
      {
        title: 'Upload RAW Files',
        detail: 'When uploading photos to a collection or project, include the RAW files. Memora supports all major RAW formats including Canon (.CR2, .CR3), Nikon (.NEF), Sony (.ARW), Fujifilm (.RAF), and more.',
      },
      {
        title: 'Link to Processed Versions',
        detail: 'Associate RAW files with their processed JPEG counterparts. This creates a link between the original and final versions, making it easy to reference or re-edit later.',
      },
      {
        title: 'Organize by Project',
        detail: 'Group RAW files by project or collection. This keeps your archive organized and makes it easy to find specific files when needed. Use consistent naming conventions.',
      },
      {
        title: 'Add Metadata',
        detail: 'Tag RAW files with metadata like camera settings, location, or keywords. This helps with organization and makes searching easier as your archive grows.',
      },
      {
        title: 'Download When Needed',
        detail: 'Download original RAW files anytime for re-editing, archival purposes, or client requests. Files are stored securely and accessible whenever you need them.',
      },
    ],
    tips: 'Upload RAW files immediately after processing to keep your archive complete. Link them to processed versions right away while the connection is clear in your mind.',
  },
  {
    title: 'RAW File Workflow',
    description: 'Establish a consistent workflow for managing RAW files to keep your archive organized and accessible.',
    steps: [
      {
        title: 'Upload After Processing',
        detail: 'After processing photos and creating JPEGs, upload the corresponding RAW files. This ensures you have both versions available.',
      },
      {
        title: 'Link Files',
        detail: 'Use the linking feature to connect RAW files with their processed versions. This creates a relationship that makes it easy to find originals later.',
      },
      {
        title: 'Organize Consistently',
        detail: 'Follow a consistent organization pattern. Group by project, date, or client. Use clear naming conventions that make files easy to identify.',
      },
      {
        title: 'Archive Old Projects',
        detail: 'For completed projects, consider archiving RAW files while keeping processed versions accessible. This helps manage storage while preserving originals.',
      },
    ],
    tips: 'Create a standard workflow: Process → Upload JPEGs → Upload RAW files → Link → Organize. Consistency saves time and prevents lost files.',
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
