<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <PublicNav />
    
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8 sm:mb-12">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">Join the Waitlist</h1>
          <p class="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 px-4">
            Be the first to know when we officially launch. Get early access and exclusive updates.
          </p>
        </div>

        <Card class="p-6 sm:p-8 md:p-12">
          <CardHeader class="text-center mb-6 sm:mb-8">
            <CardTitle class="text-2xl sm:text-3xl mb-2">Get Notified</CardTitle>
            <CardDescription class="text-sm sm:text-base">
              Enter your details below and we'll notify you as soon as we're ready to launch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <Label for="name">Full Name</Label>
                <Input
                  id="name"
                  v-model="form.name"
                  required
                  placeholder="John Doe"
                  :disabled="isSubmitting"
                  class="mt-2"
                />
              </div>
              <div>
                <Label for="email">Email Address</Label>
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  :disabled="isSubmitting"
                  class="mt-2"
                />
              </div>
              <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
              </div>
              <div v-if="success" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p class="text-sm text-green-600 dark:text-green-400">{{ success }}</p>
              </div>
              <Button
                type="submit"
                class="w-full"
                size="lg"
                :disabled="isSubmitting || !form.name || !form.email"
              >
                <Loader2 v-if="isSubmitting" class="h-4 w-4 mr-2 animate-spin" />
                {{ isSubmitting ? 'Joining Waitlist...' : 'Join Waitlist' }}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div class="mt-12 text-center">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div class="p-6">
              <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell class="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 class="font-semibold mb-2">Early Access</h3>
              <p class="text-sm text-muted-foreground">Be among the first to try our platform</p>
            </div>
            <div class="p-6">
              <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift class="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 class="font-semibold mb-2">Exclusive Benefits</h3>
              <p class="text-sm text-muted-foreground">Special offers and features for early adopters</p>
            </div>
            <div class="p-6">
              <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail class="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 class="font-semibold mb-2">Stay Updated</h3>
              <p class="text-sm text-muted-foreground">Get notified about launch and updates</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12 mt-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
        © {{ new Date().getFullYear() }} Mazeloot Inc. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import Label from '@/shared/components/shadcn/Label.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import { Bell, Gift, Mail, Loader2 } from '@/shared/utils/lucideAnimated'
import { apiClient } from '@/shared/api/client'
import { toast } from '@/shared/utils/toast'

const form = ref({
  name: '',
  email: '',
})

const isSubmitting = ref(false)
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
  if (!form.value.name || !form.value.email) {
    return
  }

  isSubmitting.value = true
  error.value = ''
  success.value = ''

  try {
    await apiClient.post(
      '/v1/public/waitlist',
      {
        name: form.value.name,
        email: form.value.email,
      },
      { skipAuth: true }
    )
    
    success.value = 'Thanks for joining! We\'ll notify you when we launch.'
    toast.success('Successfully joined the waitlist!')
    form.value = { name: '', email: '' }
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to join waitlist. Please try again.'
    error.value = errorMessage
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>
