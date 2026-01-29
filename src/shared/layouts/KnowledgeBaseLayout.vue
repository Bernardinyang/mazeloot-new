<template>
  <div :class="['min-h-screen', theme.bgPage]">
    <!-- Top Bar -->
    <div :class="['sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:backdrop-blur-md', theme.bgHeader, theme.borderPrimary, 'shadow-sm']">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-3">
            <router-link
              to="/"
              class="hidden lg:flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <MazelootLogo size="sm" />
            </router-link>
            <div class="h-6 w-px bg-border hidden lg:block"></div>
            <Button
              variant="ghost"
              size="sm"
              @click="navigateTo({ name: 'gettingStarted' })"
              :class="[theme.textPrimary, theme.bgButtonHover, theme.transition, 'group']"
            >
              <ArrowLeft class="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span class="hidden sm:inline">Back to Getting Started</span>
              <span class="sm:hidden">Back</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              @click="sidebarOpen = !sidebarOpen"
              :class="[theme.textPrimary, theme.bgButtonHover, theme.transition, 'lg:hidden']"
            >
              <Menu class="h-4 w-4" />
            </Button>
          </div>
          <div class="flex items-center gap-2">
            <ThemeToggle />
            <Button
              v-if="previousRoute"
              variant="outline"
              size="sm"
              @click="navigateTo(previousRoute)"
              :class="[theme.borderSecondary, theme.textPrimary, theme.bgButtonHover, theme.transition, 'group']"
            >
              <ChevronLeft class="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              <span class="hidden sm:inline">Previous</span>
            </Button>
            <Button
              v-if="nextRoute"
              variant="outline"
              size="sm"
              @click="navigateTo(nextRoute)"
              :class="[theme.borderSecondary, theme.textPrimary, theme.bgButtonHover, theme.transition, 'group']"
            >
              <span class="hidden sm:inline">Next</span>
              <ChevronRight class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <div class="flex flex-col min-h-[calc(100vh-57px)]">
      <div class="flex flex-1">
        <!-- Sidebar -->
        <aside
          :class="[
            'fixed lg:static inset-y-0 left-0 z-40 w-64 border-r transform transition-transform duration-300 ease-in-out',
            'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            'lg:sticky top-0 h-screen overflow-y-auto flex flex-col',
            'shadow-xl lg:shadow-none',
          ]"
        >
          <!-- Sidebar Header -->
          <div class="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div class="flex items-center justify-between mb-1">
              <h2 class="text-base font-bold text-gray-900 dark:text-gray-100">Knowledge Base</h2>
              <Button
                variant="ghost"
                size="sm"
                @click="sidebarOpen = false"
                class="lg:hidden h-7 w-7 p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <ChevronLeft class="h-4 w-4" />
              </Button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Explore guides & tutorials</p>
          </div>

          <!-- Navigation Items -->
          <div class="flex-1 p-3 space-y-1 overflow-y-auto">
            <router-link
              v-for="item in knowledgeBaseItems"
              :key="item.name"
              :to="{ name: item.name }"
              @click="sidebarOpen = false"
              :class="[
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                'relative overflow-hidden',
                isActive(item.name)
                  ? [
                      'bg-accent text-white shadow-lg shadow-accent/20',
                      'dark:bg-accent dark:text-white',
                      'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white/30',
                    ]
                  : [
                      'text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-100 dark:hover:bg-gray-800',
                      'hover:text-gray-900 dark:hover:text-gray-100',
                      'hover:translate-x-1',
                    ],
              ]"
            >
              <component
                :is="item.icon"
                :class="[
                  'h-4 w-4 shrink-0 transition-transform duration-200',
                  isActive(item.name)
                    ? 'text-white'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200',
                  'group-hover:scale-110',
                ]"
              />
              <span class="truncate flex-1">{{ item.title }}</span>
              <ChevronRight
                v-if="isActive(item.name)"
                class="h-3 w-3 shrink-0 text-white/70 ml-auto"
              />
            </router-link>
          </div>

          <!-- Sidebar Footer -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div class="flex items-center justify-center py-2">
              <MazelootLogo size="sm" />
            </div>
            <p class="text-xs text-center mt-2 text-gray-500 dark:text-gray-400 font-medium">
              Powered by Mazeloot
            </p>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0 flex flex-col" :class="theme.bgPage">
          <div class="flex-1 w-full px-4 py-6 lg:px-8">
            <div class="mx-auto max-w-5xl xl:max-w-6xl">
              <slot />
            </div>
          </div>
          
          <!-- Footer -->
          <footer class="border-t border-gray-200 dark:border-gray-800 mt-auto w-full bg-white dark:bg-gray-950">
            <div class="w-full px-4 py-6 lg:px-8">
              <div class="text-center text-sm text-gray-600 dark:text-gray-400">
                © {{ new Date().getFullYear() }} Mazeloot Inc. All rights reserved.
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/shared/components/shadcn/button'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import { ArrowLeft, ChevronLeft, ChevronRight, Menu, BookOpen, Video, FolderOpen, FolderKanban, CheckSquare, Eye, Settings, Image as ImageIcon, Globe, FileImage, HelpCircle, Lightbulb, Palette, Code } from '@/shared/utils/lucideAnimated'
import { useNavigation } from '@/shared/composables/useNavigation'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

