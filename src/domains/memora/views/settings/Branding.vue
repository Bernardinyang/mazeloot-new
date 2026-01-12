<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Branding </template>

    <div class="space-y-8 w-1/2">
      <!-- Page Header -->
      <div>
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">Branding</h1>
        <p class="text-sm mb-6" :class="theme.textSecondary">
          Customize your brand identity, logo, colors, and visual elements for your client galleries.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <Loader2 class="h-8 w-8 animate-spin" :class="theme.textTertiary" />
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- Brand Details Card -->
        <div class="rounded-xl border p-6 space-y-5" :class="[theme.bgCard, theme.borderCard]">
          <div>
            <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Brand Details</h2>
            <p class="text-sm" :class="theme.textSecondary">
              Add information about your brand for display on your galleries
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Brand Name -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Brand Name</label>
              <Input
                v-model="brandName"
                type="text"
                placeholder="Your Brand Name"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Support Email -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Support Email</label>
              <Input
                v-model="supportEmail"
                type="email"
                placeholder="support@example.com"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Support Phone -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Support Phone</label>
              <Input
                v-model="supportPhone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Website -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Website</label>
              <Input
                v-model="website"
                type="url"
                placeholder="https://www.example.com"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Location -->
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Location</label>
              <Input
                v-model="location"
                type="text"
                placeholder="City, State or Address"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Tagline -->
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Tagline</label>
              <Input
                v-model="tagline"
                type="text"
                placeholder="Your brand tagline or slogan"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Description -->
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Description</label>
              <Textarea
                v-model="description"
                placeholder="Tell us about your brand..."
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  'min-h-[100px]',
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Address Section -->
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Address</label>
            </div>

            <!-- Street Address -->
            <div class="space-y-2 md:col-span-2">
              <Input
                v-model="addressStreet"
                type="text"
                placeholder="Street Address"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- City, State, Zip -->
            <div class="space-y-2">
              <Input
                v-model="addressCity"
                type="text"
                placeholder="City"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <div class="space-y-2">
              <Input
                v-model="addressState"
                type="text"
                placeholder="State/Province"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <div class="space-y-2">
              <Input
                v-model="addressZip"
                type="text"
                placeholder="ZIP/Postal Code"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <div class="space-y-2">
              <Input
                v-model="addressCountry"
                type="text"
                placeholder="Country"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Business Hours -->
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Business Hours</label>
              <Textarea
                v-model="businessHours"
                placeholder="e.g., Monday-Friday: 9am-5pm"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  'min-h-[80px]',
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Contact Name -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Contact Name</label>
              <Input
                v-model="contactName"
                type="text"
                placeholder="Primary contact person"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Tax/VAT ID -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Tax/VAT ID</label>
              <Input
                v-model="taxVatId"
                type="text"
                placeholder="Tax or VAT identification number"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Founded Year -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Founded Year</label>
              <Input
                v-model="foundedYear"
                type="number"
                placeholder="YYYY"
                :min="1800"
                :max="new Date().getFullYear()"
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>

            <!-- Industry -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Industry</label>
              <Input
                v-model="industry"
                type="text"
                placeholder="e.g., Photography, Design, etc."
                :disabled="isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>
          </div>
        </div>

        <!-- Domain Settings Card -->
        <div class="rounded-xl border p-6 space-y-5" :class="[theme.bgCard, theme.borderCard]">
          <div>
            <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Domain Settings</h2>
            <p class="text-sm" :class="theme.textSecondary">
              Configure your domain and custom domain settings
            </p>
          </div>

          <div class="space-y-5">
            <!-- Default Domain -->
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">Default Domain</label>
              <Input
                v-model="domain"
                type="text"
                readonly
                :disabled="isDisabled || isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  'font-mono text-sm',
                  isDisabled || isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Your client galleries are always available at this address. To change your default domain, edit your username under
                <a href="#" class="text-accent hover:text-accent/80 underline font-medium">Account Settings</a>.
              </p>
            </div>

            <!-- Custom Domain -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium" :class="theme.textPrimary">Custom Domain</label>
                <UpgradePopover v-if="isDisabled" v-model:open="showCustomDomainPopover" />
              </div>
              <Input
                v-model="customDomain"
                type="text"
                placeholder="www.yourdomain.com"
                :disabled="isDisabled || isLoading"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  'font-mono text-sm',
                  isDisabled || isLoading ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Use your own custom domain for your client galleries. This feature is available with an upgraded account.
                <a href="#" class="text-accent hover:text-accent/80 underline font-medium">Learn more</a>.
              </p>
            </div>
          </div>
        </div>

        <!-- Brand Assets Card -->
        <div class="rounded-xl border p-6 space-y-6" :class="[theme.bgCard, theme.borderCard]">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Brand Assets</h2>
              <p class="text-sm" :class="theme.textSecondary">
                Upload your logo and favicon to customize your brand appearance
              </p>
            </div>
            <UpgradePopover v-if="isDisabled" v-model:open="showBrandControlPopover" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Logo Upload -->
            <div class="space-y-3">
              <label class="text-sm font-medium" :class="theme.textPrimary">Logo</label>
              <div
                class="w-full aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:border-accent/50"
                :class="[
                  theme.borderSecondary,
                  theme.bgCard,
                  isDisabled || isUploadingLogo
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:bg-accent/5',
                ]"
                @click="!isDisabled && !isUploadingLogo && handleUploadLogo()"
              >
                <Loader2
                  v-if="isUploadingLogo"
                  class="h-10 w-10 animate-spin"
                  :class="theme.textTertiary"
                />
                <template v-else-if="logoPreview">
                  <img
                    :src="logoPreview"
                    alt="Logo preview"
                    class="w-full h-full object-contain p-4"
                  />
                  <p class="text-xs font-medium" :class="theme.textSecondary">Click to change</p>
                </template>
                <template v-else>
                  <Plus class="h-10 w-10" :class="theme.textTertiary" />
                  <p class="text-xs font-medium" :class="theme.textSecondary">Upload Logo</p>
                </template>
              </div>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Your logo will be used in place of the text logo and profile icon. For best display, use a light/white logo with a transparent background.
              </p>
            </div>

            <!-- Favicon Upload -->
            <div class="space-y-3">
              <label class="text-sm font-medium" :class="theme.textPrimary">Favicon</label>
              <div
                class="w-full aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:border-accent/50"
                :class="[
                  theme.borderSecondary,
                  theme.bgCard,
                  isDisabled || isUploadingFavicon
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:bg-accent/5',
                ]"
                @click="!isDisabled && !isUploadingFavicon && handleUploadFavicon()"
              >
                <Loader2
                  v-if="isUploadingFavicon"
                  class="h-8 w-8 animate-spin"
                  :class="theme.textTertiary"
                />
                <template v-else-if="faviconPreview">
                  <img
                    :src="faviconPreview"
                    alt="Favicon preview"
                    class="w-16 h-16 object-contain"
                  />
                  <p class="text-xs font-medium" :class="theme.textSecondary">Click to change</p>
                </template>
                <template v-else>
                  <Plus class="h-8 w-8" :class="theme.textTertiary" />
                  <p class="text-xs font-medium" :class="theme.textSecondary">Upload Favicon</p>
                </template>
              </div>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Upload a GIF, PNG or ICO file up to 32x32 pixels. This appears in browser tabs and bookmarks.
              </p>
            </div>
          </div>
        </div>

        <!-- Branding Options Card -->
        <div class="rounded-xl border p-6" :class="[theme.bgCard, theme.borderCard]">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">
                Mazeloot Branding
              </h2>
              <p class="text-sm" :class="theme.textSecondary">
                Control whether Mazeloot branding appears on your collections and homepage
              </p>
            </div>
            <div class="flex items-center gap-3 ml-6">
              <label
                class="relative inline-flex items-center group"
                :class="isDisabled || isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
              >
                <input
                  type="checkbox"
                  v-model="showMazelootBranding"
                  :disabled="isDisabled || isLoading"
                  class="sr-only peer"
                />
                <div
                  class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-accent bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"
                ></div>
                <span
                  class="ml-3 text-sm font-medium min-w-[40px]"
                  :class="showMazelootBranding ? theme.textPrimary : theme.textSecondary"
                >
                  {{ showMazelootBranding ? 'On' : 'Off' }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div :class="theme.borderSecondary" class="mt-8 pt-6 border-t">
        <div class="flex items-center justify-between gap-3">
          <div v-if="hasChanges" class="flex items-center gap-2 text-sm">
            <div class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span :class="theme.textSecondary">You have unsaved changes</span>
          </div>
          <div v-else class="flex items-center gap-2 text-sm">
            <Check class="h-4 w-4 text-accent" />
            <span :class="theme.textSecondary">All changes saved</span>
          </div>
          <Button
            variant="primary"
            :disabled="!hasChanges || isLoading"
            :loading="isSaving"
            loading-label="Saving..."
            @click="handleSave"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Plus, Loader2, Check } from 'lucide-vue-next'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import Input from '@/shared/components/shadcn/input/Input.vue'
