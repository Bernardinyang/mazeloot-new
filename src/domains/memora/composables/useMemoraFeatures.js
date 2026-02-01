/**
 * Memora feature gating based on subscription plan
 */
import { computed } from 'vue'
import { useUserStore } from '@/shared/stores/user'
import { useRouter } from 'vue-router'

const RECOMMENDED_TIER_FOR_FEATURE = {
  proofing: 'pro',
  raw_files: 'studio',
}

const FEATURE_LABELS = {
  proofing: 'Proofing',
  raw_files: 'Raw Files',
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

  const recommendedTierForFeature = (feature) => RECOMMENDED_TIER_FOR_FEATURE[feature] ?? null
  const featureLabel = (feature) => FEATURE_LABELS[feature] ?? feature

  const showUpgradePrompt = (feature) => {
    const tier = recommendedTierForFeature(feature)
    const label = featureLabel(feature)
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
    recommendedTierForFeature,
    featureLabel,
    showUpgradePrompt,
  }
}
