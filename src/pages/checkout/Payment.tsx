import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  ArrowLeft,
  MapPin,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { useCartItems, useShippingInfo } from "@/store/hooks";
import { useStripeKey, useCreatePaymentIntent } from "@/hooks/usePayment";
import { useCreateOrder } from "@/hooks/useOrders";
import { cn } from "@/lib/utils";

const paymentMethods = [
  {
    id: "card",
    name: "Credit / Debit Card",
    description: "Pay securely with your card",
    icon: CreditCard,
    logos: ["visa", "mastercard", "amex"],
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    description: "Apple Pay, Google Pay",
    icon: Wallet,
    disabled: true,
    comingSoon: true,
  },
];

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [cardComplete, setCardComplete] = useState(false);

  const cartItems = useCartItems();
  const shippingInfo = useShippingInfo();
  const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();
  const { mutate: createOrder } = useCreateOrder();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { client_secret, payment_intent_id } = await createPaymentIntent({
        amount: Math.round(totalPrice * 100),
      });

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent.status === "succeeded") {
        createOrder({
          shipping_info: shippingInfo,
          order_items: cartItems.map((item) => ({
            product: item.product,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          items_price: subtotal,
          tax_price: taxPrice,
          shipping_price: shippingPrice,
          payment_info: {
            id: payment_intent_id,
            status: "succeeded",
          },
        });
      }
    } catch (err) {
      setError("An error occurred while processing your payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Method
              </CardTitle>
              <CardDescription>
                Select your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() =>
                    !method.disabled && setSelectedMethod(method.id)
                  }
                  className={cn(
                    "relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all",
                    method.disabled
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer",
                    selectedMethod === method.id && !method.disabled
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      selectedMethod === method.id
                        ? "bg-primary/10"
                        : "bg-muted",
                    )}
                  >
                    <method.icon
                      className={cn(
                        "h-5 w-5",
                        selectedMethod === method.id
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{method.name}</span>
                      {method.comingSoon && (
                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                  {method.logos && (
                    <div className="flex items-center gap-2">
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
                  )}
                  {selectedMethod === method.id && !method.disabled && (
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card Details */}
          {selectedMethod === "card" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Card Details</CardTitle>
                  <CardDescription>
                    Enter your card information securely
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Card Information</Label>
                    <div
                      className={cn(
                        "p-4 border rounded-lg bg-background transition-colors",
                        cardComplete && "border-green-500",
                        error && "border-destructive",
                      )}
                    >
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "hsl(var(--foreground))",
                              "::placeholder": {
                                color: "hsl(var(--muted-foreground))",
                              },
                            },
                            invalid: {
                              color: "hsl(var(--destructive))",
                            },
                          },
                        }}
                        onChange={(e) => setCardComplete(e.complete)}
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-destructive/10 border border-destructive rounded-lg"
                    >
                      <p className="text-sm text-destructive">{error}</p>
                    </motion.div>
                  )}

                  {/* Security Info */}
                  <div className="flex items-center justify-center gap-6 py-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Lock className="h-4 w-4" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>PCI Compliant</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Billing Address */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Billing Address
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  Same as shipping
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-muted/50 text-sm">
                <p className="font-medium">{shippingInfo.address}</p>
                <p className="text-muted-foreground">
                  {shippingInfo.city}, {shippingInfo.postal_code}
                </p>
                <p className="text-muted-foreground">{shippingInfo.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Back Button (Mobile) */}
          <div className="lg:hidden">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/order/confirm")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Order Review
            </Button>
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
              {/* Cart Items Preview */}
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Items ({totalItems})
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shippingPrice === 0 ? "text-green-600" : ""}>
                    {shippingPrice === 0
                      ? "FREE"
                      : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  size="lg"
                  disabled={!stripe || isProcessing || !cardComplete}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader size="sm" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Pay ${totalPrice.toFixed(2)}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full hidden lg:flex"
                  onClick={() => navigate("/order/confirm")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 text-center text-xs text-muted-foreground">
                <p className="flex items-center justify-center gap-1">
                  <Lock className="h-3 w-3" />
                  Your payment is secure and encrypted
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </form>
  );
}

export default function Payment() {
  const navigate = useNavigate();
  const cartItems = useCartItems();
  const shippingInfo = useShippingInfo();
  const { data: stripeKey, isLoading: isLoadingKey } = useStripeKey();
  const [stripePromise, setStripePromise] = useState<ReturnType<
    typeof loadStripe
  > | null>(null);

  useEffect(() => {
    if (stripeKey) {
      setStripePromise(loadStripe(stripeKey));
    }
  }, [stripeKey]);

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  if (!shippingInfo) {
    navigate("/shipping");
    return null;
  }

  if (isLoadingKey || !stripePromise) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader size="lg" />
        <p className="mt-4 text-muted-foreground">Loading payment...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment - SkyCart</title>
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
        <Link to="/order/confirm" className="hover:text-primary">
          Confirm
        </Link>
        <span>/</span>
        <span className="text-foreground">Payment</span>
      </nav>

      <CheckoutProgress currentStep="payment" />

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </>
  );
}
