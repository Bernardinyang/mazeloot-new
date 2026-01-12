import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/shared/stores/user'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'

const GUEST_TOKEN_KEY_PREFIX = 'guest_token_'
const EMAIL_KEY_PREFIX = 'email_'
const CLIENT_TOKEN_KEY_PREFIX = 'client_token_'
const CLIENT_VERIFICATION_KEY_PREFIX = 'client_verification_'
const USER_MODE_KEY_PREFIX = 'user_mode_'

export function usePublicAccess(resourceType, resourceId) {
  const route = useRoute()
  const userStore = useUserStore()

  const showEmailModal = ref(false)
  const showPasswordModal = ref(false)
  const showClientEmailModal = ref(false)
  const showClientPasswordModal = ref(false)
  const showGuestClientModal = ref(false)

  const emailInput = ref('')
  const passwordInput = ref('')
  const clientEmailInput = ref('')
  const clientPasswordInput = ref('')
  const userMode = ref(null)

  const isSubmittingEmail = ref(false)
  const isVerifyingPassword = ref(false)
  const isSubmittingClientEmail = ref(false)
  const isVerifyingClientPassword = ref(false)

  const emailError = ref('')
  const passwordError = ref('')
  const clientEmailError = ref('')
  const clientPasswordError = ref('')

  const guestToken = ref(null)
  const clientToken = ref(null)
  const userEmail = ref('')
  const clientEmail = ref('')
  const isPasswordVerified = ref(false)
  const isClientVerified = ref(false)

  const isAuthenticatedOwner = computed(() => userStore.isAuthenticated)
  const isPreviewMode = computed(() => route.query.preview === 'true' && isAuthenticatedOwner.value)

  const getStoredGuestToken = (id) => {
    const key = `${GUEST_TOKEN_KEY_PREFIX}${id}`
    const stored = localStorage.getItem(key)
    if (!stored) return null

    try {
      const { token, expiresAt } = JSON.parse(stored)
      if (Date.now() > expiresAt) {
        localStorage.removeItem(key)
        return null
      }
      return token
    } catch {
      return null
    }
  }

  const storeGuestToken = (id, token, ttlMinutes = 30) => {
    const key = `${GUEST_TOKEN_KEY_PREFIX}${id}`
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000
    localStorage.setItem(key, JSON.stringify({ token, expiresAt }))
    guestToken.value = token
  }

  const getStoredEmail = (id) => {
    const key = `${EMAIL_KEY_PREFIX}${id}`
    return localStorage.getItem(key) || null
  }

  const storeEmail = (id, email) => {
    const key = `${EMAIL_KEY_PREFIX}${id}`
    localStorage.setItem(key, email)
    userEmail.value = email
  }

  const getStoredClientToken = (id) => {
    const key = `${CLIENT_TOKEN_KEY_PREFIX}${id}`
    const stored = localStorage.getItem(key)
    if (!stored) return null

    try {
      const { token, expiresAt } = JSON.parse(stored)
      if (Date.now() > expiresAt) {
        localStorage.removeItem(key)
        return null
      }
      return token
    } catch {
      return null
    }
  }

  const storeClientToken = (id, token, ttlMinutes = 30) => {
    const key = `${CLIENT_TOKEN_KEY_PREFIX}${id}`
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000
    localStorage.setItem(key, JSON.stringify({ token, expiresAt }))
    clientToken.value = token
  }

  const getStoredClientVerification = (id) => {
    const key = `${CLIENT_VERIFICATION_KEY_PREFIX}${id}`
    return localStorage.getItem(key) === 'true'
  }

  const storeClientVerification = (id, verified) => {
    const key = `${CLIENT_VERIFICATION_KEY_PREFIX}${id}`
    localStorage.setItem(key, verified ? 'true' : 'false')
    isClientVerified.value = verified
  }

  const getStoredUserMode = (id) => {
    const key = `${USER_MODE_KEY_PREFIX}${id}`
    return localStorage.getItem(key) || null
  }

  const storeUserMode = (id, mode) => {
    const key = `${USER_MODE_KEY_PREFIX}${id}`
    localStorage.setItem(key, mode)
    userMode.value = mode
  }

  const getAuthHeaders = () => {
    const headers = {}
    if (guestToken.value) {
      headers['Authorization'] = `Bearer ${guestToken.value}`
    }
    if (clientToken.value) {
      headers['X-Guest-Token'] = clientToken.value
      headers['Authorization'] = `Bearer ${clientToken.value}`
    }
    if (clientEmail.value) {
      headers['X-Collection-Email'] = clientEmail.value
    } else if (userEmail.value) {
      headers['X-Collection-Email'] = userEmail.value
    }
    return headers
  }

  const initializeFromStorage = (id) => {
    guestToken.value = getStoredGuestToken(id)
    clientToken.value = getStoredClientToken(id)
    userEmail.value = getStoredEmail(id) || ''
    clientEmail.value = ''
    userMode.value = getStoredUserMode(id)
    isClientVerified.value = getStoredClientVerification(id)
  }

  return {
    showEmailModal,
    showPasswordModal,
    showClientEmailModal,
    showClientPasswordModal,
    showGuestClientModal,
    emailInput,
    passwordInput,
    clientEmailInput,
    clientPasswordInput,
    userMode,
    isSubmittingEmail,
    isVerifyingPassword,
    isSubmittingClientEmail,
    isVerifyingClientPassword,
    emailError,
    passwordError,
    clientEmailError,
    clientPasswordError,
    guestToken,
    clientToken,
    userEmail,
    clientEmail,
    isPasswordVerified,
    isClientVerified,
    isAuthenticatedOwner,
    isPreviewMode,
    getStoredGuestToken,
    storeGuestToken,
    getStoredEmail,
    storeEmail,
    getStoredClientToken,
    storeClientToken,
    getStoredClientVerification,
    storeClientVerification,
    getStoredUserMode,
    storeUserMode,
    getAuthHeaders,
    initializeFromStorage,
  }
}
