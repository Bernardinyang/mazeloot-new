<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="text-center space-y-4">
      <h1 class="text-4xl md:text-5xl font-bold">About</h1>
      <p class="text-xl text-muted-foreground">Learn more about this modern web application</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Technology Stack</CardTitle>
        <CardDescription> Built with modern, industry-standard tools </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <h3 class="font-semibold">Vue.js 3</h3>
            <p class="text-sm text-muted-foreground">
              Progressive JavaScript framework using the Composition API for better code
              organization and reusability.
            </p>
          </div>
          <div class="space-y-2">
            <h3 class="font-semibold">Tailwind CSS 3</h3>
            <p class="text-sm text-muted-foreground">
              Utility-first CSS framework for rapid UI development with a modern design system.
            </p>
          </div>
          <div class="space-y-2">
            <h3 class="font-semibold">Pinia</h3>
            <p class="text-sm text-muted-foreground">
              The official state management library for Vue, providing a simple and intuitive API.
            </p>
          </div>
          <div class="space-y-2">
            <h3 class="font-semibold">Shadcn Components</h3>
            <p class="text-sm text-muted-foreground">
              Beautiful, accessible component library built with Radix Vue and Tailwind CSS.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Features</CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="space-y-2 list-disc list-inside text-muted-foreground">
          <li>TypeScript support for type safety</li>
          <li>Vue Router for client-side routing</li>
          <li>Responsive design that works on all devices</li>
          <li>Modern component architecture</li>
          <li>Fast development with Vite</li>
          <li>Accessible UI components</li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/shadcn/Card.vue'
import CardHeader from '@/components/shadcn/CardHeader.vue'
import CardTitle from '@/components/shadcn/CardTitle.vue'
import CardDescription from '@/components/shadcn/CardDescription.vue'
import CardContent from '@/components/shadcn/CardContent.vue'
</script>
