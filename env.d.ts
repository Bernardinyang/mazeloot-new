/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_REAL_API?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_BASE_URL_DEV?: string
  readonly VITE_API_BASE_URL_LIVE?: string
  readonly VITE_API_BASE_URL_LOCAL?: string
  readonly VITE_MAX_UPLOAD_SIZE_MB?: string
  readonly VITE_PUSHER_APP_KEY?: string
  readonly VITE_PUSHER_APP_CLUSTER?: string
  readonly VITE_PUSHER_HOST?: string
  readonly VITE_PUSHER_PORT?: string
  readonly VITE_PUSHER_SCHEME?: string
  readonly VITE_USE_PUSHER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
