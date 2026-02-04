/** Default months free when billing annually (BYO config). */
export const DEFAULT_ANNUAL_DISCOUNT_MONTHS = 2

/**
 * Annual save percentage from discount months (e.g. 2 months free → 17%).
 * @param {number} [discountMonths=2]
 * @returns {number}
 */
export function getAnnualSavePct(discountMonths = DEFAULT_ANNUAL_DISCOUNT_MONTHS) {
  return (Number(discountMonths) / 12) * 100
}