import { Textarea } from '@/shared/components/shadcn/textarea'
import { Separator } from '@/shared/components/shadcn/separator'
import { Button } from '@/shared/components/shadcn/button'
import UpgradePopover from '@/shared/components/molecules/UpgradePopover.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'
import { useSettingsApi } from '@/domains/memora/api/settings'
import { apiClient } from '@/shared/api/client'

const theme = useThemeClasses()
const { fetchSettings, updateBranding } = useSettingsApi()

// Form state
const domain = ref('')
const customDomain = ref('')
const logoPreview = ref(null)
const faviconPreview = ref(null)
const logoUuid = ref(null)
const faviconUuid = ref(null)
const showMazelootBranding = ref(true)
const brandName = ref('')
const supportEmail = ref('')
const supportPhone = ref('')
const website = ref('')
const location = ref('')
const tagline = ref('')
const description = ref('')
const addressStreet = ref('')
const addressCity = ref('')
const addressState = ref('')
const addressZip = ref('')
const addressCountry = ref('')
const businessHours = ref('')
const contactName = ref('')
const taxVatId = ref('')
const foundedYear = ref(null)
const industry = ref('')
const showCustomDomainPopover = ref(false)
const showBrandControlPopover = ref(false)
const isDisabled = ref(false)

// Loading states
const isLoading = ref(false)
const isUploadingLogo = ref(false)
const isUploadingFavicon = ref(false)
const isSaving = ref(false)

