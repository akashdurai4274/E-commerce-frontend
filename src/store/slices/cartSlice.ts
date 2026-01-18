import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

export interface CartItem {
  product: string
  name: string
  price: number
  image: string
  stock: number
  quantity: number
}

export interface ShippingInfo {
  address: string
  city: string
  country: string
  postal_code: string
  phone_no: string
}

interface CartState {
  items: CartItem[]
  shippingInfo: ShippingInfo | null
}

const initialState: CartState = {
  items: [],
  shippingInfo: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.product === action.payload.product
      )

      if (existingItem) {
        // Check stock before adding
        if (existingItem.quantity + 1 > action.payload.stock) {
          toast.error('Cannot add more items. Stock limit reached.')
          return
        }
        existingItem.quantity += 1
        toast.success('Cart updated')
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
        toast.success('Added to cart')
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product !== action.payload
      )
      toast.success('Removed from cart')
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.product === action.payload.productId
      )
      if (item) {
        if (action.payload.quantity > item.stock) {
          toast.error('Cannot exceed stock limit')
          return
        }
        if (action.payload.quantity < 1) {
          state.items = state.items.filter(
            (i) => i.product !== action.payload.productId
          )
          toast.success('Removed from cart')
          return
        }
        item.quantity = action.payload.quantity
      }
    },
    setShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload
    },
    clearCart: (state) => {
      state.items = []
    },
    clearShippingInfo: (state) => {
      state.shippingInfo = null
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setShippingInfo,
  clearCart,
  clearShippingInfo,
} = cartSlice.actions

export default cartSlice.reducer
