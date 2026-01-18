import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found - SkyCart</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center px-4">
        <h1 className="text-9xl font-bold text-muted-foreground/30">404</h1>
        <h2 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/">
            <Button size="lg">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="outline" size="lg">
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </>
  );
}
