import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // Redirect to login if they are not authenticated
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
