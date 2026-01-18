<template>
  <SidebarModal
    v-model="isOpen"
    :title="title"
    :description="description"
    side="right"
    content-class="w-full sm:w-[480px]"
  >
    <div class="space-y-5">
        <!-- Share Link Section -->
        <div
          :class="[
            theme.borderSecondary,
            'rounded-xl border p-4 transition-all hover:border-opacity-60',
          ]"
          class="bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-900/30"
        >
          <div class="flex items-center gap-2 mb-3">
            <div
              class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <label :class="theme.textPrimary" class="text-sm font-semibold"> {{ linkLabel }} </label>
          </div>
          <div class="flex items-center gap-2">
            <input
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                'font-mono text-xs flex-1 h-10 w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20',
              ]"
              :value="computedShareLink"
              readonly
            />
            <Button
              :class="[
                copiedLink
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                  : theme.borderSecondary + ' ' + theme.textPrimary,
                'flex-shrink-0 transition-all duration-200',
              ]"
              size="sm"
              variant="accent"
              @click="handleCopyLink"
            >
              <Check v-if="copiedLink" class="h-4 w-4 mr-1.5" />
              <Copy v-else class="h-4 w-4 mr-1.5" />
              {{ copiedLink ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <p :class="theme.textSecondary" class="text-xs mt-2 ml-0.5">
            {{ linkDescription }}
          </p>
        </div>

        <!-- Password Section (if exists) -->
        <div
          v-if="password"
          :class="[
            theme.borderSecondary,
            'rounded-xl border p-4 transition-all hover:border-opacity-60',
          ]"
          class="bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-900/30"
        >
          <div class="flex items-center gap-2 mb-3">
            <div
              class="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Password </label>
          </div>
          <div class="flex items-center gap-2">
            <input
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                'font-mono text-xs flex-1 h-10 w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-all focus:ring-2 focus:ring-purple-500/20',
              ]"
              :type="showPassword ? 'text' : 'password'"
              :value="password"
              readonly
            />
            <Button
              :class="[theme.borderSecondary, theme.textPrimary, 'flex-shrink-0']"
              size="sm"
              variant="accent"
              @click="togglePasswordVisibility"
            >
              <Eye v-if="!showPassword" class="h-4 w-4" />
              <EyeOff v-else class="h-4 w-4" />
            </Button>
            <Button
              :class="[
                copiedPassword
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                  : theme.borderSecondary + ' ' + theme.textPrimary,
                'flex-shrink-0 transition-all duration-200',
              ]"
              size="sm"
              variant="accent"
              @click="handleCopyPassword"
            >
              <Check v-if="copiedPassword" class="h-4 w-4" />
              <Copy v-else class="h-4 w-4" />
            </Button>
          </div>
          <p :class="theme.textSecondary" class="text-xs mt-2 ml-0.5">
            {{ passwordDescription }}
          </p>
        </div>

        <!-- Download PIN Section (if exists) -->
        <div
          v-if="pin"
          :class="[
            theme.borderSecondary,
            'rounded-xl border p-4 transition-all hover:border-opacity-60',
          ]"
          class="bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-900/30"
        >
          <div class="flex items-center gap-2 mb-3">
            <div
              class="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <label :class="theme.textPrimary" class="text-sm font-semibold"> {{ pinLabel }} </label>
          </div>
          <div class="flex items-center gap-2">
            <input
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                'font-mono text-xs flex-1 h-10 w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-all focus:ring-2 focus:ring-orange-500/20',
              ]"
              :type="showPin ? 'text' : 'password'"
              :value="pin"
              readonly
            />
            <Button
              :class="[theme.borderSecondary, theme.textPrimary, 'flex-shrink-0']"
              size="sm"
              variant="accent"
              @click="togglePinVisibility"
            >
              <Eye v-if="!showPin" class="h-4 w-4" />
              <EyeOff v-else class="h-4 w-4" />
            </Button>
            <Button
              :class="[
                copiedPin
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                  : theme.borderSecondary + ' ' + theme.textPrimary,
                'flex-shrink-0 transition-all duration-200',
              ]"
              size="sm"
              variant="accent"
              @click="handleCopyPin"
            >
              <Check v-if="copiedPin" class="h-4 w-4" />
              <Copy v-else class="h-4 w-4" />
            </Button>
          </div>
          <p :class="theme.textSecondary" class="text-xs mt-2 ml-0.5">
            {{ pinDescription }}
          </p>
        </div>

        <!-- QR Code Section -->
        <div
          :class="[
            theme.borderSecondary,
            'rounded-xl border p-5 transition-all hover:border-opacity-60',
          ]"
          class="bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-900/30"
        >
          <div class="flex items-center gap-2 mb-4">
            <div
              class="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <label :class="theme.textPrimary" class="text-sm font-semibold"> QR Code </label>
          </div>
          <div class="flex flex-col items-center gap-4">
            <div
              v-if="qrCodeDataUrl"
              class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <img :src="qrCodeDataUrl" alt="QR Code" class="w-44 h-44" />
            </div>
            <div
              v-else
              class="w-44 h-44 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin" />
            </div>
            <Button
              :class="[
                theme.borderSecondary,
                theme.textPrimary,
                'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400',
              ]"
              :disabled="!qrCodeDataUrl"
              size="sm"
              variant="accent"
              class="transition-all duration-200"
              @click="handleDownloadQR"
            >
              <Download class="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
            <p :class="theme.textSecondary" class="text-xs text-center max-w-xs">
              {{ qrCodeDescription }}
            </p>
          </div>
        </div>

        <!-- Share Options -->
        <div class="space-y-3">
          <label :class="theme.textPrimary" class="text-sm font-semibold flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share Via
          </label>
          <div class="grid grid-cols-2 gap-3">
            <!-- WhatsApp -->
            <Button
              class="flex items-center justify-center gap-2.5 h-12 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:border-green-300 dark:hover:border-green-700 shadow-sm"
              variant="accent"
              @click="handleShareWhatsApp"
            >
              <svg
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                />
              </svg>
              <span class="font-semibold">WhatsApp</span>
            </Button>

            <!-- Email -->
            <Button
              class="flex items-center justify-center gap-2.5 h-12 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm"
              variant="accent"
              @click="handleShareEmail"
            >
              <Mail class="h-5 w-5" />
              <span class="font-semibold">Email</span>
            </Button>
          </div>
        </div>
      </div>

    <template #footer>
      <Button
        variant="destructive"
        @click="close"
      >
        Close
      </Button>
    </template>
  </SidebarModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Copy, Download, Eye, EyeOff, Loader2, Mail, Check } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import SidebarModal from '@/shared/components/molecules/SidebarModal.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  open: {
    type: Boolean,
    default: undefined,
  },
  shareLink: {
    type: String,
    default: '',
  },
  routeName: {
    type: String,
    default: null,
  },
  routeParams: {
    type: Object,
    default: () => ({}),
  },
  routeQuery: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  linkLabel: {
    type: String,
    default: 'Share Link',
  },
  linkDescription: {
    type: String,
    default: 'Copy this link to share with your client',
  },
  password: {
    type: String,
    default: '',
  },
  passwordDescription: {
    type: String,
    default: 'Share this password with visitors to access',
  },
  pin: {
    type: String,
    default: '',
  },
  pinLabel: {
    type: String,
    default: 'Download PIN',
  },
  pinDescription: {
    type: String,
    default: 'Share this PIN with visitors to download',
  },
  itemName: {
    type: String,
    default: '',
  },
  qrCodeDescription: {
    type: String,
    default: 'Scan this QR code to access',
  },
  downloadFileName: {
    type: String,
    default: 'qr-code.png',
  },
})

