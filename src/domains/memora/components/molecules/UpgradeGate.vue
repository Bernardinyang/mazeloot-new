<template>
  <div class="contents">
    <div v-if="hasAccess" class="contents">
      <slot />
    </div>
    <div
      v-else
      class="contents"
      @click.capture.prevent.stop="handleClick"
    >
      <slot />
    </div>
    <Dialog
      :open="showModal"
      @update:open="showModal = $event"
    >
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Upgrade Required</DialogTitle>
        <DialogDescription>
          Upgrade to {{ tierLabel }} to use {{ featureLabel }}. Get access to more features and higher limits.
        </DialogDescription>
      </DialogHeader>
      <div class="flex gap-3 pt-4">
        <Button
          class="flex-1"
          @click="goToPricing"
        >
          Upgrade to {{ tierLabel }}
        </Button>
        <Button
          variant="outline"
          @click="showModal = false"
        >
          Cancel
        </Button>
      </div>
    </DialogContent>
  </Dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import { Button } from '@/shared/components/shadcn/button'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'

const props = defineProps({
  feature: {
    type: String,
    required: true,
  },
  recommendedTier: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['blocked'])

const { hasFeature, recommendedTierForFeature, tierDisplayName, featureLabel: getFeatureLabel } = useMemoraFeatures()
const router = useRouter()
const showModal = ref(false)

const hasAccess = computed(() => hasFeature(props.feature))

const tierLabel = computed(() => {
  const tier = props.recommendedTier ?? recommendedTierForFeature(props.feature)
  return tierDisplayName(tier ?? 'pro')
})

const featureLabel = computed(() => getFeatureLabel(props.feature))

function handleClick(e) {
  e.preventDefault()
  e.stopPropagation()
  showModal.value = true
  emit('blocked')
}

function goToPricing() {
  showModal.value = false
  router.push({
    name: 'memora-pricing',
    query: { upgrade: props.feature },
  })
}
</script>
