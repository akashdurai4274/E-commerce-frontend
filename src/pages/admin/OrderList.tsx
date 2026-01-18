import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Eye, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { useAdminOrders } from "@/hooks/useOrders";

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "default";
    case "processing":
      return "secondary";
    case "shipped":
    case "out for delivery":
    case "confirmed":
      return "outline";
    case "cancelled":
    case "refunded":
      return "destructive";
    default:
      return "secondary";
  }
}

export default function OrderList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAdminOrders(page, 10);

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
        <p className="text-destructive">Failed to load orders</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Orders - Admin - SkyCart</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Orders
          </h1>
          <p className="text-muted-foreground">
            Manage customer orders ({data?.total || 0} total)
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Order ID</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Items</th>
                    <th className="text-left p-4 font-medium">Total</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="p-4">
                        <p className="font-mono text-sm">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {order.created_at
                          ? format(new Date(order.created_at), "MMM d, yyyy")
                          : "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {order.order_items.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image}
                              alt=""
                              className="w-8 h-8 object-cover rounded"
                            />
                          ))}
                          {order.order_items.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{order.order_items.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                        ${order.total_price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusVariant(order.order_status)}>
                          {order.order_status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end">
                          <Link to={`/admin/order/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
