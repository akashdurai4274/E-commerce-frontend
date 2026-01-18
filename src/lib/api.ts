import axios, { AxiosError, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'

// Types
export interface ApiError {
  message: string
  success: false
  errors?: Record<string, string[]>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {
    const message =
      error.response?.data?.message || error.message || 'An error occurred'

    // Handle specific error codes
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Don't show toast for 401 errors (login page will handle)
    if (error.response?.status !== 401) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api

// API helper functions
export const apiGet = async <T>(url: string): Promise<T> => {
  const response = await api.get<T>(url)
  return response.data
}

export const apiPost = async <T, D = unknown>(
  url: string,
  data?: D
): Promise<T> => {
  const response = await api.post<T>(url, data)
  return response.data
}

export const apiPut = async <T, D = unknown>(
  url: string,
  data?: D
): Promise<T> => {
  const response = await api.put<T>(url, data)
  return response.data
}

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url)
  return response.data
}
