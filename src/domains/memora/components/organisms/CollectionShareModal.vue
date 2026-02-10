<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent :class="[theme.bgCard, theme.borderSecondary]" class="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle :class="theme.textPrimary" class="text-xl font-bold">
          Share Collection
        </DialogTitle>
        <DialogDescription :class="theme.textSecondary" class="text-sm mt-1">
          Share this collection with your client via link, QR code, WhatsApp, or email.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6 mt-6">
        <!-- Share Link Section -->
        <div class="space-y-2">
          <label :class="theme.textPrimary" class="text-sm font-semibold"> Share Link </label>
          <div class="flex items-center gap-2">
            <input
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                'font-mono text-xs flex-1 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm',
              ]"
              :value="shareLink"
              readonly
            />
            <Button
              :class="[theme.borderSecondary, theme.textPrimary, 'flex-shrink-0']"
              size="sm"
              variant="outline"
              @click="handleCopyLink"
            >
              <Copy class="h-4 w-4 mr-1.5" />
              Copy
            </Button>
          </div>
          <p :class="theme.textSecondary" class="text-xs">
            Copy this link to share with your client
          </p>
        </div>

        <!-- Password Section (if exists) -->
        <div v-if="password" class="space-y-2">
          <label :class="theme.textPrimary" class="text-sm font-semibold"> Password </label>
          <div class="flex items-center gap-2">
            <input
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                'font-mono text-xs flex-1 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm',
              ]"
              :type="showPassword ? 'text' : 'password'"
              :value="password"
              readonly
            />
            <Button
              :class="[theme.borderSecondary, theme.textPrimary, 'flex-shrink-0']"
              size="sm"
              variant="outline"
              @click="togglePasswordVisibility"
            >
              <Eye v-if="!showPassword" class="h-4 w-4 mr-1.5" />
              <EyeOff v-else class="h-4 w-4 mr-1.5" />
            </Button>
            <Button
              :class="[theme.borderSecondary, theme.textPrimary, 'flex-shrink-0']"
              size="sm"
              variant="outline"
              @click="handleCopyPassword"
            >
              <Copy class="h-4 w-4 mr-1.5" />
              Copy
            </Button>
          </div>
          <p :class="theme.textSecondary" class="text-xs">
            Share this password with visitors to access this collection
          </p>
        </div>

        <!-- Download PIN Section (if exists) -->
        <div v-if="downloadPin" class="space-y-2">
          <label :class="theme.textPrimary" class="text-sm font-semibold"> Download PIN </label>
          <div class="flex items-center gap-2">
            <input
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                'font-mono text-xs flex-1 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm',
              ]"
              :type="showPin ? 'text' : 'password'"
              :value="downloadPin"
              readonly
            />
            <Button
              :class="[theme.borderSecondary, theme.textPrimary, 'flex-shrink-0']"
              size="sm"
              variant="outline"
              @click="togglePinVisibility"
            >
              <Eye v-if="!showPin" class="h-4 w-4 mr-1.5" />
              <EyeOff v-else class="h-4 w-4 mr-1.5" />
            </Button>
            <Button
              :class="[theme.borderSecondary, theme.textPrimary, 'flex-shrink-0']"
              size="sm"
              variant="outline"
              @click="handleCopyPin"
            >
              <Copy class="h-4 w-4 mr-1.5" />
              Copy
            </Button>
          </div>
          <p :class="theme.textSecondary" class="text-xs">
            Share this PIN with visitors to download from this collection
          </p>
        </div>

        <!-- QR Code Section -->
        <div class="space-y-2">
          <label :class="theme.textPrimary" class="text-sm font-semibold"> QR Code </label>
          <div
            :class="[
              theme.borderSecondary,
              theme.bgCard,
              'flex flex-col items-center gap-4 p-4 sm:p-6 rounded-xl border-2',
            ]"
          >
            <div
              v-if="qrCodeDataUrl"
              :class="theme.borderSecondary"
              class="p-3 bg-white rounded-lg shadow-sm border"
            >
              <img :src="qrCodeDataUrl" alt="QR Code" class="w-40 h-40" />
            </div>
            <div
              v-else
              class="w-40 h-40 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              <Loader2 :class="theme.textSecondary" class="h-6 w-6 animate-spin" />
            </div>
            <Button
              :class="[theme.borderSecondary, theme.textPrimary]"
              :disabled="!qrCodeDataUrl"
              size="sm"
              variant="outline"
              @click="handleDownloadQR"
            >
              <Download class="h-4 w-4 mr-1.5" />
              Download QR Code
            </Button>
            <p :class="theme.textSecondary" class="text-xs text-center max-w-xs">
              Scan this QR code to access the collection
            </p>
          </div>
        </div>

        <!-- Share Options -->
        <div class="space-y-2">
          <label :class="theme.textPrimary" class="text-sm font-semibold"> Share Via </label>
          <div class="grid grid-cols-2 gap-3">
            <!-- WhatsApp -->
            <Button
              :class="[
                theme.borderSecondary,
                theme.textPrimary,
                'hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700',
              ]"
              class="flex items-center justify-center gap-2 h-11 transition-all"
              variant="outline"
              @click="handleShareWhatsApp"
            >
              <svg
                class="h-5 w-5 text-green-600 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                />
              </svg>
              <span>WhatsApp</span>
            </Button>

            <!-- Email -->
            <Button
              :class="[
                theme.borderSecondary,
                theme.textPrimary,
                'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700',
              ]"
              class="flex items-center justify-center gap-2 h-11 transition-all"
              variant="outline"
              @click="handleShareEmail"
            >
              <Mail class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Email</span>
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter class="mt-6">
        <Button :class="[theme.textSecondary, theme.bgButtonHover]" variant="ghost" @click="close">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Copy, Download, Eye, EyeOff, Loader2, Mail } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'
