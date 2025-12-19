<script>
export const description = 'A two column auth page with a cover image slider.'
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { GalleryVerticalEnd } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import IconMail from '@/icons/IconMail.vue'
import IconChevronLeft from '@/icons/IconChevronLeft.vue'
import IconChevronRight from '@/icons/IconChevronRight.vue'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

defineProps({
  title: String,
  description: String,
})

const theme = useThemeClasses()

const testimonials = [
  {
    quote:
      "We've been using MazeLoot to kick start every new project and can't imagine working without it.",
    name: 'Sarah Johnson',
    title: 'Creative Director, Layers Photography Agency',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&fit=crop',
  },
  {
    quote:
      "MazeLoot has transformed how we approach creative projects. It's become essential to our workflow.",
    name: 'Michael Chen',
    title: 'Lead Designer, Studio Design Co.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&fit=crop',
  },
  {
    quote: 'The best tool for managing creative workflows. Highly recommend!',
    name: 'Emily Rodriguez',
    title: 'Project Manager, Creative Minds',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&fit=crop',
  },
  {
    quote: 'Streamlined our entire creative process. Game changer!',
    name: 'David Kim',
    title: 'Art Director, Digital Art Studio',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&fit=crop',
  },
  {
    quote: 'MazeLoot makes collaboration seamless and efficient.',
    name: 'Lisa Thompson',
    title: 'Founder, Creative Agency',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&fit=crop',
  },
  {
    quote: 'Perfect for teams that value organization and creativity.',
    name: 'James Wilson',
    title: 'CEO, Pixel Perfect',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&fit=crop',
  },
  {
    quote: 'Essential tool for modern creative professionals.',
    name: 'Anna Martinez',
    title: 'Design Lead, Innovation Labs',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&fit=crop',
  },
  {
    quote: 'MazeLoot has revolutionized our project management.',
    name: 'Robert Taylor',
    title: 'Creative Director, Creative Solutions Inc.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&fit=crop',
  },
  {
    quote: 'The perfect balance of simplicity and power.',
    name: 'Jennifer Lee',
    title: 'Art Director, Modern Studio',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&fit=crop',
  },
  {
    quote:
      'MazeLoot makes project management effortless. Our creative output has never been better.',
    name: 'Chris Anderson',
    title: 'Founder, Art Collective',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&fit=crop',
  },
]

const currentIndex = ref(0)
let intervalId

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % testimonials.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + testimonials.length) % testimonials.length
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
    <div :class="[theme.bgPage, 'flex flex-col p-6 md:p-10']">
      <!-- Header with Logo and Theme Toggle -->
      <div class="flex justify-between items-center mb-8">
        <div class="flex justify-center gap-2 md:justify-start">
          <RouterLink
            to="/"
            :class="[
              theme.textPrimary,
              theme.transitionColors,
              'flex items-center gap-2 font-medium hover:opacity-80',
            ]"
          >
            <div
              class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
            >
              <GalleryVerticalEnd class="size-4" />
            </div>
            Mazeloot
          </RouterLink>
        </div>
        <ThemeToggle />
      </div>

      <!-- Form Content -->
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-md space-y-6">
          <div v-if="title || description" class="text-center space-y-2">
            <h1 v-if="title" :class="[theme.textPrimary, 'text-3xl font-bold tracking-tight']">
              {{ title }}
            </h1>
            <p v-if="description" :class="[theme.textSecondary, 'text-sm']">
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
          'mt-auto pt-6 flex flex-col md:flex-row justify-between items-center text-sm',
        ]"
      >
        <div>© MazeLoot 2025</div>
        <div class="flex items-center gap-2 mt-2 md:mt-0">
          <IconMail class="w-4 h-4" :size="16" />
          <a
            href="mailto:help@mazeloot.com"
            :class="[theme.textMuted, theme.transitionColors, 'hover:text-foreground']"
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
              :src="testimonials[currentIndex].image"
              :alt="`Testimonial ${currentIndex + 1}`"
              class="h-full w-full object-cover scale-105 transition-transform duration-700 ease-out"
            />
            <!-- Testimonial Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20">
              <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 text-white">
                <div class="max-w-2xl">
                  <blockquote
                    class="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 leading-relaxed"
                  >
                    "{{ testimonials[currentIndex].quote }}"
                  </blockquote>
                  <div class="flex items-center gap-3 pt-4 border-t border-white/20">
                    <div class="flex-1">
                      <p class="font-bold text-lg md:text-xl">
                        {{ testimonials[currentIndex].name }}
                      </p>
                      <p class="text-sm md:text-base text-white/70 mt-1">
                        {{ testimonials[currentIndex].title }}
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
              v-for="(_testimonial, index) in testimonials"
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
