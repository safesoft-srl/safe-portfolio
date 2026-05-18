import { useQuery } from "@tanstack/react-query";
import { getAcademics } from "../services/academic.service";
import { usePortfolioId } from "@/hooks/usePortfolio";

export function useAcademic() {
  const portfolioId = usePortfolioId();

  const academicsQuery = useQuery({
    queryKey: ["academics", portfolioId],
    queryFn: () => getAcademics(portfolioId as number),
    enabled: Boolean(portfolioId),
  });

  return {
    academics: academicsQuery.data ?? [],
    isFetching: academicsQuery.isFetching,
    portfolioId,
    refetchAcademics: academicsQuery.refetch,
  };
}
