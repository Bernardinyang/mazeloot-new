<template>
  <DashboardLayout>
    <template #breadcrumb> Getting Started </template>
    <template #header>
      <div class="flex items-center justify-end w-full"></div>
    </template>

    <div class="space-y-10">
      <!-- Header Section -->
      <div class="space-y-4">
        <div>
          <h1 class="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to Memora, {{ userName }}
          </h1>
          <p :class="['text-lg mt-2', theme.textSecondary]">Let's get you started on your photography journey.</p>
        </div>
        
        <!-- Progress Indicator -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span :class="['text-sm font-medium', theme.textPrimary]">Setup Progress</span>
            <span :class="['text-sm font-semibold', theme.textPrimary]">{{ completedCount }}/{{ totalActions }} completed</span>
          </div>
          <div :class="['h-2 rounded-full overflow-hidden', theme.bgCard]">
            <div
              :class="['h-full rounded-full transition-all duration-500 ease-out', progressColor]"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <Zap :class="['h-6 w-6', theme.textPrimary]" />
          <h2 :class="['text-2xl font-bold', theme.textPrimary]">Quick Actions</h2>
        </div>
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card
            v-for="(action, index) in quickActions"
            :key="action.id"
            :class="[
              'group relative overflow-hidden cursor-pointer transition-all duration-300',
              'hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20',
              'hover:-translate-y-1 hover:scale-[1.02]',
              'border-2 hover:border-primary/50',
              theme.bgCard,
              theme.borderPrimary,
            ]"
            :style="{ animationDelay: `${index * 50}ms` }"
            @click="handleActionClick(action)"
          >
            <!-- Gradient Background -->
            <div
              :class="[
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                'bg-gradient-to-br from-primary/5 via-transparent to-transparent',
              ]"
            ></div>
            
            <div class="relative p-6 space-y-4">
              <div class="flex items-start gap-4">
                <div
                  :class="[
                    'flex items-center justify-center w-14 h-14 rounded-xl shrink-0',
                    'transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
                    'shadow-lg',
                    action.iconBg,
                  ]"
                >
                  <component :is="action.icon" class="h-7 w-7 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <h3 :class="['font-semibold text-base leading-tight', theme.textPrimary]">
                      {{ action.title }}
                    </h3>
                    <StatusBadge :status="action.status" />
                  </div>
                </div>
              </div>
              <p :class="['text-sm leading-relaxed', theme.textSecondary]">
                {{ action.description }}
              </p>
              <Button
                :variant="getActionVariant(action.status)"
                size="sm"
                :class="[
                  'w-full transition-all duration-300',
                  action.status === 'done'
                    ? 'group-hover:bg-success/10'
                    : 'group-hover:shadow-lg group-hover:shadow-primary/20',
                ]"
                @click.stop="handleActionClick(action)"
              >
                {{ action.buttonText }}
                <ChevronRight
                  :class="['ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1']"
                />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <!-- Knowledge Base -->
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <BookOpen :class="['h-6 w-6', theme.textPrimary]" />
          <h2 :class="['text-2xl font-bold', theme.textPrimary]">Knowledge Base</h2>
        </div>
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card
            v-for="(item, index) in knowledgeBase"
            :key="item.id"
            :class="[
              'group relative overflow-hidden cursor-pointer transition-all duration-300',
              'hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20',
              'hover:-translate-y-1',
              'border-2 hover:border-primary/50',
              theme.bgCard,
              theme.borderPrimary,
            ]"
            :style="{ animationDelay: `${index * 50}ms` }"
            @click="handleKnowledgeBaseClick(item)"
          >
            <!-- Gradient Background -->
            <div
              :class="[
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                'bg-gradient-to-br from-primary/5 via-transparent to-transparent',
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

      <!-- Explore our services -->
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <Sparkles :class="['h-6 w-6', theme.textPrimary]" />
          <h2 :class="['text-2xl font-bold', theme.textPrimary]">Explore Our Services</h2>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card
            v-for="(service, index) in services"
            :key="service.id"
            :class="[
              'group relative overflow-hidden cursor-pointer transition-all duration-300',
              'hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/20',
              'hover:-translate-y-0.5 hover:scale-[1.01]',
              'border-2 hover:border-primary/50',
              theme.bgCard,
              theme.borderPrimary,
            ]"
            :style="{ animationDelay: `${index * 30}ms` }"
            @click="handleServiceClick(service)"
          >
            <!-- Gradient Background -->
            <div
              :class="[
                'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                'bg-gradient-to-br from-primary/5 via-transparent to-transparent',
              ]"
            ></div>
            
            <div class="relative p-5 flex items-center justify-between">
              <span :class="['font-medium text-sm leading-snug', theme.textPrimary]">
                {{ service.title }}
              </span>
              <ChevronRight
                :class="[
                  'h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1',
                  theme.textSecondary,
                ]"
              />
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
  Upload,
  Image as ImageIcon,
  Mail,
  Settings,
  Eye,
  Star,
  FileImage,
  Video,
  GraduationCap,
  Lightbulb,
  MessageSquare,
  Zap,
  Shield,
  Users,
  Sparkles,
} from '@/shared/utils/lucideAnimated'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import { Button } from '@/shared/components/shadcn/button'
import StatusBadge from '@/shared/components/atoms/StatusBadge.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useUserStore } from '@/shared/stores/user'
import { useNavigation } from '@/shared/composables/useNavigation'

