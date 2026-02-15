<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
    <!-- Header -->
    <header class="w-full border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50 ">
      <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <MazelootLogo size="sm" />
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 py-8 sm:py-12 px-4">
      <div class="w-full max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-8 sm:mb-12 space-y-3">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 dark:bg-accent/10 mb-4">
          <Sparkles class="h-8 w-8 text-accent dark:text-accent/80" />
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Choose Your Products
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the products you'd like to get started with. You can always add more later.
        </p>
        <div v-if="selectedProducts.length > 0" class="pt-4">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 dark:bg-accent/60 text-accent dark:text-white text-sm font-medium">
            <CheckCircle2 class="h-4 w-4" />
            <span>{{ selectedProducts.length }} {{ selectedProducts.length === 1 ? 'product' : 'products' }} selected</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 class="h-8 w-8 animate-spin text-primary dark:text-primary/80" />
        <p class="text-muted-foreground">Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle class="h-12 w-12 text-destructive" />
        <p class="text-lg font-medium text-destructive">{{ error }}</p>
        <Button @click="handleRetry" variant="outline">
          <RefreshCw class="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>

      <!-- Products Grid -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card
            v-for="product in products"
            :key="product.uuid"
            :class="[
              'group relative transition-all duration-300 overflow-hidden',
              isProductAvailable(product)
                ? 'cursor-pointer hover:shadow-lg hover:shadow-accent/5 dark:hover:shadow-accent/10 hover:-translate-y-1'
                : 'cursor-not-allowed opacity-60',
              'border-2',
              selectedProducts.includes(product.uuid)
                ? 'border-accent dark:border-accent/70 bg-accent/5 dark:bg-accent/10 shadow-md shadow-accent/10 dark:shadow-accent/20'
                : isProductAvailable(product)
                  ? 'border-border hover:border-accent/30 dark:hover:border-accent/40'
                  : 'border-border',
            ]"
            @click="toggleProduct(product.uuid)"
          >
            <!-- Coming Soon Badge -->
            <div
              v-if="!isProductAvailable(product)"
              class="absolute top-3 right-3 z-10"
            >
              <div class="flex items-center justify-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium shadow-lg">
                Coming Soon
              </div>
            </div>
            
            <!-- Selection Indicator -->
            <div
              v-else-if="selectedProducts.includes(product.uuid)"
              class="absolute top-3 right-3 z-10"
            >
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-accent dark:bg-accent/80 text-accent-foreground shadow-lg">
                <CheckCircle2 class="h-5 w-5" />
              </div>
            </div>

            <CardHeader class="pb-4">
              <!-- Icon -->
              <div
                :class="[
                  'inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-colors',
                  selectedProducts.includes(product.uuid)
                    ? 'bg-accent dark:bg-accent/80 text-accent-foreground'
                    : 'bg-muted text-muted-foreground group-hover:bg-accent/10 dark:group-hover:bg-accent/20 group-hover:text-accent dark:group-hover:text-white',
                ]"
              >
                <component
                  :is="getProductIcon(product.icon || '')"
                  class="h-6 w-6"
                />
              </div>
              <CardTitle class="text-xl mb-2">{{ product.name }}</CardTitle>
              <CardDescription class="text-sm leading-relaxed">
                {{ product.description }}
              </CardDescription>
            </CardHeader>

            <CardContent class="pt-0">
              <div class="flex items-center justify-between pt-4 border-t">
                <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {{ product.slug }}
                </span>
                <div
                  v-if="isProductAvailable(product)"
                  :class="[
                    'flex items-center justify-center w-6 h-6 rounded border-2 transition-all',
                    selectedProducts.includes(product.uuid)
                      ? 'border-accent dark:border-accent/70 bg-accent dark:bg-accent/80'
                      : 'border-muted-foreground/30 group-hover:border-accent/50 dark:group-hover:border-accent/60',
                  ]"
                >
                  <Check
                    v-if="selectedProducts.includes(product.uuid)"
                    class="h-4 w-4 text-accent-foreground"
                  />
                </div>
              </div>
            </CardContent>

            <!-- Hover Overlay Effect -->
            <div
              :class="[
                'absolute inset-0 bg-accent/5 dark:bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
                selectedProducts.includes(product.uuid) && 'opacity-100',
              ]"
            />
          </Card>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="ghost"
            class="w-full sm:w-auto"
            :disabled="selectedProducts.length === 0 || isSubmitting"
            @click="handleReset"
          >
            <RefreshCw class="h-4 w-4 mr-2" />
            Reset Selection
          </Button>
          <Button
            type="submit"
            :disabled="selectedProducts.length === 0 || isSubmitting"
            :loading="isSubmitting"
            class="w-full sm:w-auto min-w-[140px]"
            size="lg"
          >
            <span v-if="!isSubmitting">Continue</span>
            <span v-else>Saving...</span>
            <ArrowRight v-if="!isSubmitting" class="h-4 w-4 ml-2" />
          </Button>
        </div>
      </form>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full border-t border-border/40 bg-background/80 backdrop-blur-sm mt-auto">
      <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between h-16 gap-4">
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <MazelootLogo size="sm" use-favicon />
            <span>&copy; {{ new Date().getFullYear() }} Mazeloot. All rights reserved.</span>
          </div>
          <div class="flex items-center gap-6 text-sm text-muted-foreground">
            <RouterLink :to="{ name: 'home' }" class="hover:text-foreground transition-colors">Home</RouterLink>
            <RouterLink :to="{ name: 'products' }" class="hover:text-foreground transition-colors">Products</RouterLink>
            <RouterLink :to="{ name: 'pricing' }" class="hover:text-foreground transition-colors">Pricing</RouterLink>
            <RouterLink :to="{ name: 'contact' }" class="hover:text-foreground transition-colors">Contact</RouterLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostAuthRedirect } from '@/shared/utils/localStorage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/shadcn/card'
