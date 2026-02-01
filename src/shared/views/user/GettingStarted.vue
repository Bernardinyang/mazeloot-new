<template>
  <DashboardLayout>
    <template #breadcrumb> Getting Started </template>
    <template #header>
      <div class="flex items-center justify-end w-full"></div>
    </template>

    <div class="space-y-10">
      <!-- Header Section -->
      <div class="space-y-6">
        <div class="relative animate-fade-in">
          <div class="space-y-1">
            <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-gray-600 dark:text-gray-400">
              Welcome to Memora
          </h1>
            <h2 class="text-6xl md:text-5xl font-bold tracking-tight text-accent-200">
              {{ userName }}
            </h2>
          </div>
          <p class="text-sm md:text-base mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
            Let's get you started with Memora, your professional photo gallery platform.
          </p>
        </div>
        
        <!-- Progress Indicator -->
        <Card class="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg animate-fade-in-up" style="animation-delay: 100ms;">
          <div class="space-y-4">
          <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Setup Progress</span>
              </div>
              <span class="text-sm font-bold text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full bg-accent/10 dark:bg-accent/20 text-accent">
                {{ completedCount }}/{{ totalActions }} completed
              </span>
          </div>
            <div class="relative h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-inner">
              <div
                :class="[
                  'h-full rounded-full transition-all duration-700 ease-out shadow-lg',
                  progressColor,
                  'relative overflow-hidden',
                ]"
              :style="{ width: `${progressPercentage}%` }"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <p v-if="progressPercentage === 0" class="text-xs text-gray-500 dark:text-gray-400 text-center">
              Start by completing your first quick action below
            </p>
            <p v-else-if="progressPercentage < 100" class="text-xs text-gray-500 dark:text-gray-400 text-center">
              {{ totalActions - completedCount }} more {{ totalActions - completedCount === 1 ? 'action' : 'actions' }} to complete setup
            </p>
            <p v-else class="text-xs text-green-600 dark:text-green-400 font-semibold text-center">
              ✓ Setup complete! You're all set to use Memora.
            </p>
          </div>
        </Card>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
        <div class="flex items-center gap-3 animate-fade-in" style="animation-delay: 200ms;">
          <div class="p-4 rounded-lg bg-accent/10 dark:bg-accent/20">
            <Zap class="h-6 w-6 text-accent" />
          </div>
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Quick Actions</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Get started with these essential setup steps</p>
          </div>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card
            v-for="(action, index) in visibleQuickActions"
            :key="action.id"
            :class="[
              'group relative overflow-hidden cursor-pointer transition-all duration-300',
              'bg-white dark:bg-gray-900',
              'border-2 border-gray-200 dark:border-gray-800',
              'hover:border-accent/60 dark:hover:border-accent/60',
              'hover:shadow-2xl hover:shadow-accent/10 dark:hover:shadow-accent/20',
              'hover:-translate-y-2 hover:scale-[1.02]',
              'animate-fade-in-up',
            ]"
            :style="{ animationDelay: `${300 + index * 50}ms` }"
            @click="handleActionClick(action)"
          >
            <!-- Gradient Background -->
            <div
              :class="[
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                'bg-gradient-to-br from-accent/10 via-accent/5 to-transparent',
              ]"
            ></div>
            
            <div class="absolute right-4 top-4 z-10">
              <StatusBadge :status="action.status" />
            </div>
            
            <div class="relative p-6 space-y-4">
              <div class="flex flex-col items-center gap-3">
                <div
                  :class="[
                    'flex items-center justify-center w-16 h-16 rounded-xl',
                    'transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                    'shadow-lg group-hover:shadow-xl',
                    action.iconBg,
                  ]"
                >
                  <component :is="action.icon" class="h-8 w-8 text-white" />
                </div>
                <h3 class="font-bold text-base leading-tight text-center text-gray-900 dark:text-gray-100">
                      {{ action.title }}
                    </h3>
              </div>
              <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400 text-center">
                {{ action.description }}
              </p>
              <Button
                :variant="getActionVariant(action.status)"
                size="sm"
                :class="[
                  'w-full transition-all duration-300 font-semibold',
                  action.status === 'done'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'group-hover:shadow-lg group-hover:shadow-accent/30',
                ]"
                @click.stop="handleActionClick(action)"
              >
                {{ action.buttonText }}
                <ChevronRight
                  class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <!-- Knowledge Base -->
      <div class="space-y-6">
        <div class="flex items-center gap-3 animate-fade-in" style="animation-delay: 600ms;">
          <BookOpen :class="['h-6 w-6', theme.textPrimary]" />
          <h2 :class="['text-2xl font-bold', theme.textPrimary]">Knowledge Base</h2>
        </div>
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card
            v-for="(item, index) in visibleKnowledgeBase"
            :key="item.id"
            :class="[
              'group relative overflow-hidden cursor-pointer transition-all duration-300',
              'hover:shadow-xl hover:shadow-accent/10 dark:hover:shadow-accent/20',
              'hover:-translate-y-1',
              'border-2 hover:border-accent/50',
              theme.bgCard,
              theme.borderPrimary,
              'animate-fade-in-up',
            ]"
            :style="{ animationDelay: `${700 + index * 30}ms` }"
            @click="handleKnowledgeBaseClick(item)"
          >
            <!-- Gradient Background -->
            <div
              :class="[
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                'bg-gradient-to-br from-accent/5 via-transparent to-transparent',
              ]"
            ></div>
            
            <div class="relative p-6 space-y-4">
              <div
                :class="[
                  'flex items-center justify-center w-14 h-14 rounded-xl shrink-0',
                  'transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
                  'shadow-lg',
                  item.iconBg,
                ]"
              >
                <component :is="item.icon" class="h-7 w-7 text-white" />
              </div>
              <div class="space-y-2">
                <h3 :class="['font-semibold text-base', theme.textPrimary]">
                  {{ item.title }}
                </h3>
                <p :class="['text-sm leading-relaxed', theme.textSecondary]">
                  {{ item.description }}
                </p>
              </div>
              <div class="flex items-center gap-2 pt-2">
                <span :class="['text-xs font-medium', theme.textTertiary]">Learn more</span>
                <ChevronRight
                  :class="['h-4 w-4 transition-transform duration-300 group-hover:translate-x-1', theme.textTertiary]"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import {
  FolderOpen,
  Globe,
  Palette,
  Code,
  BookOpen,
  HelpCircle,
  ChevronRight,
  FolderKanban,
  CheckSquare,
  Image as ImageIcon,
  Mail,
  Settings,
  Eye,
  Star,
  FileImage,
  FileText,
  Video,
  GraduationCap,
  Lightbulb,
  MessageSquare,
  Zap,
  Shield,
  Users,
} from '@/shared/utils/lucideAnimated'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import { Button } from '@/shared/components/shadcn/button'
import StatusBadge from '@/shared/components/atoms/StatusBadge.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useUserStore } from '@/shared/stores/user'
import { useNavigation } from '@/shared/composables/useNavigation'
import { useCollectionsApi } from '@/domains/memora/api/collections'
import { useProjectsApi } from '@/domains/memora/api/projects'
import { useSelectionsApi } from '@/domains/memora/api/selections'
import { usePresetStore } from '@/domains/memora/stores/preset'
import { useWatermarkStore } from '@/domains/memora/stores/watermark'
import { useProofingApi } from '@/domains/memora/api/proofing'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'
import { apiClient } from '@/shared/api/client'

