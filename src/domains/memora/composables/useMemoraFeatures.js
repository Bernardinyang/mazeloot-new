/**
 * Memora feature gating based on subscription plan
 */
import { computed } from 'vue'
import { useUserStore } from '@/shared/stores/user'
import { useRouter } from 'vue-router'

const RECOMMENDED_TIER_FOR_FEATURE = {
  proofing: 'pro',
  raw_files: 'studio',
  homepage_enabled: 'pro',
  branding_editable: 'pro',
  social_links_enabled: 'pro',
  collection_display_enabled: 'pro',
  photo_quality_enabled: 'pro',
  legal_documents_enabled: 'pro',
  preset_limit: 'pro',
}

const FEATURE_LABELS = {
  proofing: 'Proofing',
  raw_files: 'Raw Files',
}

/** Display name for tier slug (alerts, CTAs). Keep in sync with backend tier names. */
const TIER_DISPLAY_NAMES = {
  starter: 'Starter',
  pro: 'Pro',
  studio: 'Studio',
  business: 'Business',
  byo: 'Build Your Own',
}

export function useMemoraFeatures() {
  const userStore = useUserStore()
  const router = useRouter()

  const features = computed(() => userStore.user?.memora_features ?? [])

  const hasFeature = (feature) => {
    const f = features.value
    return Array.isArray(f) && f.includes(feature)
  }

  const canAccessSelection = computed(() => hasFeature('selection'))
  const canAccessProofing = computed(() => hasFeature('proofing'))
  const canAccessRawFiles = computed(() => hasFeature('raw_files'))
  const canAccessCollection = computed(() => hasFeature('collection'))

  const capabilities = computed(() => userStore.user?.memora_capabilities ?? {})
  const setLimitPerPhase = computed(() => userStore.user?.set_limit_per_phase ?? null)
  const watermarkLimit = computed(() => userStore.user?.watermark_limit ?? null)
  const presetLimit = computed(() => userStore.user?.preset_limit ?? null)
  const canAddPreset = computed(() => (presetLimit.value ?? 0) > 0)
  const canAddWatermark = (currentCount) => {
    const limit = watermarkLimit.value
    return limit === null || limit === undefined || (typeof currentCount === 'number' && currentCount < limit)
  }
  const homepageEnabled = computed(() => !!capabilities.value.homepage_enabled)
  const canEditBranding = computed(() => !!capabilities.value.branding_editable)
  const socialLinksEnabled = computed(() => !!capabilities.value.social_links_enabled)
  const collectionDisplayEnabled = computed(() => !!capabilities.value.collection_display_enabled)
  const photoQualityEnabled = computed(() => !!capabilities.value.photo_quality_enabled)
  const legalDocumentsEnabled = computed(() => !!capabilities.value.legal_documents_enabled)
  const support24_7 = computed(() => !!capabilities.value.support_24_7)

  const recommendedTierForFeature = (feature) => RECOMMENDED_TIER_FOR_FEATURE[feature] ?? null
  const featureLabel = (feature) => FEATURE_LABELS[feature] ?? feature
  const tierDisplayName = (tierSlug) => TIER_DISPLAY_NAMES[tierSlug] ?? (tierSlug ? tierSlug.charAt(0).toUpperCase() + tierSlug.slice(1) : '')
  const recommendedTierDisplayName = (feature) => tierDisplayName(recommendedTierForFeature(feature) ?? 'pro')

  const showUpgradePrompt = (feature) => {
    const tier = recommendedTierForFeature(feature)
    if (tier) {
      router.push({
        name: 'memora-pricing',
        query: { upgrade: feature },
      })
    }
  }

  return {
    features,
    hasFeature,
    canAccessSelection,
    canAccessProofing,
    canAccessRawFiles,
    canAccessCollection,
    capabilities,
    setLimitPerPhase,
    watermarkLimit,
    presetLimit,
    canAddPreset,
    canAddWatermark,
    homepageEnabled,
    canEditBranding,
    socialLinksEnabled,
    collectionDisplayEnabled,
    photoQualityEnabled,
    legalDocumentsEnabled,
    support24_7,
    recommendedTierForFeature,
    recommendedTierDisplayName,
    featureLabel,
    tierDisplayName,
    showUpgradePrompt,
  }
}
