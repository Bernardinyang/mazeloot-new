<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <PublicNav />
    <PublicBreadcrumbBanner :breadcrumbs="[{ to: '/', label: 'Home' }, { label: 'Products' }]" />

    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-12 sm:mb-16">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">Our Products</h1>
        <p class="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          A complete suite of tools designed to help creatives grow their business
        </p>
      </div>

      <div class="space-y-24">
        <!-- Client Gallery -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Client Gallery</h2>
            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              Share, deliver, proof and sell photos online with beautiful photo galleries. Trusted by more than a million creatives worldwide.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Beautiful, customizable galleries</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>High-resolution digital delivery</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Online proofing and selection</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Integrated print and digital sales</span>
              </li>
            </ul>
            <Button size="lg" @click="router.push({ name: 'register' })">Get Started</Button>
          </div>
          <Card class="p-8">
            <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
              <ImageIcon class="h-24 w-24 text-gray-400" />
            </div>
          </Card>
        </div>

        <!-- Website -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Card class="p-8 order-2 lg:order-1">
            <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
              <Globe class="h-24 w-24 text-gray-400" />
            </div>
          </Card>
          <div class="order-1 lg:order-2">
            <h2 class="text-4xl font-bold mb-4">Website</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Launch your photography website, portfolio and blog with customizable branding and templates.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Custom domain support</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>SEO optimized</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Mobile responsive</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Blog integration</span>
              </li>
            </ul>
            <Button size="lg" @click="router.push({ name: 'register' })">Get Started</Button>
          </div>
        </div>

        <!-- Studio Manager -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold mb-4">Studio Manager</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Simple booking and payment software to manage your photography business efficiently.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Session booking calendar</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Online payments and deposits</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Client questionnaires</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Invoice management</span>
              </li>
            </ul>
            <Button size="lg" @click="router.push({ name: 'register' })">Get Started</Button>
          </div>
          <Card class="p-8">
            <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
              <Calendar class="h-24 w-24 text-gray-400" />
            </div>
          </Card>
        </div>

        <!-- Store -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Card class="p-8 order-2 lg:order-1">
            <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
              <ShoppingBag class="h-24 w-24 text-gray-400" />
            </div>
          </Card>
          <div class="order-1 lg:order-2">
            <h2 class="text-4xl font-bold mb-4">Store</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Sell prints and digital downloads online directly to your clients.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Print fulfillment integration</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Digital download management</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Custom pricing and packages</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Automated order processing</span>
              </li>
            </ul>
            <Button size="lg" @click="router.push({ name: 'register' })">Get Started</Button>
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12 mt-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
        © {{ new Date().getFullYear() }} Mazeloot Inc. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PublicBreadcrumbBanner from '@/shared/components/molecules/PublicBreadcrumbBanner.vue'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import Card from '@/shared/components/shadcn/Card.vue'
import { Check, ImageIcon, Globe, Calendar, ShoppingBag } from '@/shared/utils/lucideAnimated'

const router = useRouter()
</script>
