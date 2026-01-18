import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Components
import { Loader } from "@/components/ui/loader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Lazy load pages for code splitting
const Home = lazy(() => import("@/pages/Home"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const ProductSearch = lazy(() => import("@/pages/ProductSearch"));
const Cart = lazy(() => import("@/pages/Cart"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const Profile = lazy(() => import("@/pages/user/Profile"));
const UpdateProfile = lazy(() => import("@/pages/user/UpdateProfile"));
const UpdatePassword = lazy(() => import("@/pages/user/UpdatePassword"));
const Shipping = lazy(() => import("@/pages/checkout/Shipping"));
const ConfirmOrder = lazy(() => import("@/pages/checkout/ConfirmOrder"));
const Payment = lazy(() => import("@/pages/checkout/Payment"));
const OrderSuccess = lazy(() => import("@/pages/checkout/OrderSuccess"));
const UserOrders = lazy(() => import("@/pages/orders/UserOrders"));
const OrderDetail = lazy(() => import("@/pages/orders/OrderDetail"));

// Admin pages
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const ProductList = lazy(() => import("@/pages/admin/ProductList"));
const NewProduct = lazy(() => import("@/pages/admin/NewProduct"));
const UpdateProduct = lazy(() => import("@/pages/admin/UpdateProduct"));
const OrderList = lazy(() => import("@/pages/admin/OrderList"));
const UpdateOrder = lazy(() => import("@/pages/admin/UpdateOrder"));
const UserList = lazy(() => import("@/pages/admin/UserList"));
const UpdateUser = lazy(() => import("@/pages/admin/UpdateUser"));
const ReviewList = lazy(() => import("@/pages/admin/ReviewList"));

const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader size="lg" />
        </div>
      }
    >
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="search" element={<ProductSearch />} />
          <Route path="search/:keyword" element={<ProductSearch />} />
          <Route path="cart" element={<Cart />} />

          {/* Auth routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="password/forgot" element={<ForgotPassword />} />
          <Route path="password/reset/:token" element={<ResetPassword />} />

          {/* Protected user routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="profile/update" element={<UpdateProfile />} />
            <Route path="password/update" element={<UpdatePassword />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="order/confirm" element={<ConfirmOrder />} />
            <Route path="payment" element={<Payment />} />
            <Route path="order/success" element={<OrderSuccess />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="order/:id" element={<OrderDetail />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="product/new" element={<NewProduct />} />
            <Route path="product/:id" element={<UpdateProduct />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="order/:id" element={<UpdateOrder />} />
            <Route path="users" element={<UserList />} />
            <Route path="user/:id" element={<UpdateUser />} />
            <Route path="reviews" element={<ReviewList />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