const emit = defineEmits(['update:modelValue', 'update:open'])

const theme = useThemeClasses()
const router = useRouter()

const isOpen = computed({
  get: () => {
    if (props.open !== undefined) return props.open
    return props.modelValue
  },
  set: value => {
    if (props.open !== undefined) {
      emit('update:open', value)
    } else {
      emit('update:modelValue', value)
    }
  },
})

const computedShareLink = computed(() => {
  if (props.shareLink) return props.shareLink
  if (props.routeName) {
    const route = router.resolve({
      name: props.routeName,
      params: props.routeParams,
      query: props.routeQuery,
    })
    return `${window.location.origin}${route.href}`
  }
  return ''
})

const showPassword = ref(false)
const showPin = ref(false)
const qrCodeDataUrl = ref(null)
const copiedLink = ref(false)
const copiedPassword = ref(false)
const copiedPin = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const togglePinVisibility = () => {
  showPin.value = !showPin.value
}

const generateQRCode = async () => {
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(computedShareLink.value)}`
    qrCodeDataUrl.value = qrUrl
  } catch (error) {
    toast.error('Failed to generate QR code', {
      description: 'Please try again.',
    })
  }
}

watch(
  () => isOpen.value,
  open => {
    if (open) {
      generateQRCode()
    }
  }
)

const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(computedShareLink.value)
    copiedLink.value = true
    toast.success('Link copied', {
      description: 'The share link has been copied to your clipboard.',
    })
    setTimeout(() => {
      copiedLink.value = false
    }, 2000)
  } catch (error) {
    toast.error('Failed to copy link', {
      description: 'Please try again.',
    })
  }
}

const handleCopyPassword = async () => {
  if (!props.password) return
  try {
    await navigator.clipboard.writeText(props.password)
    copiedPassword.value = true
    toast.success('Password copied', {
      description: 'Password has been copied to clipboard.',
    })
    setTimeout(() => {
      copiedPassword.value = false
    }, 2000)
  } catch (error) {
    toast.error('Failed to copy password', {
      description: 'Please try again.',
    })
  }
}

const handleCopyPin = async () => {
  if (!props.pin) return
  try {
    await navigator.clipboard.writeText(props.pin)
    copiedPin.value = true
    toast.success('PIN copied', {
      description: 'PIN has been copied to clipboard.',
    })
    setTimeout(() => {
      copiedPin.value = false
    }, 2000)
  } catch (error) {
    toast.error('Failed to copy PIN', {
      description: 'Please try again.',
    })
  }
}

const handleShareWhatsApp = () => {
  const message = encodeURIComponent(
    `${props.itemName ? `Check out ${props.itemName}: ` : ''}${computedShareLink.value}`
  )
  const whatsappUrl = `https://wa.me/?text=${message}`
  window.open(whatsappUrl, '_blank')
}

const handleShareEmail = () => {
  const subject = encodeURIComponent(props.itemName || 'Share')
  const body = encodeURIComponent(
    `${props.itemName ? `Check out ${props.itemName}:\n\n` : ''}${computedShareLink.value}${props.password ? `\n\nPassword: ${props.password}` : ''}`
  )
  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
  window.location.href = mailtoUrl
}

const handleDownloadQR = () => {
  if (!qrCodeDataUrl.value) return

  try {
    const link = document.createElement('a')
    link.href = qrCodeDataUrl.value
    link.download = props.downloadFileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('QR code downloaded', {
      description: 'The QR code has been downloaded.',
    })
  } catch (error) {
    toast.error('Failed to download QR code', {
      description: 'Please try again.',
    })
  }
}

const close = () => {
  isOpen.value = false
}
</script>
