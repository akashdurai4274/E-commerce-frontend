import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import api from '@/lib/api'
import type { Product, ProductListResponse, MessageResponse } from '@/types'

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  admin: () => [...productKeys.all, 'admin'] as const,
}

// Product filters interface
interface ProductFilters {
  keyword?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  page?: number
  limit?: number
}

// Get products with filters
export function useProducts(filters: ProductFilters = {}) {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    minRating,
    page = 1,
    limit = 10,
  } = filters

  const params = new URLSearchParams()
  if (keyword) params.append('keyword', keyword)
  if (category) params.append('category', category)
  if (minPrice !== undefined) params.append('price[gte]', minPrice.toString())
  if (maxPrice !== undefined) params.append('price[lte]', maxPrice.toString())
  if (minRating !== undefined) params.append('ratings[gte]', minRating.toString())
  params.append('page', page.toString())
  params.append('resPerPage', limit.toString())

  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<ProductListResponse>(
        `/products?${params.toString()}`
      )
      return data
    },
  })
}

// Get single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Admin: Get all products
export function useAdminProducts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...productKeys.admin(), { page, limit }],
    queryFn: async () => {
      const { data } = await api.get<ProductListResponse>(
        `/products/admin/products?page=${page}&limit=${limit}`
      )
      return data
    },
  })
}

// Admin: Create product
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      const { data } = await api.post<Product>('/products/admin/product/new', productData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Product created successfully')
    },
  })
}

// Admin: Update product
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...productData }: Partial<Product> & { id: string }) => {
      const { data } = await api.put<Product>(`/products/admin/product/${id}`, productData)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success('Product updated successfully')
    },
  })
}

// Admin: Delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<MessageResponse>(`/products/admin/product/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success('Product deleted successfully')
    },
  })
}

// Create review
export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      review,
    }: {
      productId: string
      review: { rating: number; comment: string }
    }) => {
      const { data } = await api.post<MessageResponse>(
        `/products/${productId}/review`,
        review
      )
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) })
      toast.success('Review submitted successfully')
    },
  })
}

// Delete review
export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<MessageResponse>(
        `/products/${productId}/review`
      )
      return data
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) })
      toast.success('Review deleted successfully')
    },
  })
}
