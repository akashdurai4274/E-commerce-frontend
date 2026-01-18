import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import api from '@/lib/api'
import { useAppDispatch } from '@/store/hooks'
import { clearCart, clearShippingInfo } from '@/store/slices/cartSlice'
import type { Order, OrderListResponse, MessageResponse, SalesStats } from '@/types'

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  myOrders: () => [...orderKeys.all, 'my'] as const,
  admin: () => [...orderKeys.all, 'admin'] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
}

// Get user's orders
export function useMyOrders(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...orderKeys.myOrders(), { page, limit }],
    queryFn: async () => {
      const { data } = await api.get<OrderListResponse>(
        `/orders/me?page=${page}&limit=${limit}`
      )
      return data
    },
  })
}

// Get single order
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Create order
export function useCreateOrder() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (orderData: {
      shipping_info: Order['shipping_info']
      order_items: Order['order_items']
      items_price: number
      tax_price: number
      shipping_price: number
      payment_info: Order['payment_info']
    }) => {
      const { data } = await api.post<Order>('/orders/new', orderData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      dispatch(clearCart())
      dispatch(clearShippingInfo())
      toast.success('Order placed successfully!')
      navigate('/order/success')
    },
  })
}

// Cancel order
export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.put<Order>(`/orders/${orderId}/cancel`)
      return data
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() })
      toast.success('Order cancelled successfully')
    },
  })
}

// Admin: Get all orders
export function useAdminOrders(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...orderKeys.admin(), { page, limit }],
    queryFn: async () => {
      const { data } = await api.get<OrderListResponse>(
        `/orders/admin/orders?page=${page}&limit=${limit}`
      )
      return data
    },
  })
}

// Admin: Get order
export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: [...orderKeys.admin(), 'detail', id],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/admin/order/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Admin: Update order status
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data } = await api.put<Order>(`/orders/admin/order/${orderId}`, {
        status,
      })
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...orderKeys.admin(), 'detail', variables.orderId],
      })
      queryClient.invalidateQueries({ queryKey: orderKeys.admin() })
      toast.success('Order status updated')
    },
  })
}

// Admin: Get sales stats
export function useSalesStats() {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: async () => {
      const { data } = await api.get<SalesStats>('/orders/admin/stats')
      return data
    },
  })
}
