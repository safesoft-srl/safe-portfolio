import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useEffect } from "react";

export const AdminRoute = () => {
  const { isAuthenticated, setUser, logout, user } = useAuthStore();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get("/api/auth/me");
      return response.data.data;
    },
    retry: false,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Cargando</p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin" && user.role !== "Super Admin") {
    return <Navigate to="/" replace />;
  } 

  return <Outlet />;
};