const theme = useThemeClasses()
const userStore = useUserStore()
const { navigateTo } = useNavigation()

const userName = computed(() => userStore.user?.name || 'User')

// Mark user as existing when they visit getting started
onMounted(() => {
  if (userStore.isNewUser) {
    userStore.markUserAsExisting()
  }
})

const quickActions = ref([
  {
    id: 1,
    title: 'Create your first collection',
    description: 'Start organizing your photos by creating your first photo collection.',
    status: 'done',
    icon: FolderOpen,
    iconBg: 'bg-blue-500',
    buttonText: 'Create collection >',
    route: { name: 'manageCollections' },
  },
  {
    id: 2,
    title: 'Upload your first photos',
    description: 'Add photos to your gallery and start building your portfolio.',
    status: 'done',
    icon: Upload,
    iconBg: 'bg-indigo-500',
    buttonText: 'Upload photos >',
    route: { name: 'manageCollections' },
  },
  {
    id: 3,
    title: 'Setup your homepage',
    description: 'Configure your public homepage to showcase your work to clients.',
    status: 'done',
    icon: Globe,
    iconBg: 'bg-purple-500',
    buttonText: 'Setup homepage',
    route: { name: 'homepageConfig' },
  },
  {
    id: 4,
    title: 'Create your first project',
    description: 'Organize your work into projects for better client management.',
    status: 'To do',
    icon: FolderKanban,
    iconBg: 'bg-orange-500',
    buttonText: 'Create project',
    route: { name: 'projects' },
  },
  {
    id: 5,
    title: 'Setup watermark protection',
    description: 'Protect your photos with custom watermarks before sharing.',
    status: 'To do',
    icon: ImageIcon,
    iconBg: 'bg-teal-500',
    buttonText: 'Setup watermark',
    route: { name: 'watermarkSettings' },
  },
  {
    id: 6,
    title: 'Configure email templates',
    description: 'Customize email notifications sent to your clients.',
    status: 'To do',
    icon: Mail,
    iconBg: 'bg-pink-500',
    buttonText: 'Configure emails',
    route: { name: 'emailTemplateSettings' },
  },
  {
    id: 7,
    title: 'Customize your branding',
    description:
      'Personalize your gallery with custom branding, colors, and design settings.',
    status: 'To do',
    icon: Palette,
    iconBg: 'bg-green-500',
    buttonText: 'Customize branding',
    route: { name: 'brandingSettings' },
  },
  {
    id: 8,
    title: 'Create a preset',
    description: 'Save time by creating reusable design presets for your collections.',
    status: 'To do',
    icon: Settings,
    iconBg: 'bg-cyan-500',
    buttonText: 'Create preset',
    route: { name: 'presetSettings' },
  },
])

