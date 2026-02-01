/**
 * Global currency preference. Persisted; initial value from browser location (timezone).
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { storage } from '@/shared/utils/storage'

const STORAGE_KEY = 'mazeloot_currency'

const TIMEZONE_TO_CURRENCY = {
  'Africa/Lagos': 'ngn',
  'Africa/Johannesburg': 'zar',
  'Africa/Cape_Town': 'zar',
  'Africa/Nairobi': 'kes',
  'Africa/Accra': 'ghs',
  'Europe/London': 'gbp',
  'America/Toronto': 'cad',
  'America/Vancouver': 'cad',
  'Asia/Tokyo': 'jpy',
  'Australia/Sydney': 'aud',
  'Australia/Melbourne': 'aud',
  'Australia/Brisbane': 'aud',
  'Australia/Perth': 'aud',
}

const PREFIX_DEFAULTS = [
  ['Africa/', 'usd'],
  ['Europe/', 'eur'],
  ['America/', 'usd'],
  ['Asia/', 'usd'],
  ['Australia/', 'aud'],
  ['Pacific/', 'usd'],
]

function getSuggestedFromBrowser() {
  if (typeof Intl === 'undefined' || !Intl.DateTimeFormat) return 'usd'
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!tz) return 'usd'
    if (TIMEZONE_TO_CURRENCY[tz]) return TIMEZONE_TO_CURRENCY[tz]
    for (const [prefix, def] of PREFIX_DEFAULTS) {
      if (tz.startsWith(prefix)) return def
    }
    return 'usd'
  } catch {
    return 'usd'
  }
}

export const SUPPORTED_CURRENCIES = [
  { code: 'usd', label: 'USD ($)' },
  { code: 'eur', label: 'EUR (€)' },
  { code: 'gbp', label: 'GBP (£)' },
  { code: 'ngn', label: 'NGN (₦)' },
  { code: 'zar', label: 'ZAR (R)' },
  { code: 'kes', label: 'KES (KSh)' },
  { code: 'ghs', label: 'GHS (₵)' },
  { code: 'jpy', label: 'JPY (¥)' },
  { code: 'cad', label: 'CAD (C$)' },
  { code: 'aud', label: 'AUD (A$)' },
]

const VALID_CODES = new Set(SUPPORTED_CURRENCIES.map((c) => c.code))

export const CURRENCY_SYMBOLS = {
  usd: '$', eur: '€', gbp: '£', ngn: '₦', zar: 'R', kes: 'KSh', ghs: '₵', jpy: '¥', cad: 'C$', aud: 'A$',
}

export const useCurrencyStore = defineStore('currency', () => {
  const stored = storage.get(STORAGE_KEY)
  const suggested = getSuggestedFromBrowser()
  const currency = ref(
    stored && VALID_CODES.has(stored) ? stored : suggested && VALID_CODES.has(suggested) ? suggested : 'usd'
  )

  if (!stored && suggested && VALID_CODES.has(suggested)) {
    storage.set(STORAGE_KEY, suggested)
  }

  watch(
    currency,
    (val) => {
      if (val && VALID_CODES.has(val)) storage.set(STORAGE_KEY, val)
    },
    { immediate: true }
  )

  function setCurrency(code) {
    const c = (code || '').toLowerCase()
    if (VALID_CODES.has(c)) currency.value = c
  }

  const currencySymbol = computed(() => CURRENCY_SYMBOLS[currency.value] ?? '$')

  return { currency, currencySymbol, setCurrency }
})
