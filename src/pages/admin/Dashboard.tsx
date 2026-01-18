import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Box,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowRight,
  BarChart3,
  Star,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSalesStats } from "@/hooks/useOrders";
import { useAdminProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

// Simple bar chart component
function SimpleBarChart({
  data,
  className,
}: {
  data: { label: string; value: number; color: string }[];
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className={cn("flex items-end gap-2 h-32", className)}>
      {data.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ height: 0 }}
          animate={{ height: `${(item.value / max) * 100}%` }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="flex-1 relative group"
        >
          <div
            className={cn("w-full rounded-t-md transition-opacity", item.color)}
            style={{ height: "100%" }}
          />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
            {item.label}
          </div>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            ${item.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Order status indicator
function OrderStatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Processing: "bg-yellow-500",
    Shipped: "bg-blue-500",
    Delivered: "bg-green-500",
    Cancelled: "bg-red-500",
  };

  return (
    <span
      className={cn(
        "w-2 h-2 rounded-full inline-block",
        colors[status] || "bg-gray-500",
      )}
    />
  );
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: isLoadingStats } = useSalesStats();
  const { data: productsData, isLoading: isLoadingProducts } = useAdminProducts(
    1,
    5,
  );

  // Mock recent orders for display
  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      total: 299.99,
      status: "Processing",
      date: "2 mins ago",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      total: 149.5,
      status: "Shipped",
      date: "15 mins ago",
    },
    {
      id: "ORD-003",
      customer: "Bob Wilson",
      total: 89.0,
      status: "Delivered",
      date: "1 hour ago",
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      total: 450.0,
      status: "Processing",
      date: "2 hours ago",
    },
    {
      id: "ORD-005",
      customer: "Charlie Davis",
      total: 67.5,
      status: "Cancelled",
      date: "3 hours ago",
    },
  ];

  // Mock revenue data for chart
  const revenueData = [
    { label: "Mon", value: 1200, color: "bg-primary/60" },
    { label: "Tue", value: 1800, color: "bg-primary/70" },
    { label: "Wed", value: 1400, color: "bg-primary/60" },
    { label: "Thu", value: 2200, color: "bg-primary/80" },
    { label: "Fri", value: 1900, color: "bg-primary/70" },
    { label: "Sat", value: 2800, color: "bg-primary" },
    { label: "Sun", value: 2100, color: "bg-primary/80" },
  ];

  const statCards = [
    {
      title: "Total Revenue",
      value: stats?.total_sales?.toFixed(2) || "0.00",
      prefix: "$",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Total Orders",
      value: stats?.total_orders || 0,
      change: "+8.2%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Total Products",
      value: productsData?.total || 0,
      change: "+3.1%",
      changeType: "positive" as const,
      icon: Package,
      gradient: "from-purple-500 to-violet-600",
    },
    {
      title: "Avg Order Value",
      value: stats?.average_order_value?.toFixed(2) || "0.00",
      prefix: "$",
      change: "-2.4%",
      changeType: "negative" as const,
      icon: TrendingUp,
      gradient: "from-orange-500 to-amber-600",
    },
  ];

  const orderStatusCards = [
    {
      title: "Processing",
      value: stats?.processing_orders || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: "Delivered",
      value: stats?.delivered_orders || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Cancelled",
      value: stats?.cancelled_orders || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  const quickActions = [
    { label: "Manage Products", href: "/admin/products", icon: Package },
    { label: "Manage Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Manage Users", href: "/admin/users", icon: Users },
    { label: "Add Product", href: "/admin/product/new", icon: Box },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - SkyCart</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your store.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Link to="/admin/product/new">
              <Button size="sm">
                <Box className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Main Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoadingStats || isLoadingProducts
            ? Array.from({ length: 4 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))
            : statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold">
                            {stat.prefix}
                            {stat.value}
                          </p>
                          <div className="flex items-center gap-1 text-xs">
                            {stat.changeType === "positive" ? (
                              <>
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                <span className="text-green-600">
                                  {stat.change}
                                </span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-3 w-3 text-red-500" />
                                <span className="text-red-600">
                                  {stat.change}
                                </span>
                              </>
                            )}
                            <span className="text-muted-foreground">
                              vs last month
                            </span>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "p-3 rounded-xl bg-gradient-to-br text-white",
                            stat.gradient,
                          )}
                        >
                          <stat.icon className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        {/* Charts and Orders Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Weekly Revenue
                    </CardTitle>
                    <CardDescription>
                      Revenue trends for the past 7 days
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$13,400</p>
                    <p className="text-xs text-green-600 flex items-center justify-end gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +18.2% vs last week
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={revenueData} className="mt-4 mb-8" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Order Status
                </CardTitle>
                <CardDescription>Current order distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderStatusCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg",
                      stat.bgColor,
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon className={cn("h-5 w-5", stat.color)} />
                      <span className="font-medium">{stat.title}</span>
                    </div>
                    <span className={cn("text-xl font-bold", stat.color)}>
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </div>
                  <Link to="/admin/orders">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {order.customer.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {order.customer}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <OrderStatusDot status={order.status} />
                          {order.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>Best selling items</CardDescription>
                  </div>
                  <Link to="/admin/products">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productsData?.products.slice(0, 5).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {product.ratings.toFixed(1)}
                          </span>
                          <span>·</span>
                          <span>{product.num_of_reviews} reviews</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${product.price.toFixed(2)}
                        </p>
                        <Badge
                          variant={
                            product.stock > 0 ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used management actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={action.label} to={action.href}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary hover:bg-muted/50 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <action.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{action.label}</span>
                      <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
