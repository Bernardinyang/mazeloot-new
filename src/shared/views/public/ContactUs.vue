<template>
  <div class="min-h-screen bg-gradient-to-br dark:from-[#0f0f23] dark:via-primary-950/50 dark:to-[#0f0f23] light:from-gray-50 light:via-white light:to-gray-100 dark:text-gray-100 light:text-gray-900">
    <PublicNav />
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-primary-500/15 blur-[100px]" aria-hidden="true" />
      <div class="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-accent-500/10 blur-[80px]" aria-hidden="true" />
      
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-600/50 dark:text-pink-300 light:text-pink-600 text-sm font-medium mb-6 backdrop-blur-sm">
            <Mail class="h-4 w-4" />
            <span>Get in Touch</span>
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 dark:bg-gradient-to-r dark:from-white dark:via-indigo-200 dark:to-violet-200 light:bg-gradient-to-r light:from-gray-900 light:via-indigo-600 light:to-violet-600 bg-clip-text text-transparent">
            We're here to help
          </h1>
          <p class="text-lg sm:text-xl dark:text-gray-300 light:text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Questions about galleries, proofing, or your workflow? Want to say hi? Drop us a line—we're here to help.
          </p>
        </div>
      </div>
    </section>

    <!-- Form Section -->
    <section class="relative pb-20">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto">
          <div class="relative rounded-2xl dark:bg-white/5 light:bg-white dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-8 sm:p-10 dark:shadow-2xl light:shadow-xl light:ring-1 light:ring-gray-200/50">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/5 via-transparent to-rose-500/5" />
            <div class="relative">
              <form @submit.prevent="submitContact" class="space-y-6" :aria-busy="contactSubmitting">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <Label for="contact-first-name" class="dark:text-gray-200 light:text-gray-700 font-medium">First Name</Label>
                    <Input
                      id="contact-first-name"
                      v-model="contactFirstName"
                      type="text"
                      name="first_name"
                      autocomplete="given-name"
                      required
                      placeholder="John"
                      :disabled="contactSubmitting"
                      class="mt-1 dark:bg-white/5 light:bg-white dark:border-white/20 light:border-gray-300 dark:text-white light:text-gray-900 placeholder:text-gray-500 focus:border-pink-400 focus:ring-pink-400/50 h-12"
                    />
                  </div>
                  <div class="space-y-2">
                    <Label for="contact-last-name" class="dark:text-gray-200 light:text-gray-700 font-medium">Last Name</Label>
                    <Input
                      id="contact-last-name"
                      v-model="contactLastName"
                      type="text"
                      name="last_name"
                      autocomplete="family-name"
                      required
                      placeholder="Doe"
                      :disabled="contactSubmitting"
                      class="mt-1 dark:bg-white/5 light:bg-white dark:border-white/20 light:border-gray-300 dark:text-white light:text-gray-900 placeholder:text-gray-500 focus:border-pink-400 focus:ring-pink-400/50 h-12"
                    />
                  </div>
                </div>
                
                <div class="space-y-2">
                  <Label for="contact-company" class="dark:text-gray-200 light:text-gray-700 font-medium">
                    Studio or Business Name
                    <span class="font-normal dark:text-gray-400 light:text-gray-600 ml-1">(optional)</span>
                  </Label>
                  <Input
                    id="contact-company"
                    v-model="contactCompany"
                    type="text"
                    name="company"
                    autocomplete="organization"
                    placeholder="e.g. Jane Doe Photography"
                    :disabled="contactSubmitting"
                    class="mt-1 dark:bg-white/5 light:bg-white dark:border-white/20 light:border-gray-300 dark:text-white light:text-gray-900 placeholder:text-gray-500 focus:border-indigo-400 focus:ring-indigo-400/50 h-12"
                  />
                </div>
                
                <div class="space-y-2">
                  <Label for="contact-email" class="dark:text-gray-200 light:text-gray-700 font-medium">Email Address</Label>
                  <Input
                    id="contact-email"
                    v-model="contactEmail"
                    type="email"
                    name="email"
                    autocomplete="email"
                    required
                    placeholder="john@example.com"
                    :disabled="contactSubmitting"
                    class="mt-1 dark:bg-white/5 light:bg-white dark:border-white/20 light:border-gray-300 dark:text-white light:text-gray-900 placeholder:text-gray-500 focus:border-indigo-400 focus:ring-indigo-400/50 h-12"
                  />
                </div>
                
                <div class="space-y-2">
                  <Label for="contact-phone" class="dark:text-gray-200 light:text-gray-700 font-medium">
                    Phone Number
                    <span class="font-normal dark:text-gray-400 light:text-gray-600 ml-1">(optional)</span>
                  </Label>
                  <div class="flex rounded-lg dark:bg-white/5 light:bg-white border dark:border-white/20 light:border-gray-300 has-[input:focus-within]:border-indigo-400 has-[input:focus-within]:ring-2 has-[input:focus-within]:ring-indigo-400/50 transition-colors">
                    <div class="relative shrink-0">
                      <select
                        id="contact-country"
                        v-model="contactCountry"
                        name="country"
                        autocomplete="tel-country-code"
                        aria-label="Country / code"
                        :disabled="contactSubmitting"
                        class="w-32 shrink-0 appearance-none rounded-l-lg border-r dark:border-white/20 light:border-gray-300 dark:bg-white/5 light:bg-white py-3 pl-3 pr-8 text-sm dark:text-gray-300 light:text-gray-600 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option v-for="c in countryCodes" :key="c.value" :value="c.value">{{ c.label }} {{ c.code }}</option>
                      </select>
                      <ChevronDown class="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 dark:text-gray-400 light:text-gray-600" />
                    </div>
                    <Input
                      id="contact-phone"
                      v-model="contactPhone"
                      type="tel"
                      inputmode="tel"
                      name="phone-number"
                      placeholder="123 456 7890"
                      :disabled="contactSubmitting"
                      class="min-w-0 grow rounded-r-lg border-0 bg-transparent focus:ring-0 focus-visible:ring-0"
                    />
                  </div>
                </div>
                
                <div class="space-y-2">
                  <Label for="contact-message" class="dark:text-gray-200 light:text-gray-700 font-medium">Message</Label>
                  <Textarea
                    id="contact-message"
                    v-model="contactMessage"
                    name="message"
                    rows="5"
                    :disabled="contactSubmitting"
                    placeholder="Tell us about your workflow, what you're looking for, or just say hi…"
                    class="mt-1 dark:bg-white/5 light:bg-white dark:border-white/20 light:border-gray-300 dark:text-white light:text-gray-900 placeholder:text-gray-500 focus:border-pink-400 focus:ring-pink-400/50 resize-y min-h-[120px]"
                  />
                </div>
                
                <div class="flex items-start gap-3 pt-2">
                  <Checkbox
                    id="contact-agree"
                    v-model="contactAgree"
                    name="agree-to-policies"
                    :disabled="contactSubmitting"
                    class="mt-0.5"
                  />
                  <Label for="contact-agree" class="cursor-pointer text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">
                    By selecting this, you agree to our
                    <RouterLink :to="{ name: 'privacy' }" class="whitespace-nowrap font-semibold dark:text-pink-400 light:text-pink-600 dark:hover:text-pink-300 light:hover:text-pink-700 transition-colors">privacy policy</RouterLink>.
                  </Label>
                </div>
                
                <Transition
                  enter-active-class="transition duration-300 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <div v-if="contactError" class="p-4 rounded-lg bg-red-500/10 border dark:border-red-500/20 light:border-red-600/50 backdrop-blur-sm">
                    <p class="text-sm dark:text-red-300 light:text-red-600 flex items-center gap-2">
                      <span class="size-1.5 rounded-full dark:bg-red-400 light:bg-red-600" />
                      {{ contactError }}
                    </p>
                  </div>
                </Transition>
                
                <Transition
                  enter-active-class="transition duration-300 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <div v-if="contactSuccess" class="p-4 rounded-lg bg-green-500/10 border dark:border-green-500/20 light:border-green-600/50 backdrop-blur-sm">
                    <p class="text-sm dark:text-green-300 light:text-green-600 flex items-center gap-2">
                      <span class="size-1.5 rounded-full dark:bg-green-400 light:bg-green-600" />
                      {{ contactSuccess }}
                    </p>
                  </div>
                </Transition>
                
                <Button
                  type="submit"
                  class="w-full h-12 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-400 hover:to-accent-400 hover:shadow-primary-500/40 hover:-translate-y-0.5 border-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  :disabled="!contactAgree || contactSubmitting"
                >
                  <Loader2 v-if="contactSubmitting" class="size-4 shrink-0 animate-spin mr-2" aria-hidden="true" />
                  {{ contactSubmitting ? 'Sending…' : 'Send message' }}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <footer class="border-t dark:border-white/10 light:border-gray-200 bg-transparent py-12 px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p class="dark:text-gray-400 light:text-gray-600">© {{ new Date().getFullYear() }} Mazeloot Inc. All rights reserved.</p>
          <nav class="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Legal">
            <RouterLink :to="{ name: 'privacy' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900">Privacy Policy</RouterLink>
            <span class="dark:text-gray-600 light:text-gray-400" aria-hidden="true">•</span>
            <RouterLink :to="{ name: 'terms' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900">Terms of Service</RouterLink>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from '@/shared/utils/toast'
