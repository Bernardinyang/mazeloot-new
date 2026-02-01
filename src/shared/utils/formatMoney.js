/**
 * Format amount as money with currency symbol and locale-aware number formatting.
 * Amount is treated as smallest unit (cents/kobo/pesewas etc). Paystack amounts
 * are in kobo (NGN), so pass them as-is; formatMoney divides by 100 for display.
 * @param {number} cents - Amount in smallest unit (cents, kobo, etc.)
 * @param {string} currencyCode - Currency code (e.g. 'usd', 'ngn', 'jpy')
 * @param {{ inCents?: boolean }} [options] - inCents: true (default) = amount is in smallest unit
 * @returns {string} Formatted string e.g. "$1,234.56", "₦21,750.00", "¥15,000"
 */

const DECIMALS = { jpy: 0 }
const DEFAULT_DECIMALS = 2

export function formatMoney(cents, currencyCode, options = {}) {
  const inCents = options.inCents !== false
  const amount = inCents ? cents / 100 : cents
  const code = (currencyCode || 'usd').toLowerCase()
  const decimals = DECIMALS[code] ?? DEFAULT_DECIMALS

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code.toUpperCase(),
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount)
  } catch {
    const symbol = { usd: '$', eur: '€', gbp: '£', ngn: '₦', zar: 'R', kes: 'KSh', ghs: '₵', jpy: '¥', cad: 'C$', aud: 'A$' }[code] ?? '$'
    const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    return `${symbol}${formatted}`
  }
}
