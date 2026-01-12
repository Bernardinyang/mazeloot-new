<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-2xl text-center">
      <div class="mb-8">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <h1 class="text-3xl font-bold mb-2">Setting up your house...</h1>
        <p class="text-muted-foreground">Please wait while we configure your selected products</p>
      </div>

      <div v-if="currentProduct" class="mb-4">
        <p class="text-sm text-muted-foreground">
          Setting up {{ currentProduct.display_name }}...
        </p>
      </div>

      <div v-if="errors.length > 0" class="mt-8">
        <div class="bg-destructive/10 border border-destructive rounded-lg p-4">
          <p class="text-destructive font-semibold mb-2">Some products failed to set up:</p>
          <ul class="text-sm text-destructive/80 space-y-1">
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProductPreferences, setupProduct } from '@/shared/api/productPreferences'
import { getProducts } from '@/shared/api/products'
import { toast } from '@/shared/utils/toast'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'

const router = useRouter()
const { handleError } = useErrorHandler()
const currentProduct = ref(null)
const errors = ref([])

onMounted(async () => {
  try {
    // Get user's selected products
    const preferencesResponse = await getProductPreferences()
    const preferences = preferencesResponse.data || []

    // Filter products that haven't completed onboarding
    const incompleteProducts = preferences.filter(p => !p.onboarding_completed)

    if (incompleteProducts.length === 0) {
      // All products are set up, redirect to overview
      router.push({ name: 'overview' })
      return
    }

    // Get all products for display names
    const productsResponse = await getProducts()
    const allProducts = productsResponse.data || []
    const productMap = new Map(allProducts.map(p => [p.uuid, p]))

    // Set up each product
    for (const preference of incompleteProducts) {
      const product = productMap.get(preference.product_uuid)
      if (!product) continue

      currentProduct.value = product

      try {
        // For Memora, we need to get subdomain from onboarding data
        // For now, we'll set up with empty data (subdomain will be set during onboarding)
        const setupData = {}
        
        await setupProduct(product.id, setupData)
      } catch (error) {
        errors.value.push(`Failed to set up ${product.display_name}: ${error.message || 'Unknown error'}`)
        handleError(error, {
          fallbackMessage: `Failed to set up ${product.display_name}`,
          silent: true,
        })
      }
    }

    // All products set up (or attempted), redirect to overview
    setTimeout(() => {
      router.push({ name: 'overview' })
    }, 1000)
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to set up products',
    })
    // Redirect to overview even on error
    setTimeout(() => {
      router.push({ name: 'overview' })
    }, 2000)
  }
})
</script>
