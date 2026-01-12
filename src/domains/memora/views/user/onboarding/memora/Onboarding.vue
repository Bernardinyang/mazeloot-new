<template>
  <OnboardingLayout>
    <!-- Progress Indicator -->
    <div class="mb-8 sm:mb-10">
      <div class="flex items-center justify-center gap-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-semibold">1</div>
          <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Domain</span>
        </div>
        <div class="w-12 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" :class="domainAvailable ? 'bg-accent text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'">2</div>
          <span class="text-sm font-medium" :class="domainAvailable ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500'">Branding</span>
        </div>
      </div>
    </div>

    <!-- Header Section -->
    <div class="text-center mb-10 sm:mb-12 space-y-4">
      <div class="flex justify-center mb-4">
        <div class="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/10 dark:from-accent/30 dark:to-accent/20 shadow-lg ring-4 ring-accent/10">
          <ProductIcon custom-type="memora" class="h-10 w-10 text-accent" />
        </div>
      </div>
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Set up Memora
      </h1>
      <p class="text-lg sm:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed">
        Configure your branding and domain to get started
      </p>
    </div>

    <!-- Form -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 sm:p-10 shadow-xl">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Domain Section -->
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-base font-semibold text-gray-900 dark:text-gray-100">
              Preferred Domain
            </label>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Choose a unique domain for your public collection URLs
            </p>
          </div>
          
          <div class="flex items-stretch gap-3">
            <div class="flex-1 relative">
              <Input
                v-model="domain"
                type="text"
                placeholder="your-domain"
                class="h-12 text-base pr-28"
                :class="domainError ? 'border-red-500 dark:border-red-500 focus-visible:ring-red-500' : domainAvailable ? 'border-green-500 dark:border-green-500 focus-visible:ring-green-500' : ''"
                @keydown.enter.prevent="checkDomain"
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">.mazeloot.com</span>
              </div>
            </div>
            <Button
              type="button"
              @click="checkDomain"
              :disabled="!domain || checkingDomain"
              :loading="checkingDomain"
              class="h-12 px-6 font-semibold"
            >
              {{ checkingDomain ? 'Checking...' : 'Check' }}
            </Button>
          </div>

          <!-- Status Messages -->
          <div v-if="checkingDomain" class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm font-medium text-blue-900 dark:text-blue-100">Checking availability...</p>
          </div>
          
          <div v-else-if="domainError" class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div class="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <span class="text-white text-xs font-bold">×</span>
            </div>
            <p class="text-sm font-medium text-red-900 dark:text-red-100">{{ domainError }}</p>
          </div>
          
          <div v-else-if="domain && domainAvailable" class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check class="w-3 h-3 text-white" />
            </div>
            <p class="text-sm font-medium text-green-900 dark:text-green-100">Domain is available</p>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            Example: <span class="font-mono text-gray-700 dark:text-gray-300">{{ domain || 'your-domain' }}.mazeloot.com</span>
          </p>
        </div>

        <!-- Branding Section - only show if domain is available -->
        <template v-if="domainAvailable">
          <div class="border-t border-gray-200 dark:border-gray-800 pt-8 space-y-6">
            <div class="space-y-2">
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Branding Information</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">Customize how your brand appears to clients</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Brand Name -->
              <div class="space-y-2 sm:col-span-2">
                <label class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Brand Name <span class="text-red-500">*</span>
                </label>
                <Input
                  v-model="brandName"
                  type="text"
                  placeholder="Your Brand Name"
                  class="h-12 text-base"
                />
              </div>

              <!-- Support Email -->
              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Support Email <span class="text-red-500">*</span>
                </label>
                <Input
                  v-model="supportEmail"
                  type="email"
                  placeholder="support@example.com"
                  class="h-12 text-base"
                />
              </div>

              <!-- Support Phone -->
              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Support Phone <span class="text-gray-500 dark:text-gray-500 font-normal text-xs">(Optional)</span>
                </label>
                <Input
                  v-model="supportPhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  class="h-12 text-base"
                />
              </div>

              <!-- Website -->
              <div class="space-y-2 sm:col-span-2">
                <label class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Website <span class="text-gray-500 dark:text-gray-500 font-normal text-xs">(Optional)</span>
                </label>
                <Input
                  v-model="website"
                  type="url"
                  placeholder="https://www.example.com"
                  class="h-12 text-base"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="submit"
              :disabled="saving || !isValid"
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
        </template>
      </form>
    </div>
  </OnboardingLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Check, ArrowRight } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import { setupProduct } from '@/shared/api/productPreferences'
