import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { PRODUCT_CATEGORIES } from "@/types";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  seller: z.string().min(1, "Seller is required"),
  stock: z.number().min(0, "Stock must be non-negative"),
  images: z.string().min(1, "At least one image URL is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function UpdateProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id!);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        seller: product.seller,
        stock: product.stock,
        images: product.images.map((img) => img.image).join(", "),
      });
    }
  }, [product, reset]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">Product not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/admin/products")}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  const onSubmit = (data: ProductFormData) => {
    const productData = {
      id: product.id,
      ...data,
      images: data.images.split(",").map((url) => ({ image: url.trim() })),
    };
    updateProduct(productData, {
      onSuccess: () => navigate("/admin/products"),
    });
  };

  return (
    <>
      <Helmet>
        <title>Edit {product.name} - Admin - SkyCart</title>
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/admin/products")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Edit Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                  />
                  {errors.stock && (
                    <p className="text-sm text-destructive">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] border rounded-md p-3 text-sm"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full border rounded-md p-2 text-sm"
                    {...register("category")}
                  >
                    <option value="">Select category</option>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-destructive">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seller">Seller</Label>
                  <Input id="seller" {...register("seller")} />
                  {errors.seller && (
                    <p className="text-sm text-destructive">
                      {errors.seller.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Image URLs (comma-separated)</Label>
                <Input id="images" {...register("images")} />
                {errors.images && (
                  <p className="text-sm text-destructive">
                    {errors.images.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/products")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
