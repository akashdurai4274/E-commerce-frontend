import { useQuery, useMutation } from '@tanstack/react-query'

import api from '@/lib/api'

interface PaymentIntentResponse {
  success: boolean
  client_secret: string
  payment_intent_id: string
}

interface StripeKeyResponse {
  stripe_api_key: string
}

// Get Stripe API key
export function useStripeKey() {
  return useQuery({
    queryKey: ['stripe', 'key'],
    queryFn: async () => {
      const { data } = await api.get<StripeKeyResponse>('/payments/stripeapi')
      return data.stripe_api_key
    },
    staleTime: Infinity, // Key doesn't change
  })
}

// Create payment intent
export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: async ({ amount, currency = 'usd' }: { amount: number; currency?: string }) => {
      const { data } = await api.post<PaymentIntentResponse>('/payments/process', {
        amount,
        currency,
      })
      return data
    },
  })
}