import { countryCodes } from '@/shared/constants/countryCodes'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Loader2, Mail, ChevronDown } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import { Textarea } from '@/shared/components/shadcn/textarea'
import Checkbox from '@/shared/components/shadcn/checkbox/Checkbox.vue'
import Label from '@/shared/components/shadcn/Label.vue'
import { apiClient } from '@/shared/api/client'
import { useSeoMeta } from '@/shared/composables/useSeoMeta'
import { trackPageView } from '@/shared/composables/useAnalytics'

const BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}`
  : 'https://mazeloot.com'

const route = useRoute()
const contactFirstName = ref('')
const contactLastName = ref('')
const contactCompany = ref('')
const contactEmail = ref('')
const contactCountry = ref('US')
const contactPhone = ref('')
const contactMessage = ref('')
const contactAgree = ref(false)
const contactSubmitting = ref(false)
const contactError = ref('')
const contactSuccess = ref('')

// SEO Meta Tags
useSeoMeta({
  title: 'Contact Us - Get in Touch | Mazeloot',
  description: 'Questions about galleries, proofing, or your workflow? Want to say hi? Drop us a line—we\'re here to help.',
  image: `${BASE_URL}/og-image.png`,
  url: `${BASE_URL}/contact`,
})

onMounted(() => {
  trackPageView('/contact', 'Contact')
  
  const q = route.query
  if (q.email) contactEmail.value = q.email
  if (q.name) {
    const parts = String(q.name).trim().split(/\s+/)
    if (parts.length >= 1) contactFirstName.value = parts[0]
    if (parts.length >= 2) contactLastName.value = parts.slice(1).join(' ')
  }
})

function getContactErrorMessage(err) {
  const errors = err?.errors ?? err?.response?.data?.errors
  if (errors && typeof errors === 'object') {
    const first = Object.values(errors).flat().find(Boolean)
    if (first) return first
  }
  return err?.message || 'Failed to send message. Please try again.'
}

async function submitContact() {
  if (!contactAgree.value) return
  contactSubmitting.value = true
  contactError.value = ''
  contactSuccess.value = ''
  
  try {
    await apiClient.post(
      '/v1/contact',
      {
        first_name: contactFirstName.value.trim(),
        last_name: contactLastName.value.trim(),
        company: contactCompany.value.trim() || undefined,
        email: contactEmail.value.trim(),
        country: contactCountry.value || undefined,
        phone: (() => {
          const raw = contactPhone.value.trim()
          if (!raw) return undefined
          const c = countryCodes.find((x) => x.value === contactCountry.value)
          const code = c?.code ?? ''
          return code ? `${code} ${raw}` : raw
        })(),
        message: contactMessage.value.trim() || undefined,
      },
      { skipAuth: true }
    )
    contactSuccess.value = 'Message sent. We\'ll get back to you soon.'
    toast.success('Message sent. We\'ll get back to you soon.')
    contactFirstName.value = ''
    contactLastName.value = ''
    contactCompany.value = ''
    contactEmail.value = ''
    contactCountry.value = 'US'
    contactPhone.value = ''
    contactMessage.value = ''
    contactAgree.value = false
    
    setTimeout(() => {
      contactSuccess.value = ''
    }, 5000)
  } catch (err) {
    const errorMsg = getContactErrorMessage(err)
    contactError.value = errorMsg
    toast.error(errorMsg)
    
    setTimeout(() => {
      contactError.value = ''
    }, 5000)
  } finally {
    contactSubmitting.value = false
  }
}
</script>
