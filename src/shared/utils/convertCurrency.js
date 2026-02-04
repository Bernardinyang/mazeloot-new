import { formatMoney } from '@/shared/utils/formatMoney'

/**
 * Convert USD cents to target currency smallest unit (kobo, cents, yen).
 * Rate = target smallest unit per 1 USD cent.
 * @param {number} usdCents
 * @param {string} currency - e.g. 'usd', 'ngn'
 * @param {Record<string, number>} rates - from getCurrencyRates()
 * @returns {number} Amount in target smallest unit (usd returns usdCents as-is)
 */
export function convertUsdCentsToTargetSmallest(usdCents, currency, rates = {}) {
  const cur = (currency || 'usd').toLowerCase()
  if (cur === 'usd' || rates[cur] == null) return usdCents
  return Math.round(usdCents * rates[cur])
}

/**
 * Convert USD cents to formatted string in target currency using rates from /pricing/currency-rates.
 * Rate = target smallest unit per 1 USD cent (JPY: yen per cent; others: kobo/cents per cent).
 * @param {number} usdCents
 * @param {string} currency - e.g. 'usd', 'ngn'
 * @param {Record<string, number>} rates - from getCurrencyRates()
 * @returns {string}
 */
export function convertUsdCentsToFormatted(usdCents, currency, rates = {}) {
  const cur = (currency || 'usd').toLowerCase()
  if (cur === 'usd' || rates[cur] == null) return formatMoney(usdCents, 'usd')
  const converted = convertUsdCentsToTargetSmallest(usdCents, cur, rates)
  if (cur === 'jpy') return formatMoney(converted, 'jpy', { inCents: false })
  return formatMoney(converted, cur)
}
