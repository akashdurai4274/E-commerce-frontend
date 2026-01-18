
// Product types
export interface ProductImage {
  image: string
}

export interface ProductReview {
  user: string
  rating: number
  comment: string
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  ratings: number
  images: ProductImage[]
  category: string
  seller: string
  stock: number
  num_of_reviews: number
  reviews: ProductReview[]
  user?: string
  created_at?: string
}

export interface ProductListResponse {
  success: boolean
  count: number
  total: number
  page: number
  pages: number
  results_per_page: number
  products: Product[]
}

// Order types
export interface ShippingInfo {
  address: string
  city: string
  country: string
  postal_code: string
  phone_no: string
}

export interface PaymentInfo {
  id: string
  status: string
}

export interface OrderItem {
  product: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  user: string
  shipping_info: ShippingInfo
  order_items: OrderItem[]
  items_price: number
  tax_price: number
  shipping_price: number
  total_price: number
  payment_info?: PaymentInfo
  paid_at?: string
  delivered_at?: string
  order_status: string
  created_at?: string
}

export interface OrderListResponse {
  success: boolean
  count: number
  total: number
  page: number
  pages: number
  orders: Order[]
}

// User types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin'
  created_at?: string
}

export interface UserListResponse {
  success: boolean
  count: number
  total: number
  page: number
  pages: number
  users: User[]
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
}

// API response types
export interface MessageResponse {
  success: boolean
  message: string
}

export interface SalesStats {
  total_orders: number
  total_sales: number
  average_order_value: number
  delivered_orders: number
  processing_orders: number
  cancelled_orders: number
}

// Category enum
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Mobile Phones',
  'Laptops',
  'Accessories',
  'Headphones',
  'Food',
  'Books',
  'Clothes/Shoes',
  'Beauty/Health',
  'Sports',
  'Outdoor',
  'Home',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

// Order status enum
export const ORDER_STATUSES = [
  'Processing',
  'Confirmed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Refunded',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