const totalActions = computed(() => quickActions.value.length)
const completedCount = computed(() => quickActions.value.filter(a => a.status === 'done').length)
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
    description: 'Expand your knowledge, dive into our comprehensive documentation.',
    icon: Code,
    iconBg: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'User Guides',
    description: "Guides serves to help you on specific request for every 'How tos'.",
    icon: BookOpen,
    iconBg: 'bg-green-500',
  },
  {
    id: 3,
    title: 'Video Tutorials',
    description: 'Watch step-by-step video guides to master Memora features.',
    icon: Video,
    iconBg: 'bg-red-500',
  },
  {
    id: 4,
    title: 'FAQs',
    description: 'Frequently asked questions about Memora, everything you should know.',
    icon: HelpCircle,
    iconBg: 'bg-purple-500',
  },
  {
    id: 5,
    title: 'Best Practices',
    description: 'Learn professional tips and tricks for managing your photo gallery.',
    icon: Lightbulb,
    iconBg: 'bg-yellow-500',
  },
  {
    id: 6,
    title: 'Getting Started Guide',
    description: 'A comprehensive guide to help you get started with Memora.',
    icon: GraduationCap,
    iconBg: 'bg-indigo-500',
  },
  {
    id: 7,
    title: 'API Documentation',
    description: 'Integrate Memora with your applications using our API.',
    icon: Code,
    iconBg: 'bg-teal-500',
  },
  {
    id: 8,
    title: 'Community Forum',
    description: 'Connect with other photographers and share your experiences.',
    icon: MessageSquare,
    iconBg: 'bg-pink-500',
  },
])

const services = ref([
  {
    id: 1,
    title: 'Create a project: Organize your work',
    route: { name: 'projects' },
  },
  {
    id: 2,
    title: 'Manage collections: Organize your photos',
    route: { name: 'manageCollections' },
  },
  {
    id: 3,
    title: 'Manage selections: Curate your best photos',
    route: { name: 'selections' },
  },
  {
    id: 4,
    title: 'Client proofing: Get client feedback',
    route: { name: 'proofing' },
  },
  {
    id: 5,
    title: 'Customize homepage: Showcase your work',
    route: { name: 'homepageConfig' },
  },
  {
    id: 6,
    title: 'Watermark settings: Protect your photos',
    route: { name: 'watermarkSettings' },
  },
  {
    id: 7,
    title: 'Design presets: Save time with templates',
    route: { name: 'presetSettings' },
  },
  {
    id: 8,
    title: 'Branding settings: Personalize your gallery',
    route: { name: 'brandingSettings' },
  },
  {
    id: 9,
    title: 'Email templates: Customize notifications',
    route: { name: 'emailTemplateSettings' },
  },
  {
    id: 10,
    title: 'Email notifications: Manage alerts',
    route: { name: 'emailNotificationsSettings' },
  },
  {
    id: 11,
    title: 'Social links: Connect your profiles',
    route: { name: 'socialLinksSettings' },
  },
  {
    id: 12,
    title: 'View starred items: Your favorites',
    route: { name: 'starredCollections' },
  },
  {
    id: 13,
    title: 'Featured media: Highlight your best work',
    route: { name: 'featuredMedias' },
  },
  {
    id: 14,
    title: 'My media: Browse all your photos',
    route: { name: 'myMedia' },
  },
  {
    id: 15,
    title: 'Preferences: Configure your settings',
    route: { name: 'preferenceSettings' },
  },
])

const handleActionClick = action => {
  if (action.route) {
    navigateTo(action.route)
  }
}

const handleKnowledgeBaseClick = item => {
  // TODO: Implement navigation
}

const handleServiceClick = service => {
  if (service.route) {
    navigateTo(service.route)
  }
}

const getActionVariant = status => {
  switch (status) {
    case 'done':
      return 'success'
    case 'To do':
      return 'primary'
    default:
      return 'default'
  }
}
</script>
