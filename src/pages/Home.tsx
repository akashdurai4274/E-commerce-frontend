import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Smartphone,
  Laptop,
  Shirt,
  Home as HomeIcon,
  Dumbbell,
  BookOpen,
  Sparkles,
  ChevronRight,
  Zap,
  Gift,
  Timer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { PRODUCT_CATEGORIES } from "@/types";

const categoryIcons: Record<string, React.ElementType> = {
  Electronics: Zap,
  "Mobile Phones": Smartphone,
  Laptops: Laptop,
  Accessories: Gift,
  Headphones: Headphones,
  "Clothes/Shoes": Shirt,
  "Beauty/Health": Sparkles,
  Sports: Dumbbell,
  Books: BookOpen,
  Home: HomeIcon,
};

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $100",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support team",
  },
];

const bannerSlides = [
  {
    title: "New Season Arrivals",
    subtitle: "Check out all the new trends",
    discount: "Up to 50% Off",
    cta: "Shop Now",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
    bg: "from-blue-600 to-purple-600",
  },
  {
    title: "Electronics Sale",
    subtitle: "Latest gadgets at best prices",
    discount: "Save Big",
    cta: "Explore",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200",
    bg: "from-orange-500 to-red-600",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 mb-12">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
      <div className="relative grid lg:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <Badge className="w-fit mb-4 bg-primary/20 text-primary hover:bg-primary/30">
            <Sparkles className="h-3 w-3 mr-1" />
            New Collection 2024
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Discover Your
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              {" "}
              Style
            </span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-md">
            Explore our curated collection of premium products. Quality meets
            affordability.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/search">
              <Button size="lg" className="text-base">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/search?category=Electronics">
              <Button
                size="lg"
                variant="outline"
                className="text-base border-slate-600 text-white hover:bg-slate-800"
              >
                View Deals
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            <div>
              <p className="text-3xl font-bold text-white">200+</p>
              <p className="text-sm text-slate-400">Brands</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">2000+</p>
              <p className="text-sm text-slate-400">Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">30k+</p>
              <p className="text-sm text-slate-400">Customers</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"
              alt="Shopping"
              className="relative rounded-2xl shadow-2xl w-full max-w-md object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-shrink-0 p-3 rounded-full bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </section>
  );
}

function CategoriesSection() {
  const categories = PRODUCT_CATEGORIES.slice(0, 8);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground">Find what you're looking for</p>
        </div>
        <Link to="/search">
          <Button variant="ghost">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category] || Sparkles;
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link to={`/search?category=${encodeURIComponent(category)}`}>
                <Card className="group cursor-pointer border-0 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all">
                  <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-medium line-clamp-2">
                      {category}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function DealsSection() {
  return (
    <section className="mb-12">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Deal Card 1 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-r from-orange-500 to-red-500">
            <CardContent className="p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="h-5 w-5" />
                <span className="text-sm font-medium">Limited Time Offer</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Flash Sale!
              </h3>
              <p className="text-white/80 mb-4">
                Up to 70% off on selected items
              </p>
              <Link to="/search">
                <Button
                  variant="secondary"
                  className="bg-white text-orange-600 hover:bg-white/90"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Deal Card 2 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-r from-violet-600 to-purple-600">
            <CardContent className="p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5" />
                <span className="text-sm font-medium">Special Offer</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Free Shipping
              </h3>
              <p className="text-white/80 mb-4">On all orders over $100</p>
              <Link to="/search">
                <Button
                  variant="secondary"
                  className="bg-white text-violet-600 hover:bg-white/90"
                >
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function ProductsSection({
  title,
  subtitle,
  category,
}: {
  title: string;
  subtitle?: string;
  category?: string;
}) {
  const { data, isLoading } = useProducts({
    category,
    limit: 8,
  });

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        <Link
          to={
            category
              ? `/search?category=${encodeURIComponent(category)}`
              : "/search"
          }
        >
          <Button variant="ghost">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : data?.products
              .slice(0, 8)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="mb-12">
      <Card className="border-0 bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden">
        <CardContent className="p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-slate-300 mb-6">
              Get the latest updates on new products and upcoming sales
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 bg-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="lg" className="px-8">
                Subscribe
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Helmet>
        <title>SkyCart - Premium Online Shopping</title>
        <meta
          name="description"
          content="Discover amazing products at great prices. Shop electronics, fashion, and more at SkyCart."
        />
      </Helmet>

      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <ProductsSection
        title="Featured Products"
        subtitle="Handpicked products just for you"
      />
      <DealsSection />
      <ProductsSection
        title="Electronics"
        subtitle="Latest gadgets and devices"
        category="Electronics"
      />
      <ProductsSection
        title="Fashion"
        subtitle="Trending styles and accessories"
        category="Clothes/Shoes"
      />
      <NewsletterSection />
    </>
  );
}