import { publicCollectionUrl } from '@/shared/utils/memoraPublicUrls'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  collection: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:open'])

const theme = useThemeClasses()

const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

const shareLink = computed(() => {
  const collectionId = props.collection?.id || props.collection?.uuid
  if (!collectionId) return ''
  const domain = props.collection?.brandingDomain || props.collection?.projectId || props.collection?.project_uuid
  const path = publicCollectionUrl(domain, collectionId)
  return path ? `${window.location.origin}${path}` : ''
})

const password = computed(() => {
  if (!props.collection) return ''
  return (
    props.collection.password ||
    props.collection.settings?.privacy?.password ||
    props.collection.collectionPassword ||
    ''
  )
})

const downloadPin = computed(() => {
  if (!props.collection) return ''
  return props.collection.downloadPin || props.collection.settings?.download?.downloadPin || ''
})

const showPassword = ref(false)
const showPin = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const togglePinVisibility = () => {
  showPin.value = !showPin.value
}

const qrCodeDataUrl = ref(null)

// Generate QR code using a simple API (same as SelectionShareModal)
const generateQRCode = async () => {
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareLink.value)}`
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
    await navigator.clipboard.writeText(shareLink.value)
    toast.success('Link copied', {
      description: 'Collection link has been copied to clipboard.',
    })
  } catch (error) {
    toast.error('Failed to copy link', {
      description: 'Please try again.',
    })
  }
}

const handleDownloadQR = () => {
  if (!qrCodeDataUrl.value) return

  try {
    const link = document.createElement('a')
    link.href = qrCodeDataUrl.value
    link.download = `collection-${props.collection?.id || 'qr'}-qr-code.png`
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

const handleShareWhatsApp = () => {
  const message = encodeURIComponent(
    `Check out this collection: ${props.collection?.name || props.collection?.title || 'Collection'}\n${shareLink.value}`
  )
  const whatsappUrl = `https://wa.me/?text=${message}`
  window.open(whatsappUrl, '_blank')
}

const handleShareEmail = () => {
  const subject = encodeURIComponent(
    `Collection: ${props.collection?.name || props.collection?.title || 'Collection'}`
  )
  const body = encodeURIComponent(`Check out this collection:\n\n${shareLink.value}`)
  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
  window.location.href = mailtoUrl
}

const handleCopyPassword = async () => {
  if (!password.value) return
  try {
    await navigator.clipboard.writeText(password.value)
    toast.success('Password copied', {
      description: 'Password has been copied to clipboard.',
    })
  } catch (error) {
    toast.error('Failed to copy password', {
      description: 'Please try again.',
    })
  }
}

const handleCopyPin = async () => {
  if (!downloadPin.value) return
  try {
    await navigator.clipboard.writeText(downloadPin.value)
    toast.success('PIN copied', {
      description: 'Download PIN has been copied to clipboard.',
    })
  } catch (error) {
    toast.error('Failed to copy PIN', {
      description: 'Please try again.',
    })
  }
}

const close = () => {
  isOpen.value = false
}
</script>
