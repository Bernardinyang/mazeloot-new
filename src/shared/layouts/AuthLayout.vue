<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import IconMail from '@/shared/icons/IconMail.vue'
import IconChevronLeft from '@/shared/icons/IconChevronLeft.vue'
import IconChevronRight from '@/shared/icons/IconChevronRight.vue'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

defineProps({
  title: String,
  description: String,
})

const theme = useThemeClasses()

const tips = [
  {
    quote: 'Use "constraint sprints" — limit your palette, tools, or time to spark unexpected creativity and avoid decision paralysis.',
    name: 'Constraint Sprints',
    title: 'Pro Tip',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&fit=crop',
  },
  {
    quote: 'Tag your assets by emotional tone, not just function. Search for "urgent" or "playful" instead of scrolling endless folders.',
    name: 'Emotional Metadata',
    title: 'Asset Organization',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&fit=crop',
  },
  {
    quote: 'Create "inspiration breakpoints" — save reference images mid-project to remind yourself why you started when momentum fades.',
    name: 'Inspiration Breakpoints',
    title: 'Creative Endurance',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&fit=crop',
  },
  {
    quote: 'Implement a "brutal honesty review" — have fresh eyes rate work 1-10 with required written feedback before making changes.',
    name: 'Structured Feedback',
    title: 'Quality Control',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&fit=crop',
  },
  {
    quote: 'Use "problem statements" instead of briefs. Define what you\'re solving, not just what you\'re making. It unlocks better solutions.',
    name: 'Problem-First Approach',
    title: 'Project Framing',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&fit=crop',
  },
  {
    quote: 'Set "iteration budgets" — decide how many rounds of revisions upfront. Unlimited revisions kill momentum and creativity.',
    name: 'Iteration Budgets',
    title: 'Scope Management',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&fit=crop',
  },
  {
    quote: 'Archive finished projects with a "lessons learned" note. Future you will thank you when solving similar problems again.',
    name: 'Lessons Learned',
    title: 'Knowledge Capture',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&fit=crop',
  },
  {
    quote: 'Use "decision logs" to track why you rejected good ideas. This prevents re-arguing decisions and accelerates collaboration.',
    name: 'Decision Logs',
    title: 'Team Efficiency',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&fit=crop',
  },
  {
    quote: 'Create "style consistency checkpoints" at 25%, 50%, 75% completion. Catch drift early before massive revisions.',
    name: 'Consistency Checkpoints',
    title: 'Quality Assurance',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&fit=crop',
  },
  {
    quote: 'Schedule a "stakeholder sync" the day before major deliverables to spot misalignment. One conversation beats ten revisions.',
    name: 'Pre-Delivery Sync',
    title: 'Client Management',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&fit=crop',
  },
]

const currentIndex = ref(0)
let intervalId

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % tips.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + tips.length) % tips.length
}

const goToSlide = index => {
  currentIndex.value = index
  // Reset the slider timer when manually navigating
  stopSlider()
  startSlider()
}

const startSlider = () => {
  intervalId = setInterval(nextSlide, 6000) // Change slide every 6 seconds
}

const stopSlider = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  startSlider()
})

onUnmounted(() => {
  stopSlider()
})
</script>

<template>
  <div :class="[theme.bgPage, 'grid min-h-svh lg:grid-cols-2']">
    <div :class="[theme.bgPage, 'flex flex-col p-4 sm:p-6 md:p-10']">
      <!-- Header with Logo and Theme Toggle -->
      <div class="flex justify-between items-center mb-6 md:mb-8 gap-4">
        <div class="flex justify-center gap-2 md:justify-start shrink-0">
          <RouterLink
            :to="{ name: 'home' }"
            :class="[
              theme.textPrimary,
              theme.transitionColors,
              'flex items-center font-medium hover:opacity-80',
            ]"
          >
            <MazelootLogo :show-text="false" size="sm" />
          </RouterLink>
        </div>
        <ThemeToggle class="shrink-0" />
      </div>

      <!-- Form Content -->
      <div class="flex flex-1 items-center justify-center py-4">
        <div class="w-full max-w-md space-y-4 sm:space-y-6">
          <div v-if="title || description" class="text-center space-y-2">
            <h1 v-if="title" :class="[theme.textPrimary, 'text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight']">
              {{ title }}
            </h1>
            <p v-if="description" :class="[theme.textSecondary, 'text-xs sm:text-sm md:text-base']">
              {{ description }}
            </p>
          </div>
          <slot />
        </div>
      </div>

      <!-- Footer -->
      <div
        :class="[
          theme.textMuted,
          'mt-auto pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm gap-2 md:gap-0',
        ]"
      >
        <div>© MazeLoot {{ new Date().getFullYear() }}</div>
        <div class="flex items-center gap-2">
          <IconMail class="w-3 h-3 sm:w-4 sm:h-4 shrink-0" :size="16" />
          <a
            href="mailto:help@mazeloot.com"
            :class="[theme.textMuted, theme.transitionColors, 'hover:text-foreground break-all sm:break-normal']"
            >help@mazeloot.com</a
          >
        </div>
      </div>
    </div>
    <div
      :class="[
        'bg-muted dark:bg-gray-900/50 light:bg-gray-100/50',
        'relative hidden lg:block overflow-hidden',
      ]"
      @mouseenter="stopSlider"
      @mouseleave="startSlider"
    >
      <!-- Slider Container -->
      <div class="relative h-full w-full">
        <Transition name="fade" mode="out-in">
          <div :key="currentIndex" class="absolute inset-0 h-full w-full">
            <img
              :src="tips[currentIndex].image"
              :alt="`Creative Tip ${currentIndex + 1}`"
              class="h-full w-full object-cover scale-105 transition-transform duration-700 ease-out"
            />
            <!-- Testimonial Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20">
              <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 text-white">
                <div class="max-w-2xl">
                  <blockquote
                    class="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 leading-relaxed"
                  >
                    {{ tips[currentIndex].quote }}
                  </blockquote>
                  <div class="flex items-center gap-3 pt-4 border-t border-white/20">
                    <div class="flex-1">
                      <p class="font-bold text-lg md:text-xl">
                        {{ tips[currentIndex].name }}
                      </p>
                      <p class="text-sm md:text-base text-white/70 mt-1">
                        {{ tips[currentIndex].title }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Navigation Controls -->
        <div class="absolute bottom-0 left-10 right-0 z-10">
          <!-- Dot Indicators -->
          <div class="flex gap-2.5 items-center pb-6 px-6">
            <button
              v-for="(_tip, index) in tips"
              :key="index"
              @click="goToSlide(index)"
              :aria-label="`Go to slide ${index + 1}`"
              class="transition-all duration-300 focus:outline-none group"
            >
              <span
                :class="[
                  'block rounded-full transition-all duration-300 ease-in-out',
                  index === currentIndex ? 'w-10 h-2.5 bg-white shadow-lg' : 'w-2 h-2 bg-white/50',
                ]"
              />
            </button>
          </div>

          <!-- Navigation Arrows -->
          <div class="absolute bottom-6 right-6 flex gap-3">
            <button
              @click="prevSlide"
              class="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 focus:outline-none hover:scale-110 shadow-lg border border-white/10"
              aria-label="Previous slide"
            >
              <IconChevronLeft class="w-5 h-5" :size="20" color="currentColor" />
            </button>
            <button
              @click="nextSlide"
              class="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 focus:outline-none hover:scale-110 shadow-lg border border-white/10"
              aria-label="Next slide"
            >
              <IconChevronRight class="w-5 h-5" :size="20" color="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
