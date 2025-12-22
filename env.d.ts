/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_REAL_API?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_BASE_URL_DEV?: string
  readonly VITE_API_BASE_URL_LIVE?: string
  readonly VITE_API_BASE_URL_LOCAL?: string
  readonly VITE_MAX_UPLOAD_SIZE_MB?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
