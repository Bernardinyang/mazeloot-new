/**
 * Plan comparison matrix for pricing table.
 * Values: true (check), false (dash), string (display value).
 * Must match backend: MemoraPricingTiersSeeder / TierService (MemoraPricingTier model).
 */
export const PLAN_COMPARISON_ROWS = [
  { category: 'Set limits', label: 'Project set limit', starter: '1', pro: 'Unlimited', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'Set limits', label: 'Collection set limit', starter: '1', pro: 'Unlimited', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'Set limits', label: 'Selection set limit', starter: '1', pro: 'Unlimited', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'Set limits', label: 'Proofing set limit', starter: '1', pro: 'Unlimited', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'Set limits', label: 'Raw files set limit', starter: '1', pro: '—', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'Limits', label: 'Project limit', starter: '1', pro: 'Unlimited', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'Limits', label: 'Collection limit', starter: '1', pro: 'Unlimited', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'Limits', label: 'Selection limit', starter: '1', pro: 'Unlimited', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'Limits', label: 'Proofing limit', starter: '1', pro: 'Unlimited', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'Limits', label: 'Raw files limit', starter: '1', pro: '—', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'General', label: 'Selection phase', starter: true, pro: true, studio: true, business: true, byo: true },
  { category: 'General', label: 'Proofing phase', starter: true, pro: true, studio: true, business: true, byo: true },
  { category: 'General', label: 'Collection phase', starter: true, pro: true, studio: true, business: true, byo: true },
  { category: 'General', label: 'Raw Files phase', starter: false, pro: false, studio: true, business: true, byo: true },
  { category: 'General', label: 'Mazeloot branding', starter: true, pro: true, studio: true, business: true, byo: true },
  { category: 'General', label: 'Remove branding', starter: false, pro: true, studio: true, business: true, byo: true },
  { category: 'General', label: 'Custom domain', starter: false, pro: true, studio: true, business: true, byo: true },
  { category: 'General', label: 'Homepage', starter: false, pro: true, studio: true, business: true, byo: true },
  { category: 'General', label: 'Edit branding / Domain / Brand assets', starter: false, pro: true, studio: true, business: true, byo: true },
  { category: 'General', label: 'Social links', starter: false, pro: true, studio: true, business: true, byo: true },
  { category: 'General', label: 'Collection display', starter: false, pro: true, studio: true, business: true, byo: true },
  { category: 'General', label: 'Photo quality settings', starter: false, pro: true, studio: true, business: true, byo: true },
  { category: 'General', label: 'Legal documents', starter: false, pro: true, studio: true, business: true, byo: true },
  { category: 'Storage', label: 'Storage', starter: '5GB', pro: '100GB', studio: '500GB', business: 'Unlimited', byo: 'Custom' },
  { category: 'Features', label: 'Proofing revisions', starter: '—', pro: '5', studio: '10', business: '20', byo: 'Custom' },
  { category: 'Features', label: 'Watermarks', starter: '1', pro: '3', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'Features', label: 'Presets', starter: '0', pro: '5', studio: 'Unlimited', business: 'Unlimited', byo: 'Custom' },
  { category: 'Features', label: 'Analytics', starter: false, pro: 'Basic', studio: 'Advanced', business: 'Advanced', byo: 'Custom' },
  { category: 'Features', label: 'Team collaboration', starter: false, pro: false, studio: false, business: '5 seats', byo: 'Custom' },
  { category: 'Features', label: 'API access', starter: false, pro: false, studio: false, business: true, byo: true },
  { category: 'Support', label: 'Support', starter: 'Community', pro: 'Email', studio: 'Priority', business: '24/7', byo: 'Custom' },
]

export const PLAN_IDS = ['starter', 'pro', 'studio', 'business', 'byo']

export function getComparisonValue(row, tierId) {
  const v = row[tierId]
  if (v === true) return 'check'
  if (v === false) return 'dash'
  return v
}
