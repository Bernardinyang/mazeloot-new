<template>
  <nav class="border-b bg-card">
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center space-x-8">
          <RouterLink to="/" class="text-xl font-bold text-foreground hover:text-primary transition-colors">
            Mazeloot
          </RouterLink>
          <div class="hidden md:flex space-x-4">
            <RouterLink
              to="/"
              class="text-sm font-medium transition-colors"
              :class="route.name === 'home' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/about"
              class="text-sm font-medium transition-colors"
              :class="route.name === 'about' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
            >
              About
            </RouterLink>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <RouterLink to="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </RouterLink>
          <RouterLink to="/register">
            <Button size="sm">
              Sign Up
            </Button>
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import Button from '@/components/shadcn/Button.vue'

const route = useRoute()
</script>

