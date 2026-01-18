import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth, useIsAdmin } from "@/store/hooks";
import { useCurrentUser } from "@/hooks/useAuth";
import { PageLoader } from "@/components/ui/loader";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  adminOnly = false,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const isAdmin = useIsAdmin();
  const { isLoading: isLoadingUser } = useCurrentUser();

  // Show loader while checking auth
  if (loading || isLoadingUser) {
    return <PageLoader />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin route but user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
