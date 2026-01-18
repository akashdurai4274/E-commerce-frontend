import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price with currency
 */
export function formatPrice(
  price: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price)
}

/**
 * Format date
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(date).toLocaleDateString('en-US', options || defaultOptions)
}

/**
 * Truncate text
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Generate pagination range
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  delta: number = 2
): (number | string)[] {
  const range: (number | string)[] = []
  const rangeWithDots: (number | string)[] = []
  let l: number

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (typeof i === 'number' && i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (typeof i === 'number' && i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = typeof i === 'number' ? i : l
  })

  return rangeWithDots
}

/**
 * Delay utility
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(
  items: Array<{ price: number; quantity: number }>
) {
  const itemsPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const taxPrice = itemsPrice * 0.05 // 5% tax
  const shippingPrice = itemsPrice > 200 ? 0 : 25
  const totalPrice = itemsPrice + taxPrice + shippingPrice

  return {
    itemsPrice: Number(itemsPrice.toFixed(2)),
    taxPrice: Number(taxPrice.toFixed(2)),
    shippingPrice: Number(shippingPrice.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
  }
}
