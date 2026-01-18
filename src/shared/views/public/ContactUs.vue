<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <PublicNav />
    
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Contact Form -->
        <Card class="p-8">
          <CardHeader>
            <CardTitle class="text-2xl mb-2">Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you</CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <Label for="name">Name</Label>
                <Input id="name" v-model="form.name" required placeholder="Your name" />
              </div>
              <div>
                <Label for="email">Email</Label>
                <Input id="email" v-model="form.email" type="email" required placeholder="your@email.com" />
              </div>
              <div>
                <Label for="subject">Subject</Label>
                <Input id="subject" v-model="form.subject" required placeholder="What's this about?" />
              </div>
              <div>
                <Label for="message">Message</Label>
                <Textarea
                  id="message"
                  v-model="form.message"
                  placeholder="Tell us more..."
                  rows="6"
                  class="min-h-[120px]"
                />
              </div>
              <Button type="submit" class="w-full" :disabled="isSubmitting">
                <Loader2 v-if="isSubmitting" class="h-4 w-4 mr-2 animate-spin" />
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </Button>
            </form>
          </CardContent>
        </Card>

        <!-- Contact Info -->
        <div class="space-y-8">
          <Card class="p-8">
            <CardHeader>
              <CardTitle class="text-2xl mb-4">Get in touch</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Mail class="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <div class="font-semibold mb-1">Email</div>
                  <a href="mailto:support@mazeloot.com" class="text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100">
                    support@mazeloot.com
                  </a>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Phone class="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <div class="font-semibold mb-1">Phone</div>
                  <a href="tel:+1234567890" class="text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <MapPin class="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <div class="font-semibold mb-1">Address</div>
                  <div class="text-muted-foreground">
                    123 Photography Street<br />
                    San Francisco, CA 94102<br />
                    United States
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="p-8">
            <CardHeader>
              <CardTitle class="text-2xl mb-4">Office Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Monday - Friday</span>
                  <span class="font-medium">9:00 AM - 6:00 PM PST</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Saturday</span>
                  <span class="font-medium">10:00 AM - 4:00 PM PST</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Sunday</span>
                  <span class="font-medium">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
import { useRouter } from 'vue-router'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import { Textarea } from '@/shared/components/shadcn/textarea'
import Label from '@/shared/components/shadcn/Label.vue'
import Card from '@/shared/components/shadcn/Card.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import { Mail, Phone, MapPin, Loader2 } from '@/shared/utils/lucideAnimated'
import { toast } from '@/shared/utils/toast'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Message sent successfully! We will get back to you soon.')
    form.value = { name: '', email: '', subject: '', message: '' }
  } catch (error) {
    toast.error('Failed to send message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
