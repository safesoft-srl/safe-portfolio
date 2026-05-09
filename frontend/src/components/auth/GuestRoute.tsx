import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";

export const GuestRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    // Redirect to home/dashboard if they are already authenticated
    return <Navigate to="/portfolios" replace />;
  }

  return <Outlet />;
};
