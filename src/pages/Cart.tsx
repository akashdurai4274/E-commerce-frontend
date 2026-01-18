import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Truck,
  Shield,
  Tag,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  useCartItems,
  useAppDispatch,
  useIsAuthenticated,
} from "@/store/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/store/slices/cartSlice";
import { cn } from "@/lib/utils";

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-6">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Looks like you haven't added anything to your cart yet. Start shopping
        to find amazing products!
      </p>
      <Link to="/search">
        <Button size="lg">
          Start Shopping
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
}

function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: {
    product: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    quantity: number;
  };
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 p-4 rounded-xl border bg-card"
    >
      <Link to={`/product/${item.product}`} className="flex-shrink-0">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/product/${item.product}`}
            className="font-semibold hover:text-primary line-clamp-2 text-sm md:text-base"
          >
            {item.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
            onClick={() => onRemove(item.product)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-lg font-bold text-primary mt-1">
          ${item.price.toFixed(2)}
        </p>

        {item.stock <= 5 && item.stock > 0 && (
          <Badge variant="secondary" className="w-fit mt-1 text-xs">
            Only {item.stock} left
          </Badge>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onQuantityChange(item.product, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onQuantityChange(item.product, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-lg font-bold">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useCartItems();
  const isAuthenticated = useIsAuthenticated();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const taxPrice = subtotal * 0.1;
  const totalPrice = subtotal + shippingPrice + taxPrice;
  const savingsThreshold = 100 - subtotal;

  const handleQuantityChange = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/shipping");
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Cart - SkyCart</title>
        </Helmet>
        <EmptyCart />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cart ({totalItems}) - SkyCart</title>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">Shopping Cart</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              Shopping Cart
              <span className="text-muted-foreground font-normal text-lg ml-2">
                ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => dispatch(clearCart())}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.product}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </AnimatePresence>

          {/* Continue Shopping */}
          <Link to="/search">
            <Button variant="ghost" className="mt-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <Card className="sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Free Shipping Progress */}
              {savingsThreshold > 0 && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>
                      Add <strong>${savingsThreshold.toFixed(2)}</strong> more
                      for{" "}
                      <span className="text-primary font-semibold">
                        FREE shipping!
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((subtotal / 100) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Promo Code */}
              <div className="flex gap-2">
                <Input placeholder="Promo code" className="flex-1" />
                <Button variant="outline">Apply</Button>
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={cn(shippingPrice === 0 && "text-green-600")}>
                    {shippingPrice === 0
                      ? "FREE"
                      : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span>Best Price</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button
                className="w-full h-12 text-base"
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              {/* Payment Methods */}
              <div className="flex items-center justify-center gap-2 w-full">
                <img
                  src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/color/btc.svg"
                  alt="Bitcoin"
                  className="h-6 w-6 opacity-50"
                />
                <div className="h-6 w-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-[8px] font-bold flex items-center justify-center">
                  VISA
                </div>
                <div className="h-6 w-10 bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 rounded text-white text-[8px] font-bold flex items-center justify-center">
                  MC
                </div>
                <div className="h-6 w-10 bg-blue-500 rounded text-white text-[6px] font-bold flex items-center justify-center">
                  AMEX
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
