<template>
  <div class="min-h-screen flex flex-col bg-background">
    <!-- Header -->
    <header class="w-full border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div class="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <MazelootLogo size="sm" />
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">{{ product?.name }} Onboarding</h1>
        <p class="text-muted-foreground">Complete setup to get started</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {{ currentStepIndex + 1 }} of {{ steps.length }}</CardTitle>
          <CardDescription>{{ currentStep?.title }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="text-center py-12">
            <p>Loading...</p>
          </div>

          <!-- Memora Branding Step -->
          <div v-else-if="currentStep?.id === 'branding' && product?.slug === 'memora'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Brand Name</label>
              <input
                v-model="formData.branding.name"
                class="w-full px-3 py-2 border rounded-md"
                placeholder="Your brand name"
                type="text"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Tagline</label>
              <input
                v-model="formData.branding.tagline"
                class="w-full px-3 py-2 border rounded-md"
                placeholder="Your tagline"
                type="text"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Description</label>
              <textarea
                v-model="formData.branding.description"
                class="w-full px-3 py-2 border rounded-md"
                placeholder="Describe your brand"
                rows="4"
              />
            </div>
          </div>

          <!-- Memora Domain Step -->
          <div v-else-if="currentStep?.id === 'domain' && product?.slug === 'memora'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Domain</label>
              <input
                v-model="formData.domain.domain"
                class="w-full px-3 py-2 border rounded-md"
                placeholder="your-domain"
                type="text"
                @input="handleDomainInput"
              />
              <p class="text-xs text-muted-foreground mt-1">
                3-50 characters, letters, numbers, hyphens, and underscores only
              </p>
              <p v-if="domainValidation.message" :class="['text-xs mt-1', domainValidation.available ? 'text-green-600' : 'text-red-600']">
                {{ domainValidation.message }}
              </p>
            </div>
          </div>

          <!-- Generic Step -->
          <div v-else class="space-y-4">
            <p class="text-muted-foreground">{{ currentStep?.description || 'Complete this step to continue' }}</p>
          </div>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button v-if="currentStepIndex > 0" type="button" variant="outline" @click="previousStep">Previous</Button>
          <div v-else />
          <Button
            :disabled="!canProceed || isSubmitting"
            :loading="isSubmitting"
            @click="handleNext"
          >
            {{ currentStepIndex === steps.length - 1 ? 'Complete' : 'Next' }}
          </Button>
        </CardFooter>
      </Card>
      </div>
    </main>

    <!-- Footer -->
    <footer class="w-full border-t border-border/40 bg-background/80 backdrop-blur-sm mt-auto">
      <div class="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between h-16 gap-4">
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <MazelootLogo size="sm" use-favicon />
            <span>&copy; {{ new Date().getFullYear() }} Mazeloot. All rights reserved.</span>
          </div>
          <div class="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="/" class="hover:text-foreground transition-colors">Home</a>
            <a href="/products" class="hover:text-foreground transition-colors">Products</a>
            <a href="/pricing" class="hover:text-foreground transition-colors">Pricing</a>
            <a href="/contact" class="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/shadcn/card'
import { Button } from '@/shared/components/shadcn/button'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import { useProductsStore } from '@/shared/stores/products'
import { useProductsApi } from '@/shared/api/products'
import { useOnboardingApi } from '@/shared/api/onboarding'
import { useUserStore } from '@/shared/stores/user'
import { toast } from '@/shared/utils/toast'
import { debounce } from '@/shared/utils/debounce'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const productsApi = useProductsApi()
const onboardingApi = useOnboardingApi()
const userStore = useUserStore()

const product = ref(null)
const steps = ref([])
const currentStepIndex = ref(0)
const formData = ref({
  branding: {
    name: '',
    tagline: '',
    description: '',
  },
  domain: {
    domain: '',
  },
})
const domainValidation = ref({ available: false, message: '' })
const isLoading = ref(true)
const isSubmitting = ref(false)
const token = route.params.token
const productSlug = route.params.productSlug

const currentStep = computed(() => steps.value[currentStepIndex.value])

const canProceed = computed(() => {
  if (currentStep.value?.id === 'domain' && product.value?.slug === 'memora') {
    return formData.value.domain.domain && domainValidation.value.available
  }
  if (currentStep.value?.id === 'branding' && product.value?.slug === 'memora') {
    return formData.value.branding.name
  }
  return true
})

const validateDomain = async () => {
  const domain = formData.value.domain.domain
  if (!domain || domain.length < 3) {
    domainValidation.value = { available: false, message: '' }
    return
  }

  try {
    const validation = await onboardingApi.validateDomain(domain)
    domainValidation.value = validation
  } catch (err) {
    console.error('Failed to validate domain:', err)
    domainValidation.value = { available: false, message: 'Failed to validate domain' }
  }
}

const handleDomainInput = debounce(validateDomain, 500)

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

const handleNext = async () => {
  if (!canProceed.value) {
    return
  }

  isSubmitting.value = true
  const isLastStep = currentStepIndex.value === steps.value.length - 1
  
  try {
    const step = currentStep.value
    let stepData = {}

    if (step.id === 'branding' && product.value?.slug === 'memora') {
      stepData = formData.value.branding
    } else if (step.id === 'domain' && product.value?.slug === 'memora') {
      stepData = formData.value.domain
    }

    // Save step
    await onboardingApi.completeStep(product.value.uuid, step.id, stepData, token)

    // If last step, complete onboarding
    if (isLastStep) {
      try {
        await onboardingApi.complete(product.value.uuid, token)
        
        // Refresh user store to update onboarding status before redirect
        // This ensures the router guard recognizes onboarding is complete
        await Promise.all([
          userStore.fetchOnboardingStatus(),
          userStore.fetchSelectedProducts(),
        ])
        
        // Invalidate router cache to ensure fresh data on next navigation
        const { invalidateRouterCache } = await import('@/shared/router')
        invalidateRouterCache()
        
        // Wait for computed properties to update
        await nextTick()
        
        toast.success('Onboarding completed!')
        
        // Small delay to ensure toast is visible and store is fully updated
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Use replace to prevent back navigation to onboarding
        // Force navigation even if router guard tries to intercept
        router.replace({ name: 'overview' }).catch(() => {
          // If replace fails, try push as fallback
          router.push({ name: 'overview' })
        })
      } catch (completeErr) {
        console.error('Failed to complete onboarding:', completeErr)
        toast.error(completeErr.message || 'Failed to complete onboarding')
        
        // Still refresh and redirect even if complete fails
        await Promise.all([
          userStore.fetchOnboardingStatus(),
          userStore.fetchSelectedProducts(),
        ])
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 500))
        router.replace({ name: 'overview' }).catch(() => {
          router.push({ name: 'overview' })
        })
      }
    } else {
      currentStepIndex.value++
    }
  } catch (err) {
    console.error('Failed to save step:', err)
    toast.error(err.message || 'Failed to save step')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    // Verify token
    const tokenVerification = await onboardingApi.verifyToken(token)
    if (!tokenVerification.valid) {
      toast.error('Invalid or expired token')
      router.push({ name: 'overview' })
      return
    }

    // Load product
    await productsStore.fetchProducts()
    product.value = productsStore.getProductBySlug(productSlug)

    if (!product.value) {
      toast.error('Product not found')
      router.push({ name: 'overview' })
      return
    }

    // Set up steps based on product
    if (product.value.slug === 'memora') {
      steps.value = [
        { id: 'branding', title: 'Branding Settings', description: 'Set up your brand identity' },
        { id: 'domain', title: 'Domain Selection', description: 'Choose your unique domain' },
      ]
    } else {
      steps.value = [{ id: 'setup', title: 'Setup', description: 'Complete setup' }]
    }
  } catch (err) {
    console.error('Failed to initialize onboarding:', err)
    toast.error('Failed to load onboarding')
    router.push({ name: 'overview' })
  } finally {
    isLoading.value = false
  }
})
</script>
