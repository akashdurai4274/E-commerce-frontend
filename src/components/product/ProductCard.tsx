import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/store/hooks'
import { addToCart } from '@/store/slices/cartSlice'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(
      addToCart({
        product: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.image || '/placeholder.png',
        stock: product.stock,
        quantity: 1,
      })
    )
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const discountPercentage = product.price > 100 ? 15 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={className}
    >
      <Card
        className="group h-full overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {/* Product Image */}
            <img
              src={product.images[0]?.image || '/placeholder.png'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay Actions */}
            <div
              className={cn(
                'absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300',
                isHovered ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full"
                onClick={handleWishlist}
              >
                <Heart
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isWishlisted && 'fill-red-500 text-red-500'
                  )}
                />
              </Button>
              <Link to={`/product/${product.id}`}>
                <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.stock === 0 && (
                <Badge variant="destructive" className="px-2 py-1 text-xs font-semibold">
                  Out of Stock
                </Badge>
              )}
              {discountPercentage > 0 && product.stock > 0 && (
                <Badge className="bg-red-500 hover:bg-red-600 px-2 py-1 text-xs font-semibold">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <Badge variant="secondary" className="px-2 py-1 text-xs font-semibold">
                  Only {product.stock} left
                </Badge>
              )}
            </div>

            {/* Wishlist Icon (always visible) */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
              onClick={handleWishlist}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-colors',
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                )}
              />
            </Button>
          </div>

          <CardContent className="p-4">
            {/* Category */}
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>

            {/* Product Name */}
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-3.5 w-3.5',
                      star <= Math.round(product.ratings)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.num_of_reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  ${(product.price * 1.15).toFixed(2)}
                </span>
              )}
            </div>

            {/* Add to Cart Button (Mobile friendly) */}
            <Button
              className="w-full mt-3 md:hidden"
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  )
}

// Skeleton loader for product card
export function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-square bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-3 w-16 bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  )
}
