<template>
  <KnowledgeBaseLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-600 p-8 md:p-12 shadow-2xl border-2 border-teal-400/30">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div class="relative z-10 space-y-6" style="animation: fadeIn 0.6s ease-out;">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl border-2 border-white/30" style="animation: bounceSubtle 3s ease-in-out infinite;">
              <Eye class="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-lg">Proofing & Feedback</h1>
              <p class="text-teal-100 mt-2 text-lg">Set up client proofing sessions and manage revision workflows</p>
            </div>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <!-- Action Banner -->
      <ActionBanner
        title="Ready to set up proofing?"
        description="Create proofing sessions and manage client feedback"
        :button-text="canAccessProofing ? 'Go to Proofing' : `Upgrade to ${recommendedTierDisplayName('proofing')}`"
        :icon="Eye"
        color="teal"
        @action="canAccessProofing ? navigateTo({ name: 'proofing' }) : showUpgradePrompt('proofing')"
      />

      <!-- Overview Section -->
      <Card class="p-6 border-2 border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-teal-950/30 dark:to-cyan-950/30">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-foreground">Understanding Proofing & Feedback</h2>
          <p class="text-foreground/80 leading-relaxed text-lg">
            Proofing sessions are structured review periods where clients approve photos before final delivery. This process helps manage expectations, prevent scope creep, and ensures you deliver exactly what clients want. The feedback system tracks all comments, revision requests, and approvals in one place.
          </p>
          <div class="mt-6 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-teal-200 dark:border-teal-800">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="text-center p-3 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex-1">
                <div class="text-lg font-bold text-teal-700 dark:text-teal-300">1. Setup</div>
                <div class="text-xs text-foreground/70 mt-1">Create session</div>
              </div>
              <ArrowRight class="h-5 w-5 text-teal-500 hidden md:block" />
              <div class="text-center p-3 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex-1">
                <div class="text-lg font-bold text-teal-700 dark:text-teal-300">2. Review</div>
                <div class="text-xs text-foreground/70 mt-1">Client feedback</div>
              </div>
              <ArrowRight class="h-5 w-5 text-teal-500 hidden md:block" />
              <div class="text-center p-3 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex-1">
                <div class="text-lg font-bold text-teal-700 dark:text-teal-300">3. Approve</div>
                <div class="text-xs text-foreground/70 mt-1">Final delivery</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Content Sections -->
      <div class="grid gap-6">
        <Card 
          v-for="(section, index) in sections" 
          :key="section.id" 
          class="group p-6 space-y-4 border-2 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :style="{ animation: `slideInUp 0.5s ease-out ${index * 100}ms both` }"
        >
          <div class="flex items-center gap-3">
            <div :class="['flex items-center justify-center w-12 h-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300', section.iconBg]">
              <component :is="section.icon" class="h-6 w-6 text-white" />
            </div>
            <h2 class="text-xl font-bold text-foreground">{{ section.title }}</h2>
          </div>
          <p class="text-foreground/70 leading-relaxed">{{ section.description }}</p>
          <div v-if="section.steps" class="space-y-3 mt-4">
            <div v-for="(step, stepIndex) in section.steps" :key="stepIndex" class="flex items-start gap-3 p-3 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors group/step">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold shadow-md group-hover/step:scale-110 transition-transform shrink-0">
                {{ stepIndex + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-foreground">{{ step.title }}</h3>
                <p class="text-sm text-foreground/70 mt-1">{{ step.detail }}</p>
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
import { Eye, ChevronRight, Settings, MessageSquare, ArrowRight, Lightbulb } from '@/shared/utils/lucideAnimated'
import { useNavigation } from '@/shared/composables/useNavigation'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'

const { navigateTo } = useNavigation()
const { canAccessProofing, showUpgradePrompt, recommendedTierDisplayName } = useMemoraFeatures()

const sections = ref([
  {
    id: 1,
    title: 'Setting Up Proofing',
    icon: Settings,
    iconBg: 'bg-teal-500',
    description: 'Proofing sessions provide a structured way for clients to review and approve photos. Set up sessions with clear deadlines and revision limits to keep projects on track.',
    steps: [
      {
        title: 'Create a new proofing session',
        detail: 'Navigate to Proofing and click "Create Session". Give it a descriptive name like "Smith Wedding - Round 1" and associate it with the relevant project.',
      },
      {
        title: 'Add photos from selections or collections',
        detail: 'Select photos from your existing selections or collections. You can add photos from multiple sources to create a comprehensive proofing set.',
      },
      {
        title: 'Configure access settings and permissions',
        detail: 'Set who can access the session (public link, password-protected, or invite-only). Configure whether clients can download, comment, or request revisions.',
      },
      {
        title: 'Set revision limits and deadlines',
        detail: 'Define how many revision rounds are included and set a deadline for feedback. This helps manage expectations and prevents scope creep.',
      },
      {
        title: 'Share the proofing link with clients',
        detail: 'Generate a secure link and send it to clients via email or messaging. Clients receive notifications when proofing is ready and when deadlines approach.',
      },
    ],
    tips: 'Set clear deadlines and communicate them upfront. Use revision limits to prevent endless revision cycles. Most projects work well with 1-2 revision rounds.',
  },
  {
    id: 2,
    title: 'Managing Feedback',
    icon: MessageSquare,
    iconBg: 'bg-blue-500',
    description: 'The feedback system centralizes all client communication, comments, and revision requests. Track everything in one place and respond efficiently.',
    steps: [
      {
        title: 'View all client comments and feedback',
        detail: 'Access the Feedback tab in your proofing session to see all comments, favorites, and revision requests. Comments are organized by photo for easy navigation.',
      },
      {
        title: 'Respond to client questions',
        detail: 'Reply directly to comments within the interface. Your responses are visible to clients, keeping all communication in context.',
      },
      {
        title: 'Track revision requests',
        detail: 'Mark photos as "Needs Revision" when clients request changes. Track the status of each revision request and mark as complete when addressed.',
      },
      {
        title: 'Mark items as approved',
        detail: 'When clients approve photos, mark them as approved. Approved photos are ready to move to the final collection phase.',
      },
      {
        title: 'Export feedback for records',
        detail: 'Download feedback reports for your records or to share with team members. Reports include all comments, approvals, and revision requests.',
      },
    ],
    tips: 'Respond to feedback promptly to keep projects moving. Use the approval status to filter and see which photos are ready for final delivery.',
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
