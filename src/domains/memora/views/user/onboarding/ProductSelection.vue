<template>
  <OnboardingLayout>
    <!-- Header Section -->
    <div class="text-center mb-12 sm:mb-16 space-y-4">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Select Your Products
      </h1>
      <p class="text-lg sm:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
        Choose the products you want to use. You can add more anytime.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <div class="flex flex-col items-center gap-4">
        <div class="w-8 h-8 border-2 border-gray-300 dark:border-gray-700 border-t-primary rounded-full animate-spin"></div>
        <p class="text-sm text-gray-600 dark:text-gray-400">Loading products...</p>
      </div>
    </div>

    <!-- Products Container -->
    <div v-else class="space-y-12">
      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(product, index) in products"
          :key="product.uuid"
          @click="toggleProduct(product.uuid)"
          :style="{ animationDelay: `${index * 50}ms` }"
          :class="[
            'group relative rounded-xl border cursor-pointer transition-all duration-200',
            'hover:shadow-lg dark:hover:shadow-xl',
            'animate-in fade-in slide-in-from-bottom-2',
            selectedProducts.includes(product.uuid)
              ? 'border-accent bg-accent/5 dark:bg-accent/10 dark:border-accent/50 shadow-md dark:shadow-accent/10'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700',
          ]"
        >
          <div class="p-6 space-y-4">
            <!-- Icon and Switch -->
            <div class="flex items-start justify-between">
              <div
                :class="[
                  'flex items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200',
                  selectedProducts.includes(product.uuid)
                    ? 'bg-accent/10 dark:bg-accent/20'
                    : 'bg-gray-50 dark:bg-gray-800',
                ]"
              >
                <ProductIcon
                  :custom-type="product.customType || product.custom_type"
                  :class="[
                    'h-6 w-6',
                    selectedProducts.includes(product.uuid)
                      ? 'text-accent'
                      : 'text-gray-600 dark:text-gray-400',
                  ]"
                />
              </div>
              <div @click.stop class="cursor-pointer">
                <label class="relative inline-flex items-center cursor-pointer pointer-events-none">
                  <input 
                    type="checkbox" 
                    :checked="selectedProducts.includes(product.uuid)" 
                    class="sr-only peer" 
                    readonly
                    tabindex="-1"
                  />
                  <div class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-accent bg-gray-300 dark:bg-gray-600"></div>
                </label>
              </div>
            </div>

            <!-- Product Info -->
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ product.displayName || product.display_name || product.name }}
              </h3>
              <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {{ product.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Continue Button -->
      <div class="flex flex-col items-center gap-4 pt-4">
        <Button
          @click="handleContinue"
          :disabled="selectedProducts.length === 0 || saving"
          size="lg"
          class="min-w-[200px]"
          :class="[
            selectedProducts.length === 0 && 'opacity-50 cursor-not-allowed',
          ]"
        >
          <span v-if="!saving">
            Continue with {{ selectedProducts.length }} {{ selectedProducts.length === 1 ? 'Product' : 'Products' }}
          </span>
          <span v-else class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Setting up...
          </span>
        </Button>
        <p v-if="selectedProducts.length === 0" class="text-sm text-gray-500 dark:text-gray-500">
          Select at least one product to continue
        </p>
      </div>
    </div>
  </OnboardingLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/shared/components/shadcn/button'
import { getProducts } from '@/shared/api/products'
import { saveProductPreferences } from '@/shared/api/productPreferences'
import { toast } from '@/shared/utils/toast'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import OnboardingLayout from '@/shared/layouts/OnboardingLayout.vue'
import ProductIcon from '@/shared/components/atoms/ProductIcon.vue'

const router = useRouter()
const { handleError } = useErrorHandler()
const loading = ref(true)
const saving = ref(false)
const products = ref([])
const selectedProducts = ref([])

onMounted(async () => {
  try {
    const response = await getProducts()
    products.value = Array.isArray(response) ? response : []
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to load products',
    })
  } finally {
    loading.value = false
  }
})

const toggleProduct = (productUuid) => {
  const index = selectedProducts.value.indexOf(productUuid)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productUuid)
  }
}

const handleContinue = async () => {
  if (selectedProducts.value.length === 0) return

  saving.value = true
  try {
    await saveProductPreferences(selectedProducts.value)
    
    toast.success('Products selected successfully!', {
      description: 'Redirecting to onboarding...',
    })

    const firstProduct = products.value.find(p => selectedProducts.value.includes(p.uuid))
    if (firstProduct) {
      const onboardingRoute = `/${firstProduct.slug}/onboarding`
      router.push(onboardingRoute)
    } else {
      router.push({ name: 'setup' })
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to save product preferences',
    })
  } finally {
    saving.value = false
  }
}
</script>
