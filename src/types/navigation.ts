import type { LucideIcon } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface NavSubItem {
  title: string
  url?: string
  name?: string // Route name (preferred over url)
  icon?: LucideIcon
}

export interface NavItem {
  title: string
  url?: string
  name?: string // Route name (preferred over url)
  icon?: LucideIcon
  isActive?: boolean
  items?: NavSubItem[]
}

export interface Team {
  name: string
  logo: Component | (() => Component)
  plan: string
  route?: { name: string; params?: any; query?: any } // Route object (preferred)
  url?: string // Deprecated: Use route instead
}

export interface User {
  name: string
  email: string
  avatar?: string
}