// Original values for change tracking
const originalCustomDomain = ref('')
const originalShowMazelootBranding = ref(true)
const originalLogoUuid = ref(null)
const originalFaviconUuid = ref(null)
const originalBrandName = ref('')
const originalSupportEmail = ref('')
const originalSupportPhone = ref('')
const originalWebsite = ref('')
const originalLocation = ref('')
const originalTagline = ref('')
const originalDescription = ref('')
const originalAddressStreet = ref('')
const originalAddressCity = ref('')
const originalAddressState = ref('')
const originalAddressZip = ref('')
const originalAddressCountry = ref('')
const originalBusinessHours = ref('')
const originalContactName = ref('')
const originalTaxVatId = ref('')
const originalFoundedYear = ref(null)
const originalIndustry = ref('')

// Computed to check if there are changes
const hasChanges = computed(() => {
  return (
    customDomain.value !== originalCustomDomain.value ||
    showMazelootBranding.value !== originalShowMazelootBranding.value ||
    logoUuid.value !== originalLogoUuid.value ||
    faviconUuid.value !== originalFaviconUuid.value ||
    brandName.value !== originalBrandName.value ||
    supportEmail.value !== originalSupportEmail.value ||
    supportPhone.value !== originalSupportPhone.value ||
    website.value !== originalWebsite.value ||
    location.value !== originalLocation.value ||
    tagline.value !== originalTagline.value ||
    description.value !== originalDescription.value ||
    addressStreet.value !== originalAddressStreet.value ||
    addressCity.value !== originalAddressCity.value ||
    addressState.value !== originalAddressState.value ||
    addressZip.value !== originalAddressZip.value ||
    addressCountry.value !== originalAddressCountry.value ||
    businessHours.value !== originalBusinessHours.value ||
    contactName.value !== originalContactName.value ||
    taxVatId.value !== originalTaxVatId.value ||
    foundedYear.value !== originalFoundedYear.value ||
    industry.value !== originalIndustry.value
  )
})

