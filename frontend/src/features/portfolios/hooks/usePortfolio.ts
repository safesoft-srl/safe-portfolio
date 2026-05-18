import { useQuery } from "@tanstack/react-query";
import { getPortfolios } from "@/services/profile.service";
import { useAuthStore } from "@/lib/auth-store";
import type { Portfolio } from "../types/portfolios.type";

export function usePortfolio() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: portfolios = [], isLoading } = useQuery({
    queryKey: ["portfolios"],
    queryFn: getPortfolios,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: isAuthenticated,
  });

  return {
    portfolios,
    isLoading,
    addPortfolio: (portfolio: Portfolio) => portfolio,
  };
}
