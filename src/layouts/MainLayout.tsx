import { Outlet, useLocation } from "react-router-dom";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MainLayout() {
  const location = useLocation();

  const hideLocation =
    location.pathname.includes("/login") ||
    location.pathname.includes("/register");

  return (
    <div className="flex flex-col min-h-screen font-mono">
      {!hideLocation && <Header />}
      <main className="container flex-1 py-8">
        <Outlet />
      </main>
      {!hideLocation && <Footer />}
    </div>
  );
}
