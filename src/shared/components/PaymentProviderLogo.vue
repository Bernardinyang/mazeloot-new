<template>
  <img
    v-if="logoSrc"
    :src="logoSrc"
    :alt="`${name} logo`"
    class="h-8 w-auto object-contain"
  />
  <CreditCard
    v-else
    class="h-5 w-5 shrink-0 text-muted-foreground"
    aria-hidden
  />
</template>

<script setup>
import { computed } from 'vue'
import { CreditCard } from '@/shared/utils/lucideAnimated'
import stripeLogo from '@/shared/assets/images/payment/stripe.jpeg'
import paypalLogo from '@/shared/assets/images/payment/paypal.svg'
import paystackLogo from '@/shared/assets/images/payment/paystack.svg'
import flutterwaveLogo from '@/shared/assets/images/payment/flutterwave.svg'

const LOGO_URLS = {
  stripe: stripeLogo,
  paypal: paypalLogo,
  paystack: paystackLogo,
  flutterwave: flutterwaveLogo,
}

const props = defineProps({
  providerId: { type: String, required: true },
  name: { type: String, default: '' },
})

const logoSrc = computed(() => LOGO_URLS[props.providerId?.toLowerCase()] ?? null)
</script>
