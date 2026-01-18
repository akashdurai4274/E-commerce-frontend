import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Package,
  Edit2,
  Truck,
  Shield,
  RotateCcw,
  Gift,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { useCartItems, useShippingInfo } from "@/store/hooks";
import { cn } from "@/lib/utils";

const guarantees = [
  {
    icon: Truck,
    title: "Free Returns",
    description: "30-day return policy",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "256-bit encryption",
  },
  {
    icon: RotateCcw,
    title: "Money Back",
    description: "100% guarantee",
  },
];

export default function ConfirmOrder() {
  const navigate = useNavigate();
  const cartItems = useCartItems();
  const shippingInfo = useShippingInfo();

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  if (!shippingInfo) {
    navigate("/shipping");
    return null;
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const taxPrice = subtotal * 0.1;
  const totalPrice = subtotal + shippingPrice + taxPrice;

  return (
    <>
      <Helmet>
        <title>Confirm Order - SkyCart</title>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-primary">
          Cart
        </Link>
        <span>/</span>
        <Link to="/shipping" className="hover:text-primary">
          Shipping
        </Link>
        <span>/</span>
        <span className="text-foreground">Confirm Order</span>
      </nav>

      <CheckoutProgress currentStep="confirm" />

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Shipping Info Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping Address
                </CardTitle>
                <Link to="/shipping">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium">{shippingInfo.address}</p>
                <p className="text-muted-foreground">
                  {shippingInfo.city}, {shippingInfo.postal_code}
                </p>
                <p className="text-muted-foreground">{shippingInfo.country}</p>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Phone: </span>
                    {shippingInfo.phone_no}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order Items
                  <Badge variant="secondary" className="ml-2">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </Badge>
                </CardTitle>
                <Link to="/cart">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg",
                    index % 2 === 0 ? "bg-muted/30" : "",
                  )}
                >
                  <Link to={`/product/${item.product}`}>
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product}`}
                      className="font-medium hover:text-primary line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </span>
                      <span className="text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4">
            {guarantees.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-4 rounded-lg border bg-card text-center"
              >
                <item.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order Summary Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Items ({totalItems})
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  {shippingPrice === 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs line-through text-muted-foreground">
                        $10.00
                      </span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                  ) : (
                    <span>${shippingPrice.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code Applied */}
              {shippingPrice === 0 && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-400">
                      Free shipping applied!
                    </span>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  className="w-full h-12 text-base"
                  size="lg"
                  onClick={() => navigate("/payment")}
                >
                  Proceed to Payment
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/shipping")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Shipping
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure checkout</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
