<template>
  <div class="bg-gradient-to-b from-gray-50 to-white min-h-full">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div class="px-3 py-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img
            v-if="branding?.logoUrl"
            :src="branding.logoUrl"
            :alt="branding.name || 'Brand'"
            class="h-7 w-auto"
          />
          <div v-else class="h-7 w-7 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="px-3 py-4 text-center">
      <div v-if="branding?.name" class="mb-3">
        <h1 class="text-xl font-bold tracking-tight mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {{ branding.name }}
        </h1>
        <p v-if="branding?.tagline" class="text-xs text-gray-600">{{ branding.tagline }}</p>
      </div>

      <!-- Biography -->
      <p
        v-if="homepageInfo?.includes('biography') && biography"
        class="text-[10px] text-gray-700 max-w-xs mx-auto mt-2 leading-relaxed"
      >
        {{ biography }}
      </p>

      <!-- Contact Info -->
      <div
        v-if="
          homepageInfo &&
          (homepageInfo.includes('website') ||
            homepageInfo.includes('phone') ||
            homepageInfo.includes('email') ||
            homepageInfo.includes('address'))
        "
        class="flex flex-wrap items-center justify-center gap-1.5 mt-2"
      >
        <a
          v-if="homepageInfo.includes('website') && branding?.website"
          :href="branding.website"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-gray-200 shadow-sm hover:border-accent hover:bg-accent/10 transition-all duration-300"
        >
          <Globe class="h-2.5 w-2.5 text-gray-600" />
          <span class="text-[9px] text-gray-700 font-medium">{{ branding.website }}</span>
        </a>
        <a
          v-if="homepageInfo.includes('phone') && contactInfo.phone"
          :href="`tel:${contactInfo.phone}`"
          class="flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-gray-200 shadow-sm hover:border-accent hover:bg-accent/10 transition-all duration-300"
        >
          <Phone class="h-2.5 w-2.5 text-gray-600" />
          <span class="text-[9px] text-gray-700 font-medium">{{ contactInfo.phone }}</span>
        </a>
        <a
          v-if="homepageInfo.includes('email') && contactInfo.email"
          :href="`mailto:${contactInfo.email}`"
          class="flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-gray-200 shadow-sm hover:border-accent hover:bg-accent/10 transition-all duration-300"
        >
          <Mail class="h-2.5 w-2.5 text-gray-600" />
          <span class="text-[9px] text-gray-700 font-medium">{{ contactInfo.email }}</span>
        </a>
        <a
          v-if="homepageInfo.includes('address') && contactInfo.address"
          :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-gray-200 shadow-sm hover:border-accent hover:bg-accent/10 transition-all duration-300"
        >
          <MapPin class="h-2.5 w-2.5 text-gray-600" />
          <span class="text-[9px] text-gray-700 font-medium">{{ contactInfo.address }}</span>
        </a>
      </div>

      <!-- Social Links -->
      <div
        v-if="homepageInfo?.includes('socialLinks') && socialLinks.length > 0"
        class="flex items-center justify-center gap-1.5 mt-2"
      >
        <div
          v-for="i in 4"
          v-if="isLoading"
          :key="i"
          class="h-5 w-5 bg-gray-200 rounded-full animate-pulse"
        ></div>
        <div
          v-for="link in socialLinks.filter(l => l.isActive).slice(0, 4)"
          v-else
          :key="link.id"
          class="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
        >
          <Globe class="h-3 w-3 text-gray-600" />
        </div>
      </div>
    </section>

    <!-- Featured Media Slideshow Preview -->
    <FeaturedMediaSlider
      v-if="slideshowEnabled"
      :featured-media="featuredMedia"
      :show-video-media="false"
      variant="preview"
    />

    <!-- Collections Grid -->
    <section class="px-3 pb-4">
      <div v-if="collections.length > 0" class="grid grid-cols-2 gap-2">
        <div
          v-for="(collection, index) in collections.slice(0, 6)"
          :key="collection.id"
          class="group cursor-pointer"
          :style="{ transform: `rotate(${getCardRotation(index)}deg)` }"
        >
          <div class="relative aspect-square overflow-hidden rounded-lg mb-1 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:rotate-0">
            <video
              v-if="isVideoCover(collection.image)"
              :src="collection.image"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              autoplay
              loop
              muted
              playsinline
            ></video>
            <img
              v-else
              :src="collection.image || '/placeholder.jpg'"
              :alt="collection.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div class="absolute bottom-0 left-0 right-0 p-2">
                <p class="text-white font-semibold text-[10px]">{{ collection.title }}</p>
              </div>
            </div>
          </div>
          <p class="text-[10px] font-semibold text-center text-gray-900">{{ collection.title }}</p>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <p class="text-[10px] text-gray-500">No collections available</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-200 py-2 mt-4 bg-white/50">
      <div class="px-3 text-center">
        <p class="text-[9px] text-gray-600 font-medium">© {{ new Date().getFullYear() }} {{ branding?.name || 'Mazeloot' }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Globe, Phone, Mail, MapPin } from 'lucide-vue-next'
import FeaturedMediaSlider from '@/shared/components/organisms/FeaturedMediaSlider.vue'

const isVideoCover = url => {
  if (!url) return false
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.ogg']
  const lowerUrl = url.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.includes(ext))
}

const getCardRotation = index => {
  const rotations = [-3, 2, -2, 3, -1, 1]
  return rotations[index % rotations.length]
}

const props = defineProps({
  branding: {
    type: Object,
    default: () => ({}),
  },
  homepageInfo: {
    type: Array,
    default: () => [],
  },
  biography: {
    type: String,
    default: '',
  },
  socialLinks: {
    type: Array,
    default: () => [],
  },
  collections: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  contactInfo: {
    type: Object,
    default: () => ({
      email: '',
      phone: '',
      address: '',
    }),
  },
  slideshowEnabled: {
    type: Boolean,
    default: false,
  },
  featuredMedia: {
    type: Array,
    default: () => [],
  },
})

</script>

