import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vendor-vue'
            }
            if (id.includes('@radix-ui') || id.includes('radix-vue') || id.includes('reka-ui')) {
              return 'vendor-ui'
            }
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-utils'
            }
            return 'vendor'
          }
          if (id.includes('/domains/memora/')) {
            return 'memora'
          }
          if (id.includes('/shared/')) {
            return 'shared'
          }
        },
      },
    },
  },
})