// Fetch settings on mount
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await fetchSettings()
    const settings = response.data || response
    
    domain.value = settings.branding?.domain || ''
    customDomain.value = settings.branding?.customDomain || ''
    logoPreview.value = settings.branding?.logoUrl || null
    faviconPreview.value = settings.branding?.faviconUrl || null
    logoUuid.value = settings.branding?.logoUuid || null
    faviconUuid.value = settings.branding?.faviconUuid || null
    showMazelootBranding.value = settings.branding?.showMazelootBranding ?? true
    brandName.value = settings.branding?.name || ''
    supportEmail.value = settings.branding?.supportEmail || ''
    supportPhone.value = settings.branding?.supportPhone || ''
    website.value = settings.branding?.website || ''
    location.value = settings.branding?.location || ''
    tagline.value = settings.branding?.tagline || ''
    description.value = settings.branding?.description || ''
    addressStreet.value = settings.branding?.addressStreet || ''
    addressCity.value = settings.branding?.addressCity || ''
    addressState.value = settings.branding?.addressState || ''
    addressZip.value = settings.branding?.addressZip || ''
    addressCountry.value = settings.branding?.addressCountry || ''
    businessHours.value = settings.branding?.businessHours || ''
    contactName.value = settings.branding?.contactName || ''
    taxVatId.value = settings.branding?.taxVatId || ''
    foundedYear.value = settings.branding?.foundedYear || null
    industry.value = settings.branding?.industry || ''

    // Store original values
    originalCustomDomain.value = customDomain.value
    originalShowMazelootBranding.value = showMazelootBranding.value
    originalLogoUuid.value = logoUuid.value
    originalFaviconUuid.value = faviconUuid.value
    originalBrandName.value = brandName.value
    originalSupportEmail.value = supportEmail.value
    originalSupportPhone.value = supportPhone.value
    originalWebsite.value = website.value
    originalLocation.value = location.value
    originalTagline.value = tagline.value
    originalDescription.value = description.value
    originalAddressStreet.value = addressStreet.value
    originalAddressCity.value = addressCity.value
    originalAddressState.value = addressState.value
    originalAddressZip.value = addressZip.value
    originalAddressCountry.value = addressCountry.value
    originalBusinessHours.value = businessHours.value
    originalContactName.value = contactName.value
    originalTaxVatId.value = taxVatId.value
    originalFoundedYear.value = foundedYear.value
    originalIndustry.value = industry.value
  } catch (error) {
    toast.error('Failed to load settings', {
      description: error.message || 'Please try again',
    })
  } finally {
    isLoading.value = false
  }
})