import { Button } from '@/shared/components/shadcn/button'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import { useProductsStore } from '@/shared/stores/products'
import { useProductsApi } from '@/shared/api/products'
import { useOnboardingApi } from '@/shared/api/onboarding'
import { toast } from '@/shared/utils/toast'
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Check,
  ArrowLeft,
  ArrowRight,
  Images,
  Video,
  BarChart3,
  Camera,
  Users,
  Briefcase,
} from '@/shared/utils/lucideAnimated'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const productsApi = useProductsApi()
const onboardingApi = useOnboardingApi()

const products = ref([])
const selectedProducts = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref(null)
const token = route.params.token

const iconMap = {
  images: Images,
  gallery: Images,
  video: Video,
  stream: Video,
  'bar-chart-2': BarChart3,
  brain: BarChart3,
  camera: Camera,
  users: Users,
  store: Users,
  briefcase: Briefcase,
  search: Briefcase,
}

const getProductIcon = (iconName) => {
  if (!iconName) return Sparkles
  return iconMap[iconName] || Sparkles
}

const isProductAvailable = (product) => {
  return product.slug === 'memora'
}

const toggleProduct = (productUuid) => {
  const product = products.value.find(p => p.uuid === productUuid)
  if (!product || !isProductAvailable(product)) {
    return // Don't allow selection of unavailable products
  }
  
  const index = selectedProducts.value.indexOf(productUuid)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productUuid)
  }
}

const handleRetry = async () => {
  await loadProducts()
}

const handleReset = () => {
  selectedProducts.value = []
}

const handleSubmit = async () => {
  if (selectedProducts.value.length === 0) {
    toast.error('Please select at least one product')
    return
  }

  isSubmitting.value = true
  try {
    // Verify token first
    const tokenVerification = await onboardingApi.verifyToken(token)
    if (!tokenVerification || !tokenVerification.valid) {
      toast.error('Invalid or expired token')
      router.push({ name: 'overview' })
      return
    }

    // Save product selections (pass token to mark as used)
    await productsApi.selectProducts(selectedProducts.value, token)

    // Generate onboarding tokens for each selected product
    const tokens = []
    for (const productUuid of selectedProducts.value) {
      try {
        const tokenData = await onboardingApi.generateToken(productUuid)
        tokens.push({ productUuid, token: tokenData.token, product: tokenData.product })
      } catch (err) {
        console.error('Failed to generate token for product:', productUuid, err)
      }
    }

    // Redirect to first product onboarding
    if (tokens.length > 0) {
      const firstToken = tokens[0]
      router.push({
        name: 'onboarding',
        params: { productSlug: firstToken.product.slug, token: firstToken.token },
      })
    } else {
      const redirect = getPostAuthRedirect()
      router.push(redirect || { name: 'overview' })
    }
  } catch (err) {
    console.error('Failed to submit product selection:', err)
    toast.error(err.message || 'Failed to save product selection')
  } finally {
    isSubmitting.value = false
  }
}

const loadProducts = async () => {
  isLoading.value = true
  error.value = null
  try {
    await productsStore.fetchProducts()
    products.value = productsStore.products
  } catch (err) {
    console.error('Failed to load products:', err)
    error.value = err.message || 'Failed to load products'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Verify token on mount
  try {
    const tokenVerification = await onboardingApi.verifyToken(token)
    if (!tokenVerification || !tokenVerification.valid) {
      toast.error('Invalid or expired token')
      router.push({ name: 'overview' })
      return
    }
  } catch (err) {
    console.error('Failed to verify token:', err)
    toast.error('Invalid token')
    router.push({ name: 'overview' })
    return
  }

  await loadProducts()
})
</script>
