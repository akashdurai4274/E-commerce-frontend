import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateProduct } from "@/hooks/useProducts";
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

export default function NewProduct() {
  const navigate = useNavigate();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: 0,
      stock: 0,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const productData = {
      ...data,
      images: data.images.split(",").map((url) => ({ image: url.trim() })),
    };
    createProduct(productData, {
      onSuccess: () => navigate("/admin/products"),
    });
  };

  return (
    <>
      <Helmet>
        <title>New Product - Admin - SkyCart</title>
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
              Add New Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  {...register("name")}
                />
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
                  placeholder="Enter product description"
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
                  <Input
                    id="seller"
                    placeholder="Seller name"
                    {...register("seller")}
                  />
                  {errors.seller && (
                    <p className="text-sm text-destructive">
                      {errors.seller.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Image URLs (comma-separated)</Label>
                <Input
                  id="images"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  {...register("images")}
                />
                {errors.images && (
                  <p className="text-sm text-destructive">
                    {errors.images.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter multiple image URLs separated by commas
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Product
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
