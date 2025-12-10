<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <section class="text-center space-y-4 py-12">
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight">
        Welcome to Mazeloot
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        A modern, responsive web application built with Vue.js 3, Tailwind CSS, and Pinia
      </p>
      <div class="flex justify-center gap-4 pt-4">
        <Button size="lg">Get Started</Button>
        <Button variant="outline" size="lg">Learn More</Button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Fast & Modern</CardTitle>
          <CardDescription>
            Built with Vue 3 Composition API for optimal performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Leveraging the latest Vue.js features and best practices for a smooth user experience.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Responsive Design</CardTitle>
          <CardDescription>
            Beautiful UI that works on all devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Tailwind CSS ensures your application looks great on mobile, tablet, and desktop.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>State Management</CardTitle>
          <CardDescription>
            Pinia for efficient state management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Manage your application state with Pinia, the official Vue state management solution.
          </p>
        </CardContent>
      </Card>
    </section>

    <!-- Counter Example -->
    <section class="py-8">
      <Card class="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Pinia Store Example</CardTitle>
          <CardDescription>
            Interactive counter using Pinia state management
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="text-center">
            <p class="text-4xl font-bold mb-2">{{ counter.count }}</p>
            <p class="text-sm text-muted-foreground">
              Double: {{ counter.doubleCount }}
            </p>
          </div>
          <div class="flex gap-2 justify-center">
            <Button @click="counter.decrement" variant="outline">-</Button>
            <Button @click="counter.reset" variant="secondary">Reset</Button>
            <Button @click="counter.increment">+</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import Button from '@/components/shadcn/Button.vue'
import Card from '@/components/shadcn/Card.vue'
import CardHeader from '@/components/shadcn/CardHeader.vue'
import CardTitle from '@/components/shadcn/CardTitle.vue'
import CardDescription from '@/components/shadcn/CardDescription.vue'
import CardContent from '@/components/shadcn/CardContent.vue'

const counter = useCounterStore()
</script>