// Manual save function
const handleSave = async () => {
  if (!hasChanges.value) return

  isSaving.value = true
  try {
    await updateBranding({
      customDomain: customDomain.value,
      showMazelootBranding: showMazelootBranding.value,
      logoUuid: logoUuid.value,
      faviconUuid: faviconUuid.value,
      name: brandName.value,
      supportEmail: supportEmail.value,
      supportPhone: supportPhone.value,
      website: website.value,
      location: location.value,
      tagline: tagline.value,
      description: description.value,
      addressStreet: addressStreet.value,
      addressCity: addressCity.value,
      addressState: addressState.value,
      addressZip: addressZip.value,
      addressCountry: addressCountry.value,
      businessHours: businessHours.value,
      contactName: contactName.value,
      taxVatId: taxVatId.value,
      foundedYear: foundedYear.value ? parseInt(foundedYear.value) : null,
      industry: industry.value,
    })

    // Update original values after successful save
    originalCustomDomain.value = customDomain.value
    originalShowMazelootBranding.value = showMazelootBranding.value
    originalLogoUuid.value = logoUuid.value
    originalFaviconUuid.value = faviconUuid.value
    originalBrandName.value = brandName.value
    originalSupportEmail.value = supportEmail.value
    originalSupportPhone.value = supportPhone.value
    originalWebsite.value = website.value
    originalLocation.value = location.value
    originalTagline.value = tagline.value
    originalDescription.value = description.value
    originalAddressStreet.value = addressStreet.value
    originalAddressCity.value = addressCity.value
    originalAddressState.value = addressState.value
    originalAddressZip.value = addressZip.value
    originalAddressCountry.value = addressCountry.value
    originalBusinessHours.value = businessHours.value
    originalContactName.value = contactName.value
    originalTaxVatId.value = taxVatId.value
    originalFoundedYear.value = foundedYear.value
    originalIndustry.value = industry.value

    toast.success('Settings saved successfully')
  } catch (error) {
    toast.error('Failed to save settings', {
      description: error.message || 'Please try again',
    })
  } finally {
    isSaving.value = false
  }
}

const handleUploadLogo = async () => {
  if (isDisabled.value || isUploadingLogo.value) return
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async e => {
    const file = e.target.files?.[0]
    if (!file) return

    isUploadingLogo.value = true
    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = event => {
        logoPreview.value = event.target?.result
      }
      reader.readAsDataURL(file)

      // Upload file
      const uploadEndpoint = '/v1/images/upload'
      const uploadResponse = await apiClient.upload(uploadEndpoint, file, {
        purpose: 'branding_logo',
      })

      const userFileUuid =
        uploadResponse.data?.userFileUuid ||
        uploadResponse.data?.data?.userFileUuid ||
        uploadResponse.userFileUuid

      if (!userFileUuid) {
        throw new Error('Upload response missing userFileUuid')
      }

      logoUuid.value = userFileUuid

      toast.success('Logo uploaded. Click "Save Changes" to apply.')
    } catch (error) {
      logoPreview.value = null
      toast.error('Failed to upload logo', {
        description: error.message || 'Please try again',
      })
    } finally {
      isUploadingLogo.value = false
    }
  }
  input.click()
}

const handleUploadFavicon = async () => {
  if (isDisabled.value || isUploadingFavicon.value) return
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*,.gif,.ico'
  input.onchange = async e => {
    const file = e.target.files?.[0]
    if (!file) return

    isUploadingFavicon.value = true
    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = event => {
        faviconPreview.value = event.target?.result
      }
      reader.readAsDataURL(file)

      // Upload file
      const uploadEndpoint = '/v1/images/upload'
      const uploadResponse = await apiClient.upload(uploadEndpoint, file, {
        purpose: 'branding_favicon',
      })

      const userFileUuid =
        uploadResponse.data?.userFileUuid ||
        uploadResponse.data?.data?.userFileUuid ||
        uploadResponse.userFileUuid

      if (!userFileUuid) {
        throw new Error('Upload response missing userFileUuid')
      }

      faviconUuid.value = userFileUuid

      toast.success('Favicon uploaded. Click "Save Changes" to apply.')
    } catch (error) {
      faviconPreview.value = null
      toast.error('Failed to upload favicon', {
        description: error.message || 'Please try again',
      })
    } finally {
      isUploadingFavicon.value = false
    }
  }
  input.click()
}
</script>
