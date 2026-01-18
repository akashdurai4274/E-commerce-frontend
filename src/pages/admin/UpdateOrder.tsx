import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Package, MapPin, CreditCard, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { useAdminOrder, useUpdateOrderStatus } from "@/hooks/useOrders";
import { ORDER_STATUSES } from "@/types";
import { useState } from "react";

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

export default function UpdateOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useAdminOrder(id!);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">Order not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/admin/orders")}
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  const handleUpdateStatus = () => {
    if (selectedStatus && selectedStatus !== order.order_status) {
      updateStatus({ orderId: order.id, status: selectedStatus });
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Order #{order.id.slice(-8).toUpperCase()} - Admin - SkyCart
        </title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/admin/orders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            {order.created_at && (
              <p className="text-muted-foreground">
                Placed on {format(new Date(order.created_at), "MMMM d, yyyy")}
              </p>
            )}
          </div>
          <Badge
            variant={getStatusVariant(order.order_status)}
            className="text-sm"
          >
            {order.order_status}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.order_items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product}`}
                        className="font-medium hover:text-primary line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.shipping_info.address}</p>
                <p>
                  {order.shipping_info.city}, {order.shipping_info.postal_code}
                </p>
                <p>{order.shipping_info.country}</p>
                <p className="mt-2">
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {order.shipping_info.phone_no}
                </p>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      order.payment_info?.status === "succeeded"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {order.payment_info?.status === "succeeded"
                      ? "Paid"
                      : "Pending"}
                  </Badge>
                  {order.paid_at && (
                    <span className="text-sm text-muted-foreground">
                      on {format(new Date(order.paid_at), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
                {order.payment_info?.id && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Payment ID: {order.payment_info.id}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Status Update */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items Total</span>
                  <span>${order.items_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {order.shipping_price === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${order.shipping_price.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax_price.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${order.total_price.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <select
                    id="status"
                    className="w-full border rounded-md p-2 text-sm"
                    defaultValue={order.order_status}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  className="w-full"
                  onClick={handleUpdateStatus}
                  disabled={
                    isPending ||
                    !selectedStatus ||
                    selectedStatus === order.order_status
                  }
                >
                  {isPending ? (
                    "Updating..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Status
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
