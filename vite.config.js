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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) return 'vue-vendor'
            if (id.includes('apexcharts') || id.includes('vue3-apexcharts')) return 'charts'
            if (id.includes('highcharts') || id.includes('highcharts-vue')) return 'highcharts'
            if (id.includes('recharts')) return 'recharts'
            if (id.includes('@unovis')) return 'unovis'
            if (id.includes('radix-vue') || id.includes('reka-ui') || id.includes('lucide-vue-next')) return 'ui'
            if (id.includes('vee-validate') || id.includes('yup')) return 'form'
            if (id.includes('@vueuse')) return 'vueuse'
          }
        },
      },
    },
  },
})