const route = useRoute()
const { navigateTo } = useNavigation()
const sidebarOpen = ref(false)

watch(() => route.name, () => {
  sidebarOpen.value = false
})

const knowledgeBaseItems = [
  { name: 'knowledgeBaseDocumentation', title: 'Documentation', icon: Code },
  { name: 'knowledgeBaseUserGuides', title: 'User Guides', icon: BookOpen },
  { name: 'knowledgeBaseVideoTutorials', title: 'Video Tutorials', icon: Video },
  { name: 'knowledgeBaseCollectionsGuide', title: 'Collections Guide', icon: FolderOpen },
  { name: 'knowledgeBaseProjectsWorkflow', title: 'Projects & Workflow', icon: FolderKanban },
  { name: 'knowledgeBaseSelectionsGuide', title: 'Selections Guide', icon: CheckSquare },
  { name: 'knowledgeBaseProofingFeedback', title: 'Proofing & Feedback', icon: Eye },
  { name: 'knowledgeBaseDesignPresets', title: 'Design Presets', icon: Settings },
  { name: 'knowledgeBaseWatermarkProtection', title: 'Watermark Protection', icon: ImageIcon },
  { name: 'knowledgeBaseHomepageSetup', title: 'Homepage Setup', icon: Globe },
  { name: 'knowledgeBaseRawFilesManagement', title: 'Raw Files Management', icon: FileImage },
  { name: 'knowledgeBaseBrandingCustomization', title: 'Branding & Customization', icon: Palette },
  { name: 'knowledgeBaseFAQs', title: 'FAQs', icon: HelpCircle },
  { name: 'knowledgeBaseBestPractices', title: 'Best Practices', icon: Lightbulb },
]

const currentIndex = computed(() => {
  return knowledgeBaseItems.findIndex(item => item.name === route.name)
})

const previousRoute = computed(() => {
  if (currentIndex.value > 0) {
    return { name: knowledgeBaseItems[currentIndex.value - 1].name }
  }
  return null
})

const nextRoute = computed(() => {
  if (currentIndex.value >= 0 && currentIndex.value < knowledgeBaseItems.length - 1) {
    return { name: knowledgeBaseItems[currentIndex.value + 1].name }
  }
  return null
})

const isActive = (name) => {
  return route.name === name
}
</script>

<style scoped>
/* Smooth scrolling for sidebar with better contrast */
aside {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.dark aside {
  scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
}

.light aside {
  scrollbar-color: rgba(107, 114, 128, 0.3) transparent;
}

aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.dark aside::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.4);
}

.light aside::-webkit-scrollbar-thumb {
  background-color: rgba(107, 114, 128, 0.3);
}

aside::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

.dark aside::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.6);
}

.light aside::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.5);
}
</style>
