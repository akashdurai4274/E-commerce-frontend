import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Star, Trash2, MessageSquare, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import api from "@/lib/api";
import type { Product, MessageResponse } from "@/types";

export default function ReviewList() {
  const [productId, setProductId] = useState("");
  const [searchId, setSearchId] = useState("");
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", searchId],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${searchId}`);
      return data;
    },
    enabled: !!searchId,
  });

  const { mutate: deleteReview, isPending: isDeleting } = useMutation({
    mutationFn: async ({ productId }: { productId: string }) => {
      const { data } = await api.delete<MessageResponse>(
        `/products/admin/reviews?productId=${productId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", searchId] });
      toast.success("Review deleted successfully");
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (productId.trim()) {
      setSearchId(productId.trim());
    }
  };

  const handleDeleteReview = (reviewUser: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReview({ productId: searchId });
    }
  };

  return (
    <>
      <Helmet>
        <title>Reviews - Admin - SkyCart</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Product Reviews
          </h1>
          <p className="text-muted-foreground">
            View and manage product reviews
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                placeholder="Enter Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="max-w-md"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}

        {error && (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-destructive">Product not found</p>
            </CardContent>
          </Card>
        )}

        {product && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <img
                  src={product.images[0]?.image || "/placeholder.png"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <CardTitle>{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {product.num_of_reviews} reviews | Rating:{" "}
                    {product.ratings.toFixed(1)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {product.reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No reviews for this product
                </p>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            by {review.user}
                          </span>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteReview(review.user)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!searchId && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Search for a product</h3>
              <p className="text-muted-foreground">
                Enter a product ID above to view and manage its reviews
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
