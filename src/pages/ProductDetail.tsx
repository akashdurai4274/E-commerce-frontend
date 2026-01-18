import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/product/ProductCard";
import { useProduct, useProducts, useCreateReview } from "@/hooks/useProducts";
import { useAppDispatch, useIsAuthenticated } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { cn } from "@/lib/utils";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Review must be at least 5 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

function ImageGallery({
  images,
  productName,
}: {
  images: { image: string }[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in group">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedIndex}
                src={images[selectedIndex]?.image || "/placeholder.png"}
                alt={`${productName} - Image ${selectedIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            {/* Zoom Icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <img
            src={images[selectedIndex]?.image || "/placeholder.png"}
            alt={productName}
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                selectedIndex === idx
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-gray-300",
              )}
            >
              <img
                src={img.image}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Skeleton className="aspect-square rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading, error } = useProduct(id!);
  const { mutate: createReview, isPending: isReviewPending } =
    useCreateReview();

  // Related products
  const { data: relatedProducts } = useProducts({
    category: product?.category,
    limit: 4,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const rating = watch("rating");

  if (isLoading) {
    return (
      <div className="py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive text-lg mb-4">Product not found</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.image || "/placeholder.png",
        stock: product.stock,
        quantity,
      }),
    );
  };

  const onSubmitReview = (data: ReviewFormData) => {
    createReview(
      { productId: product.id, review: data },
      { onSuccess: () => reset() },
    );
  };

  const incrementQty = () => {
    if (quantity < product.stock) setQuantity((q) => q + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const discountPercentage = product.price > 100 ? 15 : 0;
  const originalPrice = discountPercentage > 0 ? product.price * 1.15 : null;

  return (
    <>
      <Helmet>
        <title>{product.name} - SkyCart</title>
        <meta name="description" content={product.description.slice(0, 160)} />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link to="/search" className="hover:text-primary">
          Products
        </Link>
        <span>/</span>
        <Link
          to={`/search?category=${encodeURIComponent(product.category)}`}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <ImageGallery images={product.images} productName={product.name} />

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              SKU: {product.id.slice(-8).toUpperCase()}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-5 w-5",
                    star <= Math.round(product.ratings)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200",
                  )}
                />
              ))}
            </div>
            <span className="font-medium">{product.ratings.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({product.num_of_reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <Badge className="bg-red-500 hover:bg-red-600">
                  Save {discountPercentage}%
                </Badge>
              </>
            )}
          </div>

          <Separator />

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">In Stock</span>
                <span className="text-muted-foreground">
                  ({product.stock} available)
                </span>
              </>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12"
                onClick={decrementQty}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-16 text-center font-semibold text-lg">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12"
                onClick={incrementQty}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="lg"
              className="flex-1 h-12 text-base"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-12"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isWishlisted && "fill-red-500 text-red-500",
                )}
              />
            </Button>

            <Button size="lg" variant="outline" className="h-12">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <Truck className="h-6 w-6 mb-2 text-primary" />
              <span className="text-xs font-medium">Free Shipping</span>
              <span className="text-xs text-muted-foreground">Over $100</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <Shield className="h-6 w-6 mb-2 text-primary" />
              <span className="text-xs font-medium">Secure Payment</span>
              <span className="text-xs text-muted-foreground">100% Safe</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <RotateCcw className="h-6 w-6 mb-2 text-primary" />
              <span className="text-xs font-medium">Easy Returns</span>
              <span className="text-xs text-muted-foreground">30 Days</span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-3 p-4 rounded-lg border">
            <Avatar>
              <AvatarFallback>{product.seller.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{product.seller}</p>
              <p className="text-sm text-muted-foreground">Verified Seller</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Reviews ({product.num_of_reviews})
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Shipping & Returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Review Summary */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <p className="text-5xl font-bold">
                      {product.ratings.toFixed(1)}
                    </p>
                    <div className="flex justify-center my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-5 w-5",
                            star <= Math.round(product.ratings)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200",
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      Based on {product.num_of_reviews} reviews
                    </p>
                  </div>

                  {isAuthenticated && (
                    <>
                      <Separator className="my-4" />
                      <form
                        onSubmit={handleSubmit(onSubmitReview)}
                        className="space-y-4"
                      >
                        <div>
                          <Label className="text-sm font-medium">
                            Your Rating
                          </Label>
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setValue("rating", star)}
                                className="p-1"
                              >
                                <Star
                                  className={cn(
                                    "h-6 w-6 transition-colors",
                                    star <= rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200",
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                          <input
                            type="hidden"
                            {...register("rating", { valueAsNumber: true })}
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="comment"
                            className="text-sm font-medium"
                          >
                            Your Review
                          </Label>
                          <textarea
                            id="comment"
                            className="w-full mt-2 p-3 border rounded-lg text-sm resize-none"
                            rows={4}
                            placeholder="Share your experience with this product..."
                            {...register("comment")}
                          />
                          {errors.comment && (
                            <p className="text-sm text-destructive mt-1">
                              {errors.comment.message}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isReviewPending}
                        >
                          {isReviewPending ? "Submitting..." : "Submit Review"}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {product.reviews.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">
                        No reviews yet. Be the first to review!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  product.reviews.map((review, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {review.user.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium">{review.user}</p>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={cn(
                                      "h-4 w-4",
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200",
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Free standard shipping on orders over $100.</p>
                  <p>Standard shipping: 5-7 business days</p>
                  <p>Express shipping: 2-3 business days</p>
                  <p>Same-day delivery available in select areas.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Return Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>30-day return policy for unused items.</p>
                  <p>Items must be in original packaging.</p>
                  <p>Free returns on all orders.</p>
                  <p>Refunds processed within 5-7 business days.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.products.length > 1 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.products
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      )}
    </>
  );
}