const theme = useThemeClasses()
const userStore = useUserStore()
const { hasFeature } = useMemoraFeatures()
const { navigateTo } = useNavigation()
const isStarterPlan = computed(() => (userStore.user?.memora_tier ?? 'starter') === 'starter')

const collectionsApi = useCollectionsApi()
const projectsApi = useProjectsApi()
const selectionsApi = useSelectionsApi()
const proofingApi = useProofingApi()
const rawFilesApi = useRawFilesApi()
const presetStore = usePresetStore()
const watermarkStore = useWatermarkStore()

const userName = computed(() => userStore.user?.name || 'User')

const visibleQuickActions = computed(() =>
  quickActions.value.filter(a => {
    if (a.id === 8) return hasFeature('selection')
    if (a.id === 9) return hasFeature('proofing')
    if (a.id === 10) return hasFeature('raw_files')
    if (a.id === 6) return !isStarterPlan.value
    if (a.id === 7) return !isStarterPlan.value
    return true
  })
)
const visibleKnowledgeBase = computed(() =>
  knowledgeBase.value.filter(item => {
    if (item.id === 6) return hasFeature('selection')
    if (item.id === 7) return hasFeature('proofing')
    if (item.id === 11) return hasFeature('raw_files')
    if (item.id === 8) return !isStarterPlan.value
    if (item.id === 9) return !isStarterPlan.value
    return true
  })
)

