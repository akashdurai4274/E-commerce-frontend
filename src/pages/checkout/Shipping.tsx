import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { countries } from "countries-list";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Building2,
  Globe,
  Hash,
  Home,
  Truck,
  Clock,
  Shield,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { useAppDispatch, useShippingInfo, useCartItems } from "@/store/hooks";
import { setShippingInfo } from "@/store/slices/cartSlice";
import { cn } from "@/lib/utils";

const shippingSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(1, "Country is required"),
  postal_code: z.string().min(3, "Postal code is required"),
  phone_no: z.string().min(10, "Phone number must be at least 10 digits"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const countryList = Object.entries(countries)
  .map(([code, country]) => ({
    code,
    name: country.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const shippingMethods = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "5-7 business days",
    price: 10,
    freeOver: 100,
    icon: Truck,
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "2-3 business days",
    price: 25,
    icon: Clock,
  },
];

export default function Shipping() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const shippingInfo = useShippingInfo();
  const cartItems = useCartItems();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingInfo || undefined,
  });

  const selectedCountry = watch("country");

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const onSubmit = (data: ShippingFormData) => {
    dispatch(setShippingInfo(data));
    navigate("/order/confirm");
  };

  return (
    <>
      <Helmet>
        <title>Shipping - SkyCart</title>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-primary">
          Cart
        </Link>
        <span>/</span>
        <span className="text-foreground">Shipping</span>
      </nav>

      <CheckoutProgress currentStep="shipping" />

      <div className="grid max-w-6xl gap-8 mx-auto lg:grid-cols-3">
        {/* Shipping Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Shipping Address
              </CardTitle>
              <CardDescription>
                Enter the address where you'd like your order delivered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street, Apt 4B"
                    className={cn(errors.address && "border-destructive")}
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* City & Postal Code */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      className={cn(errors.city && "border-destructive")}
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="postal_code"
                      className="flex items-center gap-2"
                    >
                      <Hash className="w-4 h-4 text-muted-foreground" />
                      Postal Code
                    </Label>
                    <Input
                      id="postal_code"
                      placeholder="10001"
                      className={cn(errors.postal_code && "border-destructive")}
                      {...register("postal_code")}
                    />
                    {errors.postal_code && (
                      <p className="text-sm text-destructive">
                        {errors.postal_code.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    Country
                  </Label>
                  <Select
                    value={selectedCountry}
                    onValueChange={(value) => setValue("country", value)}
                  >
                    <SelectTrigger
                      className={cn(errors.country && "border-destructive")}
                    >
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {countryList.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-destructive">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone_no" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone_no"
                    placeholder="+1 (555) 123-4567"
                    className={cn(errors.phone_no && "border-destructive")}
                    {...register("phone_no")}
                  />
                  {errors.phone_no && (
                    <p className="text-sm text-destructive">
                      {errors.phone_no.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    We'll only use this for delivery updates
                  </p>
                </div>

                <Separator />

                {/* Shipping Methods */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Shipping Method
                  </Label>
                  <div className="space-y-3">
                    {shippingMethods.map((method, index) => (
                      <motion.div
                        key={method.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "relative flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                          index === 0
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50",
                        )}
                      >
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            index === 0 ? "bg-primary/10" : "bg-muted",
                          )}
                        >
                          <method.icon
                            className={cn(
                              "h-5 w-5",
                              index === 0
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{method.name}</span>
                            {method.freeOver && subtotal >= method.freeOver && (
                              <span className="text-xs text-green-600 font-medium px-2 py-0.5 bg-green-100 rounded-full">
                                FREE
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                        <div className="text-right">
                          {method.freeOver && subtotal >= method.freeOver ? (
                            <>
                              <p className="font-semibold text-green-600">
                                Free
                              </p>
                              <p className="text-xs line-through text-muted-foreground">
                                ${method.price.toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="font-semibold">
                              ${method.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 right-2">
                            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-primary">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  Continue to Order Review
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Summary Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items Preview */}
              <div className="space-y-3 overflow-y-auto max-h-60">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex gap-3">
                    <div className="flex-shrink-0 overflow-hidden rounded-lg w-14 h-14 bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
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
                    Subtotal ({cartItems.length} items)
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={subtotal >= 100 ? "text-green-600" : ""}>
                    {subtotal >= 100 ? "FREE" : "$10.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span>${(subtotal * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Estimated Total</span>
                <span>
                  $
                  {(
                    subtotal +
                    (subtotal >= 100 ? 0 : 10) +
                    subtotal * 0.1
                  ).toFixed(2)}
                </span>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping on orders over $100</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
