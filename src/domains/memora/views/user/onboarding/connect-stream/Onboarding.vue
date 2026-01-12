<template>
  <OnboardingLayout>
    <!-- Header Section -->
    <div class="text-center mb-10 sm:mb-12 space-y-4">
      <div class="flex justify-center mb-4">
        <div class="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/10 dark:from-accent/30 dark:to-accent/20 shadow-lg ring-4 ring-accent/10">
          <ProductIcon custom-type="connect-stream" class="h-10 w-10 text-accent" />
        </div>
      </div>
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Set up Connect Stream
      </h1>
      <p class="text-lg sm:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed">
        Community / Newsfeed platform setup
      </p>
    </div>

    <!-- Content Card -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 sm:p-10 shadow-xl">
      <div class="text-center py-12 space-y-6">
        <div class="flex items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 dark:from-accent/30 dark:to-accent/20 flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Getting ready...</h2>
          <p class="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Connect Stream is being configured for your account. You can customize settings after setup.
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
        <Button
          @click="handleComplete"
          :disabled="saving"
          :loading="saving"
          size="lg"
          class="min-w-[160px] h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span v-if="!saving" class="flex items-center gap-2">
            Continue
            <ArrowRight class="w-4 h-4" />
          </span>
          <span v-else>Setting up...</span>
        </Button>
      </div>
    </div>
  </OnboardingLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import { setupProduct } from '@/shared/api/productPreferences'
import { toast } from '@/shared/utils/toast'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import OnboardingLayout from '@/shared/layouts/OnboardingLayout.vue'
import ProductIcon from '@/shared/components/atoms/ProductIcon.vue'

const router = useRouter()
const route = useRoute()
const { handleError } = useErrorHandler()
const saving = ref(false)

const handleComplete = async () => {
  saving.value = true
  try {
    const productSlug = route.params.productSlug || 'connect-stream'
    await setupProduct(productSlug, {})
    toast.success('Connect Stream set up successfully!', {
      description: 'Redirecting...',
    })
    router.push({ path: `/${productSlug}/dashboard` })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to set up Connect Stream',
    })
  } finally {
    saving.value = false
  }
}

</script>