// Mark user as existing when they visit getting started
onMounted(async () => {
  if (userStore.isNewUser) {
    userStore.markUserAsExisting()
  }
  
  // Check completion status for all actions
  await checkCompletionStatus()
})

// Check completion status for each action
const checkCompletionStatus = async () => {
  try {
    // Check collections (for "Create a collection")
    const collectionsResponse = await collectionsApi.fetchCollections({ perPage: 1 })
    const collections = collectionsResponse?.data || collectionsResponse || []
    const hasCollections = collections.length > 0
    
    // Check projects (for "Create a project")
    const projectsResponse = await projectsApi.fetchProjects({ perPage: 1 })
    const projects = projectsResponse?.data || projectsResponse || []
    const hasProjects = projects.length > 0
    
    // Check selections only if user has selection feature
    let hasSelections = false
    if (hasFeature('selection')) {
      const selectionsResponse = await selectionsApi.fetchAllSelections({ perPage: 1 })
      const selections = selectionsResponse?.data || selectionsResponse || []
      hasSelections = selections.length > 0
    }

    // Check proofing only if user has proofing feature
    let hasProofing = false
    if (hasFeature('proofing')) {
      try {
        const proofingResponse = await proofingApi.fetchAllProofing({ perPage: 1 })
        const proofingList = proofingResponse?.data || proofingResponse || []
        hasProofing = Array.isArray(proofingList) ? proofingList.length > 0 : (proofingList?.length > 0)
      } catch (e) {
        if (e?.response?.status !== 404) console.warn('Failed to check proofing:', e)
      }
    }

    // Check raw files only if user has raw_files feature
    let hasRawFiles = false
    if (hasFeature('raw_files')) {
      try {
        const rawFilesResponse = await rawFilesApi.fetchAllRawFiles({ perPage: 1 })
        const rawFilesList = rawFilesResponse?.data || rawFilesResponse || []
        hasRawFiles = Array.isArray(rawFilesList) ? rawFilesList.length > 0 : (rawFilesList?.length > 0)
      } catch (e) {
        if (e?.response?.status !== 404) console.warn('Failed to check raw files:', e)
      }
    }

    // Check presets only if user has preset access (paid plan)
    let hasPresets = false
    if (!isStarterPlan.value) {
      try {
        if (presetStore.presets.length === 0 && presetStore.loadPresets) {
          await presetStore.loadPresets()
        }
        hasPresets = presetStore.presets?.length > 0
      } catch (e) {
        console.warn('Failed to check presets:', e)
      }
    }

    // Check watermarks only if user has watermark access (paid plan)
    let hasWatermarks = false
    if (!isStarterPlan.value) {
      try {
        if (watermarkStore.watermarks.length === 0 && watermarkStore.fetchWatermarks) {
          await watermarkStore.fetchWatermarks()
        }
        hasWatermarks = watermarkStore.watermarks?.length > 0
      } catch (e) {
        console.warn('Failed to check watermarks:', e)
      }
    }
    
    // Check branding (for "Customize branding" - id: 5)
    let hasBranding = false
    try {
      const brandingResponse = await apiClient.get('/v1/branding')
      hasBranding = brandingResponse?.data && Object.keys(brandingResponse.data).length > 0
    } catch (e) {
      // 404 is expected if branding not configured, other errors are logged
      if (e.response?.status !== 404) {
        console.warn('Failed to check branding:', e)
      }
    }
    
    // Check homepage (for "Setup homepage" - id: 4)
    let hasHomepage = false
    try {
      const homepageResponse = await apiClient.get('/v1/homepage')
      hasHomepage = homepageResponse?.data && Object.keys(homepageResponse.data).length > 0
    } catch (e) {
      // 404 is expected if homepage not configured, other errors are logged
      if (e.response?.status !== 404) {
        console.warn('Failed to check homepage:', e)
      }
    }
    
    // Update status for all actions
    quickActions.value.forEach(action => {
      switch (action.id) {
        case 2: // Create a collection
          action.status = hasCollections ? 'done' : 'To do'
          break
        case 3: // Create a project
          action.status = hasProjects ? 'done' : 'To do'
          break
        case 4: // Setup homepage
          action.status = hasHomepage ? 'done' : 'To do'
          break
        case 5: // Customize branding
          action.status = hasBranding ? 'done' : 'To do'
          break
        case 6: // Create a preset
          action.status = hasPresets ? 'done' : 'To do'
          break
        case 7: // Setup watermark
          action.status = hasWatermarks ? 'done' : 'To do'
          break
        case 8: // Create a selection
          action.status = hasSelections ? 'done' : 'To do'
          break
        case 9: // Create proofing
          action.status = hasProofing ? 'done' : 'To do'
          break
        case 10: // Add raw files
          action.status = hasRawFiles ? 'done' : 'To do'
          break
      }
    })
  } catch (error) {
    console.error('Failed to check completion status:', error)
    // Keep default "To do" status on error
  }
}

