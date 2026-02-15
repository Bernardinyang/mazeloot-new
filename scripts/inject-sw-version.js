import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const swPath = join(__dirname, '..', 'dist', 'sw.js')
const version = process.env.BUILD_TIME ? String(process.env.BUILD_TIME) : String(Date.now())

if (!existsSync(swPath)) {
  console.warn('inject-sw-version: dist/sw.js not found (run after vite build)')
  process.exit(0)
}
let content = readFileSync(swPath, 'utf8')
if (!content.includes('__CACHE_VERSION__')) {
  console.warn('inject-sw-version: __CACHE_VERSION__ not found in sw.js')
  process.exit(0)
}
content = content.replace(/__CACHE_VERSION__/g, version)
writeFileSync(swPath, content)
console.log('inject-sw-version: set cache version to', version)
