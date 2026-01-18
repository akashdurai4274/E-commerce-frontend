import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { useAdminProducts, useDeleteProduct } from "@/hooks/useProducts";

export default function ProductList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAdminProducts(page, 10);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">Failed to load products</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Products - Admin - SkyCart</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Products
            </h1>
            <p className="text-muted-foreground">
              Manage your product inventory ({data?.total || 0} products)
            </p>
          </div>
          <Link to="/admin/product/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Product</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Stock</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.products.map((product) => (
                    <tr key={product.id} className="border-b last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]?.image || "/placeholder.png"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {product.id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            product.stock > 0 ? "default" : "destructive"
                          }
                        >
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {product.category}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/product/${product.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.pages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {data.pages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === data.pages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
