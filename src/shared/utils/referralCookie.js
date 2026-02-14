const REFERRAL_COOKIE = 'mazeloot_ref'
const MAX_AGE_DAYS = 30

export function setReferralCode(code) {
  if (!code || typeof document === 'undefined') return
  const value = encodeURIComponent(String(code).trim().slice(0, 32))
  const expires = new Date(Date.now() + MAX_AGE_DAYS * 864e5).toUTCString()
  document.cookie = `${REFERRAL_COOKIE}=${value}; path=/; max-age=${MAX_AGE_DAYS * 86400}; SameSite=Lax`
}

export function getReferralCode() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${REFERRAL_COOKIE}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function clearReferralCode() {
  if (typeof document === 'undefined') return
  document.cookie = `${REFERRAL_COOKIE}=; path=/; max-age=0`
}
