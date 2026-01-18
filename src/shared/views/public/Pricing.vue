<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <PublicNav />
    
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">Pricing</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Choose the plan that works best for your photography business
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Free Plan -->
        <Card class="p-8">
          <CardHeader>
            <CardTitle class="text-2xl mb-2">Free</CardTitle>
            <div class="text-4xl font-bold mb-4">
              $0
              <span class="text-lg font-normal text-muted-foreground">/month</span>
            </div>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>1 Gallery</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>10GB Storage</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Basic Website</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Community Support</span>
              </li>
            </ul>
            <Button class="w-full mt-6" variant="outline" @click="router.push({ name: 'register' })">
              Get Started
            </Button>
          </CardContent>
        </Card>

        <!-- Pro Plan -->
        <Card class="p-8 border-2 border-gray-900 dark:border-gray-100 relative">
          <div class="absolute top-0 right-0 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1 text-xs font-semibold rounded-bl-lg">
            POPULAR
          </div>
          <CardHeader>
            <CardTitle class="text-2xl mb-2">Pro</CardTitle>
            <div class="text-4xl font-bold mb-4">
              $19
              <span class="text-lg font-normal text-muted-foreground">/month</span>
            </div>
            <CardDescription>For growing photographers</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Unlimited Galleries</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>100GB Storage</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Custom Domain</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Print Store</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Studio Manager</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Priority Support</span>
              </li>
            </ul>
            <Button class="w-full mt-6" @click="router.push({ name: 'register' })">
              Get Started
            </Button>
          </CardContent>
        </Card>

        <!-- Business Plan -->
        <Card class="p-8">
          <CardHeader>
            <CardTitle class="text-2xl mb-2">Business</CardTitle>
            <div class="text-4xl font-bold mb-4">
              $49
              <span class="text-lg font-normal text-muted-foreground">/month</span>
            </div>
            <CardDescription>For established studios</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Everything in Pro</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>500GB Storage</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Team Collaboration</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Advanced Analytics</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>White-label Options</span>
              </li>
              <li class="flex items-start gap-3">
                <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>24/7 Priority Support</span>
              </li>
            </ul>
            <Button class="w-full mt-6" variant="outline" @click="router.push({ name: 'register' })">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>

      <div class="mt-20 text-center">
        <h2 class="text-3xl font-bold mb-4">All plans include</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
          <div class="flex items-start gap-3">
            <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div class="font-semibold mb-1">Mobile App</div>
              <div class="text-sm text-muted-foreground">Access your galleries on the go</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div class="font-semibold mb-1">SSL Security</div>
              <div class="text-sm text-muted-foreground">Secure data encryption</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div class="font-semibold mb-1">Regular Updates</div>
              <div class="text-sm text-muted-foreground">New features and improvements</div>
            </div>
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
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import Card from '@/shared/components/shadcn/Card.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import { Check } from '@/shared/utils/lucideAnimated'

const router = useRouter()
</script>