const quickActions = ref([
  {
    id: 2,
    title: 'Create a collection',
    description: 'Organize your photos into collections. Create empty collections or upload photos directly.',
    status: 'To do',
    icon: FolderOpen,
    iconBg: 'bg-blue-500',
    buttonText: 'Create collection >',
    route: { name: 'manageCollections' },
  },
  {
    id: 3,
    title: 'Create a project',
    description: 'Organize your work into projects for client management. Projects can be created anytime.',
    status: 'To do',
    icon: FolderKanban,
    iconBg: 'bg-orange-500',
    buttonText: 'Create project',
    route: { name: 'projects' },
  },
  {
    id: 4,
    title: 'Setup homepage',
    description: 'Configure your public Memora homepage. Showcase your work to clients independently.',
    status: 'To do',
    icon: Globe,
    iconBg: 'bg-purple-500',
    buttonText: 'Setup homepage',
    route: { name: 'homepageConfig' },
  },
  {
    id: 5,
    title: 'Customize branding',
    description: 'Personalize your gallery with custom branding and colors. Works independently.',
    status: 'To do',
    icon: Palette,
    iconBg: 'bg-green-500',
    buttonText: 'Customize branding',
    route: { name: 'brandingSettings' },
  },
  {
    id: 6,
    title: 'Create a preset',
    description: 'Save time with reusable design presets. Create presets anytime for future collections.',
    status: 'To do',
    icon: Settings,
    iconBg: 'bg-cyan-500',
    buttonText: 'Create preset',
    route: { name: 'presetSettings' },
  },
  {
    id: 7,
    title: 'Setup watermark',
    description: 'Protect your photos with watermarks. Configure independently and apply when needed.',
    status: 'To do',
    icon: ImageIcon,
    iconBg: 'bg-teal-500',
    buttonText: 'Setup watermark',
    route: { name: 'watermarkSettings' },
  },
  {
    id: 8,
    title: 'Create a selection',
    description: 'Curate your best photos into selections. Works independently from collections.',
    status: 'To do',
    icon: CheckSquare,
    iconBg: 'bg-pink-500',
    buttonText: 'Create selection',
    route: { name: 'selections' },
  },
  {
    id: 9,
    title: 'Create proofing',
    description: 'Start a proofing session for client feedback. Create from a project or from the proofing list.',
    status: 'To do',
    icon: Eye,
    iconBg: 'bg-orange-500',
    buttonText: 'Create proofing',
    route: { name: 'proofing' },
  },
  {
    id: 10,
    title: 'Add raw files',
    description: 'Store and organize RAW files. Create raw file sets and link them to collections or projects.',
    status: 'To do',
    icon: FileText,
    iconBg: 'bg-teal-500',
    buttonText: 'View raw files',
    route: { name: 'rawFiles' },
  },
])

const totalActions = computed(() => visibleQuickActions.value.length)
const completedCount = computed(() => visibleQuickActions.value.filter(a => a.status === 'done').length)
const progressPercentage = computed(() => 
  Math.round((completedCount.value / totalActions.value) * 100)
)
const progressColor = computed(() => {
  const percentage = progressPercentage.value
  if (percentage >= 75) return 'bg-green-500'
  if (percentage >= 50) return 'bg-blue-500'
  if (percentage >= 25) return 'bg-yellow-500'
  return 'bg-orange-500'
})

