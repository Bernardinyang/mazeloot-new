<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <PublicNav />
    
    <!-- Hero Section -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Empowering Your Photography Business, One Click at a Time
          </h1>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
            We offer the best photography services for you in terms that our services are secure. We offer the best photography services for you in terms that our services are secure.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button size="lg" class="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto" @click="router.push({ name: 'register' })">
              Get Started
            </Button>
            <Button size="lg" variant="outline" class="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto" @click="router.push({ name: 'waitlist' })">
              Join Waitlist
            </Button>
          </div>
        </div>
        <div class="relative">
          <!-- Mockup Phone/Device Display -->
          <div class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-2xl">
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 space-y-6">
              <!-- Left Side: Gallery Stats -->
              <div class="space-y-4">
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Photos</div>
                  <div class="text-2xl font-bold">8,945</div>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Active Projects</div>
                  <div class="flex gap-2">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600"></div>
                    <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs">+5</div>
                  </div>
                </div>
              </div>
              <!-- Right Side: Gallery Actions -->
              <div class="p-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg text-white">
                <div class="text-sm mb-2">Share Gallery</div>
                <div class="text-lg font-semibold mb-4">Wedding Collection</div>
                <Button size="sm" variant="secondary" class="w-full">SHARE</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Box (Top Right Position) -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="max-w-md mx-auto sm:ml-auto">
        <Card class="p-6 bg-gradient-to-br from-purple-500 to-blue-600 text-white border-0">
          <CardHeader>
            <CardTitle class="text-white mb-4">Gallery Statistics</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex justify-between items-center">
              <span>Wedding Galleries</span>
              <span class="font-bold">1,234</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Portrait Sessions</span>
              <span class="font-bold">856</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Total Photos</span>
              <span class="font-bold">45,678</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Active Clients</span>
              <span class="font-bold">342</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Optimized Photography Management System -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="relative">
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 h-64 flex items-end justify-around">
            <div class="text-center">
              <div class="w-16 h-32 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg mb-2"></div>
              <div class="text-sm font-semibold">$340</div>
            </div>
            <div class="text-center">
              <div class="w-16 h-24 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg mb-2"></div>
              <div class="text-sm font-semibold">$230</div>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-t from-pink-500 to-pink-300 rounded-t-lg mb-2"></div>
              <div class="text-sm font-semibold">$120</div>
            </div>
            <div class="text-center">
              <div class="w-16 h-40 bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg mb-2"></div>
              <div class="text-sm font-semibold">$890</div>
            </div>
          </div>
        </div>
        <div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Optimized Photography Management System</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Streamline your photography workflow with powerful tools designed for modern photographers.
          </p>
          <div class="space-y-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap class="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 class="font-semibold mb-1">Real-Time Gallery Updates</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Instant synchronization across all devices</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="font-semibold mb-1">Secure Client Delivery</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Protected galleries with password and watermark options</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <History class="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 class="font-semibold mb-1">Complete Transaction History</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Track all client interactions and sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Essential Features for Smart Photography -->
    <section class="bg-gray-50 dark:bg-gray-900 py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Essential Features for Smart Photography</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We offer the best photography services for you in terms that our services are secure. We offer the best photography services for you in terms that our services are secure.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <Card class="p-8 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
              <Calendar class="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <CardHeader>
              <CardTitle class="text-xl sm:text-2xl mb-2 sm:mb-3">Project Planning</CardTitle>
              <CardDescription class="text-base">
                Set and track project timelines with personalized recommendations, ensuring you stay on top of deadlines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="#" class="text-purple-600 dark:text-purple-400 font-semibold hover:underline">Read More →</a>
            </CardContent>
          </Card>
          <Card class="p-8 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
              <BarChart class="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardHeader>
              <CardTitle class="text-xl sm:text-2xl mb-2 sm:mb-3">Monitor Performance</CardTitle>
              <CardDescription class="text-base">
                Get detailed insights into your gallery views and client engagement. Track metrics across projects and identify growth opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="#" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Read More →</a>
            </CardContent>
          </Card>
          <Card class="p-8 hover:shadow-lg transition-shadow">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
              <Activity class="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardHeader>
              <CardTitle class="text-xl sm:text-2xl mb-2 sm:mb-3">Real-Time Tracking</CardTitle>
              <CardDescription class="text-base">
                Stay updated on your gallery views, client selections, and all photography activities in real time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="#" class="text-green-600 dark:text-green-400 font-semibold hover:underline">Read More →</a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Gallery Markets / Platform Stats -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="max-w-4xl mx-auto">
        <Card class="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Gallery Platform</h3>
              <div class="space-y-2 mb-4">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Active Galleries</span>
                  <span class="font-bold">12,456</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Photos Delivered</span>
                  <span class="font-bold">2.3M+</span>
                </div>
              </div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle class="h-4 w-4 text-green-600 dark:text-green-400" />
                <span class="text-sm font-semibold text-green-700 dark:text-green-400">Secured Platform</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Global Users</div>
              <div class="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400">200k+</div>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <!-- Keep your photography business organized -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Keep your photography business organized and on track for growth
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Our comprehensive platform helps you streamline your photography workflow, manage client relationships, and scale your business with powerful tools designed specifically for photographers.
        </p>
      </div>
    </section>

    <!-- Easily Manage Your Galleries -->
    <section class="bg-gray-50 dark:bg-gray-900 py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold mb-4">Easily Manage Your Galleries</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Our system allows you to monitor your photography galleries effortlessly through intuitive tools and detailed reports.
            </p>
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <CheckCircle class="h-6 w-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 class="font-semibold mb-1">Custom Gallery Reports</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Generate detailed analytics for each project</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <CheckCircle class="h-6 w-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 class="font-semibold mb-1">Enhanced Security Features</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Password protection, watermarks, and access controls</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <CheckCircle class="h-6 w-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 class="font-semibold mb-1">Superfast Customer Support</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">24/7 support team ready to help</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Card class="p-6 bg-gradient-to-br from-purple-500 to-blue-600 text-white border-0">
              <CardHeader>
                <CardTitle class="text-white mb-4">Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent class="space-y-3">
                <div class="flex justify-between items-center">
                  <span>Wedding Galleries</span>
                  <span class="font-bold">1,234</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Portrait Sessions</span>
                  <span class="font-bold">856</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Total Photos</span>
                  <span class="font-bold">45,678</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Active Clients</span>
                  <span class="font-bold">342</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Plans -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-12">Explore our pricing plans</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card class="p-8 relative border-2 border-purple-500">
            <div class="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
              MOST POPULAR
            </div>
            <CardHeader>
              <CardTitle class="text-3xl mb-2">Standard</CardTitle>
              <div class="text-4xl font-bold mb-4">
                $19.99
                <span class="text-lg font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Everything in Basic Plan</span>
                </li>
                <li class="flex items-start gap-3">
                  <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Gallery Management</span>
                </li>
                <li class="flex items-start gap-3">
                  <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Advanced Client Reports</span>
                </li>
                <li class="flex items-start gap-3">
                  <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Print Store Integration</span>
                </li>
              </ul>
              <Button class="w-full mt-6" size="lg" @click="router.push({ name: 'register' })">
                Get Started
              </Button>
            </CardContent>
          </Card>
          <Card class="p-8">
            <CardHeader>
              <CardTitle class="text-3xl mb-2">Professional</CardTitle>
              <div class="text-4xl font-bold mb-4">
                $29.99
                <span class="text-lg font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Everything in Standard Plan</span>
                </li>
                <li class="flex items-start gap-3">
                  <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Studio Manager</span>
                </li>
                <li class="flex items-start gap-3">
                  <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Booking & Scheduling</span>
                </li>
                <li class="flex items-start gap-3">
                  <Check class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Custom Branding</span>
                </li>
              </ul>
              <Button class="w-full mt-6" size="lg" variant="outline" @click="router.push({ name: 'register' })">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Team Collaboration -->
    <section class="bg-gradient-to-br from-purple-500 to-blue-600 text-white py-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            Work with your clients seamlessly, anytime, anywhere
          </h2>
          <p class="text-xl mb-8 text-white/90">
            Collaborate with your clients through beautiful galleries, seamless proofing, and instant communication tools designed for modern photographers.
          </p>
          <div class="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" class="text-lg px-8" @click="router.push({ name: 'register' })">
              Get Started
            </Button>
            <Button size="lg" variant="outline" class="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20" @click="router.push({ name: 'products' })">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="font-semibold mb-4">Products</h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><RouterLink to="/products" class="hover:text-gray-900 dark:hover:text-gray-100">Client Gallery</RouterLink></li>
              <li><RouterLink to="/products" class="hover:text-gray-900 dark:hover:text-gray-100">Website</RouterLink></li>
              <li><RouterLink to="/products" class="hover:text-gray-900 dark:hover:text-gray-100">Studio Manager</RouterLink></li>
              <li><RouterLink to="/products" class="hover:text-gray-900 dark:hover:text-gray-100">Store</RouterLink></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Resources</h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" class="hover:text-gray-900 dark:hover:text-gray-100">Help & Support</a></li>
              <li><a href="#" class="hover:text-gray-900 dark:hover:text-gray-100">Blog</a></li>
              <li><a href="#" class="hover:text-gray-900 dark:hover:text-gray-100">Examples</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Company</h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" class="hover:text-gray-900 dark:hover:text-gray-100">About</a></li>
              <li><a href="#" class="hover:text-gray-900 dark:hover:text-gray-100">Careers</a></li>
              <li><RouterLink to="/contact" class="hover:text-gray-900 dark:hover:text-gray-100">Contact</RouterLink></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4">Legal</h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" class="hover:text-gray-900 dark:hover:text-gray-100">Terms of Service</a></li>
              <li><a href="#" class="hover:text-gray-900 dark:hover:text-gray-100">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          © {{ new Date().getFullYear() }} Mazeloot Inc. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import Card from '@/shared/components/shadcn/Card.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import { Zap, Lock, History, Calendar, BarChart, Activity, CheckCircle, Check } from '@/shared/utils/lucideAnimated'

const router = useRouter()
</script>
