import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";

export const GuestRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated) {
    if (user?.role === "admin" || user?.role === "Super Admin") {
      return <Navigate to="/admin" replace />;
    }
    // Redirect to home/dashboard if they are already authenticated
    return <Navigate to="/portfolios" replace />;
  }

  return <Outlet />;
};
