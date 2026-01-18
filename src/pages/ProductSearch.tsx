import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Filter,
  X,
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  ChevronDown,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { PRODUCT_CATEGORIES } from "@/types";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: {
  filters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    minRating: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  const [priceRange, setPriceRange] = useState([
    filters.minPrice ? parseInt(filters.minPrice) : 0,
    filters.maxPrice ? parseInt(filters.maxPrice) : 1000,
  ]);

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => onFilterChange("category", "")}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
              !filters.category
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            All Categories
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange("category", cat)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                filters.category === cat
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              {cat}
              {filters.category === cat && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            min={0}
            max={1000}
            step={10}
            onValueChange={setPriceRange}
            onValueCommit={(value) => {
              onFilterChange("minPrice", value[0].toString());
              onFilterChange("maxPrice", value[1].toString());
            }}
            className="mb-4"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onFilterChange("minPrice", e.target.value)}
              className="h-9"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                onFilterChange(
                  "rating",
                  filters.minRating === rating.toString()
                    ? ""
                    : rating.toString(),
                )
              }
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                filters.minRating === rating.toString()
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= rating
                        ? filters.minRating === rating.toString()
                          ? "fill-primary-foreground text-primary-foreground"
                          : "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200",
                    )}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <>
          <Separator />
          <Button variant="outline" className="w-full" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );
}

export default function ProductSearch() {
  const { keyword: urlKeyword } = useParams<{ keyword?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState({
    keyword: urlKeyword || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "newest",
    page: parseInt(searchParams.get("page") || "1"),
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, keyword: urlKeyword || "" }));
  }, [urlKeyword]);

  const { data, isLoading } = useProducts({
    keyword: filters.keyword || undefined,
    category: filters.category || undefined,
    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
    minRating: filters.minRating ? parseFloat(filters.minRating) : undefined,
    page: filters.page,
    limit: 12,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setFilters({
      keyword: urlKeyword || "",
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sort: "newest",
      page: 1,
    });
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating;

  const activeFilterCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
  ].filter(Boolean).length;

  return (
    <>
      <Helmet>
        <title>
          {urlKeyword ? `Search: ${urlKeyword}` : "All Products"} - SkyCart
        </title>
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">
          {urlKeyword ? `Search: "${urlKeyword}"` : "All Products"}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {urlKeyword ? `Results for "${urlKeyword}"` : "All Products"}
          </h1>
          {data && (
            <p className="text-muted-foreground">{data.total} products found</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <Select
            value={filters.sort}
            onValueChange={(value) => handleFilterChange("sort", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="hidden md:flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              {filters.category}
              <button onClick={() => handleFilterChange("category", "")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <Badge variant="secondary" className="gap-1">
              ${filters.minPrice || "0"} - ${filters.maxPrice || "1000+"}
              <button
                onClick={() => {
                  handleFilterChange("minPrice", "");
                  handleFilterChange("maxPrice", "");
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.minRating && (
            <Badge variant="secondary" className="gap-1">
              {filters.minRating}+ Stars
              <button onClick={() => handleFilterChange("rating", "")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div
              className={cn(
                "grid gap-4 md:gap-6",
                viewMode === "grid"
                  ? "grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1",
              )}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : !data?.products.length ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Filter className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <motion.div
                className={cn(
                  "grid gap-4 md:gap-6",
                  viewMode === "grid"
                    ? "grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1",
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {data.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    disabled={filters.page === 1}
                    onClick={() => handlePageChange(filters.page - 1)}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: data.pages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === data.pages ||
                          Math.abs(page - filters.page) <= 1,
                      )
                      .map((page, idx, arr) => (
                        <div key={page} className="flex items-center">
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}
                          <Button
                            variant={
                              filters.page === page ? "default" : "outline"
                            }
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        </div>
                      ))}
                  </div>

                  <Button
                    variant="outline"
                    disabled={filters.page === data.pages}
                    onClick={() => handlePageChange(filters.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
