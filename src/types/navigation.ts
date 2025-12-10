import type { Component, LucideIcon } from 'lucide-vue-next'

export interface NavSubItem {
  title: string
  url?: string
  name?: string // Route name (preferred over url)
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
  logo: Component
  plan: string
  route?: { name: string; params?: any; query?: any } // Route object (preferred)
  url?: string // Deprecated: Use route instead
}

export interface User {
  name: string
  email: string
  avatar?: string
}
