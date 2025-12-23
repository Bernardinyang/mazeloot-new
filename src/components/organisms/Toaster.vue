<template>
  <Toaster position="bottom-right" richColors :theme="toastTheme" closeButton />
</template>

<script setup>
import { Toaster } from 'vue-sonner'
import { computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const toastTheme = computed(() => {
  // Map effectiveTheme to vue-sonner theme values ('light' or 'dark')
  return themeStore.effectiveTheme === 'dark' ? 'dark' : 'light'
})

// Apply toast design type to document root for global styling
onMounted(() => {
  const root = document.documentElement
  const designType = themeStore.toastDesign || '1'
  root.setAttribute('data-toast-design', designType)

  watch(
    () => themeStore.toastDesign,
    newDesign => {
      root.setAttribute('data-toast-design', newDesign || '1')
    }
  )
})
</script>

<style>
/* Ensure close button is on the right side of toast */
[data-sonner-toast] {
  padding-right: 2.5rem !important;
  border-radius: 8px;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}

[data-sonner-toast] [data-close-button] {
  right: 0.5rem !important;
  left: auto !important;
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

[data-sonner-toast] [data-close-button]:hover {
  opacity: 1;
}

/* Hide toast titles - show only description */
[data-sonner-toast] [data-title] {
  display: none !important;
}

/* Design Type 1: Light pink background with red x icon in white circle */
[data-toast-design='1'] [data-sonner-toast][data-type='error'],
.toast-design-1 [data-sonner-toast][data-type='error'] {
  background: #fef2f2 !important;
  color: #374151 !important;
  border: none !important;
  border-radius: 8px;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  padding: 12px 16px;
}

[data-toast-design='1'] [data-sonner-toast][data-type='error'] [data-icon],
.toast-design-1 [data-sonner-toast][data-type='error'] [data-icon] {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ef4444;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

[data-toast-design='1'] [data-sonner-toast][data-type='error'] [data-icon] svg,
.toast-design-1 [data-sonner-toast][data-type='error'] [data-icon] svg {
  color: #ef4444;
  width: 10px;
  height: 10px;
  stroke-width: 2.5;
}

[data-toast-design='1'] [data-sonner-toast][data-type='error'] [data-close-button],
.toast-design-1 [data-sonner-toast][data-type='error'] [data-close-button] {
  color: #6b7280;
  width: 16px;
  height: 16px;
}

/* Design Type 2: Solid red background with white text */
[data-toast-design='2'] [data-sonner-toast][data-type='error'],
.toast-design-2 [data-sonner-toast][data-type='error'] {
  background: #ef4444 !important;
  color: white !important;
  border: none !important;
  border-radius: 8px;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  padding: 12px 16px;
}

[data-toast-design='2'] [data-sonner-toast][data-type='error'] [data-icon],
.toast-design-2 [data-sonner-toast][data-type='error'] [data-icon] {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ef4444;
  border: 1px solid white;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
  position: relative;
}

/* Subtle lighter red ring around the circle */
[data-toast-design='2'] [data-sonner-toast][data-type='error'] [data-icon]::before,
.toast-design-2 [data-sonner-toast][data-type='error'] [data-icon]::before {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 50%;
  top: -2px;
  left: -2px;
}

[data-toast-design='2'] [data-sonner-toast][data-type='error'] [data-icon] svg,
.toast-design-2 [data-sonner-toast][data-type='error'] [data-icon] svg {
  color: white;
  width: 10px;
  height: 10px;
  stroke-width: 2.5;
  z-index: 1;
  position: relative;
}

[data-toast-design='2'] [data-sonner-toast][data-type='error'] [data-close-button],
.toast-design-2 [data-sonner-toast][data-type='error'] [data-close-button] {
  color: white;
  width: 16px;
  height: 16px;
}

/* Design Type 3: White background with red square icon */
[data-toast-design='3'] [data-sonner-toast][data-type='error'],
.toast-design-3 [data-sonner-toast][data-type='error'] {
  background: white !important;
  color: #374151 !important;
  border: none !important;
  border-radius: 8px;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  padding: 12px 16px;
}

[data-toast-design='3'] [data-sonner-toast][data-type='error'] [data-icon],
.toast-design-3 [data-sonner-toast][data-type='error'] [data-icon] {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ef4444;
  border: 1px solid white;
  border-radius: 6px;
  margin-right: 12px;
  flex-shrink: 0;
  position: relative;
}

/* Red circle with white border around the square */
[data-toast-design='3'] [data-sonner-toast][data-type='error'] [data-icon]::before,
.toast-design-3 [data-sonner-toast][data-type='error'] [data-icon]::before {
  content: '';
  position: absolute;
  width: 28px;
  height: 28px;
  border: 1px solid white;
  border-radius: 50%;
  top: -2px;
  left: -2px;
  z-index: -1;
}

/* Subtle lighter red ring around the circle */
[data-toast-design='3'] [data-sonner-toast][data-type='error'] [data-icon]::after,
.toast-design-3 [data-sonner-toast][data-type='error'] [data-icon]::after {
  content: '';
  position: absolute;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 50%;
  top: -4px;
  left: -4px;
  z-index: -2;
}

[data-toast-design='3'] [data-sonner-toast][data-type='error'] [data-icon] svg,
.toast-design-3 [data-sonner-toast][data-type='error'] [data-icon] svg {
  color: white;
  width: 12px;
  height: 12px;
  stroke-width: 2.5;
  position: relative;
  z-index: 1;
}

[data-toast-design='3'] [data-sonner-toast][data-type='error'] [data-close-button],
.toast-design-3 [data-sonner-toast][data-type='error'] [data-close-button] {
  color: #6b7280;
  width: 16px;
  height: 16px;
}

/* Design Type 4: Light pink background with progress bar */
[data-toast-design='4'] [data-sonner-toast][data-type='error'],
.toast-design-4 [data-sonner-toast][data-type='error'] {
  background: #fef2f2 !important;
  color: #374151 !important;
  border: none !important;
  border-radius: 8px;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  padding: 12px 16px;
  position: relative;
  overflow: visible;
}

/* Progress bar at the bottom */
[data-toast-design='4'] [data-sonner-toast][data-type='error']::after,
.toast-design-4 [data-sonner-toast][data-type='error']::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 75%;
  background: #ef4444;
  animation: progressBar 5s linear forwards;
  border-radius: 0 0 8px 0;
}

[data-toast-design='4'] [data-sonner-toast][data-type='error'] [data-icon],
.toast-design-4 [data-sonner-toast][data-type='error'] [data-icon] {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ef4444;
  border-radius: 6px;
  margin-right: 12px;
  flex-shrink: 0;
}

[data-toast-design='4'] [data-sonner-toast][data-type='error'] [data-icon] svg,
.toast-design-4 [data-sonner-toast][data-type='error'] [data-icon] svg {
  color: #ef4444;
  width: 10px;
  height: 10px;
  stroke-width: 2.5;
}

[data-toast-design='4'] [data-sonner-toast][data-type='error'] [data-close-button],
.toast-design-4 [data-sonner-toast][data-type='error'] [data-close-button] {
  color: #6b7280;
  width: 16px;
  height: 16px;
}

@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Design Type 5: White background with pill shape, light pink circle icon */
[data-toast-design='5'] [data-sonner-toast][data-type='error'],
.toast-design-5 [data-sonner-toast][data-type='error'] {
  background: white !important;
  color: #374151 !important;
  border: none !important;
  border-radius: 9999px !important;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  padding: 8px 16px;
}

[data-toast-design='5'] [data-sonner-toast][data-type='error'] [data-icon],
.toast-design-5 [data-sonner-toast][data-type='error'] [data-icon] {
  background: #fef2f2;
  border: 1px solid #ef4444;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

[data-toast-design='5'] [data-sonner-toast][data-type='error'] [data-icon] svg,
.toast-design-5 [data-sonner-toast][data-type='error'] [data-icon] svg {
  color: #ef4444;
  width: 14px;
  height: 14px;
}

[data-toast-design='5'] [data-sonner-toast][data-type='error'] [data-icon]::before,
.toast-design-5 [data-sonner-toast][data-type='error'] [data-icon]::before {
  content: '';
  position: absolute;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 50%;
}

/* Default design (Design Type 1) - fallback if no design is set */
[data-sonner-toast][data-type='error']:not([data-toast-design]) {
  background: #fef2f2 !important;
  color: #374151 !important;
  border: none !important;
  border-radius: 8px;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  padding: 12px 16px;
}

[data-sonner-toast][data-type='error']:not([data-toast-design]) [data-icon] {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ef4444;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

[data-sonner-toast][data-type='error']:not([data-toast-design]) [data-icon] svg {
  color: #ef4444;
  width: 10px;
  height: 10px;
  stroke-width: 2.5;
}

/* Style action buttons in toasts */
[data-sonner-toast] [data-button] {
  background: rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 6px !important;
  padding: 6px 12px !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  margin-top: 8px !important;
  color: inherit !important;
}

[data-sonner-toast] [data-button]:hover {
  background: rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
  transform: translateY(-1px) !important;
}

/* Dark mode action buttons */
.dark [data-sonner-toast] [data-button] {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.dark [data-sonner-toast] [data-button]:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

/* Success toast action buttons - subtle teal accent */
[data-sonner-toast][data-type='success'] [data-button] {
  background: rgba(20, 184, 166, 0.1) !important;
  border-color: rgba(20, 184, 166, 0.2) !important;
  color: rgb(20, 184, 166) !important;
}

[data-sonner-toast][data-type='success'] [data-button]:hover {
  background: rgba(20, 184, 166, 0.15) !important;
  border-color: rgba(20, 184, 166, 0.3) !important;
}

.dark [data-sonner-toast][data-type='success'] [data-button] {
  background: rgba(20, 184, 166, 0.15) !important;
  border-color: rgba(20, 184, 166, 0.3) !important;
  color: rgb(94, 234, 212) !important;
}

.dark [data-sonner-toast][data-type='success'] [data-button]:hover {
  background: rgba(20, 184, 166, 0.2) !important;
  border-color: rgba(20, 184, 166, 0.4) !important;
}
</style>
