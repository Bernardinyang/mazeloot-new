<template>
  <DashboardLayout>
    <template #breadcrumb>
      Settings > Branding
    </template>

    <div class="space-y-6">
      <!-- Page Header -->
      <div class="w-[50%]">
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">Branding</h1>
        <p class="text-sm mb-4" :class="theme.textSecondary">
          Customize your brand identity, logo, colors, and visual elements for your client galleries.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Content -->
      <div class="space-y-6 w-[50%]">
        <!-- Domain Section -->
        <div class="space-y-2">
          <h3 class="text-base font-semibold" :class="theme.textPrimary">Domain</h3>
          <Input
            v-model="domain"
            type="text"
            readonly
            :disabled="isDisabled"
            :class="[
              theme.bgInput,
              theme.borderInput,
              theme.textInput,
              isDisabled ? 'cursor-not-allowed' : ''
            ]"
          />
          <p class="text-xs" :class="theme.textSecondary">
            Your client galleries and mobile gallery apps are always available with your default site address. To change your default domain, edit your username under 
            <a href="#" class="text-teal-500 hover:text-teal-600 underline">Account</a>.
          </p>
        </div>

        <!-- Custom Domain Section -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold" :class="theme.textPrimary">Custom Domain</h3>
            <UpgradePopover v-if="isDisabled" v-model:open="showCustomDomainPopover" />
          </div>
          <Input
            v-model="customDomain"
            type="text"
            placeholder="www.yourdomain.com"
            :disabled="isDisabled"
            :class="[
              theme.bgInput,
              theme.borderInput,
              theme.textInput,
              theme.placeholderInput,
              isDisabled ? 'cursor-not-allowed' : ''
            ]"
          />
          <p class="text-xs" :class="theme.textSecondary">
            Use your own custom domain for your client galleries. This feature is available with an upgraded account. 
            <a href="#" class="text-teal-500 hover:text-teal-600 underline">Learn more</a>.
          </p>
        </div>

        <!-- Upgrade Section -->
        <div class="w-full rounded-lg border p-6 space-y-6" :class="[theme.bgCard, theme.borderCard]">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold uppercase text-sm" :class="theme.textPrimary">Upgrade for more brand control</h3>
            <UpgradePopover v-if="isDisabled" v-model:open="showBrandControlPopover" />
          </div>
          
          <p class="text-xs" :class="theme.textSecondary">
            Upgrade to a paid plan to add your full logo, custom favicon and more.
          </p>

          <!-- Logos Sub-section -->
          <div class="space-y-3">
            <h4 class="text-sm font-semibold" :class="theme.textPrimary">Logos</h4>
            <div class="flex items-center gap-4">
              <div 
                class="w-24 h-24 rounded border-2 border-dashed flex items-center justify-center transition-colors"
                :class="[
                  theme.borderSecondary,
                  theme.bgCard,
                  isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-teal-500'
                ]"
                @click="!isDisabled && handleUploadLogo()"
              >
                <Plus v-if="!logoPreview" class="h-8 w-8" :class="theme.textTertiary" />
                <img
                  v-else
                  :src="logoPreview"
                  alt="Logo preview"
                  class="w-full h-full object-contain p-2"
                />
              </div>
              <div class="flex-1">
                <p class="text-sm" :class="theme.textSecondary">
                  Your logo will be used in place of the text logo and profile icon, including on the white background of your homepage. For the cover logo, use a light/white logo with a transparent background for best display. 
                  <a href="#" class="text-teal-500 hover:text-teal-600 underline">Learn more</a>.
                </p>
              </div>
            </div>
          </div>

          <!-- Favicon Sub-section -->
          <div class="space-y-3">
            <h4 class="text-sm font-semibold" :class="theme.textPrimary">Favicon</h4>
            <div class="flex items-center gap-4">
              <div 
                class="w-16 h-16 rounded border-2 border-dashed flex items-center justify-center transition-colors"
                :class="[
                  theme.borderSecondary,
                  theme.bgCard,
                  isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-teal-500'
                ]"
                @click="!isDisabled && handleUploadFavicon()"
              >
                <Plus v-if="!faviconPreview" class="h-6 w-6" :class="theme.textTertiary" />
                <img
                  v-else
                  :src="faviconPreview"
                  alt="Favicon preview"
                  class="w-full h-full object-contain p-1"
                />
              </div>
              <div class="flex-1">
                <p class="text-sm" :class="theme.textSecondary">
                  You can upload a GIF, PNG or ICO file up to 32x32 pixels. 
                  <a href="#" class="text-teal-500 hover:text-teal-600 underline">Learn more</a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pixieset Branding Section -->
        <div class="flex items-center justify-between py-4">
          <div class="flex-1">
            <h3 class="text-base font-semibold mb-1" :class="theme.textPrimary">Pixieset Branding</h3>
            <p class="text-xs" :class="theme.textSecondary">
              Switching this off will hide Pixieset branding from your collections and homepage.
            </p>
          </div>
          <label class="relative inline-flex items-center group" :class="isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'">
            <input
              type="checkbox"
              v-model="showPixiesetBranding"
              :disabled="isDisabled"
              class="sr-only peer"
            />
            <div class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"></div>
            <span class="ml-3 text-sm font-medium" :class="showPixiesetBranding ? theme.textPrimary : theme.textSecondary">
              {{ showPixiesetBranding ? 'On' : 'Off' }}
            </span>
          </label>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Plus,
} from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import Input from '@/components/shadcn/input/Input.vue'
import { Separator } from '@/components/shadcn/separator'
import UpgradePopover from '@/components/custom/UpgradePopover.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from 'vue-sonner'

const theme = useThemeClasses()

// Form state
const domain = ref('bernode.pixieset.com')
const customDomain = ref('')
const logoPreview = ref<string | null>(null)
const faviconPreview = ref<string | null>(null)
const showPixiesetBranding = ref(true)
const showCustomDomainPopover = ref(false)
const showBrandControlPopover = ref(false)
const isDisabled = ref(true)

const handleUploadLogo = () => {
  if (isDisabled.value) return
  // TODO: Implement logo upload logic
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        logoPreview.value = event.target?.result as string
        toast.success('Logo uploaded successfully')
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const handleUploadFavicon = () => {
  if (isDisabled.value) return
  // TODO: Implement favicon upload logic
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*,.gif,.ico'
  input.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        faviconPreview.value = event.target?.result as string
        toast.success('Favicon uploaded successfully')
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

</script>
