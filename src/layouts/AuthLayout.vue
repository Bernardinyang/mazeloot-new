<script lang="ts">
export const description = 'A two column auth page with a cover image slider.'
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { GalleryVerticalEnd } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import IconMail from '@/icons/IconMail.vue'
import IconChevronLeft from '@/icons/IconChevronLeft.vue'
import IconChevronRight from '@/icons/IconChevronRight.vue'

defineProps<{
  title?: string
  description?: string
}>()

interface Testimonial {
  quote: string
  name: string
  title: string
  image: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We've been using MazeLoot to kick start every new project and can't imagine working without it.",
    name: 'Victoria Bassey',
    title: 'Lead Photographer, Layers Photography Agency',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=1200&fit=crop',
  },
  {
    quote:
      "MazeLoot has transformed how we approach creative projects. It's become essential to our workflow.",
    name: 'James Chen',
    title: 'Creative Director, Studio Design Co.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=1200&fit=crop',
  },
  {
    quote: "The best tool we've discovered for managing our creative process. Highly recommend!",
    name: 'Sarah Martinez',
    title: 'Art Director, Creative Minds',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=1200&fit=crop',
  },
  {
    quote: "MazeLoot streamlines our entire creative workflow. It's a game-changer for our team.",
    name: 'Michael Thompson',
    title: 'Founder, Digital Art Studio',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=1200&fit=crop',
  },
  {
    quote: "We've increased our productivity by 40% since implementing MazeLoot. Incredible tool!",
    name: 'Emily Rodriguez',
    title: 'Project Manager, Creative Agency',
    image: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=1200&fit=crop',
  },
  {
    quote: "MazeLoot helps us stay organized and creative. It's perfect for our design team.",
    name: 'David Kim',
    title: 'Senior Designer, Pixel Perfect',
    image: 'https://images.unsplash.com/photo-1558403194-611308249627?w=800&h=1200&fit=crop',
  },
  {
    quote: 'The collaboration features in MazeLoot are outstanding. Our team loves it!',
    name: 'Lisa Anderson',
    title: 'Creative Lead, Innovation Labs',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=1200&fit=crop',
  },
  {
    quote: 'MazeLoot has revolutionized how we manage creative projects. Simply amazing!',
    name: 'Robert Wilson',
    title: 'CEO, Creative Solutions Inc.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1200&fit=crop',
  },
  {
    quote: "Best investment we've made for our creative team. MazeLoot is indispensable.",
    name: 'Jennifer Lee',
    title: 'Head of Design, Modern Studio',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=1200&fit=crop',
  },
  {
    quote:
      'MazeLoot makes project management effortless. Our creative output has never been better.',
    name: 'Thomas Brown',
    title: 'Creative Strategist, Art Collective',
    image: 'https://images.unsplash.com/photo-1557683310-8555750e35cd?w=800&h=1200&fit=crop',
  },
]

const currentIndex = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % testimonials.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + testimonials.length) % testimonials.length
}

const goToSlide = (index: number) => {
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
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col p-6 md:p-10">
      <!-- Logo -->
      <div class="flex justify-center gap-2 md:justify-start mb-8">
        <RouterLink to="/" class="flex items-center gap-2 font-medium">
          <div
            class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
          >
            <GalleryVerticalEnd class="size-4" />
          </div>
          Mazeloot
        </RouterLink>
      </div>

      <!-- Form Content -->
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-md space-y-6">
          <div v-if="title || description" class="text-center space-y-2">
            <h1 v-if="title" class="text-3xl font-bold tracking-tight">{{ title }}</h1>
            <p v-if="description" class="text-muted-foreground">{{ description }}</p>
          </div>
          <slot />
        </div>
      </div>

      <!-- Footer -->
      <div
        class="mt-auto pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground"
      >
        <div>© MazeLoot 2025</div>
        <div class="flex items-center gap-2 mt-2 md:mt-0">
          <IconMail class="w-4 h-4" :size="16" />
          <a href="mailto:help@mazeloot.com" class="hover:text-foreground transition-colors"
            >help@mazeloot.com</a
          >
        </div>
      </div>
    </div>
    <div
      class="bg-muted relative hidden lg:block overflow-hidden"
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
              v-for="(testimonial, index) in testimonials"
              :key="index"
              @click="goToSlide(index)"
              :aria-label="`Go to slide ${index + 1}`"
              class="transition-all duration-300 focus:outline-none group"
            >
              <span
                :class="[
                  'block rounded-full transition-all duration-300 ease-in-out',
                  index === currentIndex
                    ? 'w-10 h-2.5 bg-white shadow-lg'
                    : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/70 hover:w-3 hover:h-3',
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
