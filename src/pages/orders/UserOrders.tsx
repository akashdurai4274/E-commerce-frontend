import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Package, Eye, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { useMyOrders } from "@/hooks/useOrders";

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return "default";
    case "processing":
      return "secondary";
    case "shipped":
    case "out for delivery":
      return "outline";
    case "cancelled":
    case "refunded":
      return "destructive";
    default:
      return "secondary";
  }
}

export default function UserOrders() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useMyOrders(page, 10);

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
        <title>My Orders - SkyCart</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="h-6 w-6" />
          My Orders
        </h1>

        {!data?.orders.length ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't placed any orders yet.
              </p>
              <Link to="/search">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {data.orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <CardTitle className="text-base font-medium">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <Badge variant={getStatusVariant(order.order_status)}>
                        {order.order_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {order.created_at
                            ? format(new Date(order.created_at), "MMM d, yyyy")
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Items</p>
                        <p className="font-medium">
                          {order.order_items.length} items
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium">
                          ${order.total_price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {order.order_items.slice(0, 4).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                        />
                      ))}
                      {order.order_items.length > 4 && (
                        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0 text-sm">
                          +{order.order_items.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end mt-4">
                      <Link to={`/order/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {data.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === data.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
