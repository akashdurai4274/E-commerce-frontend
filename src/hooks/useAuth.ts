import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import api from '@/lib/api'
import { useAppDispatch } from '@/store/hooks'
import { setCredentials, setUser, logout as logoutAction } from '@/store/slices/authSlice'
import type { AuthResponse, User, LoginRequest, RegisterRequest, MessageResponse } from '@/types'

// Query keys
export const authKeys = {
  user: ['auth', 'user'] as const,
}

// Get current user
export function useCurrentUser() {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const { data } = await api.get<User>('/auth/me')
      dispatch(setUser(data))
      return data
    },
    enabled: !!localStorage.getItem('token'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

// Login mutation
export function useLogin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials)
      return data
    },
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }))
      queryClient.setQueryData(authKeys.user, data.user)
      toast.success('Login successful!')
      navigate('/')
    },
  })
}

// Register mutation
export function useRegister() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const { data } = await api.post<AuthResponse>('/auth/register', userData)
      return data
    },
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }))
      queryClient.setQueryData(authKeys.user, data.user)
      toast.success('Registration successful!')
      navigate('/')
    },
  })
}

// Logout mutation
export function useLogout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout')
    },
    onSuccess: () => {
      dispatch(logoutAction())
      queryClient.clear()
      toast.success('Logged out successfully')
      navigate('/login')
    },
    onError: () => {
      // Logout even if API call fails
      dispatch(logoutAction())
      queryClient.clear()
      navigate('/login')
    },
  })
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const { data } = await api.put<User>('/users/profile', userData)
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user, data)
      toast.success('Profile updated successfully')
    },
  })
}

// Update password mutation
export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (passwords: { old_password: string; new_password: string }) => {
      const { data } = await api.put<MessageResponse>('/auth/password/update', passwords)
      return data
    },
    onSuccess: () => {
      toast.success('Password updated successfully')
    },
  })
}

// Forgot password mutation
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post<MessageResponse>('/auth/password/forgot', { email })
      return data
    },
    onSuccess: () => {
      toast.success('Password reset email sent')
    },
  })
}

// Reset password mutation
export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ token, passwords }: { token: string; passwords: { password: string; confirm_password: string } }) => {
      const { data } = await api.put<MessageResponse>(`/auth/password/reset/${token}`, passwords)
      return data
    },
    onSuccess: () => {
      toast.success('Password reset successful')
      navigate('/login')
    },
  })
}
