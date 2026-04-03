import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function UserLayout({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, setUser, logout } = useAuthStore();

  const { data, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get("/api/auth/me");
      return response.data.data;
    },
    retry: false,
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
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {/* Breadcrumb items dinámicos irán aquí más adelante */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="mr-5">
            <ModeToggle />
          </div>
        </header>

        {/* FOR THE FRONTEND TEAM: Here goes the content of the page */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children || <Outlet />}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