const knowledgeBase = ref([
  {
    id: 1,
    title: 'Documentation',
    description: 'Comprehensive documentation covering all Memora features and capabilities.',
    icon: Code,
    iconBg: 'bg-blue-500',
    route: { name: 'knowledgeBaseDocumentation' },
  },
  {
    id: 2,
    title: 'User Guides',
    description: 'Step-by-step guides to help you master every Memora feature.',
    icon: BookOpen,
    iconBg: 'bg-green-500',
    route: { name: 'knowledgeBaseUserGuides' },
  },
  {
    id: 3,
    title: 'Video Tutorials',
    description: 'Watch step-by-step video guides to master Memora features.',
    icon: Video,
    iconBg: 'bg-red-500',
    route: { name: 'knowledgeBaseVideoTutorials' },
  },
  {
    id: 4,
    title: 'Collections Guide',
    description: 'Learn how to create, design, and share photo collections with clients.',
    icon: FolderOpen,
    iconBg: 'bg-indigo-500',
    route: { name: 'knowledgeBaseCollectionsGuide' },
  },
  {
    id: 5,
    title: 'Projects & Workflow',
    description: 'Master project management and organize your work with client projects.',
    icon: FolderKanban,
    iconBg: 'bg-purple-500',
    route: { name: 'knowledgeBaseProjectsWorkflow' },
  },
  {
    id: 6,
    title: 'Selections Guide',
    description: 'Create curated selections of your best photos for client review and delivery.',
    icon: CheckSquare,
    iconBg: 'bg-yellow-500',
    route: { name: 'knowledgeBaseSelectionsGuide' },
  },
  {
    id: 7,
    title: 'Proofing & Feedback',
    description: 'Set up client proofing sessions and manage revision workflows.',
    icon: Eye,
    iconBg: 'bg-teal-500',
    route: { name: 'knowledgeBaseProofingFeedback' },
  },
  {
    id: 8,
    title: 'Design Presets',
    description: 'Create reusable design presets to save time on collection styling.',
    icon: Settings,
    iconBg: 'bg-pink-500',
    route: { name: 'knowledgeBaseDesignPresets' },
  },
  {
    id: 9,
    title: 'Watermark Protection',
    description: 'Protect your photos with custom watermarks before sharing.',
    icon: ImageIcon,
    iconBg: 'bg-orange-500',
    route: { name: 'knowledgeBaseWatermarkProtection' },
  },
  {
    id: 10,
    title: 'Homepage Setup',
    description: 'Configure your public Memora homepage to showcase your portfolio.',
    icon: Globe,
    iconBg: 'bg-cyan-500',
    route: { name: 'knowledgeBaseHomepageSetup' },
  },
  {
    id: 11,
    title: 'Raw Files Management',
    description: 'Organize and manage your RAW files alongside your processed photos.',
    icon: FileImage,
    iconBg: 'bg-emerald-500',
    route: { name: 'knowledgeBaseRawFilesManagement' },
  },
  {
    id: 12,
    title: 'FAQs',
    description: 'Frequently asked questions about Memora, everything you should know.',
    icon: HelpCircle,
    iconBg: 'bg-violet-500',
    route: { name: 'knowledgeBaseFAQs' },
  },
  {
    id: 13,
    title: 'Best Practices',
    description: 'Learn professional tips and tricks for managing your Memora gallery.',
    icon: Lightbulb,
    iconBg: 'bg-amber-500',
    route: { name: 'knowledgeBaseBestPractices' },
  },
  {
    id: 14,
    title: 'Branding & Customization',
    description: 'Personalize your Memora gallery with custom branding and design settings.',
    icon: Palette,
    iconBg: 'bg-rose-500',
    route: { name: 'knowledgeBaseBrandingCustomization' },
  },
])

const handleActionClick = action => {
  if (action.route) {
    navigateTo(action.route)
  }
}

const handleKnowledgeBaseClick = item => {
  if (item.route) {
    navigateTo(item.route)
  }
}

const getActionVariant = status => {
  switch (status) {
    case 'done':
      return 'success'
    case 'To do':
      return 'accent'
    default:
      return 'default'
  }
}
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-in-up {
    animation: none;
    opacity: 1;
  }
}
</style>