import { checkDomainAvailability } from '@/shared/api/productPreferences'
import { useSettingsApi } from '@/domains/memora/api/settings'
import { toast } from '@/shared/utils/toast'
import { useErrorHandler } from '@/shared/composables/useErrorHandler'
import OnboardingLayout from '@/shared/layouts/OnboardingLayout.vue'
import ProductIcon from '@/shared/components/atoms/ProductIcon.vue'
import { useUserStore } from '@/shared/stores/user'

const router = useRouter()
const route = useRoute()
const { handleError } = useErrorHandler()
const { updateBranding } = useSettingsApi()
const userStore = useUserStore()

const saving = ref(false)
const checkingDomain = ref(false)
const domain = ref('')
const domainError = ref('')
const domainAvailable = ref(false)
const brandName = ref('')
const supportEmail = ref('')
const supportPhone = ref('')
const website = ref('')

const isValid = computed(() => {
  return domain.value && domainAvailable.value && brandName.value && supportEmail.value
})

const validateDomainFormat = () => {
  domainError.value = ''
  
  if (!domain.value) {
    domainError.value = 'Domain is required'
    return false
  }
  
  if (!/^[a-z0-9-]+$/.test(domain.value)) {
    domainError.value = 'Domain can only contain lowercase letters, numbers, and hyphens'
    return false
  }
  
  if (domain.value.length < 3 || domain.value.length > 63) {
    domainError.value = 'Domain must be between 3 and 63 characters'
    return false
  }
  
  if (domain.value[0] === '-' || domain.value[domain.value.length - 1] === '-') {
    domainError.value = 'Domain cannot start or end with a hyphen'
    return false
  }
  
  const reserved = ['admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'test', 'staging', 'dev', 'app']
  if (reserved.includes(domain.value.toLowerCase())) {
    domainError.value = 'This domain is reserved and cannot be used'
    return false
  }
  
  return true
}

const checkDomain = async () => {
  if (!validateDomainFormat()) {
    return
  }
  
  checkingDomain.value = true
  domainAvailable.value = false
  domainError.value = ''
  
  try {
    const response = await checkDomainAvailability(domain.value)
    domainAvailable.value = response?.available ?? false
    if (!domainAvailable.value) {
      domainError.value = 'This domain is already taken'
    }
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to check domain availability',
      silent: true,
    })
    domainAvailable.value = false
    domainError.value = 'Failed to check domain availability'
  } finally {
    checkingDomain.value = false
  }
}

const handleSubmit = async () => {
  if (!isValid.value) return

  saving.value = true
  try {
    const productSlug = route.params.productSlug || 'memora'
    
    await setupProduct(productSlug, {
      domain: domain.value,
    })
    
    await updateBranding({
      name: brandName.value,
      supportEmail: supportEmail.value,
      supportPhone: supportPhone.value,
      website: website.value,
      domain: domain.value,
    })
    
    userStore.markUserAsExisting()
    
    toast.success('Memora set up successfully!', {
      description: 'Redirecting...',
    })
    
    router.push({ name: 'memoraDashboard' })
  } catch (error) {
    handleError(error, {
      fallbackMessage: 'Failed to set up Memora',
    })
  } finally {
    saving.value = false
  }
}
</script>
