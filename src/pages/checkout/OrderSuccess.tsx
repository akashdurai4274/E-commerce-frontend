import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Package,
  Home,
  Truck,
  Mail,
  ArrowRight,
  PartyPopper,
  Copy,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Confetti animation component
function Confetti() {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
  ];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    size: 8 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: `${piece.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: "100vh",
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.id % 2 === 0 ? "50%" : "0%",
          }}
        />
      ))}
    </div>
  );
}

const orderSteps = [
  {
    icon: CheckCircle,
    label: "Order Placed",
    description: "Your order has been confirmed",
    completed: true,
  },
  {
    icon: Package,
    label: "Processing",
    description: "We're preparing your order",
    completed: false,
    current: true,
  },
  {
    icon: Truck,
    label: "Shipped",
    description: "On the way to you",
    completed: false,
  },
  {
    icon: Home,
    label: "Delivered",
    description: "Package at your door",
    completed: false,
  },
];

export default function OrderSuccess() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate a mock order number
  const orderNumber = `Sky-${Date.now().toString(36).toUpperCase()}`;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>Order Successful - SkyCart</title>
      </Helmet>

      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      <div className="max-w-2xl mx-auto py-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
            className="relative inline-block mb-6"
          >
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-14 w-14 text-green-500" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <PartyPopper className="h-8 w-8 text-yellow-500" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-3"
          >
            Order Placed Successfully!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground max-w-md mx-auto"
          >
            Thank you for your purchase! We've received your order and will
            start processing it right away.
          </motion.p>
        </motion.div>

        {/* Order Number Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-6 border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Order Number
                  </p>
                  <p className="text-xl font-bold font-mono">{orderNumber}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyOrderNumber}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-6">Order Progress</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-muted" />
                <div className="absolute left-6 top-6 w-0.5 h-[calc(25%-12px)] bg-green-500" />

                {/* Steps */}
                <div className="space-y-6">
                  {orderSteps.map((step, index) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div
                        className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : step.current
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 pt-2">
                        <p
                          className={`font-medium ${
                            step.completed || step.current
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                      {step.completed && (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-2" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Email Notification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="mb-6 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">Confirmation Email Sent</p>
                  <p className="text-xs text-muted-foreground">
                    Check your inbox for order details and tracking info
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Separator className="my-8" />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/orders" className="flex-1">
            <Button size="lg" className="w-full h-12">
              <Package className="h-5 w-5 mr-2" />
              View My Orders
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button variant="outline" size="lg" className="w-full h-12">
              Continue Shopping
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Support Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Need help?{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Contact our support team
          </Link>
        </motion.p>
      </div>
    </>
  );
}
