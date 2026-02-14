import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'

export function useReferralApi() {
  const getReferral = async () => {
    try {
      const response = await apiClient.get('/v1/referral')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const getReferrals = async () => {
    try {
      const response = await apiClient.get('/v1/referral/list')
      return response.data?.referrals ?? []
    } catch (error) {
      throw parseError(error)
    }
  }

  const sendInvite = async (email) => {
    try {
      await apiClient.post('/v1/referral/invite', { email })
    } catch (error) {
      throw parseError(error)
    }
  }

  return { getReferral, getReferrals, sendInvite }
}
