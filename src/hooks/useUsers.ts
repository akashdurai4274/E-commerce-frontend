import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import api from '@/lib/api'
import type { User, UserListResponse, MessageResponse } from '@/types'

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  admin: () => [...userKeys.all, 'admin'] as const,
}

// Admin: Get all users
export function useAdminUsers(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...userKeys.admin(), { page, limit }],
    queryFn: async () => {
      const { data } = await api.get<UserListResponse>(
        `/users/admin/users?page=${page}&limit=${limit}`
      )
      return data
    },
  })
}

// Admin: Get single user
export function useAdminUser(id: string) {
  return useQuery({
    queryKey: [...userKeys.admin(), 'detail', id],
    queryFn: async () => {
      const { data } = await api.get<User>(`/users/admin/user/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Admin: Update user
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...userData
    }: { id: string; name?: string; email?: string; role?: 'user' | 'admin' }) => {
      const { data } = await api.put<User>(`/users/admin/user/${id}`, userData)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.admin() })
      queryClient.invalidateQueries({
        queryKey: [...userKeys.admin(), 'detail', variables.id],
      })
      toast.success('User updated successfully')
    },
  })
}

// Admin: Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.delete<MessageResponse>(
        `/users/admin/user/${userId}`
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.admin() })
      toast.success('User deleted successfully')
    },
  })
}
